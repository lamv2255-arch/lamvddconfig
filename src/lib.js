// ============================================================
// LOCKET GOLD CAPYBARA - Shared helpers (crypto, auth, db)
// ============================================================

export const now = () => Date.now();

// ---------- JSON / response helpers ----------
export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}
export const ok = (data = {}) => json({ ok: true, ...data });
export const err = (message, status = 400) => json({ ok: false, error: message }, status);

export function formatVND(n) {
  return Number(n || 0).toLocaleString("vi-VN") + " VNĐ";
}

// ---------- base64 (bytes <-> string) ----------
export function bytesToB64(bytes) {
  let bin = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin);
}
export function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ---------- Password hashing (PBKDF2-SHA256) ----------
const PBKDF2_ITER = 120000;

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await deriveBits(password, salt);
  return `pbkdf2$${PBKDF2_ITER}$${bytesToB64(salt)}$${bytesToB64(bits)}`;
}

export async function verifyPassword(password, stored) {
  try {
    const [scheme, iterStr, saltB64, hashB64] = String(stored).split("$");
    if (scheme !== "pbkdf2") return false;
    const salt = b64ToBytes(saltB64);
    const bits = await deriveBits(password, salt, parseInt(iterStr, 10));
    return timingSafeEqual(bytesToB64(bits), hashB64);
  } catch {
    return false;
  }
}

async function deriveBits(password, salt, iter = PBKDF2_ITER) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" },
    key,
    256
  );
  return bits;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ---------- Session tokens (HMAC-signed cookie) ----------
async function hmac(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return bytesToB64(sig).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createSession(secret, userId, days = 30) {
  const exp = Date.now() + days * 86400000;
  const payload = `${userId}.${exp}`;
  const sig = await hmac(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifySession(secret, token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  const expected = await hmac(secret, `${userId}.${exp}`);
  if (!timingSafeEqual(sig, expected)) return null;
  if (Date.now() > parseInt(exp, 10)) return null;
  return parseInt(userId, 10);
}

export function parseCookies(req) {
  const header = req.headers.get("Cookie") || "";
  const out = {};
  header.split(";").forEach((p) => {
    const idx = p.indexOf("=");
    if (idx > -1) out[p.slice(0, idx).trim()] = decodeURIComponent(p.slice(idx + 1).trim());
  });
  return out;
}

export function sessionCookie(token, days = 30) {
  const maxAge = days * 86400;
  return `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
export const clearCookie = () => `session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

// ---------- random tokens ----------
export function randomToken(len = 24) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return bytesToB64(bytes).replace(/[^a-zA-Z0-9]/g, "").slice(0, len);
}

export function depositCode(userId) {
  const r = randomToken(6).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return `NAP${userId}X${r}`;
}

// ---------- settings ----------
export async function getSetting(env, key, fallback = null) {
  const row = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind(key).first();
  return row ? row.value : fallback;
}
export async function setSetting(env, key, value) {
  await env.DB.prepare(
    "INSERT INTO settings(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  ).bind(key, value).run();
}

export const DEFAULT_BANK = {
  bank_bin: "970422",          // MB Bank (vi du)
  bank_name: "MB Bank",
  account_number: "0000000000",
  account_name: "LOCKET GOLD CAPYBARA",
};

export async function getBankConfig(env) {
  const raw = await getSetting(env, "bank_config");
  if (!raw) return { ...DEFAULT_BANK };
  try { return { ...DEFAULT_BANK, ...JSON.parse(raw) }; } catch { return { ...DEFAULT_BANK }; }
}

// VietQR image url (quét chuyển khoản tự động)
export function vietQrUrl(bank, amount, addInfo) {
  const base = `https://img.vietqr.io/image/${bank.bank_bin}-${bank.account_number}-compact2.png`;
  const q = new URLSearchParams();
  if (amount) q.set("amount", String(amount));
  if (addInfo) q.set("addInfo", addInfo);
  if (bank.account_name) q.set("accountName", bank.account_name);
  return `${base}?${q.toString()}`;
}
