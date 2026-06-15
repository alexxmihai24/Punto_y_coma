import Image from "next/image";
import Link from "next/link";
import { BAR } from "@/data/info";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-20">
      <div className="container-px relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Texto */}
        <div>
          <div className="rise" style={{ animationDelay: "0.05s" }}>
            <Image
              src="/instagram/profile.jpg"
              alt="Logo de Punto y Coma"
              width={92}
              height={92}
              priority
              className="h-20 w-20 rounded-2xl border border-[var(--line)] object-contain shadow-sm"
            />
          </div>

          <div className="rise eyebrow mt-6" style={{ animationDelay: "0.12s" }}>
            Bar · Tapas · {BAR.ciudad}
          </div>

          <h1 className="rise mt-4 text-[clamp(2.6rem,7.5vw,5rem)] font-extrabold leading-[0.96] tracking-tight" style={{ animationDelay: "0.2s" }}>
            Tapas, cañas y <span className="text-grad">buen ambiente</span> en Montilla
          </h1>

          <p className="rise mt-6 max-w-md text-lg leading-relaxed text-muted" style={{ animationDelay: "0.32s" }}>
            {BAR.descripcion}
          </p>

          <div className="rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.42s" }}>
            <Link href="/reservar" className="btn btn-primary">
              Reservar mesa
            </Link>
            <Link href="/carta" className="btn btn-ghost">
              Ver la carta
            </Link>
          </div>

          <div className="rise mt-7 flex flex-wrap items-center gap-5 text-sm text-muted" style={{ animationDelay: "0.52s" }}>
            <span className="inline-flex items-center gap-2">
              <PinIcon /> {BAR.direccion}
            </span>
            <a href={`tel:${BAR.telefonoLink}`} className="inline-flex items-center gap-2 hover:text-magenta">
              <PhoneIcon /> {BAR.telefono}
            </a>
          </div>
        </div>

        {/* Collage de fotos reales */}
        <div className="rise" style={{ animationDelay: "0.3s" }}>
          <div className="relative mx-auto max-w-md">
            <div className="overflow-hidden rounded-[26px] border border-[var(--line)] shadow-xl" style={{ boxShadow: "var(--shadow-glow)" }}>
              <div className="relative aspect-[4/5]">
                <Image src="/instagram/post-1.jpg" alt="Ambiente en Punto y Coma" fill sizes="(max-width:1024px) 90vw, 460px" className="object-cover" priority />
              </div>
            </div>

            <div className="absolute -bottom-6 -left-5 w-36 overflow-hidden rounded-2xl border-4 border-[var(--ink)] shadow-lg sm:w-44">
              <div className="relative aspect-square">
                <Image src="/instagram/post-3.jpg" alt="Cañas y tapa" fill sizes="180px" className="object-cover" />
              </div>
            </div>

            <a
              href={BAR.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass absolute -right-3 -top-4 flex items-center gap-2 rounded-full py-2 pl-2 pr-4 transition-transform hover:-translate-y-0.5"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full text-white" style={{ background: "var(--grad)" }}>
                <InstagramIcon />
              </span>
              <span className="text-sm font-semibold">@{BAR.instagram}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
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
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L17 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" stroke="var(--magenta)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}
