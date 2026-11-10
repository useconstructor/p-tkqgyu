import type { Metadata } from "next";
import type { CSSProperties } from "react";
import branding from "../../branding.json";
import { Header } from "@/components/porciones/header";
import "./globals.css";

const localFonts = new Set([
  "6dbe082463cf749cfa057d45c3048c90f4df031496498e5b5bdfd0b6babb9d16",
  "6f7a8c4219e021ff7c9131bc5f1f7af97bcd1436a59578d444a8cb92e9791742",
  "5311c66fd6d04ae45671236f7eae667b671c06c1dc7e88d52c206e5fadd0fb21",
  "e129a20e8ff7c907ffd07124b573e88c323b7b18afc934d4aa539a3e0f2fe100",
]);
const fontCss = branding.brandbook.fontFaces.map(face => {
  const source = localFonts.has(face.sha256) && face.url.endsWith(`/${face.sha256}.ttf`)
    ? `/fonts/${face.sha256}.ttf` : face.url;
  return `@font-face{font-family:${JSON.stringify(face.family)};font-style:normal;font-weight:${face.weight};font-display:swap;src:url(${JSON.stringify(source)}) format("truetype");}`;
}).join("\n");

export const metadata: Metadata = {
  title: "Porciones | Ajusta la receta a tu mesa",
  description: "App ficticia de ejemplo de Esteban. Ajusta una receta de tacos de 1 a 20 personas y consulta las cantidades en gramos o kilogramos.",
  icons: { icon: "/icon.svg", apple: "/brand-mark.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tokens = {
    "--brand-background": branding.backgroundColor,
    "--brand-surface": branding.secondaryColor,
    "--brand-primary": branding.primaryColor,
    "--brand-accent": branding.accentColor,
    "--brand-text": branding.textColor,
    "--brand-font-heading": `"${branding.fontHeading}"`,
    "--brand-font-body": `"${branding.fontBody}"`,
    "--radius": branding.borderRadius,
  } as CSSProperties;
  return (
    <html lang="es" style={tokens}>
      <head><style>{fontCss}</style></head>
      <body className="min-h-screen antialiased">
        <a href="#contenido" className="absolute left-4 top-2 z-50 flex min-h-11 -translate-y-[calc(100%+8px)] items-center rounded bg-card px-3 focus:translate-y-0">Saltar al contenido</a>
        <Header />
        {children}
        <footer className="mx-auto w-full max-w-[864px] px-4 pb-6 text-sm leading-5 sm:px-8">
          App ficticia de ejemplo de Esteban
        </footer>
        <script src={"https://constructor-api-git-dev-useconstructor.vercel.app/v1/projects/P-TKQGYU/analytics/script.js"} defer></script>
        <script src="/constructor-editor.js" defer></script>
      </body>
    </html>
  );
}
