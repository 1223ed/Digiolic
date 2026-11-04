/**
 * Zoho Hero Ambient Floating Dots / Stardust Canvas
 * Creates a subtle, elegant constellation of small randomly floating light particles.
 * Sparse, lightweight, 60fps ambient drift matching the video lighting.
 */
(function() {
  function initHeroDots() {
    const hero = document.getElementById('zohoHero');
    const canvas = document.getElementById('zohoHeroDotsCanvas');
    if (!hero || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId = null;
    let isVisible = true;

    // Resize canvas to match hero section
    function resize() {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.scale(dpr, dpr);
    }

    // Particle configuration - "few dots only" (sparse & delicate)
    const PARTICLE_COUNT = 32;
    const particles = [];

    class StarDot {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * (width || window.innerWidth);
        this.y = initial ? Math.random() * (height || window.innerHeight) : height + Math.random() * 20;
        
        // Small sizes (0.8px to 2.4px)
        const rand = Math.random();
        if (rand < 0.6) {
          this.radius = 0.8 + Math.random() * 0.6; // Tiny stardust
        } else if (rand < 0.9) {
          this.radius = 1.4 + Math.random() * 0.7; // Medium particle
        } else {
          this.radius = 2.1 + Math.random() * 0.6; // Subtle glowing beacon
        }

        // Random subtle upward & horizontal floating drift
        this.vx = (Math.random() - 0.5) * 0.22;
        this.vy = -(0.12 + Math.random() * 0.28); // gentle upward float

        // Twinkling / pulsing opacity
        this.baseAlpha = 0.35 + Math.random() * 0.50;
        this.alpha = this.baseAlpha;
        this.pulseAngle = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.015 + Math.random() * 0.025;

        // Subtle horizontal wave wobble
        this.wobbleAngle = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.01 + Math.random() * 0.02;
        this.wobbleAmp = 0.15 + Math.random() * 0.25;

        // Color: predominantly crisp white with soft lavender/cyan tint
        const cRand = Math.random();
        if (cRand < 0.65) {
          this.color = '255, 255, 255';
        } else if (cRand < 0.85) {
          this.color = '225, 215, 255'; // lavender
        } else {
          this.color = '205, 235, 255'; // soft cyan
        }
      }

      update() {
        this.pulseAngle += this.pulseSpeed;
        this.wobbleAngle += this.wobbleSpeed;

        // Twinkle alpha
        this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.22;
        this.alpha = Math.max(0.15, Math.min(0.95, this.alpha));

        // Float position with subtle natural wobble
        this.x += this.vx + Math.sin(this.wobbleAngle) * this.wobbleAmp;
        this.y += this.vy;

        // Wrap around top boundary
        if (this.y < -15) {
          this.y = height + 10;
          this.x = Math.random() * width;
        }

        // Wrap around horizontal boundaries
        if (this.x < -15) this.x = width + 15;
        if (this.x > width + 15) this.x = -15;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

        // Soft glow for slightly larger particles
        if (this.radius > 1.4) {
          ctx.shadowBlur = this.radius * 3.5;
          ctx.shadowColor = `rgba(${this.color}, ${this.alpha * 0.75})`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize
    resize();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new StarDot());
    }

    // Animation Loop
    function animate() {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    // Pause rendering when hero is out of viewport to save CPU/GPU
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(hero);
    }

    window.addEventListener('resize', () => {
      resize();
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroDots);
  } else {
    initHeroDots();
  }
})();
