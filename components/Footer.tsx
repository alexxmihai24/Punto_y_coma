import Link from "next/link";
import { BAR, AVISO_ALERGENOS } from "@/data/info";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-[var(--line)]">
      <div className="container-px py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight">
              Punto<span className="text-magenta">y</span>Coma
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{BAR.tagline}</p>
            <a
              href={BAR.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cream transition-colors hover:text-magenta"
            >
              <InstagramIcon /> @{BAR.instagram}
            </a>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Visítanos</h4>
            <address className="mt-4 not-italic text-sm leading-relaxed text-muted">
              {BAR.direccion}
              <br />
              {BAR.cp} {BAR.ciudad}, {BAR.provincia}
              <br />
              <a className="text-cream hover:text-magenta" href={`tel:${BAR.telefonoLink}`}>
                {BAR.telefono}
              </a>
            </address>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-faint">Explora</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li><Link className="hover:text-cream" href="/carta">Carta completa</Link></li>
              <li><Link className="hover:text-cream" href="/#menu-dia">Menú del día</Link></li>
              <li><Link className="hover:text-cream" href="/reservar">Reservar mesa</Link></li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-[var(--line)] pt-6 text-xs leading-relaxed text-faint">
          {AVISO_ALERGENOS}
        </p>
        <p className="mt-3 text-xs text-faint">
          © {new Date().getFullYear()} {BAR.nombre} · {BAR.ciudad}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}
