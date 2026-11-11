-- ============================================================
-- LOCKET GOLD CAPYBARA - Database schema (Cloudflare D1 / SQLite)
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  name          TEXT    NOT NULL DEFAULT '',
  role          TEXT    NOT NULL DEFAULT 'user',   -- 'user' | 'admin'
  balance       INTEGER NOT NULL DEFAULT 0,        -- so du vi (VND, so nguyen)
  created_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Lich su bien dong so du (nap / mua / dieu chinh)
CREATE TABLE IF NOT EXISTS ledger (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  type          TEXT    NOT NULL,                  -- 'deposit' | 'purchase' | 'adjust'
  amount        INTEGER NOT NULL,                  -- + nap, - tru
  balance_after INTEGER NOT NULL,
  ref           TEXT,                              -- ma tham chieu (deposit code / order id)
  note          TEXT,
  created_at    INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_ledger_user ON ledger(user_id, created_at);

-- Yeu cau nap tien qua QR ngan hang
CREATE TABLE IF NOT EXISTS deposits (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL,
  code         TEXT    NOT NULL UNIQUE,            -- noi dung chuyen khoan (unique)
  amount       INTEGER NOT NULL,
  status       TEXT    NOT NULL DEFAULT 'pending', -- 'pending' | 'completed' | 'cancelled'
  provider_ref TEXT,                               -- ma giao dich thuc te tu ngan hang
  created_at   INTEGER NOT NULL,
  credited_at  INTEGER
);
CREATE INDEX IF NOT EXISTS idx_deposits_code ON deposits(code);
CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits(user_id, created_at);

-- Chong cong tien trung lap: moi giao dich ngan hang chi xu ly 1 lan
CREATE TABLE IF NOT EXISTS bank_tx (
  provider_ref TEXT PRIMARY KEY,                   -- id giao dich tu ngan hang / cong thanh toan
  deposit_id   INTEGER,
  amount       INTEGER,
  created_at   INTEGER NOT NULL
);

-- San pham / goi dich vu
CREATE TABLE IF NOT EXISTS products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  price       INTEGER NOT NULL,
  duration    TEXT    NOT NULL DEFAULT '',
  features    TEXT    NOT NULL DEFAULT '[]',       -- JSON array
  active      INTEGER NOT NULL DEFAULT 1,
  created_at  INTEGER NOT NULL
);

-- Don hang
CREATE TABLE IF NOT EXISTS orders (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL,
  product_id     INTEGER NOT NULL,
  product_name   TEXT    NOT NULL,
  price          INTEGER NOT NULL,
  duration       TEXT    NOT NULL DEFAULT '',
  status         TEXT    NOT NULL DEFAULT 'paid',  -- 'paid' | 'processing' | 'completed' | 'cancelled'
  download_token TEXT    NOT NULL UNIQUE,          -- link tai file rieng cho moi don
  created_at     INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(download_token);

-- Cau hinh he thong (bank info, QR, mobileconfig...)
CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);
