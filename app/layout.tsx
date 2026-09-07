import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Café Nube — Menú digital",
  description: "El menú digital de Café Nube."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${sans.variable} ${display.variable} font-sans antialiased text-ink selection:bg-espresso/15 selection:text-ink`}>
        {children}
      </body>
    </html>
  );
}
