// ======= GLOBAL VARIABLES =======
let particles = [];
let toastTimer;
let starCanvas, sCtx, fwCanvas, fCtx;

// ======= INITIALIZATION =======
window.addEventListener('DOMContentLoaded',()=>{
  // Initialize canvases
  starCanvas = document.getElementById('stars-canvas');
  sCtx = starCanvas ? starCanvas.getContext('2d') : null;
  fwCanvas = document.getElementById('fw-canvas');
  fCtx = fwCanvas ? fwCanvas.getContext('2d') : null;
  
  // Start animations only if canvases are available
  if (starCanvas && sCtx) {
    resizeStars();
    requestAnimationFrame(drawStars);
    window.addEventListener('resize',resizeStars);
  }
  
  if (fwCanvas && fCtx) {
    fwCanvas.width = innerWidth;
    fwCanvas.height = innerHeight;
    window.addEventListener('resize',()=>{fwCanvas.width=innerWidth;fwCanvas.height=innerHeight;});
    animateFW();
  }
  
  createSparks();
  
  // Load from URL
  const params=new URLSearchParams(location.search);
  const name=params.get('name');
  if(name&&name.trim()){
    const displayName=decodeURIComponent(name).trim();
    document.getElementById('gen-section').style.display='none';
    const ws=document.getElementById('wish-section');
    ws.classList.add('visible');
    document.getElementById('wish-heading').textContent=`Eid Mubarak, ${displayName}! `;
    document.getElementById('wish-sub').textContent=`A special wish has been sent for you with love `;
    document.getElementById('wish-msg').textContent=
      `Dear ${displayName}, on this joyful occasion of Eid, may Allah bless you with happiness beyond measure, grant you health, prosperity, and peace. May your home be filled with laughter, your heart with gratitude, and your days with endless blessings. Eid Mubarak to you and your loved ones! 🌟`;
    setTimeout(()=>{launchFireworks(4);launchBalloons();},600);
    setTimeout(()=>launchFireworks(3),2000);
  }
});

// ======= PARTICLE CLASS =======
class Particle{
  constructor(x,y,color){
    this.x=x;this.y=y;
    this.color=color;
    const angle=Math.random()*Math.PI*2;
    const speed=2+Math.random()*5;
    this.vx=Math.cos(angle)*speed;
    this.vy=Math.sin(angle)*speed;
    this.gravity=0.08;
    this.life=1;
    this.decay=0.012+Math.random()*0.018;
    this.r=2+Math.random()*2;
  }
  update(){
    this.x+=this.vx;this.y+=this.vy;
    this.vy+=this.gravity;
    this.vx*=0.98;
    this.life-=this.decay;
  }
  draw(){
    fCtx.beginPath();
    fCtx.arc(this.x,this.y,this.r,0,Math.PI*2);
    fCtx.fillStyle=this.color.replace('1)',this.life+')');
    fCtx.fill();
  }
}

// ======= STARS =======
let stars = [];
function resizeStars(){
  if (!starCanvas || !sCtx) return;
  starCanvas.width = innerWidth;
  starCanvas.height = innerHeight;
  stars = [];
  for(let i=0;i<160;i++){
    stars.push({
      x: Math.random()*innerWidth,
      y: Math.random()*innerHeight,
      r: Math.random()*1.5+0.3,
      a: Math.random(),
      speed: Math.random()*0.008+0.003,
      phase: Math.random()*Math.PI*2
    });
  }
}
function drawStars(t){
  if (!sCtx) return;
  sCtx.clearRect(0,0,starCanvas.width,starCanvas.height);
  stars.forEach(s=>{
    s.a = 0.3+0.7*Math.abs(Math.sin(t*s.speed+s.phase));
    sCtx.beginPath();
    sCtx.arc(s.x,s.y,s.r,0,Math.PI*2);
    sCtx.fillStyle=`rgba(255,255,220,${s.a})`;
    sCtx.fill();
  });
  requestAnimationFrame(drawStars);
}

// ======= SPARKS =======
function createSparks(){
  for(let i=0;i<35;i++){
    const s=document.createElement('div');
    s.className='spark';
    s.style.left=Math.random()*100+'vw';
    const dur=4+Math.random()*5;
    s.style.animationDuration=dur+'s';
    s.style.animationDelay=Math.random()*8+'s';
    document.body.appendChild(s);
  }
}

// ======= FIREWORKS =======
function burst(x,y){
  if (!fCtx) return;
  const colors=['rgba(250,204,21,','rgba(253,230,138,','rgba(255,255,255,','rgba(13,148,136,','rgba(251,191,36,'];
  for(let i=0;i<80;i++) particles.push(new Particle(x,y,colors[Math.floor(Math.random()*colors.length)]));
}
function animateFW(){
  if (!fCtx) return;
  fCtx.clearRect(0,0,fwCanvas.width,fwCanvas.height);
  particles=particles.filter(p=>{
    p.update();p.draw();return p.life>0;
  });
  requestAnimationFrame(animateFW);
}

function launchFireworks(count=3){
  for(let i=0;i<count;i++){
    setTimeout(()=>{
      burst(innerWidth*0.2+Math.random()*innerWidth*0.6, innerHeight*0.1+Math.random()*innerHeight*0.4);
    },i*400);
  }
}

// ======= BALLOONS =======
function launchBalloons(){
  const colors=['#facc15','#fde68a','#0d9488','#f59e0b','#ffffff','#6ee7b7'];
  for(let i=0;i<8;i++){
    setTimeout(()=>{
      const b=document.createElement('div');
      b.className='balloon';
      b.style.left=Math.random()*90+'vw';
      const color=colors[Math.floor(Math.random()*colors.length)];
      const size=40+Math.random()*30;
      b.innerHTML=`<svg width="${size}" height="${size*1.3}" viewBox="0 0 40 52"><ellipse cx="20" cy="18" rx="16" ry="18" fill="${color}" opacity="0.85"/><polygon points="20,36 17,44 23,44" fill="${color}" opacity="0.85"/><line x1="20" y1="44" x2="20" y2="52" stroke="${color}" stroke-width="1" opacity="0.6"/></svg>`;
      const dur=4+Math.random()*4;
      b.style.animationDuration=dur+'s';
      b.style.animationDelay='0s';
      document.body.appendChild(b);
      setTimeout(()=>b.remove(),dur*1000+500);
    },i*300);
  }
}

// ======= CONFETTI =======
function launchConfetti(){
  const colors=['#facc15','#fde68a','#0d9488','#f59e0b','#6ee7b7','#ffffff'];
  for(let i=0;i<60;i++){
    const c=document.createElement('div');
    c.style.cssText=`position:fixed;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}vw;top:-20px;z-index:999;border-radius:${Math.random()>0.5?'50%':'2px'};opacity:${0.7+Math.random()*0.3};pointer-events:none;`;
    const dur=1.5+Math.random()*2;
    c.style.animation=`confettiFall ${dur}s ease-in forwards`;
    c.style.animationDelay=Math.random()*0.8+'s';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),(dur+0.8)*1000+200);
  }
}
const confettiStyle=document.createElement('style');
confettiStyle.textContent=`@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(${Math.random()>0.5?'':'- '}720deg);opacity:0}}`;
document.head.appendChild(confettiStyle);

// ======= GENERATE WISH =======
async function generateWish(){
  const name=document.getElementById('name-input').value.trim();
  if(!name){showToast('Please enter a name 🌙');return;}
  const url=`${location.origin}${location.pathname}?name=${encodeURIComponent(name)}`;
  document.getElementById('share-url-text').textContent=url;
  document.getElementById('wa-btn').dataset.url=url;
  document.getElementById('wa-btn').dataset.name=name;
  const panel=document.getElementById('share-panel');
  panel.style.display='block';
  launchFireworks(2);
  showToast('✨ Your wish link is ready!');

  // Debug: Check if db is available
  console.log("Checking window.db:", window.db);
  if (!window.db) {
    console.error("Firebase db not initialized");
    return;
  }

  // Save to Firebase
  try {
    // console.log("Attempting to save:", { username: name, date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString() });
    const docRef = await window.db.collection("wishes").add({
      username: name,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      time: new Date().toLocaleTimeString()
    });
    // console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

function copyLink(){
  const url=document.getElementById('share-url-text').textContent;
  copyToClipboard(url);
}
function shareWA(){
  const btn=document.getElementById('wa-btn');
  const url=btn.dataset.url||location.href;
  const name=btn.dataset.name||'You';
  window.open(`https://wa.me/?text=${encodeURIComponent(`🌙 Eid Mubarak ${name}! Here's your special Eid wish 💛 ${url}`)}`,'_blank');
}
function copyCurrentLink(){copyToClipboard(location.href)}
function shareWACurrent(){
  const name=new URLSearchParams(location.search).get('name')||'You';
  window.open(`https://wa.me/?text=${encodeURIComponent(`🌙 Eid Mubarak ${name}! Here's your special Eid wish 💛 ${location.href}`)}`,'_blank');
}
function makeNewWish(){
  history.pushState({},'',location.pathname);
  document.getElementById('wish-section').classList.remove('visible');
  document.getElementById('gen-section').style.display='flex';
  document.getElementById('name-input').value='';
  document.getElementById('share-panel').style.display='none';
}

function copyToClipboard(text){
  navigator.clipboard.writeText(text).then(()=>showToast('Link copied! 🎉')).catch(()=>{
    const el=document.createElement('textarea');
    el.value=text;document.body.appendChild(el);el.select();
    document.execCommand('copy');document.body.removeChild(el);
    showToast('Link copied! 🎉');
  });
}

// ======= SURPRISE =======
function triggerSurprise(){
  launchFireworks(5);
  launchBalloons();
  launchConfetti();
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal(e){
  if(!e||e.target===document.getElementById('modal-overlay')||e.currentTarget!==document.getElementById('modal-overlay')){
    document.getElementById('modal-overlay').classList.remove('open');
  }
}

// ======= TOAST =======
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
}
