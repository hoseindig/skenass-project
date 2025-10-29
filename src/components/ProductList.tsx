"use client";

import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import SearchFilter from "./SearchFilter";
import Pagination from "./Pagination";
import { Loader2 } from "lucide-react";
import Button from "./ui/Button";

interface ProductListProps {
  initialProducts: Product[];
  totalProducts: number;
}

export default function ProductList({
  initialProducts,
  totalProducts,
}: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInfiniteScroll, setIsInfiniteScroll] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const itemsPerPage = 12;

  // استخراج دسته‌بندی‌ها
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats);
  }, [products]);

  // فیلتر کردن محصولات (Client Side)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // محاسبه صفحات
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    if (isInfiniteScroll) {
      return filteredProducts.slice(0, currentPage * itemsPerPage);
    }
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage, isInfiniteScroll]);

  // Infinite Scroll با Intersection Observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        if (currentPage * itemsPerPage < filteredProducts.length) {
          setLoading(true);
          setTimeout(() => {
            setCurrentPage((prev) => prev + 1);
            setLoading(false);
          }, 500);
        }
      }
    },
    [loading, currentPage, filteredProducts.length]
  );

  useEffect(() => {
    if (!isInfiniteScroll) return;

    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver, isInfiniteScroll]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          محصولات ({filteredProducts.length})
        </h2>

        <Button
          variant={isInfiniteScroll ? "primary" : "outline"}
          size="sm"
          onClick={() => {
            setIsInfiniteScroll(!isInfiniteScroll);
            setCurrentPage(1);
          }}
        >
          {isInfiniteScroll ? "🔄 Infinite Scroll فعال" : "📄 Pagination فعال"}
        </Button>
      </div>

      <SearchFilter
        onSearch={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">محصولی یافت نشد 😔</p>
        </div>
      )}

      {isInfiniteScroll ? (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loading && (
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          )}
          {currentPage * itemsPerPage >= filteredProducts.length && (
            <p className="text-gray-500">همه محصولات نمایش داده شد ✅</p>
          )}
        </div>
      ) : (
        filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )
      )}
    </div>
  );
}
