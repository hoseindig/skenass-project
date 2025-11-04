// ============================================
// components/DoctorsListClient.tsx
// ============================================
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import SearchFilter from "@/components/SearchFilter";
import CreateDoctorModal from "@/components/CreateDoctorModal";
import DoctorsListHeader from "@/components/DoctorsListHeader";
import { Doctor } from "@/lib/api";
import { Loader2 } from "lucide-react";

// Load DoctorCard without SSR to avoid hydration issues
const DoctorCard = dynamic(() => import("@/components/DoctorCardNewStyle"), {
  ssr: false,
  loading: () => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 animate-pulse">
      <div className="h-24 bg-gray-200 rounded"></div>
    </div>
  ),
});

interface DoctorsListClientProps {
  categories: string[];
  allDoctors: Doctor[];
}

export default function DoctorsListClient({
  categories,
  allDoctors,
}: DoctorsListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [displayCount, setDisplayCount] = useState(20);
  const observerTarget = useRef<HTMLDivElement>(null);

  // فیلتر کردن دکترها در سمت کلاینت (بدون API call)
  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doctor) => {
      // فیلتر جستجو
      const matchesSearch = searchTerm
        ? doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.profession_name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      // فیلتر دسته‌بندی
      const matchesCategory =
        selectedCategory === "all" || doctor.profession_name === selectedCategory;

      // فیلتر جنسیت
      const matchesGender =
        selectedGender === "all" || doctor.gender === selectedGender;

      return matchesSearch && matchesCategory && matchesGender;
    });
  }, [allDoctors, searchTerm, selectedCategory, selectedGender]);

  // دکترهایی که نمایش داده می‌شوند
  const displayedDoctors = filteredDoctors.slice(0, displayCount);
  const hasMore = displayCount < filteredDoctors.length;

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setDisplayCount((prev) => prev + 20);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore]);

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(20);
  }, [searchTerm, selectedCategory, selectedGender]);

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <DoctorsListHeader
        doctorsCount={filteredDoctors.length}
        totalCount={allDoctors.length}
        onAddDoctor={() => setIsModalOpen(true)}
      />

      <SearchFilter
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onGenderChange={setSelectedGender}
        categories={categories}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {displayedDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">هیچ پزشکی یافت نشد</p>
          <p className="text-sm mt-2">لطفاً فیلترهای خود را تغییر دهید</p>
        </div>
      )}

      {displayedDoctors.length > 0 && (
        <div ref={observerTarget} className="mt-8 pb-4">
          {hasMore && (
            <div className="flex flex-col items-center justify-center gap-3 py-6">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-gray-500 text-sm">در حال بارگذاری موارد بیشتر...</p>
            </div>
          )}
          {!hasMore && filteredDoctors.length > 0 && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-4 py-2 rounded-full">
                <span>✓</span>
                <span>تمام پزشکان نمایش داده شدند ({filteredDoctors.length} نفر)</span>
              </div>
            </div>
          )}
        </div>
      )}

      <CreateDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}