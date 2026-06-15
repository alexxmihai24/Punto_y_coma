import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReservaForm from "@/components/ReservaForm";
import Reveal from "@/components/Reveal";
import { BAR, HORARIO_TEXTO } from "@/data/info";

export const metadata: Metadata = {
  title: "Reservar mesa",
  description: `Reserva tu mesa en ${BAR.nombre}, ${BAR.ciudad}. Elige día, hora y número de personas.`,
};

export default function ReservarPage() {
  return (
    <>
      <Nav />
      <main className="pt-28">
        <div className="container-px pb-24">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="eyebrow">Reservas</span>
            <h1 className="mt-4 text-[clamp(2.5rem,8vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight">
              Reserva tu <span className="text-grad">mesa</span>
            </h1>
            <p className="mt-4 text-muted">
              Comprobamos la disponibilidad en tiempo real y te confirmamos al instante por email.
            </p>
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1.4fr_0.85fr]">
            <Reveal delay={80}>
              <ReservaForm />
            </Reveal>

            <Reveal delay={160} className="space-y-4">
              <aside className="glass rounded-3xl p-7">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">Horario</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {HORARIO_TEXTO.map((h) => (
                    <li key={h.dia}>
                      <span className="text-cream">{h.dia}</span>
                      <br />
                      {h.horas}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs italic text-faint">Horario orientativo.</p>
              </aside>

              <aside className="glass rounded-3xl p-7">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">¿Prefieres llamar?</h3>
                <p className="mt-3 text-sm text-muted">Grupos grandes y celebraciones, mejor por teléfono.</p>
                <a href={`tel:${BAR.telefonoLink}`} className="btn btn-ghost mt-5 w-full">
                  {BAR.telefono}
                </a>
              </aside>
            </Reveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
