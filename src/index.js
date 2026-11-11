// ============================================================
// LOCKET GOLD CAPYBARA - E-commerce Worker (Cloudflare Workers + D1)
// Frontend + Backend + Wallet + QR auto top-up + Orders + Admin
// ============================================================

import {
  now, ok, err, json, formatVND,
  hashPassword, verifyPassword,
  createSession, verifySession, parseCookies, sessionCookie, clearCookie,
  randomToken, depositCode,
  getSetting, setSetting, getBankConfig, vietQrUrl,
  bytesToB64, b64ToBytes,
} from "./lib.js";
import { PAGE } from "./html.js";

export default {
  async fetch(request, env, ctx) {
    try {
      return await handle(request, env, ctx);
    } catch (e) {
      return err("Loi may chu: " + (e && e.message ? e.message : String(e)), 500);
    }
  },
};

function secret(env) {
  return env.SESSION_SECRET || "locket-gold-capybara-change-me-in-production";
}

async function currentUser(request, env) {
  const cookies = parseCookies(request);
  const uid = await verifySession(secret(env), cookies.session);
  if (!uid) return null;
  return await env.DB.prepare(
    "SELECT id, email, name, role, balance, created_at FROM users WHERE id = ?"
  ).bind(uid).first();
}

async function handle(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // ---- API ----
  if (path.startsWith("/api/")) return api(request, env, ctx, url, path, method);

  // ---- MobileConfig download (per-order secure link) ----
  if (path.startsWith("/download/")) return download(request, env, path);

  // ---- Frontend (SPA) ----
  if (path === "/" || !path.includes(".")) {
    return new Response(PAGE, { headers: { "content-type": "text/html; charset=utf-8" } });
  }
  return new Response("Not found", { status: 404 });
}

// ============================================================
// API ROUTER
// ============================================================
async function api(request, env, ctx, url, path, method) {
  // --- Public auth ---
  if (path === "/api/auth/register" && method === "POST") return register(request, env);
  if (path === "/api/auth/login" && method === "POST") return login(request, env);
  if (path === "/api/auth/logout" && method === "POST") return logout();
  if (path === "/api/products" && method === "GET") return listProducts(env);
  if (path === "/api/bank" && method === "GET") return publicBank(env);

  // --- Payment webhook (no cookie; verified by secret) ---
  if (path === "/api/webhook/bank" && method === "POST") return bankWebhook(request, env);

  // --- Authenticated routes ---
  const user = await currentUser(request, env);
  if (path === "/api/me" && method === "GET") {
    if (!user) return err("Chưa đăng nhập", 401);
    return ok({ user });
  }
  if (!user) return err("Chưa đăng nhập", 401);

  if (path === "/api/profile" && method === "POST") return updateProfile(request, env, user);
  if (path === "/api/wallet" && method === "GET") return wallet(env, user);
  if (path === "/api/deposit/create" && method === "POST") return createDeposit(request, env, user);
  if (path === "/api/deposit/status" && method === "GET") return depositStatus(env, user, url);
  if (path === "/api/deposits" && method === "GET") return listDeposits(env, user);
  if (path === "/api/purchase" && method === "POST") return purchase(request, env, user);
  if (path === "/api/orders" && method === "GET") return listOrders(env, user);
  if (path === "/api/order" && method === "GET") return getOrder(env, user, url);

  // --- Admin routes ---
  if (path.startsWith("/api/admin/")) {
    if (user.role !== "admin") return err("Không có quyền truy cập", 403);
    return admin(request, env, url, path, method, user);
  }

  return err("Không tìm thấy endpoint", 404);
}

// ============================================================
// AUTH
// ============================================================
async function register(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const name = String(body.name || "").trim().slice(0, 80);

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return err("Email không hợp lệ");
  if (password.length < 6) return err("Mật khẩu tối thiểu 6 ký tự");

  const exists = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (exists) return err("Email đã được đăng ký");

  const role = (env.ADMIN_EMAIL && email === env.ADMIN_EMAIL.toLowerCase()) ? "admin" : "user";
  const hash = await hashPassword(password);
  const ts = now();
  const res = await env.DB.prepare(
    "INSERT INTO users(email, password_hash, name, role, balance, created_at) VALUES(?,?,?,?,0,?)"
  ).bind(email, hash, name, role, ts).run();

  const uid = res.meta.last_row_id;
  const token = await createSession(secret(env), uid);
  const user = { id: uid, email, name, role, balance: 0, created_at: ts };
  return json({ ok: true, user }, 200, { "Set-Cookie": sessionCookie(token) });
}

async function login(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  const row = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    return err("Email hoặc mật khẩu không đúng", 401);
  }
  const token = await createSession(secret(env), row.id);
  const user = { id: row.id, email: row.email, name: row.name, role: row.role, balance: row.balance, created_at: row.created_at };
  return json({ ok: true, user }, 200, { "Set-Cookie": sessionCookie(token) });
}

function logout() {
  return json({ ok: true }, 200, { "Set-Cookie": clearCookie() });
}

async function updateProfile(request, env, user) {
  const body = await request.json().catch(() => ({}));
  const name = String(body.name || "").trim().slice(0, 80);
  await env.DB.prepare("UPDATE users SET name = ? WHERE id = ?").bind(name, user.id).run();
  return ok({ name });
}

// ============================================================
// PRODUCTS
// ============================================================
async function listProducts(env) {
  const { results } = await env.DB.prepare(
    "SELECT id, name, price, duration, features, active FROM products WHERE active = 1 ORDER BY id"
  ).all();
  const products = (results || []).map((p) => ({ ...p, features: safeJson(p.features, []) }));
  return ok({ products });
}

// ============================================================
// WALLET + DEPOSIT (QR auto)
// ============================================================
async function publicBank(env) {
  const bank = await getBankConfig(env);
  return ok({ bank });
}

async function wallet(env, user) {
  const u = await env.DB.prepare("SELECT balance FROM users WHERE id = ?").bind(user.id).first();
  const { results } = await env.DB.prepare(
    "SELECT type, amount, balance_after, ref, note, created_at FROM ledger WHERE user_id = ? ORDER BY id DESC LIMIT 100"
  ).bind(user.id).all();
  return ok({ balance: u.balance, ledger: results || [] });
}

async function createDeposit(request, env, user) {
  const body = await request.json().catch(() => ({}));
  const amount = Math.floor(Number(body.amount || 0));
  if (!amount || amount < 10000) return err("Số tiền nạp tối thiểu 10.000 VNĐ");
  if (amount > 50000000) return err("Số tiền nạp quá lớn");

  const code = depositCode(user.id);
  const ts = now();
  const res = await env.DB.prepare(
    "INSERT INTO deposits(user_id, code, amount, status, created_at) VALUES(?,?,?,'pending',?)"
  ).bind(user.id, code, amount, ts).run();

  const bank = await getBankConfig(env);
  const qr = vietQrUrl(bank, amount, code);
  return ok({
    deposit: { id: res.meta.last_row_id, code, amount, status: "pending", created_at: ts },
    bank, qr,
  });
}

async function depositStatus(env, user, url) {
  const code = url.searchParams.get("code");
  if (!code) return err("Thiếu mã giao dịch");
  const row = await env.DB.prepare(
    "SELECT id, code, amount, status, created_at, credited_at FROM deposits WHERE code = ? AND user_id = ?"
  ).bind(code, user.id).first();
  if (!row) return err("Không tìm thấy giao dịch", 404);
  const u = await env.DB.prepare("SELECT balance FROM users WHERE id = ?").bind(user.id).first();
  return ok({ deposit: row, balance: u.balance });
}

async function listDeposits(env, user) {
  const { results } = await env.DB.prepare(
    "SELECT id, code, amount, status, created_at, credited_at FROM deposits WHERE user_id = ? ORDER BY id DESC LIMIT 50"
  ).bind(user.id).all();
  return ok({ deposits: results || [] });
}

// ---- Bank webhook: xác minh giao dịch thực tế, cộng tiền tự động, chống trùng lặp ----
// Tương thích định dạng Sepay/Casso. Bảo vệ bằng header Authorization: Apikey <WEBHOOK_SECRET>
async function bankWebhook(request, env) {
  const configured = env.WEBHOOK_SECRET;
  if (configured) {
    const auth = request.headers.get("Authorization") || request.headers.get("authorization") || "";
    const provided = auth.replace(/^Apikey\s+/i, "").replace(/^Bearer\s+/i, "").trim();
    const qsKey = new URL(request.url).searchParams.get("key") || "";
    if (provided !== configured && qsKey !== configured) return err("Unauthorized webhook", 401);
  }

  const body = await request.json().catch(() => ({}));
  // Chuẩn hoá các trường từ nhiều nhà cung cấp (Sepay / Casso / generic)
  const providerRef = String(
    body.id || body.referenceCode || body.reference_number || body.tid || body.transactionID || ""
  ).trim();
  const content = String(
    body.content || body.description || body.transferContent || body.addInfo || ""
  );
  const amountIn = Math.floor(Number(
    body.transferAmount ?? body.amount ?? body.amount_in ?? body.credit ?? 0
  ));
  const transferType = String(body.transferType || body.type || "in").toLowerCase();

  if (!providerRef) return err("Thiếu mã giao dịch (provider ref)");
  if (transferType && transferType !== "in" && transferType !== "credit" && transferType !== "money_in") {
    return ok({ skipped: "not an incoming transfer" });
  }
  if (!amountIn || amountIn <= 0) return err("Số tiền không hợp lệ");

  // Chống cộng tiền trùng lặp: provider_ref là PRIMARY KEY
  const dup = await env.DB.prepare("SELECT provider_ref FROM bank_tx WHERE provider_ref = ?").bind(providerRef).first();
  if (dup) return ok({ duplicate: true, message: "Giao dịch đã xử lý" });

  // Tìm mã nạp trong nội dung chuyển khoản (NAP<uid>X<rand>)
  const match = content.toUpperCase().match(/NAP\d+X[A-Z0-9]+/);
  const ts = now();
  if (!match) {
    await env.DB.prepare("INSERT OR IGNORE INTO bank_tx(provider_ref, deposit_id, amount, created_at) VALUES(?,?,?,?)")
      .bind(providerRef, null, amountIn, ts).run();
    return ok({ matched: false, message: "Không tìm thấy mã nạp trong nội dung" });
  }
  const code = match[0];
  const deposit = await env.DB.prepare("SELECT * FROM deposits WHERE code = ?").bind(code).first();
  if (!deposit) {
    await env.DB.prepare("INSERT OR IGNORE INTO bank_tx(provider_ref, deposit_id, amount, created_at) VALUES(?,?,?,?)")
      .bind(providerRef, null, amountIn, ts).run();
    return ok({ matched: false, message: "Mã nạp không tồn tại" });
  }

  // Ghi nhận giao dịch ngân hàng (khoá chống trùng). Nếu INSERT thất bại (đã có) -> dừng.
  const mark = await env.DB.prepare(
    "INSERT OR IGNORE INTO bank_tx(provider_ref, deposit_id, amount, created_at) VALUES(?,?,?,?)"
  ).bind(providerRef, deposit.id, amountIn, ts).run();
  if (!mark.meta.changes) return ok({ duplicate: true });

  if (deposit.status === "completed") {
    return ok({ alreadyCompleted: true });
  }

  // Cộng đúng số tiền thực nhận vào ví + ghi sổ cái (atomic)
  await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").bind(amountIn, deposit.user_id).run();
  const u = await env.DB.prepare("SELECT balance FROM users WHERE id = ?").bind(deposit.user_id).first();
  await env.DB.prepare(
    "UPDATE deposits SET status = 'completed', provider_ref = ?, credited_at = ?, amount = ? WHERE id = ?"
  ).bind(providerRef, ts, amountIn, deposit.id).run();
  await env.DB.prepare(
    "INSERT INTO ledger(user_id, type, amount, balance_after, ref, note, created_at) VALUES(?,?,?,?,?,?,?)"
  ).bind(deposit.user_id, "deposit", amountIn, u.balance, code, "Nạp tiền qua QR ngân hàng", ts).run();

  return ok({ credited: true, amount: amountIn, user_id: deposit.user_id, balance: u.balance });
}

// ============================================================
// PURCHASE (trừ ví, tạo đơn, chống trừ 2 lần)
// ============================================================
async function purchase(request, env, user) {
  const body = await request.json().catch(() => ({}));
  const productId = Math.floor(Number(body.product_id || 0));
  const product = await env.DB.prepare("SELECT * FROM products WHERE id = ? AND active = 1").bind(productId).first();
  if (!product) return err("Sản phẩm không tồn tại", 404);

  const price = product.price;

  // Trừ tiền atomic: chỉ trừ khi đủ số dư (WHERE balance >= price)
  const dec = await env.DB.prepare(
    "UPDATE users SET balance = balance - ? WHERE id = ? AND balance >= ?"
  ).bind(price, user.id, price).run();

  if (!dec.meta.changes) {
    const u = await env.DB.prepare("SELECT balance FROM users WHERE id = ?").bind(user.id).first();
    return json({ ok: false, error: "Số dư không đủ", need_topup: true, balance: u.balance, price }, 402);
  }

  const u = await env.DB.prepare("SELECT balance FROM users WHERE id = ?").bind(user.id).first();
  const token = randomToken(32);
  const ts = now();
  const res = await env.DB.prepare(
    "INSERT INTO orders(user_id, product_id, product_name, price, duration, status, download_token, created_at) VALUES(?,?,?,?,?,'paid',?,?)"
  ).bind(user.id, product.id, product.name, price, product.duration, token, ts).run();
  const orderId = res.meta.last_row_id;

  await env.DB.prepare(
    "INSERT INTO ledger(user_id, type, amount, balance_after, ref, note, created_at) VALUES(?,?,?,?,?,?,?)"
  ).bind(user.id, "purchase", -price, u.balance, "ORDER#" + orderId, "Mua " + product.name, ts).run();

  const hasFile = !!(await getSetting(env, "mobileconfig_b64"));
  const order = {
    id: orderId, product_name: product.name, price, duration: product.duration,
    status: "paid", download_token: token, created_at: ts,
    download_url: "/download/" + token, has_file: hasFile,
  };
  return ok({ order, balance: u.balance });
}

async function listOrders(env, user) {
  const { results } = await env.DB.prepare(
    "SELECT id, product_name, price, duration, status, download_token, created_at FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 100"
  ).bind(user.id).all();
  const hasFile = !!(await getSetting(env, "mobileconfig_b64"));
  const orders = (results || []).map((o) => ({ ...o, download_url: "/download/" + o.download_token, has_file: hasFile }));
  return ok({ orders });
}

async function getOrder(env, user, url) {
  const id = Math.floor(Number(url.searchParams.get("id") || 0));
  const row = await env.DB.prepare(
    "SELECT id, product_name, price, duration, status, download_token, created_at FROM orders WHERE id = ? AND user_id = ?"
  ).bind(id, user.id).first();
  if (!row) return err("Không tìm thấy đơn hàng", 404);
  const hasFile = !!(await getSetting(env, "mobileconfig_b64"));
  return ok({ order: { ...row, download_url: "/download/" + row.download_token, has_file: hasFile } });
}

// ============================================================
// MOBILECONFIG DOWNLOAD (chỉ đơn đã thanh toán, link riêng)
// ============================================================
async function download(request, env, path) {
  const token = path.split("/download/")[1];
  if (!token) return new Response("Thiếu mã tải", { status: 400 });

  // Phải đăng nhập và sở hữu đơn hàng
  const user = await currentUser(request, env);
  if (!user) return new Response("Vui lòng đăng nhập để tải file.", { status: 401 });

  const order = await env.DB.prepare(
    "SELECT * FROM orders WHERE download_token = ?"
  ).bind(token).first();
  if (!order) return new Response("Liên kết tải không hợp lệ.", { status: 404 });
  if (order.user_id !== user.id && user.role !== "admin") {
    return new Response("Bạn không có quyền tải file này.", { status: 403 });
  }
  if (order.status === "cancelled") return new Response("Đơn hàng đã bị huỷ.", { status: 403 });

  const b64 = await getSetting(env, "mobileconfig_b64");
  if (!b64) return new Response("Quản trị viên chưa tải lên file cấu hình. Vui lòng liên hệ hỗ trợ.", { status: 404 });
  const fileName = (await getSetting(env, "mobileconfig_name")) || "locket-gold.mobileconfig";

  const bytes = b64ToBytes(b64);
  return new Response(bytes, {
    headers: {
      "content-type": "application/x-apple-aspen-config",
      "content-disposition": `attachment; filename="${fileName}"`,
      "cache-control": "no-store",
    },
  });
}

// ============================================================
// ADMIN
// ============================================================
async function admin(request, env, url, path, method, user) {
  if (path === "/api/admin/stats" && method === "GET") return adminStats(env);
  if (path === "/api/admin/users" && method === "GET") return adminUsers(env, url);
  if (path === "/api/admin/user/balance" && method === "POST") return adminAdjustBalance(request, env);
  if (path === "/api/admin/deposits" && method === "GET") return adminDeposits(env);
  if (path === "/api/admin/orders" && method === "GET") return adminOrders(env);
  if (path === "/api/admin/order/status" && method === "POST") return adminOrderStatus(request, env);
  if (path === "/api/admin/products" && method === "GET") return adminProducts(env);
  if (path === "/api/admin/product/save" && method === "POST") return adminProductSave(request, env);
  if (path === "/api/admin/product/delete" && method === "POST") return adminProductDelete(request, env);
  if (path === "/api/admin/bank" && method === "GET") return adminGetBank(env);
  if (path === "/api/admin/bank/save" && method === "POST") return adminBankSave(request, env);
  if (path === "/api/admin/mobileconfig" && method === "GET") return adminGetMobileconfig(env);
  if (path === "/api/admin/mobileconfig/upload" && method === "POST") return adminUploadMobileconfig(request, env);
  return err("Admin endpoint không tồn tại", 404);
}

async function adminStats(env) {
  const revenue = await env.DB.prepare("SELECT COALESCE(SUM(price),0) AS r FROM orders WHERE status != 'cancelled'").first();
  const users = await env.DB.prepare("SELECT COUNT(*) AS c FROM users").first();
  const ordersCount = await env.DB.prepare("SELECT COUNT(*) AS c FROM orders").first();
  const depositsSum = await env.DB.prepare("SELECT COALESCE(SUM(amount),0) AS s FROM deposits WHERE status = 'completed'").first();

  // Doanh thu theo ngày (14 ngày gần nhất)
  const { results: daily } = await env.DB.prepare(
    `SELECT strftime('%Y-%m-%d', datetime(created_at/1000,'unixepoch')) AS d,
            COALESCE(SUM(price),0) AS total, COUNT(*) AS cnt
     FROM orders WHERE status != 'cancelled'
     GROUP BY d ORDER BY d DESC LIMIT 14`
  ).all();

  const dayMs = 86400000;
  const nowTs = now();
  const sumSince = async (since) => {
    const r = await env.DB.prepare("SELECT COALESCE(SUM(price),0) AS s FROM orders WHERE status != 'cancelled' AND created_at >= ?").bind(since).first();
    return r.s;
  };
  const today = await sumSince(nowTs - dayMs);
  const week = await sumSince(nowTs - 7 * dayMs);
  const month = await sumSince(nowTs - 30 * dayMs);

  return ok({
    revenue: revenue.r, users: users.c, orders: ordersCount.c, deposits: depositsSum.s,
    daily: (daily || []).reverse(), today, week, month,
  });
}

async function adminUsers(env, url) {
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  let stmt;
  if (q) {
    stmt = env.DB.prepare("SELECT id, email, name, role, balance, created_at FROM users WHERE lower(email) LIKE ? OR lower(name) LIKE ? ORDER BY id DESC LIMIT 200")
      .bind(`%${q}%`, `%${q}%`);
  } else {
    stmt = env.DB.prepare("SELECT id, email, name, role, balance, created_at FROM users ORDER BY id DESC LIMIT 200");
  }
  const { results } = await stmt.all();
  return ok({ users: results || [] });
}

async function adminAdjustBalance(request, env) {
  const body = await request.json().catch(() => ({}));
  const userId = Math.floor(Number(body.user_id || 0));
  const amount = Math.floor(Number(body.amount || 0)); // + hoặc -
  const note = String(body.note || "Điều chỉnh bởi admin").slice(0, 200);
  const target = await env.DB.prepare("SELECT balance FROM users WHERE id = ?").bind(userId).first();
  if (!target) return err("Không tìm thấy người dùng", 404);
  if (target.balance + amount < 0) return err("Số dư sau điều chỉnh không được âm");

  await env.DB.prepare("UPDATE users SET balance = balance + ? WHERE id = ?").bind(amount, userId).run();
  const u = await env.DB.prepare("SELECT balance FROM users WHERE id = ?").bind(userId).first();
  await env.DB.prepare(
    "INSERT INTO ledger(user_id, type, amount, balance_after, ref, note, created_at) VALUES(?,?,?,?,?,?,?)"
  ).bind(userId, "adjust", amount, u.balance, "ADMIN", note, now()).run();
  return ok({ balance: u.balance });
}

async function adminDeposits(env) {
  const { results } = await env.DB.prepare(
    `SELECT d.id, d.code, d.amount, d.status, d.provider_ref, d.created_at, d.credited_at, u.email
     FROM deposits d JOIN users u ON u.id = d.user_id ORDER BY d.id DESC LIMIT 200`
  ).all();
  return ok({ deposits: results || [] });
}

async function adminOrders(env) {
  const { results } = await env.DB.prepare(
    `SELECT o.id, o.product_name, o.price, o.duration, o.status, o.download_token, o.created_at, u.email
     FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.id DESC LIMIT 200`
  ).all();
  return ok({ orders: results || [] });
}

async function adminOrderStatus(request, env) {
  const body = await request.json().catch(() => ({}));
  const id = Math.floor(Number(body.id || 0));
  const status = String(body.status || "");
  if (!["paid", "processing", "completed", "cancelled"].includes(status)) return err("Trạng thái không hợp lệ");
  await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(status, id).run();
  return ok({});
}

async function adminProducts(env) {
  const { results } = await env.DB.prepare("SELECT id, name, price, duration, features, active FROM products ORDER BY id").all();
  const products = (results || []).map((p) => ({ ...p, features: safeJson(p.features, []) }));
  return ok({ products });
}

async function adminProductSave(request, env) {
  const body = await request.json().catch(() => ({}));
  const id = Math.floor(Number(body.id || 0));
  const name = String(body.name || "").trim().slice(0, 120);
  const price = Math.floor(Number(body.price || 0));
  const duration = String(body.duration || "").trim().slice(0, 60);
  const active = body.active ? 1 : 0;
  let features = [];
  if (Array.isArray(body.features)) features = body.features.map((f) => String(f).slice(0, 200)).slice(0, 30);
  else if (typeof body.features === "string") features = body.features.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 30);
  if (!name || price < 0) return err("Tên hoặc giá không hợp lệ");
  const featJson = JSON.stringify(features);

  if (id) {
    await env.DB.prepare("UPDATE products SET name=?, price=?, duration=?, features=?, active=? WHERE id=?")
      .bind(name, price, duration, featJson, active, id).run();
    return ok({ id });
  } else {
    const res = await env.DB.prepare("INSERT INTO products(name, price, duration, features, active, created_at) VALUES(?,?,?,?,?,?)")
      .bind(name, price, duration, featJson, active, now()).run();
    return ok({ id: res.meta.last_row_id });
  }
}

async function adminProductDelete(request, env) {
  const body = await request.json().catch(() => ({}));
  const id = Math.floor(Number(body.id || 0));
  await env.DB.prepare("UPDATE products SET active = 0 WHERE id = ?").bind(id).run();
  return ok({});
}

async function adminGetBank(env) {
  return ok({ bank: await getBankConfig(env) });
}

async function adminBankSave(request, env) {
  const body = await request.json().catch(() => ({}));
  const cfg = {
    bank_bin: String(body.bank_bin || "").trim().slice(0, 12),
    bank_name: String(body.bank_name || "").trim().slice(0, 80),
    account_number: String(body.account_number || "").trim().slice(0, 40),
    account_name: String(body.account_name || "").trim().slice(0, 80),
  };
  await setSetting(env, "bank_config", JSON.stringify(cfg));
  return ok({ bank: cfg });
}

async function adminGetMobileconfig(env) {
  const name = await getSetting(env, "mobileconfig_name");
  const b64 = await getSetting(env, "mobileconfig_b64");
  const size = b64 ? b64ToBytes(b64).length : 0;
  const updated = await getSetting(env, "mobileconfig_updated");
  return ok({ has_file: !!b64, name: name || "", size, updated: updated ? Number(updated) : null });
}

async function adminUploadMobileconfig(request, env) {
  const body = await request.json().catch(() => ({}));
  let b64 = String(body.content_b64 || "");
  const name = String(body.name || "locket-gold.mobileconfig").trim().slice(0, 120) || "locket-gold.mobileconfig";
  // Cho phép data URL
  const comma = b64.indexOf("base64,");
  if (comma > -1) b64 = b64.slice(comma + 7);
  b64 = b64.replace(/\s/g, "");
  if (!b64) return err("Thiếu nội dung file");
  let bytes;
  try { bytes = b64ToBytes(b64); } catch { return err("File không hợp lệ (base64)"); }
  if (bytes.length > 512 * 1024) return err("File quá lớn (tối đa 512KB)");
  // Kiểm tra sơ bộ để tránh file nguy hiểm/không đúng định dạng
  const head = new TextDecoder().decode(bytes.slice(0, 200)).toLowerCase();
  if (!head.includes("<?xml") && !head.includes("<!doctype plist") && !head.includes("<plist")) {
    return err("File không đúng định dạng .mobileconfig (phải là plist XML)");
  }
  await setSetting(env, "mobileconfig_b64", b64);
  await setSetting(env, "mobileconfig_name", name);
  await setSetting(env, "mobileconfig_updated", String(now()));
  return ok({ name, size: bytes.length });
}

// ============================================================
// utils
// ============================================================
function safeJson(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}
