

// ============================================
// روش 3: Suspense Boundary (React 18+)
// ============================================
// src/components/DoctorCardSuspense.tsx

import { Suspense } from "react";
import DoctorCard from "./DoctorCardNewStyle";
import { Doctor } from "@/lib/api";

function DoctorCardSkeleton() {
    return (
        <div className="bg-gray-100 border border-gray-200 rounded-lg shadow-sm animate-pulse">
            <div className="p-4 flex items-start gap-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2 w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
            </div>
        </div>
    );
}

export default function DoctorCardSuspense({ doctor }: { doctor: Doctor }) {
    return (
        <Suspense fallback={<DoctorCardSkeleton />}>
            <DoctorCard doctor={doctor} />
        </Suspense>
    );
}