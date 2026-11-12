"use client";

import { ArrowLeft } from "lucide-react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { errorMessage } from "@/hooks/use-async";
import { api, isApiError } from "@/services";
import type { Service } from "@/types/catalog";
import type { SavedPatient } from "@/types/user";
import { BookingProgress } from "./booking-progress";
import { bookingReducer, initialBookingState, maxReachableStep } from "./booking-state";
import { BookingSummary } from "./booking-summary";
import { ConfirmationStep } from "./steps/confirmation-step";
import { DateStep } from "./steps/date-step";
import { GenderStep } from "./steps/gender-step";
import { PatientStep } from "./steps/patient-step";
import { ReviewStep } from "./steps/review-step";
import { ServiceStep } from "./steps/service-step";
import { TimeStep } from "./steps/time-step";

function newIdempotencyKey() {
  return globalThis.crypto?.randomUUID?.() ?? `bk-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

interface Props {
  services: Service[];
  initialServiceSlug: string | null;
  isSignedIn: boolean;
  clinicAddress: string;
  clinicPhone: string;
}

export function BookingWizard({ services, initialServiceSlug, isSignedIn, clinicAddress, clinicPhone }: Props) {
  const preselected = services.find((s) => s.slug === initialServiceSlug)?.id ?? null;
  const [state, dispatch] = useReducer(bookingReducer, undefined, () => initialBookingState(newIdempotencyKey(), preselected));
  const [savedPatients, setSavedPatients] = useState<SavedPatient[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [slotNotice, setSlotNotice] = useState<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const service = services.find((s) => s.id === state.serviceId);

  useEffect(() => {
    if (isSignedIn) api.account.listPatients().then(setSavedPatients).catch(() => setSavedPatients([]));
  }, [isSignedIn]);

  useEffect(() => {
    const top = topRef.current;
    if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [state.step]);

  async function confirm() {
    if (!service || !state.patient || !state.slot || !state.gender) return;
    setSubmitting(true);
    setSubmitError(null);
    const { reasonForVisit, patientId, ...p } = state.patient;
    try {
      const confirmation = await api.appointments.create(
        {
          serviceId: service.id,
          startsAt: state.slot.startsAt,
          patient: { ...p, patientId, gender: state.gender, dateOfBirth: null },
          reasonForVisit,
          preferredPractitionerId: null,
        },
        state.idempotencyKey,
      );
      dispatch({ type: "confirmed", confirmation });
    } catch (e) {
      if (isApiError(e) && (e.code === "SLOT_TAKEN" || e.code === "SLOT_UNAVAILABLE")) {
        setSlotNotice("Sorry — that time was just taken by someone else. Here are the times still available.");
        dispatch({ type: "slotTaken" });
      } else {
        setSubmitError(errorMessage(e));
      }
    } finally {
      setSubmitting(false);
    }
  }

  const showBack = state.step !== "service" && state.step !== "done";

  return (
    <LazyMotion features={domAnimation}>
      <div ref={topRef} className="scroll-mt-24 grid gap-10 lg:grid-cols-[1fr_19rem]">
        <div className="min-w-0">
          {state.step !== "done" && <BookingProgress current={state.step} reachable={maxReachableStep(state)} onGoTo={(step) => dispatch({ type: "goTo", step })} />}
          {showBack && (
            <button type="button" onClick={() => dispatch({ type: "back" })} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-deep">
              <ArrowLeft className="size-4" /> Back
            </button>
          )}
          <AnimatePresence mode="wait" initial={false}>
            <m.div key={state.step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: "easeOut" }}>
              {state.step === "service" && (
                <ServiceStep services={services} selectedId={state.serviceId} onSelect={(s) => dispatch({ type: "selectService", serviceId: s.id, eligibleGenders: s.rules.eligibleGenders })} />
              )}
              {state.step === "gender" && service && <GenderStep service={service} selected={state.gender} onSelect={(gender) => dispatch({ type: "selectGender", gender })} />}
              {state.step === "patient" && state.gender && (
                <PatientStep
                  gender={state.gender}
                  initial={state.patient}
                  savedPatients={savedPatients}
                  onSubmit={(patient) => dispatch({ type: "savePatient", patient })}
                  onChangeGender={() => dispatch({ type: "goTo", step: "gender" })}
                />
              )}
              {state.step === "date" && service && state.gender && (
                <DateStep service={service} gender={state.gender} selected={state.date} onSelect={(date) => dispatch({ type: "selectDate", date })} />
              )}
              {state.step === "time" && service && state.gender && state.date && (
                <TimeStep
                  service={service}
                  gender={state.gender}
                  date={state.date}
                  selected={state.slot}
                  notice={slotNotice}
                  onSelect={(slot) => {
                    setSlotNotice(null);
                    dispatch({ type: "selectSlot", slot });
                  }}
                  onChangeDate={() => dispatch({ type: "goTo", step: "date" })}
                />
              )}
              {state.step === "review" && service && state.gender && state.patient && state.slot && (
                <ReviewStep
                  service={service}
                  gender={state.gender}
                  patient={state.patient}
                  slot={state.slot}
                  submitting={submitting}
                  error={submitError}
                  onEdit={(step) => dispatch({ type: "goTo", step })}
                  onConfirm={confirm}
                />
              )}
              {state.step === "done" && state.confirmation && (
                <ConfirmationStep
                  confirmation={state.confirmation}
                  clinicAddress={clinicAddress}
                  isSignedIn={isSignedIn}
                  onBookAnother={() => dispatch({ type: "reset", idempotencyKey: newIdempotencyKey() })}
                />
              )}
            </m.div>
          </AnimatePresence>
        </div>
        {state.step !== "done" && <BookingSummary state={state} service={service} clinicPhone={clinicPhone} />}
      </div>
    </LazyMotion>
  );
}
