import "server-only";
import { Resend } from "resend";
import { BAR } from "@/data/info";
import type { NuevaReserva } from "./reservas";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM_EMAIL || "Punto y Coma <onboarding@resend.dev>";
const OWNER = process.env.OWNER_EMAIL;

function fechaLarga(fechaISO: string): string {
  const [y, m, d] = fechaISO.split("-").map(Number);
  const s = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(y, m - 1, d));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function wrap(titulo: string, cuerpo: string): string {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#0d070f;padding:28px;font-family:Helvetica,Arial,sans-serif;color:#f6eef2">
  <div style="max-width:520px;margin:0 auto;background:#150b18;border:1px solid rgba(255,255,255,0.08);border-radius:18px;overflow:hidden">
    <div style="background:linear-gradient(115deg,#ff2d8e,#8a5cff);padding:22px 28px;font-size:22px;font-weight:800;color:#fff">Punto y Coma<span style="opacity:.7"> ;</span></div>
    <div style="padding:28px">
      <h1 style="margin:0 0 16px;font-size:20px;color:#fff">${titulo}</h1>
      ${cuerpo}
    </div>
    <div style="padding:18px 28px;border-top:1px solid rgba(255,255,255,0.08);font-size:12px;color:#7c6c87">
      ${BAR.direccion}, ${BAR.cp} ${BAR.ciudad} · ${BAR.telefono}
    </div>
  </div></body></html>`;
}

function fila(label: string, value: string): string {
  return `<tr><td style="padding:6px 0;color:#b6a3c0;font-size:14px">${label}</td><td style="padding:6px 0;text-align:right;color:#f6eef2;font-size:14px;font-weight:600">${value}</td></tr>`;
}

function detalles(r: NuevaReserva, mesa: string): string {
  return `<table style="width:100%;border-collapse:collapse;margin-top:8px">
    ${fila("Fecha", fechaLarga(r.fecha))}
    ${fila("Hora", r.hora + " h")}
    ${fila("Personas", String(r.personas))}
    ${fila("Mesa", mesa)}
    ${r.notas ? fila("Notas", r.notas) : ""}
  </table>`;
}

/** Envía confirmación al cliente y aviso al dueño. Lanza la notificación a n8n si está configurada. */
export async function notificarReserva(r: NuevaReserva, mesa: string): Promise<void> {
  // Hook n8n (WhatsApp en el futuro) — no bloquea el flujo principal.
  const hook = process.env.N8N_WEBHOOK_URL;
  if (hook) {
    fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo: "reserva", mesa, ...r }),
    }).catch(() => {});
  }

  if (!apiKey) return; // sin Resend configurado, se omite el email
  const resend = new Resend(apiKey);

  // Cliente
  await resend.emails
    .send({
      from: FROM,
      to: r.email,
      subject: `Reserva confirmada en ${BAR.nombre} · ${fechaLarga(r.fecha)}`,
      html: wrap(
        `¡Gracias por tu reserva, ${r.nombre.split(" ")[0]}!`,
        `<p style="color:#b6a3c0;font-size:14px;line-height:1.6">Hemos guardado tu mesa. Estos son los detalles:</p>
         ${detalles(r, mesa)}
         <p style="color:#b6a3c0;font-size:13px;line-height:1.6;margin-top:18px">Si necesitas cambiar o cancelar, llámanos al ${BAR.telefono}. ¡Te esperamos!</p>`,
      ),
    })
    .catch(() => {});

  // Dueño
  if (OWNER) {
    await resend.emails
      .send({
        from: FROM,
        to: OWNER,
        subject: `Nueva reserva · ${r.personas}p · ${r.fecha} ${r.hora}`,
        html: wrap(
          "Nueva reserva online",
          `${detalles(r, mesa)}
           <table style="width:100%;border-collapse:collapse;margin-top:8px">
             ${fila("Cliente", r.nombre)}
             ${fila("Teléfono", r.telefono)}
             ${fila("Email", r.email)}
           </table>`,
        ),
      })
      .catch(() => {});
  }
}
