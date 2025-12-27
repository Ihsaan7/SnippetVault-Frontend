# SnippetVault — Frontend (Client) ⚡
A GitHub-inspired snippet manager built with React + Vite.

## What you can do
- Create, edit, delete code snippets
- Auto-detect language + syntax highlight (highlight.js)
- Favorite snippets
- Make snippets public, share by link, browse public snippets
- Fork public snippets into your account
- Search by text, tags, language, and date range
- View dashboard stats

## Tech Stack
- React (Vite)
- React Router
- Tailwind CSS
- Axios
- highlight.js

## UI/UX
- GitHub-like dark/light theme toggle
- Sharp edges (minimal rounding)
- Click code blocks to copy
- Responsive layout (mobile sidebar drawer)

## Important folders
- `src/pages/` — route pages
- `src/components/` — UI components
- `src/context/` — auth/snippet/theme context
- `src/utils/axios.js` — axios instance + auth header injection

## Environment Variables
Set on Vercel (Client project) or create `Client/.env` locally:
- `VITE_BACKEND_URL`
  - Local: `http://localhost:8000/api/v1`
  - Vercel: `https://<your-backend>.vercel.app/api/v1`

## Run locally
From `Client/`:
- `npm install`
- `npm run dev`
- `npm run build`

## Auth (deployment note)
In production (Vercel), auth uses `Authorization: Bearer <token>`.
- Token is stored in LocalStorage as `sv_access_token`
- User is stored as `sv_user`

## Deployment
- This is a SPA.
- `Client/vercel.json` contains rewrites so React Router routes work on refresh.

See `../DEPLOYMENT_ISSUES.md` for deployment gotchas and fixes.
