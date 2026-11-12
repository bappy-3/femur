import type { Gender, ID, ISODate } from "./common";
import type { Relationship } from "./appointment";
import type { MembershipState } from "./membership";

export type Role = "PATIENT" | "PRACTITIONER" | "RECEPTIONIST" | "ADMIN" | "SUPER_ADMIN";

export const STAFF_ROLES: Role[] = ["RECEPTIONIST", "ADMIN", "SUPER_ADMIN"];

export interface SessionUser {
  id: ID;
  fullName: string;
  phone: string;
  email: string | null;
  roles: Role[];
  membership: MembershipState;
}

export interface SavedPatient {
  id: ID;
  fullName: string;
  gender: Gender;
  dateOfBirth: ISODate | null;
  ageYears: number | null;
  phone: string;
  email: string | null;
  relationship: Relationship;
}

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  phone: string;
  email: string | null;
  gender: Gender;
  password: string;
}
