import Link from "next/link";
import { ArrowUpRight, ChevronLeft, Clock3, MapPin } from "lucide-react";

const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Roma+Norte,+Cuauht%C3%A9moc,+Ciudad+de+M%C3%A9xico";

export default function LocationPage() {
  return (
    <main className="cafe-shell min-h-screen bg-cream px-5 py-5 text-ink sm:px-8 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/60 px-4 py-2 text-sm font-semibold text-ink/80 transition hover:border-espresso hover:bg-white hover:text-espresso"
        >
          <ChevronLeft size={16} />
          Volver al menú
        </Link>

        <header className="mt-10 grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sage">Ven a visitarnos</p>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] sm:text-6xl text-ink">
              Encuentra tu<br />
              <em className="font-normal italic text-espresso">momento de calma.</em>
            </h1>
          </div>

          <div className="rounded-3xl border border-line bg-white/65 p-6 text-sm text-ink/75 shadow-xs">
            <div className="flex gap-3.5">
              <MapPin className="shrink-0 text-espresso" size={20} />
              <div>
                <strong className="block text-base font-semibold text-ink">Café Nube</strong>
                <p className="mt-0.5 leading-relaxed">
                  Col. Roma Norte<br />
                  Cuauhtémoc, Ciudad de México
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3.5 border-t border-line/80 pt-4">
              <Clock3 className="shrink-0 text-espresso" size={18} />
              <div>
                <strong className="block font-semibold text-ink">Horario</strong>
                <p className="mt-0.5 tabular-nums leading-relaxed">Lunes a domingo · 8:00 — 20:00</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-12 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <Croquis />
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
            <iframe
              title="Mapa de Café Nube en Roma Norte"
              src="https://www.google.com/maps?q=Roma%20Norte%2C%20Cuauht%C3%A9moc%2C%20Ciudad%20de%20M%C3%A9xico&z=15&output=embed"
              className="h-[380px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex flex-col gap-3.5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-ink/75">Abre el mapa para obtener la mejor ruta.</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-espresso"
              >
                Abrir en Google Maps <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Croquis() {
  return (
    <section className="relative min-h-[380px] overflow-hidden rounded-3xl border border-line bg-[#e8dfd1] p-7 select-none">
      <div className="absolute -left-10 top-20 h-12 w-[130%] rotate-[-14deg] border-y-2 border-white/70 bg-[#d7cbb9]" />
      <div className="absolute left-[47%] top-0 h-[110%] w-14 rotate-[9deg] border-x-2 border-white/70 bg-[#d7cbb9]" />
      <div className="absolute left-0 top-[62%] h-10 w-[120%] rotate-[8deg] border-y-2 border-white/70 bg-[#d7cbb9]" />

      <div className="relative z-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-espresso">Croquis de llegada</p>
        <h2 className="mt-2 font-display text-3xl text-ink">A pasos de todo.</h2>
        <p className="mt-3 max-w-[15rem] text-sm leading-6 text-ink/70">
          Estamos en Roma Norte, cerca de las avenidas principales del barrio.
        </p>
      </div>

      <div className="absolute left-[40%] top-[43%] z-10 grid h-20 w-20 place-items-center rounded-full border-4 border-white bg-espresso text-center text-[11px] font-bold leading-tight text-white shadow-soft">
        CAFÉ<br />NUBE
      </div>

      <span className="absolute right-7 top-[28%] z-10 -rotate-[14deg] text-[10px] font-bold uppercase tracking-widest text-ink/65">
        Av. Insurgentes
      </span>
      <span className="absolute bottom-12 left-7 z-10 rotate-[8deg] text-[10px] font-bold uppercase tracking-widest text-ink/65">
        Av. Chapultepec
      </span>
      <span className="absolute bottom-6 right-7 z-10 rotate-[9deg] text-[10px] font-bold uppercase tracking-widest text-ink/65">
        Álvaro Obregón
      </span>
    </section>
  );
}
