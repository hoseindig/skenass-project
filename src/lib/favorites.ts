// src/lib/favorites.ts
import { Doctor } from "@/types/product";

const FAVORITES_KEY = "skenass_favorite_doctors";

export function getFavorites(): Doctor[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
}

export function addToFavorites(doctor: Doctor): void {
  const favorites = getFavorites();

  // Check if already exists
  const exists = favorites.some((fav) => fav.id === doctor.id);
  if (exists) return;

  favorites.push(doctor);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function removeFromFavorites(doctorId: number): void {
  const favorites = getFavorites();
  const filtered = favorites.filter((fav) => fav.id !== doctorId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
}

export function isFavorite(doctorId: number): boolean {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.id === doctorId);
}

export function toggleFavorite(doctor: Doctor): boolean {
  if (isFavorite(doctor.id)) {
    removeFromFavorites(doctor.id);
    return false;
  } else {
    addToFavorites(doctor);
    return true;
  }
}
