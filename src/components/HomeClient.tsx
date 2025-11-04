// components/HomeClient.tsx (Client Component)
"use client";

import { useRouter } from "next/navigation";
import DoctorCard from "@/components/DoctorCardNewStyle";
import { Doctor } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

interface HomeClientProps {
    doctors: Doctor[];
    categories: string[];
}

export default function HomeClient({
    categories,
    doctors
}: HomeClientProps) {
    const router = useRouter();
    console.log('doctors', doctors);

    return (
        <div className="container mx-auto p-6" dir="rtl">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-8 mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    پزشکان طرف قرارداد
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                    بهترین پزشکان را پیدا کنید و نوبت بگیرید
                </p>
                <button
                    onClick={() => router.push("/doctors")}
                    className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
                >
                    مشاهده همه پزشکان
                </button>
            </section>

            {/* Categories */}
            <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    تخصص‌های پزشکی
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories?.map((category) => (
                        <button
                            key={category}
                            onClick={() =>
                                router.push(`/doctors?category=${encodeURIComponent(category)}`)
                            }
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-500 hover:shadow-md transition-all text-center"
                        >
                            <span className="text-gray-900">{category}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Featured Doctors */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">پزشکان برگزیده</h2>
                    <button
                        onClick={() => router.push("/doctors")}
                        className="flex items-center gap-2 text-teal-600 hover:text-teal-700"
                    >
                        <span>مشاهده همه</span>
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors?.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            </section>
        </div>
    );
}
