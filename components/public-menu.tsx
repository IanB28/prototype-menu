"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Instagram, MapPin, MessageCircle, Minus, Plus, Search, ShoppingBag, Star, X } from "lucide-react";
import { categories, type Category, type Product } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useProducts } from "@/lib/use-products";

const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
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
    `Hola, quisiera ordenar:\n${cartItems
      .map((product) => `• ${cart[product.id]} × ${product.name} — ${money.format(product.price * cart[product.id])}`)
      .join("\n")}\n\nTotal: ${money.format(total)}`
  );

  return (
    <main className="cafe-shell min-h-screen bg-cream">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href={`/menu/${slug}`} className="group flex items-center gap-3" aria-label="Café Nube, inicio">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-xl text-cream transition-transform duration-300 group-hover:scale-105">
            ☁
          </span>
          <span>
            <span className="block font-display text-xl font-semibold leading-none tracking-tight">Café Nube</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-espresso/80">coffee & bakery</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="hidden rounded-full border border-line bg-white/40 px-4 py-2 text-xs font-semibold text-ink/80 transition hover:border-espresso hover:bg-white hover:text-espresso sm:block"
          >
            Administrar menú
          </Link>
          <div
            className={cn(
              "flex items-center overflow-hidden rounded-full border border-line bg-white/70 shadow-xs transition-all duration-300 ease-out",
              searchOpen ? "w-52 px-2.5 sm:w-60 sm:px-3" : "w-10"
            )}
          >
            {searchOpen && (
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Escape" && setSearchOpen(false)}
                placeholder="Buscar en el menú..."
                aria-label="Buscar en el menú"
                className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-ink/40"
              />
            )}
            <button
              onClick={() => setSearchOpen((open) => !open)}
              className="grid h-10 w-10 shrink-0 place-items-center text-ink/70 transition hover:text-espresso"
              aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar en el menú"}
            >
              <Search size={17} />
            </button>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="menu-button menu-button-primary relative h-10 w-10"
            aria-label={`Abrir pedido, ${itemCount} productos`}
          >
            <ShoppingBag size={17} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-espresso px-1 text-[10px] font-bold tabular-nums text-white shadow-xs">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-12 pt-10 sm:px-8 md:grid-cols-[1fr_0.8fr] md:items-center md:pt-16">
        <div className="hero-copy">
          <div className="mb-5 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            <span className="h-px w-8 bg-sage/70" />
            Buenos días, qué gusto verte
          </div>
          <h1 className="max-w-xl font-display text-5xl leading-[1.04] sm:text-7xl">
            Un momento para <em className="font-normal italic text-espresso">disfrutar.</em>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/75">
            Café de especialidad, pan recién horneado y pequeños rituales para hacer tu día más bonito.
          </p>
          <div className="mt-8 flex flex-wrap gap-5 text-xs font-medium text-ink/70">
            <span className="flex items-center gap-2">
              <Clock3 size={15} className="text-espresso" />
              Lun — Dom · 8:00 — 20:00
            </span>
            <Link
              href="/ubicacion"
              className="flex items-center gap-2 rounded-full text-ink/70 underline decoration-espresso/40 underline-offset-4 transition hover:text-espresso"
            >
              <MapPin size={15} className="text-espresso" />
              Col. Roma Norte
            </Link>
          </div>
          <button
            onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
            className="menu-button menu-button-primary mt-8 px-6 py-3.5 text-sm font-semibold"
          >
            Ver el menú <ArrowRight size={16} />
          </button>
        </div>

        <div className="hero-photo relative mx-auto w-full max-w-sm md:ml-auto">
          <div className="absolute -right-3 -top-3 z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-sage text-center text-[10px] font-bold uppercase leading-tight tracking-wider text-white shadow-soft stamp select-none">
            <span>Hecho</span>
            <span>con calma</span>
          </div>
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full border border-sage/20 bg-sage/10" />
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"
            alt="Café servido en Café Nube"
            className="relative aspect-[4/5] w-full rounded-[10rem_10rem_1.5rem_1.5rem] object-cover shadow-soft transition duration-700 hover:scale-[1.02]"
          />
        </div>
      </section>

      <section id="menu" className="menu-section mx-auto max-w-6xl scroll-mt-5 px-5 pb-24 sm:px-8">
        <div className="menu-heading mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-2 sm:gap-2.5">
            <span className="inline-flex rounded-full border border-espresso/25 bg-espresso/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-espresso shadow-xs">
              Explora el menú
            </span>
            <h2 className="menu-heading-title font-display text-3xl sm:text-4xl text-ink">
              Lo que se te antoja
            </h2>
          </div>
          <span className="relative hidden text-sm font-medium tabular-nums text-ink/75 sm:inline-flex sm:items-center sm:gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            {allProducts.filter((product) => product.available).length} opciones disponibles
          </span>
        </div>

        <div
          className="scrollbar-hide -mx-5 mb-10 flex gap-2.5 overflow-x-auto px-5 scroll-px-5 snap-x sm:mx-0 sm:px-0"
          role="tablist"
          aria-label="Categorías del menú"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              role="tab"
              aria-selected={active === category}
              className={cn(
                "category-pill shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-sm transition-all duration-200",
                active === category ? "category-pill-active font-semibold" : "text-ink/80 hover:text-ink"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={index * 50}
              quantity={cart[product.id] ?? 0}
              onAdd={() => addToCart(product.id)}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-white/30 py-16 text-center text-ink/60">
            No encontramos productos con ese nombre.
          </div>
        )}
      </section>

      {itemCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="whatsapp-cta fixed bottom-5 right-5 z-20 flex items-center gap-2.5 rounded-full border border-white/25 bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition hover:scale-[1.02] active:scale-95"
        >
          <ShoppingBag size={18} />
          <span>Ver pedido</span>
          <span className="text-white/60">·</span>
          <span className="tabular-nums">{money.format(total)}</span>
        </button>
      )}

      <footer className="border-t border-line bg-white/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-sm text-ink/65 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2024 Café Nube</span>
          <span className="flex items-center gap-4">
            <Instagram size={17} />
            @cafenube.mx <ArrowRight size={15} />
          </span>
        </div>
      </footer>

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
  return (
    <article className="menu-card group flex flex-col p-2.5" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative overflow-hidden rounded-[0.85rem] bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-[1.14] w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-espresso shadow-xs">
            <Star size={11} className="fill-espresso text-espresso" />
            Favorito
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2 pt-3.5">
        <div className="flex items-start justify-between gap-2.5">
          <h3 className="font-display text-xl leading-snug text-ink">{product.name}</h3>
          <span className="shrink-0 pt-0.5 font-sans text-sm font-bold tabular-nums text-espresso">
            {money.format(product.price)}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-ink/65">
          {product.description}
        </p>
        <button
          onClick={onAdd}
          aria-pressed={quantity > 0}
          className={cn(
            "menu-button mt-auto w-full px-3 py-2.5 text-xs font-semibold",
            quantity > 0 ? "menu-button-added" : "menu-button-soft"
          )}
        >
          <Plus size={14} />
          {quantity > 0 ? (
            <span className="tabular-nums">En tu pedido ({quantity}) · Agregar</span>
          ) : (
            "Agregar al pedido"
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
      className="fixed inset-0 z-30 flex justify-end bg-ink/30 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Tu pedido"
    >
      <button onClick={onClose} className="flex-1 cursor-default" aria-label="Cerrar pedido" />
      <aside className="flex h-full w-full max-w-md flex-col bg-[#fcfaf6] p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between border-b border-line pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sage">Tu selección</p>
            <h2 className="mt-1 font-display text-3xl text-ink">Tu pedido</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink/80 transition hover:bg-line hover:text-ink"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center text-center">
            <div>
              <ShoppingBag className="mx-auto mb-3 text-espresso/50" size={30} />
              <p className="font-display text-xl text-ink">Aún no has elegido nada.</p>
              <button onClick={onClose} className="mt-4 text-sm font-bold text-espresso underline decoration-espresso/40 underline-offset-4">
                Explorar menú
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-line overflow-y-auto pr-1">
              {items.map((product) => (
                <div key={product.id} className="flex gap-3 py-5">
                  <img src={product.image} alt="" className="h-16 w-16 rounded-xl object-cover shadow-xs" />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-display text-lg leading-tight text-ink">{product.name}</h3>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-espresso">
                        {money.format(product.price * cart[product.id])}
                      </span>
                    </div>
                    <div className="mt-3 inline-flex items-center rounded-full border border-line bg-white shadow-2xs">
                      <button
                        onClick={() => onUpdate(product.id, -1)}
                        className="grid h-7 w-8 place-items-center text-ink/70 transition hover:text-ink active:scale-90"
                        aria-label={`Restar ${product.name}`}
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-xs font-bold tabular-nums text-ink">
                        {cart[product.id]}
                      </span>
                      <button
                        onClick={() => onUpdate(product.id, 1)}
                        className="grid h-7 w-8 place-items-center text-ink/70 transition hover:text-ink active:scale-90"
                        aria-label={`Sumar ${product.name}`}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-5">
              <div className="mb-5 flex items-end justify-between">
                <span className="text-sm font-medium text-ink/70">Total estimado</span>
                <strong className="font-display text-3xl tabular-nums text-ink">{money.format(total)}</strong>
              </div>
              <a
                href={`https://wa.me/5215555555555?text=${orderMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(37,211,102,0.28)] transition hover:brightness-95 active:scale-[0.99]"
              >
                <MessageCircle size={18} />
                Enviar pedido por WhatsApp
              </a>
              <p className="mt-3 text-center text-xs text-ink/60">
                Confirmaremos disponibilidad y tiempo de preparación.
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
