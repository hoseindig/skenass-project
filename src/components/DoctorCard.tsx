// src/components/DoctorCard.tsx
import { Doctor } from "@/lib/api";
import Image from "next/image";
import { MapPin, Star, MessageCircle, Briefcase, Phone } from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const imageUrl = doctor.profile_image.startsWith("http")
    ? doctor.profile_image
    : `https://skenass.com${doctor.profile_image}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header با عکس و اطلاعات اصلی */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 h-24"></div>

        {/* Profile Section */}
        <div className="relative px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                <Image
                  src={imageUrl}
                  alt={doctor.full_name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              {/* Rating Badge */}
              {doctor.average_rating > 0 && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full px-2 py-0.5 flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-white text-white" />
                  <span className="text-xs font-bold text-white">
                    {doctor.average_rating}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pt-2">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {doctor.full_name}
              </h3>
              <p className="text-sm text-blue-600 font-medium">
                {doctor.profession_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 space-y-3">
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="line-clamp-1">
            {doctor.city_name}، {doctor.province_name}
          </span>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>{doctor.experience_years} سال تجربه</span>
        </div>

        {/* Bio */}
        {doctor.bio && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {doctor.bio}
          </p>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 my-3"></div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{doctor.comments_count} نظر</span>
            </div>
            {doctor.transaction_count > 0 && (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span>{doctor.transaction_count} معامله</span>
              </div>
            )}
          </div>

          {/* View Profile Button */}
          <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
            <span>مشاهده پروفایل</span>
            <span className="transform group-hover:-translate-x-1 transition-transform">
              ←
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
