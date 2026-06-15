// Lógica pura de disponibilidad de reservas (sin acceso a BD, testeable).

export type Franja = { inicio: string; fin: string }; // "HH:MM"
export type Horarios = Record<string, Franja[]>; // clave: día semana JS "0"(dom)…"6"(sáb)

export type Config = {
  turno_duracion_min: number;
  intervalo_slots_min: number;
  personas_max_online: number;
  horarios: Horarios;
};

export type Mesa = { id: string; nombre: string; capacidad: number; activa: boolean };

export type ReservaOcupacion = {
  mesa_id: string | null;
  inicio: string; // timestamp local "YYYY-MM-DDTHH:MM:SS"
  fin: string;
  estado?: string;
};

export type Slot = { time: string; turno: "Comida" | "Cena"; available: boolean; libres: number };

/** Día de la semana (0=domingo…6=sábado) estable, sin desfase por zona horaria. */
export function diaSemana(fechaISO: string): number {
  const [y, m, d] = fechaISO.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function aMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function aHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** ms desde epoch de una fecha+hora local ("YYYY-MM-DD", minutos desde medianoche). */
function instante(fechaISO: string, min: number): number {
  const [y, m, d] = fechaISO.split("-").map(Number);
  return new Date(y, m - 1, d, Math.floor(min / 60), min % 60, 0, 0).getTime();
}

/** Normaliza un timestamp de BD (sin tz) a ms epoch local. */
function tsLocal(ts: string): number {
  return new Date(ts.replace(" ", "T")).getTime();
}

function solapa(aIni: number, aFin: number, bIni: number, bFin: number): boolean {
  return aIni < bFin && bIni < aFin;
}

/**
 * Genera los slots de un día con su disponibilidad real.
 * Un slot está disponible si existe al menos una mesa activa con capacidad
 * suficiente cuya ventana [inicio, inicio+turno) no solape ninguna reserva activa.
 */
export function generarSlots(
  fechaISO: string,
  personas: number,
  config: Config,
  mesas: Mesa[],
  reservas: ReservaOcupacion[],
  bloqueada = false,
): Slot[] {
  if (bloqueada || personas < 1) return [];

  const dur = config.turno_duracion_min;
  const paso = config.intervalo_slots_min;
  const franjas = config.horarios[String(diaSemana(fechaISO))] ?? [];

  const candidatas = mesas.filter((m) => m.activa && m.capacidad >= personas);
  const reservasActivas = reservas.filter((r) => r.mesa_id && r.estado !== "cancelada");

  const slots: Slot[] = [];
  for (const franja of franjas) {
    const ini = aMin(franja.inicio);
    const fin = aMin(franja.fin);
    const turno: "Comida" | "Cena" = ini < 17 * 60 ? "Comida" : "Cena";

    for (let t = ini; t < fin; t += paso) {
      const sIni = instante(fechaISO, t);
      const sFin = sIni + dur * 60_000;

      let libres = 0;
      for (const mesa of candidatas) {
        const ocupada = reservasActivas.some(
          (r) => r.mesa_id === mesa.id && solapa(sIni, sFin, tsLocal(r.inicio), tsLocal(r.fin)),
        );
        if (!ocupada) libres++;
      }
      slots.push({ time: aHHMM(t), turno, available: libres > 0, libres });
    }
  }
  return slots;
}
