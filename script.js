//alert("The small text is for styling, not for reading...I just made it look cool 😄")

/* ── POLYGON BACKGROUND ── */
(function () {
alert("The small text is for styling, not for reading...I just made it look cool 😄");
  function buildPolygons() {

 
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    const isDark = theme !== 'light';

    const stroke1 = isDark ? 'rgba(0,255,225,0.05)'   : 'rgba(10, 175, 151, 0.1)';
    const fill1   = isDark ? 'rgba(0,255,225,0.05)'  : 'rgba(0, 0, 0, 0.09)';
    const stroke2 = isDark ? 'rgba(127,90,240,0.06)'  : 'rgba(3, 60, 4, 0.03)';
    const fill2   = isDark ? 'rgba(127,90,240,0.012)' : 'rgba(0, 0, 0, 0.03)';

    // --- ORB GRADIENT COLORS ---
    // Color for the first background orb gradient
    const orb1Stop = isDark ? '#06f541' : '#5e35b1';

    // Color for the second background orb gradient
    const orb2Stop = isDark ? '#00ffe1' : '#007a60';

    // Opacity for orb 1
    const orb1Op   = isDark ? '0.07'   : '0.1';

    // Opacity for orb 2
    const orb2Op   = isDark ? '0.05'   : '0.05';

    // Find the SVG gradient element for orb 1 in the DOM
    const o1 = document.getElementById('orb1');

    // Find the SVG gradient element for orb 2 in the DOM
    const o2 = document.getElementById('orb2');

    // If orb1 exists, update its gradient stop colors and opacity
    if (o1) {
      o1.children[0].setAttribute('stop-color', orb1Stop);
      o1.children[0].setAttribute('stop-opacity', orb1Op);
      o1.children[1].setAttribute('stop-color', orb1Stop);
    }

    // If orb2 exists, update its gradient stop colors and opacity
    if (o2) {
      o2.children[0].setAttribute('stop-color', orb2Stop);
      o2.children[0].setAttribute('stop-opacity', orb2Op);
      o2.children[1].setAttribute('stop-color', orb2Stop);
    }

    // --- GRID SETUP ---
    // The total canvas size the polygons are drawn across (in SVG units)
    const W = 1440, H = 900;

    // ↓ THIS CONTROLS POLYGON SIZE ↓
    // More cols/rows = more polygons = each one is SMALLER
    // Fewer cols/rows = fewer polygons = each one is BIGGER
    // To make polygons smaller: increase these numbers (e.g. 14, 9)
    // To make polygons bigger:  decrease these numbers (e.g. 8, 5)
    const cols = 8, rows = 5; // <-- change these to resize polygons

    // Empty array to store all the grid point coordinates
    const pts = [];

    // --- BUILD GRID POINTS ---
    // Loop through every row and column intersection (the corners of each cell)
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        pts.push({
          // Evenly space the point across the width, then add random jitter
          // (Math.random() - 0.5) gives a value between -0.5 and +0.5
          // Multiplying by 80 means each point shifts up to ±40px horizontally
          // ↓ To reduce jitter (more regular grid): lower 80 and 70
          // ↓ To increase jitter (more chaotic):    raise 80 and 70
          x: (c / cols) * W + (Math.random() - 0.5) * 60, // <-- horizontal jitter
          y: (r / rows) * H + (Math.random() - 0.5) * 50  // <-- vertical jitter
        });
      }
    }

    // String that will hold all the SVG polygon markup
    let svg = '';

    // --- BUILD POLYGONS ---
    // Loop through each cell in the grid (not the points, the cells between them)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {

        // Get the 4 corner points of this cell from the pts array
        // The grid has (cols + 1) points per row, so we calculate the index
        const tl = pts[ r      * (cols + 1) + c    ]; // top-left corner
        const tr = pts[ r      * (cols + 1) + c + 1]; // top-right corner
        const bl = pts[(r + 1) * (cols + 1) + c    ]; // bottom-left corner
        const br = pts[(r + 1) * (cols + 1) + c + 1]; // bottom-right corner

        // Every 3rd cell (where r+c is divisible by 3) uses the alternate color
        const useAlt = (r + c) % 3 === 0;

        // Pick stroke and fill based on whether this is an alternate cell
        const s = useAlt ? stroke2 : stroke1;
        const f = useAlt ? fill2   : fill1;

        // Each cell is split into 2 triangles
        // Even cells split top-right to bottom-left (\ diagonal)
        // Odd cells split top-left to bottom-right (/ diagonal)
        // This alternating pattern creates the varied mesh look
        if ((r + c) % 2 === 0) {
          // Top-right triangle: top-left → top-right → bottom-right
          svg += `<polygon points="${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y}" fill="${f}" stroke="${s}" stroke-width="0.8"/>`;
          // Bottom-left triangle: top-left → bottom-right → bottom-left
          svg += `<polygon points="${tl.x},${tl.y} ${br.x},${br.y} ${bl.x},${bl.y}" fill="${f}" stroke="${s}" stroke-width="0.8"/>`;
        } else {
          // Top-left triangle: top-left → top-right → bottom-left
          svg += `<polygon points="${tl.x},${tl.y} ${tr.x},${tr.y} ${bl.x},${bl.y}" fill="${f}" stroke="${s}" stroke-width="0.8"/>`;
          // Bottom-right triangle: top-right → bottom-right → bottom-left
          svg += `<polygon points="${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}" fill="${f}" stroke="${s}" stroke-width="0.8"/>`;
        }
      }
    }

    // Find the SVG group element where polygons should be injected
    const g = document.getElementById('polyLines');

    // Replace its contents with all the newly built polygon markup
    if (g) g.innerHTML = svg;
  }

  // Run buildPolygons once the page's HTML has fully loaded
  document.addEventListener('DOMContentLoaded', buildPolygons);

  // Also expose it globally so you can call rebuildPolygons() from
  // anywhere (e.g. when the theme toggle switches light/dark)
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

// Get the canvas element from the HTML and set up 2D drawing context
const cv = document.getElementById('canvas'), ctx = cv.getContext('2d');

// W, H = canvas dimensions | particles = array of all fireflies | mouse = cursor position
let W, H, particles = [], mouse = { x: null, y: null };

// Sets canvas width/height to match the browser window size
function resize() { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; }

// Run resize once immediately so canvas is correct on first load
resize();

// Whenever the window is resized, resize the canvas AND rebuild all fireflies
window.addEventListener('resize', () => { resize(); buildParticles(); });

// Track the mouse position globally so fireflies can react to it
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

// Returns an array of color options depending on light or dark theme
// Each object has: c = RGB color string, m = max opacity allowed
function getPalette() {
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? [{ c: '0,120,64', m: .45 }, { c: '0,110,110', m: .38 }, { c: '0,160,80', m: .35 }]   // muted greens for light mode
    : [{ c: '0,255,135', m: .65 }, { c: '0,212,204', m: .5 }, { c: '160,255,200', m: .4 }]; // bright glowing greens for dark mode
}

// Each firefly is an instance of this class
class Fly {
  constructor(init) {

    // If init=true, spawn randomly across the screen (page load)
    // If init=false, spawn off-screen left or right (entering mid-animation)
    this.bx = init ? Math.random() * W : (Math.random() < .5 ? -40 : W + 40);

    // Spawn at a random vertical position
    this.by = Math.random() * H;

    // x/y is the actual drawn position (starts at the base position)
    this.x = this.bx; this.y = this.by;

    // Size of the bright centre dot (between 0.3 and 1.7px)
    this.sz = Math.random() * 1.4 + .3;

    // Starting opacity (between 0.08 and 0.53)
    this.al = Math.random() * .45 + .08;

    // Speed of the oscillation/wandering movement
    this.sp = Math.random() * .28 + .05;

    // Starting angle for the circular orbit path
    this.ang = Math.random() * Math.PI * 2;

    // How fast the angle rotates each frame (tiny, so orbit is gentle)
    this.asp = (Math.random() - .5) * .013;

    // Radius of the looping orbit around the base position (16 to 68px)
    this.rad = Math.random() * 52 + 16;

    // Internal time counter — offset randomly so fireflies don't pulse in sync
    this.t = Math.random() * 1000;

    // Pick a random color from the current theme's palette
    const p = getPalette(), k = p[Math.floor(Math.random() * p.length)];

    // Store the chosen color string and its max opacity
    this.col = k.c; this.max = k.m;

    // Size of the soft glow halo around the firefly (2 to 7)
    this.gr = Math.random() * 5 + 2;

    // Slow horizontal drift of the base position (wanders across screen)
    this.dx = (Math.random() - .5) * .11;

    // Slow vertical drift of the base position
    this.dy = (Math.random() - .5) * .08;
  }

  update() {
    // Advance the time counter by the firefly's individual speed
    this.t += this.sp;

    // Slowly rotate the orbit angle
    this.ang += this.asp;

    // Calculate actual x position: base + cosine wave orbit
    // The * .009 slows the time so the loop is wide and lazy
    this.x = this.bx + Math.cos(this.ang + this.t * .009) * this.rad;

    // Calculate actual y position: slightly squashed orbit (0.55) so it looks more natural
    // Uses a different multiplier on ang (.65) so x and y are out of phase = figure-8 path
    this.y = this.by + Math.sin(this.ang * .65 + this.t * .007) * this.rad * .55;

    // Drift the base position slowly across the screen
    this.bx += this.dx;
    this.by += this.dy;

    // Randomly flicker the opacity slightly each frame
    this.al += (Math.random() - .5) * .016;

    // Clamp opacity so it never goes below 0.04 or above its max
    this.al = Math.max(.04, Math.min(this.max, this.al));

    // Wrap around: if firefly drifts off the left edge, reappear on the right
    if (this.bx < -80) this.bx = W + 80;

    // Wrap around: if firefly drifts off the right edge, reappear on the left
    if (this.bx > W + 80) this.bx = -80;

    // Wrap around: top edge → bottom
    if (this.by < -80) this.by = H + 80;

    // Wrap around: bottom edge → top
    if (this.by > H + 80) this.by = -80;

    // Mouse repulsion: only runs if the mouse has moved at least once
    if (mouse.x !== null) {
      // Vector from mouse to firefly
      const dx = this.x - mouse.x, dy = this.y - mouse.y;

      // Distance from mouse to firefly
      const d = Math.sqrt(dx * dx + dy * dy);

      // If firefly is within 110px of the cursor, push it away
      // dx/d and dy/d normalizes the direction, * 1.8 is the push strength
      if (d < 110) { this.bx += dx / d * 1.8; this.by += dy / d * 1.8; }
    }
  }

  draw() {
    // Create a radial gradient centered on the firefly for the soft glow
    // Goes from center (0) outward to gr*3 radius
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.gr * 3);

    // Center of glow: the firefly's color at low opacity (* 0.4 dims it)
    g.addColorStop(0, `rgba(${this.col},${this.al * .4})`);

    // Edge of glow: fully transparent, creating the soft fade-out
    g.addColorStop(1, `rgba(${this.col},0)`);

    // Draw the large soft glow circle using the gradient
    ctx.beginPath(); ctx.arc(this.x, this.y, this.gr * 3, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();

    // Draw the small bright centre dot on top of the glow
    ctx.beginPath(); ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.col},${this.al})`; ctx.fill();
  }
}

function buildParticles() {
  // Clear existing fireflies
  particles = [];

  // Calculate count based on screen area so performance stays consistent
  // Dividing by 13000 means roughly 1 firefly per 13000px² of screen
  // Math.min caps it at 95 so large screens don't get overwhelmed
 
  const n = Math.min(Math.floor(W * H / 18000), 60); // 18000-60,22000-45,13000-95

  // Create n fireflies, all with init=true so they spawn on screen
  for (let i = 0; i < n; i++) particles.push(new Fly(true));
}
buildParticles();

// Main animation loop — runs every frame using requestAnimationFrame
(function loop() {

  // Clear the entire canvas each frame so old positions are erased
  ctx.clearRect(0, 0, W, H);

  // Pick the line color for connections based on current theme
  const lc = document.documentElement.getAttribute('data-theme') === 'light' ? '0,120,64' : '0,255,135';

  // Check every pair of fireflies to see if they're close enough to connect
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {

      // Vector between two fireflies
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;

      // Distance between them
      const d = Math.sqrt(dx * dx + dy * dy);

      // Only draw a line if they're within 82px of each other
      if (d < 82) {
        // Opacity fades as distance increases: close = opaque, far = transparent
        // (1 - d/82) gives 1.0 when d=0, 0.0 when d=82 — then * 0.4 keeps it subtle
        ctx.strokeStyle = `rgba(${lc},${(1 - d / 82) * .4})`;

        // Thin line so it looks like a delicate thread
        ctx.lineWidth = .5;

        // Draw the connecting line between the two fireflies
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Update position and draw every firefly
  particles.forEach(p => { p.update(); p.draw(); });

  // Schedule the next frame — this is what makes it loop forever
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

// ── STATS CAROUSEL ──

(function () {
  const items   = Array.from(document.querySelectorAll('.stats-inner.stats-carousel .sitem'));
  const dotsEl  = document.getElementById('carouselDots');
  let current   = 0;
  let animating = false;

  const acValues  = items.map(el => el.style.getPropertyValue('--ac'));
  const isMobile  = () => window.innerWidth < 768;
  const isDesktop = () => window.innerWidth >= 768;

  items.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'cdot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to stat ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  });

  items[0].classList.add('active');

  function clearMobileClasses(el) {
    el.classList.remove(
      'sitem-enter-right', 'sitem-enter-left',
      'sitem-exit-right',  'sitem-exit-left',
      'sitem-sliding'
    );
  }

  function goTo(next, dir) {
    if (next === current || animating) return;
    animating = true;

    const direction = dir ?? (next > current ? 1 : -1);
    const prev      = current;

    if (isMobile()) {
      const enterClass = direction === 1 ? 'sitem-enter-right' : 'sitem-enter-left';
      const exitClass  = direction === 1 ? 'sitem-exit-left'   : 'sitem-exit-right';

      clearMobileClasses(items[prev]);
      clearMobileClasses(items[next]);

      items[next].classList.add(enterClass);
      items[next].getBoundingClientRect(); // reflow

      items[next].classList.remove(enterClass);
      items[next].classList.add('sitem-sliding');

      items[prev].classList.remove('active');
      items[prev].classList.add(exitClass);

      setTimeout(() => {
        clearMobileClasses(items[prev]);
        clearMobileClasses(items[next]);
        items[next].classList.add('active');

        dotsEl.children[prev].classList.remove('active');
        dotsEl.children[next].classList.add('active');

        current   = next;
        animating = false;
      }, 360);

    } else {
      const enterFrom  =  direction * 150;
      const exitTo     = -direction * 150;
      const transition = 'opacity 0.35s ease, transform 0.35s ease';
      const tx = x    => `translateX(calc(-50% + ${x}px))`;

      items[next].style.cssText = `--ac: ${acValues[next]}; transform: ${tx(enterFrom)}; opacity: 0; position: absolute; transition: none;`;
      items[next].getBoundingClientRect();

      items[prev].style.cssText = `--ac: ${acValues[prev]}; transform: ${tx(exitTo)}; opacity: 0; pointer-events: none; position: absolute; transition: ${transition};`;
      items[next].style.cssText = `--ac: ${acValues[next]}; transform: ${tx(0)}; opacity: 1; pointer-events: auto; position: absolute; transition: ${transition};`;

      setTimeout(() => {
        items[prev].classList.remove('active');
        items[prev].style.cssText = `--ac: ${acValues[prev]};`;
        items[next].classList.add('active');
        items[next].style.cssText = `--ac: ${acValues[next]};`;

        dotsEl.children[prev].classList.remove('active');
        dotsEl.children[next].classList.add('active');

        current   = next;
        animating = false;
      }, 360);
    }
  }

  window.statsNav = function (dir) {
    const next = (current + dir + items.length) % items.length;
    goTo(next, dir);
  };
})();

const cells = [
  { tag:"GARDEN", title:"Seedling Lab",     hue:"#00ff87", pattern:"hex",     img:"https://i.ibb.co/fGNcPh6G/papaya-tree.jpg" },
  { tag:"CODE",   title:"Debug Session",    hue:"#7f5af0", pattern:"dots",    img:"https://i.ibb.co/WNBM4kFp/pumpkin.jpg" },
  { tag:"LIFE",   title:"Soil Layers",      hue:"#00ffe1", pattern:"wave",    img:"https://i.ibb.co/RkGHJWxt/red-flowers.jpg" },
  { tag:"TEACH",  title:"Root Systems",     hue:"#00ff87", pattern:"grid",    img:"https://i.ibb.co/tkCgc6T/IMG-20260406-120418.jpg" },
  { tag:"GROW",   title:"Compost Loop",     hue:"#7f5af0", pattern:"cross",   img:"https://i.ibb.co/yFCCL2qQ/IMG-20260406-120408.jpg" },
  { tag:"CODE",   title:"Late Night Build", hue:"#00ffe1", pattern:"circuit", img:"https://i.ibb.co/nsBv73Qj/photo-2026-04-06-12-02-30.jpg" },
  { tag:"HOME",   title:"Homeschool Hours", hue:"#7f5af0", pattern:"hex",     img:"https://i.ibb.co/8Dn2WWz4/photo-2026-04-06-12-02-27.jpg" },
  { tag:"GARDEN", title:"Propagation",      hue:"#00ff87", pattern:"dots",    img:"https://i.ibb.co/rGqsY2WL/photo-2026-04-06-12-02-19.jpg" },
  { tag:"COOK",   title:"Harvest Plate",    hue:"#ffaa00", pattern:"wave",    img:"https://i.ibb.co/275MM4Z6/photo-2026-04-06-12-01-56.jpg" },
  { tag:"LOG",    title:"Node Entry",       hue:"#00ffe1", pattern:"grid",    img:"https://i.ibb.co/zWjQTC0G/photo-2026-04-06-12-01-45.jpg" },
  { tag:"GROW",   title:"Seed Archive",     hue:"#00ff87", pattern:"cross",   img:"https://i.ibb.co/27d0bLDT/photo-2026-04-06-12-01-10.jpg" },
  { tag:"LIFE",   title:"Garden at Dusk",   hue:"#7f5af0", pattern:"circuit", img:"https://i.ibb.co/qLZ6mWB9/photo-2026-04-06-12-00-56.jpg" },
  { tag:"CODE",   title:"Deploy Day",       hue:"#00ffe1", pattern:"hex",     img:"https://i.ibb.co/DHVgpDKH/photo-2026-04-06-12-00-45.jpg" },
  { tag:"TEACH",  title:"Study Loop",       hue:"#ffaa00", pattern:"dots",    img:"https://i.ibb.co/pvZ7CSXG/photo-2026-04-06-12-00-42.jpg" },
  { tag:"COOK",   title:"From The Garden",  hue:"#00ff87", pattern:"wave",    img:"images/soil.jpg" },
  { tag:"HOME",   title:"Son's Discovery",  hue:"#7f5af0", pattern:"grid",    img:"images/soil.jpg" },
];

  const spans = [
    "1/5,1/3",
    "5/8,1/2",
    "8/10,1/2",
    "10/13,1/3",
    "5/7,2/3",
    "7/10,2/4",
    "1/4,3/5",
    "4/7,3/4",
    "10/12,3/4",
    "12/13,3/5",
    "4/6,4/5",
    "6/10,4/6",
    "10/12,4/5",
    "1/4,5/6",
    "4/6,5/6",
    "10/13,5/6",
  ];

  function drawPat(canvas, type, hue) {
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = canvas.offsetWidth || 800);
    const h = (canvas.height = canvas.offsetHeight || 400);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = hue;
    ctx.fillStyle = hue;
    ctx.lineWidth = 0.7;
    ctx.globalAlpha = 0.18;
    if (type === "hex") {
      const r = 16;
      for (let row = -1; row < h / 28 + 1; row++)
        for (let col = -1; col < w / 28 + 1; col++) {
          const cx = col * 24 + (row % 2) * 12,
            cy = row * 28;
          ctx.beginPath();
          for (let i = 0; i < 6; i++)
            ctx.lineTo(
              cx + r * Math.cos((Math.PI / 3) * i - Math.PI / 6),
              cy + r * Math.sin((Math.PI / 3) * i - Math.PI / 6),
            );
          ctx.closePath();
          ctx.stroke();
        }
    } else if (type === "dots") {
      for (let y = 0; y < h + 10; y += 18)
        for (let x = 0; x < w + 10; x += 18) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
    } else if (type === "wave") {
      for (let y = 0; y < h + 20; y += 14) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4)
          ctx.lineTo(x, y + Math.sin(x * 0.15) * 6);
        ctx.stroke();
      }
    } else if (type === "grid") {
      for (let x = 0; x <= w; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    } else if (type === "cross") {
      for (let y = 0; y < h + 20; y += 26)
        for (let x = 0; x < w + 20; x += 26) {
          ctx.beginPath();
          ctx.moveTo(x - 7, y);
          ctx.lineTo(x + 7, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x, y - 7);
          ctx.lineTo(x, y + 7);
          ctx.stroke();
        }
    } else if (type === "circuit") {
      for (let y = 0; y < h; y += 32)
        for (let x = 0; x < w; x += 32) {
          const r = Math.random();
          ctx.beginPath();
          if (r < 0.33) {
            ctx.moveTo(x, y + 16);
            ctx.lineTo(x + 16, y + 16);
            ctx.lineTo(x + 16, y);
          } else if (r < 0.66) {
            ctx.moveTo(x + 16, y);
            ctx.lineTo(x + 16, y + 16);
            ctx.lineTo(x + 32, y + 16);
          } else {
            ctx.moveTo(x, y + 16);
            ctx.lineTo(x + 16, y + 16);
            ctx.lineTo(x + 16, y + 32);
          }
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x + 16, y + 16, 2, 0, Math.PI * 2);
          ctx.fill();
        }
    }
    ctx.globalAlpha = 1;
  }

  const grid = document.getElementById("galGrid");
  let currentIdx = 0;

  cells.forEach((d, i) => {
    const [col, row] = spans[i].split(",");
    const cell = document.createElement("div");
    cell.className = "gal-cell";
    cell.style.gridColumn = col;
    cell.style.gridRow = row;
    cell.dataset.idx = i;

    cell.innerHTML = `
    <div class="cell-bg" style="background:radial-gradient(ellipse at center,${d.hue}08,transparent 70%)">
      <canvas style="width:100%;height:100%;position:absolute;inset:0;"></canvas>
    </div>
    <div class="cell-scan"></div>
    <div class="cell-overlay">
      <div class="cell-tag">${d.tag}</div>
      <div class="cell-title">${d.title}</div>
    </div>
    <div class="cell-corner tl"></div>
    <div class="cell-corner br"></div>
    <div class="cell-id">${String(i + 1).padStart(2, "0")}</div>
    <div class="cell-zoom-icon">⊕</div>
  `;

    grid.appendChild(cell);

    requestAnimationFrame(() => {
      const cv = cell.querySelector("canvas");
      cv.width = cell.offsetWidth;
      cv.height = cell.offsetHeight;
      drawPat(cv, d.pattern, d.hue);
    });

    cell.addEventListener("click", () => openLightbox(i));
  });

  // dots
  const dotsEl = document.getElementById("stripDots");
  [...Array(5)].forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "strip-dot" + (i === 0 ? " active" : "");
    dotsEl.appendChild(d);
  });
  setInterval(() => {
    document
      .querySelectorAll(".strip-dot")
      .forEach((el, j) =>
        el.classList.toggle("active", j === Math.floor(Date.now() / 1000) % 5),
      );
  }, 1000);

  // LIGHTBOX
  const backdrop = document.getElementById("lbBackdrop");
  const lbTag = document.getElementById("lbTag");
  const lbMeta = document.getElementById("lbMeta");
  const lbTitle = document.getElementById("lbTitle");
  const lbCanvas = document.getElementById("lbCanvas");
  const lbImgWrap = document.getElementById("lbImgWrap");

  function openLightbox(idx) {
    currentIdx = idx;
    updateLightbox();
    backdrop.classList.add("open");
  }

  function closeLightbox() {
    backdrop.classList.remove("open");
  }

function updateLightbox() {
  const d = cells[currentIdx];
  lbTag.textContent  = d.tag;
  lbTitle.textContent = d.title;
  lbMeta.textContent = `NODE:${String(currentIdx+1).padStart(2,"0")} // SECTOR:${d.tag}`;

  // remove previous image and hide canvas
  const oldImg = lbImgWrap.querySelector("img");
  if (oldImg) oldImg.remove();
  lbCanvas.style.display = "none";

  if (d.img) {
    // show real image
    const img = document.createElement("img");
    img.src = d.img;
    img.alt = d.title;
    img.style.cssText = "max-width:100%;max-height:70vh;object-fit:contain;display:block;position:relative;z-index:1;";
    lbImgWrap.appendChild(img);
  } else {
    // fallback: show canvas pattern
    lbCanvas.style.display = "block";
    requestAnimationFrame(() => {
      lbCanvas.width  = lbImgWrap.offsetWidth  || 800;
      lbCanvas.height = lbImgWrap.offsetHeight || 400;
      drawPat(lbCanvas, d.pattern, d.hue);
    });
  }
}

  document
    .getElementById("lbCloseBtn")
    .addEventListener("click", closeLightbox);

  // click outside the box closes it
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeLightbox();
  });

  // keyboard ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // prev / next
  document.getElementById("lbPrev").addEventListener("click", (e) => {
    e.stopPropagation();
    currentIdx = (currentIdx - 1 + cells.length) % cells.length;
    updateLightbox();
  });
  document.getElementById("lbNext").addEventListener("click", (e) => {
    e.stopPropagation();
    currentIdx = (currentIdx + 1) % cells.length;
    updateLightbox();
  });