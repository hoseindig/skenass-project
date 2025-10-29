import { Product, ProductsResponse } from "@/types/product";

const API_BASE = "https://dummyjson.com";

export async function fetchProducts(
  limit = 20,
  skip = 0
): Promise<ProductsResponse> {
  const res = await fetch(`${API_BASE}/products?limit=${limit}&skip=${skip}`, {
    cache: "no-store", // For SSR fresh data
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function searchProducts(query: string): Promise<Product[]> {
  const res = await fetch(`${API_BASE}/products/search?q=${query}`);
  if (!res.ok) throw new Error("Failed to search products");
  const data = await res.json();
  return data.products;
}
