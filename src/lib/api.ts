// src/lib/api.ts

// Re-export types directly
export type { Doctor, DoctorsResponse } from "@/types/product";

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

  if (search) {
    queryParams.append("search", search);
  }

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

// Fetch single doctor by ID
export async function fetchDoctorById(id: string): Promise<Doctor | null> {
  const url = `${API_BASE}/contracted-doctors/${id}`;

  console.log("🌐 Fetching doctor by ID:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error("❌ Error fetching doctor:", res.status);
      return null;
    }

    const response = await res.json();
    console.log("✅ Doctor response:", response);

    return response.data.doctor;
  } catch (error) {
    console.error("🔥 Fetch doctor error:", error);
    return null;
  }
}

export async function searchDoctors(query: string): Promise<Doctor[]> {
  const response = await fetchDoctors({ search: query });
  return response.items;
}

export async function getCategories(): Promise<string[]> {
  const response = await fetchDoctors({ perPage: 100 });
  const uniqueCategories = [
    ...new Set(response.items.map((d) => d.profession_name)),
  ];
  return uniqueCategories;
}
