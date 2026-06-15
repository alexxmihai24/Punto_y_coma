"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cambiarEstadoReserva } from "@/app/admin/actions";
import type { ReservaAdmin } from "@/lib/admin";

function fechaTitulo(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const s = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(new Date(y, m - 1, d));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const ESTADO_STYLE: Record<string, string> = {
  pendiente: "border-amber/40 text-amber",
  confirmada: "border-emerald-400/40 text-emerald-300",
  cancelada: "border-white/15 text-faint line-through",
};

export default function AgendaReservas({ reservas }: { reservas: ReservaAdmin[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function cambiar(id: string, estado: "confirmada" | "cancelada" | "pendiente") {
    startTransition(async () => {
      await cambiarEstadoReserva(id, estado);
      router.refresh();
    });
  }

  if (!reservas.length) {
    return (
      <div className="glass rounded-3xl p-10 text-center text-muted">
        No hay reservas próximas. Cuando entren, aparecerán aquí ordenadas por día y hora.
      </div>
    );
  }

  const porFecha = reservas.reduce<Record<string, ReservaAdmin[]>>((acc, r) => {
    (acc[r.fecha] ||= []).push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(porFecha).map(([fecha, items]) => (
        <div key={fecha}>
          <div className="mb-3 flex items-center gap-3">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">{fechaTitulo(fecha)}</h3>
            <span className="hr-dot" />
            <span className="text-sm text-faint">
              {items.filter((r) => r.estado !== "cancelada").reduce((n, r) => n + r.personas, 0)} comensales
            </span>
          </div>

          <div className="space-y-2.5">
            {items.map((r) => (
              <div key={r.id} className="glass flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl p-4">
                <span className="font-[family-name:var(--font-display)] text-xl font-bold text-cream">{r.hora}</span>
                <div className="min-w-[150px] flex-1">
                  <div className="font-semibold text-cream">
                    {r.nombre} · {r.personas}p
                  </div>
                  <div className="text-sm text-muted">
                    {r.mesa ?? "—"} · <a className="hover:text-magenta" href={`tel:${r.telefono}`}>{r.telefono}</a>
                  </div>
                  {r.notas && <div className="mt-1 text-sm italic text-faint">“{r.notas}”</div>}
                </div>

                <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${ESTADO_STYLE[r.estado]}`}>
                  {r.estado}
                </span>

                <div className="flex gap-2">
                  {r.estado !== "confirmada" && (
                    <button onClick={() => cambiar(r.id, "confirmada")} disabled={pending} className="rounded-lg border border-emerald-400/40 px-3 py-1.5 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10 disabled:opacity-50">
                      Confirmar
                    </button>
                  )}
                  {r.estado !== "cancelada" && (
                    <button onClick={() => cambiar(r.id, "cancelada")} disabled={pending} className="rounded-lg border border-[var(--line-strong)] px-3 py-1.5 text-sm font-semibold text-muted hover:text-magenta disabled:opacity-50">
                      Cancelar
                    </button>
                  )}
                  {r.estado === "cancelada" && (
                    <button onClick={() => cambiar(r.id, "pendiente")} disabled={pending} className="rounded-lg border border-[var(--line-strong)] px-3 py-1.5 text-sm font-semibold text-muted hover:text-cream disabled:opacity-50">
                      Reactivar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
