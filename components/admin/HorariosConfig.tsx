"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { guardarConfig } from "@/app/admin/actions";
import type { Config, Franja } from "@/lib/availability";

const DIAS: { key: string; label: string }[] = [
  { key: "1", label: "Lunes" },
  { key: "2", label: "Martes" },
  { key: "3", label: "Miércoles" },
  { key: "4", label: "Jueves" },
  { key: "5", label: "Viernes" },
  { key: "6", label: "Sábado" },
  { key: "0", label: "Domingo" },
];

export default function HorariosConfig({ config }: { config: Config }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [dur, setDur] = useState(String(config.turno_duracion_min));
  const [intervalo, setIntervalo] = useState(String(config.intervalo_slots_min));
  const [maxp, setMaxp] = useState(String(config.personas_max_online));
  const [horarios, setHorarios] = useState<Record<string, Franja[]>>(() =>
    JSON.parse(JSON.stringify(config.horarios ?? {})),
  );
  const [msg, setMsg] = useState<string | null>(null);

  const setFranja = (dia: string, i: number, campo: "inicio" | "fin", v: string) =>
    setHorarios((h) => ({ ...h, [dia]: (h[dia] ?? []).map((f, j) => (j === i ? { ...f, [campo]: v } : f)) }));
  const addFranja = (dia: string) => setHorarios((h) => ({ ...h, [dia]: [...(h[dia] ?? []), { inicio: "20:00", fin: "23:00" }] }));
  const delFranja = (dia: string, i: number) => setHorarios((h) => ({ ...h, [dia]: (h[dia] ?? []).filter((_, j) => j !== i) }));

  function guardar() {
    setMsg(null);
    startTransition(async () => {
      await guardarConfig({
        turno_duracion_min: Number(dur) || 90,
        intervalo_slots_min: Number(intervalo) || 30,
        personas_max_online: Number(maxp) || 12,
        horarios,
      });
      setMsg("Guardado ✓");
      router.refresh();
    });
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">Horario y turnos</h3>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="alabel">Duración del turno (min)</label>
          <input type="number" min={15} step={15} value={dur} onChange={(e) => setDur(e.target.value)} className="ainput" />
        </div>
        <div>
          <label className="alabel">Intervalo entre horas (min)</label>
          <input type="number" min={5} step={5} value={intervalo} onChange={(e) => setIntervalo(e.target.value)} className="ainput" />
        </div>
        <div>
          <label className="alabel">Máx. personas online</label>
          <input type="number" min={1} value={maxp} onChange={(e) => setMaxp(e.target.value)} className="ainput" />
        </div>
      </div>

      <div className="mt-7 space-y-3">
        {DIAS.map((d) => {
          const franjas = horarios[d.key] ?? [];
          return (
            <div key={d.key} className="rounded-2xl border border-[var(--line)] bg-black/[0.02] p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold text-cream">{d.label}</span>
                <button onClick={() => addFranja(d.key)} type="button" className="text-sm font-semibold text-magenta hover:underline">
                  + Franja
                </button>
              </div>
              {franjas.length === 0 ? (
                <p className="text-sm text-faint">Cerrado</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {franjas.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-black/[0.03] px-2 py-1.5">
                      <input type="time" value={f.inicio} onChange={(e) => setFranja(d.key, i, "inicio", e.target.value)} className="ainput !w-[7.5rem] !py-1" />
                      <span className="text-faint">–</span>
                      <input type="time" value={f.fin} onChange={(e) => setFranja(d.key, i, "fin", e.target.value)} className="ainput !w-[7.5rem] !py-1" />
                      <button onClick={() => delFranja(d.key, i)} type="button" className="ml-1 text-muted hover:text-magenta" aria-label="Quitar franja">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={guardar} disabled={pending} className="btn btn-primary">
          {pending ? "Guardando…" : "Guardar horario"}
        </button>
        {msg && <span className="text-sm font-medium text-cream">{msg}</span>}
      </div>
    </div>
  );
}
