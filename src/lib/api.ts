// src/lib/api.ts (یا doctors.ts)
import { Doctor, DoctorsResponse } from "@/types/product";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://skenass.com/api/v1";

export async function fetchDoctors(
  page = 1,
  perPage = 20
): Promise<DoctorsResponse> {
  const url = `${API_BASE}/contracted-doctors?page=${page}&per_page=${perPage}`;

  console.log("🌐 Fetching from:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Error:", text);
      throw new Error(`Failed to fetch doctors: ${res.status}`);
    }

    const response = await res.json();
    console.log("✅ Response:", response);

    return response.data;
  } catch (error) {
    console.error("🔥 Fetch error:", error);
    throw error;
  }
}

export async function searchDoctors(query: string): Promise<Doctor[]> {
  const url = `${API_BASE}/contracted-doctors?search=${query}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to search doctors: ${res.status}`);
  }

  const response = await res.json();
  return response.data.items;
}
