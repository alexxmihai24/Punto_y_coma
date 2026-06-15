"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { crearMesa, toggleMesa, borrarMesa } from "@/app/admin/actions";
import type { MesaAdmin } from "@/lib/admin";

export default function MesasConfig({ mesas }: { mesas: MesaAdmin[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [nombre, setNombre] = useState("");
  const [cap, setCap] = useState("4");

  const refrescar = () => router.refresh();
  const run = (fn: () => Promise<unknown>) => startTransition(async () => { await fn(); refrescar(); });

  const total = mesas.filter((m) => m.activa).reduce((n, m) => n + m.capacidad, 0);

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">Mesas</h3>
        <span className="text-sm text-faint">{mesas.filter((m) => m.activa).length} activas · aforo {total}</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {mesas.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white/[0.02] px-4 py-3">
            <div>
              <span className="font-semibold text-cream">{m.nombre}</span>
              <span className="ml-2 text-sm text-muted">{m.capacidad} plazas</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => run(() => toggleMesa(m.id, !m.activa))}
                disabled={pending}
                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold disabled:opacity-50 ${m.activa ? "border-emerald-400/40 text-emerald-300" : "border-[var(--line-strong)] text-faint"}`}
              >
                {m.activa ? "Activa" : "Inactiva"}
              </button>
              <button onClick={() => run(() => borrarMesa(m.id))} disabled={pending} className="grid h-7 w-7 place-items-center rounded-lg border border-[var(--line-strong)] text-muted hover:text-magenta disabled:opacity-50" aria-label="Borrar mesa">
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-3 border-t border-[var(--line)] pt-6">
        <div className="flex-1">
          <label className="alabel">Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Mesa 15 / Terraza 3" className="ainput" />
        </div>
        <div className="w-28">
          <label className="alabel">Plazas</label>
          <input type="number" min={1} value={cap} onChange={(e) => setCap(e.target.value)} className="ainput" />
        </div>
        <button
          onClick={() => {
            if (!nombre.trim()) return;
            run(async () => {
              await crearMesa(nombre, Number(cap) || 4);
              setNombre("");
            });
          }}
          disabled={pending || !nombre.trim()}
          className="btn btn-ghost"
        >
          Añadir mesa
        </button>
      </div>
    </div>
  );
}
