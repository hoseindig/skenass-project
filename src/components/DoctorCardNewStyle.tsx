// src/components/DoctorCard.tsx
import { Doctor } from "@/lib/api";
import Image from "next/image";
import { MapPin, Star, MessageCircle, Briefcase } from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const imageUrl = doctor.profile_image.startsWith('http') 
    ? doctor.profile_image 
    : `https://skenass.com${doctor.profile_image}`;

  return (
    <div className="bg-white border border-gray-200 hover:border-gray-300 transition-colors" style={{ borderRadius: '.375rem' }}>
      {/* Header */}
      <div className="p-4 flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-gray-100">
            <Image
              src={imageUrl}
              alt={doctor.full_name}
              width={64}
              height={64}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          <div className="absolute -top-1 -left-1 bg-teal-500 rounded-full p-1">
            <Star className="w-3 h-3 fill-white text-white" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h3 className="text-base font-bold text-gray-900 mb-0.5">
            {doctor.full_name}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {doctor.profession_name}
          </p>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5" />
            <span>{doctor.city_name}، {doctor.province_name}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Briefcase className="w-3.5 h-3.5 text-gray-400" />
          <span>{doctor.experience_years} سال تجربه</span>
        </div>
        
        <div className="flex items-center gap-1">
          <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
          <span>نظر</span>
        </div>

        <button className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
          <span>مشاهده پروفایل</span>
          <span>←</span>
        </button>
      </div>
    </div>
  );
}