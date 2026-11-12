/**
 * Booking wizard state machine (pure — unit tested).
 * Steps: service → gender → patient → date → time → review → done
 */
import type { AppointmentConfirmation, AvailabilitySlot } from "@/types/appointment";
import type { Gender, ID, ISODate } from "@/types/common";
import type { PatientDetails } from "@/features/auth/schemas";

export const STEPS = ["service", "gender", "patient", "date", "time", "review", "done"] as const;
export type Step = (typeof STEPS)[number];

export const STEP_LABELS: Record<Exclude<Step, "done">, string> = {
  service: "Service",
  gender: "Patient",
  patient: "Details",
  date: "Date",
  time: "Time",
  review: "Review",
};

export interface BookingState {
  step: Step;
  serviceId: ID | null;
  gender: Gender | null;
  patient: (PatientDetails & { patientId: ID | null }) | null;
  date: ISODate | null;
  slot: AvailabilitySlot | null;
  confirmation: AppointmentConfirmation | null;
  idempotencyKey: string;
}

export type BookingAction =
  | { type: "selectService"; serviceId: ID; eligibleGenders: Gender[] }
  | { type: "selectGender"; gender: Gender }
  | { type: "savePatient"; patient: PatientDetails & { patientId: ID | null } }
  | { type: "selectDate"; date: ISODate }
  | { type: "selectSlot"; slot: AvailabilitySlot }
  | { type: "goTo"; step: Step }
  | { type: "back" }
  | { type: "slotTaken" }
  | { type: "confirmed"; confirmation: AppointmentConfirmation }
  | { type: "reset"; idempotencyKey: string };

export function initialBookingState(idempotencyKey: string, serviceId: ID | null = null): BookingState {
  return { step: serviceId ? "gender" : "service", serviceId, gender: null, patient: null, date: null, slot: null, confirmation: null, idempotencyKey };
}

const indexOf = (s: Step) => STEPS.indexOf(s);

/** Furthest step the user may jump to, based on what has been filled in. */
export function maxReachableStep(s: BookingState): Step {
  if (!s.serviceId) return "service";
  if (!s.gender) return "gender";
  if (!s.patient) return "patient";
  if (!s.date) return "date";
  if (!s.slot) return "time";
  return "review";
}

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  if (state.step === "done" && action.type !== "reset") return state;
  switch (action.type) {
    case "selectService": {
      const genderStillValid = state.gender && (action.eligibleGenders.length === 0 || action.eligibleGenders.includes(state.gender));
      const changed = action.serviceId !== state.serviceId;
      return {
        ...state,
        serviceId: action.serviceId,
        gender: genderStillValid ? state.gender : null,
        patient: genderStillValid ? state.patient : null,
        date: changed ? null : state.date,
        slot: changed ? null : state.slot,
        step: "gender",
      };
    }
    case "selectGender": {
      const changed = action.gender !== state.gender;
      return {
        ...state,
        gender: action.gender,
        patient: state.patient && changed ? { ...state.patient, gender: action.gender } : state.patient,
        date: changed ? null : state.date,
        slot: changed ? null : state.slot,
        step: "patient",
      };
    }
    case "savePatient":
      return { ...state, patient: action.patient, step: state.date && state.slot ? "review" : "date" };
    case "selectDate":
      return { ...state, date: action.date, slot: action.date === state.date ? state.slot : null, step: "time" };
    case "selectSlot":
      return { ...state, slot: action.slot, step: "review" };
    case "goTo":
      return indexOf(action.step) <= indexOf(maxReachableStep(state)) ? { ...state, step: action.step } : state;
    case "back": {
      const i = indexOf(state.step);
      return i > 0 ? { ...state, step: STEPS[i - 1]! } : state;
    }
    case "slotTaken":
      return { ...state, slot: null, step: "time" };
    case "confirmed":
      return { ...state, confirmation: action.confirmation, step: "done" };
    case "reset":
      return initialBookingState(action.idempotencyKey);
  }
}
