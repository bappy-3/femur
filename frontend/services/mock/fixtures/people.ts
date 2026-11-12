import type { Gender } from "@/types/common";

/** FICTIONAL demo patients for the admin UI. No real people. */
const MALE = ["Arif H.", "Tanvir R.", "Sakib M.", "Imran K.", "Rafiq A.", "Nayeem S.", "Fahim J.", "Mahmud T.", "Shafiq U.", "Rakib B.", "Zahid N.", "Habib C."];
const FEMALE = ["Nusrat J.", "Farzana A.", "Tasnim R.", "Sumaiya K.", "Ritu M.", "Sharmin H.", "Lamia S.", "Anika T.", "Mehnaz F.", "Sadia B.", "Rumana D.", "Afroza N."];

export interface DemoPerson {
  id: string;
  fullName: string;
  gender: Gender;
  ageYears: number;
  phone: string;
}

export const demoPeople: DemoPerson[] = [
  ...MALE.map((fullName, i) => ({ id: `pat_m${i + 1}`, fullName, gender: "MALE" as const, ageYears: 24 + ((i * 7) % 45), phone: `+88017000001${String(i).padStart(2, "0")}` })),
  ...FEMALE.map((fullName, i) => ({ id: `pat_f${i + 1}`, fullName, gender: "FEMALE" as const, ageYears: 22 + ((i * 5) % 48), phone: `+88018000002${String(i).padStart(2, "0")}` })),
];

/** The demo account used by "Sign in as demo patient". */
export const demoPatientUser = {
  id: "usr_demo_patient",
  fullName: "Demo Patient",
  phone: "+8801700000000",
  email: "demo.patient@example.com",
};

export const demoAdminUser = {
  id: "usr_demo_admin",
  fullName: "Demo Admin",
  phone: "+8801700000999",
  email: "demo.admin@example.com",
};
