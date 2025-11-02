// ============================================
// src/components/DoctorCardWithQuery.tsx
// ============================================
"use client";

import { Star, MapPin, Briefcase, Award } from "lucide-react";
import Image from "next/image";
import { Doctor } from "@/lib/api";
import { useFavorites } from "@/hooks/useFavorites";

interface DoctorCardProps {
    doctor: Doctor;
}

export default function DoctorCardWithQuery({ doctor }: DoctorCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const isFav = isFavorite(doctor.id);

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="p-4 flex items-start gap-4">
                <div className="relative">
                    <Image
                        src={doctor.profile_image || "/placeholder-doctor.png"}
                        alt={doctor.full_name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover border-2 border-teal-500"
                    />

                    {/* ✅ بدون نیاز به mounted check */}
                    <div
                        className={`absolute -top-1 -left-1 rounded-full p-1 cursor-pointer transition-colors ${isFav ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        onClick={() => toggleFavorite(doctor.id)}
                    >
                        <Star
                            className={`w-3 h-3 ${isFav ? "fill-white text-white" : "fill-gray-500 text-gray-500"
                                }`}
                        />
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{doctor.full_name}</h3>
                    <p className="text-sm text-teal-600 mb-2">{doctor.profession_name}</p>

                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span>{doctor.city_name}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <Briefcase className="w-3 h-3" />
                        <span>{doctor.experience_years} سال سابقه</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Award className="w-3 h-3 text-yellow-500" />
                        <span>امتیاز: {doctor.average_rating.toFixed(1)}</span>
                        <span className="text-gray-400">({doctor.comments_count} نظر)</span>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4">
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {doctor.bio || "بدون توضیحات"}
                </p>
                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm py-2 rounded-lg transition-colors">
                    مشاهده پروفایل
                </button>
            </div>
        </div>
    );
}