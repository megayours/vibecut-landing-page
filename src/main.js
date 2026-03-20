import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════
   PARTICLES — floating dots background
   ═══════════════════════════════════════ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: ['#ff8717', '#ffb347', '#f5c842'][Math.floor(Math.random() * 3)],
      alpha: Math.random() * 0.15 + 0.05,
    });
  }
}
createParticles();

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ═══════════════════════════════════════
   HERO entrance
   ═══════════════════════════════════════ */
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .to('.hero__wordmark', { opacity: 1, duration: 0.8, delay: 0.3 })
  .to('.hero__title', { opacity: 1, y: 0, duration: 1 }, '-=0.4')
  .to('.hero__sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
  .to('.hero__cta', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');

/* ═══════════════════════════════════════
   REVEAL on scroll
   ═══════════════════════════════════════ */
document.querySelectorAll('.reveal').forEach((el, i) => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none',
    },
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    delay: (i % 3) * 0.1,
  });
});

/* ═══════════════════════════════════════
   PARALLAX hero video
   ═══════════════════════════════════════ */
gsap.to('.hero__video', {
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
  scale: 1.15,
  ease: 'none',
});

/* ═══════════════════════════════════════
   HOW IT WORKS — 3D rotating ring
   ═══════════════════════════════════════ */
const ring = document.querySelector('.how__ring');
const howCards = [...document.querySelectorAll('.how__card')];
const prevBtn = document.querySelector('.how__nav-btn--prev');
const nextBtn = document.querySelector('.how__nav-btn--next');
const progressFill = document.querySelector('.how__progress-fill');
const howLabel = document.querySelector('.how__label');
const TOTAL = howCards.length;
const ANGLE_STEP = 360 / TOTAL;

let currentIndex = 0;
let autoTimer = null;
let isAnimating = false;

// compute radius based on viewport
function getRadius() {
  if (window.innerWidth >= 960) return 420;
  if (window.innerWidth >= 640) return 350;
  return 280;
}

// position cards in a circle
function layoutRing() {
  const radius = getRadius();
  howCards.forEach((card, i) => {
    const angle = (i * ANGLE_STEP) * (Math.PI / 180);
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    gsap.set(card, {
      x: x,
      z: z,
      rotationY: i * ANGLE_STEP,
    });
  });
}

function updateRing(animated = true) {
  if (isAnimating && animated) return;
  isAnimating = true;

  const rotation = -currentIndex * ANGLE_STEP;

  gsap.to(ring, {
    rotationY: rotation,
    duration: animated ? 0.9 : 0,
    ease: 'power3.inOut',
    onComplete: () => { isAnimating = false; },
  });

  // update active state
  howCards.forEach((card, i) => {
    card.classList.toggle('active', i === currentIndex);
  });

  // update progress
  const progress = ((currentIndex + 1) / TOTAL) * 100;
  gsap.to(progressFill, {
    width: `${progress}%`,
    duration: 0.6,
    ease: 'power2.out',
  });

  // update label
  const labels = [
    'Step 1 of 6 — Intent',
    'Step 2 of 6 — Structure',
    'Step 3 of 6 — Edit',
    'Step 4 of 6 — Learn',
    'Step 5 of 6 — Automate',
    'Step 6 of 6 — Optimise',
  ];
  howLabel.textContent = labels[currentIndex];
}

function goTo(index) {
  currentIndex = ((index % TOTAL) + TOTAL) % TOTAL;
  updateRing();
}

function next() { goTo(currentIndex + 1); }
function prev() { goTo(currentIndex - 1); }

function startAuto() {
  stopAuto();
  autoTimer = setInterval(next, 4000);
}
function stopAuto() {
  if (autoTimer) clearInterval(autoTimer);
}

prevBtn.addEventListener('click', () => { prev(); startAuto(); });
nextBtn.addEventListener('click', () => { next(); startAuto(); });

// click on card to select it
howCards.forEach((card, i) => {
  card.addEventListener('click', () => { goTo(i); startAuto(); });
});

// swipe support
let touchStartX = 0;
const scene = document.querySelector('.how__scene');
scene.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  stopAuto();
}, { passive: true });

scene.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    diff > 0 ? next() : prev();
  }
  startAuto();
}, { passive: true });

// keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') { next(); startAuto(); }
  if (e.key === 'ArrowLeft') { prev(); startAuto(); }
});

// init — fully visible from the start, no entrance animation
layoutRing();
updateRing(false);
startAuto();

window.addEventListener('resize', () => {
  layoutRing();
  updateRing(false);
});

// pause when out of view
ScrollTrigger.create({
  trigger: '.how',
  start: 'top bottom',
  end: 'bottom top',
  onEnter: startAuto,
  onLeave: stopAuto,
  onEnterBack: startAuto,
  onLeaveBack: stopAuto,
});

/* ═══════════════════════════════════════
   CURSOR GLOW (desktop)
   ═══════════════════════════════════════ */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,135,23,0.07) 0%, rgba(245,200,66,0.03) 40%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: '0',
    transform: 'translate(-50%, -50%)',
    willChange: 'left, top',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    gsap.to(glow, {
      left: e.clientX,
      top: e.clientY,
      duration: 0.6,
      ease: 'power2.out',
    });
  });
}
