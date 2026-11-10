export type Unit = "gramos" | "kilogramos";
export type Preference = { version: 1; personas: number; unidad: Unit };
export const PREFERENCES_KEY = "porciones.preferences.v1";
export const DEFAULT_PREFERENCE: Preference = { version: 1, personas: 4, unidad: "gramos" };

export function validatePeople(raw: string): string | null {
  if (raw === "") return "Introduce el número de personas";
  if (/\s/.test(raw)) return "Introduce un número entero entre 1 y 20";
  if (/^-?(?:\d+[.,]\d*|[.,]\d+)$/.test(raw)) return "Introduce un número entero, sin decimales";
  if (/^-\d+$/.test(raw)) return "El mínimo es 1 persona";
  if (!/^\d+$/.test(raw)) return "Introduce un número entero entre 1 y 20";
  const significant = raw.replace(/^0+/, "");
  if (!significant) return "El mínimo es 1 persona";
  if (significant.length > 2 || Number(significant) > 20) return "El máximo es 20 personas";
  return null;
}

export function isPreference(value: unknown): value is Preference {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return record.version === 1
    && typeof record.personas === "number"
    && Number.isInteger(record.personas)
    && record.personas >= 1 && record.personas <= 20
    && (record.unidad === "gramos" || record.unidad === "kilogramos");
}

export function peopleLabel(personas: number) {
  return `${personas} ${personas === 1 ? "persona" : "personas"}`;
}
