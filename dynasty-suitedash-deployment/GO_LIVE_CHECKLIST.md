# Go-live checklist — client-ready & revenue-ready

Use this before onboarding **paying** clients. It merges **technical verification**, **first-niche rollout**, and a **client-facing scope** template.

**Related docs:** **`docs/PRODUCTION_READINESS_RUNBOOK.md`** (full ordered steps to production), `docs/CREDENTIALS_INVENTORY.md`, `docs/LAST_AUTOMATION_RUN.md`, `BUILD_COMPLETE.md`, `RUNBOOK.md`.

---

## Part A — Environment & secrets

### A.1 Layout

| Location | Purpose |
|----------|---------|
| **`.env` at repo root** (`dynasty-suitedash-deployment/.env`) | Primary runtime env for scripts, agents, dashboard server |
| **`env/.env`** | Optional alternate; copy to root if tools expect `.env` there |
| **`env/.env.example`** | Key names only — safe in git |

Fill every **Tier A** variable from `docs/CREDENTIALS_INVENTORY.md`. **Never commit** real values.

### A.2 SuiteDash API (common 401 cause)

- Headers must be **`X-Public-ID`** + **`X-Secret-Key`** (not `X-API-KEY`).
- **`SUITEDASH_API_SECRET`** = plaintext **Secret Key** from SuiteDash **Integrations → Secure API**, **not** a `$2y$…` bcrypt hash.

### A.3 Verification commands (run from repo root)

```bash
npm install
cd dashboard && npm install && cd ..

# Static checks (no live APIs)
npm test
npm run test:agents
node --check dashboard/server.js
```

```bash
# Live connectivity (informational; always exit 0)
npm run test:api

# CI / go-live gate: exit 1 if any check fails or Tier A env incomplete
npm run test:api:strict
```

Optional: `TEST_ALLOW_INSECURE_TLS=1` or `node tests/test-connections.js --insecure-tls` for temporary n8n TLS debugging only.

**Go-live bar:** All **Tier A** services you actually use in production must pass or be explicitly **out of scope** for the first client (document that in Part D).

### A.4 AiTable (12 Dynasty tables)

1. Create or import datasheets from `data/*.csv` (or run `npm run setup:aitable` if that matches your process).
2. Set **`AITABLE_*_TABLE`** / datasheet IDs in `.env` to the **correct** Dynasty tables (not random sheets in the same space).  
3. Optional discovery (read-only): `npm run bootstrap:aitable:discover` — review output; it does **not** auto-pick tables.

### A.5 n8n

1. Resolve **TLS**: certificate hostname must match the URL you use (`N8N_BASE_URL` / `N8N_WEBHOOK_BASE`). Fix DNS/SSL on the host; avoid `NODE_TLS_REJECT_UNAUTHORIZED=0` except short-term debugging.
2. Import workflows: `npm run import:n8n` **or** manual UI import from `n8n/*.json`.
3. If imports return **HTTP 500**, inspect **n8n server logs** — not fixable from this repo alone.

### A.6 Stripe (billing)

- **Live** keys and webhook signing secret in `.env` when charging real customers.
- Stripe Dashboard: products/prices and webhook endpoint aligned with your n8n or backend URL.

### A.7 OpenAI (agents)

- Valid **`OPENAI_API_KEY`**, billing active, model matches `OPENAI_MODEL` if set.

---

## Part B — First paying niche (recommended path)

Ship **one** vertical end-to-end before turning on all 16.

1. **Choose niche** (e.g. `plumbing` — Pack 1 in `README.md`).
2. **Deploy config & checklist:**
   ```bash
   node scripts/deploy-niche.js plumbing
   ```
   Complete every **manual SuiteDash** step the script prints.
3. **Import n8n** workflows (Part A.5) and **activate** the subset needed for that niche.
4. **Smoke test** a real path: test contact → webhook or manual trigger → visible outcome (SuiteDash record, email, or AiTable row — whatever you sell).
5. **Dashboard (internal ops):**
   ```bash
   npm run dashboard:dev
   ```
   Confirm `http://localhost:3000` (or your hosted URL) loads and KPI/proxy calls work with production `.env`.

6. **Emergency control:** document how you **pause** automations if something breaks:
   ```bash
   npm run emergency:stop
   ```
   (and resume when fixed).

---

## Part C — Production hygiene

- [ ] No secrets in git; rotate any key ever pasted into chat or a ticket.
- [ ] `BUILD_COMPLETE.md` **Known issues** reviewed (e.g. AiTable filter/query behavior in n8n vs Airtable-style nodes).
- [ ] Backups: SuiteDash + AiTable + n8n export cadence defined (who, how often).
- [ ] Named owner for **incidents** (who gets paged if automations stop).

---

## Part D — Client-facing scope of work (template)

Copy below into your SOW, order form, or statement of work. Replace `{…}` placeholders.

---

### Statement of work — `{Service name}` for `{Client legal name}`

**Effective date:** `{date}`  
**Provider:** `{Your company name}`  
**Client:** `{Client legal name}`

#### 1. Purpose

Provider will deliver **`{one clear outcome}`** for Client’s **`{niche / directory name}`** listing and automation program, using SuiteDash (and connected systems) as agreed below.

#### 2. Included deliverables

- **SuiteDash:** `{e.g. portal profile setup, onboarding flow, circles/companies as scoped, up to N contacts migrated}`
- **Automations:** `{e.g. onboarding sequence, engagement scoring, renewal reminders — list n8n workflow numbers or names}`
- **Data:** `{e.g. AiTable tables in use; who owns schema changes}`
- **Training / handoff:** `{e.g. one 60-minute call + Loom links}`

#### 3. Explicitly out of scope (unless added in writing)

- Custom software development outside configured SuiteDash / n8n / AiTable
- Content creation beyond `{N}` pages or emails
- Advertising spend or SEO guarantees
- Integrations not listed in section 2
- 24/7 support unless a separate SLA is purchased

#### 4. Client responsibilities

- Timely provision of logos, copy, legal disclaimers, and accurate business information
- One **billing contact** and approval for go-live
- Compliance with email/marketing laws for lists they provide

#### 5. Fees & payment

- **Setup / implementation:** `{amount}` due `{on signature / before go-live}`
- **Recurring:** `{amount}` per `{month / quarter}`, starting `{date}`
- **Payment method:** `{Stripe invoice / link / ACH}`

#### 6. Timeline

- **Target go-live:** `{date}`  
- Dependencies: Client completes checklist by `{date}`; Provider blocked days do not count as Client delay unless otherwise agreed.

#### 7. Acceptance

Work is **accepted** when: `{e.g. SuiteDash portal access works for agreed roles; automations in section 2 run successfully on a joint test; Client signs acceptance email}`.

#### 8. Warranty & support

- **Stability window:** `{e.g. 30 days}` from go-live for **defects** in delivered configuration (not third-party outages).
- **Support channel:** `{email / ticket system}`; **response time:** `{e.g. business days within 24h}`.

#### 9. Termination

Either party may terminate with **`{N}` days** written notice. Fees for work completed and the current period are **non-refundable** unless otherwise required by law.

#### 10. Data & access

- Client data remains Client’s. Provider may process it only to deliver this SOW.
- On termination, Provider will **`{export / assist export / describe process}`** within **`{N}` days**.

#### 11. Limitation of liability

To the maximum extent permitted by law, Provider’s total liability under this SOW is limited to **fees paid in the `{N}` months** before the claim. **No consequential damages.**

---

**Provider signature:** _________________ **Date:** _______  
**Client signature:** _________________ **Date:** _______

---

## Part E — Final sign-off (internal)

| Item | OK |
|------|-----|
| `npm test` && `npm run test:agents` | [ ] |
| `npm run test:api` for services **in scope** for first client | [ ] |
| First niche `deploy-niche.js` + manual SuiteDash steps | [ ] |
| n8n workflows imported and tested on staging/prod | [ ] |
| Stripe **live** billing ready (if charging immediately) | [ ] |
| SOW signed; scope matches what is actually turned on | [ ] |
| Emergency stop / rollback path documented for ops | [ ] |

**Go-live owner:** `{name}` **Date:** `{date}`
