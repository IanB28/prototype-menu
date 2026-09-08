"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock3,
  Instagram,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  X
} from "lucide-react";
import { categories, type Category, type Product } from "@/lib/data";
import { cn, money } from "@/lib/utils";
import { useProducts } from "@/lib/use-products";

type Cart = Record<number, number>;

export function PublicMenu({ slug = "cafe-nube" }: { slug?: string }) {
  const [active, setActive] = useState<Category>("Todos");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Cart>({});
  const [allProducts] = useProducts();

  const products = useMemo(
    () =>
      allProducts.filter(
        (p) =>
          p.available &&
          (active === "Todos" || p.category === active) &&
          `${p.name} ${p.description}`.toLowerCase().includes(query.toLowerCase())
      ),
    [active, allProducts, query]
  );

  const cartItems = allProducts.filter((product) => cart[product.id]);
  const itemCount = Object.values(cart).reduce((total, count) => total + count, 0);
  const total = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  const addToCart = (id: number) => setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));

  const updateQuantity = (id: number, delta: number) =>
    setCart((current) => {
      const quantity = (current[id] ?? 0) + delta;
      if (quantity <= 0) {
        const { [id]: _, ...rest } = current;
        return rest;
      }
      return { ...current, [id]: quantity };
    });

  const orderMessage = encodeURIComponent(
    `Hola Café Nube, quisiera ordenar:\n${cartItems
      .map((product) => `• ${cart[product.id]} × ${product.name} — ${money.format(product.price * cart[product.id])}`)
      .join("\n")}\n\nTotal: ${money.format(total)}`
  );

  return (
    <main className="cafe-shell min-h-screen bg-cream text-ink">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-cream/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8 sm:py-4">
          <Link href={`/menu/${slug}`} className="group flex items-center gap-3" aria-label="Café Nube, inicio">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-lg text-cream transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11 sm:text-xl shadow-2xs">
              ☁
            </span>
            <span>
              <span className="block font-display text-lg font-semibold leading-none tracking-tight sm:text-xl">
                Café Nube
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-espresso/80">
                coffee & bakery
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="hidden rounded-full border border-line bg-white/60 px-3.5 py-2 text-xs font-semibold text-ink/80 transition hover:border-espresso hover:bg-white hover:text-espresso md:block"
            >
              Administración
            </Link>

            {/* Accessible Expandable Search (16px font to avoid iOS zoom) */}
            <div
              className={cn(
                "flex items-center overflow-hidden rounded-full border border-line bg-white/80 shadow-2xs transition-all duration-300 ease-out",
                searchOpen ? "w-52 px-2.5 sm:w-64 sm:px-3" : "w-11"
              )}
            >
              {searchOpen && (
                <input
                  autoFocus
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => event.key === "Escape" && setSearchOpen(false)}
                  placeholder="Buscar café, pan..."
                  aria-label="Buscar en el menú"
                  className="min-w-0 flex-1 bg-transparent px-1.5 text-base sm:text-sm text-ink outline-none placeholder:text-ink/40"
                />
              )}
              {searchOpen && query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-ink/40 hover:text-ink"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={14} />
                </button>
              )}
              <button
                onClick={() => setSearchOpen((open) => !open)}
                className="grid h-11 w-11 shrink-0 place-items-center text-ink/75 transition hover:text-espresso touch-manipulation"
                aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar en el menú"}
              >
                <Search size={18} />
              </button>
            </div>

            {/* Cart Trigger with 44px touch target */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative grid h-11 min-w-[44px] place-items-center rounded-full bg-ink px-3 text-cream shadow-xs transition hover:bg-espresso active:scale-95 touch-manipulation"
              aria-label={`Abrir pedido, ${itemCount} productos`}
            >
              <div className="flex items-center gap-1.5">
                <ShoppingBag size={17} />
                {itemCount > 0 && (
                  <span className="font-sans text-xs font-bold tabular-nums">
                    {itemCount}
                  </span>
                )}
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-espresso opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-espresso" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-10 pt-8 sm:gap-10 sm:px-8 sm:pb-14 sm:pt-14 md:grid-cols-[1fr_0.85fr] md:items-center">
        <div className="hero-copy">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sage/25 bg-sage/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            <Sparkles size={13} className="text-sage" />
            Buenos días, qué gusto verte
          </div>
          <h1 className="max-w-xl font-display text-4xl leading-[1.06] sm:text-6xl lg:text-7xl">
            Un momento para <em className="font-normal italic text-espresso">disfrutar.</em>
          </h1>
          <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-ink/75">
            Café de especialidad, pan recién horneado y pequeños rituales para hacer tu día más bonito.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-ink/75 sm:gap-6">
            <span className="flex items-center gap-1.5">
              <Clock3 size={15} className="text-espresso shrink-0" />
              <span>Lun — Dom · 8:00 — 20:00</span>
            </span>
            <Link
              href="/ubicacion"
              className="group flex items-center gap-1.5 rounded-full border border-line/80 bg-white/50 px-3 py-1.5 transition hover:border-espresso hover:bg-white hover:text-espresso"
            >
              <MapPin size={15} className="text-espresso shrink-0" />
              <span>Col. Roma Norte</span>
              <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-7 flex items-center gap-3">
            <button
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-espresso active:scale-95 touch-manipulation"
            >
              <span>Ver el menú</span>
              <ArrowRight size={16} />
            </button>
            <Link
              href="/ubicacion"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-white/50 px-5 py-3 text-sm font-semibold text-ink transition hover:border-espresso hover:bg-white hover:text-espresso active:scale-95 touch-manipulation"
            >
              <span>Cómo llegar</span>
            </Link>
          </div>
        </div>

        <div className="hero-photo relative mx-auto w-full max-w-xs sm:max-w-sm md:ml-auto">
          {/* Badge 'Hecho con calma' - Tipografía limpia centrada sin glifo superior */}
          <div className="stamp absolute -right-2 -top-2 z-10 flex h-20 w-20 aspect-square shrink-0 flex-col items-center justify-center rounded-full border-2 border-white/90 bg-sage text-center text-white shadow-soft select-none sm:-right-4 sm:-top-4 sm:h-24 sm:w-24">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider leading-tight">
              Hecho
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider leading-tight">
              con calma
            </span>
          </div>

          <div className="absolute -bottom-3 -left-3 h-20 w-20 rounded-full border border-sage/20 bg-sage/10" />
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"
            alt="Café servido en Café Nube"
            className="relative aspect-[4/5] w-full rounded-[8rem_8rem_1.5rem_1.5rem] object-cover shadow-soft transition duration-700 hover:scale-[1.01]"
          />
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="menu-section mx-auto max-w-6xl scroll-mt-20 px-5 pb-24 sm:px-8">
        <div className="menu-heading mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-2 sm:gap-2.5">
            <span className="inline-flex rounded-full border border-espresso/25 bg-espresso/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-espresso shadow-2xs">
              Explora el menú
            </span>
            <h2 className="menu-heading-title font-display text-3xl sm:text-4xl text-ink">
              Lo que se te antoja
            </h2>
          </div>
          <span className="relative inline-flex items-center gap-2 text-xs sm:text-sm font-medium tabular-nums text-ink/70">
            <span className="h-2 w-2 rounded-full bg-sage animate-pulse" />
            <span>{products.length} opciones disponibles</span>
          </span>
        </div>

        {/* Tactile Category Filter with Smooth Scroll Snap */}
        <div className="relative mb-8">
          <div
            className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 scroll-px-5 snap-x snap-mandatory sm:mx-0 sm:gap-2.5 sm:px-0"
            role="tablist"
            aria-label="Categorías del menú"
          >
            {categories.map((category) => {
              const isSelected = active === category;
              return (
                <button
                  key={category}
                  onClick={() => setActive(category)}
                  role="tab"
                  aria-selected={isSelected}
                  className={cn(
                    "min-h-[44px] shrink-0 snap-start whitespace-nowrap rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 touch-manipulation active:scale-95 select-none",
                    isSelected
                      ? "bg-ink text-cream shadow-xs ring-2 ring-ink/10"
                      : "border border-line/80 bg-white/70 text-ink/75 hover:border-espresso/40 hover:bg-white hover:text-ink"
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={index * 40}
              quantity={cart[product.id] ?? 0}
              onAdd={() => addToCart(product.id)}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="rounded-3xl border border-dashed border-line bg-white/40 py-16 text-center text-ink/65">
            <p className="font-display text-xl text-ink">No encontramos opciones para esa búsqueda.</p>
            <button
              onClick={() => {
                setActive("Todos");
                setQuery("");
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-espresso underline decoration-espresso/40 underline-offset-4"
            >
              Ver todo el menú
            </button>
          </div>
        )}
      </section>

      {/* Floating Order Bar on Mobile / Desktop */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-30 px-5 sm:bottom-6 sm:left-auto sm:right-6 sm:px-0">
          <button
            onClick={() => setCartOpen(true)}
            className="flex min-h-[50px] w-full items-center justify-between gap-3 rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream shadow-xl transition hover:bg-espresso active:scale-[0.98] sm:w-auto sm:gap-4 sm:px-6 touch-manipulation"
          >
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 text-xs font-bold tabular-nums">
                {itemCount}
              </span>
              <span>Ver pedido</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold tabular-nums text-cream">
                {money.format(total)}
              </span>
              <ArrowRight size={16} />
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-line/80 bg-white/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-xs sm:text-sm text-ink/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-ink">Café Nube</span>
            <span>·</span>
            <span>Cafetería y panadería artesanal</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/ubicacion" className="hover:text-espresso transition">
              Ubicación y Horarios
            </Link>
            <Link href="/admin" className="hover:text-espresso transition">
              Admin
            </Link>
            <span className="flex items-center gap-1.5 text-ink/80">
              <Instagram size={15} />
              @cafenube.mx
            </span>
          </div>
        </div>
      </footer>

      {/* Order Drawer with Mobile Bottom Sheet Mode */}
      {cartOpen && (
        <OrderDrawer
          items={cartItems}
          cart={cart}
          total={total}
          onClose={() => setCartOpen(false)}
          onUpdate={updateQuantity}
          orderMessage={orderMessage}
        />
      )}
    </main>
  );
}

function ProductCard({
  product,
  delay,
  quantity,
  onAdd
}: {
  product: Product;
  delay: number;
  quantity: number;
  onAdd: () => void;
}) {
  const isAdded = quantity > 0;

  return (
    <article
      className="group flex flex-col rounded-2xl border border-line/80 bg-white p-3 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-espresso/30 hover:shadow-soft"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[1.18] w-full overflow-hidden rounded-xl bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-espresso shadow-xs">
            <Star size={11} className="fill-espresso text-espresso" />
            Favorito
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base sm:text-lg font-medium leading-snug text-ink group-hover:text-espresso transition-colors">
            {product.name}
          </h3>
          <span className="shrink-0 pt-0.5 font-sans text-sm font-bold tabular-nums text-espresso">
            {money.format(product.price)}
          </span>
        </div>

        <p className="mt-1 line-clamp-2 min-h-[2.4rem] text-xs leading-5 text-ink/65">
          {product.description}
        </p>

        {/* 44px Minimum Touch Target Button */}
        <button
          onClick={onAdd}
          aria-pressed={isAdded}
          className={cn(
            "mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 touch-manipulation active:scale-[0.98]",
            isAdded
              ? "bg-[#e5f1e4] text-[#2b612b] border border-[#cfe2ce]"
              : "bg-cream text-ink hover:bg-espresso hover:text-white"
          )}
        >
          {isAdded ? (
            <>
              <Check size={14} className="text-[#2d632d]" />
              <span className="tabular-nums">En tu pedido ({quantity}) · +1</span>
            </>
          ) : (
            <>
              <Plus size={14} />
              <span>Agregar al pedido</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function OrderDrawer({
  items,
  cart,
  total,
  onClose,
  onUpdate,
  orderMessage
}: {
  items: Product[];
  cart: Cart;
  total: number;
  onClose: () => void;
  onUpdate: (id: number, delta: number) => void;
  orderMessage: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end bg-ink/40 backdrop-blur-2xs sm:items-stretch"
      role="dialog"
      aria-modal="true"
      aria-label="Tu pedido"
    >
      <button onClick={onClose} className="fixed inset-0 cursor-default" aria-label="Cerrar pedido" />

      <aside className="relative z-10 flex max-h-[90vh] w-full flex-col rounded-t-[2rem] bg-[#fcfaf6] p-5 shadow-2xl sm:max-h-full sm:max-w-md sm:rounded-none sm:p-7">
        {/* Mobile drag handle */}
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-line/80 sm:hidden" />

        <div className="flex items-start justify-between border-b border-line pb-4 sm:pb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sage">Tu selección</p>
            <h2 className="mt-0.5 font-display text-2xl sm:text-3xl text-ink">Tu pedido</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full bg-cream text-ink/70 transition hover:bg-line hover:text-ink touch-manipulation"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center py-12 text-center">
            <div>
              <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-cream text-espresso">
                <ShoppingBag size={24} />
              </div>
              <p className="font-display text-xl text-ink">Aún no has elegido nada.</p>
              <p className="mt-1 text-xs text-ink/60">Toca en cualquier producto para agregarlo a tu mesa.</p>
              <button
                onClick={onClose}
                className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-full bg-ink px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-espresso"
              >
                Explorar menú
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-line overflow-y-auto pr-1">
              {items.map((product) => (
                <div key={product.id} className="flex gap-3 py-4 sm:py-5">
                  <img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover border border-line shadow-2xs" />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-display text-base sm:text-lg leading-tight text-ink">{product.name}</h3>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-espresso">
                        {money.format(product.price * cart[product.id])}
                      </span>
                    </div>
                    <div className="mt-3 inline-flex items-center rounded-full border border-line bg-white shadow-2xs">
                      <button
                        onClick={() => onUpdate(product.id, -1)}
                        className="grid h-9 w-9 place-items-center text-ink/70 transition hover:text-ink active:scale-90 touch-manipulation"
                        aria-label={`Restar ${product.name}`}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold tabular-nums text-ink">
                        {cart[product.id]}
                      </span>
                      <button
                        onClick={() => onUpdate(product.id, 1)}
                        className="grid h-9 w-9 place-items-center text-ink/70 transition hover:text-ink active:scale-90 touch-manipulation"
                        aria-label={`Sumar ${product.name}`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-4 sm:pt-5">
              <div className="mb-4 flex items-end justify-between">
                <span className="text-xs sm:text-sm font-medium text-ink/70">Total estimado</span>
                <strong className="font-sans text-2xl sm:text-3xl font-bold tabular-nums text-ink">
                  {money.format(total)}
                </strong>
              </div>
              <a
                href={`https://wa.me/5215555555555?text=${orderMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(37,211,102,0.28)] transition hover:brightness-95 active:scale-[0.99] touch-manipulation"
              >
                <MessageCircle size={18} />
                <span>Pedir por WhatsApp</span>
              </a>
              <p className="mt-2.5 text-center text-[11px] text-ink/55">
                Confirmaremos disponibilidad de tu mesa al momento.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
