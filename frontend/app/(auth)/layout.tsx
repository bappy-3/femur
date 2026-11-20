import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/media/logo";
import { brandImagery } from "@/config/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden overflow-hidden bg-teal-deep lg:block">
        <Image src={brandImagery.authPanel.src} alt="" fill sizes="50vw" className="object-cover opacity-40" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-deep via-teal-deep/60 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" aria-label="Femur home">
            <Logo inverse />
          </Link>
          <div className="max-w-md">
            <p className="font-display text-4xl leading-tight font-medium">
              Move better. <em className="not-italic">Live better.</em>
            </p>
            <p className="mt-4 text-white/70">One account to book appointments, manage family members, track your care and — with membership — talk to Nira.</p>
          </div>
        </div>
      </aside>
      <main className="flex flex-col px-4 py-8 sm:px-10">
        <Link href="/" aria-label="Femur home" className="lg:hidden">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</div>
      </main>
    </div>
  );
}
