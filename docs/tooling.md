# Tooling and MCP servers

What Claude Code can reach from this project, what each connection is for and what's off limits. Checked 2026-11-22.

## Project-level (committed)

| Server | Where it's declared | Used for | Guardrail |
| --- | --- | --- | --- |
| **Buffer** (`https://mcp.buffer.com/mcp`, HTTP) | `.mcp.json` | The `social-publisher` agent creates social posts as drafts and lists what's waiting for approval | `.claude/hooks/buffer-draft-only.mjs` blocks `create_post` and `edit_post` unless `saveToDraft` is true and the mode isn't `shareNow` or `shareNext`. Nothing publishes without Ícaro approving it in Buffer. |

## Account-level (not in the repo)

These come from Ícaro's Claude account and plugins, so another machine or contributor won't have them.

| Server | State | Used for | Notes |
| --- | --- | --- | --- |
| **Vercel** (plugin) | Authenticated. One team on the account. **No project for this repo yet** (checked by name and by repository) | BMI-003: create the project, link the Git repo, check deployments, read runtime logs, set env vars, firewall rule | Creating or changing anything on Vercel needs Ícaro's go. Read-only checks are fine. Team and project IDs aren't recorded here: this file goes public with the repo. |
| **Claude Docs**, **Meetings**, **Claude Data** | Connected | Not used by this project | Left alone. |
| Asana, Atlassian, Box, Canva, ClickUp, Figma, HubSpot, Intercom, Linear, Microsoft 365, Notion, monday.com, Datadog, PagerDuty, Slack, Miro, Resend | Listed, not authenticated | Not used | Don't authenticate one without a task that needs it. |

## Vercel, what BMI-003 will do

1. Create a project from the GitHub repo through Vercel's Git integration. Production deploys on every merge to `main` (D-005); PRs get preview deployments.
2. Set `MAX_BYTES`, `PROXY_TIMEOUT_MS` and `ALLOWED_ORIGINS` as in [hosting.md](hosting.md) and the security report.
3. Add one WAF rate-limit rule on `/api/image`, and turn the Vercel Toolbar, Web Analytics and Speed Insights off (they inject third-party scripts, against the privacy promise).
4. Read the production URL, then update the README, the repo's website field and the bug-report form (Q-005).

The repo is private until BMI-050. Whether Hobby deploys from a private repo is confirmed when the project is created in BMI-003; fork protection and deployment protection get checked again when the repo goes public.

## Rules for any MCP call

- No image, file name or personal detail from a user goes to an outside service.
- The maintainer's email and the Vercel team identifiers stay out of repo files and out of external requests.
- Anything public or outward-facing (a post, a deploy, a domain purchase) waits for Ícaro's approval.
