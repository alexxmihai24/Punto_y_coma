import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CartaSecciones from "@/components/CartaSecciones";
import MenuDelDia from "@/components/MenuDelDia";
import Reveal from "@/components/Reveal";
import { getMenuDelDia } from "@/lib/menu";
import { BAR } from "@/data/info";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Carta",
  description: `La carta completa de ${BAR.nombre}: raciones, bocadillos, platos combinados y revueltos.`,
};

function fechaLarga(): string {
  const s = new Intl.DateTimeFormat("es-ES", {
    timeZone: "Europe/Madrid",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function CartaPage() {
  const menu = await getMenuDelDia();
  return (
    <>
      <Nav />
      <main className="pt-28">
        <header className="container-px pb-4">
          <Reveal>
            <span className="eyebrow">La carta</span>
            <h1 className="mt-4 text-[clamp(2.6rem,9vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight">
              Nuestra <span className="text-grad">carta</span>
              <span className="text-magenta">;</span>
            </h1>
            <p className="mt-4 max-w-md text-muted">
              Cocina de bar de toda la vida. Los precios incluyen IVA.
            </p>
          </Reveal>
        </header>

        <MenuDelDia menu={menu} fecha={fechaLarga()} />

        <div className="container-px pb-8">
          <CartaSecciones />
        </div>

        <section className="container-px pb-4">
          <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
            <p className="text-muted">¿Te quedas a comer con nosotros?</p>
            <Link href="/reservar" className="btn btn-primary">
              Reservar mesa
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
