"use client";

import { useState, useEffect } from "react";
import DoctorCard from "@/components/DoctorCardNewStyle";
import SearchFilter from "@/components/SearchFilter";
import { Doctor } from "@/lib/api";
import { fetchDoctors, getCategories } from "@/lib/api";

export default function DoctorsList() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedGender, setSelectedGender] = useState("all");
    const [categories, setCategories] = useState<string[]>([]);

    // Initial load - fetch categories and doctors
    useEffect(() => {
        loadInitialData();
    }, []);

    // Fetch doctors when filters change
    useEffect(() => {
        loadDoctors();
    }, [searchTerm, selectedCategory, selectedGender]);

    const loadInitialData = async () => {
        try {
            setLoading(true);

            // Fetch categories
            const cats = await getCategories();
            setCategories(cats);

            // Fetch initial doctors
            const response = await fetchDoctors();
            setDoctors(response.items);
        } catch (error) {
            console.error("Error loading initial data:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadDoctors = async () => {
        try {
            setLoading(true);

            const response = await fetchDoctors({
                search: searchTerm,
                professionName: selectedCategory,
                gender: selectedGender,
            });

            setDoctors(response.items);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6" dir="rtl">
            <h1 className="text-3xl font-bold mb-6">لیست پزشکان</h1>

            <SearchFilter
                onSearch={setSearchTerm}
                onCategoryChange={setSelectedCategory}
                onGenderChange={setSelectedGender}
                categories={categories}
            />

            {loading ? (
                <div className="text-center text-gray-500 mt-10">
                    در حال بارگذاری...
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>

                    {doctors.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            هیچ پزشکی یافت نشد
                        </div>
                    )}
                </>
            )}
        </div>
    );
}