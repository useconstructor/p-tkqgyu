import { OpenCalculator } from "@/components/porciones/open-calculator";
import { RecipeResults } from "@/components/porciones/recipe-results";

export default function Home() {
  return (
    <main id="contenido" className="mx-auto w-full max-w-[864px] px-4 pb-6 pt-6 sm:px-8 sm:pt-12 md:pt-16">
      <div className="mb-6 max-w-[600px] sm:mb-8">
        <h1 className="text-[28px] leading-[1.2] font-semibold tracking-[-0.025em] sm:text-[40px]">
          Ajusta la receta a tu mesa
        </h1>
        <p className="mt-4 text-base leading-6 sm:leading-7">
          Elige de 1 a 20 personas y consulta las cantidades al instante.
          Cambia entre gramos y kilogramos.
        </p>
      </div>
      <section aria-labelledby="receta-inicio" className="rounded-[var(--radius)] border border-border bg-card">
        <div className="px-5 pt-5 sm:px-8 sm:pt-8">
          <h2 id="receta-inicio" className="text-2xl leading-8 font-semibold">
            Tacos <span className="font-normal">· 4 personas</span>
          </h2>
          <p className="mt-2 text-sm leading-5">Ejemplo para cuatro. Conservamos tus preferencias al abrir la calculadora.</p>
        </div>
        <div className="px-5 py-2 sm:px-8 sm:py-6">
          <RecipeResults personas={4} unidad="gramos" />
        </div>
        <div className="px-5 pb-5 sm:px-8 sm:pb-8"><OpenCalculator /></div>
      </section>
      <p className="mt-4 text-sm leading-5">Ajusta de 1 a 20 personas. Las preferencias se guardan solo en este navegador.</p>
    </main>
  );
}
