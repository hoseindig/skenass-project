// src/components/DoctorDetailHeader.tsx
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Doctor } from "@/lib/api";
import FavoriteButton from "./FavoriteButton";

interface DoctorDetailHeaderProps {
  doctor: Doctor;
}

export default function DoctorDetailHeader({
  doctor,
}: DoctorDetailHeaderProps) {
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

        <FavoriteButton doctor={doctor} />
      </div>
    </div>
  );
}
