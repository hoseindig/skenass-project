// src/components/DoctorCard.tsx
import { Doctor } from "@/lib/api";
import Image from "next/image";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const imageUrl = doctor.profile_image.startsWith("http")
    ? doctor.profile_image
    : `https://skenass.com${doctor.profile_image}`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <Image
          src={imageUrl}
          alt={doctor.full_name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {doctor.full_name}
        </h3>

        <p className="text-sm text-blue-600 mb-2">{doctor.profession_name}</p>

        <p className="text-sm text-gray-600 mb-2">
          📍 {doctor.city_name}, {doctor.province_name}
        </p>

        <p className="text-sm text-gray-500 mb-2">
          💼 {doctor.experience_years} سال تجربه
        </p>

        {doctor.bio && (
          <p className="text-xs text-gray-600 line-clamp-2">{doctor.bio}</p>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>⭐ {doctor.average_rating || 0}</span>
          <span>💬 {doctor.comments_count} نظر</span>
        </div>
      </div>
    </div>
  );
}
