import type { Metadata } from "next";
import { PatientProfile } from "@/features/admin/patients";

export const metadata: Metadata = { title: "Patient" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PatientProfile id={id} />;
}
