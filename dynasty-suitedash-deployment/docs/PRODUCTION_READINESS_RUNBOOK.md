# Production readiness runbook

**Project:** Dynasty Empire — SuiteDash deployment system (`dynasty-suitedash-deployment`)  
**Purpose:** This document is the single, ordered guide to take the codebase from “works in git” to **production-ready**: live integrations, automations you trust, and a path to billing clients.

**Companion docs:** `GO_LIVE_CHECKLIST.md` (short checklist + SOW template), `docs/CREDENTIALS_INVENTORY.md`, `BUILD_COMPLETE.md`, `RUNBOOK.md`.

---

## 1. What “production ready” means here

| Layer | Production-ready when… |
|--------|-------------------------|
| **SuiteDash** | Secure API accepts your calls; portal URLs and webhooks match your live instance. |
| **AiTable** | All required datasheets exist; every `AITABLE_*_TABLE` in `.env` points to the correct datasheet ID; `system_config` has `system_active` and related rows. |
| **n8n** | HTTPS hostname matches certificate; workflows imported; environment variables set in n8n; webhooks reachable from SuiteDash/Stripe. |
| **Stripe** | **Live** keys + webhook secret for production charges (if you bill through Stripe). |
| **OpenAI** | Valid API key and billing; agents/workflows that call OpenAI succeed. |
| **Email** | SMTP works for workflows that send mail. |
| **Ops dashboard** | Runs with production `.env` (local or hosted); `/api/health` shows `live`; emergency stop updates AiTable. |
| **You** | One niche end-to-end tested; `npm run test:api:strict` passes (or you documented explicit exceptions). |

This repo does **not** replace SuiteDash UI configuration (roles, circles, FLOWs, branding). Those steps are documented in the root `SuiteDash_*.md` files and in output from `deploy-niche.js`.

---

## 2. Prerequisites

Before starting, have:

1. **Admin access** to SuiteDash (primary portal you automate).
2. **AiTable** account and API token ([AiTable API / token](https://developers.aitable.ai/api/quick-start)).
3. **n8n** instance (self-hosted or cloud) with **API access** and a **public or tunnelled webhook base URL** if SuiteDash/Stripe must reach it.
4. **Stripe** account (if taking payments through Stripe).
5. **OpenAI** account (if using agent features that call OpenAI).
6. **SMTP** credentials (if workflows send email).
7. **Node.js 18+** and **npm** on the machine that runs scripts and the dashboard.
8. A **password manager** or secrets vault — never commit real `.env` values.

**Working directory:** All CLI commands below assume you are in the folder:

`dynasty-suitedash-deployment/`

(On Windows PowerShell, use that path explicitly, e.g. `cd C:\Users\<you>\Desktop\SuiteDash\dynasty-suitedash-deployment`.)

---

## 3. Phase A — Clone, install, baseline tests (no secrets yet)

### A.1 Get the code

```bash
git clone https://github.com/pinohu/SuiteDash.git
cd SuiteDash/dynasty-suitedash-deployment
```

(If you already have the repo, `git pull` on `main`.)

### A.2 Install dependencies

```bash
npm install
cd dashboard
npm install
cd ..
```

### A.3 Run tests that do **not** need `.env`

```bash
npm test
npm run test:agents
npm run dashboard:build
```

**Expected:** All pass. If not, fix local Node/npm issues before continuing.

---

## 4. Phase B — Create and place `.env`

### B.1 Choose one primary location

| File | Use |
|------|-----|
| **`dynasty-suitedash-deployment/.env`** | **Recommended.** Used by dashboard (`server.js` loads `../.env` from `dashboard/`), `test-connections.js`, and most scripts when run from repo root. |
| **`dynasty-suitedash-deployment/env/.env`** | Optional duplicate; several scripts also load this path. **Easiest approach:** keep secrets in **`.env` at repo root** and optionally copy/sync to `env/.env` if a tool expects it. |

### B.2 Bootstrap from the template

**PowerShell (repo root = `dynasty-suitedash-deployment`):**

```powershell
Copy-Item env\.env.example .env
```

**Bash:**

```bash
cp env/.env.example .env
```

### B.3 Edit `.env` in a text editor

Open `.env` and replace every `REPLACE_ME` you need for production. Use `docs/CREDENTIALS_INVENTORY.md` as the map from “service in dashboard” → “variable name”.

**Non-negotiable for full automation:**

- SuiteDash: `SUITEDASH_API_ID`, `SUITEDASH_API_SECRET`, `SUITEDASH_BASE_URL`, `SUITEDASH_PORTAL_URL`
- AiTable: `AITABLE_API_KEY`, `AITABLE_BASE_URL`, all `AITABLE_*_TABLE` IDs you use
- n8n: `N8N_BASE_URL`, `N8N_WEBHOOK_BASE`, `N8N_API_KEY` (+ Cloudflare Access vars if your n8n is behind Access)
- Stripe: `STRIPE_SECRET_KEY` (and publishable + webhook secret when billing)
- OpenAI: `OPENAI_API_KEY` (and model vars if set in `.env.example`)
- SMTP: `SMTP_*` if email nodes are used

**Git safety:** Confirm `.env` is **not** tracked:

```bash
git status
```

You should **not** see `.env` as a new file to commit. If it appears, add `.env` to `.gitignore` (root package already uses parent `dynasty-suitedash-deployment/.gitignore` for `env/.env` patterns — your **root** `.env` should be listed in that `.gitignore`; if missing, add a line `.env`).

---

## 5. Phase C — SuiteDash (fix 401s before anything else)

### C.1 Enable Secure API

1. Log into SuiteDash as an admin.
2. Go to **Integrations → Secure API** (or your plan’s equivalent per [SuiteDash Secure API](https://help.suitedash.com/article/550-secure-api)).
3. Copy **Public ID** → `SUITEDASH_API_ID`.
4. Copy **Secret Key** as shown for API use — the **plaintext** secret string → `SUITEDASH_API_SECRET`.

**Critical:** Do **not** paste the long `$2y$…` bcrypt-style hash if that is not what the API expects for `X-Secret-Key`. The repo uses headers **`X-Public-ID`** and **`X-Secret-Key`**, not `X-API-KEY`.

### C.2 Set `SUITEDASH_BASE_URL`

It must be the **API base** you call from code (same pattern as `scripts/verify-connections.js`):

- Example shape: `https://your-portal-domain.com/secure-api`  
- **No trailing slash** is safest; if you use one, be consistent.

Test from your machine (optional, with curl):

```bash
# Replace with your values
curl -s -o NUL -w "%{http_code}" -H "X-Public-ID: YOUR_ID" -H "X-Secret-Key: YOUR_SECRET" "YOUR_BASE_URL/contacts?limit=1"
```

You want **HTTP 200**.

### C.3 `SUITEDASH_PORTAL_URL`

Set to the **client-facing portal URL** (used in emails/templates/workflows). Example: `https://portal.yourdomain.com`.

### C.4 Verify from the repo

```bash
npm run test:api
```

Fix SuiteDash until the line **SuiteDash: OK** appears (or debug the printed status).

---

## 6. Phase D — AiTable (datasheets + env IDs)

### D.1 Set `AITABLE_BASE_URL`

Use the Fusion REST base **without** a datasheet ID on the end, matching how `verify-connections.js` builds URLs:

- Example: `https://aitable.ai/fusion/v1/datasheets`

(If your docs use a trailing path, ensure `emergency-stop.js` and verify scripts still resolve to `.../datasheets/{TABLE_ID}`.)

### D.2 Create the Dynasty tables

You need datasheets corresponding to the CSV templates in `data/*.csv` (12 tables). Options:

1. **Manual:** Create tables in AiTable UI and import each CSV (or paste headers + sample rows).
2. **Script:** From repo root, inspect and run if appropriate for your space:

   ```bash
   npm run setup:aitable
   ```

   If the API cannot create tables in your plan, follow any **manual guide** the script prints.

### D.3 Capture datasheet IDs

Each datasheet has an ID (often `dst...`). For **each** table you use, set the matching variable in `.env`, for example:

- `AITABLE_CLIENTS_TABLE`
- `AITABLE_PROJECTS_TABLE`
- `AITABLE_TASKS_TABLE`
- `AITABLE_ENGAGEMENT_TABLE`
- `AITABLE_LEAD_SCORES_TABLE`
- `AITABLE_COMMS_LOG_TABLE`
- `AITABLE_WORKFLOW_STATE_TABLE`
- `AITABLE_DLQ_TABLE`
- `AITABLE_ANALYTICS_TABLE`
- `AITABLE_AUDIT_LOG_TABLE`
- `AITABLE_EVENT_LOG_TABLE`
- `AITABLE_SYSTEM_CONFIG_TABLE`

**Do not guess** IDs from unrelated bases. Wrong IDs cause silent wrong data or empty results.

### D.4 Discovery (optional, read-only)

```bash
npm run bootstrap:aitable:discover
```

Review the output file/report (see `docs/LAST_AUTOMATION_RUN.md` — discovery may write `AUTOMATION_REPORT.md` when configured). **You** map listed datasheets to env vars.

### D.5 `system_config` rows

Ensure AiTable has rows this automation expects, including at least:

- `config_key = system_active` with `value` `true`/`false` (strings as your base uses)
- `api_calls_this_month`, `api_calls_limit`, `pause_reason` as per your `RUNBOOK.md` / niche deploy output

`scripts/emergency-stop.js` requires **`AITABLE_BASE_URL`**, **`AITABLE_SYSTEM_CONFIG_TABLE`**, and **`AITABLE_API_KEY`**.

### D.6 Verify

```bash
npm run setup:verify
```

or

```bash
npm run test:api
```

**AiTable: OK** should appear when the token and at least one table URL are valid.

---

## 7. Phase E — n8n (TLS, import, env, webhooks)

### E.1 Fix TLS hostname mismatch (common blocker)

**Symptom:** `Hostname/IP does not match certificate's altnames`.

**Fix (pick one):**

1. Point `N8N_BASE_URL` and `N8N_WEBHOOK_BASE` to the hostname **on the certificate** (e.g. correct subdomain), **or**
2. Re-issue TLS so the certificate **covers** the hostname you use (e.g. `flint.yourdomain.com`), **or**
3. Put n8n behind a reverse proxy with a correct cert.

**Temporary debug only** (insecure):

```powershell
$env:TEST_ALLOW_INSECURE_TLS="1"
npm run test:api
```

Do **not** leave this on in production.

### E.2 Set n8n env vars

In the n8n UI (or deployment env), define the **same** variable names your workflows reference: `AITABLE_*`, `SUITEDASH_BASE_URL`, `N8N_WEBHOOK_BASE`, `OPENAI_API_KEY`, SMTP, Stripe, etc. Workflows use `$env.VARIABLE_NAME`.

### E.3 Import workflows

From repo root:

```bash
npm run import:n8n
```

If the API returns **500**, open **n8n server logs** and fix server-side issues, or import manually:

1. n8n → **Workflows → Import from file**
2. Import each file under `n8n/` (`01_onboarding.json` … `09_qa_audit.json`)

### E.4 Activate and connect webhooks

1. **Activate** each imported workflow.
2. Note webhook paths (e.g. master router). Configure SuiteDash (or external systems) to POST to:

   `N8N_WEBHOOK_BASE` + path (e.g. `/dynasty-events` for the master router — confirm in workflow **Webhook** node).

3. If n8n is behind **Cloudflare Access**, set `N8N_CF_ACCESS_CLIENT_ID` and `N8N_CF_ACCESS_CLIENT_SECRET` in `.env` for API scripts that call n8n.

### E.5 Verify

```bash
npm run test:api
```

**n8n: OK** when TLS and API key are correct.

---

## 8. Phase F — Stripe (production billing)

1. Stripe Dashboard → **Developers → API keys** → **Live** secret key → `STRIPE_SECRET_KEY`.
2. **Webhook signing secret** for your production endpoint → `STRIPE_WEBHOOK_SECRET`.
3. Publishable key → `STRIPE_PUBLISHABLE_KEY` if any client-side Stripe usage.
4. Create **Products/Prices** and point webhook URL to your **live** n8n (or backend) handler.

Verify:

```bash
npm run test:api
```

**Stripe: OK** should appear.

---

## 9. Phase G — OpenAI

1. OpenAI Platform → **API keys** → create key → `OPENAI_API_KEY`.
2. Ensure **billing** is active and limits are set.
3. If you use `OPENAI_MODEL` / `OPENAI_MAX_TOKENS` in `.env`, align with models you have access to.

Verify:

```bash
npm run test:api
```

---

## 10. Phase H — SMTP (email-sending workflows)

1. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_NAME`, `SMTP_FROM_EMAIL` in `.env` and in n8n environment.
2. Send a test from n8n (manual execution of a small workflow) or your provider’s test tool.

---

## 11. Phase I — Hard verification gate

From `dynasty-suitedash-deployment/`:

```bash
npm test
npm run test:agents
npm run dashboard:build
npm run test:api:strict
```

**`test:api:strict`** exits with code **1** if:

- Any Tier A variable is missing, or  
- Any live check fails.

Use this as your **CI or pre-go-live gate**. Fix every failure before calling the system “production ready.”

---

## 12. Phase J — Ops dashboard

### J.1 Local run

```bash
npm run dashboard:dev
```

Open `http://localhost:3000`.

### J.2 Confirm health

Open or fetch:

`http://localhost:3000/api/health`

- **`mode": "live"`** when `AITABLE_API_KEY` plus required table IDs for the dashboard routes are set.
- **`degraded`** means fix `.env` per banner text on the UI.

### J.3 Production hosting (your choice)

The dashboard is **Express + static files**. To expose it beyond localhost:

1. Run `node dashboard/server.js` (or `npm run dashboard:dev`) on a server with **production `.env`** beside `dashboard/` (parent folder must contain `.env` — see `dashboard/server.js` path).
2. Put **HTTPS** reverse proxy (nginx, Caddy, Cloudflare Tunnel) in front; set firewall rules.
3. **Do not** expose without authentication if it can change `system_active` or trigger webhooks — add VPN, SSO, or IP allowlist at the proxy.

---

## 13. Phase K — First niche + smoke test

### K.1 Pick one niche

Example: **plumbing** (first in `README.md` list).

### K.2 Generate SuiteDash checklist

```bash
node scripts/deploy-niche.js plumbing
```

Complete **every** printed SuiteDash manual step (custom fields, circles, FLOWs, etc.).

### K.3 Smoke test (define your “happy path”)

Example sequence:

1. Create or use a **test contact** in SuiteDash.
2. Trigger the **onboarding** or **master event** webhook with a test payload (or use SuiteDash automation to call n8n).
3. Confirm: **AiTable row** created/updated, **n8n execution** succeeds, **email** received if applicable.

### K.4 Emergency controls

```bash
npm run emergency:status
npm run emergency:stop
npm run emergency:resume
```

Confirm AiTable `system_active` flips and workflows respect it (see `RUNBOOK.md`).

---

## 14. Phase L — Commercial readiness (billing clients)

Use **`GO_LIVE_CHECKLIST.md` Part D** (SOW template) and ensure:

1. **Written scope** matches what is actually enabled (one niche vs sixteen).
2. **Stripe live** (or other payment) matches your contract.
3. **Support boundaries** and **data handling** are agreed.

This runbook does not provide legal advice; have counsel review contracts if needed.

---

## 15. Troubleshooting quick reference

| Symptom | Likely cause | Action |
|---------|----------------|--------|
| SuiteDash **401** | Wrong secret type or header | Use plaintext Secure API **Secret Key**; headers `X-Public-ID` + `X-Secret-Key`. |
| AiTable **401/403** | Bad or revoked token | Rotate token in AiTable; update `.env` and n8n env. |
| n8n **TLS errors** | Hostname vs cert | Fix DNS/cert or URL (Phase E.1). |
| n8n import **500** | Server error | Read n8n container/server logs. |
| Empty AiTable in workflows | Wrong `dst` / table ID | Re-map `AITABLE_*_TABLE` from AiTable UI. |
| Dashboard “degraded” | Missing key or table env | Fill `.env`; reload server. |
| `filterByFormula` odd results | Field names / empty checks | Confirm field names match AiTable; adjust formula per [Get Records](https://developers.aitable.ai/api/get-records). |

---

## 16. Final sign-off checklist

Print or copy this table; check each box before declaring production ready.

- [ ] `.env` at repo root populated; **never committed**
- [ ] `npm test` && `npm run test:agents` && `npm run dashboard:build` pass
- [ ] `npm run test:api:strict` passes (or each failure documented and accepted)
- [ ] All required n8n workflows **imported**, **active**, env vars set in n8n
- [ ] Webhooks reachable from SuiteDash / Stripe (firewall + HTTPS)
- [ ] AiTable tables created; `AITABLE_*_TABLE` correct; `system_config` rows exist
- [ ] One niche: `deploy-niche.js` checklist **completed** in SuiteDash
- [ ] End-to-end smoke test passed
- [ ] Emergency stop tested
- [ ] Dashboard `/api/health` = `live` (if you use the dashboard in prod)
- [ ] Stripe **live** + webhooks (if charging)
- [ ] SOW / scope aligned with `GO_LIVE_CHECKLIST.md`

---

**Document version:** 1.0 (repo)  
**Last updated:** March 20, 2026
