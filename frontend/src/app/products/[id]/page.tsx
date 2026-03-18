"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Users,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  BarChart2,
  ChevronUp,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import { fetchProduct } from "@/lib/api";
import TrendChart from "@/components/TrendChart";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}

function formatSales(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [chartMetric, setChartMetric] = useState<"sales" | "gmv">("sales");

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-gray-800 rounded" />
        <div className="h-10 w-64 bg-gray-800 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-xl" />
          ))}
        </div>
        <div className="h-72 bg-gray-800 rounded-xl" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">Product not found.</p>
        <Link
          href="/"
          className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const isPositiveGrowth = product.growth_rate >= 0;

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to bestsellers
      </button>

      {/* Product header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div
            className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden"
            style={{ background: "#1a1a2e" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.thumbnail_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <StatusBadge status={product.status} />
              <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-md">
                {product.category}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white mb-1 leading-tight">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="font-semibold text-gray-300">{product.brand}</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                <span className="text-yellow-400 font-medium">{product.rating}</span>
                <span className="text-gray-600">
                  ({product.review_count.toLocaleString()} reviews)
                </span>
              </span>
              <span className="text-lg font-bold text-white">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Trend Score</p>
              <p
                className="text-3xl font-black"
                style={{ color: "#FE2C55" }}
              >
                {product.trend_score.toFixed(0)}
              </p>
              <p className="text-xs text-gray-600">/ 100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={ShoppingBag}
          label="Sales (7 days)"
          value={formatSales(product.sales_7d)}
          sub="units sold"
          color="text-blue-400"
        />
        <StatCard
          icon={ShoppingBag}
          label="Sales (30 days)"
          value={formatSales(product.sales_30d)}
          sub="units sold"
          color="text-blue-400"
        />
        <StatCard
          icon={DollarSign}
          label="GMV (7 days)"
          value={formatCurrency(product.gmv_7d)}
          sub="gross merchandise value"
          color="text-green-400"
        />
        <StatCard
          icon={DollarSign}
          label="GMV (30 days)"
          value={formatCurrency(product.gmv_30d)}
          sub="gross merchandise value"
          color="text-green-400"
        />
        <StatCard
          icon={TrendingUp}
          label="Growth Rate"
          value={`${isPositiveGrowth ? "+" : ""}${product.growth_rate.toFixed(1)}%`}
          sub="month over month"
          color={isPositiveGrowth ? "text-green-400" : "text-red-400"}
        />
        <StatCard
          icon={BarChart2}
          label="Trend Score"
          value={`${product.trend_score.toFixed(1)} / 100`}
          sub="TikTok virality score"
          color="text-purple-400"
        />
        <StatCard
          icon={Users}
          label="Creators"
          value={formatSales(product.creator_count)}
          sub="TikTokers promoting"
          color="text-orange-400"
        />
        <StatCard
          icon={Star}
          label="Rating"
          value={`${product.rating} ★`}
          sub={`${product.review_count.toLocaleString()} reviews`}
          color="text-yellow-400"
        />
      </div>

      {/* Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-white">
              30-Day Performance
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Historical {chartMetric === "sales" ? "unit sales" : "GMV"} trend
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartMetric("sales")}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                chartMetric === "sales"
                  ? "text-white"
                  : "border-gray-800 text-gray-500 hover:text-gray-300 bg-gray-900"
              }`}
              style={
                chartMetric === "sales"
                  ? {
                      backgroundColor: "rgba(254, 44, 85, 0.15)",
                      borderColor: "rgba(254, 44, 85, 0.5)",
                      color: "#FE2C55",
                    }
                  : undefined
              }
            >
              Sales Volume
            </button>
            <button
              onClick={() => setChartMetric("gmv")}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all border ${
                chartMetric === "gmv"
                  ? "text-white"
                  : "border-gray-800 text-gray-500 hover:text-gray-300 bg-gray-900"
              }`}
              style={
                chartMetric === "gmv"
                  ? {
                      backgroundColor: "rgba(254, 44, 85, 0.15)",
                      borderColor: "rgba(254, 44, 85, 0.5)",
                      color: "#FE2C55",
                    }
                  : undefined
              }
            >
              GMV Revenue
            </button>
          </div>
        </div>
        <TrendChart history={product.history} metric={chartMetric} />
      </div>

      {/* Growth indicator */}
      <div
        className={`bg-gray-900 border rounded-xl p-5 flex items-center gap-4 ${
          isPositiveGrowth ? "border-green-500/20" : "border-red-500/20"
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            isPositiveGrowth ? "bg-green-500/15" : "bg-red-500/15"
          }`}
        >
          {isPositiveGrowth ? (
            <ChevronUp className="w-5 h-5 text-green-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-red-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {isPositiveGrowth
              ? `Growing ${product.growth_rate.toFixed(1)}% month-over-month`
              : `Declining ${Math.abs(product.growth_rate).toFixed(1)}% month-over-month`}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Promoted by {formatSales(product.creator_count)} TikTok creators —
            Status:{" "}
            <span className="capitalize">{product.status}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
