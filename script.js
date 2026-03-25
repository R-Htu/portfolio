//alert("The small text is for styling, not for reading...I just made it look cool 😄")

/* ── POLYGON BACKGROUND ── */
(function () {
  alert("The small text is for styling, not for reading...I just made it look cool 😄")
  function buildPolygons() {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const isDark = theme !== 'light';

    const stroke1 = isDark ? 'rgba(0,255,225,0.07)'   : 'rgba(10, 175, 151, 0.1)';
    const fill1   = isDark ? 'rgba(0,255,225,0.015)'  : 'rgba(0, 0, 0, 0.03)';
    const stroke2 = isDark ? 'rgba(127,90,240,0.06)'  : 'rgba(3, 60, 4, 0.03)';
    const fill2   = isDark ? 'rgba(127,90,240,0.012)' : 'white';

    const orb1Stop = isDark ? '#06f541' : '#5e35b1';
    const orb2Stop = isDark ? '#00ffe1' : '#007a60';
    const orb1Op   = isDark ? '0.07'   : '0.1';
    const orb2Op   = isDark ? '0.05'   : '0.05';

    const o1 = document.getElementById('orb1');
    const o2 = document.getElementById('orb2');
    if (o1) {
      o1.children[0].setAttribute('stop-color', orb1Stop);
      o1.children[0].setAttribute('stop-opacity', orb1Op);
      o1.children[1].setAttribute('stop-color', orb1Stop);
    }
    if (o2) {
      o2.children[0].setAttribute('stop-color', orb2Stop);
      o2.children[0].setAttribute('stop-opacity', orb2Op);
      o2.children[1].setAttribute('stop-color', orb2Stop);
    }

    const W = 1440, H = 900;
    const cols = 11, rows = 7;
    const pts = [];

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        pts.push({
          x: (c / cols) * W + (Math.random() - 0.5) * 80,
          y: (r / rows) * H + (Math.random() - 0.5) * 70
        });
      }
    }

    let svg = '';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tl = pts[ r      * (cols + 1) + c    ];
        const tr = pts[ r      * (cols + 1) + c + 1];
        const bl = pts[(r + 1) * (cols + 1) + c    ];
        const br = pts[(r + 1) * (cols + 1) + c + 1];
        const useAlt = (r + c) % 3 === 0;
        const s = useAlt ? stroke2 : stroke1;
        const f = useAlt ? fill2   : fill1;
        if ((r + c) % 2 === 0) {
          svg += `<polygon points="${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y}" fill="${f}" stroke="${s}" stroke-width="0.8"/>`;
          svg += `<polygon points="${tl.x},${tl.y} ${br.x},${br.y} ${bl.x},${bl.y}" fill="${f}" stroke="${s}" stroke-width="0.8"/>`;
        } else {
          svg += `<polygon points="${tl.x},${tl.y} ${tr.x},${tr.y} ${bl.x},${bl.y}" fill="${f}" stroke="${s}" stroke-width="0.8"/>`;
          svg += `<polygon points="${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}" fill="${f}" stroke="${s}" stroke-width="0.8"/>`;
        }
      }
    }

    const g = document.getElementById('polyLines');
    if (g) g.innerHTML = svg;
  }

  document.addEventListener('DOMContentLoaded', buildPolygons);
  window.rebuildPolygons = buildPolygons;
})();


/* ── THEME ── */
function toggleTheme() {
  const html = document.documentElement;
  const dark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', dark ? 'light' : 'dark');
  document.getElementById('themeBtn').textContent = dark ? '[*]' : '[~~]';
  localStorage.setItem('rhtut', dark ? 'light' : 'dark');
  buildParticles();
  window.rebuildPolygons(); 
}

(function () {
  const s = localStorage.getItem('rhtut') || 'dark';
  document.documentElement.setAttribute('data-theme', s);
  document.getElementById('themeBtn').textContent = s === 'light' ? '[*]' : '[~~]';
})();


/* ── MOBILE NAV ── */
function toggleMenu() {
  const d = document.getElementById('drawer'), b = document.getElementById('burger');
  const o = d.classList.toggle('open');
  b.classList.toggle('open', o);
  document.body.style.overflow = o ? 'hidden' : '';
}
function closeMenu() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('burger').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('click', e => {
  const d = document.getElementById('drawer'), b = document.getElementById('burger');
  if (d.classList.contains('open') && !d.contains(e.target) && !b.contains(e.target)) closeMenu();
});


/* ── FIREFLIES ── */
const cv = document.getElementById('canvas'), ctx = cv.getContext('2d');
let W, H, particles = [], mouse = { x: null, y: null };

function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }
resize();
window.addEventListener('resize', () => { resize(); buildParticles(); });
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function getPalette() {
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? [{ c: '0,120,64', m: .45 }, { c: '0,110,110', m: .38 }, { c: '0,160,80', m: .35 }]
    : [{ c: '0,255,135', m: .65 }, { c: '0,212,204', m: .5 }, { c: '160,255,200', m: .4 }];
}

class Fly {
  constructor(init) {
    this.bx = init ? Math.random() * W : (Math.random() < .5 ? -70 : W + 70);
    this.by = Math.random() * H;
    this.x = this.bx; this.y = this.by;
    this.sz = Math.random() * 1.4 + .3;
    this.al = Math.random() * .45 + .08;
    this.sp = Math.random() * .28 + .05;
    this.ang = Math.random() * Math.PI * 2;
    this.asp = (Math.random() - .5) * .013;
    this.rad = Math.random() * 52 + 16;
    this.t = Math.random() * 1000;
    const p = getPalette(), k = p[Math.floor(Math.random() * p.length)];
    this.col = k.c; this.max = k.m;
    this.gr = Math.random() * 5 + 2;
    this.dx = (Math.random() - .5) * .11;
    this.dy = (Math.random() - .5) * .08;
  }
  update() {
    this.t += this.sp; this.ang += this.asp;
    this.x = this.bx + Math.cos(this.ang + this.t * .009) * this.rad;
    this.y = this.by + Math.sin(this.ang * .65 + this.t * .007) * this.rad * .55;
    this.bx += this.dx; this.by += this.dy;
    this.al += (Math.random() - .5) * .016;
    this.al = Math.max(.04, Math.min(this.max, this.al));
    if (this.bx < -80) this.bx = W + 80;
    if (this.bx > W + 80) this.bx = -80;
    if (this.by < -80) this.by = H + 80;
    if (this.by > H + 80) this.by = -80;
    if (mouse.x !== null) {
      const dx = this.x - mouse.x, dy = this.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) { this.bx += dx / d * 1.8; this.by += dy / d * 1.8; }
    }
  }
  draw() {
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.gr * 3);
    g.addColorStop(0, `rgba(${this.col},${this.al * .4})`);
    g.addColorStop(1, `rgba(${this.col},0)`);
    ctx.beginPath(); ctx.arc(this.x, this.y, this.gr * 3, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.col},${this.al})`; ctx.fill();
  }
}

function buildParticles() {
  particles = [];
  const n = Math.min(Math.floor(W * H / 13000), 95);
  for (let i = 0; i < n; i++) particles.push(new Fly(true));
}
buildParticles();

(function loop() {
  ctx.clearRect(0, 0, W, H);
  const lc = document.documentElement.getAttribute('data-theme') === 'light' ? '0,120,64' : '0,255,135';
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 82) {
        ctx.strokeStyle = `rgba(${lc},${(1 - d / 82) * .4})`;
        ctx.lineWidth = .5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(loop);
})();

/* ══════════════════════════════════════
   PILLAR NETWORK BACKGROUNDS
══════════════════════════════════════ 
function initPillarNetworks() {
  document.querySelectorAll('.pillar').forEach(pillar => {
    const cv = document.createElement('canvas');
    cv.style.cssText = `
      position:absolute;inset:0;width:100%;height:100%;
      z-index:0;pointer-events:none;opacity:0.45;
    `;
    pillar.prepend(cv);

    const ctx = cv.getContext('2d');
    let W, H, pts = [];

    function resize() {
      W = cv.width  = pillar.offsetWidth;
      H = cv.height = pillar.offsetHeight;
    }

    function init() {
      resize();
      pts = Array.from({ length: 18 }, () => ({
        x: Math.random() * W,  y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const lineColor = isDark ? '0,255,225' : '0,130,100';
      const dotColor  = isDark ? '0,255,225' : '0,130,100';

      // connections
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.strokeStyle = `rgba(${lineColor},${(1 - d / 80) * 0.5})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // dots
      pts.forEach(p => {
        ctx.fillStyle = `rgba(${dotColor},0.7)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // move
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      requestAnimationFrame(draw);
    }

    new ResizeObserver(resize).observe(pillar);
    init();
    draw();
  });
}

document.addEventListener('DOMContentLoaded', initPillarNetworks);*/

/* ══════════════════════════════════════
   ECO-BOX NETWORK BACKGROUND
══════════════════════════════════════ */
function initEcoNetwork() {
  const box = document.querySelector('.eco-box');
  if (!box) return;

  const cv = document.createElement('canvas');
  cv.style.cssText = `
    position:absolute;inset:0;width:100%;height:100%;
    z-index:0;pointer-events:none;opacity:0.35;
  `;
  box.prepend(cv);

  const ctx = cv.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = cv.width  = box.offsetWidth;
    H = cv.height = box.offsetHeight;
  }

  function init() {
    resize();
    pts = Array.from({ length: 40 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const line = isDark ? '0,255,225'  : '0,255,10';
    const dot  = isDark ? '127,90,240' : '94,195,17';

    // connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.strokeStyle = `rgba(${line},${(1 - d / 120) * 0.9})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }

    // dots
    pts.forEach(p => {
      ctx.fillStyle = `rgba(${dot},0.9)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });

    // move
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  new ResizeObserver(resize).observe(box);
  init();
  draw();
}

document.addEventListener('DOMContentLoaded', initEcoNetwork);