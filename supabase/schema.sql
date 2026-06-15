-- ============================================================
-- Punto y Coma — esquema de base de datos (Supabase / Postgres)
-- Ejecutar en el SQL Editor de Supabase (proyecto NUEVO).
-- ============================================================

create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists btree_gist;    -- exclusión por (uuid =, rango &&)

-- ---------- Menú del día ----------
create table if not exists daily_menu (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  price numeric(6,2),
  primeros jsonb not null default '[]',
  segundos jsonb not null default '[]',
  postres jsonb not null default '[]',
  incluye_bebida boolean not null default false,
  notas text,
  updated_at timestamptz not null default now()
);

-- ---------- Mesas ----------
create table if not exists tables (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  capacidad int not null check (capacidad > 0),
  activa boolean not null default true
);

-- ---------- Configuración (fila única, id = 1) ----------
create table if not exists restaurant_config (
  id int primary key default 1 check (id = 1),
  turno_duracion_min int not null default 90,
  intervalo_slots_min int not null default 30,
  personas_max_online int not null default 12,
  -- horarios: clave = día de la semana JS (0=domingo … 6=sábado)
  horarios jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

-- ---------- Fechas bloqueadas ----------
create table if not exists blocked_dates (
  id uuid primary key default gen_random_uuid(),
  fecha date not null unique,
  motivo text
);

-- ---------- Reservas ----------
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null,
  email text not null,
  fecha date not null,
  hora time not null,
  personas int not null check (personas > 0),
  mesa_id uuid references tables(id),
  inicio timestamp not null,           -- hora local de inicio (wall clock)
  fin timestamp not null,              -- inicio + duración del turno
  notas text,
  estado text not null default 'pendiente' check (estado in ('pendiente','confirmada','cancelada')),
  created_at timestamptz not null default now()
);
create index if not exists reservations_fecha_idx on reservations (fecha);

-- Garantía anti-overbooking: una mesa no puede tener dos reservas (no canceladas)
-- cuyas ventanas [inicio, fin) se solapen.
alter table reservations drop constraint if exists reservations_no_overlap;
alter table reservations
  add constraint reservations_no_overlap
  exclude using gist (mesa_id with =, tsrange(inicio, fin) with &&)
  where (estado <> 'cancelada');

-- ============================================================
-- RPC: asigna automáticamente la mesa libre más ajustada y
-- crea la reserva de forma atómica. Devuelve la reserva o NULL.
-- ============================================================
create or replace function reservar_mesa(
  p_nombre text,
  p_telefono text,
  p_email text,
  p_fecha date,
  p_hora time,
  p_personas int,
  p_notas text default null
) returns reservations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dur int;
  v_inicio timestamp;
  v_fin timestamp;
  v_mesa record;
  v_row reservations;
begin
  select turno_duracion_min into v_dur from restaurant_config where id = 1;
  if v_dur is null then v_dur := 90; end if;

  v_inicio := (p_fecha + p_hora);
  v_fin := v_inicio + make_interval(mins => v_dur);

  -- No reservar en fechas bloqueadas
  if exists (select 1 from blocked_dates where fecha = p_fecha) then
    return null;
  end if;

  -- Recorre las mesas que caben, de menor a mayor capacidad
  for v_mesa in
    select id from tables
    where activa = true and capacidad >= p_personas
    order by capacidad asc, nombre asc
  loop
    begin
      insert into reservations(nombre, telefono, email, fecha, hora, personas, mesa_id, inicio, fin, notas)
      values (p_nombre, p_telefono, p_email, p_fecha, p_hora, p_personas, v_mesa.id, v_inicio, v_fin, p_notas)
      returning * into v_row;
      return v_row;
    exception when exclusion_violation then
      continue;  -- mesa ocupada en esa franja, probar la siguiente
    end;
  end loop;

  return null;  -- sin mesa disponible
end;
$$;

-- ============================================================
-- RLS: lectura pública de carta/horarios; reservas privadas.
-- Las escrituras se hacen SOLO con la service role key (servidor),
-- que salta RLS. No se crean políticas de escritura para anon.
-- ============================================================
alter table daily_menu enable row level security;
alter table tables enable row level security;
alter table restaurant_config enable row level security;
alter table blocked_dates enable row level security;
alter table reservations enable row level security;

drop policy if exists "public read daily_menu" on daily_menu;
create policy "public read daily_menu" on daily_menu for select using (true);

drop policy if exists "public read tables" on tables;
create policy "public read tables" on tables for select using (true);

drop policy if exists "public read config" on restaurant_config;
create policy "public read config" on restaurant_config for select using (true);

drop policy if exists "public read blocked" on blocked_dates;
create policy "public read blocked" on blocked_dates for select using (true);
-- reservations: sin políticas => inaccesible para anon (solo service role).

-- ============================================================
-- SEED inicial (editable luego desde /admin)
-- ============================================================
insert into restaurant_config (id, turno_duracion_min, intervalo_slots_min, personas_max_online, horarios)
values (
  1, 90, 30, 12,
  '{
    "0": [{"inicio":"13:00","fin":"16:30"}],
    "1": [{"inicio":"13:00","fin":"16:00"},{"inicio":"20:00","fin":"23:00"}],
    "2": [{"inicio":"13:00","fin":"16:00"},{"inicio":"20:00","fin":"23:00"}],
    "3": [{"inicio":"13:00","fin":"16:00"},{"inicio":"20:00","fin":"23:00"}],
    "4": [{"inicio":"13:00","fin":"16:00"},{"inicio":"20:00","fin":"23:00"}],
    "5": [{"inicio":"13:00","fin":"16:30"},{"inicio":"20:00","fin":"23:30"}],
    "6": [{"inicio":"13:00","fin":"16:30"},{"inicio":"20:00","fin":"23:30"}]
  }'::jsonb
)
on conflict (id) do nothing;

-- Mesas de ejemplo (bar grande). Ajustar en /admin.
insert into tables (nombre, capacidad) values
  ('Mesa 1', 2), ('Mesa 2', 2), ('Mesa 3', 2), ('Mesa 4', 2),
  ('Mesa 5', 4), ('Mesa 6', 4), ('Mesa 7', 4), ('Mesa 8', 4),
  ('Mesa 9', 4), ('Mesa 10', 4), ('Mesa 11', 6), ('Mesa 12', 6),
  ('Mesa 13', 6), ('Mesa 14', 8)
on conflict do nothing;
