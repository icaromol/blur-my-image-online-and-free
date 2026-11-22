// PreToolUse guard: Buffer posts may only be created or edited as drafts.
let raw = "";
for await (const chunk of process.stdin) raw += chunk;

const input = JSON.parse(raw).tool_input ?? {};
const problems = [];
if (input.saveToDraft !== true) problems.push("saveToDraft must be true");
if (input.mode === "shareNow" || input.mode === "shareNext") {
  problems.push(`mode "${input.mode}" publishes immediately`);
}

if (problems.length > 0) {
  console.error(
    `Blocked: Buffer posts are drafts for the user to approve (${problems.join("; ")}).`,
  );
  process.exit(2);
}
