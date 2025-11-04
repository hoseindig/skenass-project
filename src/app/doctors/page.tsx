// ============================================
// app/doctors/page.tsx (Server Component)
// ============================================
import DoctorsListClient from "@/components/DoctorsListClient";
import { getCategories, fetchAllDoctors } from "@/lib/api";

export default async function DoctorsPage() {
  // یکبار همه دیتا رو از سرور می‌گیریم
  const [categories, allDoctors] = await Promise.all([
    getCategories(),
    fetchAllDoctors(), // همه دکترها یکجا
  ]);

  return (
    <DoctorsListClient
      categories={categories}
      allDoctors={allDoctors}
    />
  );
}
