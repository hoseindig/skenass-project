/ ============================================
// app/doctors/page.tsx (Server Component)
// ============================================
import { Suspense } from "react";
import DoctorsListClient from "@/components/DoctorsListClient";
import { getCategories, fetchDoctors } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface PageProps {
  searchParams: {
    page?: string;
    search?: string;
    category?: string;
    gender?: string;
  };
}

// Loading Component
function DoctorsLoading() {
  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-3">
      <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
      <p className="text-gray-500">در حال بارگذاری...</p>
    </div>
  );
}

export default async function DoctorsPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const category = searchParams.category || "all";
  const gender = searchParams.gender || "all";

  // تمام کال‌های API در سرور اجرا می‌شوند
  const [categories, doctorsData] = await Promise.all([
    getCategories(),
    fetchDoctors({
      page,
      perPage: 20,
      search: search || undefined,
      professionName: category !== "all" ? category : undefined,
      gender: gender !== "all" ? gender : undefined,
    }),
  ]);

  return (
    <Suspense fallback={<DoctorsLoading />}>
      <DoctorsListClient
        initialCategories={categories}
        initialDoctors={doctorsData.items}
        initialMeta={doctorsData.meta}
        initialFilters={{
          search,
          category,
          gender,
        }}
      />
    </Suspense>
  );
}
