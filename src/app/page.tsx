// src/app/page.tsx
import { fetchDoctors } from "@/lib/api";
// import DoctorList from "@/components/DoctorList";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  try {
    const doctorsData = await fetchDoctors(1, 20);
    console.log(doctorsData);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          دکترهای طرف قرارداد
        </h1>
        <HomeClient doctors={doctorsData.items
        } />
      </div>
    );
  } catch (error) {
    console.error("Error in Home:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            خطا در بارگذاری
          </h2>
          <p className="text-red-600">
            {error instanceof Error ? error.message : "خطای نامشخص"}
          </p>
        </div>
      </div>
    );
  }
}
