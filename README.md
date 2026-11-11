# 🐹 LOCKET GOLD CAPYBARA

Website thương mại điện tử bán dịch vụ **Locket Gold**, chạy hoàn toàn trên **Cloudflare Workers + D1 (SQLite)**.
Đầy đủ Frontend + Backend + Database + tài khoản + ví tiền + **nạp tiền QR tự động** + quản lý đơn hàng + trang Admin + phân phối file **MobileConfig**.

Giao diện **ưu tiên điện thoại (mobile-first)**, tông màu vàng kem – nâu nhạt – trắng, logo Capybara + Locket Gold.

---

## 🧩 Kiến trúc

| Thành phần | File |
|---|---|
| Worker (router + API + download) | `src/index.js` |
| Helper (mã hoá, session, QR, settings) | `src/lib.js` |
| Giao diện SPA (mobile-first) | `src/html.js` |
| Schema cơ sở dữ liệu | `schema.sql` |
| Dữ liệu khởi tạo (sản phẩm, bank) | `seed.sql` |
| Cấu hình triển khai | `wrangler.json` |

> `LAMVDDCONFIG.js` là script Locket Remote Config cũ (dùng cho Loon/Surge/Quantumult), **không liên quan** tới website và được giữ nguyên.

---

## 🔐 Bảo mật đã triển khai

- Mật khẩu băm bằng **PBKDF2-SHA256** (120.000 vòng, salt ngẫu nhiên) — không lưu mật khẩu thô.
- Phiên đăng nhập ký **HMAC-SHA256**, cookie `HttpOnly; Secure; SameSite=Lax`.
- Phân quyền **Admin / User** kiểm tra phía máy chủ.
- **Xác minh giao dịch phía máy chủ** qua webhook ngân hàng — KHÔNG cộng tiền theo ảnh chụp.
- **Chống cộng tiền trùng lặp**: mỗi giao dịch ngân hàng (`provider_ref`) chỉ xử lý 1 lần (PRIMARY KEY).
- **Chống trừ tiền 2 lần**: trừ ví bằng câu lệnh atomic `UPDATE ... WHERE balance >= price`.
- **Lịch sử biến động số dư** đầy đủ (bảng `ledger`).
- File tải xuống **chỉ dành cho đơn đã thanh toán**, mỗi đơn có **link riêng** (token 32 ký tự), kiểm tra quyền sở hữu.
- Secret (SESSION_SECRET, WEBHOOK_SECRET) lưu ở Cloudflare Secrets, không nằm trong Frontend.

---

## 🚀 Triển khai (deploy)

### 1. Cài đặt
```bash
npm install -g wrangler
wrangler login
```

### 2. Tạo cơ sở dữ liệu D1
```bash
wrangler d1 create locket_gold_db
```
Sao chép `database_id` vào `wrangler.json` (thay `REPLACE_WITH_YOUR_D1_DATABASE_ID`).

### 3. Khởi tạo bảng + dữ liệu mẫu
```bash
wrangler d1 execute locket_gold_db --remote --file=./schema.sql
wrangler d1 execute locket_gold_db --remote --file=./seed.sql
```

### 4. Thiết lập Secrets
```bash
# Chuỗi bí mật ký phiên đăng nhập (bắt buộc)
wrangler secret put SESSION_SECRET

# Khoá xác thực webhook ngân hàng (bắt buộc cho nạp tiền tự động)
wrangler secret put WEBHOOK_SECRET
```
Email admin đặt trong `wrangler.json` → `vars.ADMIN_EMAIL`. Tài khoản đăng ký bằng email này sẽ tự động là **Admin**.

### 5. Deploy
```bash
wrangler deploy
```

---

## 💳 Cấu hình nạp tiền QR tự động

Hệ thống tạo mã **VietQR** từ thông tin ngân hàng của bạn (đặt trong **Trang Admin → Ngân hàng/QR**).
Mỗi lần nạp sinh **nội dung chuyển khoản riêng** dạng `NAP<uid>X<random>`.

Để cộng tiền **tự động**, kết nối một dịch vụ đọc biến động số dư ngân hàng (ví dụ **SePay**, **Casso**) và trỏ webhook về:

```
POST https://<ten-worker>.workers.dev/api/webhook/bank
Header:  Authorization: Apikey <WEBHOOK_SECRET>
```

Webhook chấp nhận định dạng phổ biến (SePay/Casso). Các trường được map tự động:

| Ý nghĩa | Tên trường chấp nhận |
|---|---|
| Mã giao dịch | `id`, `referenceCode`, `reference_number`, `tid`, `transactionID` |
| Nội dung CK | `content`, `description`, `transferContent`, `addInfo` |
| Số tiền vào | `transferAmount`, `amount`, `amount_in`, `credit` |
| Loại giao dịch | `transferType` / `type` (chỉ xử lý `in`/`credit`/`money_in`) |

Luồng: webhook → tìm mã `NAP...` trong nội dung → đối chiếu số tiền thực nhận → cộng vào đúng ví → ghi sổ cái → khách thấy “Nạp tiền thành công” (trang nạp tự động poll trạng thái).

> Khi chưa gắn webhook, Admin vẫn có thể cộng tiền thủ công tại **Admin → Người dùng → ± Số dư**.

---

## 📄 File MobileConfig

- Admin tải file `.mobileconfig` tại **Admin → MobileConfig** (lưu trong DB, thay thế bất cứ lúc nào, **không cần sửa code**).
- Chỉ nhận plist XML hợp lệ, tối đa 512KB.
- Sau khi thanh toán, khách thấy nút **📥 TẢI FILE MOBILECONFIG** với link riêng cho đơn của mình (`/download/<token>`), yêu cầu đăng nhập và đúng chủ đơn.

---

## 🛠️ Trang Admin

Tổng quan doanh thu (ngày/tuần/tháng + biểu đồ), người dùng, ví, lịch sử nạp, đơn hàng, sản phẩm (thêm/sửa/ẩn/đổi giá), ngân hàng/QR, MobileConfig, trạng thái đơn.

---

## 🧪 Phát triển cục bộ
```bash
wrangler d1 execute locket_gold_db --local --file=./schema.sql
wrangler d1 execute locket_gold_db --local --file=./seed.sql
wrangler dev
```
