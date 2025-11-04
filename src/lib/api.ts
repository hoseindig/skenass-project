// ============================================
// lib/api.ts
// ============================================
export interface Doctor {
  id: string;
  name: string;
  profession_name: string;
  gender: string;
  // ... سایر فیلدها
}

export interface DoctorsResponse {
  items: Doctor[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://skenass.com/api/v1";

// تابعی برای گرفتن همه دکترها یکجا
export async function fetchAllDoctors(): Promise<Doctor[]> {
  const allDoctors: Doctor[] = [];
  let currentPage = 1;
  let lastPage = 1;

  console.log("🌐 Starting to fetch all doctors...");

  // Loop تا آخرین صفحه
  do {
    const url = `${API_BASE}/contracted-doctors?page=${currentPage}&per_page=100`;

    const res = await fetch(url, {
      cache: "force-cache", // Cache می‌کنیم برای بهبود performance
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch doctors: ${res.status}`);
    }

    const response = await res.json();
    const data: DoctorsResponse = response.data;

    allDoctors.push(...data.items);
    lastPage = data.meta.last_page;
    currentPage++;

    console.log(
      `✅ Fetched page ${currentPage - 1}/${lastPage} (${
        data.items.length
      } doctors)`
    );
  } while (currentPage <= lastPage);

  console.log(`🎉 Total doctors fetched: ${allDoctors.length}`);
  return allDoctors;
}

// اگر نیاز به fetch تک صفحه داشتید
export async function fetchDoctors(params: {
  page?: number;
  perPage?: number;
  search?: string;
  professionName?: string;
  gender?: string;
}): Promise<DoctorsResponse> {
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
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch doctors: ${res.status}`);
  }

  const response = await res.json();
  return response.data;
}

export async function getCategories(): Promise<string[]> {
  return [
    "متخصص قلب",
    "متخصص اطفال",
    "متخصص زنان",
    "دندانپزشک",
    "متخصص پوست",
    "متخصص چشم",
  ];
}
