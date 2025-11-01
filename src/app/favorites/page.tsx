"use client";

import { useState, useEffect } from "react";
import { getFavorites } from "@/lib/favorites";
import { Doctor } from "@/types/product";
import DoctorCard from "@/components/DoctorCardNewStyle";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<Doctor[]>([]);

    useEffect(() => {
        loadFavorites();

        // Listen for storage changes
        const handleStorageChange = () => {
            loadFavorites();
        };

        window.addEventListener("storage", handleStorageChange);

        // Custom event for same-page updates
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
        <div className="container mx-auto p-6" dir="rtl">
            <div className="flex items-center gap-3 mb-6">
                <Heart className="w-8 h-8 text-red-600 fill-red-600" />
                <h1 className="text-3xl font-bold">علاقه‌مندی‌های من</h1>
            </div>

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
    );
}