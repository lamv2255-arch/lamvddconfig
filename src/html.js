// Frontend SPA (mobile-first) for LOCKET GOLD CAPYBARA
const LOGO_INNER = `
<defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8B84B"/><stop offset="1" stop-color="#C9922A"/></linearGradient></defs>
<circle cx="50" cy="50" r="48" fill="url(#lg)"/>
<circle cx="50" cy="50" r="48" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/>
<ellipse cx="50" cy="58" rx="26" ry="23" fill="#B07D4A"/>
<ellipse cx="50" cy="62" rx="19" ry="16" fill="#C99A63"/>
<ellipse cx="34" cy="38" rx="7" ry="8" fill="#B07D4A"/>
<ellipse cx="66" cy="38" rx="7" ry="8" fill="#B07D4A"/>
<ellipse cx="34" cy="39" rx="3.5" ry="4" fill="#8A5E33"/>
<ellipse cx="66" cy="39" rx="3.5" ry="4" fill="#8A5E33"/>
<circle cx="41" cy="52" r="3.5" fill="#3b2a18"/>
<circle cx="59" cy="52" r="3.5" fill="#3b2a18"/>
<circle cx="42" cy="51" r="1.1" fill="#fff"/>
<circle cx="60" cy="51" r="1.1" fill="#fff"/>
<ellipse cx="50" cy="63" rx="9" ry="7" fill="#9A6A3C"/>
<ellipse cx="50" cy="60" rx="3" ry="2.2" fill="#5e4026"/>
<path d="M44 66 Q50 71 56 66" stroke="#5e4026" stroke-width="2" fill="none" stroke-linecap="round"/>
<circle cx="50" cy="20" r="9" fill="#fff"/>
<circle cx="50" cy="20" r="9" fill="none" stroke="#C9922A" stroke-width="1.5"/>
<path d="M50 15 l1.6 3.3 3.6 .5 -2.6 2.5 .6 3.6 -3.2 -1.7 -3.2 1.7 .6 -3.6 -2.6 -2.5 3.6 -.5z" fill="#E8B84B"/>
`;
function LOGO_SVG(size) {
  return `<svg class="logo" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">${LOGO_INNER}</svg>`;
}
function LOGO_JS() {
  return `function LOGO(size){return '<svg width="'+size+'" height="'+size+'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + ${JSON.stringify(LOGO_INNER)} + '</svg>';}`;
}

export const PAGE = /* html */ `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#F3E3C3">
<title>LOCKET GOLD CAPYBARA</title>
<style>
:root{
  --cream:#FBF4E4; --cream2:#F3E3C3; --gold:#E8B84B; --gold-d:#C9922A;
  --brown:#8A6A43; --brown-l:#B89B74; --ink:#4A3B28; --white:#fff;
  --ok:#2e9c6b; --bad:#d9534f; --shadow:0 10px 30px rgba(138,106,67,.15);
  --radius:20px;
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;padding:0}
body{
  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  background:linear-gradient(180deg,var(--cream) 0%,#fff 100%);
  color:var(--ink);min-height:100vh;line-height:1.5;
  padding-bottom:calc(env(safe-area-inset-bottom) + 20px);
}
a{color:var(--gold-d);text-decoration:none}
img{max-width:100%}
.wrap{max-width:860px;margin:0 auto;padding:0 16px}
.hidden{display:none !important}

/* Header */
header{
  position:sticky;top:0;z-index:50;
  background:rgba(251,244,228,.92);backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(201,146,42,.18);
}
.nav{display:flex;align-items:center;gap:10px;height:60px}
.brand{display:flex;align-items:center;gap:10px;font-weight:800;cursor:pointer;font-size:16px}
.brand .logo{width:38px;height:38px;flex:0 0 38px}
.brand small{display:block;font-weight:600;font-size:10px;color:var(--brown-l);letter-spacing:1px}
.nav-spacer{flex:1}
.nav .btn{padding:8px 14px;font-size:13px}
.nav-links{display:flex;gap:4px}
.nav-links a{padding:8px 10px;border-radius:12px;font-weight:600;font-size:13px;color:var(--brown);cursor:pointer}
.nav-links a:hover,.nav-links a.active{background:var(--cream2);color:var(--ink)}
.pill-balance{background:linear-gradient(135deg,var(--gold),var(--gold-d));color:#fff;padding:6px 12px;border-radius:20px;font-weight:700;font-size:13px;box-shadow:var(--shadow)}

/* Buttons */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  border:none;cursor:pointer;font-weight:700;font-size:15px;border-radius:14px;
  padding:13px 20px;transition:transform .12s ease,box-shadow .2s ease;
  background:var(--cream2);color:var(--ink)
}
.btn:active{transform:scale(.97)}
.btn-gold{background:linear-gradient(135deg,var(--gold) 0%,var(--gold-d) 100%);color:#fff;box-shadow:0 8px 20px rgba(201,146,42,.35)}
.btn-brown{background:var(--brown);color:#fff}
.btn-ghost{background:transparent;border:1.5px solid var(--gold-d);color:var(--gold-d)}
.btn-block{width:100%}
.btn-sm{padding:8px 14px;font-size:13px;border-radius:11px}
.btn:disabled{opacity:.55;cursor:not-allowed}

/* Cards / sections */
.card{background:#fff;border:1px solid rgba(201,146,42,.15);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow)}
.section{padding:40px 0}
.section h2{font-size:24px;margin:0 0 6px;text-align:center}
.section .sub{text-align:center;color:var(--brown-l);margin:0 0 26px}
.grid{display:grid;gap:16px}
@media(min-width:640px){.grid.cols-2{grid-template-columns:1fr 1fr}.grid.cols-3{grid-template-columns:repeat(3,1fr)}}

/* Hero */
.hero{text-align:center;padding:34px 0 10px}
.hero .logo-big{width:120px;height:120px;margin:0 auto;animation:float 4s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.hero h1{font-size:30px;margin:14px 0 4px;letter-spacing:.5px;
  background:linear-gradient(135deg,var(--gold-d),var(--brown));-webkit-background-clip:text;background-clip:text;color:transparent}
.hero .tag{color:var(--brown-l);font-weight:600;margin:0 0 20px}
.hero .cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.badge-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:18px}
.badge{background:#fff;border:1px solid rgba(201,146,42,.2);border-radius:20px;padding:7px 14px;font-size:12.5px;font-weight:600;color:var(--brown);box-shadow:var(--shadow)}

/* Feature */
.feat{text-align:center;padding:22px}
.feat .ico{font-size:34px}
.feat h3{margin:10px 0 4px;font-size:17px}
.feat p{margin:0;color:var(--brown-l);font-size:14px}

/* Product card */
.product{position:relative;overflow:hidden}
.product .ribbon{position:absolute;top:16px;right:-34px;background:var(--gold-d);color:#fff;font-size:11px;font-weight:800;padding:5px 40px;transform:rotate(45deg)}
.product h3{margin:0 0 2px;font-size:20px}
.price{font-size:34px;font-weight:900;color:var(--gold-d);margin:10px 0}
.price small{font-size:14px;color:var(--brown-l);font-weight:600}
.feature-list{list-style:none;padding:0;margin:14px 0}
.feature-list li{padding:7px 0 7px 28px;position:relative;font-size:14.5px;border-bottom:1px dashed rgba(201,146,42,.15)}
.feature-list li:before{content:"✓";position:absolute;left:0;color:var(--ok);font-weight:900;background:#e8f6ef;width:20px;height:20px;border-radius:50%;text-align:center;line-height:20px;font-size:12px}

/* Steps */
.steps{counter-reset:s}
.step{display:flex;gap:14px;align-items:flex-start;padding:12px 0}
.step .n{counter-increment:s;flex:0 0 36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-d));color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center}
.step .n:before{content:counter(s)}
.step h4{margin:4px 0 2px;font-size:15px}
.step p{margin:0;color:var(--brown-l);font-size:14px}

/* Reviews */
.review{padding:18px}
.review .stars{color:var(--gold);font-size:14px}
.review p{font-style:italic;margin:8px 0}
.review .who{font-weight:700;font-size:13px;color:var(--brown)}

/* Forms */
.field{margin-bottom:14px}
.field label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:var(--brown)}
.field input,.field textarea,.field select{
  width:100%;padding:13px 14px;border:1.5px solid rgba(201,146,42,.25);border-radius:13px;
  font-size:16px;background:#fff;color:var(--ink);font-family:inherit
}
.field input:focus,.field textarea:focus,.field select:focus{outline:none;border-color:var(--gold-d)}
.auth-card{max-width:420px;margin:30px auto}
.tabs{display:flex;background:var(--cream2);border-radius:14px;padding:4px;margin-bottom:20px}
.tabs button{flex:1;border:none;background:transparent;padding:10px;border-radius:11px;font-weight:700;cursor:pointer;color:var(--brown)}
.tabs button.active{background:#fff;color:var(--ink);box-shadow:var(--shadow)}

/* Dashboard */
.dash-head{display:flex;align-items:center;gap:14px;margin:24px 0}
.wallet-card{background:linear-gradient(135deg,var(--brown) 0%,var(--ink) 100%);color:#fff;border-radius:var(--radius);padding:22px;box-shadow:var(--shadow);position:relative;overflow:hidden}
.wallet-card .lbl{opacity:.8;font-size:13px}
.wallet-card .amt{font-size:32px;font-weight:900;margin:6px 0 14px}
.wallet-card:after{content:"🐹";position:absolute;right:-6px;bottom:-14px;font-size:90px;opacity:.12}
.stat{background:#fff;border-radius:16px;padding:16px;text-align:center;border:1px solid rgba(201,146,42,.15)}
.stat .v{font-size:22px;font-weight:900;color:var(--gold-d)}
.stat .l{font-size:12px;color:var(--brown-l)}
.menu-tabs{display:flex;gap:8px;overflow-x:auto;padding:16px 0;margin:0 -16px;padding-left:16px;padding-right:16px}
.menu-tabs button{white-space:nowrap;border:1px solid rgba(201,146,42,.25);background:#fff;padding:9px 16px;border-radius:20px;font-weight:600;cursor:pointer;font-size:13.5px;color:var(--brown)}
.menu-tabs button.active{background:var(--gold-d);color:#fff;border-color:var(--gold-d)}

/* Table */
.table{width:100%;border-collapse:collapse;font-size:13.5px}
.table th,.table td{text-align:left;padding:10px 8px;border-bottom:1px solid rgba(201,146,42,.14)}
.table th{color:var(--brown-l);font-weight:700;font-size:12px;text-transform:uppercase}
.table-wrap{overflow-x:auto;margin:0 -4px}
.tag{display:inline-block;padding:3px 10px;border-radius:12px;font-size:11.5px;font-weight:700}
.tag.pending{background:#fff3d6;color:#9a6b00}
.tag.completed,.tag.paid{background:#e4f6ed;color:#1c7a4f}
.tag.cancelled{background:#fbe2e1;color:#b23b37}
.tag.processing{background:#e5eefb;color:#2b5fa8}
.amt-pos{color:var(--ok);font-weight:700}
.amt-neg{color:var(--bad);font-weight:700}

/* QR deposit */
.qr-box{text-align:center}
.qr-box img{width:240px;height:240px;border-radius:16px;border:1px solid rgba(201,146,42,.2);background:#fff}
.kv{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px dashed rgba(201,146,42,.2);font-size:14px}
.kv b{color:var(--ink)}
.copy{cursor:pointer;color:var(--gold-d);font-weight:700}
.poll{display:inline-flex;align-items:center;gap:8px;color:var(--brown-l);font-size:13px}
.spin{width:14px;height:14px;border:2px solid var(--gold);border-top-color:transparent;border-radius:50%;animation:rot 1s linear infinite}
@keyframes rot{to{transform:rotate(360deg)}}

/* Success */
.success-hero{text-align:center;padding:10px 0 20px}
.success-hero .big{font-size:56px}
.success-hero h2{color:var(--ok);margin:8px 0}

/* Toast / modal */
#toast{position:fixed;left:50%;bottom:30px;transform:translateX(-50%) translateY(20px);opacity:0;
  background:var(--ink);color:#fff;padding:12px 20px;border-radius:30px;font-weight:600;font-size:14px;z-index:200;
  transition:all .3s ease;box-shadow:var(--shadow);max-width:90vw;text-align:center}
#toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
#toast.bad{background:var(--bad)}
.modal{position:fixed;inset:0;background:rgba(74,59,40,.5);z-index:150;display:flex;align-items:center;justify-content:center;padding:16px}
.modal .card{max-width:440px;width:100%;max-height:90vh;overflow-y:auto}
footer{text-align:center;padding:30px 16px;color:var(--brown-l);font-size:12.5px}
.loading{text-align:center;padding:40px;color:var(--brown-l)}
hr.div{border:none;border-top:1px dashed rgba(201,146,42,.25);margin:18px 0}
</style>
</head>
<body>
<header>
  <div class="wrap nav">
    <div class="brand" onclick="go('home')">
      ${LOGO_SVG(38)}
      <div>LOCKET GOLD<small>CAPYBARA</small></div>
    </div>
    <div class="nav-spacer"></div>
    <div class="nav-links" id="navLinks"></div>
  </div>
</header>

<main id="app"><div class="loading">Đang tải…</div></main>

<footer>
  <div>🐹 LOCKET GOLD CAPYBARA — Dịch vụ Locket Gold uy tín</div>
  <div style="margin-top:6px">Thanh toán an toàn · Xác minh giao dịch phía máy chủ</div>
</footer>

<div id="toast"></div>
<div id="modalRoot"></div>

<script>
${LOGO_JS()}
const $ = (s,el=document)=>el.querySelector(s);
const api = async (path, opts={})=>{
  const res = await fetch(path, {headers:{'content-type':'application/json'}, credentials:'same-origin', ...opts});
  let data={}; try{ data = await res.json(); }catch(e){}
  return {status:res.status, data};
};
const post = (path, body)=>api(path,{method:'POST', body:JSON.stringify(body||{})});
const fmt = n => Number(n||0).toLocaleString('vi-VN')+' VNĐ';
const fmtN = n => Number(n||0).toLocaleString('vi-VN');
const dt = ts => ts ? new Date(ts).toLocaleString('vi-VN') : '—';
let ME = null;

function toast(msg, bad){
  const t=$('#toast'); t.textContent=msg; t.className='show'+(bad?' bad':'');
  clearTimeout(t._t); t._t=setTimeout(()=>t.className='',2600);
}
function go(view, arg){ location.hash = view + (arg!==undefined?('/'+arg):''); }
function copy(txt){ navigator.clipboard?.writeText(txt).then(()=>toast('Đã sao chép'),()=>{}); }

async function loadMe(){
  const {status,data}=await api('/api/me');
  ME = status===200 && data.ok ? data.user : null;
  renderNav();
}
function renderNav(){
  const n=$('#navLinks');
  if(ME){
    n.innerHTML =
      '<span class="pill-balance" onclick="go(\\'dashboard\\')">'+fmt(ME.balance)+'</span>'+
      '<a onclick="go(\\'dashboard\\')">Tài khoản</a>'+
      (ME.role==='admin'?'<a onclick="go(\\'admin\\')">Quản trị</a>':'')+
      '<a onclick="doLogout()">Thoát</a>';
  }else{
    n.innerHTML =
      '<a onclick="go(\\'auth\\',\\'login\\')">Đăng nhập</a>'+
      '<a class="btn btn-gold btn-sm" onclick="go(\\'auth\\',\\'register\\')">Đăng ký</a>';
  }
}
async function doLogout(){ await post('/api/auth/logout'); ME=null; renderNav(); go('home'); toast('Đã đăng xuất'); }

/* ============ ROUTER ============ */
window.addEventListener('hashchange', route);
async function route(){
  const raw = location.hash.replace(/^#/,'') || 'home';
  const [view,arg] = raw.split('/');
  const app=$('#app');
  window.scrollTo(0,0);
  const views={home:viewHome,auth:viewAuth,dashboard:viewDashboard,deposit:viewDeposit,buy:viewBuy,success:viewSuccess,admin:viewAdmin};
  const fn = views[view]||viewHome;
  if((view==='dashboard'||view==='admin'||view==='deposit'||view==='success') && !ME){ await loadMe(); if(!ME){ return go('auth','login'); } }
  app.innerHTML='<div class="loading">Đang tải…</div>';
  try{ await fn(app,arg); }catch(e){ app.innerHTML='<div class="wrap section"><div class="card">Có lỗi xảy ra: '+e.message+'</div></div>'; }
}

/* ============ HOME ============ */
async function viewHome(app){
  const {data} = await api('/api/products');
  const products = data.products||[];
  app.innerHTML = \`
  <div class="wrap">
    <section class="hero">
      <div class="logo-big">\${LOGO(120)}</div>
      <h1>LOCKET GOLD CAPYBARA</h1>
      <p class="tag">Nâng cấp Locket Gold — Dễ thương, nhanh chóng, uy tín 🐹✨</p>
      <div class="cta">
        <button class="btn btn-gold" onclick="scrollToId('products')">🛒 Mua ngay</button>
        <button class="btn btn-ghost" onclick="go('auth','register')">Đăng ký miễn phí</button>
      </div>
      <div class="badge-row">
        <span class="badge">⚡ Kích hoạt tự động</span>
        <span class="badge">🔒 Thanh toán an toàn</span>
        <span class="badge">💛 Hỗ trợ tận tâm</span>
      </div>
    </section>

    <section class="section">
      <h2>Vì sao chọn chúng tôi?</h2>
      <p class="sub">Trải nghiệm Locket Gold trọn vẹn với giá cực tốt</p>
      <div class="grid cols-3">
        \${feat('🎬','Caption video 45s','Quay và chèn caption video dài tới 45 giây')}
        \${feat('🎤','Microphone','Hỗ trợ thu âm thanh sống động')}
        \${feat('📸','Photobooth','Khung ảnh Photobooth độc quyền')}
        \${feat('✨','Tính năng Gold','Mở khoá các tính năng Gold cao cấp')}
        \${feat('⚡','Tự động','Nạp tiền & kích hoạt tự động 24/7')}
        \${feat('🛡️','An toàn','Không chứa chứng chỉ rủi ro bảo mật')}
      </div>
    </section>

    <section class="section" id="products">
      <h2>Bảng giá dịch vụ</h2>
      <p class="sub">Chọn gói phù hợp với bạn</p>
      <div class="grid cols-2" id="productGrid">\${products.map(productCard).join('')||'<p class="sub">Chưa có sản phẩm.</p>'}</div>
    </section>

    <section class="section">
      <h2>Hướng dẫn mua hàng</h2>
      <p class="sub">Chỉ 4 bước đơn giản</p>
      <div class="card steps">
        \${step('Đăng ký tài khoản','Tạo tài khoản miễn phí chỉ với email')}
        \${step('Nạp tiền vào ví','Quét mã QR ngân hàng, tiền vào ví tự động')}
        \${step('Chọn gói & thanh toán','Mua Locket Gold bằng số dư ví')}
        \${step('Tải file & kích hoạt','Tải file cấu hình về iPhone và tận hưởng')}
      </div>
    </section>

    <section class="section">
      <h2>Khách hàng nói gì?</h2>
      <p class="sub">Hơn hàng nghìn khách hàng hài lòng</p>
      <div class="grid cols-3">
        \${review('Mai Anh','Nạp tiền xong là có luôn, quá tiện! Capybara cute nữa 🥰')}
        \${review('Quốc Huy','Giá rẻ mà Gold đầy đủ, caption video mượt lắm.')}
        \${review('Thanh Trúc','Hỗ trợ nhiệt tình, file tải về cài là chạy ngay.')}
      </div>
    </section>

    <section class="section" style="text-align:center">
      <div class="card" style="background:linear-gradient(135deg,var(--cream2),#fff)">
        <h2>Sẵn sàng nâng cấp Locket Gold?</h2>
        <p class="sub">Đăng ký ngay hôm nay để nhận ưu đãi</p>
        <button class="btn btn-gold" onclick="\${ME?'go(\\'buy\\')':'go(\\'auth\\',\\'register\\')'}">Bắt đầu ngay 🚀</button>
      </div>
    </section>
  </div>\`;
}
const feat=(i,t,p)=>\`<div class="card feat"><div class="ico">\${i}</div><h3>\${t}</h3><p>\${p}</p></div>\`;
const step=(t,p)=>\`<div class="step"><div class="n"></div><div><h4>\${t}</h4><p>\${p}</p></div></div>\`;
const review=(who,txt)=>\`<div class="card review"><div class="stars">★★★★★</div><p>"\${txt}"</p><div class="who">— \${who}</div></div>\`;
function productCard(p){
  const feats=(p.features||[]).map(f=>'<li>'+esc(f)+'</li>').join('');
  return \`<div class="card product">
    <div class="ribbon">HOT</div>
    <h3>\${esc(p.name)}</h3>
    <div style="color:var(--brown-l);font-size:13px">Thời hạn: <b>\${esc(p.duration||'—')}</b></div>
    <div class="price">\${fmtN(p.price)}<small> VNĐ</small></div>
    <ul class="feature-list">\${feats}</ul>
    <button class="btn btn-gold btn-block" onclick="\${ME?('buyProduct('+p.id+')'):"go('auth','login')"}">🛒 MUA NGAY</button>
  </div>\`;
}
function scrollToId(id){ const el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'}); }

/* ============ AUTH ============ */
async function viewAuth(app,mode){
  mode = (mode==='register')?'register':'login';
  app.innerHTML=\`<div class="wrap"><div class="card auth-card">
    <div style="text-align:center;margin-bottom:10px">\${LOGO(64)}</div>
    <div class="tabs">
      <button id="tLogin" class="\${mode==='login'?'active':''}" onclick="go('auth','login')">Đăng nhập</button>
      <button id="tReg" class="\${mode==='register'?'active':''}" onclick="go('auth','register')">Đăng ký</button>
    </div>
    <form id="authForm">
      \${mode==='register'?'<div class="field"><label>Họ tên</label><input name="name" placeholder="Tên của bạn" autocomplete="name"></div>':''}
      <div class="field"><label>Email</label><input name="email" type="email" required placeholder="you@email.com" autocomplete="email"></div>
      <div class="field"><label>Mật khẩu</label><input name="password" type="password" required placeholder="••••••" minlength="6" autocomplete="\${mode==='register'?'new-password':'current-password'}"></div>
      <button class="btn btn-gold btn-block" type="submit">\${mode==='register'?'Tạo tài khoản':'Đăng nhập'}</button>
    </form>
  </div></div>\`;
  $('#authForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const b=Object.fromEntries(new FormData(e.target));
    const btn=$('#authForm button'); btn.disabled=true;
    const ep = mode==='register'?'/api/auth/register':'/api/auth/login';
    const {status,data}=await post(ep,b);
    btn.disabled=false;
    if(data.ok){ ME=data.user; renderNav(); toast(mode==='register'?'Đăng ký thành công!':'Xin chào '+(ME.name||ME.email)); go('dashboard'); }
    else toast(data.error||'Thất bại', true);
  });
}

/* ============ DASHBOARD ============ */
async function viewDashboard(app,tab){
  tab = tab||'wallet';
  const {data}=await api('/api/wallet');
  const bal = data.balance||0; ME.balance=bal; renderNav();
  app.innerHTML=\`<div class="wrap">
    <div class="dash-head">
      <div style="flex:1">
        <div class="wallet-card">
          <div class="lbl">Số dư ví của bạn</div>
          <div class="amt">\${fmt(bal)}</div>
          <button class="btn btn-gold btn-sm" onclick="go('deposit')">＋ Nạp tiền</button>
          <button class="btn btn-sm" style="background:rgba(255,255,255,.2);color:#fff" onclick="go('buy')">🛒 Mua gói</button>
        </div>
      </div>
    </div>
    <div class="menu-tabs">
      <button class="\${tab==='wallet'?'active':''}" onclick="go('dashboard','wallet')">💰 Biến động số dư</button>
      <button class="\${tab==='deposits'?'active':''}" onclick="go('dashboard','deposits')">📥 Lịch sử nạp</button>
      <button class="\${tab==='orders'?'active':''}" onclick="go('dashboard','orders')">🛍️ Đơn hàng</button>
      <button class="\${tab==='profile'?'active':''}" onclick="go('dashboard','profile')">👤 Cá nhân</button>
    </div>
    <div id="dashBody"></div>
  </div>\`;
  const body=$('#dashBody');
  if(tab==='wallet') renderLedger(body, data.ledger||[]);
  else if(tab==='deposits') await renderDeposits(body);
  else if(tab==='orders') await renderOrders(body);
  else await renderProfile(body);
}
function renderLedger(el, rows){
  if(!rows.length){ el.innerHTML='<div class="card"><p class="sub" style="margin:0">Chưa có giao dịch nào.</p></div>'; return; }
  el.innerHTML='<div class="card table-wrap"><table class="table"><thead><tr><th>Thời gian</th><th>Loại</th><th>Số tiền</th><th>Số dư</th><th>Ghi chú</th></tr></thead><tbody>'+
    rows.map(r=>{
      const t = r.type==='deposit'?'Nạp tiền':r.type==='purchase'?'Mua hàng':'Điều chỉnh';
      const cls = r.amount>=0?'amt-pos':'amt-neg';
      return '<tr><td>'+dt(r.created_at)+'</td><td>'+t+'</td><td class="'+cls+'">'+(r.amount>=0?'+':'')+fmtN(r.amount)+'</td><td>'+fmtN(r.balance_after)+'</td><td>'+esc(r.note||'')+'</td></tr>';
    }).join('')+'</tbody></table></div>';
}
async function renderDeposits(el){
  const {data}=await api('/api/deposits');
  const rows=data.deposits||[];
  el.innerHTML = rows.length? '<div class="card table-wrap"><table class="table"><thead><tr><th>Thời gian</th><th>Mã</th><th>Số tiền</th><th>Trạng thái</th></tr></thead><tbody>'+
    rows.map(r=>'<tr><td>'+dt(r.created_at)+'</td><td><code>'+esc(r.code)+'</code></td><td>'+fmtN(r.amount)+'</td><td>'+statusTag(r.status)+'</td></tr>').join('')+'</tbody></table></div>'
    : '<div class="card"><p class="sub" style="margin:0 0 14px">Chưa có lần nạp nào.</p><button class="btn btn-gold" onclick="go(\\'deposit\\')">Nạp tiền ngay</button></div>';
}
async function renderOrders(el){
  const {data}=await api('/api/orders');
  const rows=data.orders||[];
  el.innerHTML = rows.length? '<div class="card table-wrap"><table class="table"><thead><tr><th>Mã</th><th>Sản phẩm</th><th>Giá</th><th>Trạng thái</th><th></th></tr></thead><tbody>'+
    rows.map(r=>'<tr><td>#'+r.id+'</td><td>'+esc(r.product_name)+'</td><td>'+fmtN(r.price)+'</td><td>'+statusTag(r.status)+'</td><td><button class="btn btn-sm btn-ghost" onclick="go(\\'success\\','+r.id+')">Xem</button></td></tr>').join('')+'</tbody></table></div>'
    : '<div class="card"><p class="sub" style="margin:0 0 14px">Bạn chưa có đơn hàng nào.</p><button class="btn btn-gold" onclick="go(\\'buy\\')">Mua ngay</button></div>';
}
async function renderProfile(el){
  el.innerHTML=\`<div class="card">
    <div class="field"><label>Email</label><input value="\${esc(ME.email)}" disabled></div>
    <form id="pf"><div class="field"><label>Họ tên</label><input name="name" value="\${esc(ME.name||'')}"></div>
    <button class="btn btn-gold">Lưu thay đổi</button></form>
    <hr class="div"><div style="font-size:13px;color:var(--brown-l)">Vai trò: <b>\${ME.role==='admin'?'Quản trị viên':'Khách hàng'}</b> · Tham gia: \${dt(ME.created_at)}</div>
  </div>\`;
  $('#pf').addEventListener('submit', async e=>{
    e.preventDefault();
    const b=Object.fromEntries(new FormData(e.target));
    const {data}=await post('/api/profile',b);
    if(data.ok){ ME.name=data.name; toast('Đã lưu'); } else toast('Lỗi',true);
  });
}
function statusTag(s){
  const m={pending:'Chờ xử lý',completed:'Hoàn tất',paid:'Đã thanh toán',cancelled:'Đã huỷ',processing:'Đang xử lý'};
  return '<span class="tag '+s+'">'+(m[s]||s)+'</span>';
}

/* ============ DEPOSIT (QR auto) ============ */
let pollTimer=null;
async function viewDeposit(app){
  clearInterval(pollTimer);
  app.innerHTML=\`<div class="wrap section" style="max-width:480px">
    <div class="card">
      <h2 style="text-align:center;margin-top:0">Nạp tiền vào ví</h2>
      <p class="sub">Quét QR ngân hàng — hệ thống tự động cộng tiền</p>
      <div id="depStep1">
        <div class="field"><label>Số tiền muốn nạp (VNĐ)</label>
          <input id="depAmount" type="number" inputmode="numeric" placeholder="VD: 49000" min="10000" step="1000"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
          \${[20000,49000,100000,200000,500000].map(a=>'<button class="btn btn-sm" onclick="document.getElementById(\\'depAmount\\').value='+a+'">'+fmtN(a)+'</button>').join('')}
        </div>
        <button class="btn btn-gold btn-block" id="depCreate">Tạo mã QR</button>
      </div>
      <div id="depStep2" class="hidden"></div>
    </div>
  </div>\`;
  $('#depCreate').addEventListener('click', createDepositFlow);
}
async function createDepositFlow(){
  const amount=parseInt($('#depAmount').value||'0',10);
  if(!amount||amount<10000){ toast('Số tiền tối thiểu 10.000đ',true); return; }
  const btn=$('#depCreate'); btn.disabled=true; btn.textContent='Đang tạo…';
  const {data}=await post('/api/deposit/create',{amount});
  btn.disabled=false; btn.textContent='Tạo mã QR';
  if(!data.ok){ toast(data.error||'Lỗi',true); return; }
  const d=data.deposit, bank=data.bank;
  $('#depStep1').classList.add('hidden');
  const s2=$('#depStep2'); s2.classList.remove('hidden');
  s2.innerHTML=\`
    <div class="qr-box">
      <img src="\${data.qr}" alt="QR" onerror="this.style.opacity=.3">
      <p style="font-size:13px;color:var(--brown-l);margin:10px 0">Mở app ngân hàng và quét mã để chuyển khoản</p>
    </div>
    <div class="kv"><span>Ngân hàng</span><b>\${esc(bank.bank_name)}</b></div>
    <div class="kv"><span>Số tài khoản</span><b>\${esc(bank.account_number)} <span class="copy" onclick="copy('\${esc(bank.account_number)}')">Sao chép</span></b></div>
    <div class="kv"><span>Chủ tài khoản</span><b>\${esc(bank.account_name)}</b></div>
    <div class="kv"><span>Số tiền</span><b>\${fmt(d.amount)}</b></div>
    <div class="kv"><span>Nội dung CK</span><b style="color:var(--gold-d)">\${esc(d.code)} <span class="copy" onclick="copy('\${esc(d.code)}')">Sao chép</span></b></div>
    <div style="background:#fff7e6;border:1px solid var(--gold);border-radius:12px;padding:12px;margin-top:14px;font-size:13px">
      ⚠️ Vui lòng chuyển <b>đúng số tiền</b> và <b>đúng nội dung</b> <code>\${esc(d.code)}</code> để hệ thống tự động cộng tiền.
    </div>
    <div style="text-align:center;margin-top:18px" id="pollArea">
      <span class="poll"><span class="spin"></span> Đang chờ thanh toán…</span>
    </div>
    <button class="btn btn-ghost btn-block" style="margin-top:14px" onclick="go('dashboard','deposits')">Tôi sẽ chuyển sau</button>
  \`;
  // Poll trạng thái
  let tries=0;
  pollTimer=setInterval(async()=>{
    tries++;
    const {data:st}=await api('/api/deposit/status?code='+encodeURIComponent(d.code));
    if(st.ok && st.deposit && st.deposit.status==='completed'){
      clearInterval(pollTimer);
      ME.balance=st.balance; renderNav();
      $('#pollArea').innerHTML='<div style="color:var(--ok);font-weight:800;font-size:18px">✅ Nạp tiền thành công!</div>';
      toast('Đã cộng '+fmt(d.amount)+' vào ví');
      setTimeout(()=>go('dashboard','wallet'),1600);
    }
    if(tries>300) clearInterval(pollTimer); // dừng sau ~15 phút
  }, 3000);
}

/* ============ BUY ============ */
async function viewBuy(app){
  const {data}=await api('/api/products');
  const products=data.products||[];
  app.innerHTML=\`<div class="wrap section">
    <h2 style="text-align:center">Chọn gói dịch vụ</h2>
    <p class="sub">Số dư ví: <b>\${fmt(ME?ME.balance:0)}</b> · <span class="copy" onclick="go('deposit')">Nạp thêm</span></p>
    <div class="grid cols-2">\${products.map(productCard).join('')}</div>
  </div>\`;
}
async function buyProduct(id){
  if(!ME){ go('auth','login'); return; }
  showModal(\`<h3 style="margin-top:0">Xác nhận mua hàng</h3><p>Bạn sẽ thanh toán bằng số dư ví. Tiếp tục?</p>
    <div style="display:flex;gap:10px;margin-top:16px">
      <button class="btn btn-ghost" style="flex:1" onclick="closeModal()">Huỷ</button>
      <button class="btn btn-gold" style="flex:1" id="confirmBuy">Xác nhận</button>
    </div>\`);
  $('#confirmBuy').addEventListener('click', async ()=>{
    const btn=$('#confirmBuy'); btn.disabled=true; btn.textContent='Đang xử lý…';
    const {status,data}=await post('/api/purchase',{product_id:id});
    if(data.ok){
      closeModal(); ME.balance=data.balance; renderNav();
      toast('Thanh toán thành công!');
      go('success', data.order.id);
    }else if(data.need_topup){
      closeModal();
      showModal(\`<h3 style="margin-top:0">Số dư không đủ</h3>
        <p>Cần <b>\${fmt(data.price)}</b> nhưng ví chỉ có <b>\${fmt(data.balance)}</b>.</p>
        <button class="btn btn-gold btn-block" onclick="closeModal();go('deposit')">💳 NẠP TIỀN NGAY</button>\`);
    }else{ btn.disabled=false; btn.textContent='Xác nhận'; toast(data.error||'Lỗi',true); }
  });
}

/* ============ SUCCESS / RECEIVE PRODUCT ============ */
async function viewSuccess(app,id){
  const {data}=await api('/api/order?id='+encodeURIComponent(id));
  if(!data.ok){ app.innerHTML='<div class="wrap section"><div class="card">Không tìm thấy đơn hàng.</div></div>'; return; }
  const o=data.order;
  app.innerHTML=\`<div class="wrap section" style="max-width:520px">
    <div class="card">
      <div class="success-hero">
        <div class="big">🎉</div>
        <h2>THANH TOÁN THÀNH CÔNG!</h2>
        <p class="sub" style="margin:0">Cảm ơn bạn đã mua hàng tại Locket Gold Capybara 💛</p>
      </div>
      <div class="kv"><span>Mã đơn hàng</span><b>#\${o.id}</b></div>
      <div class="kv"><span>Sản phẩm</span><b>\${esc(o.product_name)}</b></div>
      <div class="kv"><span>Thời hạn</span><b>\${esc(o.duration||'—')}</b></div>
      <div class="kv"><span>Trạng thái</span><b>\${statusTag(o.status)}</b></div>
      <hr class="div">
      <h3 style="margin:0 0 6px">📥 File cấu hình MobileConfig</h3>
      \${o.has_file
        ? \`<p style="font-size:13.5px;color:var(--brown-l);margin:0 0 14px">Tải file cấu hình về iPhone của bạn, sau đó vào <b>Cài đặt → Đã tải hồ sơ</b> để cài đặt.</p>
           <a class="btn btn-gold btn-block" href="\${o.download_url}" download>📥 TẢI FILE MOBILECONFIG</a>\`
        : \`<p style="font-size:13.5px;color:var(--brown-l)">Quản trị viên đang chuẩn bị file cấu hình. Vui lòng quay lại sau ít phút hoặc liên hệ hỗ trợ.</p>\`}
      <div style="background:#eef7f1;border-radius:12px;padding:12px;margin-top:14px;font-size:12.5px;color:#1c7a4f">
        🛡️ File cấu hình an toàn, không chứa chứng chỉ gây rủi ro bảo mật cho thiết bị.
      </div>
      <button class="btn btn-ghost btn-block" style="margin-top:14px" onclick="go('dashboard','orders')">Về đơn hàng của tôi</button>
    </div>
  </div>\`;
}

/* ============ ADMIN ============ */
async function viewAdmin(app,tab){
  if(!ME||ME.role!=='admin'){ app.innerHTML='<div class="wrap section"><div class="card">Không có quyền truy cập.</div></div>'; return; }
  tab=tab||'stats';
  app.innerHTML=\`<div class="wrap section">
    <h2 style="text-align:center;margin-top:0">🛠️ Quản trị hệ thống</h2>
    <div class="menu-tabs">
      <button class="\${tab==='stats'?'active':''}" onclick="go('admin','stats')">📊 Tổng quan</button>
      <button class="\${tab==='users'?'active':''}" onclick="go('admin','users')">👥 Người dùng</button>
      <button class="\${tab==='deposits'?'active':''}" onclick="go('admin','deposits')">📥 Nạp tiền</button>
      <button class="\${tab==='orders'?'active':''}" onclick="go('admin','orders')">🛍️ Đơn hàng</button>
      <button class="\${tab==='products'?'active':''}" onclick="go('admin','products')">📦 Sản phẩm</button>
      <button class="\${tab==='bank'?'active':''}" onclick="go('admin','bank')">🏦 Ngân hàng/QR</button>
      <button class="\${tab==='file'?'active':''}" onclick="go('admin','file')">📄 MobileConfig</button>
    </div>
    <div id="adminBody"><div class="loading">Đang tải…</div></div>
  </div>\`;
  const b=$('#adminBody');
  const map={stats:adminStats,users:adminUsers,deposits:adminDeposits,orders:adminOrders,products:adminProducts,bank:adminBank,file:adminFile};
  await (map[tab]||adminStats)(b);
}
async function adminStats(b){
  const {data}=await api('/api/admin/stats');
  if(!data.ok){ b.innerHTML='Lỗi'; return; }
  const max=Math.max(1,...data.daily.map(d=>d.total));
  b.innerHTML=\`
    <div class="grid cols-3" style="margin-bottom:16px">
      <div class="stat"><div class="v">\${fmtN(data.revenue)}</div><div class="l">Tổng doanh thu (đ)</div></div>
      <div class="stat"><div class="v">\${fmtN(data.users)}</div><div class="l">Người dùng</div></div>
      <div class="stat"><div class="v">\${fmtN(data.orders)}</div><div class="l">Đơn hàng</div></div>
    </div>
    <div class="grid cols-3" style="margin-bottom:16px">
      <div class="stat"><div class="v">\${fmtN(data.today)}</div><div class="l">Hôm nay</div></div>
      <div class="stat"><div class="v">\${fmtN(data.week)}</div><div class="l">7 ngày</div></div>
      <div class="stat"><div class="v">\${fmtN(data.month)}</div><div class="l">30 ngày</div></div>
    </div>
    <div class="card">
      <h3 style="margin:0 0 14px">Doanh thu theo ngày</h3>
      <div style="display:flex;align-items:flex-end;gap:6px;height:160px">
        \${data.daily.map(d=>{
          const h=Math.round(d.total/max*140)+4;
          return '<div style="flex:1;text-align:center"><div title="'+fmtN(d.total)+'đ" style="height:'+h+'px;background:linear-gradient(180deg,var(--gold),var(--gold-d));border-radius:6px 6px 0 0"></div><div style="font-size:9px;color:var(--brown-l);margin-top:4px;transform:rotate(-45deg);white-space:nowrap">'+(d.d||'').slice(5)+'</div></div>';
        }).join('')||'<p class="sub">Chưa có dữ liệu</p>'}
      </div>
    </div>\`;
}
async function adminUsers(b){
  const {data}=await api('/api/admin/users');
  const rows=data.users||[];
  b.innerHTML=\`<div class="card">
    <div class="field"><input id="uq" placeholder="Tìm theo email / tên…" oninput="adminUserSearch(this.value)"></div>
    <div class="table-wrap" id="userTable">\${userTable(rows)}</div></div>\`;
}
function userTable(rows){
  return '<table class="table"><thead><tr><th>ID</th><th>Email</th><th>Tên</th><th>Vai trò</th><th>Số dư</th><th></th></tr></thead><tbody>'+
    rows.map(u=>'<tr><td>'+u.id+'</td><td>'+esc(u.email)+'</td><td>'+esc(u.name||'')+'</td><td>'+(u.role==='admin'?'<b>Admin</b>':'User')+'</td><td>'+fmtN(u.balance)+'</td>'+
      '<td><button class="btn btn-sm btn-ghost" onclick="adjustBalance('+u.id+',\\''+esc(u.email)+'\\','+u.balance+')">± Số dư</button></td></tr>').join('')+'</tbody></table>';
}
let _uqTimer=null;
function adminUserSearch(q){ clearTimeout(_uqTimer); _uqTimer=setTimeout(async()=>{
  const {data}=await api('/api/admin/users?q='+encodeURIComponent(q));
  $('#userTable').innerHTML=userTable(data.users||[]);
},300); }
function adjustBalance(id,email,cur){
  showModal(\`<h3 style="margin-top:0">Điều chỉnh số dư</h3><p style="font-size:13px;color:var(--brown-l)">\${esc(email)} · hiện tại <b>\${fmt(cur)}</b></p>
    <div class="field"><label>Số tiền (+ cộng / - trừ)</label><input id="adjAmt" type="number" placeholder="VD: 50000 hoặc -20000"></div>
    <div class="field"><label>Ghi chú</label><input id="adjNote" placeholder="Lý do"></div>
    <div style="display:flex;gap:10px"><button class="btn btn-ghost" style="flex:1" onclick="closeModal()">Huỷ</button>
    <button class="btn btn-gold" style="flex:1" id="adjGo">Cập nhật</button></div>\`);
  $('#adjGo').addEventListener('click', async()=>{
    const amount=parseInt($('#adjAmt').value||'0',10);
    const note=$('#adjNote').value;
    const {data}=await post('/api/admin/user/balance',{user_id:id,amount,note});
    if(data.ok){ closeModal(); toast('Đã cập nhật'); go('admin','users'); } else toast(data.error||'Lỗi',true);
  });
}
async function adminDeposits(b){
  const {data}=await api('/api/admin/deposits');
  const rows=data.deposits||[];
  b.innerHTML='<div class="card table-wrap"><table class="table"><thead><tr><th>Thời gian</th><th>Email</th><th>Mã</th><th>Số tiền</th><th>Trạng thái</th><th>Ref</th></tr></thead><tbody>'+
    rows.map(r=>'<tr><td>'+dt(r.created_at)+'</td><td>'+esc(r.email)+'</td><td><code>'+esc(r.code)+'</code></td><td>'+fmtN(r.amount)+'</td><td>'+statusTag(r.status)+'</td><td style="font-size:11px">'+esc(r.provider_ref||'')+'</td></tr>').join('')+'</tbody></table></div>';
}
async function adminOrders(b){
  const {data}=await api('/api/admin/orders');
  const rows=data.orders||[];
  b.innerHTML='<div class="card table-wrap"><table class="table"><thead><tr><th>ID</th><th>Email</th><th>Sản phẩm</th><th>Giá</th><th>Trạng thái</th></tr></thead><tbody>'+
    rows.map(r=>'<tr><td>#'+r.id+'</td><td>'+esc(r.email)+'</td><td>'+esc(r.product_name)+'</td><td>'+fmtN(r.price)+'</td><td><select onchange="setOrderStatus('+r.id+',this.value)" style="padding:5px;border-radius:8px;border:1px solid #ddd">'+
      ['paid','processing','completed','cancelled'].map(s=>'<option value="'+s+'"'+(r.status===s?' selected':'')+'>'+s+'</option>').join('')+'</select></td></tr>').join('')+'</tbody></table></div>';
}
async function setOrderStatus(id,status){ const {data}=await post('/api/admin/order/status',{id,status}); toast(data.ok?'Đã cập nhật':'Lỗi',!data.ok); }
async function adminProducts(b){
  const {data}=await api('/api/admin/products');
  const rows=data.products||[];
  b.innerHTML=\`<div style="text-align:right;margin-bottom:12px"><button class="btn btn-gold btn-sm" onclick="editProduct()">＋ Thêm sản phẩm</button></div>
    <div class="grid cols-2">\${rows.map(p=>\`<div class="card"><div style="display:flex;justify-content:space-between"><h3 style="margin:0">\${esc(p.name)}</h3>\${p.active?'<span class="tag completed">Hiện</span>':'<span class="tag cancelled">Ẩn</span>'}</div>
      <div class="price" style="font-size:24px">\${fmtN(p.price)}<small> VNĐ</small></div>
      <div style="font-size:12px;color:var(--brown-l)">Thời hạn: \${esc(p.duration||'—')} · \${(p.features||[]).length} tính năng</div>
      <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-sm btn-ghost" style="flex:1" onclick='editProduct(\${JSON.stringify(p)})'>Sửa</button>
      <button class="btn btn-sm" style="flex:1;background:#fbe2e1;color:#b23b37" onclick="delProduct(\${p.id})">Ẩn</button></div></div>\`).join('')}</div>\`;
}
function editProduct(p){
  p=p||{id:0,name:'',price:0,duration:'',features:[],active:1};
  showModal(\`<h3 style="margin-top:0">\${p.id?'Sửa':'Thêm'} sản phẩm</h3>
    <div class="field"><label>Tên</label><input id="pName" value="\${esc(p.name)}"></div>
    <div class="field"><label>Giá (VNĐ)</label><input id="pPrice" type="number" value="\${p.price}"></div>
    <div class="field"><label>Thời hạn</label><input id="pDur" value="\${esc(p.duration||'')}" placeholder="VD: 2 tháng"></div>
    <div class="field"><label>Tính năng (mỗi dòng 1 mục)</label><textarea id="pFeat" rows="5">\${esc((p.features||[]).join('\\n'))}</textarea></div>
    <div class="field"><label><input type="checkbox" id="pActive" \${p.active?'checked':''}> Hiển thị sản phẩm</label></div>
    <div style="display:flex;gap:10px"><button class="btn btn-ghost" style="flex:1" onclick="closeModal()">Huỷ</button>
    <button class="btn btn-gold" style="flex:1" id="pSave">Lưu</button></div>\`);
  $('#pSave').addEventListener('click', async()=>{
    const body={id:p.id,name:$('#pName').value,price:parseInt($('#pPrice').value||'0',10),duration:$('#pDur').value,
      features:$('#pFeat').value, active:$('#pActive').checked};
    const {data}=await post('/api/admin/product/save',body);
    if(data.ok){ closeModal(); toast('Đã lưu'); go('admin','products'); } else toast(data.error||'Lỗi',true);
  });
}
async function delProduct(id){ if(!confirm('Ẩn sản phẩm này?'))return; const {data}=await post('/api/admin/product/delete',{id}); if(data.ok){toast('Đã ẩn');go('admin','products');} }
async function adminBank(b){
  const {data}=await api('/api/admin/bank');
  const k=data.bank||{};
  b.innerHTML=\`<div class="card">
    <h3 style="margin:0 0 6px">Thông tin ngân hàng nhận tiền</h3>
    <p style="font-size:13px;color:var(--brown-l)">Mã QR tự động tạo từ thông tin này (VietQR). BIN là mã ngân hàng theo chuẩn Napas.</p>
    <div class="field"><label>Mã BIN ngân hàng</label><input id="bBin" value="\${esc(k.bank_bin||'')}" placeholder="VD: 970422 (MB), 970436 (VCB)"></div>
    <div class="field"><label>Tên ngân hàng</label><input id="bName" value="\${esc(k.bank_name||'')}"></div>
    <div class="field"><label>Số tài khoản</label><input id="bAcc" value="\${esc(k.account_number||'')}"></div>
    <div class="field"><label>Tên chủ tài khoản</label><input id="bHolder" value="\${esc(k.account_name||'')}"></div>
    <button class="btn btn-gold" id="bSave">Lưu & xem thử QR</button>
    <div id="qrPreview" style="text-align:center;margin-top:16px"></div>
  </div>\`;
  $('#bSave').addEventListener('click', async()=>{
    const body={bank_bin:$('#bBin').value.trim(),bank_name:$('#bName').value.trim(),account_number:$('#bAcc').value.trim(),account_name:$('#bHolder').value.trim()};
    const {data}=await post('/api/admin/bank/save',body);
    if(data.ok){ toast('Đã lưu');
      const url='https://img.vietqr.io/image/'+body.bank_bin+'-'+body.account_number+'-compact2.png?amount=49000&addInfo=DEMO&accountName='+encodeURIComponent(body.account_name);
      $('#qrPreview').innerHTML='<img src="'+url+'" style="width:200px;border-radius:12px" alt="QR demo"><p style="font-size:12px;color:var(--brown-l)">Xem thử QR (49.000đ)</p>';
    } else toast(data.error||'Lỗi',true);
  });
}
async function adminFile(b){
  const {data}=await api('/api/admin/mobileconfig');
  b.innerHTML=\`<div class="card">
    <h3 style="margin:0 0 6px">File cấu hình MobileConfig</h3>
    <p style="font-size:13px;color:var(--brown-l)">Tải lên file <code>.mobileconfig</code>. File này sẽ được phân phối cho khách đã thanh toán. Có thể thay thế bất cứ lúc nào.</p>
    <div style="background:\${data.has_file?'#eef7f1':'#fff3d6'};border-radius:12px;padding:12px;margin-bottom:14px;font-size:13px">
      \${data.has_file?('✅ Đang có file: <b>'+esc(data.name)+'</b> ('+fmtN(data.size)+' bytes) · Cập nhật: '+dt(data.updated)):'⚠️ Chưa có file nào được tải lên.'}
    </div>
    <div class="field"><label>Chọn file .mobileconfig</label><input type="file" id="mcFile" accept=".mobileconfig,.xml,.plist"></div>
    <button class="btn btn-gold btn-block" id="mcUpload" disabled>Tải lên / Thay thế</button>
    <div style="font-size:12px;color:var(--brown-l);margin-top:10px">⚠️ Chỉ tải file cấu hình hợp lệ (plist XML), tối đa 512KB. Không chứa chứng chỉ gây rủi ro bảo mật.</div>
  </div>\`;
  const file=$('#mcFile'), btn=$('#mcUpload'); let b64='',fname='';
  file.addEventListener('change', ()=>{
    const f=file.files[0]; if(!f){btn.disabled=true;return;}
    fname=f.name; const r=new FileReader();
    r.onload=()=>{ b64=r.result.split('base64,')[1]||''; btn.disabled=!b64; };
    r.readAsDataURL(f);
  });
  btn.addEventListener('click', async()=>{
    btn.disabled=true; btn.textContent='Đang tải…';
    const {data:res}=await post('/api/admin/mobileconfig/upload',{content_b64:b64,name:fname});
    btn.textContent='Tải lên / Thay thế';
    if(res.ok){ toast('Đã tải lên file'); go('admin','file'); } else { btn.disabled=false; toast(res.error||'Lỗi',true); }
  });
}

/* ============ MODAL / UTIL ============ */
function showModal(html){ $('#modalRoot').innerHTML='<div class="modal" onclick="if(event.target===this)closeModal()"><div class="card">'+html+'</div></div>'; }
function closeModal(){ $('#modalRoot').innerHTML=''; }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ============ INIT ============ */
(async function(){ await loadMe(); if(!location.hash) location.hash='home'; route(); })();
</script>
</body>
</html>`;
