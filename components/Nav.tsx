"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const LINKS = [
  { href: "/#menu-dia", label: "Menú del día" },
  { href: "/carta", label: "Carta" },
  { href: "/#ubicacion", label: "Dónde estamos" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <nav className="container-px flex h-[68px] items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted transition-colors hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/reservar" className="btn btn-primary !py-2.5 !px-5 text-sm">
            Reservar mesa
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line-strong)] md:hidden"
          aria-label="Menú"
          aria-expanded={open}
        >
          <span className="relative block h-3 w-5">
            <span
              className="absolute left-0 block h-0.5 w-5 bg-cream transition-all"
              style={{ top: open ? "5px" : "0", transform: open ? "rotate(45deg)" : "none" }}
            />
            <span
              className="absolute left-0 top-[5px] block h-0.5 w-5 bg-cream transition-all"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="absolute left-0 block h-0.5 w-5 bg-cream transition-all"
              style={{ top: open ? "5px" : "10px", transform: open ? "rotate(-45deg)" : "none" }}
            />
          </span>
        </button>
      </nav>

      {open && (
        <div className="container-px pb-5 md:hidden">
          <div className="glass flex flex-col gap-1 rounded-2xl p-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-cream hover:bg-black/5"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/reservar" onClick={() => setOpen(false)} className="btn btn-primary mt-1">
              Reservar mesa
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
