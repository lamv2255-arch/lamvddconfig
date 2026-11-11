-- ============================================================
-- Du lieu khoi tao cho LOCKET GOLD CAPYBARA
-- ============================================================

-- Goi dich vu chinh
INSERT INTO products (name, price, duration, features, active, created_at)
VALUES (
  'Locket Gold 2 tháng',
  49000,
  '2 tháng',
  '["Caption video tối đa 45 giây","Hỗ trợ microphone","Photobooth","Các tính năng Gold được dịch vụ hỗ trợ"]',
  1,
  strftime('%s','now') * 1000
);

-- Cau hinh ngan hang mac dinh (admin doi lai trong trang quan tri)
INSERT INTO settings (key, value) VALUES (
  'bank_config',
  '{"bank_bin":"970422","bank_name":"MB Bank","account_number":"0000000000","account_name":"LOCKET GOLD CAPYBARA"}'
) ON CONFLICT(key) DO NOTHING;
