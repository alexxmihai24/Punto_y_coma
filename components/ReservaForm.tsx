"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { BAR } from "@/data/info";
import { buscarDisponibilidad, crearReserva } from "@/app/reservar/actions";
import type { Slot } from "@/lib/availability";

function hoyISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function fechaBonita(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const s = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(y, m - 1, d),
  );
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ReservaForm() {
  const [fecha, setFecha] = useState(hoyISO());
  const [personas, setPersonas] = useState(2);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [maxPersonas, setMaxPersonas] = useState(12);
  const [estado, setEstado] = useState<"ok" | "no-config" | "bloqueada" | "vacio" | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [hora, setHora] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [notas, setNotas] = useState("");

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<{ mesa: string } | null>(null);

  const cargar = useCallback(() => {
    setLoadingSlots(true);
    setHora(null);
    startTransition(async () => {
      const res = await buscarDisponibilidad(fecha, personas);
      if (!res.ok) {
        setEstado("no-config");
        setSlots(null);
      } else {
        setMaxPersonas(res.maxPersonas);
        if (res.bloqueada) {
          setEstado("bloqueada");
          setSlots([]);
        } else if (res.slots.length === 0) {
          setEstado("vacio");
          setSlots([]);
        } else {
          setEstado("ok");
          setSlots(res.slots);
        }
      }
      setLoadingSlots(false);
    });
  }, [fecha, personas]);

  useEffect(() => {
    const t = setTimeout(cargar, 150);
    return () => clearTimeout(t);
  }, [cargar]);

  const grandeGrupo = personas > maxPersonas;

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!hora) {
      setError("Selecciona una hora disponible.");
      return;
    }
    startTransition(async () => {
      const res = await crearReserva({ nombre, telefono, email, fecha, hora, personas, notas });
      if (res.ok) {
        setExito({ mesa: res.mesa });
      } else if (res.reason === "sin-mesa") {
        setError("Ups, esa hora se acaba de ocupar. Prueba con otra hora.");
        cargar();
      } else if (res.reason === "validacion") {
        setError(res.message);
      } else {
        setError("No hemos podido procesar la reserva. Inténtalo de nuevo o llámanos.");
      }
    });
  }

  if (exito) {
    return (
      <div className="glass rounded-3xl p-8 text-center sm:p-12" style={{ boxShadow: "var(--shadow-glow)" }}>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ background: "var(--grad)" }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="m5 13 4 4L19 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold tracking-tight">¡Mesa reservada!</h2>
        <p className="mt-3 text-muted">
          Te esperamos el <span className="text-cream">{fechaBonita(fecha)}</span> a las{" "}
          <span className="text-cream">{hora} h</span> · {personas} {personas === 1 ? "persona" : "personas"} ·{" "}
          <span className="text-cream">{exito.mesa}</span>.
        </p>
        <p className="mt-3 text-sm text-muted">
          Te hemos enviado la confirmación a <span className="text-cream">{email}</span>.
        </p>
        <a href="/" className="btn btn-ghost mt-8">
          Volver al inicio
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="glass rounded-3xl p-6 sm:p-9" style={{ boxShadow: "var(--shadow-glow)" }}>
      {/* Paso 1 — fecha y personas */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="Día">
          <input
            type="date"
            value={fecha}
            min={hoyISO()}
            onChange={(e) => setFecha(e.target.value)}
            className="input"
            required
          />
        </Campo>
        <Campo label="Personas">
          <div className="flex items-center gap-3">
            <Stepper value={personas} onChange={setPersonas} min={1} max={20} />
          </div>
        </Campo>
      </div>

      {/* Paso 2 — horas disponibles */}
      <div className="mt-7">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-faint">Elige tu hora</h3>

        {estado === "no-config" && (
          <Aviso>
            Las reservas online no están disponibles ahora mismo. Llámanos al{" "}
            <a className="font-semibold text-magenta" href={`tel:${BAR.telefonoLink}`}>
              {BAR.telefono}
            </a>
            .
          </Aviso>
        )}

        {grandeGrupo && estado !== "no-config" && (
          <Aviso>
            Para grupos de más de {maxPersonas} personas, reserva por teléfono en el{" "}
            <a className="font-semibold text-magenta" href={`tel:${BAR.telefonoLink}`}>
              {BAR.telefono}
            </a>
            .
          </Aviso>
        )}

        {!grandeGrupo && (loadingSlots || pending) && estado !== "no-config" && (
          <p className="py-6 text-center text-sm text-muted">Buscando mesas libres…</p>
        )}

        {!grandeGrupo && !loadingSlots && estado === "bloqueada" && (
          <Aviso>Ese día estamos cerrados o completo. Prueba otra fecha.</Aviso>
        )}
        {!grandeGrupo && !loadingSlots && estado === "vacio" && (
          <Aviso>No hay horario de reservas ese día. Prueba otra fecha.</Aviso>
        )}

        {!grandeGrupo && !loadingSlots && estado === "ok" && slots && (
          <SlotsView slots={slots} value={hora} onPick={setHora} />
        )}
      </div>

      {/* Paso 3 — datos de contacto */}
      {hora && !grandeGrupo && (
        <div className="mt-8 border-t border-[var(--line)] pt-7">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-faint">Tus datos</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Nombre">
              <input className="input" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </Campo>
            <Campo label="Teléfono">
              <input className="input" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </Campo>
            <Campo label="Email" full>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Campo>
            <Campo label="Notas (opcional)" full>
              <textarea
                className="input min-h-[80px] resize-y"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Trona para bebé, alergias, celebración…"
              />
            </Campo>
          </div>

          {error && <p className="mt-4 text-sm font-medium text-magenta">{error}</p>}

          <button type="submit" disabled={pending} className="btn btn-primary mt-6 w-full">
            {pending ? "Reservando…" : `Reservar para el ${fechaBonita(fecha)} a las ${hora} h`}
          </button>
        </div>
      )}

      {error && !hora && <p className="mt-4 text-sm font-medium text-magenta">{error}</p>}

      <style>{`
        .input{width:100%;background:var(--ink-2);border:1px solid var(--line-strong);border-radius:14px;padding:0.8rem 1rem;color:var(--cream);font-size:0.98rem;font-family:var(--font-body),sans-serif;outline:none;transition:border-color .2s, box-shadow .2s}
        .input:focus{border-color:var(--magenta);box-shadow:0 0 0 3px rgba(218,31,140,0.18)}
        .input::placeholder{color:var(--faint)}
        .input[type=date]{color-scheme:light}
      `}</style>
    </form>
  );
}

function Campo({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-2 block text-sm font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function Stepper({ value, onChange, min, max }: { value: number; onChange: (n: number) => void; min: number; max: number }) {
  return (
    <div className="flex items-center gap-1 rounded-14 border border-[var(--line-strong)] bg-black/[0.03] p-1" style={{ borderRadius: 14 }}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="grid h-9 w-9 place-items-center rounded-lg text-xl text-cream hover:bg-black/[0.06]" aria-label="Menos">−</button>
      <span className="w-10 text-center font-[family-name:var(--font-display)] text-lg font-bold">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="grid h-9 w-9 place-items-center rounded-lg text-xl text-cream hover:bg-black/[0.06]" aria-label="Más">+</button>
    </div>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-[var(--line)] bg-black/[0.02] px-5 py-4 text-sm leading-relaxed text-muted">{children}</div>;
}

function SlotsView({ slots, value, onPick }: { slots: Slot[]; value: string | null; onPick: (t: string) => void }) {
  const turnos: Array<"Comida" | "Cena"> = ["Comida", "Cena"];
  return (
    <div className="space-y-5">
      {turnos.map((turno) => {
        const items = slots.filter((s) => s.turno === turno);
        if (!items.length) return null;
        return (
          <div key={turno}>
            <p className="mb-2 text-sm text-faint">{turno}</p>
            <div className="flex flex-wrap gap-2">
              {items.map((s) => {
                const active = value === s.time;
                return (
                  <button
                    key={s.time}
                    type="button"
                    disabled={!s.available}
                    onClick={() => onPick(s.time)}
                    title={s.available ? `${s.libres} mesa(s) libre(s)` : "Completo"}
                    className="rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-35"
                    style={
                      active
                        ? { background: "var(--grad)", color: "#fff", borderColor: "transparent" }
                        : { background: "var(--ink-2)", borderColor: "var(--line-strong)", color: "var(--cream)" }
                    }
                  >
                    {s.time}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
