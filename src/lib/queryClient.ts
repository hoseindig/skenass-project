// ============================================
// ✅ فایل 7: src/lib/queryClient.ts
// ============================================
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 دقیقه
      gcTime: 10 * 60 * 1000, // 10 دقیقه
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});
