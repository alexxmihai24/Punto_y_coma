import Link from "next/link";
import { CARTA } from "@/data/carta";
import Reveal from "./Reveal";

const HIGHLIGHTS: Record<string, string> = {
  raciones: "Salmorejo, croquetas caseras, pulpo a la gallega, rabo de toro y mucho más.",
  bocadillos: "Más de 18 bocadillos, hamburguesas de buey, camperos y perrito caliente.",
  combinados: "Platos contundentes con huevos, patatas y la guarnición de siempre.",
  revueltos: "Gulas con gambas, bacalao y chanquetes, al punto.",
};

export default function CartaTeaser() {
  return (
    <section className="container-px py-20 sm:py-28">
      <div className="grid items-end gap-6 sm:grid-cols-[1fr_auto]">
        <Reveal>
          <span className="eyebrow">La carta</span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Para comer <span className="text-grad">de verdad</span>
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <Link href="/carta" className="btn btn-primary">
            Ver carta completa
          </Link>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {CARTA.map((s, i) => (
          <Reveal key={s.id} delay={i * 80}>
            <Link
              href={`/carta#${s.id}`}
              className="glass group flex h-full items-center justify-between gap-4 rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-[family-name:var(--font-display)] text-sm text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
                    {s.titulo}
                  </h3>
                  <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-xs text-muted">
                    {s.items.length}
                  </span>
                </div>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{HIGHLIGHTS[s.id]}</p>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] text-magenta transition-all group-hover:bg-magenta group-hover:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
