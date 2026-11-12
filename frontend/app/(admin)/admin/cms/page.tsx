import type { Metadata } from "next";
import { CmsAdmin } from "@/features/admin/cms-admin";

export const metadata: Metadata = { title: "Website CMS" };

export default function Page() {
  return <CmsAdmin />;
}
