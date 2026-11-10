"use client";

import { useEffect, useRef } from "react";
import type { Unit } from "@/lib/porciones";

const kilograms = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 3 });

export function RecipeResults({ personas, unidad, revision = 0, live = false }: {
  personas: number; unidad: Unit; revision?: number; live?: boolean;
}) {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!revision || !marker.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animation = marker.current.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 160, easing: "ease-out",
    });
    return () => animation.cancel();
  }, [revision]);
  const mass = (grams: number) => unidad === "gramos" ? String(grams) : kilograms.format(grams / 1000);
  const massUnit = (grams: number) => unidad === "kilogramos" && grams === 1000 ? "kilogramo" : unidad;
  return (
    <div className="relative pr-4 sm:pr-6" aria-live={live ? "polite" : undefined} aria-atomic={live || undefined} aria-label="Cantidades">
      <dl className="divide-y divide-border/30">
        <div className="flex min-h-10 items-baseline justify-between gap-3 py-1 sm:min-h-14 sm:py-3">
          <dt className="text-base">Tortillas</dt>
          <dd className="flex items-baseline gap-2 text-right tabular-nums">
            <span className="text-2xl leading-8 font-normal">{personas * 2}</span>
            <span className="w-[80px] text-left text-sm">unidades</span>
          </dd>
        </div>
        <div className="flex min-h-10 items-baseline justify-between gap-3 py-1 sm:min-h-14 sm:py-3">
          <dt className="text-base">Carne</dt>
          <dd className="flex items-baseline gap-2 text-right tabular-nums">
            <span className="text-2xl leading-8 font-normal">{mass(personas * 100)}</span>
            <span className="w-[80px] text-left text-sm">{massUnit(personas * 100)}</span>
          </dd>
        </div>
        <div className="flex min-h-10 items-baseline justify-between gap-3 py-1 sm:min-h-14 sm:py-3">
          <dt className="text-base">Cebolla</dt>
          <dd className="flex items-baseline gap-2 text-right tabular-nums">
            <span className="text-2xl leading-8 font-normal">{mass(personas * 25)}</span>
            <span className="w-[80px] text-left text-sm">{massUnit(personas * 25)}</span>
          </dd>
        </div>
      </dl>
      <span ref={marker} data-result-marker aria-hidden="true" className="absolute inset-y-1 right-0 w-[3px] rounded-full bg-primary" />
    </div>
  );
}
