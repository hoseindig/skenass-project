// src/components/DoctorList.tsx
"use client";

import { Doctor } from "@/lib/api";
import DoctorCard from "./DoctorCard";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import SearchFilter from "./SearchFilter";
import Pagination from "./Pagination";
import { Loader2 } from "lucide-react";
import Button from "./ui/Button";

interface DoctorListProps {
  initialDoctors: Doctor[];
  totalDoctors: number;
}

export default function DoctorList({
  initialDoctors,
  totalDoctors,
}: DoctorListProps) {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 12;

  // Extract professions
  const professions = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];
    const profs = new Set(doctors.map((d) => d.profession_name));
    return Array.from(profs);
  }, [doctors]);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];

    return doctors.filter((doctor) => {
      const matchesSearch =
        searchQuery === "" ||
        doctor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.city_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doctor.bio &&
          doctor.bio.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesProfession =
        selectedProfession === "all" ||
        doctor.profession_name === selectedProfession;

      return matchesSearch && matchesProfession;
    });
  }, [doctors, searchQuery, selectedProfession]);

  // Paginate doctors
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const paginatedDoctors = useMemo(() => {
    if (isInfiniteScroll) {
      return filteredDoctors.slice(0, currentPage * itemsPerPage);
    }
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDoctors.slice(start, start + itemsPerPage);
  }, [filteredDoctors, currentPage, itemsPerPage, isInfiniteScroll]);

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        if (currentPage * itemsPerPage < filteredDoctors.length) {
          setLoading(true);
          setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            setLoading(false);
          }, 500);
        }
      }
    },
    [loading, currentPage, filteredDoctors.length, itemsPerPage]
  );

  useEffect(() => {
    if (!isInfiniteScroll) return;

    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver, isInfiniteScroll]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!doctors || doctors.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          دکترها ({filteredDoctors.length})
        </h2>

        <Button
          variant={isInfiniteScroll ? "primary" : "outline"}
          size="sm"
          onClick={() => {
            setIsInfiniteScroll(!isInfiniteScroll);
            setCurrentPage(1);
          }}
        >
          {isInfiniteScroll ? "🔄 Infinite Scroll فعال" : "📄 Pagination فعال"}
        </Button>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedProfession}
        categories={professions}
        categoryLabel="تخصص"
      />

      {/* Doctor Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">دکتری یافت نشد 😔</p>
        </div>
      )}

      {/* Pagination or Infinite Scroll */}
      {isInfiniteScroll ? (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loading && (
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          )}
          {currentPage * itemsPerPage >= filteredDoctors.length && (
            <p className="text-gray-500">همه دکترها نمایش داده شد ✅</p>
          )}
        </div>
      ) : (
        filteredDoctors.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )
      )}
    </div>
  );
}
