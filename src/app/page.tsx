import { fetchProducts } from "@/lib/api";
import ProductList from "@/components/ProductList";

export default async function Home() {
  // SSR - دریافت داده از سمت سرور
  const data = await fetchProducts(100, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            فروشگاه آنلاین
          </h1>
          <p className="text-gray-600 text-lg">
            بهترین محصولات با بهترین قیمت 🛍️
          </p>
        </div>

        <ProductList
          initialProducts={data.products}
          totalProducts={data.total}
        />
      </div>
    </main>
  );
}
