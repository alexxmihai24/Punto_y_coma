import { BAR, HORARIO_TEXTO } from "@/data/info";
import Reveal from "./Reveal";

export default function Ubicacion() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(BAR.mapsQuery)}&output=embed`;
  return (
    <section id="ubicacion" className="container-px scroll-mt-24 py-20 sm:py-28">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="eyebrow">Dónde estamos</span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            En el centro de <span className="text-grad">{BAR.ciudad}</span>
          </h2>

          <div className="mt-8 space-y-5">
            <Fila icon={<PinIcon />} titulo="Dirección">
              {BAR.direccion}
              <br />
              {BAR.cp} {BAR.ciudad}, {BAR.provincia}
            </Fila>
            <Fila icon={<PhoneIcon />} titulo="Reservas y pedidos">
              <a className="hover:text-magenta" href={`tel:${BAR.telefonoLink}`}>
                {BAR.telefono}
              </a>
            </Fila>
            <Fila icon={<ClockIcon />} titulo="Horario">
              <ul className="space-y-1">
                {HORARIO_TEXTO.map((h) => (
                  <li key={h.dia} className="flex flex-wrap gap-x-2">
                    <span className="text-cream">{h.dia}:</span>
                    <span>{h.horas}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-1 block text-xs italic text-faint">Horario orientativo — confírmalo por teléfono.</span>
            </Fila>
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BAR.mapsQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost mt-8"
          >
            Cómo llegar
          </a>
        </Reveal>

        <Reveal delay={120}>
          <div className="glass overflow-hidden rounded-3xl p-2" style={{ boxShadow: "var(--shadow-glow)" }}>
            <iframe
              title={`Mapa de ${BAR.nombre}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[340px] w-full rounded-2xl border-0 grayscale-[0.2] sm:h-[420px]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Fila({ icon, titulo, children }: { icon: React.ReactNode; titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[var(--line)] bg-white/[0.03]">
        {icon}
      </span>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">{titulo}</h4>
        <div className="mt-1 text-[0.98rem] leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" stroke="var(--magenta)" strokeWidth="1.6" />
      <circle cx="12" cy="10" r="2.4" stroke="var(--magenta)" strokeWidth="1.6" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L17 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" stroke="var(--magenta)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="var(--magenta)" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" stroke="var(--magenta)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
