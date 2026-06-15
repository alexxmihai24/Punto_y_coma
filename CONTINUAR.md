# CONTINUAR — Punto y Coma

Estado al cerrar el 15/06/2026. Para retomar sin reauditar.

## Qué es
Web del bar **Punto y Coma** (Montilla): landing + carta digital con QR, menú del día
editable por el dueño y reservas online con gestión de mesas y email de confirmación.

- Repo: https://github.com/alexxmihai24/Punto_y_coma (rama `main`). Último commit: `5f88d8a`.
- Stack: Next.js 16 (App Router) + TS + Tailwind v4 · Supabase · Resend · qrcode.

## Hecho y verificado
- **Diseño con dos temas**:
  - Landing y resto → **claro y festivo**, con la identidad real del Instagram
    (logo naranja→magenta→morado, fotos reales en hero + galería "Así se vive aquí").
  - **`/carta`** → **oscuro** como la carta impresa (neón magenta→violeta→azul),
    mediante la clase `.tema-carta` en `app/globals.css`.
- Rutas: `/` · `/carta` (destino del QR) · `/reservar` · `/qr` (imprimible) ·
  `/admin` (login + menú del día + agenda de reservas + mesas/horario/fechas).
- Reservas con gestión de mesas: `supabase/schema.sql` (tablas + RPC `reservar_mesa`
  + `EXCLUDE` anti-overbooking). Disponibilidad en `lib/availability.ts`.
- Emails con Resend (`lib/email.ts`) + hook `N8N_WEBHOOK_URL` para WhatsApp (fase 2).
- Build de producción OK y revisado con capturas.

## Cómo arrancar
```bash
npm install
npm run dev   # http://localhost:3000
```
Variables en `.env.local` (documentadas en `.env.example`). El panel usa `ADMIN_PASSWORD`.

## Pendiente (próxima sesión)
1. **Desplegar en Vercel** (lo hace el cliente): importar el repo, cargar las env vars
   de `.env.example`, poner `NEXT_PUBLIC_SITE_URL` con la URL final y redeploy.
2. **Confirmar datos reales**: teléfono (957 64 33 73 de la carta vs 957 843 373 del
   Instagram) y el horario de `data/info.ts` (ahora es orientativo).
3. **Fase 2 opcional**: WhatsApp real vía n8n (webhook ya preparado), botón para
   descargar el QR desde la carta, unir mesas para grupos grandes, plano de sala visual,
   editar la carta fija desde el panel.

## Notas
- La sesión de `/admin` es una cookie privada por navegador; no afecta a los visitantes
  ni bloquea la web pública.
- `middleware.ts` funciona pero Next 16 lo marca deprecado (migrar a `proxy.ts` algún día).
