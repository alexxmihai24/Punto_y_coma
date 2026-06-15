"use client";

import { useState, useTransition } from "react";
import { guardarMenuDia, cargarMenuFecha } from "@/app/admin/actions";

type MenuData = {
  price: number | null;
  primeros: string[];
  segundos: string[];
  postres: string[];
  incluye_bebida: boolean;
  notas: string | null;
};

function hoyISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function MenuEditor({ initial }: { initial: MenuData | null }) {
  const [fecha, setFecha] = useState(hoyISO());
  const [price, setPrice] = useState(initial?.price != null ? String(initial.price) : "");
  const [primeros, setPrimeros] = useState<string[]>(initial?.primeros?.length ? initial.primeros : [""]);
  const [segundos, setSegundos] = useState<string[]>(initial?.segundos?.length ? initial.segundos : [""]);
  const [postres, setPostres] = useState<string[]>(initial?.postres?.length ? initial.postres : [""]);
  const [bebida, setBebida] = useState(initial?.incluye_bebida ?? true);
  const [notas, setNotas] = useState(initial?.notas ?? "");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function onFecha(nueva: string) {
    setFecha(nueva);
    setMsg(null);
    startTransition(async () => {
      const m = await cargarMenuFecha(nueva);
      setPrice(m?.price != null ? String(m.price) : "");
      setPrimeros(m?.primeros?.length ? m.primeros : [""]);
      setSegundos(m?.segundos?.length ? m.segundos : [""]);
      setPostres(m?.postres?.length ? m.postres : [""]);
      setBebida(m?.incluye_bebida ?? true);
      setNotas(m?.notas ?? "");
    });
  }

  function guardar() {
    setMsg(null);
    startTransition(async () => {
      const res = await guardarMenuDia({
        fecha,
        price: price.trim() ? Number(price.replace(",", ".")) : null,
        primeros,
        segundos,
        postres,
        incluye_bebida: bebida,
        notas: notas || null,
      });
      setMsg(res.ok ? "Guardado ✓" : res.message ?? "Error al guardar");
    });
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="alabel">Fecha del menú</label>
          <input type="date" value={fecha} min={hoyISO()} onChange={(e) => onFecha(e.target.value)} className="ainput" />
        </div>
        <div className="w-32">
          <label className="alabel">Precio (€)</label>
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="12,50"
            className="ainput"
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 pb-2 text-sm text-muted">
          <input type="checkbox" checked={bebida} onChange={(e) => setBebida(e.target.checked)} className="h-4 w-4 accent-magenta" />
          Bebida incluida
        </label>
      </div>

      <div className="mt-7 grid gap-7 sm:grid-cols-3">
        <ListaEditable titulo="Primeros" items={primeros} onChange={setPrimeros} />
        <ListaEditable titulo="Segundos" items={segundos} onChange={setSegundos} />
        <ListaEditable titulo="Postres" items={postres} onChange={setPostres} />
      </div>

      <div className="mt-6">
        <label className="alabel">Notas (opcional)</label>
        <input value={notas} onChange={(e) => setNotas(e.target.value)} className="ainput" placeholder="Pan y postre incluidos…" />
      </div>

      <div className="mt-7 flex items-center gap-4">
        <button onClick={guardar} disabled={pending} className="btn btn-primary">
          {pending ? "Guardando…" : "Guardar menú del día"}
        </button>
        {msg && <span className="text-sm font-medium text-cream">{msg}</span>}
      </div>
    </div>
  );
}

function ListaEditable({ titulo, items, onChange }: { titulo: string; items: string[]; onChange: (v: string[]) => void }) {
  const set = (i: number, v: string) => onChange(items.map((x, j) => (j === i ? v : x)));
  const add = () => onChange([...items, ""]);
  const del = (i: number) => onChange(items.length > 1 ? items.filter((_, j) => j !== i) : [""]);

  return (
    <div>
      <h4 className="mb-3 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.15em] text-magenta">{titulo}</h4>
      <div className="space-y-2">
        {items.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={v} onChange={(e) => set(i, e.target.value)} className="ainput" placeholder={`${titulo} ${i + 1}`} />
            <button onClick={() => del(i)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--line-strong)] text-muted hover:text-magenta" aria-label="Quitar" type="button">
              ×
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} type="button" className="mt-2 text-sm font-semibold text-magenta hover:underline">
        + Añadir
      </button>
    </div>
  );
}
