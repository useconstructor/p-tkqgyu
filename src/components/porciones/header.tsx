"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import branding from "../../../branding.json";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="border-b border-border/30">
      <div className="mx-auto flex min-h-14 max-w-[1120px] items-center justify-between gap-2 px-4 sm:px-8">
        <Link href="/" aria-label={`${branding.logoText}, Inicio`} className="flex min-h-12 shrink-0 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-brand-logo src={branding.logoImageUrl || "/brand-mark.svg"} alt="" width={32} height={32} className="size-8 object-contain" />
          <span className="text-xl font-semibold">{branding.logoText}</span>
        </Link>
        <nav aria-label="Navegación principal" className="flex items-center gap-2 sm:gap-6">
          {[["/", "Inicio"], ["/calculadora", "Calculadora"]].map(([href, title]) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
              className="flex min-h-11 items-center px-1 text-sm font-medium underline-offset-8 hover:underline aria-[current=page]:text-primary aria-[current=page]:underline aria-[current=page]:decoration-2">
              {title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
