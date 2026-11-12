import type { Metadata } from "next";
import { PatientsList } from "@/features/admin/patients";

export const metadata: Metadata = { title: "Patients" };

export default function Page() {
  return <PatientsList />;
}
