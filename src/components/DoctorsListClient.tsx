// src/components/DoctorsListClient.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import DoctorCard from "@/components/DoctorCardNewStyle";
import SearchFilter from "@/components/SearchFilter";
import CreateDoctorModal from "@/components/CreateDoctorModal";
import DoctorsListHeader from "@/components/DoctorsListHeader";
import { Doctor, DoctorsResponse, fetchDoctors } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface DoctorsListClientProps {
  initialCategories: string[];
  initialDoctorsData: DoctorsResponse;
}

export default function DoctorsListClient({
  initialCategories,
  initialDoctorsData,
}: DoctorsListClientProps) {
  // استفاده از initial data به جای fetch در useEffect
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctorsData.items);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states - از initial data
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    initialDoctorsData.meta.current_page < initialDoctorsData.meta.last_page
  );
  const [totalPages, setTotalPages] = useState(
    initialDoctorsData.meta.last_page
  );
  const PER_PAGE = 20;

  const observerTarget = useRef<HTMLDivElement>(null);

  // حذف initial load useEffect - دیگر نیازی نیست
  // useEffect(() => {
  //   loadDoctors(1, true);
  // }, []);

  // Reset and reload when filters change
  useEffect(() => {
    if (searchTerm || selectedCategory !== "all" || selectedGender !== "all") {
      setDoctors([]);
      setCurrentPage(1);
      setHasMore(true);
      loadDoctors(1, true);
    } else {
      // برگشت به initial data
      setDoctors(initialDoctorsData.items);
      setCurrentPage(1);
      setHasMore(
        initialDoctorsData.meta.current_page < initialDoctorsData.meta.last_page
      );
      setTotalPages(initialDoctorsData.meta.last_page);
    }
  }, [searchTerm, selectedCategory, selectedGender]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
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
  }, [hasMore, loading, loadingMore, currentPage]);

  const loadDoctors = async (page: number, isNewSearch: boolean = false) => {
    try {
      if (isNewSearch) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await fetchDoctors({
        search: searchTerm || undefined,
        professionName:
          selectedCategory !== "all" ? selectedCategory : undefined,
        gender: selectedGender !== "all" ? selectedGender : undefined,
        page: page,
        perPage: PER_PAGE,
      });

      if (isNewSearch) {
        setDoctors(response.items);
      } else {
        setDoctors((prev) => {
          const existingIds = new Set(prev.map((d) => d.id));
          const newDoctors = response.items.filter(
            (d) => !existingIds.has(d.id)
          );
          return [...prev, ...newDoctors];
        });
      }

      const meta = response.meta;
      setTotalPages(meta.last_page);
      setHasMore(page < meta.last_page);
      setCurrentPage(page);

      console.log(
        `📄 Page ${page} of ${meta.last_page} loaded. Total: ${meta.total}`
      );
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreDoctors = useCallback(() => {
    if (!hasMore || loading || loadingMore) return;
    const nextPage = currentPage + 1;
    console.log(`🔄 Loading page ${nextPage}...`);
    loadDoctors(nextPage, false);
  }, [currentPage, hasMore, loading, loadingMore]);

  const handleDoctorCreated = () => {
    setDoctors([]);
    setCurrentPage(1);
    setHasMore(true);
    loadDoctors(1, true);
  };

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <DoctorsListHeader
        doctorsCount={doctors.length}
        totalCount={totalPages * PER_PAGE}
        onAddDoctor={() => setIsModalOpen(true)}
      />

      <SearchFilter
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onGenderChange={setSelectedGender}
        categories={initialCategories}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center mt-10 gap-3">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      ) : (
        <>
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
                  <p className="text-gray-500 text-sm">
                    در حال بارگذاری موارد بیشتر...
                  </p>
                </div>
              )}
              {!hasMore && doctors.length > 0 && (
                <div className="text-center py-6">
                  <div className="inline-flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-4 py-2 rounded-full">
                    <span>✓</span>
                    <span>تمام پزشکان نمایش داده شدند</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <CreateDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleDoctorCreated}
      />
    </div>
  );
}
