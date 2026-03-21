# Deployment (push to production)

The default path is **Render** + **Render Postgres** + **auto-deploy on every push** to `main`. After a one-time Blueprint setup, you only **push** to GitHub; Render builds and deploys both apps.

> **Security:** If a database URL or password was ever committed or shared, rotate it in the provider and update env vars.

---

## One-time setup (about 10 minutes)

1. Push this repo to **GitHub** (or GitLab).
2. In [Render](https://render.com): **New +** → **Blueprint** → select the repo.
3. Review [`render.yaml`](render.yaml) and click **Apply** (creates Postgres + backend + frontend).
4. Wait until deploys finish (first build can take several minutes).
5. Open **`https://word-search-backend.onrender.com/admin`**, create the Strapi admin user.
6. Open **`https://word-search-frontend.onrender.com`** and smoke-test search.

**That’s it for configuration** — `DATABASE_URL` is wired from Render Postgres; `NEXT_PUBLIC_API_BASE_URL` and `CORS_ORIGIN` are set in the Blueprint to match the fixed service names.

---

## Day-to-day: only push

- **Branch:** `main` (set in `render.yaml`; change if your default branch differs).
- **Trigger:** `autoDeployTrigger: commit` — each push to `main` redeploys both web services.
- No manual env edits unless you rename services, add a custom domain, or switch database provider.

---

## If you rename a Render service

Render URLs are `https://<service-name>.onrender.com`. If you change `name:` under `services` in `render.yaml`, update in the same file:

- `CORS_ORIGIN` on the backend → frontend’s public URL  
- `NEXT_PUBLIC_API_BASE_URL` on the frontend → backend’s public URL  

Commit and push; the next deploy picks up the change.

---

## Using Neon (or another external Postgres) instead

The checked-in [`render.yaml`](render.yaml) provisions **Render Postgres** so nothing is pasted by hand. To use **Neon** (or similar):

1. Remove the `databases:` block from `render.yaml`.
2. On the backend service in Render, set **`DATABASE_URL`** to your external connection string (Dashboard → Environment).
3. Keep `DATABASE_CLIENT=postgres` and `DATABASE_SSL_REJECT_UNAUTHORIZED` as in the file.

You still get **push-to-deploy**; you only maintain `DATABASE_URL` in the dashboard (or an [environment group](https://render.com/docs/configure-environment-variables#environment-groups)).

---

## Manual services (no Blueprint)

If you create web services by hand instead of a Blueprint, use root directories `backend-strapi` / `frontend-next`, the same build/start commands as in `render.yaml`, and the same env vars as in that file.

---

## After deploy

1. Strapi admin: `https://word-search-backend.onrender.com/admin`
2. API: `https://word-search-backend.onrender.com/api`
3. App: `https://word-search-frontend.onrender.com`

If the UI cannot reach the API: confirm `NEXT_PUBLIC_API_BASE_URL` and `CORS_ORIGIN` still match your real URLs (including `https://`).

---

## Local production-style check

```bash
cd backend-strapi && docker-compose up postgres -d
# Configure .env from .env.example, then:
npm install && npm run build && npm start
```

```bash
cd frontend-next
cp .env.local.example .env.local
npm install && npm run build && npm start
```

---

## Troubleshooting

| Issue | What to check |
|--------|----------------|
| Backend boot fails | Logs on Render, `DATABASE_URL`, SSL flags |
| Frontend / CORS | URLs in `render.yaml` vs actual Render URLs, `https://` |
| Cold starts (free tier) | First request after idle can take ~30s |

---

## Cost note

`render.yaml` uses **`plan: free`** for Postgres when your workspace supports it. If the Blueprint apply fails on the database step, switch to `basic-256mb` (or another [supported plan](https://render.com/docs/postgresql)) in `render.yaml` and push again.
