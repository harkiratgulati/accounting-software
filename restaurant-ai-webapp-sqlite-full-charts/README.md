# Restaurant AI Web App — SQLite FULL
Next.js 14 + Prisma (SQLite). Includes CSV import, forecast, margins, purchase list, digest.

## Run locally
```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```
Open http://localhost:3000 and go to /dashboard

## API routes
- POST /api/import (form-data: file=@sample-orders.csv)
- POST /api/forecast/rebuild
- GET  /api/menu/margins
- GET  /api/purchase-list?date=2025-08-23
- GET  /api/digest/today

## Charts page
- After importing data and rebuilding forecast, open `/dashboard/charts` to view line/bar charts.
