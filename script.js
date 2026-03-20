/* ── THEME ── */
function toggleTheme(){
  const html=document.documentElement;
  const dark=html.getAttribute('data-theme')==='dark';
  html.setAttribute('data-theme',dark?'light':'dark');
  document.getElementById('themeBtn').textContent=dark?'[*]':'[~~]';
  localStorage.setItem('rhtut',dark?'light':'dark');
  buildParticles();
}
(function(){
  const s=localStorage.getItem('rhtut')||'dark';
  document.documentElement.setAttribute('data-theme',s);
  document.getElementById('themeBtn').textContent=s==='light'?'[*]':'[~~]';
})();

/* ── FIREFLIES ── */
const cv=document.getElementById('canvas'),ctx=cv.getContext('2d');
let W,H,particles=[],mouse={x:null,y:null};
function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;}
resize();
window.addEventListener('resize',()=>{resize();buildParticles();});
window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});