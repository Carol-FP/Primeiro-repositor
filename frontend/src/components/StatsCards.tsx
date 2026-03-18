"use client";

import { useQuery } from "@tanstack/react-query";
import { Package, DollarSign, TrendingUp, BarChart2 } from "lucide-react";
import { fetchStats } from "@/lib/api";

function formatGMV(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

const cards = [
  {
    key: "total_products",
    label: "Total Products Tracked",
    icon: Package,
    format: (v: number) => v.toLocaleString(),
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    key: "total_gmv_30d",
    label: "Total GMV (30 days)",
    icon: DollarSign,
    format: formatGMV,
    color: "text-tiktok-pink",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    key: "trending_count",
    label: "Trending Products",
    icon: TrendingUp,
    format: (v: number) => v.toLocaleString(),
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    key: "avg_growth_rate",
    label: "Avg Growth Rate",
    icon: BarChart2,
    format: (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
] as const;

function SkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-gray-800" />
      </div>
      <div className="h-8 w-24 bg-gray-800 rounded mb-2" />
      <div className="h-4 w-32 bg-gray-800 rounded" />
    </div>
  );
}

export default function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: fetchStats,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, format, color, bg, border }) => {
        const value = stats ? (stats[key] as number) : 0;
        return (
          <div
            key={key}
            className={`bg-gray-900 border ${border} rounded-xl p-5 hover:border-opacity-50 transition-all hover:scale-[1.01]`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${color} mb-1`}>
              {format(value)}
            </p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        );
      })}
    </div>
  );
}
