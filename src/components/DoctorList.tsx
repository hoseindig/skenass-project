"use client";

import { useState, useEffect } from "react";
import DoctorCard from "@/components/DoctorCardNewStyle";
import SearchFilter from "@/components/SearchFilter";
import CreateDoctorModal from "@/components/CreateDoctorModal";
import { Doctor } from "@/lib/api";
import { fetchDoctors, getCategories } from "@/lib/api";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";

export default function DoctorsList() {
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    filterDoctorsLocally();
  }, [searchTerm, selectedCategory, selectedGender, allDoctors]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const cats = await getCategories();
      setCategories(cats);
      const response = await fetchDoctors();
      setAllDoctors(response.items);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctorsLocally = () => {
    let filtered = [...allDoctors];

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.full_name.toLowerCase().includes(lowerSearch) ||
          doctor.profession_name?.toLowerCase().includes(lowerSearch)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (doctor) => doctor.profession_name === selectedCategory
      );
    }

    if (selectedGender !== "all") {
      filtered = filtered.filter((doctor) => doctor.gender === selectedGender);
    }

    setFilteredDoctors(filtered);
  };

  const handleDoctorCreated = () => {
    // Reload doctors after creating new one
    loadInitialData();
  };

  return (
    <div className="container mx-auto p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">لیست پزشکان</h1>
        <div className="flex items-center gap-4">
          <Link href="/favorites">
            <div className="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
              <Heart className="w-5 h-5" />
              <span>علاقه‌مندی‌ها</span>
            </div>
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>افزودن دکتر</span>
          </button>
        </div>
      </div>

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
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              هیچ پزشکی یافت نشد
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
