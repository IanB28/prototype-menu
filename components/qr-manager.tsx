"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import {
  Check,
  ChevronLeft,
  Copy,
  Download,
  ExternalLink,
  FileImage,
  Printer,
  QrCode,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Type
} from "lucide-react";

const DEFAULT_AZURE_URL = "https://happy-moss-02c485e0f.3.azurestaticapps.net";
const DEFAULT_MENU_PATH = "/menu/cafe-nube";

interface ColorPreset {
  id: string;
  name: string;
  hex: string;
  contrastDesc: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  { id: "ink", name: "Tinta Negra", hex: "#25231f", contrastDesc: "Contraste 15.5:1 · Máxima legibilidad" },
  { id: "espresso", name: "Café Espresso", hex: "#6e4b3a", contrastDesc: "Contraste 8.2:1 · Tono cálido artesanal" },
  { id: "sage", name: "Salvia Bosque", hex: "#2d3b24", contrastDesc: "Contraste 9.1:1 · Estilo botánico y fresco" },
];

export function QrManager() {
  // Target URL configuration
  const [url, setUrl] = useState(DEFAULT_AZURE_URL);
  const [includeSlug, setIncludeSlug] = useState(false);

  // QR Customization states
  const [activeColor, setActiveColor] = useState<ColorPreset>(COLOR_PRESETS[0]);
  const [tagline, setTagline] = useState("Café Nube");
  const [heading, setHeading] = useState("Escanea para ver nuestro menú");
  const [subtitle, setSubtitle] = useState("Apunta con la cámara de tu celular para ver nuestras opciones frescas del día.");
  const [footerText, setFooterText] = useState("Mesa · Wi-Fi: CafeNube_Invitados");

  // Output assets
  const [pngDataUrl, setPngDataUrl] = useState<string>("");
  const [svgDataUrl, setSvgDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  // Hidden offscreen canvas ref for composite QR rendering with baked-in center logo
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Effective full URL
  const effectiveUrl = includeSlug ? `${url.replace(/\/$/, "")}${DEFAULT_MENU_PATH}` : url;

  // Generate composite QR with baked-in Café Nube logo in the center
  useEffect(() => {
    let active = true;
    setIsGenerating(true);

    async function generateBrandedQR() {
      try {
        const qrSize = 1024;
        const canvas = canvasRef.current || document.createElement("canvas");
        canvas.width = qrSize;
        canvas.height = qrSize;

        // 1. Generate base high-resolution QR with Error Correction Level H (30% redundancy)
        await QRCode.toCanvas(canvas, effectiveUrl, {
          errorCorrectionLevel: "H",
          margin: 2,
          width: qrSize,
          color: {
            dark: activeColor.hex,
            light: "#ffffff",
          },
        });

        const ctx = canvas.getContext("2d");
        if (ctx) {
          const cx = qrSize / 2;
          const cy = qrSize / 2;
          const badgeRadius = qrSize * 0.118; // ~23.6% diameter, totally safe with 30% error correction

          // 2. White halo/padding around badge to isolate QR modules cleanly
          ctx.beginPath();
          ctx.arc(cx, cy, badgeRadius + 14, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();

          // 3. Inner badge in brand color
          ctx.beginPath();
          ctx.arc(cx, cy, badgeRadius, 0, Math.PI * 2);
          ctx.fillStyle = activeColor.hex;
          ctx.fill();

          // 4. Subtle inner ring border
          ctx.beginPath();
          ctx.arc(cx, cy, badgeRadius - 2, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
          ctx.lineWidth = 4;
          ctx.stroke();

          // 5. Café Nube cloud symbol ☁ in the center with precise bounding box optical centering
          const fontSize = Math.round(badgeRadius * 1.25);
          ctx.font = `bold ${fontSize}px "Segoe UI Symbol", "Apple Color Emoji", "Noto Color Emoji", "DM Sans", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Calculate precise optical glyph center using canvas text metrics
          const metrics = ctx.measureText("☁");
          const actualAscent = metrics.actualBoundingBoxAscent || fontSize * 0.6;
          const actualDescent = metrics.actualBoundingBoxDescent || 0;
          const actualLeft = metrics.actualBoundingBoxLeft || fontSize * 0.5;
          const actualRight = metrics.actualBoundingBoxRight || fontSize * 0.5;

          // Compute exact offset so the visual center of the cloud glyph aligns with (cx, cy)
          const opticalOffsetY = (actualAscent - actualDescent) / 2;
          const opticalOffsetX = (actualLeft - actualRight) / 2;

          ctx.fillStyle = "#f7f4ee";
          ctx.fillText("☁", cx + opticalOffsetX, cy + opticalOffsetY);
        }

        const compositePng = canvas.toDataURL("image/png");

        // 2. Generate vector SVG with embedded center badge and logo
        const rawSvg = await QRCode.toString(effectiveUrl, {
          type: "svg",
          errorCorrectionLevel: "H",
          margin: 2,
          color: {
            dark: activeColor.hex,
            light: "#ffffff",
          },
        });

        // Parse viewBox dimensions from SVG string
        const viewBoxMatch = rawSvg.match(/viewBox="0 0 (\d+(\.\d+)?) (\d+(\.\d+)?)"/);
        const dimension = viewBoxMatch ? parseFloat(viewBoxMatch[1]) : 45;
        const center = dimension / 2;
        const svgBadgeRadius = dimension * 0.118;
        // In SVG typography, cloud glyph ☁ sits above baseline; shift down by ~0.33 * radius to optically center
        const svgTextY = center + (svgBadgeRadius * 0.32);

        const badgeGroup = `
  <g id="cafe-nube-center-logo">
    <circle cx="${center}" cy="${center}" r="${(svgBadgeRadius + 0.9).toFixed(2)}" fill="#ffffff" />
    <circle cx="${center}" cy="${center}" r="${svgBadgeRadius.toFixed(2)}" fill="${activeColor.hex}" />
    <circle cx="${center}" cy="${center}" r="${(svgBadgeRadius - 0.2).toFixed(2)}" fill="none" stroke="#ffffff" stroke-width="0.3" stroke-opacity="0.25" />
    <text x="${center}" y="${svgTextY.toFixed(2)}" font-size="${(svgBadgeRadius * 1.25).toFixed(2)}" font-family="'Segoe UI Symbol', 'Apple Color Emoji', sans-serif" text-anchor="middle" fill="#f7f4ee">☁</text>
  </g>
</svg>`;

        const compositeSvg = rawSvg.replace("</svg>", badgeGroup);

        if (active) {
          setPngDataUrl(compositePng);
          setSvgDataUrl(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(compositeSvg)}`);
          setIsGenerating(false);
        }
      } catch (err) {
        console.error("Error generating QR code:", err);
        if (active) setIsGenerating(false);
      }
    }

    generateBrandedQR();

    return () => {
      active = false;
    };
  }, [effectiveUrl, activeColor]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(effectiveUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement("textarea");
      textarea.value = effectiveUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleResetDefaults = () => {
    setUrl(DEFAULT_AZURE_URL);
    setIncludeSlug(false);
    setActiveColor(COLOR_PRESETS[0]);
    setTagline("Café Nube");
    setHeading("Escanea para ver nuestro menú");
    setSubtitle("Apunta con la cámara de tu celular para ver nuestras opciones frescas del día.");
    setFooterText("Mesa · Wi-Fi: CafeNube_Invitados");
  };

  const triggerDownload = (href: string, filename: string) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="min-h-screen bg-[#f5f6f3] text-ink">
      {/* Hidden offscreen canvas for composite generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Admin Sidebar Navigation */}
      <aside className="qr-no-print fixed hidden h-screen w-64 flex-col border-r border-line bg-white px-5 py-7 md:flex">
        <Link href="/" className="mb-12 flex items-center gap-3 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-lg text-cream shadow-2xs">
            ☁
          </span>
          <span className="font-display text-lg font-semibold">Café Nube</span>
        </Link>
        <nav className="space-y-1 text-sm font-medium">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-ink/70 transition hover:bg-cream hover:text-ink"
          >
            <ShoppingBag size={18} />
            Productos
          </Link>
          <div className="flex items-center gap-3 rounded-xl bg-cream px-3 py-3 font-semibold text-espresso">
            <QrCode size={18} />
            Código QR
          </div>
        </nav>
        <div className="mt-auto rounded-2xl border border-line/60 bg-cream/80 p-4">
          <p className="text-xs font-semibold text-ink">¿Quieres ver tu menú?</p>
          <a
            href={effectiveUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-espresso transition hover:underline"
          >
            Abrir menú en Azure <ChevronLeft size={14} className="rotate-180" />
          </a>
        </div>
      </aside>

      <div className="md:ml-64">
        {/* Header (hidden in print) */}
        <header className="qr-no-print flex items-center justify-between border-b border-line bg-white px-5 py-5 sm:px-8">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink/50">
              <Link href="/admin" className="hover:text-ink">Administración</Link>
              <span>/</span>
              <span className="text-espresso font-semibold">Código QR</span>
            </div>
            <h1 className="font-display text-2xl font-medium text-ink">Generador de QR para Mesas</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-xs font-semibold text-ink/80 transition hover:border-espresso hover:text-espresso"
            >
              <ShoppingBag size={15} />
              <span>Ver catálogo</span>
            </Link>
            <a
              href={effectiveUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full border border-line px-4 py-2 text-xs font-semibold text-ink/80 transition hover:border-espresso hover:text-espresso sm:flex"
            >
              <ExternalLink size={15} />
              Probar enlace
            </a>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="mx-auto max-w-6xl px-5 py-7 sm:px-8 sm:py-10">
          {/* Top Banner (hidden in print) */}
          <div className="qr-no-print mb-8 max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#e5f1e4] px-3.5 py-1.5 text-xs font-bold text-[#336333]">
              <Sparkles size={14} />
              Producción Azure · {DEFAULT_AZURE_URL}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-ink">
              Tu menú digital en cada mesa, listo para imprimir.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Personaliza el texto, ajusta los colores con contraste verificado y descarga o imprime la tarjeta lista para exhibir en tu cafetería.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:items-start">
            {/* LEFT COLUMN: LIVE PRINT CARD PREVIEW */}
            <div className="space-y-4">
              <div className="qr-no-print flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/55">
                  Vista previa de la tarjeta
                </span>
                <span className="text-xs text-ink/50">
                  Formato estándar para soporte de mesa o portamenú
                </span>
              </div>

              {/* CARD CONTAINER: This is what prints via @media print */}
              <div className="rounded-3xl border border-line bg-white p-4 shadow-2xs sm:p-8">
                <div className="qr-print-card mx-auto max-w-[420px] rounded-[2rem] border border-line bg-[#faf8f3] p-6 text-center sm:p-9 shadow-xs transition-all">
                  {/* Café Nube Brand Cloud Logo */}
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-xl text-cream shadow-xs">
                    ☁
                  </div>

                  {/* Dynamic Tagline */}
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-sage">
                    {tagline || "Café Nube"}
                  </p>

                  {/* Dynamic Heading */}
                  <h3 className="mt-2 font-display text-2xl sm:text-3xl font-medium leading-tight text-ink">
                    {heading || "Escanea para ver nuestro menú"}
                  </h3>

                  {/* Dynamic Subtitle */}
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink/70">
                    {subtitle || "Abre la cámara de tu celular para ver nuestras opciones."}
                  </p>

                  {/* QR Box with Brand Frame */}
                  <div className="relative mx-auto mt-6 aspect-square w-full max-w-[270px] rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5">
                    {pngDataUrl ? (
                      <img
                        src={pngDataUrl}
                        alt="Código QR del menú Café Nube"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center rounded-xl bg-cream animate-pulse">
                        <span className="text-xs font-medium text-ink/40">Generando QR...</span>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Footer / Table info */}
                  <div className="mt-6 border-t border-dashed border-line/80 pt-4">
                    <p className="text-[11px] font-semibold tracking-wider text-ink/60 uppercase">
                      {footerText || "Mesa · Menú Digital"}
                    </p>
                    <p className="mt-1 text-[10px] text-ink/40">
                      {effectiveUrl}
                    </p>
                  </div>
                </div>
              </div>

              {/* Print notice below preview */}
              <div className="qr-no-print rounded-xl border border-line/60 bg-cream/50 p-3.5 text-xs text-ink/65 flex items-center justify-between">
                <span>💡 Puedes recortar la tarjeta por el borde punteado e insertarla en caballetes de madera o acrílico.</span>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTROLS & EXPORTS (hidden in print) */}
            <div className="qr-no-print space-y-5">
              {/* ACTION: PRINT BUTTON */}
              <button
                onClick={() => window.print()}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-espresso px-5 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#5c3e30] active:scale-[0.99]"
              >
                <Printer size={18} />
                <span>Imprimir tarjeta de mesa</span>
              </button>

              {/* DOWNLOAD BUTTONS */}
              <div className="rounded-2xl border border-line bg-white p-5 shadow-2xs">
                <h4 className="text-sm font-semibold text-ink">Descargar archivo del QR</h4>
                <p className="mt-1 text-xs text-ink/60">
                  Ambos formatos incluyen el logo ☁ de Café Nube incrustado en el centro.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    disabled={!pngDataUrl || isGenerating}
                    onClick={() => triggerDownload(pngDataUrl, "qr-menu-cafe-nube.png")}
                    className="flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-espresso disabled:opacity-40"
                  >
                    <Download size={15} />
                    <span>Descargar PNG</span>
                  </button>
                  <button
                    disabled={!svgDataUrl || isGenerating}
                    onClick={() => triggerDownload(svgDataUrl, "qr-menu-cafe-nube.svg")}
                    className="flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-3 text-xs font-semibold text-ink transition hover:border-espresso hover:text-espresso disabled:opacity-40"
                  >
                    <FileImage size={15} />
                    <span>Descargar SVG</span>
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-ink/50">
                  <span>• PNG: 1024×1024px para redes y diseño</span>
                  <span>• SVG: Vectorial sin pérdida</span>
                </div>
              </div>

              {/* URL & LINK MANAGEMENT */}
              <div className="rounded-2xl border border-line bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-ink">Enlace destino del QR</label>
                  <a
                    href={effectiveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-espresso hover:underline"
                  >
                    Visitar <ExternalLink size={12} />
                  </a>
                </div>

                <div className="space-y-2.5">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full rounded-xl border border-line bg-cream/30 px-3.5 py-2.5 text-xs text-ink outline-none transition focus:border-espresso focus:bg-white"
                    placeholder="https://..."
                  />

                  <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-line/60 bg-cream/20 px-3 py-2 text-xs text-ink/75 transition hover:bg-cream/40">
                    <input
                      type="checkbox"
                      checked={includeSlug}
                      onChange={(e) => setIncludeSlug(e.target.checked)}
                      className="h-4 w-4 rounded accent-espresso"
                    />
                    <span>Agregar ruta directa <strong className="font-semibold text-ink">/menu/cafe-nube</strong></span>
                  </label>

                  <div className="rounded-xl border border-line/70 bg-cream/40 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-ink/50">URL activa codificada:</p>
                        <p className="mt-0.5 break-all font-mono text-xs text-espresso font-medium">{effectiveUrl}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={copyUrl}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-semibold text-ink transition hover:border-espresso hover:text-espresso"
                  >
                    {copied ? <Check size={15} className="text-[#336333]" /> : <Copy size={15} />}
                    <span>{copied ? "¡Enlace copiado al portapapeles!" : "Copiar enlace del menú"}</span>
                  </button>
                </div>
              </div>

              {/* COLOR PRESETS WITH HIGH CONTRAST */}
              <div className="rounded-2xl border border-line bg-white p-5 shadow-2xs">
                <label className="text-sm font-semibold text-ink">Colores de la marca (Contraste verificado)</label>
                <p className="mt-1 text-xs text-ink/60">
                  Tonos de la identidad de Café Nube seleccionados para garantizar lectura instantánea.
                </p>

                <div className="mt-3.5 grid grid-cols-3 gap-2.5">
                  {COLOR_PRESETS.map((preset) => {
                    const isSelected = activeColor.id === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => setActiveColor(preset)}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition ${
                          isSelected
                            ? "border-espresso bg-espresso/5 shadow-xs ring-1 ring-espresso"
                            : "border-line bg-white hover:border-line hover:bg-cream/30"
                        }`}
                      >
                        <span
                          className="h-6 w-6 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: preset.hex }}
                        />
                        <span className="text-xs font-semibold text-ink leading-tight">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 rounded-lg bg-cream/50 px-3 py-2 text-[11px] text-ink/65">
                  ✓ {activeColor.contrastDesc} · Nivel de corrección <strong>H (30%)</strong>.
                </div>
              </div>

              {/* CUSTOM TEXTS */}
              <div className="rounded-2xl border border-line bg-white p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Type size={16} className="text-espresso" />
                    <h4 className="text-sm font-semibold text-ink">Texto personalizable</h4>
                  </div>
                  <button
                    onClick={handleResetDefaults}
                    className="inline-flex items-center gap-1 text-xs font-medium text-ink/55 transition hover:text-espresso"
                    title="Restablecer textos por defecto"
                  >
                    <RotateCcw size={13} />
                    Restablecer
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink/70">Nombre / Marca superior</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-cream/30 px-3 py-2 text-xs text-ink outline-none transition focus:border-espresso focus:bg-white"
                      placeholder="Café Nube"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink/70">Llamado a la acción (Título)</label>
                    <input
                      type="text"
                      value={heading}
                      onChange={(e) => setHeading(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-cream/30 px-3 py-2 text-xs text-ink outline-none transition focus:border-espresso focus:bg-white"
                      placeholder="Escanea para ver nuestro menú"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink/70">Subtítulo / Instrucción</label>
                    <textarea
                      rows={2}
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="mt-1 w-full resize-none rounded-xl border border-line bg-cream/30 px-3 py-2 text-xs text-ink outline-none transition focus:border-espresso focus:bg-white"
                      placeholder="Abre la cámara de tu celular..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink/70">Pie de mesa / Wi-Fi</label>
                    <input
                      type="text"
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-line bg-cream/30 px-3 py-2 text-xs text-ink outline-none transition focus:border-espresso focus:bg-white"
                      placeholder="Mesa · Wi-Fi: CafeNube_Invitados"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
