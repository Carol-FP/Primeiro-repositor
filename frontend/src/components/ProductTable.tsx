"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, Users, Star } from "lucide-react";
import { Product } from "@/types";
import StatusBadge from "./StatusBadge";

interface ProductTableProps {
  products: Product[];
  isLoading?: boolean;
}

type SortField =
  | "rank"
  | "price"
  | "sales_7d"
  | "gmv_30d"
  | "growth_rate"
  | "trend_score"
  | "creator_count";

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function formatSales(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

function GrowthBadge({ rate }: { rate: number }) {
  const isPositive = rate >= 0;
  const Icon = isPositive ? ChevronUp : ChevronDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-sm font-semibold ${
        isPositive ? "text-green-400" : "text-red-400"
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {Math.abs(rate).toFixed(1)}%
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-800/50">
      {[...Array(9)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-800 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

interface SortButtonProps {
  field: SortField;
  currentField: SortField;
  direction: "asc" | "desc";
  onClick: (field: SortField) => void;
  children: React.ReactNode;
}

function SortButton({ field, currentField, direction, onClick, children }: SortButtonProps) {
  const isActive = field === currentField;
  return (
    <button
      className={`flex items-center gap-1 hover:text-gray-200 transition-colors ${
        isActive ? "text-gray-200" : "text-gray-500"
      }`}
      onClick={() => onClick(field)}
    >
      {children}
      <span className="flex flex-col">
        <ChevronUp
          className={`w-3 h-3 -mb-1 ${
            isActive && direction === "asc" ? "text-tiktok-pink opacity-100" : "opacity-30"
          }`}
          style={isActive && direction === "asc" ? { color: "#FE2C55" } : undefined}
        />
        <ChevronDown
          className={`w-3 h-3 ${
            isActive && direction === "desc" ? "opacity-100" : "opacity-30"
          }`}
          style={isActive && direction === "desc" ? { color: "#FE2C55" } : undefined}
        />
      </span>
    </button>
  );
}

export default function ProductTable({ products, isLoading = false }: ProductTableProps) {
  const [sortField, setSortField] = useState<SortField>("trend_score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const sorted = [...products].sort((a, b) => {
    let av: number, bv: number;
    if (sortField === "rank") {
      av = a.trend_score;
      bv = b.trend_score;
    } else {
      av = a[sortField] as number;
      bv = b[sortField] as number;
    }
    return sortDir === "desc" ? bv - av : av - bv;
  });

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/50">
              <th className="px-4 py-3 text-left">
                <SortButton field="rank" currentField={sortField} direction={sortDir} onClick={handleSort}>
                  <span className="text-xs font-medium uppercase tracking-wider">Rank</span>
                </SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="price" currentField={sortField} direction={sortDir} onClick={handleSort}>
                  <span className="text-xs font-medium uppercase tracking-wider">Price</span>
                </SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="sales_7d" currentField={sortField} direction={sortDir} onClick={handleSort}>
                  <span className="text-xs font-medium uppercase tracking-wider">Sales 7d</span>
                </SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="gmv_30d" currentField={sortField} direction={sortDir} onClick={handleSort}>
                  <span className="text-xs font-medium uppercase tracking-wider">GMV 30d</span>
                </SortButton>
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="growth_rate" currentField={sortField} direction={sortDir} onClick={handleSort}>
                  <span className="text-xs font-medium uppercase tracking-wider">Growth</span>
                </SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left">
                <SortButton field="creator_count" currentField={sortField} direction={sortDir} onClick={handleSort}>
                  <span className="text-xs font-medium uppercase tracking-wider">Creators</span>
                </SortButton>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
              : sorted.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <span className="text-gray-500 font-mono font-semibold text-xs">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/products/${product.id}`}
                        className="flex items-center gap-3 group/link"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden"
                          style={{ background: "#1a1a2e" }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.thumbnail_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-100 font-medium truncate max-w-[200px] group-hover/link:text-white transition-colors">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">{product.brand}</span>
                            <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                              <Star className="w-3 h-3 fill-yellow-500" />
                              {product.rating}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-200 font-medium">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-gray-200">
                      {formatSales(product.sales_7d)}
                    </td>
                    <td className="px-4 py-4 text-gray-200 font-medium">
                      {formatCurrency(product.gmv_30d)}
                    </td>
                    <td className="px-4 py-4">
                      <GrowthBadge rate={product.growth_rate} />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={product.status} />
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                        <Users className="w-3.5 h-3.5" />
                        {formatSales(product.creator_count)}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!isLoading && sorted.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            <p className="text-lg font-medium mb-1">No products found</p>
            <p className="text-sm">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
