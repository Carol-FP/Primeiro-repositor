# TikTok Shop Bestsellers Tracker

A full-stack dashboard for tracking trending products and GMV analytics on TikTok Shop. Built with FastAPI (backend) and Next.js 14 (frontend).

---

## Features

- Real-time trending product rankings with trend score and growth rate
- GMV (Gross Merchandise Value) analytics for 7-day and 30-day windows
- 30-day sales/revenue line charts per product
- Category filtering (Beauty, Electronics, Home Decor, Fashion, Food & Beverage, Fitness)
- Search by product name or brand
- Sortable product table (trend score, GMV, growth, price, etc.)
- Status badges: Trending / Rising / Stable / Declining
- Product detail pages with full analytics breakdown
- Frontend falls back to mock data automatically when the backend is unreachable

---

## Project Structure

```
.
├── backend/
│   ├── main.py            # FastAPI application
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx           # Main dashboard
    │   │   ├── providers.tsx      # React Query provider
    │   │   └── products/[id]/page.tsx
    │   ├── components/
    │   │   ├── StatsCards.tsx
    │   │   ├── ProductTable.tsx
    │   │   ├── CategoryFilter.tsx
    │   │   ├── SearchBar.tsx
    │   │   ├── TrendChart.tsx
    │   │   └── StatusBadge.tsx
    │   ├── lib/
    │   │   ├── api.ts             # Axios client + API functions
    │   │   └── mockData.ts        # Frontend fallback mock data
    │   └── types/
    │       └── index.ts
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## Quick Start

### Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

API docs (Swagger UI): `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The dashboard will be available at `http://localhost:3000`.

> The frontend automatically falls back to built-in mock data if the backend is not running, so you can develop without the backend.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products with optional filters |
| GET | `/api/products/{id}` | Product detail with 30-day history |
| GET | `/api/categories` | List all categories |
| GET | `/api/stats` | Dashboard stats (GMV, trending count, etc.) |

### Query Parameters for `/api/products`

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category slug (e.g. `beauty`, `electronics`) |
| `sort_by` | string | One of: `trend_score`, `growth_rate`, `gmv_30d`, `sales_7d`, `price`, `rating` |
| `search` | string | Search by product name or brand |
| `limit` | int | Max results (default 50, max 100) |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `TIKTOK_SHOP_API_KEY` | TikTok Shop API key (for future live data integration) |
| `DATA_PROVIDER` | `mock` \| `tiktok_api` \| `kalodata` |
| `REDIS_URL` | Redis connection URL (for caching) |
| `DATABASE_URL` | PostgreSQL connection URL (for persistence) |

### Frontend

Set `NEXT_PUBLIC_API_URL` to point to your backend (defaults to `http://localhost:8000`).

---

## Tech Stack

**Backend**
- Python 3.11+
- FastAPI 0.111
- Uvicorn
- Pydantic v2
- python-dotenv

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Recharts (charts)
- TanStack React Query (data fetching)
- Axios
- Lucide React (icons)

---

## Production Build

```bash
# Frontend
cd frontend
npm run build
npm start

# Backend
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```
