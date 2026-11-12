import { redirect } from "next/navigation";

/** "Why Femur" now lives inside the About page. */
export default function WhyFemurRedirect() {
  redirect("/about#why-femur");
}
