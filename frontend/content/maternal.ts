import { stock } from "@/services/mock/fixtures/images";
import type { Faq } from "@/types/content";
import type { ImageAsset } from "@/types/common";

/** The three maternal stages that organise Femur's primary offering. Original copy; clinical review required. */
export interface MaternalStage {
  id: "pre-pregnancy" | "pregnancy" | "postnatal";
  name: string;
  bn: string;
  tagline: string;
  bnTagline: string;
  image: ImageAsset;
  points: string[];
  serviceSlug: string;
  conditionSlugs: string[];
  cta: string;
}

export const maternalStages: MaternalStage[] = [
  {
    id: "pre-pregnancy",
    name: "Pre-pregnancy",
    bn: "গর্ভধারণের আগে",
    tagline: "Start strong. Build strength, mobility and pelvic health before you conceive.",
    bnTagline: "শক্তি, নমনীয়তা ও পেলভিক স্বাস্থ্য গড়ে তুলুন।",
    image: stock.beachYoga,
    points: ["Posture, core and pelvic floor check", "Treat existing back, hip or pelvic pain", "A gentle strength and mobility routine"],
    serviceSlug: "preconception-care",
    conditionSlugs: ["preconception-readiness"],
    cta: "Book pre-pregnancy care",
  },
  {
    id: "pregnancy",
    name: "Pregnancy",
    bn: "গর্ভাবস্থায়",
    tagline: "Stay comfortable and active through every trimester, safely.",
    bnTagline: "প্রতিটি ট্রাইমেস্টারে নিরাপদে আরামদায়ক ও সক্রিয় থাকুন।",
    image: stock.pregnancy,
    points: ["Relief for back, hip and pelvic girdle pain", "Safe exercise and breathing for birth", "Coordinated with your doctor or midwife"],
    serviceSlug: "pregnancy-rehabilitation",
    conditionSlugs: ["pregnancy-back-pain", "pelvic-girdle-pain"],
    cta: "Book pregnancy care",
  },
  {
    id: "postnatal",
    name: "Postnatal",
    bn: "প্রসবের পরে",
    tagline: "Heal well after birth and rebuild your core, pelvic floor and confidence.",
    bnTagline: "প্রসবের পর সুস্থ হয়ে উঠুন, কোর ও পেলভিক ফ্লোর ফিরে পান।",
    image: stock.familyNewborn,
    points: ["Recovery after vaginal birth or C-section", "Core and pelvic floor rebuilding", "Relief from feeding and lifting strain"],
    serviceSlug: "postnatal-recovery",
    conditionSlugs: ["c-section-recovery", "diastasis-recti-core", "pelvic-floor-postpartum"],
    cta: "Book postnatal care",
  },
];

export const maternalPromises = [
  { title: "Female physiotherapists only", body: "Every maternal appointment is with a female physiotherapist, in a private room." },
  { title: "Trimester-aware care", body: "Treatment and exercise adapt to your stage and how you feel on the day." },
  { title: "Works with your doctor or midwife", body: "We share advice with your care team and tell you when to check in with them." },
  { title: "Baby welcome", body: "Postnatal mothers can bring their baby along. We plan around feeds and sleep." },
];

export const maternalFirstVisit = [
  { title: "Listen", body: "We hear about your health, pregnancy or birth history and what matters most to you." },
  { title: "Assess", body: "A gentle examination of posture, movement, core and, with your consent, pelvic floor." },
  { title: "Plan", body: "A clear, staged plan, with exercises you can do at home." },
  { title: "Support", body: "Regular reviews, adjusted as you move through pregnancy or recovery." },
];

export const maternalWarningSigns = [
  "Vaginal bleeding or leaking fluid in pregnancy",
  "Regular, tightening pains or a drop in your baby's movements",
  "Severe headache with vision changes or sudden swelling",
  "Fever, or a wound that is red, hot or leaking after a C-section",
  "Heavy bleeding or foul-smelling discharge after birth",
  "A painful swollen calf, chest pain or breathlessness",
];

export const maternalFaqs: Faq[] = [
  { q: "Is physiotherapy safe during pregnancy?", a: "Yes, when delivered by a physiotherapist trained in women's health and adapted to your stage of pregnancy. We work alongside your doctor or midwife and tell you which activities to avoid." },
  { q: "When can I start after giving birth?", a: "Gentle breathing and walking can usually begin early. We start structured treatment when your doctor has cleared you, commonly around six weeks, or earlier for specific problems after discussing it with them." },
  { q: "Can I bring my baby to the appointment?", a: "Yes. Postnatal mothers are welcome to bring their baby, and we plan sessions around feeds and sleep." },
  { q: "Will I be seen by a female physiotherapist?", a: "Always. Pre-pregnancy, pregnancy and postnatal care are provided by female physiotherapists only." },
  { q: "Do I need a referral?", a: "No referral is needed to book. If we find something that needs a doctor first, we will tell you." },
  { q: "Are all treatments suitable in pregnancy?", a: "No. Some device-based treatments are not suitable during pregnancy. Your physiotherapist will choose only what is safe for you, and focuses on gentle hands-on care and exercise." },
];
