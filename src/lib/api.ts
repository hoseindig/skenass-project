// src/lib/api.ts

import { Doctor, DoctorsResponse } from "@/types/product";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://skenass.com/api/v1";

interface FetchDoctorsParams {
  page?: number;
  perPage?: number;
  search?: string;
  professionName?: string;
  gender?: string;
}

export async function fetchDoctors(
  params: FetchDoctorsParams = {}
): Promise<DoctorsResponse> {
  const {
    page = 1,
    perPage = 20,
    search = "",
    professionName = "",
    gender = "",
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (search) queryParams.append("search", search);
  if (professionName && professionName !== "all") {
    queryParams.append("profession_name", professionName);
  }
  if (gender && gender !== "all") {
    queryParams.append("gender", gender);
  }

  const url = `${API_BASE}/contracted-doctors?${queryParams.toString()}`;
  console.log("🌐 Fetching from:", url);

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
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

export async function fetchDoctorById(id: string): Promise<Doctor | null> {
  const url = `${API_BASE}/contracted-doctors/${id}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return null;

    const response = await res.json();
    return response.data.doctor;
  } catch (error) {
    console.error("🔥 Fetch doctor error:", error);
    return null;
  }
}

// ✅ راه‌حل 1: استفاده از دیتای موجود
export function extractCategories(doctors: Doctor[]): string[] {
  const uniqueCategories = [...new Set(doctors.map((d) => d.profession_name))];
  return uniqueCategories.sort();
}

// ✅ راه‌حل 2: API جداگانه برای دسته‌بندی‌ها (اگر وجود دارد)
export async function getCategories(): Promise<string[]> {
  // اگر API جداگانه برای دسته‌بندی‌ها دارید:
  // const url = `${API_BASE}/professions`;
  // const res = await fetch(url);
  // return res.json();

  // در غیر این صورت از این روش استفاده کنید:
  return [
    "متخصص قلب",
    "متخصص اطفال",
    "متخصص زنان",
    "دندانپزشک",
    // ... سایر دسته‌بندی‌های ثابت
  ];
}
