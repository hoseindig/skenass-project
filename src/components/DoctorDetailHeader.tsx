// src/components/DoctorDetailHeader.tsx
"use client";

import { Doctor } from "@/lib/api";
import { ChevronRight, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toggleFavorite, isFavorite } from "@/lib/favorites";

interface DoctorDetailHeaderProps {
  doctor: Doctor;
}

export default function DoctorDetailHeader({
  doctor,
}: DoctorDetailHeaderProps) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(doctor.id));
  }, [doctor.id]);

  const handleToggleFavorite = () => {
    const newState = toggleFavorite(doctor);
    setIsFav(newState);
  };

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

        <button
          onClick={handleToggleFavorite}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isFav
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? "fill-red-600" : ""}`} />
          <span>
            {isFav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
          </span>
        </button>
      </div>
    </div>
  );
}
