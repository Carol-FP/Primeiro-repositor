import axios from "axios";
import { Product, Category, Stats, ProductFilters } from "@/types";
import { mockProducts, mockCategories, mockStats } from "./mockData";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

function filterAndSortProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  let result = [...products];

  if (filters.category && filters.category !== "all") {
    const catMap: Record<string, string> = {
      beauty: "Beauty",
      electronics: "Electronics",
      "home-decor": "Home Decor",
      fashion: "Fashion",
      "food-beverage": "Food & Beverage",
      fitness: "Fitness",
    };
    const target = catMap[filters.category] || filters.category;
    result = result.filter(
      (p) => p.category.toLowerCase() === target.toLowerCase()
    );
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  const sortKey = (filters.sort_by || "trend_score") as keyof Product;
  result.sort((a, b) => {
    const av = a[sortKey] as number;
    const bv = b[sortKey] as number;
    return bv - av;
  });

  if (filters.limit) {
    result = result.slice(0, filters.limit);
  }

  return result;
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  try {
    const params: Record<string, string | number> = {};
    if (filters.category) params.category = filters.category;
    if (filters.sort_by) params.sort_by = filters.sort_by;
    if (filters.search) params.search = filters.search;
    if (filters.limit) params.limit = filters.limit;

    const { data } = await apiClient.get<Product[]>("/api/products", { params });
    return data;
  } catch {
    // Fallback to mock data
    return filterAndSortProducts(mockProducts, filters);
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  try {
    const { data } = await apiClient.get<Product>(`/api/products/${id}`);
    return data;
  } catch {
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data } = await apiClient.get<Category[]>("/api/categories");
    return data;
  } catch {
    return mockCategories;
  }
}

export async function fetchStats(): Promise<Stats> {
  try {
    const { data } = await apiClient.get<Stats>("/api/stats");
    return data;
  } catch {
    return mockStats;
  }
}
