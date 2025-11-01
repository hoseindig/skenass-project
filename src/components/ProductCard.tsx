import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col">
      <img
        src={product.image}
        alt={product.title}
        className="h-48 object-contain mb-4"
      />
      <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
        {product.title}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
        {product.description}
      </p>
      <div className="mt-auto flex justify-between items-center">
        <span className="font-bold text-blue-600">${product.price}</span>
        <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition">
          افزودن 🛒
        </button>
      </div>
    </div>
  );
}
