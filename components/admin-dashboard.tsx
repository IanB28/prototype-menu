"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Check,
  ChevronLeft,
  Eye,
  Layers,
  MoreHorizontal,
  Plus,
  QrCode,
  Search,
  Settings2,
  ShoppingBag,
  Sparkles,
  Trash2,
  X
} from "lucide-react";
import { categories, type Category, type Product } from "@/lib/data";
import { cn, money } from "@/lib/utils";
import { useProducts } from "@/lib/use-products";

const editableCategories = categories.filter((c): c is Exclude<Category, "Todos"> => c !== "Todos");

export function AdminDashboard() {
  const [products, setProducts] = useProducts();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const availableCount = products.filter((p) => p.available).length;
  const unavailableCount = products.length - availableCount;
  const availabilityPercent = products.length > 0 ? Math.round((availableCount / products.length) * 100) : 0;

  const visible = products.filter((p) =>
    `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setShowForm(true);
  };

  const remove = (id: number) => setProducts((items) => items.filter((p) => p.id !== id));

  const toggle = (id: number) =>
    setProducts((items) => items.map((p) => (p.id === id ? { ...p, available: !p.available } : p)));

  const save = (data: Omit<Product, "id">) => {
    setProducts((items) =>
      editing
        ? items.map((p) => (p.id === editing.id ? { ...data, id: editing.id } : p))
        : [...items, { ...data, id: Math.max(...items.map((p) => p.id), 0) + 1 }]
    );
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f3] text-ink">
      {/* Sidebar navigation */}
      <aside className="fixed hidden h-screen w-64 flex-col border-r border-line bg-white px-5 py-7 md:flex">
        <Link href="/" className="mb-12 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-lg text-cream shadow-2xs">
            ☁
          </span>
          <span className="font-display text-lg font-semibold">Café Nube</span>
        </Link>
        <nav className="space-y-1 text-sm font-medium">
          <div className="flex items-center gap-3 rounded-xl bg-cream px-3 py-3 font-semibold text-espresso">
            <ShoppingBag size={18} />
            <span>Productos</span>
          </div>
          <Link
            href="/admin/qr"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-ink/70 transition hover:bg-cream hover:text-ink"
          >
            <QrCode size={18} />
            <span>Código QR</span>
          </Link>
          <div className="flex items-center gap-3 px-3 py-3 text-ink/40 transition select-none">
            <BarChart3 size={18} />
            <span>Resumen</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-3 text-ink/40 transition select-none">
            <Settings2 size={18} />
            <span>Configuración</span>
          </div>
        </nav>
        <div className="mt-auto rounded-2xl border border-line/60 bg-cream/80 p-4">
          <p className="text-xs font-semibold text-ink">¿Quieres ver tu menú?</p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-espresso transition hover:underline"
          >
            Abrir vista pública <ChevronLeft size={14} className="rotate-180" />
          </Link>
        </div>
      </aside>

      <div className="md:ml-64">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-line bg-white px-5 py-5 sm:px-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink/50">Administración</p>
            <h1 className="font-display text-2xl font-medium text-ink">Tu menú, en orden.</h1>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/admin/qr"
              className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink/80 transition hover:border-espresso hover:text-espresso"
            >
              <QrCode size={15} />
              <span className="hidden xs:inline sm:inline">Código QR</span>
            </Link>
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink/80 transition hover:border-espresso hover:text-espresso sm:flex"
            >
              <Eye size={15} />
              <span>Vista previa</span>
            </Link>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-espresso text-xs font-bold text-white shadow-2xs">
              CN
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
          {/* RECUADROS PRINCIPALES (STAT CARDS) */}
          <section className="mb-8 grid gap-4 sm:grid-cols-3 sm:gap-5" aria-label="Métricas del menú">
            {/* Card 1: Total de productos */}
            <div className="group relative overflow-hidden rounded-2xl border border-line/90 bg-gradient-to-br from-white via-white to-[#faf8f3] p-5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-espresso/35 hover:shadow-soft">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-espresso/15 bg-espresso/10 text-espresso transition-transform duration-300 group-hover:scale-105">
                  <ShoppingBag size={20} />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-espresso/20 bg-espresso/10 px-2.5 py-1 text-[11px] font-semibold text-espresso">
                  <Sparkles size={11} />
                  En catálogo
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
                  Productos registrados
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-sans text-4xl font-bold tabular-nums tracking-tight text-ink">
                    {products.length}
                  </span>
                  <span className="text-xs font-medium text-ink/55">ítems activos</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-line/60 pt-3 text-xs text-ink/65">
                <span className="h-1.5 w-1.5 rounded-full bg-espresso" />
                <span>Base completa en carta digital</span>
              </div>
            </div>

            {/* Card 2: Disponibles */}
            <div className="group relative overflow-hidden rounded-2xl border border-line/90 bg-gradient-to-br from-white via-white to-[#f4f7f2] p-5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[#78846c]/40 hover:shadow-soft">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-[#d2e4d0] bg-[#e5f1e4] text-[#2d632d] transition-transform duration-300 group-hover:scale-105">
                  <Check size={20} />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cfe2ce] bg-[#eaf4e9] px-2.5 py-1 text-[11px] font-semibold text-[#2b612b]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2d632d] animate-pulse" />
                  {availabilityPercent}% en sala
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
                  Disponibles hoy
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-sans text-4xl font-bold tabular-nums tracking-tight text-ink">
                    {availableCount}
                  </span>
                  <span className="text-xs font-medium text-ink/55">
                    de {products.length} listos
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-line/60 pt-3 text-xs text-ink/65">
                <span className={cn("h-1.5 w-1.5 rounded-full", unavailableCount === 0 ? "bg-[#2d632d]" : "bg-espresso")} />
                <span>
                  {unavailableCount === 0 ? "Todos los productos disponibles" : `${unavailableCount} producto(s) agotado(s)`}
                </span>
              </div>
            </div>

            {/* Card 3: Categorías activas */}
            <div className="group relative overflow-hidden rounded-2xl border border-line/90 bg-gradient-to-br from-white via-white to-[#f7f5f2] p-5 shadow-2xs transition-all duration-300 hover:-translate-y-0.5 hover:border-sage/40 hover:shadow-soft">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-sage/20 bg-sage/10 text-sage transition-transform duration-300 group-hover:scale-105">
                  <Layers size={20} />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-sage/20 bg-sage/10 px-2.5 py-1 text-[11px] font-semibold text-sage">
                  Estructura
                </span>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/55">
                  Categorías de carta
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-sans text-4xl font-bold tabular-nums tracking-tight text-ink">
                    {editableCategories.length}
                  </span>
                  <span className="text-xs font-medium text-ink/55">secciones</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 border-t border-line/60 pt-3 text-xs text-ink/65 truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                <span className="truncate">Café, Bebidas, Panadería y Especiales</span>
              </div>
            </div>
          </section>

          {/* LISTA DE PRODUCTOS */}
          <div className="rounded-2xl border border-line bg-white shadow-2xs">
            <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-medium text-ink">Productos</h2>
                <p className="mt-1 text-sm text-ink/65">Administra lo que aparece en tu menú digital.</p>
              </div>
              <button
                onClick={openNew}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-espresso active:scale-95 touch-manipulation"
              >
                <Plus size={17} />
                Nuevo producto
              </button>
            </div>

            <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
              <Search size={18} className="text-ink/40 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o categoría..."
                className="w-full bg-transparent text-base sm:text-sm text-ink outline-none placeholder:text-ink/40"
              />
            </div>

            <div className="divide-y border-t border-line">
              {visible.map((product) => (
                <div key={product.id} className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-stone-50/50 sm:gap-5">
                  <img src={product.image} alt="" className="h-14 w-14 rounded-xl object-cover shadow-2xs shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-ink">{product.name}</h3>
                    <p className="mt-0.5 text-xs tabular-nums text-ink/65">
                      {product.category} · {money.format(product.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => toggle(product.id)}
                    className={cn(
                      "hidden min-h-[36px] rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:block touch-manipulation",
                      product.available ? "bg-[#e5f1e4] text-[#336333]" : "bg-[#f5eae5] text-espresso"
                    )}
                  >
                    {product.available ? "Disponible" : "Agotado"}
                  </button>
                  <button
                    onClick={() => openEdit(product)}
                    className="grid h-11 w-11 place-items-center rounded-xl text-ink/50 transition hover:bg-cream hover:text-ink active:scale-90 touch-manipulation"
                    aria-label={`Editar ${product.name}`}
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  <button
                    onClick={() => remove(product.id)}
                    className="grid h-11 w-11 place-items-center rounded-xl text-ink/40 transition hover:bg-red-50 hover:text-red-600 active:scale-90 touch-manipulation"
                    aria-label={`Eliminar ${product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {visible.length === 0 && (
                <div className="py-16 text-center text-ink/50 text-sm">
                  No encontramos productos con ese nombre o categoría.
                </div>
              )}
            </div>
          </div>
        </main>

        {showForm && <ProductForm product={editing} onClose={() => setShowForm(false)} onSave={save} />}
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onClose,
  onSave
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Omit<Product, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Product, "id">>(
    product
      ? { ...product }
      : {
          name: "",
          description: "",
          price: 0,
          category: "Café",
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
          available: true
        }
  );

  const update = (key: keyof typeof form, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-2xs sm:items-center sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={product ? "Editar producto" : "Nuevo producto"}
    >
      <div
        onClick={onClose}
        className="fixed inset-0 cursor-default"
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col rounded-t-[2rem] bg-white p-6 shadow-2xl sm:max-h-[85vh] sm:rounded-3xl sm:p-7">
        {/* Mobile touch drag indicator */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-line/80 sm:hidden" />

        <div className="mb-5 flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-display text-2xl font-medium text-ink">
              {product ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-ink/65">
              Completa la información del producto.
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full bg-cream text-ink/70 transition hover:bg-line hover:text-ink touch-manipulation"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          <Field label="Nombre del producto">
            <input
              type="text"
              autoFocus
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Ej. Latte Vainilla Artesanal"
              autoCapitalize="words"
              className="text-base sm:text-sm"
            />
          </Field>

          <Field label="Descripción">
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Breve reseña de ingredientes o notas de sabor..."
              className="text-base sm:text-sm"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Precio ($ MXN)">
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min="0"
                step="1"
                value={form.price || ""}
                onChange={(e) => update("price", Number(e.target.value))}
                placeholder="68"
                className="font-sans text-base sm:text-sm tabular-nums"
              />
            </Field>

            <Field label="Categoría">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="text-base sm:text-sm"
              >
                {editableCategories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="URL de imagen">
            <input
              type="url"
              inputMode="url"
              autoCapitalize="none"
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="text-base sm:text-sm"
            />
          </Field>

          {/* Live Preview box */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-cream/30 p-3">
            <img
              src={form.image}
              alt="Vista previa"
              className="h-14 w-14 shrink-0 rounded-xl object-cover border border-line shadow-2xs"
              onError={(event) => {
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85";
              }}
            />
            <div className="min-w-0 flex-1 text-xs text-ink/70">
              <span className="font-semibold text-ink">Vista previa de imagen</span>
              <p className="mt-0.5 truncate text-[11px] text-ink/50">
                Se verá así en el menú digital.
              </p>
            </div>
          </div>

          {/* Accessible Checkbox with full touch area */}
          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-line/70 bg-cream/20 px-3.5 py-2.5 text-sm font-medium text-ink transition hover:bg-cream/50 touch-manipulation">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => update("available", e.target.checked)}
              className="h-5 w-5 accent-espresso rounded"
            />
            <span>Disponible inmediatamente en el menú</span>
          </label>
        </div>

        <div className="mt-5 border-t border-line pt-4">
          <button
            disabled={!form.name.trim() || !form.price || !form.image}
            onClick={() => onSave(form)}
            className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-ink py-3 text-sm font-bold text-white shadow-xs transition hover:bg-espresso active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 touch-manipulation"
          >
            {product ? "Guardar cambios" : "Agregar producto"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider text-ink/75">
      {label}
      <div className="mt-1.5 [&>input]:w-full [&>input]:min-h-[44px] [&>input]:rounded-xl [&>input]:border [&>input]:border-line [&>input]:bg-cream/25 [&>input]:px-3.5 [&>input]:py-2.5 [&>input]:text-ink [&>input]:outline-none [&>input]:transition [&>input]:focus:border-espresso [&>input]:focus:bg-white [&>textarea]:w-full [&>textarea]:resize-none [&>textarea]:rounded-xl [&>textarea]:border [&>textarea]:border-line [&>textarea]:bg-cream/25 [&>textarea]:px-3.5 [&>textarea]:py-2.5 [&>textarea]:text-ink [&>textarea]:outline-none [&>textarea]:transition [&>textarea]:focus:border-espresso [&>textarea]:focus:bg-white [&>select]:w-full [&>select]:min-h-[44px] [&>select]:rounded-xl [&>select]:border [&>select]:border-line [&>select]:bg-cream/25 [&>select]:px-3.5 [&>select]:py-2.5 [&>select]:text-ink [&>select]:outline-none [&>select]:transition [&>select]:focus:border-espresso">
        {children}
      </div>
    </label>
  );
}
