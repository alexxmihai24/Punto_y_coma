import Link from "next/link";
import { BAR } from "@/data/info";

export default function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = size === "lg" ? "h-12 w-12 text-3xl" : size === "sm" ? "h-8 w-8 text-lg" : "h-10 w-10 text-xl";
  return (
    <Link href="/" aria-label={`${BAR.nombre} — inicio`} className="group inline-flex items-center gap-2.5">
      <span
        className={`${dims} grid place-items-center rounded-2xl font-[family-name:var(--font-display)] font-extrabold text-white leading-none`}
        style={{
          background: "var(--grad)",
          boxShadow: "0 10px 26px -10px rgba(255,45,142,0.8)",
        }}
      >
        <span className="-translate-y-[0.12em]">;</span>
      </span>
      <span className="font-[family-name:var(--font-display)] text-[1.05rem] font-bold tracking-tight leading-none">
        Punto<span className="text-magenta">y</span>Coma
      </span>
    </Link>
  );
}
