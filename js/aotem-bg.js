/* AOTEM portfolio background — glowing particle wave field.
   Usage (paste before </body> on your site):
     <script type="module" src="js/aotem-bg.js"></script>
   Optional config (set BEFORE the script tag):
     <script>window.AOTEM_BG = { accent: '#fbbf24' };</script>
   The canvas sits behind everything (z-index 0, pointer-events none).
   Make sure your hero/section backgrounds are transparent (background: transparent)
   or the canvas will be hidden behind them. */
import * as THREE from './vendor/three.module.min.js';

const cfg = Object.assign({
  accent: '#fbbf24',
  background: null, // null = transparent canvas over your page bg; or a hex like '#0c0c0d'
}, window.AOTEM_BG || {});

const YELLOW = new THREE.Color(cfg.accent);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 768px)').matches;

const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: cfg.background === null });
renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
renderer.setSize(innerWidth, innerHeight);
Object.assign(renderer.domElement.style, {
  position: 'fixed', inset: '0', zIndex: '0', pointerEvents: 'none'
});
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
if (cfg.background) {
  scene.background = new THREE.Color(cfg.background);
  scene.fog = new THREE.FogExp2(cfg.background, 0.055);
}
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);

let mx = 0, my = 0, smx = 0, smy = 0;
addEventListener('pointermove', e => {
  mx = (e.clientX / innerWidth) * 2 - 1;
  my = (e.clientY / innerHeight) * 2 - 1;
});
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* wave field */
const GW = isMobile ? 80 : 120, GH = isMobile ? 46 : 70;
const wGeo = new THREE.BufferGeometry();
const wPos = new Float32Array(GW * GH * 3);
const wCol = new Float32Array(GW * GH * 3);
for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
  const k = (j * GW + i) * 3;
  wPos[k] = (i / (GW - 1) - 0.5) * 26;
  wPos[k + 1] = 0;
  wPos[k + 2] = (j / (GH - 1) - 0.5) * 16;
}
wGeo.setAttribute('position', new THREE.BufferAttribute(wPos, 3));
wGeo.setAttribute('color', new THREE.BufferAttribute(wCol, 3));
const waves = new THREE.Points(wGeo, new THREE.PointsMaterial({
  size: 0.05, vertexColors: true, transparent: true, opacity: 0.9,
  blending: THREE.AdditiveBlending, depthWrite: false }));
waves.position.y = -1.2;
scene.add(waves);
const dim = new THREE.Color(0x35322b);

const clock = new THREE.Clock();
let raf;
function loop() {
  raf = requestAnimationFrame(loop);
  const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
  smx += (mx - smx) * 0.05; smy += (my - smy) * 0.05;
  camera.position.set(smx * 0.8, 1.2 - smy * 0.8, 8.5);
  camera.lookAt(0.6, 0, 0);

  const pos = wGeo.attributes.position, col = wGeo.attributes.color;
  for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) {
    const k = j * GW + i, x = wPos[k * 3], z = wPos[k * 3 + 2];
    const h = Math.sin(x * 0.5 + t * 1.2) * 0.4 + Math.cos(z * 0.7 + t * 0.9) * 0.35
      + Math.sin((x + z) * 0.3 + t * 0.6) * 0.25;
    pos.setY(k, h);
    const glow = Math.max(0, Math.min(1, (h + 0.4) * 0.7));
    col.setXYZ(k,
      dim.r + (YELLOW.r - dim.r) * glow,
      dim.g + (YELLOW.g - dim.g) * glow,
      dim.b + (YELLOW.b - dim.b) * glow);
  }
  pos.needsUpdate = true; col.needsUpdate = true;

  renderer.render(scene, camera);
}
if (reduced) { renderer.render(scene, camera); } else { loop(); }
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(raf); }
  else if (!reduced) { clock.getDelta(); loop(); }
});
