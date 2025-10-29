"use client";

import { Product } from "@/types/product";
import { Card } from "./ui/Card";
import { Star, ShoppingCart, ImageOff } from "lucide-react";
import Button from "./ui/Button";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  // چک کردن اینکه عکس معتبر هست یا نه
  const imageUrl = product.thumbnail || "";
  const hasValidImage = imageUrl && imageUrl.startsWith("http");

  return (
    <Card className="overflow-hidden animate-slide-up hover:scale-105 transition-transform duration-300">
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {hasValidImage && !imageError ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ImageOff className="w-16 h-16 mb-2" />
            <span className="text-sm">تصویر موجود نیست</span>
          </div>
        )}

        <div className="absolute top-2 right-2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          ${product.price}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">
              {product.rating || "N/A"}
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {product.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        <Button variant="primary" className="w-full" size="sm">
          <ShoppingCart className="w-4 h-4 ml-2" />
          افزودن به سبد
        </Button>
      </div>
    </Card>
  );
}
