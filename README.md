# Punto y Coma — Carta digital, landing y reservas

> Web para un bar de tapas real de Montilla (Córdoba): carta digital con QR, menú del día que edita el dueño y reservas online con asignación automática de mesa.

**🔗 Demo:** https://punto-y-coma.vercel.app

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · Supabase (PostgreSQL) · Resend · Vercel

## Lo más interesante

- **Reservas sin overbooking, incluso con peticiones simultáneas.** Una RPC transaccional asigna la mesa más ajustada al grupo y una restricción `EXCLUDE` de PostgreSQL impide que dos reservas se solapen en la misma mesa.
- **El dueño no depende del programador.** Desde `/admin` cambia el menú del día, consulta la agenda y define mesas, horarios y días cerrados.
- **Avisos automáticos.** Email de confirmación con Resend y un webhook preparado para enviar WhatsApp con n8n.
- **Funciona sin base de datos** en modo demo, para enseñarla o desarrollar sin configurar nada.
- **Dos identidades visuales:** la landing con los colores del bar y la carta en oscuro, como la carta impresa.

---

## Rutas

| Ruta | Qué es |
| --- | --- |
| `/` | Landing: hero, menú del día, resumen de carta, CTA de reservas, ubicación |
| `/carta` | Carta digital completa (destino del QR), mobile-first |
| `/reservar` | Reserva con disponibilidad real y asignación automática de mesa |
| `/qr` | Página imprimible con el QR que apunta a `/carta` |
| `/admin` | Panel del dueño (protegido): menú del día, agenda de reservas, mesas, horario y fechas cerradas |

## Puesta en marcha (local)

```bash
npm install
npm run dev   # http://localhost:3000
```

La web funciona sin base de datos (modo demo): la carta es estática y el menú del día / reservas
muestran avisos. Para activarlo todo:

### 1. Supabase

1. Crea un proyecto **nuevo** en supabase.com (claves manuales — no usar MCP de la cuenta antigua).
2. SQL Editor → pega y ejecuta `supabase/schema.sql` (crea tablas, la RPC `reservar_mesa`,
   la restricción anti-overbooking, RLS y datos de ejemplo de mesas/horario).
3. Copia en `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y
   `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API).

### 2. Resend (emails)

1. Crea una API key en resend.com → `RESEND_API_KEY`.
2. `RESEND_FROM_EMAIL` con un dominio verificado (para pruebas vale `onboarding@resend.dev`).
3. `OWNER_EMAIL` = correo del dueño que recibe el aviso de cada reserva.

### 3. Panel /admin

- `ADMIN_PASSWORD` = contraseña del dueño. `SESSION_SECRET` = cadena larga aleatoria.

### 4. (Opcional) WhatsApp con n8n

- `N8N_WEBHOOK_URL`: cada reserva hace POST con sus datos a ese webhook, listo para enviar WhatsApp.

Todas las variables están documentadas en `.env.example`.

## Cómo funciona la reserva (anti-overbooking)

- El dueño define **mesas** (capacidad), **duración de turno** y **horarios** desde `/admin`.
- Al reservar, la web muestra solo las horas con alguna mesa libre y la RPC `reservar_mesa` asigna
  de forma **transaccional** la mesa más ajustada. Una `EXCLUDE` constraint de Postgres impide que
  dos reservas solapen en la misma mesa, incluso con peticiones simultáneas.

## Despliegue en Vercel

1. Importar el repo en Vercel (framework Next.js, detección automática).
2. Añadir las mismas variables de entorno del `.env.example` en Project → Settings → Environment Variables.
3. `NEXT_PUBLIC_SITE_URL` = la URL final (para que el QR apunte bien).
4. Deploy. Luego abrir `/qr`, imprimir y colocar en las mesas.

## Editar contenido fijo

- Datos del bar (dirección, teléfono, redes, horario orientativo): `data/info.ts`.
- Carta fija (raciones, bocadillos, combinados, revueltos): `data/carta.ts`.
- El **menú del día** NO se toca en código: se edita desde `/admin`.
