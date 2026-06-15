import { CARTA, euros, type Racion, type ItemLista, type SeccionCarta } from "@/data/carta";
import Reveal from "./Reveal";

function PrecioChip({ label, value }: { label: string; value: number }) {
  return (
    <span className="inline-flex flex-col items-end rounded-lg border border-[var(--line)] bg-white/[0.03] px-2.5 py-1 leading-tight">
      <span className="text-[0.58rem] font-semibold uppercase tracking-wider text-faint">{label}</span>
      <span className="font-[family-name:var(--font-display)] text-sm font-bold text-cream">
        {euros(value)}
      </span>
    </span>
  );
}

function RacionRow({ r }: { r: Racion }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
      <div className="min-w-0">
        <span className="text-[0.98rem] font-medium text-cream">{r.nombre}</span>
        {r.nota && <span className="ml-2 text-xs italic text-amber">{r.nota}</span>}
      </div>
      <div className="flex shrink-0 gap-1.5">
        {r.tapa !== undefined && <PrecioChip label="Tapa" value={r.tapa} />}
        {r.media !== undefined && <PrecioChip label="½ Ración" value={r.media} />}
        {r.racion !== undefined && <PrecioChip label="Ración" value={r.racion} />}
      </div>
    </li>
  );
}

function ItemRow({ it }: { it: ItemLista }) {
  return (
    <li className="flex items-baseline gap-3 py-3">
      {it.num && (
        <span className="mt-0.5 grid min-w-[2.4rem] shrink-0 place-items-center rounded-md border border-[var(--line)] bg-white/[0.03] px-2 py-1 text-center font-[family-name:var(--font-display)] text-[0.7rem] font-bold text-magenta">
          {it.num}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <span className="text-[0.98rem] font-medium text-cream">{it.nombre}</span>
        {it.descripcion && <p className="text-sm leading-snug text-muted">{it.descripcion}</p>}
      </div>
      <span className="hr-dot mx-1 hidden translate-y-[-3px] self-end sm:block" />
      <span className="shrink-0 self-end font-[family-name:var(--font-display)] text-[0.95rem] font-bold text-cream">
        {it.precio !== undefined ? euros(it.precio) : "Consultar"}
      </span>
    </li>
  );
}

function Seccion({ seccion, index }: { seccion: SeccionCarta; index: number }) {
  return (
    <Reveal as="section" id={seccion.id} delay={index * 60} className="scroll-mt-28">
      <div className="mb-5 flex items-center gap-4">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight sm:text-3xl">
          {seccion.titulo}
        </h2>
        <span className="hr-dot" />
        <span className="font-[family-name:var(--font-display)] text-sm text-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <ul className="divide-y divide-[var(--line)]">
        {seccion.tipo === "raciones"
          ? seccion.items.map((r) => <RacionRow key={r.nombre} r={r} />)
          : seccion.items.map((it) => <ItemRow key={(it.num ?? "") + it.nombre} it={it} />)}
      </ul>

      {seccion.nota && (
        <p className="mt-4 rounded-xl border border-[var(--line)] bg-white/[0.02] px-4 py-3 text-sm italic text-muted">
          {seccion.nota}
        </p>
      )}
    </Reveal>
  );
}

export default function CartaSecciones({ secciones = CARTA }: { secciones?: SeccionCarta[] }) {
  return (
    <div className="flex flex-col gap-16">
      {secciones.map((s, i) => (
        <Seccion key={s.id} seccion={s} index={i} />
      ))}
    </div>
  );
}
