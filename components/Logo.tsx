import Link from "next/link";
import { BAR } from "@/data/info";

export default function Logo({ className = "text-[1.15rem]" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${BAR.nombre} — inicio`}
      className={`group inline-flex items-center font-[family-name:var(--font-display)] font-extrabold tracking-tight leading-none ${className}`}
    >
      <span className="text-grad">Punto y Coma</span>
      <span className="ml-0.5 text-[var(--orange)]">;</span>
    </Link>
  );
}
