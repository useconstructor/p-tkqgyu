"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RecipeResults } from "./recipe-results";
import {
  DEFAULT_PREFERENCE, PREFERENCES_KEY, isPreference, peopleLabel, validatePeople,
  type Preference, type Unit,
} from "@/lib/porciones";

type StorageState = "leyendo" | "sin cambios" | "recuperado" | "pendiente" | "guardado" | "error";

export function Calculator() {
  const [raw, setRaw] = useState("4");
  const [valid, setValid] = useState<Preference>(DEFAULT_PREFERENCE);
  const [storageState, setStorageState] = useState<StorageState>("leyendo");
  const [explanation, setExplanation] = useState("");
  const [storageFailed, setStorageFailed] = useState(false);
  const [revision, setRevision] = useState(0);
  const lastSaved = useRef<Preference | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const unitInputs = useRef<Partial<Record<Unit, HTMLInputElement>>>({});
  const error = validatePeople(raw);
  const loading = storageState === "leyendo";

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
    try {
      const stored = window.localStorage.getItem(PREFERENCES_KEY);
      if (stored === null) {
        setStorageState("sin cambios");
      } else {
        let parsed: unknown;
        try { parsed = JSON.parse(stored); } catch { parsed = null; }
        if (isPreference(parsed)) {
          const recovered: Preference = { version: 1, personas: parsed.personas, unidad: parsed.unidad };
          setRaw(String(recovered.personas));
          setValid(recovered);
          lastSaved.current = recovered;
          setStorageState("recuperado");
        } else {
          setExplanation("No se pudieron recuperar las preferencias. Se muestran 4 personas y gramos. Ajusta un valor o pulsa Restablecer para guardar.");
          setStorageState("sin cambios");
        }
      }
    } catch {
      setExplanation("No se pudieron recuperar las preferencias. Se muestran 4 personas y gramos. Puedes seguir calculando.");
      setStorageFailed(true);
      setStorageState("error");
    }
    });
    return () => {
      active = false;
      if (saveTimer.current !== null) clearTimeout(saveTimer.current);
    };
  }, []);

  function cancelPending() {
    if (saveTimer.current !== null) clearTimeout(saveTimer.current);
    saveTimer.current = null;
  }

  function persist(preference: Preference) {
    cancelPending();
    setStorageState("pendiente");
    setExplanation("");
    // A single cancellable write preserves the latest valid intent during rapid edits.
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null;
      try {
        window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preference));
        lastSaved.current = preference;
        setStorageFailed(false);
        setStorageState("guardado");
      } catch {
        setStorageFailed(true);
        setStorageState("error");
      }
    }, 0);
  }

  function apply(preference: Preference, nextRaw = String(preference.personas)) {
    setRaw(nextRaw);
    setValid(preference);
    setRevision((value) => value + 1);
    persist(preference);
  }

  function edit(nextRaw: string) {
    setRaw(nextRaw);
    if (validatePeople(nextRaw)) {
      cancelPending();
      setStorageState(storageFailed ? "error" : "sin cambios");
      return;
    }
    apply({ version: 1, personas: Number(nextRaw), unidad: valid.unidad }, nextRaw);
  }

  function retry() {
    if (error) {
      input.current?.focus();
      return;
    }
    persist(valid);
  }

  const status = error ? `Último cálculo válido: ${peopleLabel(valid.personas)}`
    : storageState === "leyendo" ? "Leyendo preferencias…"
    : storageState === "pendiente" ? "Guardando preferencias…"
    : storageState === "guardado" ? "Preferencias guardadas en este navegador"
    : storageState === "recuperado" ? "Preferencias recuperadas de este navegador"
    : storageState === "error" ? "No se pudieron guardar las preferencias"
    : "Listo para ajustar las cantidades";

  return (
    <section aria-labelledby="receta-calculadora" aria-busy={loading} data-storage-state={storageState}
      className="rounded-[var(--radius)] border border-border bg-card">
      <div className="px-4 pt-3 sm:px-8 sm:pt-6">
        <h2 id="receta-calculadora" className="text-xl leading-8 font-semibold sm:text-2xl">Tacos</h2>
      </div>
      <div className="grid gap-3 px-4 pb-3 pt-2 sm:gap-6 sm:px-8 sm:pb-6 sm:pt-4 min-[769px]:grid-cols-[1fr_1.1fr] min-[769px]:gap-10">
        <div className="space-y-3 sm:space-y-6">
          <div>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <label htmlFor="personas" className="text-base font-medium">Personas</label>
              <span id="personas-ayuda" className="text-sm">De 1 a 20</span>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" aria-label="Restar una persona"
                disabled={loading || !!error || valid.personas === 1}
                onClick={() => apply({ ...valid, personas: valid.personas - 1 })}
                className="size-11 rounded-[var(--radius)] bg-card transition-none disabled:opacity-100 disabled:bg-muted disabled:text-[#596153]">
                <Minus className="size-4" aria-hidden="true" />
              </Button>
              <Input ref={input} id="personas" type="text" inputMode="numeric" autoComplete="off"
                value={raw} disabled={loading} aria-invalid={!!error}
                aria-describedby={error ? "personas-ayuda personas-error personas-correccion" : "personas-ayuda"}
                onChange={(event) => edit(event.target.value)}
                className="h-11 rounded-[var(--radius)] bg-card text-center text-base tabular-nums transition-none md:text-base" />
              <Button type="button" variant="outline" aria-label="Sumar una persona"
                disabled={loading || !!error || valid.personas === 20}
                onClick={() => apply({ ...valid, personas: valid.personas + 1 })}
                className="size-11 rounded-[var(--radius)] bg-card transition-none disabled:opacity-100 disabled:bg-muted disabled:text-[#596153]">
                <Plus className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-2 min-h-10 text-sm leading-5 text-destructive">
              {error && (
                <>
                  <p id="personas-error" role="alert">{error}</p>
                  <p id="personas-correccion">Corrige Personas o pulsa Restablecer.</p>
                </>
              )}
            </div>
          </div>
          <fieldset role="radiogroup" aria-labelledby="unidad-etiqueta" disabled={loading || !!error}>
            <legend id="unidad-etiqueta" className="mb-1 text-base font-medium">Unidad para carne y cebolla</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["gramos", "kilogramos"] as Unit[]).map((unit) => (
                <label key={unit} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-border px-3 text-sm font-medium has-checked:border-primary has-checked:bg-muted has-disabled:cursor-not-allowed has-disabled:bg-muted hover:bg-muted">
                  {/* The ARIA group and controlled value keep one selection while Tab reaches both options. */}
                  <input ref={(element) => { if (element) unitInputs.current[unit] = element; }}
                    type="radio" value={unit} checked={valid.unidad === unit}
                    onChange={() => apply({ ...valid, unidad: unit }, raw)}
                    onKeyDown={(event) => {
                      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
                      event.preventDefault();
                      const nextUnit: Unit = unit === "gramos" ? "kilogramos" : "gramos";
                      unitInputs.current[nextUnit]?.focus();
                      apply({ ...valid, unidad: nextUnit }, raw);
                    }}
                    className="size-4 accent-primary" />
                  {unit === "gramos" ? "Gramos" : "Kilogramos"}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="min-w-0 self-center">
          <RecipeResults personas={valid.personas} unidad={valid.unidad} revision={revision} live />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border/30 px-4 py-3 sm:px-8 sm:py-4">
        <div className="min-w-0 flex-1 basis-[170px] text-sm leading-5">
          <p role="status" aria-atomic="true" className={storageState === "error" && !error ? "text-destructive" : ""}>{status}</p>
          {error && storageFailed && <p className="mt-1 text-destructive">No se pudieron guardar las preferencias</p>}
          {explanation && <p className="mt-2">{explanation}</p>}
          {storageState === "error" && !error && <p className="mt-1">Puedes seguir calculando. Pulsa Reintentar para volver a guardar.</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {storageFailed && <Button type="button" onClick={retry} className="h-11 rounded-[var(--radius)] px-4 transition-none hover:bg-[#294720]">Reintentar</Button>}
          <Button type="button" variant="outline" disabled={loading}
            onClick={() => apply({ ...DEFAULT_PREFERENCE })}
            className="h-11 gap-2 rounded-[var(--radius)] bg-card px-3 transition-none">
            <RotateCcw aria-hidden="true" className="size-4" />Restablecer
          </Button>
        </div>
      </div>
    </section>
  );
}
