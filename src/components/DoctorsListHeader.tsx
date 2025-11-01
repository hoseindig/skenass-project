// src/components/DoctorsListHeader.tsx
import Link from "next/link";
import { Heart } from "lucide-react";
import AddDoctorButton from "./AddDoctorButton";

interface DoctorsListHeaderProps {
  doctorsCount: number;
  totalCount: number;
  onAddDoctor: () => void;
}

export default function DoctorsListHeader({
  doctorsCount,
  totalCount,
  onAddDoctor,
}: DoctorsListHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">لیست پزشکان</h1>
        {doctorsCount > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {doctorsCount} پزشک از {totalCount} نمایش داده شده
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/favorites"
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span>علاقه‌مندی‌ها</span>
        </Link>
        <AddDoctorButton onClick={onAddDoctor} />
      </div>
    </div>
  );
}
