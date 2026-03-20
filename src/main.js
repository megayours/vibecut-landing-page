import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── hero entrance ── */
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

heroTl
  .to('.hero__wordmark', { opacity: 1, duration: 0.8, delay: 0.3 })
  .to('.hero__title', { opacity: 1, y: 0, duration: 1 }, '-=0.4')
  .to('.hero__sub', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
  .to('.hero__cta', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');

/* ── reveal on scroll ── */
const reveals = document.querySelectorAll('.reveal');

reveals.forEach((el, i) => {
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
    delay: (i % 3) * 0.1, // stagger within viewport groups
  });
});

/* ── parallax on hero video ── */
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

/* ── floating glow that follows cursor (desktop only) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,135,23,0.12) 0%, transparent 70%)',
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
