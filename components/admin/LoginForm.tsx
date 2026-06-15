"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export default function LoginForm() {
  const [message, formAction, pending] = useActionState(login, null);
  return (
    <form action={formAction} className="glass w-full max-w-sm rounded-3xl p-8" style={{ boxShadow: "var(--shadow-glow)" }}>
      <div className="mb-6 text-center">
        <div
          className="mx-auto grid h-14 w-14 place-items-center rounded-2xl font-[family-name:var(--font-display)] text-2xl font-extrabold text-white"
          style={{ background: "var(--grad)" }}
        >
          ;
        </div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight">Panel del bar</h1>
        <p className="mt-1 text-sm text-muted">Punto y Coma</p>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-muted">Contraseña</span>
        <input
          type="password"
          name="password"
          autoFocus
          required
          className="w-full rounded-2xl border border-[var(--line-strong)] bg-white/[0.04] px-4 py-3 text-cream outline-none transition focus:border-magenta"
          style={{ boxShadow: "none" }}
        />
      </label>

      {message && <p className="mt-3 text-sm font-medium text-magenta">{message}</p>}

      <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full">
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
