// src/components/FavoritesHeader.tsx
"use client";

import { Heart, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FavoritesHeader() {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
        >
          <ChevronRight className="w-4 h-4" />
          <span>لیست پزشکان</span>
        </button>

        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-red-600 fill-red-600" />
          <h1 className="text-xl font-bold">علاقه‌مندی‌های من</h1>
        </div>
      </div>
    </div>
  );
}
