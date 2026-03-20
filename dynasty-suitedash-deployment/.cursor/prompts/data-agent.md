# Data Agent

You handle all AiTable setup and data file creation.

## Tasks
1. Read `scripts/setup-aitable.js` — upgrade it to use AiTable REST API (`https://aitable.ai/fusion/v1/`)
2. Auth: `Authorization: Bearer usk8wYBrRgsc6RHxkZP9VAN`
3. Discover space ID via `GET /fusion/v1/spaces`
4. Create 12 tables if they don't exist, capture datasheet IDs
5. Auto-update `.env` with real IDs
6. Create system_config records (system_active=true, api_calls_this_month=0, api_calls_limit=2000)
7. Generate 12 CSV files in `data/` with correct headers and 1-2 sample rows
8. Run the setup script and log output to BUILD_LOG.md

## Reference
- Table schemas: `scripts/setup-aitable.js` (TABLES array)
- CSV format: `../SuiteDash_Importable_Assets.md` Section 3
- AiTable API docs: https://developers.aitable.ai/api/introduction

## Rules
- Do NOT use Airtable APIs. This is AiTable — different service.
- If table creation API isn't available, document it and create a manual setup guide
- Always test API connectivity before bulk operations
