// src/components/FavoritesHeader.tsx
import { Heart, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function FavoritesHeader() {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link
          href="/doctors"
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
        >
          <ChevronRight className="w-4 h-4" />
          <span>لیست پزشکان</span>
        </Link>

        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-red-600 fill-red-600" />
          <h1 className="text-xl font-bold">علاقه‌مندی‌های من</h1>
        </div>
      </div>
    </div>
  );
}
