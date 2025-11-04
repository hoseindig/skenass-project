// ============================================
// app/api/doctors/route.ts (Route Handler)
// ============================================
import { NextRequest, NextResponse } from "next/server";
import { fetchDoctors } from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category");
  const gender = searchParams.get("gender");

  try {
    const data = await fetchDoctors({
      page,
      perPage: 20,
      search,
      professionName: category && category !== "all" ? category : undefined,
      gender: gender && gender !== "all" ? gender : undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
