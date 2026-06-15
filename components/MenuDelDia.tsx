import { euros } from "@/data/carta";
import { BAR } from "@/data/info";
import type { MenuDelDia as Menu } from "@/lib/menu";
import Reveal from "./Reveal";

function Columna({ titulo, items }: { titulo: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="mb-3 font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-[0.18em] text-magenta">
        {titulo}
      </h4>
      <ul className="space-y-2">
        {items.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-[0.98rem] leading-snug text-cream">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MenuDelDia({ menu, fecha }: { menu: Menu | null; fecha: string }) {
  return (
    <section id="menu-dia" className="container-px scroll-mt-24 py-20 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">Hoy en la pizarra</span>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Menú del <span className="text-grad">día</span>
        </h2>
        <p className="mt-3 text-muted">{fecha}</p>
      </Reveal>

      <Reveal delay={120} className="mx-auto mt-12 max-w-3xl">
        {menu ? (
          <article className="glass relative overflow-hidden rounded-3xl p-7 sm:p-10" style={{ boxShadow: "var(--shadow-glow)" }}>
            <span aria-hidden className="pointer-events-none absolute -right-4 -top-10 select-none font-[family-name:var(--font-display)] text-[10rem] leading-none text-grad opacity-10">;</span>

            <div className="grid gap-8 sm:grid-cols-2">
              <Columna titulo="Primeros" items={menu.primeros} />
              <Columna titulo="Segundos" items={menu.segundos} />
              {menu.postres?.length > 0 && <Columna titulo="Postres" items={menu.postres} />}
            </div>

            {menu.notas && <p className="mt-7 text-sm italic text-muted">{menu.notas}</p>}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
              <span className="text-sm text-muted">
                {menu.incluye_bebida ? "Bebida y pan incluidos" : "Pan incluido"}
              </span>
              {menu.price !== null && (
                <span className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-grad">
                  {euros(menu.price)}
                </span>
              )}
            </div>
          </article>
        ) : (
          <div className="glass rounded-3xl p-10 text-center">
            <p className="text-lg text-cream">Hoy preparamos algo rico 🍳</p>
            <p className="mt-2 text-muted">
              El menú del día aún no está publicado. Llámanos al{" "}
              <a className="font-semibold text-magenta" href={`tel:${BAR.telefonoLink}`}>
                {BAR.telefono}
              </a>{" "}
              y te lo contamos.
            </p>
          </div>
        )}
      </Reveal>
    </section>
  );
}
