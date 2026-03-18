# TikTok Shop Bestsellers Tracker — Project Briefing

Complete specification for recreating this project from scratch.

---

## Overview

A full-stack e-commerce analytics dashboard that tracks trending products on TikTok Shop.
It shows rankings, GMV (Gross Merchandise Value), sales metrics, growth rates, and 30-day trend charts.

**App name in UI:** TikTrack
**Brand color:** TikTok Pink `#FE2C55`, Cyan `#25F4EE`, Dark `#010101`
**Theme:** Dark mode throughout

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | Python 3.11+, FastAPI 0.111.0, Uvicorn 0.30.1  |
| Frontend   | Next.js 14.2.3, React 18, TypeScript 5          |
| Styling    | Tailwind CSS 3.4.4                               |
| HTTP       | Axios 1.7.2                                      |
| Data state | @tanstack/react-query 5.45.0                    |
| Charts     | Recharts 2.12.7                                  |
| Icons      | lucide-react 0.395.0                            |

---

## Directory Structure

```
root/
├── backend/
│   ├── main.py              # FastAPI app — all logic in one file
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx               # Root layout + navbar
│   │   │   ├── page.tsx                 # Dashboard (home)
│   │   │   ├── providers.tsx            # React Query wrapper
│   │   │   ├── globals.css
│   │   │   └── products/
│   │   │       └── [id]/
│   │   │           └── page.tsx         # Product detail page
│   │   ├── components/
│   │   │   ├── StatsCards.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── lib/
│   │   │   ├── api.ts                   # Axios client + API calls
│   │   │   └── mockData.ts              # Frontend fallback data
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

---

## Backend

### requirements.txt

```
fastapi==0.111.0
uvicorn==0.30.1
httpx==0.27.0
python-dotenv==1.0.1
pydantic==2.7.1
```

### .env.example

```
TIKTOK_SHOP_API_KEY=your_key_here
DATA_PROVIDER=mock  # mock | tiktok_api | kalodata
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:pass@localhost/tiktokshop
```

### API Endpoints (backend/main.py)

CORS is enabled for all origins (`*`). All routes prefixed with `/api`.

| Method | Path                        | Query Params                                               | Response            |
|--------|-----------------------------|------------------------------------------------------------|---------------------|
| GET    | `/api/products`             | `category`, `sort_by`, `search`, `limit` (default 50, max 100) | `List[Product]` |
| GET    | `/api/products/{product_id}` | —                                                         | `Product`           |
| GET    | `/api/categories`           | —                                                          | `List[Category]`    |
| GET    | `/api/stats`                | —                                                          | `Stats`             |

**Sort options for `sort_by`:** `trend_score` (default), `growth_rate`, `gmv_30d`, `sales_7d`, `price`, `rating`

**Category slug mapping:**

| Slug            | Display Name    |
|-----------------|-----------------|
| `beauty`        | Beauty          |
| `electronics`   | Electronics     |
| `home-decor`    | Home Decor      |
| `fashion`       | Fashion         |
| `food-beverage` | Food & Beverage |
| `fitness`       | Fitness         |

### Pydantic Models

```python
class HistoryPoint(BaseModel):
    date: str      # YYYY-MM-DD
    sales: int
    gmv: float

class Product(BaseModel):
    id: str
    name: str
    brand: str
    category: str
    price: float
    thumbnail_url: str
    rating: float
    review_count: int
    sales_7d: int
    sales_30d: int
    gmv_7d: float
    gmv_30d: float
    growth_rate: float
    trend_score: float
    creator_count: int
    status: str          # "trending" | "rising" | "stable" | "declining"
    history: List[HistoryPoint] = []

class Category(BaseModel):
    id: str
    name: str
    product_count: int

class Stats(BaseModel):
    total_products: int
    total_gmv_30d: float
    trending_count: int
    avg_growth_rate: float
```

### History Generation Logic

```python
def make_history(base_sales, base_price, growth):
    history = []
    today = datetime.now()
    for i in range(29, -1, -1):
        date = today - timedelta(days=i)
        factor = 1 + (growth / 100) * ((29 - i) / 29)
        daily_sales = max(1, int(base_sales / 30 * factor * random.uniform(0.7, 1.3)))
        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "sales": daily_sales,
            "gmv": round(daily_sales * base_price, 2),
        })
    return history
```

### All 22 Mock Products

```python
[
  # id, name, brand, category, price, rating, review_count,
  # sales_7d, sales_30d, gmv_7d, gmv_30d, growth_rate, trend_score, creator_count, status

  ("p001","Stanley Quencher H2.0 FlowState Tumbler 40oz","Stanley","Home Decor",45.00,4.8,128450,52300,198000,2353500,8910000,142.5,98.7,8420,"trending"),
  ("p002","Dyson Airwrap Multi-Styler Complete","Dyson","Beauty",599.99,4.7,89230,12800,47500,7679872,28499525,87.3,95.2,5680,"trending"),
  ("p003","LED Strip Lights 100ft Smart RGB","Govee","Electronics",29.99,4.5,67890,38500,141000,1154615,4228590,63.8,91.4,4230,"trending"),
  ("p004","CeraVe Moisturizing Cream 19oz","CeraVe","Beauty",18.99,4.9,215670,71200,268000,1351888,5089320,34.2,89.1,12300,"rising"),
  ("p005","Ninja Creami Deluxe 11-in-1 Ice Cream Maker","Ninja","Food & Beverage",199.99,4.6,54320,18900,69000,3779811,13799310,78.9,88.5,3870,"trending"),
  ("p006","COSRX Advanced Snail 96 Mucin Power Essence","COSRX","Beauty",25.99,4.7,98340,43600,162000,1133164,4210380,55.4,87.9,7540,"trending"),
  ("p007","Lululemon Align High-Rise Pant 28\"","Lululemon","Fashion",128.00,4.8,143200,29400,108000,3763200,13824000,41.7,86.3,6120,"rising"),
  ("p008","Apple AirPods Pro (2nd Gen) with MagSafe","Apple","Electronics",249.00,4.9,387560,24100,89000,5996900,22161000,28.6,85.0,4890,"stable"),
  ("p009","The Ordinary Niacinamide 10% + Zinc 1%","The Ordinary","Beauty",7.90,4.6,176540,98700,364000,779730,2875600,47.3,84.7,15670,"rising"),
  ("p010","Beats Studio Pro Wireless Headphones","Beats","Electronics",349.95,4.5,42180,8900,31500,3114555,11023425,19.4,78.2,2340,"stable"),
  ("p011","Bloom Nutrition Super Greens Powder","Bloom Nutrition","Food & Beverage",39.99,4.4,31290,22100,79000,883779,3159210,92.1,93.6,4560,"trending"),
  ("p012","Scrub Daddy Color Sponge (8-Pack)","Scrub Daddy","Home Decor",19.97,4.7,89430,61200,228000,1221564,4553160,38.5,82.1,8900,"rising"),
  ("p013","Skims Cotton Rib Tank","Skims","Fashion",42.00,4.5,67820,34500,124000,1449000,5208000,53.7,86.8,7120,"trending"),
  ("p014","PowerXL Air Fryer Pro 6QT","PowerXL","Food & Beverage",89.99,4.3,23410,15600,54000,1403844,4859460,-8.2,52.3,1890,"declining"),
  ("p015","Revlon One-Step Volumizer PLUS 2.0","Revlon","Beauty",59.99,4.4,112340,27800,101000,1667722,6059900,22.8,75.4,5430,"stable"),
  ("p016","Anker Portable Charger 20000mAh","Anker","Electronics",35.99,4.6,78920,41300,152000,1486387,5470480,31.4,79.6,3210,"stable"),
  ("p017","Gymshark Flex Leggings","Gymshark","Fitness",55.00,4.6,54670,31200,114000,1716000,6270000,67.9,90.2,6780,"trending"),
  ("p018","Theragun Prime Percussive Therapy Device","Therabody","Fitness",299.99,4.7,38920,9800,35500,2939902,10649645,44.6,83.5,2890,"rising"),
  ("p019","La Mer Moisturizing Cream 2oz","La Mer","Beauty",345.00,4.5,29870,4200,14800,1449000,5106000,-12.3,45.8,980,"declining"),
  ("p020","Ghost Whey Protein Powder 2lb","Ghost","Fitness",49.99,4.5,41230,26700,97000,1334733,4849030,58.2,88.0,5340,"trending"),
  ("p021","Bogg Bag Original Large Tote","Bogg Bag","Fashion",89.99,4.6,18540,14300,51000,1286857,4589490,113.4,94.3,3450,"trending"),
  ("p022","Hoka Clifton 9 Running Shoe","Hoka","Fitness",145.00,4.8,62340,19600,71000,2842000,10295000,76.1,92.7,4120,"trending"),
]
```

**Thumbnail URL pattern:** `https://placehold.co/300x300/1a1a2e/FE2C55?text=<ProductName>`

### How to run backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## Frontend

### package.json dependencies

```json
{
  "dependencies": {
    "next": "14.2.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "axios": "^1.7.2",
    "recharts": "^2.12.7",
    "lucide-react": "^0.395.0",
    "@tanstack/react-query": "^5.45.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.4.4",
    "postcss": "^8.4.38",
    "autoprefixer": "^10.4.19",
    "eslint": "^8",
    "eslint-config-next": "14.2.3"
  }
}
```

### tailwind.config.js custom colors

```js
theme: {
  extend: {
    colors: {
      tiktok: {
        pink: "#FE2C55",
        cyan: "#25F4EE",
        dark: "#010101",
      },
    },
  },
},
```

### next.config.js

```js
images: {
  domains: ["placehold.co"],
}
```

### TypeScript Types (src/types/index.ts)

```typescript
export interface HistoryPoint {
  date: string;       // YYYY-MM-DD
  sales: number;
  gmv: number;
}

export type ProductStatus = "trending" | "rising" | "stable" | "declining";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  thumbnail_url: string;
  rating: number;
  review_count: number;
  sales_7d: number;
  sales_30d: number;
  gmv_7d: number;
  gmv_30d: number;
  growth_rate: number;   // percentage, can be negative
  trend_score: number;   // 0–100
  creator_count: number;
  status: ProductStatus;
  history: HistoryPoint[];
}

export interface Category {
  id: string;
  name: string;
  product_count: number;
}

export interface Stats {
  total_products: number;
  total_gmv_30d: number;
  trending_count: number;
  avg_growth_rate: number;
}

export interface ProductFilters {
  category?: string;
  sort_by?: string;
  search?: string;
  limit?: number;
}
```

### API Client (src/lib/api.ts)

- Axios base URL: `http://localhost:8000` (override with `NEXT_PUBLIC_API_URL`)
- 4 exported async functions: `fetchProducts(filters)`, `fetchProduct(id)`, `fetchCategories()`, `fetchStats()`
- On any network error, automatically falls back to frontend mock data from `mockData.ts`

### React Query config (src/app/providers.tsx)

```ts
new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: 1 },
  },
})
```

### Component Summary

| Component          | Purpose                                                                                  |
|--------------------|------------------------------------------------------------------------------------------|
| `StatsCards`       | 4 summary cards: total products, total GMV 30d, trending count, avg growth rate. Skeleton loaders included. |
| `ProductTable`     | Sortable table with 9 columns. Clicking a row navigates to `/products/[id]`. Client-side sort asc/desc. |
| `CategoryFilter`   | Horizontal pill buttons for 7 categories. Shows product count per category. Active state uses `#FE2C55`. |
| `SearchBar`        | Debounced input. Shows a clear (X) button when text is present.                          |
| `TrendChart`       | 30-day area chart (Recharts). Toggle between "Sales Volume" and "GMV Revenue". Gradient fill with `#FE2C55`. |
| `StatusBadge`      | Color-coded dot + label: trending=green, rising=blue, stable=gray, declining=red.       |

### Pages

**`/` (Dashboard)**
- Fetches products, categories, stats with React Query (30s stale time)
- Renders: `StatsCards` → `SearchBar` + `CategoryFilter` → `ProductTable`
- Sort dropdown options: Trend Score, Growth Rate, GMV 30d, Sales 7d, Price, Rating

**`/products/[id]` (Detail)**
- Fetches single product by ID
- Shows: product image, name, brand, category, price, rating, status badge
- 8 metric cards: Sales 7d, Sales 30d, GMV 7d, GMV 30d, Growth Rate, Trend Score, Creator Count, Rating
- `TrendChart` for 30-day history
- Growth rate shown with up (green) / down (red) chevron icon

**`layout.tsx` (Root Layout)**
- Sticky top navbar with "TikTrack" logo in `#FE2C55`
- Green live dot indicator ("Live")
- Dark background `bg-gray-950`

### How to run frontend

```bash
cd frontend
npm install
npm run dev       # runs on http://localhost:3000
```

---

## Environment Variables

| Variable              | Where          | Default                              | Description                          |
|-----------------------|----------------|--------------------------------------|--------------------------------------|
| `NEXT_PUBLIC_API_URL` | frontend `.env` | `http://localhost:8000`             | Backend base URL                     |
| `TIKTOK_SHOP_API_KEY` | backend `.env` | —                                    | For live TikTok Shop API             |
| `DATA_PROVIDER`       | backend `.env` | `mock`                               | `mock` \| `tiktok_api` \| `kalodata` |
| `REDIS_URL`           | backend `.env` | `redis://localhost:6379`             | Optional caching                     |
| `DATABASE_URL`        | backend `.env` | `postgresql://user:pass@localhost/…` | Optional persistence                 |

---

## Key Design Decisions

1. **Backend uses only mock data** — no live TikTok API integration needed to run
2. **Frontend has full mock data fallback** — works without backend running at all
3. **History is procedurally generated** — trending products show upward curve, declining products show downward curve
4. **Status values:** `trending` = high growth (>40%), `rising` = moderate growth, `stable` = low growth, `declining` = negative growth
5. **No authentication** — this is a read-only public dashboard
6. **CORS allows all origins** — development-friendly configuration

---

## Running Both Together

```bash
# Terminal 1 — backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000

# Terminal 2 — frontend
cd frontend && npm install && npm run dev
```

Then open `http://localhost:3000`.
