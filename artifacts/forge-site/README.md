# FORGE — Roxten Studios venture-building program site

Static site (no build step): `index.html` + `main.js` (landing page), `apply.html` + `apply.css` + `apply.js` (full-page application, served at `/apply`), shared `styles.css`, images in `assets/`.

## Rename the program
1. `main.js` → `PROGRAM_NAME` (updates every `[data-name]` element at runtime)
2. Search-replace `FORGE` in `index.html` (title/meta/static fallbacks) and `application.forge` window title.
3. Footer acronym line in `index.html`.

## Applications
The survey writes to the existing Firebase project (`roxten-studios`), collection **`venture_applications`**.
Each doc: name, email, phone, city, link, profile, pitch, problem, audience, stage, needs[], commitment, why, revshare, consent, ref, program, status:'new', source, createdAt.

**Before going live, deploy the updated rules** (`../../firestore.rules` now contains a `venture_applications` block — public create with shape checks, admin-only read):

```bash
firebase deploy --only firestore:rules
```

## Deploy on a subdomain (Vercel)
1. New Vercel project → root directory `artifacts/forge-site` → framework "Other" → no build command.
2. Project → Settings → Domains → add `forge.roxtenstudios.in`.
3. At your DNS provider add: `CNAME  forge  →  cname.vercel-dns.com`.

## Local preview
```bash
npx http-server@14.1.1 -p 5173 -c-1
```
