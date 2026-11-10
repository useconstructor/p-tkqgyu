"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

declare global {
  interface Window { constructorTrack?: (event: string) => void }
}

export function OpenCalculator() {
  return (
    <Link href="/calculadora"
      onClick={() => window.constructorTrack?.("Calculator opened")}
      className="flex min-h-12 w-full items-center justify-between gap-4 rounded-[var(--radius)] bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#294720] active:bg-[#20291F]">
      <span>Abrir calculadora</span><ArrowRight aria-hidden="true" className="size-5" />
    </Link>
  );
}
