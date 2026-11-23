import { Activity, Apple, Baby, Bandage, Bone, Brain, Dumbbell, Eye, Flower2, Footprints, HandHeart, HeartHandshake, PersonStanding, Smile, Sprout, Stethoscope, type LucideIcon } from "lucide-react";
import type { ServiceIconKey } from "@/types/catalog";

const ICONS: Record<ServiceIconKey, LucideIcon> = {
  activity: Activity,
  pain: HandHeart,
  pregnancy: Baby,
  preconception: Sprout,
  postnatal: HeartHandshake,
  pelvic: Flower2,
  sports: Footprints,
  bone: Bone,
  brain: Brain,
  surgery: Bandage,
  posture: PersonStanding,
  exercise: Dumbbell,
  nutrition: Apple,
  medicine: Stethoscope,
  eye: Eye,
  dental: Smile,
};

export function ServiceIcon({ icon, className }: { icon: ServiceIconKey; className?: string }) {
  const Icon = ICONS[icon] ?? Activity;
  return <Icon aria-hidden className={className} strokeWidth={1.75} />;
}
