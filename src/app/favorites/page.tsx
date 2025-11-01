"use client";

import { useState, useEffect } from "react";
import { getFavorites } from "@/lib/favorites";
import { Doctor } from "@/types/product";
import DoctorCard from "@/components/DoctorCardNewStyle";
import FavoritesHeader from "@/components/FavoritesHeader";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Doctor[]>([]);

  useEffect(() => {
    loadFavorites();

    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("favoritesChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoritesChanged", handleStorageChange);
    };
  }, []);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <FavoritesHeader />

      <div className="container mx-auto p-6">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              هنوز دکتری به علاقه‌مندی‌ها اضافه نکرده‌اید
            </h2>
            <p className="text-gray-500">
              برای افزودن دکتر به لیست علاقه‌مندی‌ها، روی آیکن قلب کلیک کنید
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
