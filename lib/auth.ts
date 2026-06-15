// Autenticación del panel: cookie de sesión firmada (HMAC-SHA256 con Web Crypto).
// Pura y sin dependencias de next/headers para poder usarse también en middleware (edge).

export const COOKIE = "pyc_admin";
export const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

const SECRET = process.env.SESSION_SECRET || "dev-insecure-pyc-secret-change-me";

const enc = new TextEncoder();

async function hmacHex(msg: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createToken(): Promise<string> {
  const body = String(Date.now() + MAX_AGE * 1000);
  return `${body}.${await hmacHex(body)}`;
}

export async function verifyToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const exp = Number(body);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return safeEqual(sig, await hmacHex(body));
}

/** True si la contraseña coincide con ADMIN_PASSWORD (y está configurada). */
export function checkPassword(pw: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  return Boolean(real) && pw === real;
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}
