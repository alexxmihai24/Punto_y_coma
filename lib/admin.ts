import "server-only";
import { serviceClient } from "./supabase";
import type { MenuDelDia } from "./menu";

export type ReservaAdmin = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  fecha: string;
  hora: string;
  personas: number;
  estado: "pendiente" | "confirmada" | "cancelada";
  notas: string | null;
  mesa: string | null;
};

export type MesaAdmin = { id: string; nombre: string; capacidad: number; activa: boolean };
export type BlockedDate = { id: string; fecha: string; motivo: string | null };

export async function getMenuByDate(fecha: string): Promise<MenuDelDia | null> {
  const db = serviceClient();
  if (!db) return null;
  const { data } = await db.from("daily_menu").select("*").eq("date", fecha).maybeSingle();
  return (data as MenuDelDia) ?? null;
}

export async function listReservas(desdeISO: string): Promise<ReservaAdmin[]> {
  const db = serviceClient();
  if (!db) return [];
  const { data } = await db
    .from("reservations")
    .select("id,nombre,telefono,email,fecha,hora,personas,estado,notas,tables(nombre)")
    .gte("fecha", desdeISO)
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });
  return (data ?? []).map((r) => {
    const t = r.tables as { nombre?: string } | { nombre?: string }[] | null;
    const mesa = Array.isArray(t) ? t[0]?.nombre ?? null : t?.nombre ?? null;
    return {
      id: r.id,
      nombre: r.nombre,
      telefono: r.telefono,
      email: r.email,
      fecha: r.fecha,
      hora: String(r.hora).slice(0, 5),
      personas: r.personas,
      estado: r.estado,
      notas: r.notas,
      mesa,
    };
  });
}

export async function listMesas(): Promise<MesaAdmin[]> {
  const db = serviceClient();
  if (!db) return [];
  const { data } = await db.from("tables").select("id,nombre,capacidad,activa").order("capacidad").order("nombre");
  return (data ?? []) as MesaAdmin[];
}

export async function listBlockedDates(): Promise<BlockedDate[]> {
  const db = serviceClient();
  if (!db) return [];
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
  const { data } = await db.from("blocked_dates").select("id,fecha,motivo").gte("fecha", hoy).order("fecha");
  return (data ?? []) as BlockedDate[];
}
