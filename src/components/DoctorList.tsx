"use client";

import { useState, useEffect } from "react";
import DoctorCard from "@/components/DoctorCardNewStyle";
import SearchFilter from "@/components/SearchFilter";
import { Doctor } from "@/lib/api";

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedGender, setSelectedGender] = useState("all");
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        filterDoctors();
    }, [searchTerm, selectedCategory, selectedGender, doctors]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch("https://skenass.com/api/v1/contracted-doctors");
            const response = await res.json();
            const doctorsData = response.data.items;

            setDoctors(doctorsData);
            setFilteredDoctors(doctorsData);

            // Extract unique categories
            const uniqueCategories = [...new Set(doctorsData.map((d: Doctor) => d.profession_name))];
            setCategories(uniqueCategories);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const filterDoctors = () => {
        let filtered = doctors;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter((doctor) =>
                doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(
                (doctor) => doctor.profession_name === selectedCategory
            );
        }

        // Filter by gender
        if (selectedGender !== "all") {
            filtered = filtered.filter(
                (doctor) => doctor.gender === selectedGender
            );
        }

        setFilteredDoctors(filtered);
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    هیچ پزشکی یافت نشد
                </div>
            )}
        </div>
    );
}