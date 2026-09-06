"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Instagram, MapPin, MessageCircle, Search, Star } from "lucide-react";
import { categories, type Category } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useProducts } from "@/lib/use-products";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

export function PublicMenu({ slug = "cafe-nube" }: { slug?: string }) {
  const [active, setActive] = useState<Category>("Todos");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [allProducts] = useProducts();
  const products = useMemo(() => allProducts.filter((p) => p.available && (active === "Todos" || p.category === active) && `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())), [active, allProducts, query]);

  return (
    <main className="cafe-shell min-h-screen bg-cream">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href={`/menu/${slug}`} className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-xl text-cream">☁</span>
          <span><span className="block font-display text-xl font-semibold leading-none">Café Nube</span><span className="text-[10px] uppercase tracking-[0.25em] text-espresso/70">coffee & bakery</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="hidden rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink transition hover:border-ink sm:block">Administrar menú</Link>
          <div className={cn("flex items-center overflow-hidden rounded-full border border-line bg-white/60 transition-all duration-300", searchOpen ? "w-56 px-3" : "w-10")}>
            {searchOpen && <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Escape" && setSearchOpen(false)} placeholder="Buscar en el menú..." aria-label="Buscar en el menú" className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-ink/35" />}
            <button onClick={() => setSearchOpen((open) => !open)} className="grid h-10 w-10 shrink-0 place-items-center text-ink/70 transition hover:text-espresso" aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar en el menú"}><Search size={17} /></button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-12 pt-10 sm:px-8 md:grid-cols-[1fr_0.8fr] md:items-center md:pt-16">
        <div className="hero-copy">
          <div className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sage"><span className="h-px w-8 bg-sage" />Buenos días, qué gusto verte</div>
          <h1 className="max-w-xl font-display text-5xl leading-[1.02] sm:text-7xl">Un momento para <em className="font-normal text-espresso">disfrutar.</em></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-ink/60">Café de especialidad, pan recién horneado y pequeños rituales para hacer tu día más bonito.</p>
          <div className="mt-8 flex flex-wrap gap-5 text-xs text-ink/60"><span className="flex items-center gap-2"><Clock3 size={15} className="text-espresso" />Lun — Dom · 8:00 — 20:00</span><span className="flex items-center gap-2"><MapPin size={15} className="text-espresso" />Col. Roma Norte</span></div>
        </div>
        <div className="hero-photo relative mx-auto w-full max-w-sm md:ml-auto">
          <div className="absolute -right-3 -top-3 z-10 flex h-20 w-20 items-center justify-center rounded-full bg-sage text-center text-[10px] font-bold uppercase leading-3 tracking-widest text-white shadow-soft stamp">Hecho<br />con calma</div>
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full border border-sage/20 bg-sage/10" />
          <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85" alt="Café servido en Café Nube" className="relative aspect-[4/5] w-full rounded-[10rem_10rem_1.5rem_1.5rem] object-cover shadow-soft transition duration-700 hover:scale-[1.02]" />
        </div>
      </section>

      <section className="menu-section mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="menu-heading mb-8 flex items-end justify-between gap-4"><div><p className="inline-flex rounded-full border border-espresso/30 bg-espresso/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-ink shadow-sm">Explora el menú</p><h2 className="menu-heading-title mt-3 font-display text-4xl text-ink">Lo que se te antoja</h2></div><span className="relative hidden text-sm font-medium text-ink/70 sm:block">{allProducts.filter((product) => product.available).length} opciones disponibles</span></div>
        <div className="scrollbar-hide -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:px-0">{categories.map((category) => <button key={category} onClick={() => setActive(category)} className={cn("category-pill whitespace-nowrap rounded-full border px-5 py-2.5 text-sm text-ink transition hover:-translate-y-0.5 hover:border-espresso", active === category && "category-pill-active border-espresso bg-espresso/10 font-semibold text-ink")}>{category}</button>)}</div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{products.map((product, index) => <article key={product.id} className="menu-card group p-2" style={{ animationDelay: `${index * 55}ms` }}><div className="relative overflow-hidden rounded-[0.8rem] bg-white"><img src={product.image} alt={product.name} className="aspect-[1.12] w-full object-cover transition duration-500 group-hover:scale-105" />{product.featured && <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-espresso"><Star size={11} className="mr-1 inline fill-espresso" />Favorito</span>}</div><div className="flex items-start justify-between gap-3 px-2 pb-2 pt-4"><div><h3 className="font-display text-xl">{product.name}</h3><p className="mt-1 text-sm leading-5 text-ink/50">{product.description}</p></div><span className="shrink-0 text-sm font-bold text-espresso">{money.format(product.price)}</span></div></article>)}</div>
        {products.length === 0 && <div className="rounded-2xl border border-dashed border-line py-16 text-center text-ink/50">No encontramos algo con ese nombre.</div>}
      </section>
      <a href="https://wa.me/5215555555555" className="whatsapp-cta fixed bottom-5 right-5 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-105"><MessageCircle size={19} />Ordena por WhatsApp</a>
      <footer className="border-t border-line bg-white/40"><div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-sm text-ink/50 sm:flex-row sm:items-center sm:justify-between sm:px-8"><span>© 2024 Café Nube</span><span className="flex items-center gap-4"><Instagram size={17} />@cafenube.mx <ArrowRight size={15} /></span></div></footer>
    </main>
  );
}
