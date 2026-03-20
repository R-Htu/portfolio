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

/* ── MOBILE NAV ── */
function toggleMenu(){
  const d=document.getElementById('drawer'),b=document.getElementById('burger');
  const o=d.classList.toggle('open');
  b.classList.toggle('open',o);
  document.body.style.overflow=o?'hidden':'';
}
function closeMenu(){
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('burger').classList.remove('open');
  document.body.style.overflow='';
}
document.addEventListener('click',e=>{
  const d=document.getElementById('drawer'),b=document.getElementById('burger');
  if(d.classList.contains('open')&&!d.contains(e.target)&&!b.contains(e.target))closeMenu();
});
/* ── I feel like wanna give up on Math lol when learning how to make FIREFLIES ── */
const cv=document.getElementById('canvas'),ctx=cv.getContext('2d');
let W,H,particles=[],mouse={x:null,y:null};
function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;}
resize();
window.addEventListener('resize',()=>{resize();buildParticles();});
window.addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});

function getPalette(){
  return document.documentElement.getAttribute('data-theme')==='light'
    ?[{c:'0,120,64',m:.45},{c:'0,110,110',m:.38},{c:'0,160,80',m:.35}]
    :[{c:'0,255,135',m:.65},{c:'0,212,204',m:.5},{c:'160,255,200',m:.4}];
}
class Fly{//each fly is a particle with its own properties and movement logic
  constructor(init){//init is true when building particles on theme change, so flies start from random edge and fly towards center, otherwise they start from their base position which is randomly set to be within the screen or just outside the left or right edge, so they fly in from left or right when first loaded
    this.bx=init?Math.random()*W:(Math.random()<.5?-40:W+40);//base position of the fly, where it’s pulled towards and orbits around, starts off screen if not init to fly in from left or right
    this.by=Math.random()*H;//base position of the fly, where it’s pulled towards and orbits around
    this.x=this.bx;this.y=this.by;//current position of the fly, starts at base position
    this.sz=Math.random()*1.4+.3;//size of the fly
    this.al=Math.random()*.45+.08;//alpha
    this.sp=Math.random()*.28+.05;//speed
    this.ang=Math.random()*Math.PI*2;//direction angle in radians(0 to 2PI)
    this.asp=(Math.random()-.5)*.013;//angle speed or swy left and right
    this.rad=Math.random()*52+16;//radius of the fly's circular movement
    this.t=Math.random()*1000;//time offset for the movement orAdds randomness so fireflies don’t all pulse / move in sync
    const p=getPalette(),k=p[Math.floor(Math.random()*p.length)];//color and max distance for mouse interaction based on theme palette
    this.col=k.c;this.max=k.m;//max distance for interaction with mouse, also determines how much the fly is affected by mouse movement (the closer the fly, the more it’s affected)
    this.gr=Math.random()*5+2;//gravity or how much the fly is pulled towards its base position (the higher, the more it resists being pulled away by mouse movement)
    this.dx=(Math.random()-.5)*.11;//initial random movement in x direction to add some natural movement even when mouse is not nearby
    this.dy=(Math.random()-.5)*.08;//initial random movement in y direction
  }
    update(){//movement logic for each fly, called every frame
    this.t+=this.sp;this.ang+=this.asp;//time and angle are updated based on speed and angle speed
    this.x=this.bx+Math.cos(this.ang+this.t*.009)*this.rad;//circular movement around base position, with time affecting the angle to create a swirling effect, and radius determining how far from the base position the fly orbits
    this.y=this.by+Math.sin(this.ang*.65+this.t*.007)*this.rad*.55;//circular movement in y direction with different angle and radius to create a more natural, less uniform movement
    this.bx+=this.dx;this.by+=this.dy;//base position is also moving slightly based on initial random movement to add more natural movement
    this.al+=(Math.random()-.5)*.016;//alpha changes randomly to create a flickering effect, but is also constrained to be between 0.04 and the max value determined by the theme palette to prevent flies from becoming invisible or too bright
    this.al=Math.max(.04,Math.min(this.max,this.al));//constrain alpha to be between 0.04 and max value from palette
    if(this.bx<-80)this.bx=W+80;if(this.bx>W+80)this.bx=-80;//if the base position goes too far off screen, wrap it around to the other side to create an infinite flying effect, with a buffer of 80 pixels so flies can fly in from off screen before wrapping around
    if(this.by<-80)this.by=H+80;if(this.by>H+80)this.by=-80;//same wrapping logic for y direction
    if(mouse.x!==null){const dx=this.x-mouse.x,dy=this.y-mouse.y,d=Math.sqrt(dx*dx+dy*dy);if(d<110){this.bx+=dx/d*1.8;this.by+=dy/d*1.8;}}//if mouse position is available, calculate distance from fly to mouse, and if within 110 pixels, repel the fly away from the mouse by adjusting its base position in the opposite direction of the mouse, with strength based on distance (closer flies are repelled more)
  }
  draw(){//drawing logic for each fly, called every frame after update
    const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.gr*3);//create a radial gradient for the glow effect around the fly, with the color based on the fly's color and alpha, fading to transparent at the edge of the glow
    g.addColorStop(0,`rgba(${this.col},${this.al*.4})`);g.addColorStop(1,`rgba(${this.col},0)`);//add color stops to the gradient, with the inner color being the fly's color and alpha, and the outer color being fully transparent
    ctx.beginPath();ctx.arc(this.x,this.y,this.gr*3,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();//draw the glow around the fly using the radial gradient
    ctx.beginPath();ctx.arc(this.x,this.y,this.sz,0,Math.PI*2);//draw the fly itself as a solid circle with its color and alpha, on top of the glow
    ctx.fillStyle=`rgba(${this.col},${this.al})`;ctx.fill();//fill the fly with its color and alpha
  }
}
function buildParticles(){ //build the particles array based on the current theme, with a number of flies determined by the screen size to maintain performance, and each fly initialized with the init parameter to start from the edges and fly towards the center when the theme changes
  particles=[];//number of flies is based on screen size, with a cap of 85 to prevent too many flies on very large screens which can affect performance, and a minimum of 10 to ensure there are enough flies on smaller screens to create the effect
  const n=Math.min(Math.floor(W*H/13000),95);//calculate number of flies based on screen area, with a cap of 85 for performance
  for(let i=0;i<n;i++)particles.push(new Fly(true));//create new flies with init=true to start from edges and fly towards center on theme change
}
buildParticles();//initial build of particles when page loads, with init=true to have them fly in from edges towards center

(function loop(){//main animation loop, called every frame using requestAnimationFrame for smooth animation and better performance, with ctx.clearRect to clear the canvas each frame before drawing the flies in their new positions, and also drawing lines between flies that are close to each other to create a connecting effect, with the line opacity based on distance and theme palette color
  ctx.clearRect(0,0,W,H);//clear the canvas each frame to prepare for redrawing the flies in their new positions
  const lc=document.documentElement.getAttribute('data-theme')==='light'?'0,120,64':'0,255,135';//color for the connecting lines based on theme palette
  for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){//nested loop to compare each fly with every other fly, but only once (j starts from i+1) to avoid duplicate comparisons and self-comparison, to determine if they are close enough to draw a line between them
    const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);//calculate distance between the two flies, and if they are within 82 pixels of each other, draw a line between them with opacity based on distance (closer flies have more opaque lines) and color based on theme palette, with a maximum opacity of 0.04 to keep the lines subtle and not overpower the fly visuals
    if(d<82){ctx.strokeStyle=`rgba(${lc},${(1-d/82)*.04})`;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.stroke();}//if the distance between the two flies is less than 82 pixels, draw a line between them with opacity based on distance and color based on theme palette
  }
  particles.forEach(p=>{p.update();p.draw();});//update and draw each fly every frame
  requestAnimationFrame(loop);//request the next frame to keep the animation loop going, with the browser optimizing the frame rate for better performance and smoother animation
})();