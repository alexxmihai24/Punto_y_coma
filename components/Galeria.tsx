import Image from "next/image";
import { BAR } from "@/data/info";
import Reveal from "./Reveal";

const FOTOS = [
  { src: "/instagram/post-1.jpg", alt: "Brindis con amigos en Punto y Coma", span: "sm:col-span-2 sm:row-span-2" },
  { src: "/instagram/post-4.jpg", alt: "Caña recién tirada", span: "" },
  { src: "/instagram/post-3.jpg", alt: "Cervezas y tapa junto a la ventana", span: "" },
  { src: "/instagram/post-2.jpg", alt: "El equipo de Punto y Coma", span: "sm:col-span-2" },
];

export default function Galeria() {
  return (
    <section className="container-px py-20 sm:py-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">El ambiente</span>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Así se vive <span className="text-grad">aquí</span>
          </h2>
        </div>
        <a href={BAR.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          Ver más en Instagram
        </a>
      </Reveal>

      <Reveal delay={120} className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:grid-cols-4">
        {FOTOS.map((f) => (
          <div key={f.src} className={`group relative overflow-hidden rounded-2xl border border-[var(--line)] ${f.span}`}>
            <Image
              src={f.src}
              alt={f.alt}
              fill
              sizes="(max-width:640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
