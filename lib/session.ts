import "server-only";
import { cookies } from "next/headers";
import { COOKIE, verifyToken } from "./auth";

/** True si la petición actual tiene una sesión de admin válida. */
export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return verifyToken(c.get(COOKIE)?.value);
}

/** Lanza si no hay sesión válida. Usar al inicio de las server actions del panel. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("No autorizado");
}
