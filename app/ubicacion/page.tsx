"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  Clock3,
  Copy,
  Heart,
  MapPin,
  MessageCircle,
  Navigation,
  Sparkles
} from "lucide-react";

const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Roma+Norte,+Cuauht%C3%A9moc,+Ciudad+de+M%C3%A9xico";
const addressText = "Col. Roma Norte, Cuauhtémoc, Ciudad de México";

export default function LocationPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(addressText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <main className="cafe-shell min-h-screen bg-cream px-5 py-5 text-ink sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        {/* Top return bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2 text-xs sm:text-sm font-semibold text-ink/80 transition hover:border-espresso hover:bg-white hover:text-espresso active:scale-95 touch-manipulation"
          >
            <ChevronLeft size={16} />
            <span>Volver al menú</span>
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-[#cfe2ce] bg-[#eaf4e9] px-3 py-1.5 text-xs font-semibold text-[#2b612b]">
            <span className="h-2 w-2 rounded-full bg-[#2d632d] animate-pulse" />
            <span>Abierto hoy · 8:00 a 20:00</span>
          </span>
        </div>

        {/* Editorial Heading */}
        <header className="mt-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end sm:mt-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-sage">
              <Sparkles size={13} className="text-sage" />
              Ven a visitarnos
            </div>
            <h1 className="mt-2.5 font-display text-4xl leading-[1.06] sm:text-6xl text-ink">
              Encuentra tu<br />
              <em className="font-normal italic text-espresso">momento de calma.</em>
            </h1>
            <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-ink/75">
              Un rincón acogedor en el corazón de la Roma Norte con café de especialidad tostado localmente, barra de filtrados y pan recién horneado.
            </p>
          </div>

          {/* Location Summary Card */}
          <div className="rounded-3xl border border-line bg-white/80 p-6 text-sm text-ink/75 shadow-xs backdrop-blur-xs">
            <div className="flex gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream text-espresso">
                <MapPin size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <strong className="block text-base font-semibold text-ink">Café Nube</strong>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-espresso hover:underline touch-manipulation"
                    title="Copiar dirección"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-[#2d632d]" />
                        <span className="text-[#2d632d]">Copiada</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-1 leading-relaxed text-xs sm:text-sm">
                  Col. Roma Norte, Cuauhtémoc<br />
                  Ciudad de México, CDMX
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-3.5 border-t border-line/80 pt-4">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream text-espresso">
                <Clock3 size={18} />
              </div>
              <div>
                <strong className="block font-semibold text-ink text-sm">Horario de servicio</strong>
                <p className="mt-0.5 text-xs sm:text-sm tabular-nums leading-relaxed">
                  Lunes a domingo · 8:00 a 20:00 hrs
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-5 flex flex-wrap gap-2.5 pt-2">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-espresso active:scale-95 touch-manipulation"
              >
                <Navigation size={14} />
                <span>Cómo llegar</span>
                <ArrowUpRight size={14} />
              </a>
              <a
                href="https://wa.me/5215555555555?text=Hola%20Caf%C3%A9%20Nube%2C%20quisiera%20hacer%20una%20reserva"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-line bg-cream/70 px-4 py-2 text-xs font-bold text-ink transition hover:border-espresso hover:bg-cream active:scale-95 touch-manipulation"
              >
                <MessageCircle size={14} className="text-[#25D366]" />
                <span>Reserva</span>
              </a>
            </div>
          </div>
        </header>

        {/* Map & Visual Croquis Grid */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] sm:mt-12">
          <Croquis onCopyAddress={handleCopy} isCopied={copied} />

          <div className="flex flex-col gap-3.5">
            {/* Pet Friendly Notice placed directly above Google Maps */}
            <div className="flex items-center gap-3 rounded-2xl border border-line/90 bg-white/80 px-4 py-3 shadow-2xs backdrop-blur-xs">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-sage/15 text-sage">
                <Heart size={17} className="fill-sage/20 text-sage" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <strong className="text-xs sm:text-sm font-semibold text-ink">Espacio Pet Friendly 🐾</strong>
                  <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[10px] font-bold text-sage">
                    100% amigable
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-ink/70 leading-snug">
                  Nuestra terraza exterior y mesas de banqueta están listas para recibirte con tus mascotas.
                </p>
              </div>
            </div>

            {/* Google Maps Card */}
            <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
              <iframe
                title="Mapa interactivo de Café Nube en Roma Norte"
                src="https://www.google.com/maps?q=Roma%20Norte%2C%20Cuauht%C3%A9moc%2C%20Ciudad%20de%20M%C3%A9xico&z=15&output=embed"
                className="h-[340px] sm:h-[380px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex flex-col gap-3.5 p-5 sm:flex-row sm:items-center sm:justify-between bg-[#faf8f3]/60 border-t border-line">
                <div className="text-xs sm:text-sm">
                  <strong className="block text-ink font-semibold">Ubicación céntrica y caminable</strong>
                  <p className="text-ink/65">A 5 minutos caminando de Álvaro Obregón e Insurgentes.</p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition hover:bg-espresso active:scale-95 touch-manipulation"
                >
                  <span>Abrir mapa completo</span>
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Croquis({ onCopyAddress, isCopied }: { onCopyAddress: () => void; isCopied: boolean }) {
  return (
    <section className="relative min-h-[380px] overflow-hidden rounded-3xl border border-line bg-[#e8dfd1] p-6 sm:p-7 select-none flex flex-col justify-between">
      {/* Decorative street lines */}
      <div className="absolute -left-10 top-20 h-12 w-[130%] rotate-[-14deg] border-y-2 border-white/70 bg-[#d7cbb9]" />
      <div className="absolute left-[47%] top-0 h-[110%] w-14 rotate-[9deg] border-x-2 border-white/70 bg-[#d7cbb9]" />
      <div className="absolute left-0 top-[62%] h-10 w-[120%] rotate-[8deg] border-y-2 border-white/70 bg-[#d7cbb9]" />

      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-espresso">Croquis de llegada</p>
        <h2 className="mt-1 font-display text-2xl sm:text-3xl text-ink">A pasos de todo.</h2>
        <p className="mt-2 max-w-[15rem] text-xs sm:text-sm leading-5 text-ink/75">
          Estamos en Roma Norte, entre las principales avenidas culturales del barrio.
        </p>
      </div>

      {/* Center Cafe Marker with Pulse */}
      <div className="relative z-10 my-8 self-center">
        <div className="relative flex flex-col items-center">
          <span className="absolute -inset-2 rounded-full bg-espresso/20 animate-ping" />
          <div className="relative grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-espresso text-center text-[11px] font-bold leading-tight text-white shadow-soft">
            <span className="text-sm">☁</span>
            <span>CAFÉ<br />NUBE</span>
          </div>
        </div>
      </div>

      <span className="absolute right-6 top-[28%] z-10 -rotate-[14deg] text-[10px] font-bold uppercase tracking-widest text-ink/75">
        Av. Insurgentes
      </span>
      <span className="absolute bottom-14 left-6 z-10 rotate-[8deg] text-[10px] font-bold uppercase tracking-widest text-ink/75">
        Av. Chapultepec
      </span>
      <span className="absolute bottom-6 right-6 z-10 rotate-[9deg] text-[10px] font-bold uppercase tracking-widest text-ink/75">
        Álvaro Obregón
      </span>

      <div className="relative z-10 pt-2 border-t border-ink/10 flex justify-between items-center text-[11px] text-ink/70">
        <span>Zona Roma Norte</span>
        <button
          onClick={onCopyAddress}
          className="font-bold text-espresso underline decoration-espresso/40 underline-offset-2 touch-manipulation"
        >
          {isCopied ? "¡Dirección copiada!" : "Copiar dirección"}
        </button>
      </div>
    </section>
  );
}
