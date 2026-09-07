import type { Metadata } from "next";
import { QrManager } from "@/components/qr-manager";

export const metadata: Metadata = {
  title: "Código QR para Mesas · Administración Café Nube",
  description: "Generador de código QR y tarjetas de mesa imprimibles para Café Nube.",
};

export default function QrPage() {
  return <QrManager />;
}
