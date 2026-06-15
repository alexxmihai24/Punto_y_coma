"use server";

import { getAvailability, createReservation, type AvailabilityResult, type ReservaResult } from "@/lib/reservas";
import { notificarReserva } from "@/lib/email";

export async function buscarDisponibilidad(fecha: string, personas: number): Promise<AvailabilityResult> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return { ok: false, reason: "no-config" };
  const p = Math.max(1, Math.min(50, Math.floor(personas) || 0));
  return getAvailability(fecha, p);
}

type CrearReservaResult = ReservaResult | { ok: false; reason: "validacion"; message: string };

export async function crearReserva(input: {
  nombre: string;
  telefono: string;
  email: string;
  fecha: string;
  hora: string;
  personas: number;
  notas?: string;
}): Promise<CrearReservaResult> {
  const nombre = input.nombre?.trim();
  const telefono = input.telefono?.trim();
  const email = input.email?.trim();
  const { fecha, hora } = input;
  const personas = Math.floor(input.personas);

  if (!nombre || nombre.length < 2) return { ok: false, reason: "validacion", message: "Indica tu nombre." };
  if (!telefono || telefono.replace(/\D/g, "").length < 9)
    return { ok: false, reason: "validacion", message: "Indica un teléfono válido." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, reason: "validacion", message: "Indica un email válido." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !/^\d{2}:\d{2}$/.test(hora))
    return { ok: false, reason: "validacion", message: "Selecciona día y hora." };
  if (personas < 1) return { ok: false, reason: "validacion", message: "Indica el número de personas." };

  // No permitir fechas pasadas
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
  if (fecha < hoy) return { ok: false, reason: "validacion", message: "Elige una fecha futura." };

  const result = await createReservation({ nombre, telefono, email, fecha, hora, personas, notas: input.notas?.trim() });

  if (result.ok) {
    await notificarReserva(result.reserva, result.mesa);
  }
  return result;
}
