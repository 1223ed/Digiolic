/**
 * Case Stories - Enterprise Client Showcase (NK Atmospheric Particle Engine)
 * Subtle, high-performance stardust & ambient celestial drift matching the /nk video aesthetic.
 */
(function () {
  'use strict';

  function initNKClientCanvas() {
    const section = document.getElementById('clientsShowcase');
    const canvas = document.getElementById('clientsParticleCanvas');
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = null;
    let isVisible = false;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Resize canvas precisely to section dimensions
    function resize() {
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (prefersReducedMotion) {
        drawStatic();
      }
    }

    const PARTICLE_COUNT = 42;
    const particles = [];

    const COLOR_PALETTE = [
      { r: 0, g: 229, b: 163 },   // Electric Mint (#00E5A3)
      { r: 45, g: 212, b: 191 },  // Vibrant Teal (#2DD4BF)
      { r: 56, g: 189, b: 248 },  // Electric Cyan (#38BDF8)
      { r: 240, g: 253, b: 250 }  // Soft Radiant Starlight
    ];

    class NKStarParticle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * (width || window.innerWidth);
        this.y = initial ? Math.random() * (height || 800) : height + Math.random() * 20;

        const rand = Math.random();
        if (rand < 0.6) {
          this.baseRadius = 0.75 + Math.random() * 0.5; // Fine stardust
        } else if (rand < 0.88) {
          this.baseRadius = 1.3 + Math.random() * 0.6;  // Mid glow particle
        } else {
          this.baseRadius = 2.0 + Math.random() * 0.7;  // Radiant luminary
        }

        this.vx = (Math.random() - 0.5) * 0.22;
        this.vy = -(0.14 + Math.random() * 0.28); // Gentle upward drift

        this.color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
        this.baseAlpha = 0.25 + Math.random() * 0.55;
        this.pulseSpeed = 0.012 + Math.random() * 0.024;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += this.pulseSpeed;

        // Wrap around horizontally with a generous margin
        if (this.x < -20) this.x = width + 20;
        else if (this.x > width + 20) this.x = -20;

        // Reset if floated above top
        if (this.y < -20) {
          this.reset(false);
        }
      }

      draw() {
        const pulse = Math.sin(this.phase);
        const currentAlpha = Math.max(0.1, Math.min(1.0, this.baseAlpha + pulse * 0.25));
        const currentRadius = this.baseRadius * (0.9 + pulse * 0.15);

        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);

        if (this.baseRadius > 1.6) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.7)`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${currentAlpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new NKStarParticle());
      }
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
      }
    }

    function loop() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animId = requestAnimationFrame(loop);
    }

    function start() {
      if (prefersReducedMotion) return;
      if (!animId) {
        animId = requestAnimationFrame(loop);
      }
    }

    function stop() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    // IntersectionObserver to run loop strictly when section is visible
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isVisible = true;
              start();
            } else {
              isVisible = false;
              stop();
            }
          });
        },
        { threshold: 0.05 }
      );
      observer.observe(section);
    } else {
      isVisible = true;
      start();
    }

    let resizeTimer = null;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          resize();
        }, 150);
      },
      { passive: true }
    );

    // Initial setup
    resize();
    initParticles();
    if (prefersReducedMotion) {
      drawStatic();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNKClientCanvas);
  } else {
    initNKClientCanvas();
  }
})();
