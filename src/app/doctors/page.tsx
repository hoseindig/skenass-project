// app/doctors/page.tsx (Server Component - بدون "use client")
import DoctorsListClient from "@/components/DoctorsListClient";
import { getCategories, fetchDoctors } from "@/lib/api";

export default async function DoctorsPage() {
  // این کال‌ها در سرور اجرا می‌شوند
  const categories = await getCategories();
  const initialDoctorsData = await fetchDoctors({ page: 1, perPage: 20 });

  return (
    <DoctorsListClient
      initialCategories={categories}
      initialDoctorsData={initialDoctorsData}
    />
  );
}
