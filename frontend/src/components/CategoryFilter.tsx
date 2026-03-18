"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";

interface CategoryFilterProps {
  selected: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isSelected = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isSelected
                ? "text-white border"
                : "bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600 hover:text-gray-200"
            }`}
            style={
              isSelected
                ? {
                    backgroundColor: "rgba(254, 44, 85, 0.15)",
                    borderColor: "rgba(254, 44, 85, 0.5)",
                    color: "#FE2C55",
                  }
                : undefined
            }
          >
            {cat.name}
            <span
              className={`ml-1.5 text-xs ${
                isSelected ? "opacity-80" : "text-gray-600"
              }`}
            >
              {cat.product_count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
