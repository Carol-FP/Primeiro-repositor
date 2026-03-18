import random
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="TikTok Shop Bestsellers API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Models ──────────────────────────────────────────────────────────────────

class HistoryPoint(BaseModel):
    date: str
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
    status: str
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

# ─── Mock data ────────────────────────────────────────────────────────────────

def make_history(base_sales: int, base_price: float, growth: float) -> List[dict]:
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

RAW_PRODUCTS = [
    {
        "id": "p001",
        "name": "Stanley Quencher H2.0 FlowState Tumbler 40oz",
        "brand": "Stanley",
        "category": "Home Decor",
        "price": 45.00,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Stanley",
        "rating": 4.8,
        "review_count": 128450,
        "sales_7d": 52300,
        "sales_30d": 198000,
        "gmv_7d": 2353500.0,
        "gmv_30d": 8910000.0,
        "growth_rate": 142.5,
        "trend_score": 98.7,
        "creator_count": 8420,
        "status": "trending",
    },
    {
        "id": "p002",
        "name": "Dyson Airwrap Multi-Styler Complete",
        "brand": "Dyson",
        "category": "Beauty",
        "price": 599.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Dyson",
        "rating": 4.7,
        "review_count": 89230,
        "sales_7d": 12800,
        "sales_30d": 47500,
        "gmv_7d": 7679872.0,
        "gmv_30d": 28499525.0,
        "growth_rate": 87.3,
        "trend_score": 95.2,
        "creator_count": 5680,
        "status": "trending",
    },
    {
        "id": "p003",
        "name": "LED Strip Lights 100ft Smart RGB",
        "brand": "Govee",
        "category": "Electronics",
        "price": 29.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=LED+Strip",
        "rating": 4.5,
        "review_count": 67890,
        "sales_7d": 38500,
        "sales_30d": 141000,
        "gmv_7d": 1154615.0,
        "gmv_30d": 4228590.0,
        "growth_rate": 63.8,
        "trend_score": 91.4,
        "creator_count": 4230,
        "status": "trending",
    },
    {
        "id": "p004",
        "name": "CeraVe Moisturizing Cream 19oz",
        "brand": "CeraVe",
        "category": "Beauty",
        "price": 18.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=CeraVe",
        "rating": 4.9,
        "review_count": 215670,
        "sales_7d": 71200,
        "sales_30d": 268000,
        "gmv_7d": 1351888.0,
        "gmv_30d": 5089320.0,
        "growth_rate": 34.2,
        "trend_score": 89.1,
        "creator_count": 12300,
        "status": "rising",
    },
    {
        "id": "p005",
        "name": "Ninja Creami Deluxe 11-in-1 Ice Cream Maker",
        "brand": "Ninja",
        "category": "Food & Beverage",
        "price": 199.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Ninja+Creami",
        "rating": 4.6,
        "review_count": 54320,
        "sales_7d": 18900,
        "sales_30d": 69000,
        "gmv_7d": 3779811.0,
        "gmv_30d": 13799310.0,
        "growth_rate": 78.9,
        "trend_score": 88.5,
        "creator_count": 3870,
        "status": "trending",
    },
    {
        "id": "p006",
        "name": "COSRX Advanced Snail 96 Mucin Power Essence",
        "brand": "COSRX",
        "category": "Beauty",
        "price": 25.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=COSRX",
        "rating": 4.7,
        "review_count": 98340,
        "sales_7d": 43600,
        "sales_30d": 162000,
        "gmv_7d": 1133164.0,
        "gmv_30d": 4210380.0,
        "growth_rate": 55.4,
        "trend_score": 87.9,
        "creator_count": 7540,
        "status": "trending",
    },
    {
        "id": "p007",
        "name": "Lululemon Align High-Rise Pant 28\"",
        "brand": "Lululemon",
        "category": "Fashion",
        "price": 128.00,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Lululemon",
        "rating": 4.8,
        "review_count": 143200,
        "sales_7d": 29400,
        "sales_30d": 108000,
        "gmv_7d": 3763200.0,
        "gmv_30d": 13824000.0,
        "growth_rate": 41.7,
        "trend_score": 86.3,
        "creator_count": 6120,
        "status": "rising",
    },
    {
        "id": "p008",
        "name": "Apple AirPods Pro (2nd Gen) with MagSafe",
        "brand": "Apple",
        "category": "Electronics",
        "price": 249.00,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=AirPods+Pro",
        "rating": 4.9,
        "review_count": 387560,
        "sales_7d": 24100,
        "sales_30d": 89000,
        "gmv_7d": 5996900.0,
        "gmv_30d": 22161000.0,
        "growth_rate": 28.6,
        "trend_score": 85.0,
        "creator_count": 4890,
        "status": "stable",
    },
    {
        "id": "p009",
        "name": "The Ordinary Niacinamide 10% + Zinc 1%",
        "brand": "The Ordinary",
        "category": "Beauty",
        "price": 7.90,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=The+Ordinary",
        "rating": 4.6,
        "review_count": 176540,
        "sales_7d": 98700,
        "sales_30d": 364000,
        "gmv_7d": 779730.0,
        "gmv_30d": 2875600.0,
        "growth_rate": 47.3,
        "trend_score": 84.7,
        "creator_count": 15670,
        "status": "rising",
    },
    {
        "id": "p010",
        "name": "Beats Studio Pro Wireless Headphones",
        "brand": "Beats",
        "category": "Electronics",
        "price": 349.95,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Beats+Studio",
        "rating": 4.5,
        "review_count": 42180,
        "sales_7d": 8900,
        "sales_30d": 31500,
        "gmv_7d": 3114555.0,
        "gmv_30d": 11023425.0,
        "growth_rate": 19.4,
        "trend_score": 78.2,
        "creator_count": 2340,
        "status": "stable",
    },
    {
        "id": "p011",
        "name": "Bloom Nutrition Super Greens Powder",
        "brand": "Bloom Nutrition",
        "category": "Food & Beverage",
        "price": 39.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Bloom+Greens",
        "rating": 4.4,
        "review_count": 31290,
        "sales_7d": 22100,
        "sales_30d": 79000,
        "gmv_7d": 883779.0,
        "gmv_30d": 3159210.0,
        "growth_rate": 92.1,
        "trend_score": 93.6,
        "creator_count": 4560,
        "status": "trending",
    },
    {
        "id": "p012",
        "name": "Scrub Daddy Color Sponge (8-Pack)",
        "brand": "Scrub Daddy",
        "category": "Home Decor",
        "price": 19.97,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Scrub+Daddy",
        "rating": 4.7,
        "review_count": 89430,
        "sales_7d": 61200,
        "sales_30d": 228000,
        "gmv_7d": 1221564.0,
        "gmv_30d": 4553160.0,
        "growth_rate": 38.5,
        "trend_score": 82.1,
        "creator_count": 8900,
        "status": "rising",
    },
    {
        "id": "p013",
        "name": "Skims Cotton Rib Tank",
        "brand": "Skims",
        "category": "Fashion",
        "price": 42.00,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Skims",
        "rating": 4.5,
        "review_count": 67820,
        "sales_7d": 34500,
        "sales_30d": 124000,
        "gmv_7d": 1449000.0,
        "gmv_30d": 5208000.0,
        "growth_rate": 53.7,
        "trend_score": 86.8,
        "creator_count": 7120,
        "status": "trending",
    },
    {
        "id": "p014",
        "name": "PowerXL Air Fryer Pro 6QT",
        "brand": "PowerXL",
        "category": "Food & Beverage",
        "price": 89.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Air+Fryer",
        "rating": 4.3,
        "review_count": 23410,
        "sales_7d": 15600,
        "sales_30d": 54000,
        "gmv_7d": 1403844.0,
        "gmv_30d": 4859460.0,
        "growth_rate": -8.2,
        "trend_score": 52.3,
        "creator_count": 1890,
        "status": "declining",
    },
    {
        "id": "p015",
        "name": "Revlon One-Step Volumizer PLUS 2.0",
        "brand": "Revlon",
        "category": "Beauty",
        "price": 59.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Revlon",
        "rating": 4.4,
        "review_count": 112340,
        "sales_7d": 27800,
        "sales_30d": 101000,
        "gmv_7d": 1667722.0,
        "gmv_30d": 6059900.0,
        "growth_rate": 22.8,
        "trend_score": 75.4,
        "creator_count": 5430,
        "status": "stable",
    },
    {
        "id": "p016",
        "name": "Anker Portable Charger 20000mAh",
        "brand": "Anker",
        "category": "Electronics",
        "price": 35.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Anker",
        "rating": 4.6,
        "review_count": 78920,
        "sales_7d": 41300,
        "sales_30d": 152000,
        "gmv_7d": 1486387.0,
        "gmv_30d": 5470480.0,
        "growth_rate": 31.4,
        "trend_score": 79.6,
        "creator_count": 3210,
        "status": "stable",
    },
    {
        "id": "p017",
        "name": "Gymshark Flex Leggings",
        "brand": "Gymshark",
        "category": "Fitness",
        "price": 55.00,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Gymshark",
        "rating": 4.6,
        "review_count": 54670,
        "sales_7d": 31200,
        "sales_30d": 114000,
        "gmv_7d": 1716000.0,
        "gmv_30d": 6270000.0,
        "growth_rate": 67.9,
        "trend_score": 90.2,
        "creator_count": 6780,
        "status": "trending",
    },
    {
        "id": "p018",
        "name": "Theragun Prime Percussive Therapy Device",
        "brand": "Therabody",
        "category": "Fitness",
        "price": 299.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Theragun",
        "rating": 4.7,
        "review_count": 38920,
        "sales_7d": 9800,
        "sales_30d": 35500,
        "gmv_7d": 2939902.0,
        "gmv_30d": 10649645.0,
        "growth_rate": 44.6,
        "trend_score": 83.5,
        "creator_count": 2890,
        "status": "rising",
    },
    {
        "id": "p019",
        "name": "La Mer Moisturizing Cream 2oz",
        "brand": "La Mer",
        "category": "Beauty",
        "price": 345.00,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=La+Mer",
        "rating": 4.5,
        "review_count": 29870,
        "sales_7d": 4200,
        "sales_30d": 14800,
        "gmv_7d": 1449000.0,
        "gmv_30d": 5106000.0,
        "growth_rate": -12.3,
        "trend_score": 45.8,
        "creator_count": 980,
        "status": "declining",
    },
    {
        "id": "p020",
        "name": "Ghost Whey Protein Powder 2lb",
        "brand": "Ghost",
        "category": "Fitness",
        "price": 49.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Ghost+Protein",
        "rating": 4.5,
        "review_count": 41230,
        "sales_7d": 26700,
        "sales_30d": 97000,
        "gmv_7d": 1334733.0,
        "gmv_30d": 4849030.0,
        "growth_rate": 58.2,
        "trend_score": 88.0,
        "creator_count": 5340,
        "status": "trending",
    },
    {
        "id": "p021",
        "name": "Bogg Bag Original Large Tote",
        "brand": "Bogg Bag",
        "category": "Fashion",
        "price": 89.99,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Bogg+Bag",
        "rating": 4.6,
        "review_count": 18540,
        "sales_7d": 14300,
        "sales_30d": 51000,
        "gmv_7d": 1286857.0,
        "gmv_30d": 4589490.0,
        "growth_rate": 113.4,
        "trend_score": 94.3,
        "creator_count": 3450,
        "status": "trending",
    },
    {
        "id": "p022",
        "name": "Hoka Clifton 9 Running Shoe",
        "brand": "Hoka",
        "category": "Fitness",
        "price": 145.00,
        "thumbnail_url": "https://placehold.co/300x300/1a1a2e/FE2C55?text=Hoka",
        "rating": 4.8,
        "review_count": 62340,
        "sales_7d": 19600,
        "sales_30d": 71000,
        "gmv_7d": 2842000.0,
        "gmv_30d": 10295000.0,
        "growth_rate": 76.1,
        "trend_score": 92.7,
        "creator_count": 4120,
        "status": "trending",
    },
]

# Attach history to each product
PRODUCTS = []
for raw in RAW_PRODUCTS:
    hist = make_history(raw["sales_30d"], raw["price"], raw["growth_rate"])
    PRODUCTS.append({**raw, "history": hist})

CATEGORIES = [
    {"id": "all", "name": "All", "product_count": len(PRODUCTS)},
    {"id": "beauty", "name": "Beauty", "product_count": sum(1 for p in PRODUCTS if p["category"] == "Beauty")},
    {"id": "electronics", "name": "Electronics", "product_count": sum(1 for p in PRODUCTS if p["category"] == "Electronics")},
    {"id": "home-decor", "name": "Home Decor", "product_count": sum(1 for p in PRODUCTS if p["category"] == "Home Decor")},
    {"id": "fashion", "name": "Fashion", "product_count": sum(1 for p in PRODUCTS if p["category"] == "Fashion")},
    {"id": "food-beverage", "name": "Food & Beverage", "product_count": sum(1 for p in PRODUCTS if p["category"] == "Food & Beverage")},
    {"id": "fitness", "name": "Fitness", "product_count": sum(1 for p in PRODUCTS if p["category"] == "Fitness")},
]

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/api/products", response_model=List[Product])
def list_products(
    category: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("trend_score"),
    limit: int = Query(50, le=100),
    search: Optional[str] = Query(None),
):
    results = list(PRODUCTS)

    if category and category.lower() not in ("all", ""):
        cat_map = {
            "beauty": "Beauty",
            "electronics": "Electronics",
            "home-decor": "Home Decor",
            "fashion": "Fashion",
            "food-beverage": "Food & Beverage",
            "fitness": "Fitness",
        }
        target = cat_map.get(category.lower(), category)
        results = [p for p in results if p["category"].lower() == target.lower()]

    if search:
        q = search.lower()
        results = [p for p in results if q in p["name"].lower() or q in p["brand"].lower()]

    sort_fields = {
        "trend_score": lambda p: p["trend_score"],
        "growth_rate": lambda p: p["growth_rate"],
        "gmv_30d": lambda p: p["gmv_30d"],
        "sales_7d": lambda p: p["sales_7d"],
        "price": lambda p: p["price"],
        "rating": lambda p: p["rating"],
    }
    key_fn = sort_fields.get(sort_by, sort_fields["trend_score"])
    results.sort(key=key_fn, reverse=True)

    return results[:limit]


@app.get("/api/products/{product_id}", response_model=Product)
def get_product(product_id: str):
    for p in PRODUCTS:
        if p["id"] == product_id:
            return p
    raise HTTPException(status_code=404, detail="Product not found")


@app.get("/api/categories", response_model=List[Category])
def list_categories():
    return CATEGORIES


@app.get("/api/stats", response_model=Stats)
def get_stats():
    total_gmv = sum(p["gmv_30d"] for p in PRODUCTS)
    trending = sum(1 for p in PRODUCTS if p["status"] == "trending")
    avg_growth = sum(p["growth_rate"] for p in PRODUCTS) / len(PRODUCTS)
    return {
        "total_products": len(PRODUCTS),
        "total_gmv_30d": round(total_gmv, 2),
        "trending_count": trending,
        "avg_growth_rate": round(avg_growth, 1),
    }
