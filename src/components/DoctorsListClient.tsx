
// ============================================
// components/DoctorsListClient.tsx
// ============================================
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DoctorCard from "@/components/DoctorCardNewStyle";
import SearchFilter from "@/components/SearchFilter";
import CreateDoctorModal from "@/components/CreateDoctorModal";
import DoctorsListHeader from "@/components/DoctorsListHeader";
import { Doctor, PaginationMeta } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface DoctorsListClientProps {
  initialCategories: string[];
  initialDoctors: Doctor[];
  initialMeta: PaginationMeta;
  initialFilters: {
    search: string;
    category: string;
    gender: string;
  };
}

export default function DoctorsListClient({
  initialCategories,
  initialDoctors,
  initialMeta,
  initialFilters,
}: DoctorsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [meta, setMeta] = useState<PaginationMeta>(initialMeta);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // فیلترهای محلی برای UX بهتر
  const [searchTerm, setSearchTerm] = useState(initialFilters.search);
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category);
  const [selectedGender, setSelectedGender] = useState(initialFilters.gender);

  const observerTarget = useRef<HTMLDivElement>(null);
  const currentPage = Number(searchParams.get("page")) || 1;
  const hasMore = currentPage < meta.last_page;

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreDoctors();
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
  }, [hasMore, loadingMore, currentPage]);

  // بروزرسانی URL برای فیلترها (با debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedGender !== "all") params.set("gender", selectedGender);
      params.set("page", "1");

      router.push(`/doctors?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedGender, router]);

  const loadMoreDoctors = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", nextPage.toString());

      // فراخوانی API از سمت کلاینت فقط برای infinite scroll
      const response = await fetch(
        `/api/doctors?${params.toString()}`
      );
      const data = await response.json();

      setDoctors((prev) => {
        const existingIds = new Set(prev.map((d) => d.id));
        const newDoctors = data.items.filter((d: Doctor) => !existingIds.has(d.id));
        return [...prev, ...newDoctors];
      });

      setMeta(data.meta);

      // بروزرسانی URL بدون رفرش
      router.push(`/doctors?${params.toString()}`, { scroll: false });
    } catch (error) {
      console.error("Error loading more doctors:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDoctorCreated = () => {
    router.refresh();
  };

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <DoctorsListHeader
        doctorsCount={doctors.length}
        totalCount={meta.total}
        onAddDoctor={() => setIsModalOpen(true)}
      />

      <SearchFilter
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onGenderChange={setSelectedGender}
        categories={initialCategories}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {doctors.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">هیچ پزشکی یافت نشد</p>
          <p className="text-sm mt-2">لطفاً فیلترهای خود را تغییر دهید</p>
        </div>
      )}

      {doctors.length > 0 && (
        <div ref={observerTarget} className="mt-8 pb-4">
          {loadingMore && (
            <div className="flex flex-col items-center justify-center gap-3 py-6">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-gray-500 text-sm">در حال بارگذاری موارد بیشتر...</p>
            </div>
          )}
          {!hasMore && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-4 py-2 rounded-full">
                <span>✓</span>
                <span>تمام پزشکان نمایش داده شدند</span>
              </div>
            </div>
          )}
        </div>
      )}

      <CreateDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleDoctorCreated}
      />
    </div>
  );
}
