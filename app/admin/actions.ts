"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE, MAX_AGE, createToken, checkPassword, adminConfigured } from "@/lib/auth";
import { requireAdmin } from "@/lib/session";
import { serviceClient } from "@/lib/supabase";

// ---------- Auth ----------
export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  if (!adminConfigured()) return "El panel no está configurado (falta ADMIN_PASSWORD).";
  const pw = String(formData.get("password") ?? "");
  if (!checkPassword(pw)) return "Contraseña incorrecta.";

  const c = await cookies();
  c.set(COOKIE, await createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE);
  redirect("/admin/login");
}

// ---------- Menú del día ----------
export async function guardarMenuDia(input: {
  fecha: string;
  price: number | null;
  primeros: string[];
  segundos: string[];
  postres: string[];
  incluye_bebida: boolean;
  notas: string | null;
}): Promise<{ ok: boolean; message?: string }> {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return { ok: false, message: "Base de datos no configurada." };

  const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);
  const { error } = await db.from("daily_menu").upsert(
    {
      date: input.fecha,
      price: input.price,
      primeros: clean(input.primeros),
      segundos: clean(input.segundos),
      postres: clean(input.postres),
      incluye_bebida: input.incluye_bebida,
      notas: input.notas?.trim() || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "date" },
  );
  if (error) return { ok: false, message: error.message };

  revalidatePath("/");
  revalidatePath("/carta");
  revalidatePath("/admin");
  return { ok: true };
}

export async function cargarMenuFecha(fecha: string): Promise<{
  price: number | null;
  primeros: string[];
  segundos: string[];
  postres: string[];
  incluye_bebida: boolean;
  notas: string | null;
} | null> {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return null;
  const { data } = await db.from("daily_menu").select("*").eq("date", fecha).maybeSingle();
  if (!data) return null;
  return {
    price: data.price,
    primeros: data.primeros ?? [],
    segundos: data.segundos ?? [],
    postres: data.postres ?? [],
    incluye_bebida: data.incluye_bebida,
    notas: data.notas,
  };
}

// ---------- Reservas ----------
export async function cambiarEstadoReserva(id: string, estado: "pendiente" | "confirmada" | "cancelada") {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return { ok: false };
  await db.from("reservations").update({ estado }).eq("id", id);
  revalidatePath("/admin");
  return { ok: true };
}

// ---------- Mesas ----------
export async function crearMesa(nombre: string, capacidad: number) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return { ok: false };
  await db.from("tables").insert({ nombre: nombre.trim(), capacidad: Math.max(1, Math.floor(capacidad)) });
  revalidatePath("/admin");
  return { ok: true };
}

export async function toggleMesa(id: string, activa: boolean) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return { ok: false };
  await db.from("tables").update({ activa }).eq("id", id);
  revalidatePath("/admin");
  return { ok: true };
}

export async function borrarMesa(id: string) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return { ok: false };
  await db.from("tables").delete().eq("id", id);
  revalidatePath("/admin");
  return { ok: true };
}

// ---------- Configuración ----------
export async function guardarConfig(input: {
  turno_duracion_min: number;
  intervalo_slots_min: number;
  personas_max_online: number;
  horarios: Record<string, { inicio: string; fin: string }[]>;
}) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return { ok: false };
  await db
    .from("restaurant_config")
    .update({
      turno_duracion_min: Math.max(15, Math.floor(input.turno_duracion_min)),
      intervalo_slots_min: Math.max(5, Math.floor(input.intervalo_slots_min)),
      personas_max_online: Math.max(1, Math.floor(input.personas_max_online)),
      horarios: input.horarios,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  revalidatePath("/admin");
  revalidatePath("/reservar");
  return { ok: true };
}

// ---------- Fechas bloqueadas ----------
export async function bloquearFecha(fecha: string, motivo: string) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return { ok: false };
  await db.from("blocked_dates").upsert({ fecha, motivo: motivo.trim() || null }, { onConflict: "fecha" });
  revalidatePath("/admin");
  return { ok: true };
}

export async function desbloquearFecha(id: string) {
  await requireAdmin();
  const db = serviceClient();
  if (!db) return { ok: false };
  await db.from("blocked_dates").delete().eq("id", id);
  revalidatePath("/admin");
  return { ok: true };
}
