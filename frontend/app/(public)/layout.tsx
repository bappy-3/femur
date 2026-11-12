import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { api } from "@/services";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await api.cms.getSettings();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-teal focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <SiteHeader announcement={settings.announcement} />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
