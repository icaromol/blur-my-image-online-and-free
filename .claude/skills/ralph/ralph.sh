#!/bin/bash
# Ralph runner: one fresh Claude session per story (model from prd.json, default sonnet).
# Independent stories (dependsOn all passed) run in parallel, each in its own git worktree and branch;
# finished stories are rebased and fast-forwarded onto the run branch one at a time.
# State lives in scripts/ralph/state.json (written only by this script). prd.json is the read-only spec.
#
# Usage: scripts/ralph/ralph.sh [--parallel N] [--max-attempts N]
# Exit codes: 0 all stories passed · 1 stories failed or blocked · 2 usage/preflight · 3 usage limit
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(git -C "$DIR" rev-parse --show-toplevel)"
PRD="$DIR/prd.json"; STATE="$DIR/state.json"; LOGS="$DIR/logs"; RULES="$DIR/rules.md"
die() { echo "ralph: $1" >&2; exit "${2:-1}"; }

PAR_ARG=""; MAX_ATTEMPTS=2
while [ $# -gt 0 ]; do
  case "$1" in
    --parallel) PAR_ARG="${2:?}"; shift 2 ;;
    --max-attempts) MAX_ATTEMPTS="${2:?}"; shift 2 ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    *) die "unknown argument: $1" 2 ;;
  esac
done

command -v jq >/dev/null || die "jq not found" 2
command -v claude >/dev/null || die "claude not found" 2
[ -f "$PRD" ] || die "missing $PRD" 2
[ -f "$RULES" ] || die "missing $RULES" 2
cd "$ROOT"

BRANCH=$(jq -r '.branchName // empty' "$PRD")
[[ "$BRANCH" == ralph/* ]] || die "branchName must start with ralph/" 2
MODEL=$(jq -r '.model // "sonnet"' "$PRD")
PAR=${PAR_ARG:-$(jq -r '.parallel // 3' "$PRD")}
FORBID=$(jq -r '.forbidInCommits // "co-authored-by|claude|anthropic|generated with"' "$PRD")
RUN=${BRANCH#ralph/}
WT="$(dirname "$ROOT")/.ralph-wt/$(basename "$ROOT")-$RUN"

jq -e '[.userStories[] | .id | test("^[A-Za-z0-9._-]+$")] | all' "$PRD" >/dev/null || die "story ids must match [A-Za-z0-9._-]+" 2
jq -e '[.userStories[].id] as $ids | [.userStories[] | .dependsOn[]? | select(IN($ids[]) | not)] | length == 0' "$PRD" >/dev/null || die "dependsOn names an unknown story" 2
while read -r f; do [ -f "$DIR/$f" ] || die "missing prompt file $DIR/$f" 2; done < <(jq -r '.userStories[].promptFile' "$PRD")

# The runner and its folder stay local: never committed, not part of the project.
EXCLUDE="$(git rev-parse --git-path info/exclude)"
grep -qxF 'scripts/ralph/' "$EXCLUDE" 2>/dev/null || echo 'scripts/ralph/' >> "$EXCLUDE"
[ -z "$(git status --porcelain)" ] || die "working tree has uncommitted changes:"$'\n'"$(git status --porcelain)" 2

if [ "$(git branch --show-current)" != "$BRANCH" ]; then
  if git show-ref --verify --quiet "refs/heads/$BRANCH"; then git switch -q "$BRANCH"; else git switch -q -c "$BRANCH"; fi
fi
mkdir -p "$LOGS" "$WT"
[ -f "$STATE" ] || jq '[.userStories[] | {key: .id, value: {status: "pending", attempts: 0, note: ""}}] | from_entries' "$PRD" > "$STATE"

# Per-run settings: the repo-specific allowlist from prd.json on top of the fixed deny list.
SETTINGS="$LOGS/settings.json"
jq --slurpfile p "$PRD" '.permissions.allow += ($p[0].allowBash // [])' "$DIR/settings.base.json" > "$SETTINGS"

feed() {
  jq -Rrj --unbuffered 'fromjson? |
    if .type == "assistant" then
      (.message.content[]? |
        if .type == "text" then "  > " + .text + "\n"
        elif .type == "tool_use" then "  - " + .name + " " + ((.input.file_path // .input.command // .input.pattern // .input.path // "") | tostring | .[0:200]) + "\n"
        else empty end)
    elif .type == "result" then "  = " + (.subtype // "done") + " in " + ((.duration_ms // 0) / 1000 | floor | tostring) + "s\n"
    else empty end'
}
spec() { jq -c --arg i "$1" '.userStories[] | select(.id == $i)' "$PRD"; }
setst() { local t; t=$(mktemp); jq --arg i "$1" --arg s "$2" --arg n "${3:-}" '.[$i].status = $s | .[$i].note = $n' "$STATE" > "$t" && mv "$t" "$STATE"; }
attempt() { local t; t=$(mktemp); jq --arg i "$1" '.[$i].attempts += 1' "$STATE" > "$t" && mv "$t" "$STATE"; }
ready() {
  jq -r --slurpfile st "$STATE" --argjson max "$MAX_ATTEMPTS" '
    $st[0] as $s | [.userStories[]
      | select($s[.id].status == "pending" and $s[.id].attempts < $max
               and ([.dependsOn[]? | $s[.].status == "passed"] | all))]
    | sort_by(.priority) | .[].id' "$PRD"
}
count() { jq --arg s "$1" '[.[] | select(.status == $s)] | length' "$STATE"; }

# Runs in a background subshell: one session, then the mechanical checks. Writes logs/<id>.result.
run_story() {
  local id=$1 start=$2 wt="$WT/$1" log="$LOGS/$1-$(date +%H%M%S)"
  local sp allowed verify prompt status out outside
  sp=$(spec "$id")
  allowed=$(jq -r '[.paths[]?] | join("|")' <<<"$sp"); verify=$(jq -r '.verify // empty' <<<"$sp")
  finish() { echo "$1" > "$LOGS/$id.result"; exit 0; }
  prompt="$(cat "$RULES")"$'\n\n---\n\n'"$(cat "$DIR/$(jq -r .promptFile <<<"$sp")")"

  set +e
  ( cd "$wt" && claude -p "$prompt" --model "$MODEL" --settings "$SETTINGS" --permission-mode acceptEdits \
      --output-format stream-json --verbose 2>&1 ) | tee "$log.jsonl" | feed > "$log.log"
  status=${PIPESTATUS[0]}
  set -e
  out=$(cat "$log.jsonl")
  if [ "$status" -ne 0 ]; then
    grep -qiE 'usage limit|session limit|hit your [a-z ]*limit|limit (will )?resets?|resets [0-9]' <<<"$out" && finish "limit"
    finish "fail: claude exited with $status"
  fi
  if grep -q '<promise>BLOCKED</promise>' <<<"$out"; then
    finish "blocked: $(jq -rs '[.[] | select(.type == "result") | .result] | last // ""' "$log.jsonl" | tr '\n' ' ' | cut -c1-300)"
  fi
  [ -z "$(git -C "$wt" status --porcelain)" ] || finish "fail: uncommitted changes"
  [ "$(git -C "$wt" rev-list --count "$start..HEAD")" -gt 0 ] || finish "fail: no commit"
  if [ -n "$allowed" ]; then
    outside=$(git -C "$wt" diff --name-only "$start" HEAD | grep -vE "^($allowed)" || true)
    [ -z "$outside" ] || finish "fail: touched files outside paths: $(tr '\n' ' ' <<<"$outside")"
  fi
  if git -C "$wt" log --format=%B "$start..HEAD" | grep -qiE "$FORBID"; then finish "fail: commit message matches the forbidden pattern"; fi
  if [ -n "$verify" ]; then
    ( cd "$wt" && bash -c "$verify" ) > "$log.verify" 2>&1 || finish "fail: verify failed (see ${log#"$ROOT"/}.verify)"
  fi
  finish "ok"
}

echo "ralph: branch $BRANCH, model $MODEL, up to $PAR in parallel, $(count pending) pending stories"
limit=0
while :; do
  mapfile -t batch < <(ready | head -n "$PAR")
  [ "${#batch[@]}" -gt 0 ] || break
  echo "ralph: wave: ${batch[*]}"
  start=$(git rev-parse HEAD)
  pids=()
  for id in "${batch[@]}"; do
    wt="$WT/$id"
    git worktree remove --force "$wt" 2>/dev/null || true
    git worktree prune
    git branch -D "ralph-wt/$RUN/$id" >/dev/null 2>&1 || true
    git worktree add -q -B "ralph-wt/$RUN/$id" "$wt" "$BRANCH"
    while read -r f; do [ -e "$f" ] && { mkdir -p "$wt/$(dirname "$f")"; cp -a "$f" "$wt/$f"; }; done < <(jq -r '.copy[]?' "$PRD")
    : > "${LOGS:?}/${id:?}.result"; attempt "$id"
    ( run_story "$id" "$start" ) &
    pids+=($!)
  done
  for p in "${pids[@]}"; do wait "$p" || true; done

  for id in "${batch[@]}"; do   # integrate one at a time, in priority order
    res=$(cat "$LOGS/$id.result" 2>/dev/null || true); [ -n "$res" ] || res="fail: no result"
    wt="$WT/$id"; br="ralph-wt/$RUN/$id"
    case "$res" in
      ok)
        if git -C "$wt" rebase -q "$BRANCH" >/dev/null 2>&1; then
          git merge -q --ff-only "$br"
          setst "$id" passed "$(git rev-parse --short HEAD)"
          git worktree remove --force "$wt"; git branch -q -D "$br"
          echo "ralph: $id passed"
        else
          git -C "$wt" rebase --abort >/dev/null 2>&1 || true
          setst "$id" pending "rebase conflict with an earlier story"; echo "ralph: $id conflicts with an earlier story, will retry on the new head"
        fi ;;
      limit) limit=1; setst "$id" pending "usage limit"; echo "ralph: $id hit the usage limit" ;;
      blocked*) setst "$id" blocked "${res#blocked: }"; echo "ralph: $id BLOCKED" ;;
      *) setst "$id" pending "${res#fail: }"; echo "ralph: $id ${res}" ;;
    esac
  done
  [ "$limit" -eq 0 ] || die "Claude usage limit reached; rerun later" 3
done

t=$(mktemp); jq --argjson max "$MAX_ATTEMPTS" 'map_values(if .status == "pending" and .attempts >= $max then .status = "failed" else . end)' "$STATE" > "$t" && mv "$t" "$STATE"
echo; echo "ralph: passed $(count passed) · failed $(count failed) · blocked $(count blocked) · not started $(count pending)"
jq -r 'to_entries[] | select(.value.status != "passed") | "  \(.key): \(.value.status) - \(.value.note)"' "$STATE"
if [ "$(count passed)" -eq "$(jq length "$STATE")" ]; then
  final=$(jq -r '.finalVerify // empty' "$PRD")
  if [ -n "$final" ]; then bash -c "$final" || die "finalVerify failed on $BRANCH"; fi
  echo "ralph: all stories pass on $BRANCH (git log --oneline --reverse $BRANCH)"
  exit 0
fi
exit 1
