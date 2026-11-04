/**
 * SALESFORCE CELESTIAL BACKGROUND PARTICLES
 * Identical to Client Testimonials Section Atmosphere
 * Provides twinkling, drifting constellation particle dots & cosmic micro-grid
 * for:
 * 1) EVERYTHING YOU NEED TO GET MORE FROM SALESFORCE (#servicesOverview)
 * 2) WHAT CAN SALESFORCE DO FOR YOUR BUSINESS? (#useCasesSection)
 */

(function () {
  'use strict';

  function initCelestialCanvas(canvasId, containerSelector) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const container = containerSelector ? document.querySelector(containerSelector) : canvas.parentElement;
    if (!container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let isVisible = false;
    let rafId = null;

    const PARTICLE_COUNT = window.innerWidth <= 768 ? 10 : 18;

    function resizeCanvas() {
      width = container.offsetWidth || window.innerWidth;
      height = container.offsetHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (particles.length === 0) {
        initParticles();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const z = 0.28 + Math.random() * 0.72;
        const rand = Math.random();
        let color = '255, 255, 255';
        if (rand < 0.15) color = '0, 161, 224'; // Salesforce signature cyan
        else if (rand < 0.28) color = '200, 230, 255'; // Pale ice cyan
        else if (rand < 0.40) color = '216, 180, 254'; // Pale lilac

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: z,
          radius: 0.65 + z * 1.05,
          baseAlpha: 0.12 + z * 0.28,
          pulseSpeed: 0.012 + Math.random() * 0.020,
          pulsePhase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.16,
          driftY: -0.06 - Math.random() * 0.12,
          color: color
        });
      }
    }

    function updateAndDraw() {
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.pulsePhase += p.pulseSpeed;
        const pulse = Math.sin(p.pulsePhase);
        const currentAlpha = Math.max(0.06, Math.min(0.85, p.baseAlpha + pulse * 0.16));

        p.x += p.driftX;
        p.y += p.driftY;

        // Wrap around boundaries
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        // Draw particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ', ' + currentAlpha.toFixed(3) + ')';
        ctx.fill();

        // Subtle halo only for very high-depth particles
        if (p.z > 0.82) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + p.color + ', ' + (currentAlpha * 0.15).toFixed(3) + ')';
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(updateAndDraw);
    }

    function startAnimation() {
      if (!rafId && isVisible) {
        rafId = requestAnimationFrame(updateAndDraw);
      }
    }

    function stopAnimation() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    // IntersectionObserver for CPU efficiency
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              isVisible = true;
              startAnimation();
            } else {
              isVisible = false;
              stopAnimation();
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    } else {
      isVisible = true;
      startAnimation();
    }

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();
  }

  function initAllCelestialCanvases() {
    initCelestialCanvas('sfPracticeCelestialCanvas', '.sf-practice-stage');
    initCelestialCanvas('sfUsecasesCelestialCanvas', '#useCasesSection');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCelestialCanvases);
  } else {
    initAllCelestialCanvases();
  }
})();
