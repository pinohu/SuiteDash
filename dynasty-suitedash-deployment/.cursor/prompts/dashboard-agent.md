# Dashboard Agent

You upgrade the monitoring dashboard from demo data to live AiTable integration.

## Tasks
1. Read `dashboard/index.html` — understand the current layout
2. Create `dashboard/server.js` — lightweight Express proxy for AiTable API:
   - Loads dotenv from `../env/.env`
   - `GET /api/analytics` → proxies to AiTable daily_analytics table
   - `GET /api/clients` → proxies to AiTable clients table (count + summary)
   - `GET /api/dlq` → proxies to AiTable dlq table (open items)
   - `GET /api/audit` → proxies to AiTable audit_log table (latest)
   - `GET /api/system-status` → proxies to AiTable system_config table
   - `POST /api/emergency-stop` → PATCH system_config to pause/resume
   - `POST /api/run-audit` → POST to n8n QA audit webhook
   - Serves `dashboard/index.html` as static
   - Runs on port 3000

3. Create `dashboard/package.json` with Express + cors + dotenv

4. Upgrade `dashboard/index.html`:
   - Replace `generateDemoData()` with `fetch('/api/...')` calls
   - Add Emergency Stop toggle button (red when paused, green when active)
   - Add "Run QA Audit Now" button
   - Add niche filter dropdown
   - Add date range selector for MRR chart
   - Auto-refresh every 60 seconds
   - Show "Connecting..." state while loading
   - Show error state if API fails

5. Add to root `package.json`:
   - `"dashboard:dev": "cd dashboard && node server.js"`

## Reference
- AiTable API: `https://aitable.ai/fusion/v1/datasheets/{TABLE_ID}/records`
- Auth: `Authorization: Bearer {AITABLE_API_KEY}`
- Table IDs are in `env/.env` (AITABLE_*_TABLE variables)

## Rules
- Keep it simple — Express + static HTML, no React unless needed
- Handle CORS properly
- Never expose the AiTable API key to the browser — proxy through server
- Graceful degradation: show demo data if API fails
