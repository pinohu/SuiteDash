# Environment files

- **`.env.example`** — Safe template: copy to **project root `.env`** (or use `env/.env`). Fill from your vault; never commit real values.
- **`docs/CREDENTIALS_INVENTORY.md`** — Maps named services (your inventory) → variable names.

```bash
# From repo root
cp env/.env.example .env
```

SuiteDash **Secure API** uses **`X-Public-ID`** + **`X-Secret-Key`**. The value in `SUITEDASH_*_API_SECRET` must be the **Secret Key** from the SuiteDash UI, not a `$2y$…` bcrypt hash.
