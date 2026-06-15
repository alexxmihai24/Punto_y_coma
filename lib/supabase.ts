import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True si Supabase está configurado. Permite que la app funcione sin BD (modo demo). */
export function hasSupabase(): boolean {
  return Boolean(url && service);
}

let _service: SupabaseClient | null = null;
let _public: SupabaseClient | null = null;

/** Cliente con service role — SOLO servidor. Salta RLS; usar para escrituras y admin. */
export function serviceClient(): SupabaseClient | null {
  if (!url || !service) return null;
  if (!_service) {
    _service = createClient(url, service, { auth: { persistSession: false } });
  }
  return _service;
}

/** Cliente público (anon) para lecturas con RLS. */
export function publicClient(): SupabaseClient | null {
  if (!url || !anon) return null;
  if (!_public) {
    _public = createClient(url, anon, { auth: { persistSession: false } });
  }
  return _public;
}
