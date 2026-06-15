import Link from "next/link";
import { BAR } from "@/data/info";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      {/* ";" gigante decorativo */}
      <span
        aria-hidden
        className="floaty pointer-events-none absolute -right-[6vw] top-10 select-none font-[family-name:var(--font-display)] text-[40vw] font-extrabold leading-none text-grad opacity-[0.13] sm:text-[34vw] lg:text-[26vw]"
      >
        ;
      </span>

      <div className="container-px relative grid items-center gap-12 lg:grid-cols-[1.25fr_0.9fr]">
        <div>
          <div className="rise eyebrow" style={{ animationDelay: "0.05s" }}>
            Bar · Tapas · {BAR.ciudad}
          </div>

          <h1 className="rise mt-6 text-[clamp(2.7rem,8vw,5.6rem)] font-extrabold leading-[0.95] tracking-tight" style={{ animationDelay: "0.15s" }}>
            Donde el día
            <br />
            hace una <span className="text-grad">pausa</span>
            <span className="text-magenta">;</span>
          </h1>

          <p className="rise mt-7 max-w-md text-lg leading-relaxed text-muted" style={{ animationDelay: "0.28s" }}>
            {BAR.descripcion}
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.4s" }}>
            <Link href="/reservar" className="btn btn-primary">
              Reservar mesa
            </Link>
            <Link href="/carta" className="btn btn-ghost">
              Ver la carta
            </Link>
          </div>

          <div className="rise mt-8 flex items-center gap-2 text-sm text-faint" style={{ animationDelay: "0.5s" }}>
            <PinIcon />
            {BAR.direccion}, {BAR.ciudad}
          </div>
        </div>

        {/* Tarjeta de Instagram */}
        <div className="rise" style={{ animationDelay: "0.36s" }}>
          <IgCard />
        </div>
      </div>
    </section>
  );
}

function IgCard() {
  return (
    <a
      href={BAR.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="glass group relative mx-auto block max-w-sm overflow-hidden rounded-[26px] p-6 transition-transform duration-300 hover:-translate-y-1"
      style={{ boxShadow: "var(--shadow-glow)" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full font-[family-name:var(--font-display)] text-2xl font-extrabold text-white"
          style={{ background: "var(--grad)" }}
        >
          ;
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-[family-name:var(--font-display)] font-bold">{BAR.nombre}</span>
            <VerifiedIcon />
          </div>
          <span className="text-sm text-muted">@{BAR.instagram}</span>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        Síguenos para ver el <span className="text-cream">menú del día</span>, las sugerencias y los
        platos recién salidos de la cocina.
      </p>

      {/* mini-mosaico decorativo (no son fotos reales) */}
      <div className="mt-5 grid grid-cols-3 gap-1.5" aria-hidden>
        {[
          "linear-gradient(135deg,#ff2d8e,#8a5cff)",
          "linear-gradient(135deg,#8a5cff,#3aa0ff)",
          "linear-gradient(135deg,#3aa0ff,#ff2d8e)",
          "linear-gradient(135deg,#ffc46b,#ff2d8e)",
          "linear-gradient(135deg,#ff2d8e,#3aa0ff)",
          "linear-gradient(135deg,#8a5cff,#ffc46b)",
        ].map((bg, i) => (
          <div key={i} className="aspect-square rounded-lg opacity-80" style={{ background: bg }} />
        ))}
      </div>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cream transition-colors group-hover:text-magenta">
        Ver perfil en Instagram <ArrowIcon />
      </span>
    </a>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" stroke="var(--magenta)" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.4" stroke="var(--magenta)" strokeWidth="1.6" />
    </svg>
  );
}
function VerifiedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <path d="m12 2 2.4 1.8 3 .1 1 2.8 2.4 1.7-.9 2.8.9 2.8-2.4 1.7-1 2.8-3 .1L12 22l-2.4-1.8-3-.1-1-2.8L3.2 15.6l.9-2.8-.9-2.8 2.4-1.7 1-2.8 3-.1Z" fill="url(#vg)" />
      <path d="m8.5 12 2.3 2.3 4.7-4.8" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="vg" x1="3" y1="2" x2="21" y2="22">
          <stop stopColor="#ff2d8e" />
          <stop offset="1" stopColor="#8a5cff" />
        </linearGradient>
      </defs>
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
