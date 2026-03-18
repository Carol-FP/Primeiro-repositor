import { ProductStatus } from "@/types";

interface StatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

const statusConfig: Record<
  ProductStatus,
  { label: string; classes: string; dot: string }
> = {
  trending: {
    label: "Trending",
    classes: "bg-green-500/15 text-green-400 border border-green-500/30",
    dot: "bg-green-400",
  },
  rising: {
    label: "Rising",
    classes: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    dot: "bg-blue-400",
  },
  stable: {
    label: "Stable",
    classes: "bg-gray-500/15 text-gray-400 border border-gray-500/30",
    dot: "bg-gray-400",
  },
  declining: {
    label: "Declining",
    classes: "bg-red-500/15 text-red-400 border border-red-500/30",
    dot: "bg-red-400",
  },
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.stable;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.classes} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
