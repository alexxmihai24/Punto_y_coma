"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { bloquearFecha, desbloquearFecha } from "@/app/admin/actions";
import type { BlockedDate } from "@/lib/admin";

function hoyISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function bonita(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short" }).format(new Date(y, m - 1, d));
}

export default function FechasBloqueadas({ fechas }: { fechas: BlockedDate[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [fecha, setFecha] = useState(hoyISO());
  const [motivo, setMotivo] = useState("");

  const run = (fn: () => Promise<unknown>) => startTransition(async () => { await fn(); router.refresh(); });

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">Días cerrados / completos</h3>
      <p className="mt-1 text-sm text-muted">Las fechas bloqueadas no admiten reservas online.</p>

      {fechas.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {fechas.map((b) => (
            <div key={b.id} className="flex items-center gap-2 rounded-full border border-[var(--line-strong)] bg-black/[0.03] py-1.5 pl-4 pr-2 text-sm">
              <span className="text-cream">{bonita(b.fecha)}</span>
              {b.motivo && <span className="text-faint">· {b.motivo}</span>}
              <button onClick={() => run(() => desbloquearFecha(b.id))} disabled={pending} className="grid h-6 w-6 place-items-center rounded-full text-muted hover:text-magenta disabled:opacity-50" aria-label="Quitar bloqueo">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-end gap-3 border-t border-[var(--line)] pt-6">
        <div>
          <label className="alabel">Fecha</label>
          <input type="date" min={hoyISO()} value={fecha} onChange={(e) => setFecha(e.target.value)} className="ainput" />
        </div>
        <div className="flex-1">
          <label className="alabel">Motivo (opcional)</label>
          <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Festivo, evento privado…" className="ainput" />
        </div>
        <button
          onClick={() => run(async () => { await bloquearFecha(fecha, motivo); setMotivo(""); })}
          disabled={pending}
          className="btn btn-ghost"
        >
          Bloquear fecha
        </button>
      </div>
    </div>
  );
}
