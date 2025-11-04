// ============================================
// app/page.tsx (Server Component)
// ============================================
import HomeClient from "@/components/HomeClient";
import { fetchDoctors, getCategories } from "@/lib/api";

export default async function Home() {
  // همه API calls در سرور اجرا می‌شوند
  const [featuredDoctors, categories] = await Promise.all([
    fetchDoctors({ page: 1, perPage: 6 }), // فقط 6 تا برای نمایش اولیه
    getCategories(),
  ]);
  console.log('featuredDoctors', featuredDoctors);


  return (
    <HomeClient
      doctors={featuredDoctors.items}
      categories={categories}
    />
  );
}