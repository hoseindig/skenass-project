// src/components/FavoriteButton.tsx
"use client";

import { Doctor } from "@/lib/api";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { toggleFavorite, isFavorite } from "@/lib/favorites";

interface FavoriteButtonProps {
  doctor: Doctor;
}

export default function FavoriteButton({ doctor }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(doctor.id));
  }, [doctor.id]);

  const handleToggleFavorite = () => {
    const newState = toggleFavorite(doctor);
    setIsFav(newState);
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isFav
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <Heart className={`w-4 h-4 ${isFav ? "fill-red-600" : ""}`} />
      <span>{isFav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}</span>
    </button>
  );
}
