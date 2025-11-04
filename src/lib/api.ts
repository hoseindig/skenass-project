// ============================================
// lib/api.ts (بروزرسانی شده)
// ============================================
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface Doctor {
  id: string;
  name: string;
  profession_name: string;
  gender: string;
  // ... سایر فیلدها
}

export interface DoctorsResponse {
  items: Doctor[];
  meta: PaginationMeta;
}

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
  const { page = 1, perPage = 20, search, professionName, gender } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (search) queryParams.append("search", search);
  if (professionName) queryParams.append("profession_name", professionName);
  if (gender) queryParams.append("gender", gender);

  const url = `${API_BASE}/contracted-doctors?${queryParams.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // Cache for 60 seconds
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch doctors: ${res.status}`);
  }

  const response = await res.json();
  return response.data;
}

export async function getCategories(): Promise<string[]> {
  // اگر API جداگانه دارید، از آن استفاده کنید
  // در غیر این صورت لیست ثابت برگردانید
  return [
    "متخصص قلب",
    "متخصص اطفال",
    "متخصص زنان",
    "دندانپزشک",
    "متخصص پوست",
    "متخصص چشم",
    // ... سایر تخصص‌ها
  ];
}
