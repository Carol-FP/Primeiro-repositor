"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import StatsCards from "@/components/StatsCards";
import ProductTable from "@/components/ProductTable";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import { ArrowUpDown, Flame } from "lucide-react";

const SORT_OPTIONS = [
  { value: "trend_score", label: "Trend Score" },
  { value: "growth_rate", label: "Growth Rate" },
  { value: "gmv_30d", label: "GMV (30d)" },
  { value: "sales_7d", label: "Sales (7d)" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
];

export default function HomePage() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("trend_score");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", { category, search, sortBy }],
    queryFn: () =>
      fetchProducts({
        category: category === "all" ? undefined : category,
        search: search || undefined,
        sort_by: sortBy,
        limit: 50,
      }),
    staleTime: 30_000,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-5 h-5" style={{ color: "#FE2C55" }} />
          <h1 className="text-2xl font-bold text-white">
            TikTok Shop Bestsellers
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          Real-time trending products and GMV analytics across all categories
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Filters row */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-gray-600 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort by: {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <CategoryFilter selected={category} onSelect={setCategory} />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {isLoading ? (
            <span className="animate-pulse">Loading products...</span>
          ) : (
            <>
              Showing{" "}
              <span className="text-gray-200 font-medium">{products.length}</span>{" "}
              products
              {category !== "all" && (
                <>
                  {" "}in{" "}
                  <span className="text-gray-200 font-medium">{category}</span>
                </>
              )}
              {search && (
                <>
                  {" "}matching{" "}
                  <span className="text-gray-200 font-medium">"{search}"</span>
                </>
              )}
            </>
          )}
        </p>
      </div>

      {/* Table */}
      <ProductTable products={products} isLoading={isLoading} />
    </div>
  );
}
