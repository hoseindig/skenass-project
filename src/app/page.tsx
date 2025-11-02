// ============================================
// ✅ فایل 2: src/app/page.tsx
// ============================================
import { fetchDoctors } from "@/lib/api";
import DoctorsListOptimized from "@/components/DoctorsListOptimized";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { doctorKeys } from "@/hooks/useDoctors";

// ✅ ISR: هر 5 دقیقه regenerate
export const revalidate = 300;

export default async function HomePage() {
  try {
    // ✅ Prefetch در Server
    await queryClient.prefetchInfiniteQuery({
      queryKey: doctorKeys.list({ perPage: 20 }),
      queryFn: async () => {
        const data = await fetchDoctors({ page: 1, perPage: 20 });
        return data;
      },
      initialPageParam: 1,
    });

    const dehydratedState = dehydrate(queryClient);

    // استخراج دسته‌بندی‌ها
    const firstPage = await fetchDoctors({ page: 1, perPage: 20 });
    const categories = [
      ...new Set(firstPage.items.map((d) => d.profession_name)),
    ].sort();

    return (
      <HydrationBoundary state={dehydratedState}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">
            دکترهای طرف قرارداد
          </h1>
          <DoctorsListOptimized initialCategories={categories} />
        </div>
      </HydrationBoundary>
    );
  } catch (error) {
    console.error("Error in HomePage:", error);
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