// src/components/DoctorsListOptimized.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useInfiniteDoctors } from "@/hooks/useDoctors";
import DoctorCard from "@/components/DoctorCardNewStyle"; // 👈 فایل قبلی شما
import SearchFilter from "@/components/SearchFilter";
import CreateDoctorModal from "@/components/CreateDoctorModal";
import DoctorsListHeader from "@/components/DoctorsListHeader";
import { Loader2 } from "lucide-react";
import type { Doctor } from "@/lib/api";

interface Props {
    initialCategories?: string[];
}

export default function DoctorsListOptimized({
    initialCategories = [],
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedGender, setSelectedGender] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    // ✅ React Query Infinite Query
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteDoctors({
            search: searchTerm || undefined,
            professionName:
                selectedCategory !== "all" ? selectedCategory : undefined,
            gender: selectedGender !== "all" ? selectedGender : undefined,
            perPage: 20,
        });

    // ✅ Intersection Observer برای Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) observer.observe(currentTarget);

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // ✅ Flatten pages data
    const doctors = data?.pages.flatMap((page) => page.items) ?? [];
    const totalCount = data?.pages[0]?.meta.total ?? 0;

    const handleDoctorCreated = () => {
        fetchNextPage();
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center mt-10 gap-3">
                <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                <p className="text-gray-500">در حال بارگذاری...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6" dir="rtl">
            <DoctorsListHeader
                doctorsCount={doctors.length}
                totalCount={totalCount}
                onAddDoctor={() => setIsModalOpen(true)}
            />

            <SearchFilter
                onSearch={setSearchTerm}
                onCategoryChange={setSelectedCategory}
                onGenderChange={setSelectedGender}
                categories={initialCategories}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {doctors.map((doctor: Doctor) => (
                    // ✅ بدون onMouseEnter - فقط همین تغییر کردم
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
            </div>

            {doctors.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    <p className="text-lg">هیچ پزشکی یافت نشد</p>
                    <p className="text-sm mt-2">لطفاً فیلترهای خود را تغییر دهید</p>
                </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="mt-8 pb-4">
                {isFetchingNextPage && (
                    <div className="flex flex-col items-center justify-center gap-3 py-6">
                        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                        <p className="text-gray-500 text-sm">در حال بارگذاری...</p>
                    </div>
                )}
                {!hasNextPage && doctors.length > 0 && (
                    <div className="text-center py-6">
                        <div className="inline-flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-4 py-2 rounded-full">
                            <span>✓</span>
                            <span>تمام پزشکان نمایش داده شدند</span>
                        </div>
                    </div>
                )}
            </div>

            <CreateDoctorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleDoctorCreated}
            />
        </div>
    );
}