const ASSETS = {
  startImage: "assets/rose_start.jpeg",
  offerVideo: "assets/rose_offer.mp4",
};

const startImage = document.getElementById("startImage");
const offerVideo = document.getElementById("offerVideo");
const yesBtn = document.getElementById("yesBtn");
const ctaLayer = document.getElementById("ctaLayer");
const textOverlay = document.getElementById("textOverlay");
const fxCanvas = document.getElementById("fxCanvas");

startImage.src = ASSETS.startImage;
offerVideo.src = ASSETS.offerVideo;

const preloadImage = new Image();
preloadImage.src = ASSETS.startImage;
preloadImage.addEventListener("error", () => {
  console.error(`Missing asset: ${ASSETS.startImage}`);
});
startImage.addEventListener("error", () => {
  console.error(`Missing asset: ${ASSETS.startImage}`);
});

const preloadVideo = document.createElement("video");
preloadVideo.preload = "auto";
preloadVideo.src = ASSETS.offerVideo;
preloadVideo.addEventListener("error", () => {
  console.error(`Missing asset: ${ASSETS.offerVideo}`);
});

offerVideo.addEventListener("error", () => {
  console.error(`Missing asset: ${ASSETS.offerVideo}`);
});

let fxActive = false;
let fxStopTime = 0;

yesBtn.addEventListener("click", async () => {
  document.body.classList.add("state-playing");
  ctaLayer.classList.add("cta-hidden");
  textOverlay.classList.add("text-on");
  startFx();

  try{
    await offerVideo.play();
  }catch(err){
    console.error("Video playback failed:", err);
  }
});

offerVideo.addEventListener("ended", () => {
  fxStopTime = performance.now() + 1400;
  setTimeout(() => {
    fxCanvas.classList.add("fx-fade");
    setTimeout(stopFx, 900);
  }, 1400);
});

function startFx(){
  if (fxActive) return;
  fxActive = true;
  fxStopTime = 0;
  fxCanvas.classList.add("fx-on");
  fxCanvas.classList.remove("fx-fade");
  resizeCanvas();
  createParticles();
  tick();
}

function stopFx(){
  fxActive = false;
}

const ctx = fxCanvas.getContext("2d");
let w = 0;
let h = 0;
let dpr = Math.max(1, window.devicePixelRatio || 1);
const petals = [];
const glitters = [];

function resizeCanvas(){
  dpr = Math.max(1, window.devicePixelRatio || 1);
  w = fxCanvas.clientWidth;
  h = fxCanvas.clientHeight;
  fxCanvas.width = Math.floor(w * dpr);
  fxCanvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", () => {
  resizeCanvas();
});

function createParticles(){
  petals.length = 0;
  glitters.length = 0;

  const petalCount = Math.min(70, Math.floor((w * h) / 18000));
  const glitterCount = Math.min(90, Math.floor((w * h) / 14000));

  for (let i = 0; i < petalCount; i++){
    petals.push(makePetal(true));
  }
  for (let i = 0; i < glitterCount; i++){
    glitters.push(makeGlitter(true));
  }
}

function makePetal(randomY){
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : -30 - Math.random() * 80,
    r: 6 + Math.random() * 7,
    drift: (Math.random() * 0.6 + 0.2) * (Math.random() < 0.5 ? -1 : 1),
    speed: 0.6 + Math.random() * 0.9,
    spin: Math.random() * Math.PI,
    spinSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() < 0.5 ? -1 : 1),
    hue: 340 + Math.random() * 10,
  };
}

function makeGlitter(randomY){
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : -20 - Math.random() * 60,
    r: 1 + Math.random() * 2.4,
    speed: 0.4 + Math.random() * 0.7,
    alpha: 0.25 + Math.random() * 0.35,
    twinkle: Math.random() * Math.PI * 2,
  };
}

function tick(){
  if (!fxActive) return;

  ctx.clearRect(0, 0, w, h);
  const now = performance.now();
  const emitOn = !fxStopTime || now < fxStopTime;

  for (let i = 0; i < petals.length; i++){
    const p = petals[i];
    p.y += p.speed;
    p.x += p.drift;
    p.spin += p.spinSpeed;

    if (p.y > h + 40){
      if (emitOn){
        petals[i] = makePetal(false);
        petals[i].y = -40;
      }else{
        p.y = h + 1000;
        p.speed = 0;
      }
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.spin);
    ctx.fillStyle = `hsla(${p.hue}, 78%, 60%, 0.9)`;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r * 1.4, p.r, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (let i = 0; i < glitters.length; i++){
    const g = glitters[i];
    g.y += g.speed;
    g.twinkle += 0.06;
    const alpha = g.alpha + Math.sin(g.twinkle) * 0.15;

    if (g.y > h + 20){
      if (emitOn){
        glitters[i] = makeGlitter(false);
        glitters[i].y = -20;
      }else{
        g.y = h + 1000;
        g.speed = 0;
      }
    }

    ctx.fillStyle = `rgba(255, 241, 230, ${Math.max(0, alpha)})`;
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(tick);
}
