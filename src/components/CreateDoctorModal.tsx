"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Province {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  province_id: number;
}

interface Specialty {
  id: number;
  name: string;
}

interface CreateDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface DoctorFormData {
  full_name: string;
  profession_id: string;
  province_id: string;
  city_id: string;
  gender: "male" | "female" | "";
}

export default function CreateDoctorModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateDoctorModalProps) {
  const [formData, setFormData] = useState<DoctorFormData>({
    full_name: "",
    profession_id: "",
    province_id: "",
    city_id: "",
    gender: "",
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load provinces and specialties on mount
  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  // Filter cities when province changes
  useEffect(() => {
    if (formData.province_id) {
      const filtered = cities.filter(
        (city) => city.province_id === parseInt(formData.province_id)
      );
      setFilteredCities(filtered);
      setFormData((prev) => ({ ...prev, city_id: "" }));
    } else {
      setFilteredCities([]);
    }
  }, [formData.province_id, cities]);

  const loadInitialData = async () => {
    try {
      // فرض بر این که API endpoints برای دریافت داده‌ها وجود دارد
      // این URLها رو با URLهای واقعی API خودتون جایگزین کنید

      const [provincesRes, citiesRes, specialtiesRes] = await Promise.all([
        fetch("YOUR_API_BASE_URL/provinces"),
        fetch("YOUR_API_BASE_URL/cities"),
        fetch("YOUR_API_BASE_URL/professions"),
      ]);

      const provincesData = await provincesRes.json();
      const citiesData = await citiesRes.json();
      const specialtiesData = await specialtiesRes.json();

      setProvinces(provincesData.data || provincesData);
      setCities(citiesData.data || citiesData);
      setSpecialties(specialtiesData.data || specialtiesData);
    } catch (err) {
      console.error("Error loading initial data:", err);
      setError("خطا در بارگذاری اطلاعات");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.full_name ||
      !formData.profession_id ||
      !formData.province_id ||
      !formData.city_id ||
      !formData.gender
    ) {
      setError("لطفا تمام فیلدها را پر کنید");
      return;
    }

    setLoading(true);

    try {
      // POST request به API
      const response = await fetch("YOUR_API_BASE_URL/doctors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // اگر نیاز به authentication دارید:
          // "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          profession_id: parseInt(formData.profession_id),
          province_id: parseInt(formData.province_id),
          city_id: parseInt(formData.city_id),
          gender: formData.gender,
        }),
      });

      if (!response.ok) {
        throw new Error("خطا در ایجاد دکتر");
      }

      const result = await response.json();
      console.log("Doctor created:", result);

      // Reset form
      setFormData({
        full_name: "",
        profession_id: "",
        province_id: "",
        city_id: "",
        gender: "",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating doctor:", err);
      setError("خطا در ایجاد دکتر. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">افزودن دکتر جدید</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام و نام خانوادگی <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="نام دکتر را وارد کنید"
            />
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تخصص <span className="text-red-500">*</span>
            </label>
            <select
              name="profession_id"
              value={formData.profession_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">انتخاب تخصص</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              استان <span className="text-red-500">*</span>
            </label>
            <select
              name="province_id"
              value={formData.province_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">انتخاب استان</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شهر <span className="text-red-500">*</span>
            </label>
            <select
              name="city_id"
              value={formData.city_id}
              onChange={handleChange}
              disabled={!formData.province_id}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {formData.province_id
                  ? "انتخاب شهر"
                  : "ابتدا استان را انتخاب کنید"}
              </option>
              {filteredCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              جنسیت <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="">انتخاب جنسیت</option>
              <option value="male">مرد</option>
              <option value="female">زن</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "در حال ارسال..." : "ایجاد دکتر"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:cursor-not-allowed"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
