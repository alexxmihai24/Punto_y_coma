import "server-only";
import { serviceClient, publicClient } from "./supabase";

export type MenuDelDia = {
  id: string;
  date: string; // YYYY-MM-DD
  price: number | null;
  primeros: string[];
  segundos: string[];
  postres: string[];
  incluye_bebida: boolean;
  notas: string | null;
  updated_at: string;
};

function todayISO(): string {
  // Fecha local de España (Europe/Madrid) en formato YYYY-MM-DD
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

/** Menú del día de hoy (o el más reciente publicado). null si no hay BD o no hay menú. */
export async function getMenuDelDia(): Promise<MenuDelDia | null> {
  const db = publicClient() ?? serviceClient();
  if (!db) return null;

  const hoy = todayISO();
  const { data, error } = await db
    .from("daily_menu")
    .select("*")
    .lte("date", hoy)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as MenuDelDia;
}

export function esDeHoy(menu: MenuDelDia): boolean {
  return menu.date === todayISO();
}
