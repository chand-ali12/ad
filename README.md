# AD Frontend

Authentic Detective frontend repository.

## Project structure

| Folder | Purpose |
|--------|--------|
| **`client/`** | **Main project** — the app you build and run. Vite + React + Redux + Tailwind. |
| **`authentic-detective-talha/`** | **Legacy / API reference only** — old Next.js project. Not part of the active app. Some APIs may be reused in the future; keep for reference. |

## Getting started

- **Run the app:** `cd client && npm install && npm run dev`
- **Build:** From repo root: `npm run build` (builds `client`)

All day-to-day development happens in **`client/`**. Use `authentic-detective-talha` only when you need to look up API endpoints or request/response shapes.
