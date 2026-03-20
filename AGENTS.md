# AGENTS.md — SuiteDash workspace

Concise instructions for AI agents (Cursor, etc.). **Read this first** when working in this repository.

## Layout

| Path | Role |
|------|------|
| **`dynasty-suitedash-deployment/`** | **Primary codebase** — Node scripts, `agents/`, `n8n/`, `dashboard/`, `tests/`, `data/`. Run `npm` commands **here** unless a doc says otherwise. |
| **Root `SuiteDash_*.md`** | Architecture and product reference — long-form specs; not executable. |
| **`.cursor/mcp.json`** (workspace root) | Fetch MCP for Cursor — reload MCP after changes. |

## Autonomy defaults

- **Execute** verifiable steps yourself: install, `npm test`, `npm run test:agents`, `npm run test:api` (when safe), `node --check` on edited files, `node scripts/deploy-niche.js <niche>` when relevant.
- **Prefer** existing docs over re-deriving: `README.md`, `GO_LIVE_CHECKLIST.md`, `BUILD_COMPLETE.md`, `docs/CREDENTIALS_INVENTORY.md`, `docs/LAST_AUTOMATION_RUN.md`, `RUNBOOK.md`.
- **Secrets:** Never commit `.env`. Never embed API keys in `.md`, `.cursorrules`, or rules. Use `env/.env.example` for key *names* only.
- **APIs:** SuiteDash = `X-Public-ID` + `X-Secret-Key` (plaintext Secure API secret, not bcrypt). AiTable = Fusion `aitable.ai` + Bearer token. This is **not** Airtable.

## When changing behavior

- **n8n:** Edit JSON under `n8n/`; prefer validating import path (UI or `npm run import:n8n`) before claiming done.
- **Agents:** Keep modules in `agents/` consistent with `tests/test-agents.js` and `.cursorrules` conventions.
- **Dashboard:** `dashboard/server.js` + `index.html`; root `package.json` `dashboard:build` may not match this stack — verify before relying on it.

## Sub-agent prompts

Optional orchestration prompts live in `dynasty-suitedash-deployment/.cursor/prompts/` (build orchestrator, data/workflow/intelligence agents, etc.).
