import type { ImageAsset } from "@/types/common";

/**
 * Stock photography (Unsplash licence) used as STAND-INS until Femur supplies its own photos.
 * In live mode, images come from the CMS media library instead.
 */
const u = (id: string, alt: string): ImageAsset => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=80`,
  alt,
});

export const stock = {
  manualTherapy: u("1519824145371-296894a0daa9", "Physiotherapist applying hands-on manual therapy to a patient's back"),
  manualTherapyAlt: u("1519823551278-64ac92734fb1", "Close-up of a therapist's hands treating the lower back"),
  consultation: u("1666214277730-e9c7e755e5a3", "Clinician in conversation with a patient in a bright clinic"),
  clinicianWithPatient: u("1581056771107-24ca5f033842", "Clinician reviewing notes with a seated patient"),
  rehabGym: u("1540497077202-7c8a3999166f", "Bright rehabilitation and exercise space"),
  exerciseClass: u("1518611012118-696072aa579a", "People performing guided floor exercises on mats"),
  exerciseMat: u("1571019613454-1cb2f99b2d8b", "Person doing a core strengthening exercise on a mat"),
  assistedTraining: u("1616279969856-759f316a5ac1", "Trainer guiding a client through a suspension exercise"),
  posture: u("1552196563-55cd4e45efb3", "Person sitting upright in a calm, balanced posture"),
  sports: u("1607962837359-5e7e89f86776", "Runners training outdoors"),
  strength: u("1517836357463-d25dfeac3438", "Athlete preparing for a controlled barbell lift"),
  pregnancy: u("1493894473891-10fc1e5dbd22", "Expectant mother with hands forming a heart over her bump"),
  wristBrace: u("1597764690523-15bea4c581c9", "Clinician fitting a supportive wrist brace"),
  xray: u("1588776814546-1ffcf47267a5", "Clinician reviewing an X-ray on a light board"),
  neuro: u("1559757148-5c350d0d3c56", "Anatomical model of the human brain"),
  supportHands: u("1584515933487-779824d29309", "Two people holding hands in reassurance"),
  nutrition: u("1490645935967-10de6ba17061", "Colourful plate of balanced, nutritious food"),
  medicine: u("1576091160399-112ba8d25d1d", "Doctor with a stethoscope"),
  eye: u("1574258495973-f010dfbb5371", "Pair of prescription glasses on a white surface"),
  dental: u("1629909613654-28e377c37b09", "Modern dental treatment room"),
} as const;
