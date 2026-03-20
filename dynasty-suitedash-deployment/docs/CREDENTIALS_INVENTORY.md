# Credential inventory → environment variables

Use this to **copy values from your password manager** into **`.env`** (root) or **`env/.env`**.  
**Do not commit** real keys. After any paste into chat, **rotate** that key.

## Tier A — required for `dynasty-suitedash-deployment` core

| Your label (inventory) | Set these variables | Notes |
|------------------------|-------------------|--------|
| **SuiteDash - YourDeputy** | `SUITEDASH_API_ID`, `SUITEDASH_API_SECRET`, `SUITEDASH_BASE_URL`, `SUITEDASH_PORTAL_URL` | Auth: `X-Public-ID` + `X-Secret-Key`. **Secret must be the “Secret Key” from Integrations → Secure API**, not a `$2y$…` bcrypt string. |
| **AiTable** | `AITABLE_API_KEY`, `AITABLE_*_TABLE`, `AITABLE_SYSTEM_ACTIVE_RECORD` | Bearer token for Fusion API. |
| **Stripe** | `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Webhook secret from Stripe Dashboard. |
| **OpenAI** | `OPENAI_API_KEY`, `OPENAI_MODEL`, `OPENAI_MAX_TOKENS` | Agents + tests. |
| **n8n (Flint)** | `N8N_BASE_URL`, `N8N_WEBHOOK_BASE`, `N8N_API_KEY`, `N8N_CF_ACCESS_CLIENT_ID`, `N8N_CF_ACCESS_CLIENT_SECRET` | Fix TLS/DNS on host if cert hostname mismatches. |
| **Email (SMTP)** | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_*` | Workflow emails. |

## Tier B — other SuiteDash white-label portals (same code pattern)

Use **`SUITEDASH_<PORTAL>_API_ID`** + **`SUITEDASH_<PORTAL>_API_SECRET`** + URL vars already in `env/.env.example`.

| Your inventory row | Env prefix (see `.env.example`) |
|--------------------|----------------------------------|
| SuiteDash - ClickonPage | `SUITEDASH_CLICKONPAGE_*` |
| SuiteDash - Coadjutant | `SUITEDASH_COADJUTANT_*` |
| SuiteDash - DeskVillage | `SUITEDASH_DESKVILLAGE_*` |
| SuiteDash - Domelaw | `SUITEDASH_DOMELAW_*` |
| SuiteDash - Instaxis | `SUITEDASH_INSTAXIS_*` |
| SuiteDash - NaijaClan | `SUITEDASH_NAIJACLAN_*` |
| SuiteDash - nawa | `SUITEDASH_NAWA_*` |
| SuiteDash - Notroom | `SUITEDASH_NOTROOM_*` |
| SuiteDash - Relguard | `SUITEDASH_RELGUARD_*` |
| SuiteDash - SitBid | `SUITEDASH_SITBID_*` |

For each: **Public ID** → `*_API_ID`. **Secure API Secret Key** (plaintext from UI) → `*_API_SECRET`. Ignore `$2y$…` hashes for REST API.

## Tier C — optional / not wired in code yet

Present in `env/.env.example` (optional block). Safe to leave blank until you add integrations.

| Your inventory label | Variable(s) |
|---------------------|-------------|
| Anthropic | `ANTHROPIC_API_KEY` |
| Vercel | `VERCEL_TOKEN` |
| Railway | `RAILWAY_TOKEN` |
| Make / Pabbly / Formaloo / Slack / Twilio / Google Calendar | As in `.env.example` |
| Brilliant Directory | `BD_API_KEY` |
| DeepSeek | `DEEPSEEK_API_KEY` |
| OpenRouter | `OPENROUTER_API_KEY` |
| Google Gemini | `GEMINI_API_KEY` |
| DigitalOcean | `DIGITALOCEAN_TOKEN` |
| GitHub | `GITHUB_TOKEN` |
| Fireworks AI | `FIREWORKS_API_KEY` |
| Acumbamail | `ACUMBAMAIL_API_KEY` |
| Afforai / Logically | `AFFORAI_API_KEY` |
| Agiled | `AGILED_API_KEY` |
| Alttext.ai | `ALTTEXT_AI_API_KEY` |
| Certopus | `CERTOPUS_API_KEY` |
| Crove | `CROVE_API_KEY` |
| Envato | `ENVATO_TOKEN` |
| exa.ai | `EXA_API_KEY` |
| Flowlu | `FLOWLU_API_KEY` |
| Insighto AI | `INSIGHTO_API_KEY` |
| NeuronWriter | `NEURONWRITER_API_KEY` |
| OutScraper | `OUTSCRAPER_API_KEY` |
| Printful | `PRINTFUL_TOKEN` |
| Procesio | `PROCESIO_TOKEN` |
| Pulsetic | `PULSETIC_API_KEY` |
| Reoon | `REOON_API_KEY` |
| RepliQ | `REPLIQ_JWT` |
| sam.gov | `SAM_GOV_API_KEY` |
| Smithery | `SMITHERY_API_KEY` |
| Straico | `STRAICO_API_KEY` |
| Switchboard ai GET / POST | `SWITCHBOARD_AI_GET_KEY`, `SWITCHBOARD_AI_POST_KEY` |
| Taskade | `TASKADE_API_KEY` |
| Thoughtly | `THOUGHTLY_API_KEY`, `THOUGHTLY_API_SECRET` |
| ThriveCart | `THRIVECART_API_KEY` |
| Upviral | `UPVIRAL_API_KEY` |
| Vadoo AI | `VADOO_AI_API_KEY` |
| VBout | `VBOUT_API_KEY` |
| MarkUpGo | `MARKUPGO_API_KEY` |
| nichesss | `NICHESSS_API_KEY` |
| Paced Email | `PACED_EMAIL_SECRET` |
| Claspo | `CLASPO_SCRIPT_ID` |
| LLama Default Key | `LLAMA_API_KEY` |

## What this repo **actually reads** today

Scripts and agents load **`dotenv`** from **`.env`** then **`env/.env`**.  
Variables **read in code** are mainly Tier A + AiTable table IDs + app settings. Tier C names are reserved for future use unless you extend `agents/` or `scripts/`.

## One-time setup

```bash
cp env/.env.example .env
# Fill Tier A (and B if multi-portal). Save. Never git add .env
npm run test:api
```
