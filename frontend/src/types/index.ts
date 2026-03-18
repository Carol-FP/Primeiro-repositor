export interface HistoryPoint {
  date: string;
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
  growth_rate: number;
  trend_score: number;
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
