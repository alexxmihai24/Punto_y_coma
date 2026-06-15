import "server-only";
import { serviceClient } from "./supabase";
import { generarSlots, type Config, type Mesa, type ReservaOcupacion, type Slot } from "./availability";

export type AvailabilityResult =
  | { ok: true; slots: Slot[]; bloqueada: boolean; maxPersonas: number }
  | { ok: false; reason: "no-config" };

export async function getConfig(): Promise<Config | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data } = await db.from("restaurant_config").select("*").eq("id", 1).maybeSingle();
  if (!data) return null;
  return {
    turno_duracion_min: data.turno_duracion_min,
    intervalo_slots_min: data.intervalo_slots_min,
    personas_max_online: data.personas_max_online,
    horarios: data.horarios ?? {},
  };
}

export async function getAvailability(fechaISO: string, personas: number): Promise<AvailabilityResult> {
  const db = serviceClient();
  if (!db) return { ok: false, reason: "no-config" };

  const [{ data: cfg }, { data: mesas }, { data: reservas }, { data: bloqueo }] = await Promise.all([
    db.from("restaurant_config").select("*").eq("id", 1).maybeSingle(),
    db.from("tables").select("id,nombre,capacidad,activa"),
    db.from("reservations").select("mesa_id,inicio,fin,estado").eq("fecha", fechaISO),
    db.from("blocked_dates").select("fecha").eq("fecha", fechaISO).maybeSingle(),
  ]);

  if (!cfg) return { ok: false, reason: "no-config" };

  const config: Config = {
    turno_duracion_min: cfg.turno_duracion_min,
    intervalo_slots_min: cfg.intervalo_slots_min,
    personas_max_online: cfg.personas_max_online,
    horarios: cfg.horarios ?? {},
  };

  const slots = generarSlots(
    fechaISO,
    personas,
    config,
    (mesas ?? []) as Mesa[],
    (reservas ?? []) as ReservaOcupacion[],
    Boolean(bloqueo),
  );

  return { ok: true, slots, bloqueada: Boolean(bloqueo), maxPersonas: config.personas_max_online };
}

export type NuevaReserva = {
  nombre: string;
  telefono: string;
  email: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  personas: number;
  notas?: string;
};

export type ReservaResult =
  | { ok: true; id: string; mesa: string; reserva: NuevaReserva }
  | { ok: false; reason: "no-config" | "sin-mesa" | "error" };

export async function createReservation(r: NuevaReserva): Promise<ReservaResult> {
  const db = serviceClient();
  if (!db) return { ok: false, reason: "no-config" };

  const { data, error } = await db.rpc("reservar_mesa", {
    p_nombre: r.nombre,
    p_telefono: r.telefono,
    p_email: r.email,
    p_fecha: r.fecha,
    p_hora: r.hora,
    p_personas: r.personas,
    p_notas: r.notas ?? null,
  });

  if (error) return { ok: false, reason: "error" };
  if (!data) return { ok: false, reason: "sin-mesa" };

  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.id) return { ok: false, reason: "sin-mesa" };

  // Nombre de la mesa asignada (para el email)
  let mesa = "asignada";
  if (row.mesa_id) {
    const { data: m } = await db.from("tables").select("nombre").eq("id", row.mesa_id).maybeSingle();
    if (m?.nombre) mesa = m.nombre;
  }

  return { ok: true, id: row.id as string, mesa, reserva: r };
}
