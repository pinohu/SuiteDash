# Last automation run (orchestrated)

**When:** 2026-03-20 (local machine)

## Completed automatically

| Step | Result |
|------|--------|
| Copy `env/.env` → `.env` at repo root | Done (`.env` remains gitignored) |
| `npm run test:api` | **AiTable** + **Stripe** CONNECTED; **SuiteDash** + **OpenAI** 401; **n8n** TLS hostname mismatch (see below) |
| AiTable discovery | `node scripts/aitable-discover.js` → writes **`AUTOMATION_REPORT.md`** (gitignored). Lists spaces + datasheet samples; **does not edit `.env`** (avoids wrong matches e.g. generic “Tasks”). |
| `npm run import:n8n` with `NODE_TLS_REJECT_UNAUTHORIZED=0` | TLS bypass worked; **all 9 imports returned HTTP 500** from n8n (server-side — fix host/cert/API on Flint or import via UI). |
| `node scripts/deploy-niche.js plumbing` | **OK** after fixing `deploy-niche.js` for `sales_pipeline` / `service_pipeline` as `{ stages: [...] }` objects. Outputs manual SuiteDash checklist. |
| Dashboard | **`http://localhost:3000`** returns **200** (Express + static UI). Server was started in background for verification. |
| `npm audit` | **0** on root deps after removing unused Next/React devDependencies (re-run after `npm install`). |

## Credential / infrastructure issues (you must fix outside this repo)

1. **SuiteDash 401** — Previously caused by wrong headers (`X-API-KEY`). Code now uses **`X-Public-ID` + `X-Secret-Key`**. `SUITEDASH_API_SECRET` must be the **Secret Key** from Secure API (plaintext), not a bcrypt hash.
2. **OpenAI 401** — Key revoked, wrong key, or project billing; rotate in `.env`.
3. **n8n** — Certificate is for `*.stackcp.com` while host is `flint.yourdeputy.com`; fix DNS/SSL on the host **or** use the correct URL. Import **500**s need n8n server logs.
4. **Dynasty AiTable tables** — Your token’s spaces contain many unrelated datasheets. Create **12** Dynasty datasheets (or import from `data/*.csv`) and set real `dst_*` IDs in `.env`.

## Scripts added/updated

- `scripts/aitable-discover.js` — read-only discovery (Fusion v2 `nodes?type=Datasheet`).
- `scripts/deploy-niche.js` — supports pipeline objects with `.stages`.
- `npm run bootstrap:aitable:discover` — runs discovery.

## Security note

Using `NODE_TLS_REJECT_UNAUTHORIZED=0` is **insecure**; only use temporarily to unblock imports until TLS is fixed.
