// ============================================
// ✅ فایل 6: src/lib/api.ts (بروزرسانی شده)
// ============================================
export interface Doctor {
  id: number;
  profile_image: string;
  full_name: string;
  profession_name: string;
  profession_id: number;
  city_name: string;
  city_id: number;
  province_name: string;
  province_id: number;
  comments_count: number;
  average_rating: number;
  medical_system_code: string;
  phone: string;
  bio: string | null;
  address: string;
  gender: "male" | "female";
  withdraw_count: number;
  experience_years: number;
  partnership_months: number;
  transaction_count: number;
}

export interface DoctorsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DoctorsResponse {
  items: Doctor[];
  meta: DoctorsMeta;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://skenass.com/api/v1";

export interface FetchDoctorsParams {
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
