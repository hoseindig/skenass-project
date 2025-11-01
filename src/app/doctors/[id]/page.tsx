// src/app/doctors/[id]/page.tsx
import { notFound } from "next/navigation";
import DoctorDetail from "@/components/DoctorDetail";

const API_BASE = "https://skenass.com/api/v1";

async function fetchDoctorById(id: string) {
    try {
        const res = await fetch(`${API_BASE}/contracted-doctors/${id}`, {
            cache: "no-store",
        });

        if (!res.ok) return null;

        const response = await res.json();
        // Fix: Access the nested doctor object
        return response.data.doctor;
    } catch (error) {
        return null;
    }
}

export default async function DoctorPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    // Await the params Promise
    const { id } = await params;

    const doctor = await fetchDoctorById(id);

    if (!doctor) {
        notFound();
    }

    return <DoctorDetail doctor={doctor} />;
}