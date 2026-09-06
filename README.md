# Café Nube

Prototipo de menú digital para una cafetería, construido con Next.js, TypeScript y Tailwind CSS.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000/menu/cafe-nube` para el menú público y `http://localhost:3000/admin` para el panel administrativo.

## Incluye

- Menú público mobile-first con categorías, búsqueda visual, productos destacados y botón de WhatsApp.
- Panel de administración demo para agregar, editar, eliminar y cambiar disponibilidad de productos.
- Datos locales tipados en `lib/data.ts`, compartidos entre menú y administración mediante localStorage y listos para sustituirse por Prisma/PostgreSQL.
- Componentes reutilizables y ruta multi-tenant base en `/menu/[slug]`.

La persistencia, autenticación y multi-tenant quedan deliberadamente fuera de este prototipo visual.
