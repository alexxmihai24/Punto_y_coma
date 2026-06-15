import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { isAdmin } from "@/lib/session";
import { hasSupabase } from "@/lib/supabase";
import { getMenuByDate, listReservas, listMesas, listBlockedDates } from "@/lib/admin";
import { getConfig } from "@/lib/reservas";
import type { Config } from "@/lib/availability";

export const metadata: Metadata = { title: "Panel", robots: { index: false } };
export const dynamic = "force-dynamic";

const DEFAULT_CONFIG: Config = {
  turno_duracion_min: 90,
  intervalo_slots_min: 30,
  personas_max_online: 12,
  horarios: {},
};

function hoyISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
}

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const hoy = hoyISO();
  const [menuRow, reservas, mesas, config, blocked] = await Promise.all([
    getMenuByDate(hoy),
    listReservas(hoy),
    listMesas(),
    getConfig(),
    listBlockedDates(),
  ]);

  const menu = menuRow
    ? {
        price: menuRow.price,
        primeros: menuRow.primeros,
        segundos: menuRow.segundos,
        postres: menuRow.postres,
        incluye_bebida: menuRow.incluye_bebida,
        notas: menuRow.notas,
      }
    : null;

  return (
    <AdminDashboard
      menu={menu}
      reservas={reservas}
      mesas={mesas}
      config={config ?? DEFAULT_CONFIG}
      blocked={blocked}
      dbReady={hasSupabase()}
    />
  );
}
