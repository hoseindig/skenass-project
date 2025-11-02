// ============================================
// روش 2: با React Query - حرفه‌ای‌تر
// ============================================
// src/hooks/useFavorites.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const FAVORITES_KEY = "favoriteDoctors";

// خواندن favorites از localStorage
function getFavorites(): number[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
}

// ذخیره favorites در localStorage
function saveFavorites(favorites: number[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Hook برای مدیریت favorites
export function useFavorites() {
  const queryClient = useQueryClient();

  // Query برای گرفتن لیست favorites
  const { data: favorites = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: Infinity, // همیشه fresh (چون localStorage هست)
    initialData: [], // 👈 برای جلوگیری از hydration mismatch
  });

  // Mutation برای toggle
  const toggleFavorite = useMutation({
    mutationFn: async (doctorId: number) => {
      const currentFavorites = getFavorites();
      const newFavorites = currentFavorites.includes(doctorId)
        ? currentFavorites.filter((id) => id !== doctorId)
        : [...currentFavorites, doctorId];

      saveFavorites(newFavorites);
      return newFavorites;
    },
    onSuccess: (newFavorites) => {
      queryClient.setQueryData(["favorites"], newFavorites);
    },
  });

  return {
    favorites,
    toggleFavorite: (id: number) => toggleFavorite.mutate(id),
    isFavorite: (id: number) => favorites.includes(id),
  };
}
