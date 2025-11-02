// ============================================
// ✅ فایل 5: src/hooks/useDoctors.ts
// ============================================
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchDoctors,
  fetchDoctorById,
  type FetchDoctorsParams,
} from "@/lib/api";

// ✅ Query Keys Factory
export const doctorKeys = {
  all: ["doctors"] as const,
  lists: () => [...doctorKeys.all, "list"] as const,
  list: (filters: Omit<FetchDoctorsParams, "page">) =>
    [...doctorKeys.lists(), filters] as const,
  details: () => [...doctorKeys.all, "detail"] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
};

// ✅ Infinite Query برای لیست
export function useInfiniteDoctors(filters: Omit<FetchDoctorsParams, "page">) {
  return useInfiniteQuery({
    queryKey: doctorKeys.list(filters),
    queryFn: ({ pageParam }) =>
      fetchDoctors({ ...filters, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 دقیقه
  });
}

// ✅ Single Doctor Query
export function useDoctor(id: string) {
  return useQuery({
    queryKey: doctorKeys.detail(id),
    queryFn: () => fetchDoctorById(id),
    staleTime: 10 * 60 * 1000,
    enabled: !!id,
  });
}

// ✅ Prefetch Hook
export function usePrefetchDoctor() {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: doctorKeys.detail(id),
      queryFn: () => fetchDoctorById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}
