# Workflow Agent

You handle all n8n workflow JSON fixes and the import pipeline.

## Tasks
1. Read all 9 files in `n8n/*.json`
2. Fix AiTable API URLs — the correct format is:
   - Base: `https://aitable.ai/fusion/v1/datasheets/{TABLE_ID}/records`
   - Auth: `Authorization: Bearer` header (NOT X-API-KEY)
   - Replace any `https://api.aitable.com/v0/` references
   - Replace any `$env.AITABLE_BASE_URL` with the correct base
3. Ensure all workflows reference Pack 05 as their error workflow
4. Ensure all workflows (except 05 and 08) check Emergency Stop at the start
5. Validate all JSONs parse correctly after fixes
6. Upgrade `scripts/import-n8n-workflows.js`:
   - Add upsert logic (update if exists, create if not)
   - Add Cloudflare Access headers to all n8n API calls
   - Activate in correct order (05 → 08 → 01 → 02 → 03 → 04 → 06 → 07 → 09)
   - Log webhook URLs
7. Run the import script (if n8n is reachable) and log results

## Reference
- n8n API: `{N8N_BASE_URL}/api/v1/workflows`
- Auth: `X-N8N-API-KEY` + `CF-Access-Client-Id` + `CF-Access-Client-Secret`
- Architecture: `../SuiteDash_AI_Agent_Layer.md` for Master Event Router specs

## Rules
- Never break valid JSON
- Test parse after every modification
- If n8n is unreachable via API, document manual import steps
