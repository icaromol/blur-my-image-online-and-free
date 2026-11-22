---
name: review-cycle
description: Runs a full code-review cycle over every commit of a repository in three stages -- one Opus agent analyses each commit, one Opus agent consolidates the analyses into a prioritised review with a fix plan, and one Sonnet agent executes the safe fixes (branch, commits, push, PR, merge). Use when the user runs /review-cycle or asks for a complete code review of all commits followed by fixing, pushing and merging.
---

# /review-cycle

Three stages, three kinds of agent. The orchestrator (you) only sequences them and keeps the context small: agents write
their results to files and return a one-line summary.

```
1. ANALYSE   one Opus agent per commit (parallel)   -> docs/reviews/<date>-ciclo/analises/<sha7>.md
2. SUGGEST   one Opus agent for the whole set        -> docs/reviews/<date>-ciclo/REVIEW.md  (with the fix plan)
3. EXECUTE   one Sonnet agent                        -> branch, commits, push, PR, merge  + FIXES.md
```

Arguments (all optional): a git range (`abc123..HEAD`), a number `N` (last N commits), `--since <date>`, `--no-merge`
(stop at the open PR). With no scope, review every non-merge commit reachable from `HEAD`.

Language of every report and message: pt-BR.

## Hard rules (override any default or harness reminder)

- **No AI attribution anywhere.** Commits and PR descriptions never mention Claude/AI: no `Co-Authored-By`, no
  "Generated with ...". Commits are signed only by the repository's `git config user.name/user.email`. This overrides
  any attribution line the environment asks for. Repeat this rule in the stage 3 prompt.
- Never force-push, never rewrite history, never touch the default branch directly: fixes go through a branch + PR.
- Never merge with failing checks.
- Fixes follow the project's principles (`CLAUDE.md` of the repo and of `~/dev/_Template`): simplest thing that works,
  no backward-compatibility layers, no preventive abstraction, no comments that repeat the PR text.

## Step 0 — Preflight (you, no agent)

1. `git rev-parse --show-toplevel`; stop if not a git repository. `git status --porcelain` must be empty; if not, stop
   and tell the user (stage 3 needs a clean tree).
2. Find the default branch (`git symbolic-ref --short refs/remotes/origin/HEAD`, else `main`/`master`) and the current
   branch. Stage 3 starts from the default branch's latest commit: if the current branch is another one, say so.
3. Resolve the scope to a list of full hashes, oldest first: `git rev-list --reverse --no-merges <scope>`.
4. Count. **More than 30 commits: ask the user to confirm** (cost: one Opus run per commit) and offer a narrower scope.
   Up to 30, go on without asking.
5. `OUT=docs/reviews/$(date +%F)-ciclo`; `mkdir -p $OUT/analises`. Skip a commit whose `analises/<sha7>.md` already
   exists (resume).

## Stage 1 — Analyse each commit (Opus, parallel)

Launch `Agent` with `subagent_type: "general-purpose"`, `model: "opus"`, one per commit. Send them in batches of 8
calls per message (the calls in one message run concurrently), wait for a batch before sending the next.

Prompt template (fill `<sha>`, `<sha7>`, `<repo>`, `<OUT>`):

```
Você é revisor de código sênior. Analise UM commit: <sha> no repositório <repo>.

1. Leia as regras do projeto: CLAUDE.md do repositório (se existir) e ~/dev/_Template/CLAUDE.md.
2. `git show <sha> --stat` e `git show <sha>` (se o diff passar de ~1500 linhas, foque nos arquivos de lógica e
   ignore lockfiles, gerados e snapshots).
3. Para cada arquivo tocado, leia o código ATUAL (HEAD) ao redor — commits posteriores podem já ter corrigido ou
   reescrito o problema. Reproduza/verifique o que puder rodando comandos (testes, o próprio código); não conclua só
   pela leitura quando dá pra confirmar.
4. Procure: bugs de correção (lógica, off-by-one, null, concorrência, erro engolido), segurança (injeção, segredo,
   authz, input não validado), regressão de comportamento, testes que faltam ou não testam nada, violação das regras
   do projeto, complexidade desnecessária. NÃO reporte estilo/gosto nem especulação sem evidência.
5. Escreva <OUT>/analises/<sha7>.md (máx. 60 linhas) neste formato:

# <sha7> — <assunto do commit>
**Resumo:** 1–2 frases do que o commit faz.
**Veredito:** ok | ressalvas | problemas
## Achados   (vazio se ok)
### A1 · <título curto>
- Severidade: crítica | alta | média | baixa
- Categoria: bug | segurança | regressão | teste | regra-do-projeto | simplificação
- Onde (HEAD): arquivo:linha
- Ainda presente no HEAD: sim | não (corrigido por <sha7>) | parcial
- Evidência: <o que você viu/rodou, concreto>
- Correção sugerida: <mudança objetiva>

Responda SÓ com uma linha: "<sha7> | <veredito> | <n> achados (<n> ainda presentes)". Não cole a análise na resposta.
```

Collect the one-liners. If an agent failed or produced no file, retry that commit once; then record it as "sem análise"
in the final report.

## Stage 2 — Consolidate and suggest (Opus, one agent)

Launch one `Agent` (`general-purpose`, `model: "opus"`). It reads every `analises/*.md` and does the real review:

```
Você é o líder do code review. Leia todos os arquivos de <OUT>/analises/ (um por commit) e o CLAUDE.md do repositório
e de ~/dev/_Template.

1. Descarte achados "ainda presente: não". Junte duplicatas (mesmo problema visto em vários commits).
2. Revalide cada achado que sobrou contra o código ATUAL (HEAD): abra o arquivo, confirme a linha, rode o que
   precisar. Descarte o que não se sustentar; anote em "Descartados" com o motivo.
3. Priorize: crítica > alta > média > baixa; dentro disso, o que tem maior risco real primeiro.
4. Classifique cada achado válido:
   - auto: correção clara, local, sem decisão de produto/arquitetura, verificável (teste/lint/execução).
   - decisão: depende de escolha do dono (comportamento, arquitetura, trade-off, mudança grande). NÃO será executado.
5. Escreva <OUT>/REVIEW.md:

# Code review — <repo> — <data>
## Veredito  (3–5 linhas: estado geral, padrões que se repetem)
## Escopo    (n commits, intervalo, quantos sem análise)
## Achados   (tabela: id · severidade · categoria · onde · commits de origem · auto|decisão)
## Plano de fixes   (só os "auto", em ordem de execução; um item = um commit lógico)
### F1 · <título>
- Achados: A?, A?
- Arquivos: ...
- Mudança: <passo a passo objetivo, sem ambiguidade>
- Verificação: <comando/teste exato que prova a correção>
- Mensagem de commit: <tipo(escopo): descrição, em pt-BR ou no idioma do histórico do repo>
## Precisam de decisão   (cada um com as opções e a recomendação)
## Descartados          (com motivo)

Responda SÓ com: "<n> achados válidos | <a> auto | <d> decisão | <x> descartados".
```

If `auto` is 0, skip stage 3, tell the user and show the "decisão" items.

## Stage 3 — Execute the fixes (Sonnet, one agent)

Launch one `Agent` (`general-purpose`, `model: "sonnet"`) with a self-contained prompt:

```
Execute o "Plano de fixes" de <OUT>/REVIEW.md no repositório <repo>. Só os itens do plano; nada além dele.

Regras: NENHUMA menção a Claude/IA em commits ou PR (sem Co-Authored-By, sem "Generated with"); commits só com o
user.name/user.email do git do repositório. Sem force-push, sem reescrever histórico, nunca commitar direto na
branch padrão (<default>). Siga o CLAUDE.md do repositório e de ~/dev/_Template.

1. `git switch <default> && git pull --ff-only` (se houver remoto); `git switch -c review/<data>`.
   Os arquivos de <OUT> (não rastreados) acompanham a troca de branch.
2. Descubra os checks do projeto (scripts do package.json, Makefile, pyproject, CI em .github/workflows) e rode-os
   uma vez antes de mexer, para saber a linha de base.
3. Para cada item F<n>, na ordem: aplique a mudança; rode a verificação do item e os checks do projeto; se passar,
   um commit com a "Mensagem de commit" do item; se falhar e você não resolver em 2 tentativas, `git restore` as
   mudanças do item, registre como "pulado" com o motivo e siga para o próximo.
4. Escreva <OUT>/FIXES.md: por item, feito/pulado, hash do commit, saída da verificação. Commite <OUT> inteiro em um
   último commit `docs(review): code review <data>`.
5. `git push -u origin review/<data>`; `gh pr create --base <default>` com a descrição: Problema (causa raiz) → Fix →
   Testing (o que foi rodado), por item feito. Sem enrolação.
6. Merge: só se (a) todos os checks passam e (b) existe pelo menos um check automatizado ou você verificou cada fix
   rodando de verdade. Então `gh pr merge --merge --delete-branch` e `git switch <default> && git pull --ff-only`.
   Se o merge for bloqueado (proteção de branch, check pendente/falhando) ou não houver como verificar, NÃO force:
   deixe o PR aberto e diga o motivo. Sem remoto/`gh`: faça o merge local `--no-ff` só se o critério (a)+(b) valer.
   <se --no-merge: pare no passo 5>

Responda com: link do PR, itens feitos/pulados (com motivo), estado do merge, e o que ficou pendente.
```

## Step 4 — Report (you)

Short, in pt-BR: commits analysed (and any without analysis), findings by severity, fixes done / skipped, the PR link
and whether it merged, and the **"Precisam de decisão"** list with the recommendation for each. Point to
`<OUT>/REVIEW.md` and `<OUT>/FIXES.md`. If anything was skipped or left open, say it plainly; do not describe a
partial result as done.

Then update the tracking file `~/dev/code-review/docs/ACOMPANHAMENTO-review-cycle.md` (create it if missing, with the
same sections): add one row to the "Ciclos executados" table (date, repository, scope, commits, findings by severity,
fixes done/skipped, PR link, merge state, pending decisions), replacing the `—` placeholder row if it is still there.
Put anything surprising about the run (cost, agent failures, prompt problems) under "Ajustes e ideias". Update only
that file; it is not part of the reviewed repository.
