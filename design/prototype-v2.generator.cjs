// Prototype v2 — NHM museum layout × Noctis Aurum "Obsidian & Champagne", real data, real motion.
const fs = require('fs');
const path = require('path');
const { eps, ms } = JSON.parse(fs.readFileSync(path.join(__dirname, 'data2.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const CAT = { theory: '理论', algorithm: '算法', breakthrough: '突破', industry: '产业', hardware: '硬件', model: '模型', policy: '政策', winter: '寒冬', debate: '论战', geopolitics: '地缘', compute: '算力' };
const cats = [...new Set(ms.map((m) => m.cat))];
const yearNum = (y) => parseFloat(y);
const Y0 = 1943, Y1 = 2026.75;

// Logotype: "A", "I", then a timeline bar whose ticks are the real milestones.
const logoPolys = [];
logoPolys.push(['translate(0,0)', ['0,100 70,0 90,0 20,100', '70,0 90,0 160,100 140,100', '42,62 118,62 124,74 36,74']]);
logoPolys.push(['translate(200,0)', ['0,0 16,0 16,100 0,100']]);
const bar = [];
bar.push('250,90 840,90 840,100 250,100');
ms.forEach((m) => {
  const x = 250 + ((yearNum(m.year) - Y0) / (Y1 - Y0)) * 586;
  const h = m.cat === 'breakthrough' ? 62 : m.cat === 'theory' ? 44 : 30;
  bar.push(`${x.toFixed(1)},${90 - h} ${(x + 3).toFixed(1)},${90 - h} ${(x + 3).toFixed(1)},90 ${x.toFixed(1)},90`);
});
logoPolys.push(['translate(0,0)', bar]);
let pi = 0;
const logoSvg = logoPolys.map(([t, ps]) => `<g transform="${t}">${ps.map((p) => `<polygon class="lp" style="--i:${pi++}" points="${p}"/>`).join('')}</g>`).join('');

// Specimens: one line drawing per epoch, champagne on obsidian.
const G = 'fill="none" stroke="#C9A86A" stroke-width="1.2"';
const spec = [
  // 0 McCulloch-Pitts neuron
  `<g ${G}><circle cx="110" cy="100" r="26"/><text x="103" y="106" fill="#C9A86A" stroke="none" font-family="Cormorant Garamond" font-size="20">θ</text>${[40, 70, 100, 130, 160].map((y) => `<line x1="20" y1="${y}" x2="86" y2="${100 + (y - 100) * 0.25}"/><circle cx="20" cy="${y}" r="3"/>`).join('')}<line x1="136" y1="100" x2="186" y2="100"/><polyline points="178,94 186,100 178,106"/></g>`,
  // 1 search tree
  `<g ${G}>${(() => { let o = '<circle cx="100" cy="30" r="5"/>'; const l1 = [50, 100, 150]; l1.forEach((x) => { o += `<line x1="100" y1="35" x2="${x}" y2="85"/><circle cx="${x}" cy="90" r="5"/>`; [-18, 0, 18].forEach((d) => { o += `<line x1="${x}" y1="95" x2="${x + d}" y2="145"/><circle cx="${x + d}" cy="150" r="3"/>`; }); }); return o; })()}</g>`,
  // 2 multilayer network
  `<g ${G}>${(() => { const L = [[40, [50, 90, 130, 170]], [100, [40, 80, 120, 160]], [160, [70, 130]]]; let o = ''; for (let i = 0; i < L.length - 1; i++) L[i][1].forEach((a) => L[i + 1][1].forEach((b) => { o += `<line x1="${L[i][0]}" y1="${a}" x2="${L[i + 1][0]}" y2="${b}" stroke-opacity=".45"/>`; })); L.forEach(([x, ys]) => ys.forEach((y) => { o += `<circle cx="${x}" cy="${y}" r="6" fill="#0C0A09"/>`; })); return o; })()}</g>`,
  // 3 SVM margin
  `<g ${G}><line x1="30" y1="170" x2="170" y2="30"/><line x1="10" y1="150" x2="150" y2="10" stroke-dasharray="4 5"/><line x1="50" y1="190" x2="190" y2="50" stroke-dasharray="4 5"/>${[[40, 60], [60, 40], [70, 80], [45, 100], [90, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5"/>`).join('')}${[[130, 150], [150, 120], [110, 170], [160, 160], [140, 100]].map(([x, y]) => `<path d="M${x - 5} ${y - 5}L${x + 5} ${y + 5}M${x + 5} ${y - 5}L${x - 5} ${y + 5}"/>`).join('')}</g>`,
  // 4 convolution stacks
  `<g ${G}>${[0, 1, 2, 3].map((i) => `<rect x="${30 + i * 32}" y="${40 + i * 14}" width="${90 - i * 16}" height="${90 - i * 16}" transform="skewY(-12)" fill="#0C0A09"/>`).join('')}<rect x="44" y="62" width="18" height="18" transform="skewY(-12)" stroke-opacity=".6"/></g>`,
  // 5 attention matrix
  `<g>${(() => { let o = ''; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const v = Math.max(0.06, Math.exp(-Math.abs(r - c) / 1.6) * (0.4 + 0.6 * ((r * 7 + c * 3) % 5) / 4)); o += `<rect x="${36 + c * 16}" y="${36 + r * 16}" width="14" height="14" fill="#C9A86A" fill-opacity="${v.toFixed(2)}"/>`; } return o; })()}</g>`,
  // 6 agent loop
  `<g ${G}><circle cx="100" cy="100" r="60" stroke-dasharray="3 6"/><circle cx="100" cy="100" r="14" fill="#0C0A09"/>${['计划', '行动', '观察', '反思'].map((t, i) => { const a = -Math.PI / 2 + (i * Math.PI) / 2; const x = 100 + 60 * Math.cos(a), y = 100 + 60 * Math.sin(a); return `<circle cx="${x}" cy="${y}" r="7" fill="#0C0A09"/><text x="${x + (Math.cos(a) >= 0 ? 12 : -38)}" y="${y + 4}" fill="#A8A29E" stroke="none" font-size="11" font-family="Noto Serif SC">${t}</text>`; }).join('')}</g>`,
];

const epochList = eps.map((e, i) => `
        <button class="ch${i === 2 ? ' on' : ''}" data-i="${i}">
          <span class="ch-no">${String(i + 1).padStart(2, '0')}</span>
          <span class="ch-name">${esc(e.title.split('：')[0])}</span>
          <span class="ch-era">${esc(e.era.replace(/\s/g, ''))}</span>
          <span class="ch-arrow">↗</span>
        </button>`).join('');

const cards = ms.map((m, i) => `
      <a class="card rv" style="--d:${(i % 3) * 80}ms" data-cat="${m.cat}" href="/milestone/${m.slug}/">
        <span class="c-top"><span class="c-yr">${esc(m.year)}</span><span class="c-cat">${CAT[m.cat] || m.cat}</span></span>
        <span class="c-t">${esc(m.title)}</span>
        <span class="c-s">${esc(m.summary)}</span>
        <span class="c-more">查看藏品 <b>→</b></span>
      </a>`).join('');

const marquee = ms.map((m) => `<span>${esc(m.title.replace(/（.*?）/g, ''))}</span><i>◆</i>`).join('');
const current = ms.find((m) => m.slug === 'attention-is-all-you-need');

const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AI 编年史 · 原型 v2</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Noto+Serif+SC:wght@400;500;600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{--ob:#0C0A09;--ob2:#14110F;--pearl:#F4F1EA;--mist:#FBFAF6;--ink:#13161C;--stone:#6B6E76;--gold:#C9A86A;--gold2:#E3C892;
--display:"Cormorant Garamond","Noto Serif SC",serif;--serif:"Noto Serif SC","Songti SC",serif;--sans:Inter,"PingFang SC","Microsoft YaHei",sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace;--ease:cubic-bezier(.16,1,.3,1)}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--ob);color:var(--pearl);font:15px/1.7 var(--sans);-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:inherit;text-decoration:none} button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
::selection{background:var(--gold);color:var(--ob)}
.mono{font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;text-transform:uppercase}

/* ---------- 01 HERO ---------- */
.hero{position:relative;min-height:100vh;display:flex;flex-direction:column;overflow:hidden}
#net{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity 1.4s ease-out}
#net.show{opacity:1}
.hero::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 80% at 70% 40%,transparent 0,var(--ob) 75%);pointer-events:none}
.hd{position:relative;z-index:3;padding:24px 64px 0}
.logo{width:100%;display:block;overflow:visible}
.lp{fill:var(--pearl);transform:translateY(120px);opacity:0;animation:rise 1.2s var(--ease) forwards;animation-delay:calc(100ms + var(--i) * 28ms)}
.lp:nth-child(n+2){fill:var(--pearl)} g:last-child .lp{fill:var(--gold)} g:last-child .lp:first-child{fill:var(--pearl)}
@keyframes rise{to{transform:none;opacity:1}}
.sub{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-top:32px;color:#A8A29E}
.sub .c1{width:16%} .sub .c2{width:32%;color:#D6D3D1;line-height:1.8} .sub .ar{width:5%;text-align:center;color:#57534E}
.sub ul{list-style:none;width:15%} .sub li a{display:inline-block;padding:2px 0;transition:color .3s} .sub li a:hover{color:var(--gold2)}
.fade{opacity:0;transform:translateY(20px);animation:fu .8s ease-out forwards;animation-delay:var(--d,0ms)}
@keyframes fu{to{opacity:1;transform:none}}
.body{position:relative;z-index:3;flex:1;display:flex;justify-content:space-between;align-items:flex-start;padding:0 64px}
.left{margin-top:64px;max-width:420px}
.ind{display:flex;align-items:center;gap:16px;color:var(--gold)} .ind i{display:block;height:1px;width:64px;background:var(--gold);opacity:.6}
h1{font:500 88px/1 var(--serif);letter-spacing:-.01em;margin-top:24px}
h1 em,#h1 em{font-style:normal;color:var(--gold)}
.desc{margin-top:24px;max-width:300px;font-size:14px;color:#A8A29E;line-height:1.8}
.btn{position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:12px;margin-top:40px;padding:15px 26px;border:1px solid var(--gold);border-radius:6px;background:var(--gold);color:var(--ob);font-size:15px;font-weight:500;transition:transform .3s,box-shadow .3s}
.btn::before{content:"";position:absolute;inset:0;background:var(--ob);transform:translateX(-101%);transition:transform .7s var(--ease)}
.btn span{position:relative;transition:color .5s} .btn:hover::before{transform:none} .btn:hover span{color:var(--gold2)}
.btn:hover{transform:translateY(-1px);box-shadow:3px 3px 0 rgba(201,168,106,.35)}
.btn .gl{display:inline-block;transition:transform .5s} .btn:hover .gl{transform:translateX(4px) rotate(-12deg)}
.right{margin-top:96px;width:220px;display:flex;flex-direction:column;gap:40px}
.right h3{font:600 10.5px var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}
.right p{margin-top:8px;font-size:12.5px;color:#A8A29E;line-height:1.7}
.stats{display:flex;gap:36px} .stats .v{margin-top:4px;font:500 14px var(--mono);color:var(--pearl)}
.plus{display:flex;align-items:center;gap:16px} .plus b{width:40px;height:40px;border-radius:50%;border:1px solid #57534E;display:grid;place-items:center;font-weight:300;font-size:18px;transition:all .3s}
.plus:hover b{background:var(--gold);border-color:var(--gold);color:var(--ob)}
.scroll{position:absolute;z-index:3;left:64px;bottom:40px;display:flex;align-items:center;gap:16px;color:#78716C}
.scroll b{width:48px;height:48px;border-radius:50%;border:1px solid #44403C;display:flex;align-items:center;justify-content:center;gap:4px}
.scroll b i{display:block;width:1px;height:12px;background:#A8A29E}
.burger{display:none}

/* ---------- 02 EXPLORE (pearl) ---------- */
.explore{position:relative;background:var(--pearl);color:var(--ink);padding:128px 24px 0;display:flex;flex-direction:column;align-items:center;text-align:center}
.lbl{color:var(--stone)} .lbl b{color:var(--ink);font-weight:600}
.big{margin-top:48px;max-width:1040px;font:500 60px/1.18 var(--serif);letter-spacing:-.01em}
.big em{font-style:normal;color:#9A7B43}
.pills{margin-top:48px;display:flex;flex-wrap:wrap;justify-content:center;gap:12px}
.pill{border:1px solid #C9C3B6;border-radius:999px;padding:10px 20px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;transition:all .3s;background:rgba(255,255,255,.5)}
.pill:hover,.pill.on{background:var(--ink);border-color:var(--ink);color:var(--pearl)}
.count{margin-top:80px;width:100%;max-width:1040px;display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #D9D3C7}
.count div{padding:28px 0;text-align:left;border-right:1px solid #D9D3C7;padding-left:24px} .count div:last-child{border-right:0}
.count b{display:block;font:500 56px/1 var(--display);color:var(--ink)} .count span{display:block;margin-top:8px;color:var(--stone)}
.spacer{height:260px}
.foot2{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;padding:0 64px 40px;color:var(--stone)}

/* ---------- 03 COLLECTION (obsidian) ---------- */
.col{position:relative;background:var(--ob)}
.col-h{display:flex;justify-content:space-between;gap:48px;padding:160px 64px 64px}
.col-h h2{max-width:820px;font:500 56px/1.15 var(--serif)}
.col-h h2 .ic{display:inline-flex;gap:12px;vertical-align:middle;margin:0 12px;transform:translateY(-6px)}
.col-h h2 .ic b{width:52px;height:52px;border-radius:50%;border:1px solid #44403C;display:grid;place-items:center;font:400 20px var(--display);color:#A8A29E;transition:all .3s}
.col-h h2 .ic b:hover{background:var(--pearl);color:var(--ob);border-color:var(--pearl)}
.col-h .tag{text-align:right;color:#78716C;line-height:2}
.col-h .tp{margin-top:20px;display:flex;gap:10px;justify-content:flex-end}
.col-h .tp span{border:1px solid #44403C;border-radius:999px;padding:8px 16px;color:#D6D3D1;transition:all .3s} .col-h .tp span:hover{background:var(--pearl);color:var(--ob)}
.panel{display:flex;border-top:1px solid #292524;border-bottom:1px solid #292524}
.viewer{position:relative;width:35%;min-height:560px;border-right:1px solid #292524;padding:32px;display:flex;flex-direction:column;justify-content:space-between}
.viewer .stars{letter-spacing:.3em;color:#57534E}
.stage{position:absolute;inset:0;display:grid;place-items:center}
.stage svg{width:72%;height:72%}
.ctr{position:relative;display:flex;align-items:center;gap:8px;color:#78716C}
.roll{position:relative;display:inline-block;height:14px;width:20px;overflow:hidden}
.roll span{position:absolute;inset:0;line-height:14px;transition:transform .4s var(--ease)}
.list{width:65%}
.list-top{display:flex;justify-content:space-between;padding:28px 32px;border-bottom:1px solid #292524;color:#78716C}
.ch{width:100%;display:grid;grid-template-columns:56px 1fr auto 40px;align-items:center;gap:16px;padding:26px 32px;border-bottom:1px solid rgba(41,37,36,.8);text-align:left;color:#57534E;transition:color .3s;position:relative}
.ch::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--gold);transform:scaleY(0);transition:transform .5s var(--ease)}
.ch:hover{color:#A8A29E} .ch.on{color:var(--pearl)} .ch.on::before{transform:scaleY(1)}
.ch-no{font:12px var(--mono)} .ch-name{font:500 28px/1.3 var(--serif)} .ch-era{font:12px var(--mono)}
.ch-arrow{font-size:22px;color:var(--gold);opacity:0;transform:scale(.6);transition:all .3s} .ch.on .ch-arrow{opacity:1;transform:none}
.ch-bar{position:absolute;left:0;bottom:-1px;height:1px;background:var(--gold);width:0}
.ch.on .ch-bar{animation:prog 3.5s linear forwards}
@keyframes prog{to{width:100%}}
.col-sum{padding:28px 32px;color:#A8A29E;font-size:14px;line-height:1.9;min-height:120px;border-bottom:1px solid #292524}

/* ---------- 04 MARQUEE ---------- */
.mq{overflow:hidden;border-bottom:1px solid #292524;background:var(--ob2);padding:22px 0;-webkit-mask:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.mq-t{display:flex;gap:28px;white-space:nowrap;width:max-content;animation:mq 90s linear infinite;font:500 22px var(--serif);color:#D6D3D1}
.mq-t i{font-style:normal;color:var(--gold);font-size:12px;align-self:center}
.mq:hover .mq-t{animation-play-state:paused}
@keyframes mq{to{transform:translateX(-50%)}}

/* ---------- 05 ARCHIVE GRID (pearl) ---------- */
.arch{background:var(--mist);color:var(--ink);padding:120px 64px}
.arch-h{display:flex;justify-content:space-between;align-items:flex-end;gap:32px;flex-wrap:wrap}
.arch-h h2{font:500 48px/1.15 var(--serif)} .arch-h .eb{display:flex;align-items:center;gap:14px;color:#9A7B43;margin-bottom:16px} .arch-h .eb i{width:48px;height:1px;background:#9A7B43}
.grid{margin-top:56px;display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#DED8CB;border:1px solid #DED8CB}
.card{background:var(--mist);padding:28px;display:flex;flex-direction:column;gap:12px;min-height:260px;transition:background .4s}
.card:hover{background:#fff}
.c-top{display:flex;justify-content:space-between;align-items:baseline} .c-yr{font:500 40px/1 var(--display);color:var(--ink)} .c-cat{font:10.5px var(--mono);letter-spacing:.2em;color:var(--stone)}
.c-t{font:600 18px/1.5 var(--serif)} .c-s{font-size:13.5px;line-height:1.8;color:#57534E;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.c-more{margin-top:auto;font-size:12px;letter-spacing:.1em;color:#9A7B43} .c-more b{display:inline-block;transition:transform .3s} .card:hover .c-more b{transform:translateX(6px)}
.card.hide{display:none}

footer{position:relative;overflow:hidden;padding:80px 64px 40px;color:#78716C}
footer .wm{position:absolute;left:40px;bottom:-40px;font:600 220px/1 var(--display);color:rgba(245,241,234,.035);pointer-events:none;white-space:nowrap}
footer .row{position:relative;display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap}
footer a:hover{color:var(--gold2)}

/* ---------- reveals ---------- */
.rv{opacity:0;transform:translateY(32px);transition:opacity .9s var(--ease),transform .9s var(--ease),background .4s;transition-delay:var(--d,0ms)}
.rv.in{opacity:1;transform:none}

@media (max-height:820px) and (min-width:901px){.scroll{display:none}}
@media (max-width:900px){
 .hd{padding:20px 20px 0} .sub .c2,.sub .ar,.sub ul{display:none} .sub .c1{width:auto}
 .burger{display:flex;flex-direction:column;gap:6px;padding:8px 0 8px 16px} .burger i{display:block;width:30px;height:1.5px;background:var(--pearl)}
 .body{padding:0 20px;flex-direction:column} .left{margin-top:64px} h1{font-size:56px} .right{margin-top:48px;width:100%}
 .scroll{display:none}
 .big{font-size:34px} .count{grid-template-columns:repeat(2,1fr)} .count div:nth-child(2){border-right:0} .count div{border-bottom:1px solid #D9D3C7} .count b{font-size:44px}
 .spacer{height:120px} .foot2{display:none}
 .col-h{flex-direction:column;padding:96px 20px 40px} .col-h h2{font-size:32px} .col-h .tag,.col-h .tp{text-align:left;justify-content:flex-start}
 .col-h h2 .ic{display:none}
 .panel{flex-direction:column} .viewer{width:100%;min-height:340px;border-right:0;border-bottom:1px solid #292524} .list{width:100%}
 .ch{grid-template-columns:36px 1fr 28px;padding:20px} .ch-era{display:none} .ch-name{font-size:20px} .list-top{padding:20px}
 .arch{padding:80px 20px} .arch-h h2{font-size:32px} .grid{grid-template-columns:1fr}
 footer{padding:64px 20px 32px} footer .wm{font-size:120px}
}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.lp,.fade,.rv{opacity:1;transform:none}}
</style></head><body>

<svg width="0" height="0" style="position:absolute"><filter id="sand" x="-20%" y="-20%" width="140%" height="140%">
<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n"/>
<feDisplacementMap id="disp" in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></svg>

<!-- 01 -->
<section class="hero">
  <canvas id="net"></canvas>
  <header class="hd">
    <h1 class="sr" style="position:absolute;left:-9999px">AI 编年史</h1>
    <svg class="logo" viewBox="0 0 840 100" aria-hidden="true">${logoSvg}</svg>
    <div class="sub mono">
      <div class="c1 fade" style="--d:300ms">Artificial<br>Intelligence<br>Chronicle</div>
      <div class="ar fade" style="--d:400ms">→</div>
      <div class="c2 fade" style="--d:500ms">从一个神经元的数学模型，<br>到会自己做研究的智能体——<br>八十三年的思想、算法与机器。</div>
      <div class="ar fade" style="--d:600ms">→</div>
      <ul class="fade" style="--d:700ms"><li><a href="#">时间线</a></li><li><a href="#">长卷</a></li><li><a href="#">缩放律实验室</a></li><li><a href="#">工具</a></li><li><a href="#">赞助</a></li></ul>
      <button class="burger" aria-label="菜单"><i></i><i></i></button>
    </div>
  </header>
  <div class="body">
    <div class="left">
      <div class="ind mono fade" style="--d:700ms"><span>01</span><i></i></div>
      <h2 class="fade" style="--d:850ms;font:500 88px/1 var(--serif);margin-top:24px" id="h1">八十年<br><em>智能史</em></h2>
      <p class="desc fade" style="--d:1000ms">两次寒冬、三次范式转移、三十件关键藏品。按时间排好，每一件都能点开细看。</p>
      <div class="fade" style="--d:1150ms"><a class="btn" href="#"><span class="gl">✦</span><span>阅读 1.8 万字长卷</span></a></div>
    </div>
    <div class="right">
      <div class="fade" style="--d:1000ms"><h3>当前展品 · ${esc(current.year)}</h3><p>${esc(current.title)}</p></div>
      <div class="stats fade" style="--d:1150ms"><div><div class="mono" style="color:#78716C">时代</div><div class="v">EPOCH IV</div></div><div><div class="mono" style="color:#78716C">类别</div><div class="v">${CAT[current.cat]}</div></div></div>
      <a class="plus fade" style="--d:1300ms" href="/milestone/${current.slug}/"><b>+</b><span class="mono">查看详情</span></a>
    </div>
  </div>
  <div class="scroll fade" style="--d:1600ms"><b><i></i><i></i></b><span class="mono">向下滚动探索</span></div>
</section>

<!-- 02 -->
<section class="explore">
  <p class="lbl mono rv"><span>[ 02 ]</span> <b>探索时间线</b></p>
  <h2 class="big rv">从达特茅斯的那个夏天，<br>到<em>会自己推理和行动</em>的机器。</h2>
  <div class="pills">${cats.map((c, i) => `<a class="pill rv" style="--d:${i * 100}ms" href="#archive" data-f="${c}">${CAT[c] || c}</a>`).join('')}<a class="pill rv" style="--d:${cats.length * 100}ms" href="#">阅读长卷</a></div>
  <div class="count">
    <div class="rv"><b data-n="${ms.length}">0</b><span class="mono">件里程碑藏品</span></div>
    <div class="rv" style="--d:100ms"><b data-n="${eps.length}">0</b><span class="mono">个时代</span></div>
    <div class="rv" style="--d:200ms"><b data-n="83">0</b><span class="mono">年跨度</span></div>
    <div class="rv" style="--d:300ms"><b data-n="18000" data-fmt="k">0</b><span class="mono">字长卷</span></div>
  </div>
  <div class="spacer"></div>
  <div class="foot2 mono"><span>不只讲故事，也讲清来龙去脉。</span><span>AI CHRONICLE © 2026</span></div>
</section>

<!-- 03 -->
<section class="col">
  <div class="col-h">
    <h2 class="rv">八十三年的思想，<span class="ic"><b>θ</b><b>∑</b><b>∞</b></span>按时代陈列于此。</h2>
    <div class="rv" style="--d:150ms"><p class="tag mono">我们不只陈列成果<br>也陈列当时的困惑</p><div class="tp mono"><span>史料</span><span>可考</span><span>免费</span></div></div>
  </div>
  <div class="panel">
    <div class="viewer">
      <p class="stars">***</p>
      <div class="stage"><svg id="spec" viewBox="0 0 200 200" style="filter:url(#sand)">${spec[2]}</svg></div>
      <div class="ctr mono"><span class="roll"><span id="cn">03</span></span><span style="color:#44403C">/</span><span>0${eps.length}</span></div>
    </div>
    <div class="list">
      <div class="list-top mono"><span>看懂过去，才看得懂现在。</span><span class="roll" style="width:90px;text-align:right"><span id="cl">Epoch 03</span></span></div>
      ${epochList.replace(/<\/button>/g, '<span class="ch-bar"></span></button>')}
      <p class="col-sum" id="sum">${esc(eps[2].summary)}</p>
    </div>
  </div>
</section>

<!-- 04 -->
<div class="mq"><div class="mq-t">${marquee}${marquee}</div></div>

<!-- 05 -->
<section class="arch" id="archive">
  <div class="arch-h">
    <div><p class="eb mono rv"><i></i>全部藏品 · ${ms.length} 件</p><h2 class="rv">按年份翻阅每一件里程碑</h2></div>
    <div class="pills" style="margin-top:0" id="flt"><button class="pill on" data-f="all">全部</button>${cats.map((c) => `<button class="pill" data-f="${c}">${CAT[c] || c}</button>`).join('')}</div>
  </div>
  <div class="grid">${cards}</div>
</section>

<footer><div class="wm">CHRONICLE</div><div class="row mono"><span>AI 编年史 · 一个人维护的免费网站</span><span><a href="#">爱发电赞助</a> · <a href="#">关于</a> · <a href="#">GitHub</a></span></div></footer>

<script>
const EP=${JSON.stringify(eps.map((e) => ({ s: e.summary })))};
const SPEC=${JSON.stringify(spec)};
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

// delayed neural-net backdrop (stands in for NHM's delayed video)
(()=>{const c=document.getElementById('net'),x=c.getContext('2d');let W,H,P=[];
function rs(){W=c.width=c.offsetWidth*devicePixelRatio;H=c.height=c.offsetHeight*devicePixelRatio;P=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}))}
rs();addEventListener('resize',rs);
function f(){x.clearRect(0,0,W,H);const D=150*devicePixelRatio;for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<D){x.strokeStyle='rgba(201,168,106,'+(0.22*(1-d/D))+')';x.lineWidth=devicePixelRatio;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}
for(const p of P){x.fillStyle='rgba(227,200,146,.5)';x.beginPath();x.arc(p.x,p.y,1.4*devicePixelRatio,0,7);x.fill()}if(!reduce)requestAnimationFrame(f)}
setTimeout(()=>{c.classList.add('show');f()},2800)})();

// scroll reveals + count-up
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');
 const n=e.target.querySelector('[data-n]');if(n){const t=+n.dataset.n,k=n.dataset.fmt==='k',t0=performance.now();
 (function s(now){const p=Math.min(1,(now-t0)/1600),v=Math.round(t*(1-Math.pow(1-p,3)));n.textContent=k?(v/10000).toFixed(1)+'万':v;if(p<1)requestAnimationFrame(s)})(t0)}
 io.unobserve(e.target)}),{rootMargin:'0px 0px -80px 0px'});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

// epoch browser: auto-cycle + sand dissolve
const chs=[...document.querySelectorAll('.ch')],svg=document.getElementById('spec'),disp=document.getElementById('disp');
let cur=2,timer,busy=false;
function sand(from,to,dur){return new Promise(r=>{const t0=performance.now();(function s(n){const p=Math.min(1,(n-t0)/dur),e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
 disp.setAttribute('scale',from+(to-from)*e);svg.style.opacity=to>from?1-e:e;if(p<1)requestAnimationFrame(s);else r()})(t0)})}
function roll(id,txt){const el=document.getElementById(id);el.style.transform='translateY(-14px)';setTimeout(()=>{el.textContent=txt;el.style.transition='none';el.style.transform='translateY(14px)';requestAnimationFrame(()=>{el.style.transition='';el.style.transform='none'})},200)}
async function go(i){if(i===cur||busy)return;busy=true;chs.forEach((c,k)=>c.classList.toggle('on',k===i));
 const no=String(i+1).padStart(2,'0');roll('cn',no);roll('cl','Epoch '+no);document.getElementById('sum').textContent=EP[i].s;
 if(!reduce)await sand(0,90,450);svg.innerHTML=SPEC[i];if(!reduce)await sand(90,0,450);cur=i;busy=false;arm()}
function arm(){clearTimeout(timer);timer=setTimeout(()=>go((cur+1)%chs.length),3500)}
chs.forEach((c,i)=>c.addEventListener('click',()=>go(i)));
new IntersectionObserver(([e])=>e.isIntersecting?arm():clearTimeout(timer)).observe(document.querySelector('.panel'));

// archive filter
const cards=[...document.querySelectorAll('.card')];
function flt(f){document.querySelectorAll('#flt .pill').forEach(p=>p.classList.toggle('on',p.dataset.f===f));
 cards.forEach(c=>{const show=f==='all'||c.dataset.cat===f;c.classList.toggle('hide',!show);if(show){c.classList.remove('in');requestAnimationFrame(()=>c.classList.add('in'))}})}
document.querySelectorAll('#flt .pill').forEach(p=>p.addEventListener('click',()=>flt(p.dataset.f)));
document.querySelectorAll('.explore .pill[data-f]').forEach(p=>p.addEventListener('click',()=>setTimeout(()=>flt(p.dataset.f),400)));
</script></body></html>`;

fs.mkdirSync(path.join(__dirname, 'mock2'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'mock2', 'index.html'), html);
console.log('written', ms.length, 'milestones');
