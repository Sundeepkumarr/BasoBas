# hamro-awas

hamro-awas is a full-stack real estate marketplace with:

- Frontend: React + Vite (`client`)
- Backend: Express + Prisma (`server`)

## Deploy to Render

This repository includes a Render Blueprint file: `render.yaml`.

### What gets created

- `hamro-awas-api` (Node web service from `server`)
- `hamro-awas-client` (Static site from `client`)
- `hamro-awas-db` (Render Postgres database)

### Deployment steps

1. Push this branch to GitHub.
2. In Render, go to **New > Blueprint**.
3. Connect this repository and deploy from `render.yaml`.
4. During setup, provide required env vars that are marked with `sync: false`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_MAPS_API_KEY`

### Important notes

- `CLIENT_URL` supports multiple comma-separated origins (for example local + Render domain).
- `VITE_API_URL` is set in the Blueprint to point the frontend to the API service URL.
- Prisma migrations run before backend deploy via `preDeployCommand`.
