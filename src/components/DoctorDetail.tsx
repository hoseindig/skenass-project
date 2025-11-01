// src/components/DoctorDetail.tsx
"use client";

import { Doctor } from "@/lib/api";
import { MapPin, Phone, Star, MessageCircle, Briefcase, Calendar, ChevronRight, Heart } from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toggleFavorite, isFavorite } from "@/lib/favorites";

interface DoctorDetailProps {
  doctor: Doctor;
}

export default function DoctorDetail({ doctor }: DoctorDetailProps) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(doctor.id));
  }, [doctor.id]);

  const handleToggleFavorite = () => {
    const newState = toggleFavorite(doctor);
    setIsFav(newState);
  };

  const imageUrl = doctor.profile_image.startsWith('http')
    ? doctor.profile_image
    : `https://skenass.com${doctor.profile_image}`;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
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
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${isFav
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-red-600" : ""}`} />
            <span>{isFav ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Main Card */}
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
          <div className="p-6 flex items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Image
                src={imageUrl}
                alt={doctor.full_name}
                width={128}
                height={128}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-gray-100"
                unoptimized
              />
              {doctor.average_rating > 0 && (
                <div className="absolute -top-2 -left-2 bg-yellow-400 rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-white text-white" />
                  <span className="text-sm font-bold text-white">
                    {doctor.average_rating}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {doctor.full_name}
              </h1>
              <p className="text-base text-gray-600 mb-4">
                {doctor.profession_name}
              </p>

              <div className="flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gray-400" />
                  <span>امتیاز: {doctor.average_rating || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span>نظرات: {doctor.comments_count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span>پرداخت با اسکناس: {doctor.transaction_count}</span>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md text-sm">
                <span className="text-gray-600">کد نظام پزشکی:</span>
                <span className="font-bold text-gray-900">{doctor.medical_system_code}</span>
              </div>
            </div>

            <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors">
              دریافت خدمات با پرداخت اقساطی
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">درباره‌ی پزشک</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-gray-600 text-sm min-w-24">خدمات:</span>
              <span className="text-gray-900 text-sm">{doctor.profession_name}</span>
            </div>
            {doctor.bio && (
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-900 text-sm">{doctor.bio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cooperation Section */}
        <div className="bg-white rounded-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">همکاری با اسکناس</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Calendar className="w-4 h-4" />
                <span>سابقه همکاری با اسکناس:</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(doctor.partnership_months)} ماه
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Briefcase className="w-4 h-4" />
                <span>مراجعه کننده از طریق اسکناس:</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{doctor.transaction_count}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Star className="w-4 h-4" />
                <span>رضایت کاربران اسکناس:</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{doctor.average_rating || 0}</p>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-md border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">اطلاعات مطب</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">آدرس:</p>
                <p className="text-gray-900">{doctor.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600 mb-1">شماره تماس:</p>
                <p className="text-gray-900 font-medium" dir="ltr">{doctor.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}