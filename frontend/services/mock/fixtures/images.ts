import type { ImageAsset } from "@/types/common";

/**
 * Stock photography (Unsplash licence) used as STAND-INS until Femur supplies its own photos.
 * In live mode, images come from the CMS media library instead.
 */
const u = (id: string, alt: string): ImageAsset => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1800&q=80`,
  alt,
});

const portrait = (id: string, alt: string): ImageAsset => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces&w=700&h=875&q=80`,
  alt,
});

/** Stand-in staff portraits (Unsplash licence). Replace via the admin portal with real clinic photos. */
export const portraits = {
  maleA: portrait("1507003211169-0a1dd7228f2d", "Portrait of a male physiotherapist"),
  maleB: portrait("1622253692010-333f2da6031d", "Portrait of a male physiotherapist in scrubs"),
  femaleA: portrait("1643297654416-05795d62e39c", "Portrait of a female physiotherapist with a stethoscope"),
  femaleB: portrait("1580489944761-15a19d654956", "Portrait of a smiling female physiotherapist"),
  nutritionist: portrait("1573497019940-1c28c88b4f3e", "Portrait of a smiling nutritionist"),
  physician: portrait("1472099645785-5658abf4ff4e", "Portrait of a general physician"),
  eye: portrait("1623854767648-e7bb8009f0db", "Portrait of a female eye specialist in a white coat"),
  dental: portrait("1612349317150-e413f6a5b16d", "Portrait of a dental surgeon in a white coat"),
} as const;

export const stock = {
  physioGuided: u("1645005513713-9e2b92a687d3", "Physiotherapist guiding a patient through a supervised exercise"),
  painNeck: u("1767972463825-96eaa9e0766b", "Highlighted red area of pain on a patient's neck and shoulder"),
  rehabClinic: u("1773227055624-07b515ba87c5", "Caregiver assisting an older patient during rehabilitation"),
  kneeExercise: u("1649751361457-01d3a696c7e6", "Physiotherapist guiding a patient's knee exercise"),
  heroClinic: u("1709880754445-8ffbd7e6ab3a", "Physiotherapist and patient working together in a bright rehabilitation studio"),
  groupExercise: u("1518310383802-640c2de311b2", "Women exercising together in a bright studio"),
  yoga: u("1600881333168-2ef49b341f30", "Person stretching in a downward dog on a mat"),
  elderCare: u("1576765608866-5b51046452be", "Clinician caring for an older patient"),
  weights: u("1571019614242-c5c5dee9f50b", "Coach guiding a client through a supervised exercise"),
  heroExercise: u("1518611012118-696072aa579a", "Women performing guided rehabilitation exercises on mats in a bright studio"),
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
  acupuncture: u("1512290923902-8a9f81dc236c", "Patient resting while a practitioner places fine acupuncture needles"),
  bodyCare: u("1544161515-4ab6ce6db874", "Therapist applying oil to a patient's back during a treatment session"),
  calm: u("1600618528240-fb9fc964b853", "Person sitting in calm meditation in warm morning light"),
  familyNewborn: u("1543342384-1f1350e27861", "Mother and father gently holding their newborn baby"),
  motherChild: u("1531983412531-1f49a365ffed", "Mother lifting her smiling child by the sea"),
  newbornSleep: u("1544126592-807ade215a0b", "Newborn baby sleeping peacefully wrapped in soft blankets"),
  babyFeet: u("1555252333-9f8e92e65df9", "Tiny newborn feet resting on a soft white towel"),
  beachYoga: u("1545205597-3d9d02c29597", "Women practising a gentle balance pose together on the beach"),
  motherhood: u("1476703993599-0035a21b17a9", "Mother at home with her toddler and baby"),
  scanReview: u("1666214280557-f1b5022eb634", "Clinicians discussing a scan on a monitor"),
} as const;
