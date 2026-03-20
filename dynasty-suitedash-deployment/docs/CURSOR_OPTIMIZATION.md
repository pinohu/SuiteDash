# Cursor — less manual I/O, more autonomy

This repo is wired for **scoped rules** and a **minimal MCP** starter. Optional extras are documented so you can add them without bloating every chat.

## What was added

| Item | Purpose |
|------|---------|
| Workspace **`AGENTS.md`** | Single “read first” brief: where code lives, autonomy defaults, secrets, APIs. |
| **`.cursor/rules/dynasty-suitedash-deployment.mdc`** | Applies when editing `dynasty-suitedash-deployment/**` — stack reminders without loading for unrelated files. |
| **`.cursor/mcp.json`** (workspace root) | **Fetch** MCP enabled (`@modelcontextprotocol/server-fetch`). **`.cursor/mcp.json.example`** is a backup template. |
| Restart Cursor | After pulling changes, reload MCP if Fetch does not appear. |

## MCP (Fetch)

Fetch lets the agent pull **public** URLs as context (docs, OpenAPI pages) with less copy-paste from you. Config lives at **`SuiteDash/.cursor/mcp.json`** (parent of `dynasty-suitedash-deployment/`).

**Optional — Filesystem (narrow scope):** add a second server using [`@modelcontextprotocol/server-filesystem`](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem). Pass **one** allowed root path, e.g. the absolute path to `dynasty-suitedash-deployment`, so the agent is not scoped to your whole user folder.

**Optional — Git:** [`@modelcontextprotocol/server-git`](https://github.com/modelcontextprotocol/servers/tree/main/src/git) for branch/log/diff tools when you want the agent to lean on git without you running commands. Point `--repository` at this workspace root.

**Rule of thumb:** start with **Fetch only**; add Filesystem or Git if you hit repeated friction. Too many MCP servers can **reduce** quality by crowding context.

## High-star references (external)

- [**PatrickJS/awesome-cursorrules**](https://github.com/PatrickJS/awesome-cursorrules) — patterns for `.cursorrules` / rules by stack; copy **only** what matches this project.
- [**modelcontextprotocol/servers**](https://github.com/modelcontextprotocol/servers) — official MCP server implementations (fetch, filesystem, git, memory, GitHub, etc.).
- [**cursor.directory**](https://cursor.directory/) — community MCP and rule discovery ([source](https://github.com/leerob/directories)).
- [**microsoft/markitdown**](https://github.com/microsoft/markitdown) — convert Office/PDF to Markdown for `@`-ing specs into the workspace.

## Security

- **Never** put API keys in rules, `AGENTS.md`, or committed MCP config.
- If a key was ever committed, **rotate** it in the provider dashboard.
