"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { HistoryPoint } from "@/types";

interface TrendChartProps {
  history: HistoryPoint[];
  metric?: "sales" | "gmv";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatValue(value: number, metric: "sales" | "gmv"): string {
  if (metric === "gmv") {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  }
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

interface TooltipPayload {
  value: number;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  metric: "sales" | "gmv";
}

function CustomTooltip({ active, payload, label, metric }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-white">
        {metric === "gmv" ? "GMV: " : "Sales: "}
        <span style={{ color: "#FE2C55" }}>{formatValue(value, metric)}</span>
      </p>
    </div>
  );
}

export default function TrendChart({ history, metric = "sales" }: TrendChartProps) {
  const data = history.map((h) => ({
    date: formatDate(h.date),
    value: metric === "gmv" ? h.gmv : h.sales,
  }));

  const minVal = Math.min(...data.map((d) => d.value));
  const maxVal = Math.max(...data.map((d) => d.value));
  const padding = (maxVal - minVal) * 0.1;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FE2C55" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#FE2C55" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#1f2937"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fill: "#6b7280", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval={4}
        />
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatValue(v, metric)}
          domain={[Math.max(0, minVal - padding), maxVal + padding]}
          width={60}
        />
        <Tooltip
          content={<CustomTooltip metric={metric} />}
          cursor={{ stroke: "#374151", strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#FE2C55"
          strokeWidth={2}
          fill="url(#colorGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#FE2C55", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
