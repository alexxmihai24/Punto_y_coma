import Link from "next/link";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MenuDelDia from "@/components/MenuDelDia";
import CartaTeaser from "@/components/CartaTeaser";
import Ubicacion from "@/components/Ubicacion";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getMenuDelDia } from "@/lib/menu";

export const revalidate = 60; // refresca el menú del día cada minuto

function fechaLarga(): string {
  const s = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function Home() {
  const menu = await getMenuDelDia();
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <MenuDelDia menu={menu} fecha={fechaLarga()} />
        <CartaTeaser />

        {/* Banda CTA de reservas */}
        <section className="container-px py-10">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-3xl px-8 py-12 text-center sm:px-14 sm:py-16"
              style={{ background: "var(--grad)" }}
            >
              <span aria-hidden className="pointer-events-none absolute -left-4 -top-10 select-none font-[family-name:var(--font-display)] text-[12rem] leading-none text-white/15">;</span>
              <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                ¿Vienes a comer? Reserva tu mesa
              </h2>
              <p className="relative mx-auto mt-3 max-w-md text-white/85">
                Elige día, hora y número de personas. Te confirmamos al instante por email.
              </p>
              <Link
                href="/reservar"
                className="btn relative mt-7 bg-white !px-7 text-[var(--ink)] hover:-translate-y-0.5"
              >
                Reservar ahora
              </Link>
            </div>
          </Reveal>
        </section>

        <Ubicacion />
      </main>
      <Footer />
    </>
  );
}
