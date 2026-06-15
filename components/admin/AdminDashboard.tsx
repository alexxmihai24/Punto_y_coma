"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import MenuEditor from "./MenuEditor";
import AgendaReservas from "./AgendaReservas";
import MesasConfig from "./MesasConfig";
import HorariosConfig from "./HorariosConfig";
import FechasBloqueadas from "./FechasBloqueadas";
import type { ReservaAdmin, MesaAdmin, BlockedDate } from "@/lib/admin";
import type { Config } from "@/lib/availability";

type MenuData = {
  price: number | null;
  primeros: string[];
  segundos: string[];
  postres: string[];
  incluye_bebida: boolean;
  notas: string | null;
};

type Tab = "menu" | "reservas" | "config";

export default function AdminDashboard(props: {
  menu: MenuData | null;
  reservas: ReservaAdmin[];
  mesas: MesaAdmin[];
  config: Config;
  blocked: BlockedDate[];
  dbReady: boolean;
}) {
  const [tab, setTab] = useState<Tab>("menu");
  const pendientes = props.reservas.filter((r) => r.estado === "pendiente").length;

  return (
    <main className="container-px py-8">
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl font-[family-name:var(--font-display)] text-xl font-extrabold text-white" style={{ background: "var(--grad)" }}>
            ;
          </span>
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-xl font-extrabold leading-none">Panel del bar</h1>
            <span className="text-sm text-muted">Punto y Coma</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-muted hover:text-cream">
            Ver web ↗
          </Link>
          <form action={logout}>
            <button className="btn btn-ghost !py-2 !px-4 text-sm">Salir</button>
          </form>
        </div>
      </div>

      {!props.dbReady && (
        <div className="mt-6 rounded-2xl border border-amber/40 bg-amber/5 px-5 py-4 text-sm text-amber">
          La base de datos aún no está conectada. Configura las variables de Supabase para que se guarden los cambios y las reservas.
        </div>
      )}

      {/* Pestañas */}
      <div className="mt-7 flex flex-wrap gap-2">
        <button className="tab" data-active={tab === "menu"} onClick={() => setTab("menu")}>
          Menú del día
        </button>
        <button className="tab" data-active={tab === "reservas"} onClick={() => setTab("reservas")}>
          Reservas{pendientes > 0 && <span className="ml-2 rounded-full bg-white/20 px-1.5 text-xs">{pendientes}</span>}
        </button>
        <button className="tab" data-active={tab === "config"} onClick={() => setTab("config")}>
          Mesas y horario
        </button>
      </div>

      <div className="mt-7">
        {tab === "menu" && <MenuEditor initial={props.menu} />}
        {tab === "reservas" && <AgendaReservas reservas={props.reservas} />}
        {tab === "config" && (
          <div className="space-y-6">
            <MesasConfig mesas={props.mesas} />
            <HorariosConfig config={props.config} />
            <FechasBloqueadas fechas={props.blocked} />
          </div>
        )}
      </div>
    </main>
  );
}
