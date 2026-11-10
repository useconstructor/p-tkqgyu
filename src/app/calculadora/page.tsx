import type { Metadata } from "next";
import { Calculator } from "@/components/porciones/calculator";

export const metadata: Metadata = { title: "Calculadora | Porciones" };

export default function CalculatorPage() {
  return (
    <main id="contenido" className="mx-auto w-full max-w-[864px] px-4 pb-4 pt-3 sm:px-8 sm:pb-8 sm:pt-10">
      <h1 className="mb-3 text-[28px] leading-9 font-semibold tracking-[-0.025em] sm:mb-6 sm:text-[40px] sm:leading-[48px]">Calculadora</h1>
      <Calculator />
    </main>
  );
}
