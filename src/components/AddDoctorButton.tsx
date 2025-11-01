// src/components/AddDoctorButton.tsx
"use client";

import { Plus } from "lucide-react";

interface AddDoctorButtonProps {
  onClick: () => void;
}

export default function AddDoctorButton({ onClick }: AddDoctorButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
    >
      <Plus className="w-5 h-5" />
      <span>افزودن دکتر</span>
    </button>
  );
}
