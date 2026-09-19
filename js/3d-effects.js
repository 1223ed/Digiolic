/**
 * DIGIOLIC — 3D INTERACTIVE LIGHTNING & CINEMATIC LIGHT FX ENGINE
 * Dynamic branched lightning bolts, electric plasma pulses, cursor sparks, 3D card tilt & particle trails.
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. DYNAMIC LIGHTNING & AMBIENT LIGHT FX CANVAS
  // ==========================================================================
  function initLightningBackground() {
    let canvas = document.getElementById('zohoLightningCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'zohoLightningCanvas';
      canvas.className = 'zoho-lightning-canvas';
      document.body.insertBefore(canvas, document.body.firstChild);
    }

    const ctx = canvas.getContext('2d');
    let width, height;
    let bolts = [];
    let sparks = [];
    let lightRays = [];
    let mouse = { x: -1000, y: -1000, lastX: 0, lastY: 0, isMoving: false };
    let mouseTimer = null;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = document.documentElement.scrollHeight || window.innerHeight;
    }

    // Lightning Bolt Generator with Organic Branching
    class LightningBolt {
      constructor(startX, startY, endX, endY, isBranch = false) {
        this.segments = [];
        this.alpha = 1.0;
        this.fadeSpeed = Math.random() * 0.035 + 0.025;
        this.color = Math.random() > 0.35 ? '#3B82F6' : '#60A5FA'; // Electric Blue / Sky
        this.glowColor = '#93C5FD';
        this.width = isBranch ? 1.5 : 2.5;

        this.generate(startX, startY, endX, endY, isBranch);
      }

      generate(startX, startY, endX, endY, isBranch) {
        const dx = endX - startX;
        const dy = endY - startY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.max(8, Math.floor(dist / 22));
        let curX = startX;
        let curY = startY;

        this.segments.push({ x: curX, y: curY });

        for (let i = 1; i < steps; i++) {
          const progress = i / steps;
          const targetX = startX + dx * progress;
          const targetY = startY + dy * progress;

          const jitter = (1 - Math.abs(progress - 0.5) * 1.5) * 35;
          const nx = targetX + (Math.random() - 0.5) * jitter;
          const ny = targetY + (Math.random() - 0.5) * jitter;

          this.segments.push({ x: nx, y: ny });

          // Chance to spawn smaller sub-branch
          if (!isBranch && Math.random() < 0.18 && bolts.length < 12) {
            const bAngle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.9;
            const bDist = (Math.random() * 0.4 + 0.2) * dist;
            const bEndX = nx + Math.cos(bAngle) * bDist;
            const bEndY = ny + Math.sin(bAngle) * bDist;
            bolts.push(new LightningBolt(nx, ny, bEndX, bEndY, true));
          }

          curX = nx;
          curY = ny;
        }

        this.segments.push({ x: endX, y: endY });
      }

      update() {
        this.alpha -= this.fadeSpeed;
        return this.alpha > 0;
      }

      draw() {
        if (this.segments.length < 2) return;

        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = this.glowColor;
        ctx.shadowBlur = 18;
        ctx.globalAlpha = Math.max(0, this.alpha);

        ctx.beginPath();
        ctx.moveTo(this.segments[0].x, this.segments[0].y);
        for (let i = 1; i < this.segments.length; i++) {
          ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }
        ctx.stroke();

        // Inner bright core
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = Math.max(1, this.width * 0.4);
        ctx.shadowBlur = 4;
        ctx.stroke();

        ctx.restore();
      }
    }

    // Interactive Spark Particles
    class Spark {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
        this.size = Math.random() * 2 + 1.5;
        this.color = Math.random() > 0.4 ? '#38BDF8' : '#84CC16';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        return this.alpha > 0;
      }

      draw() {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Ambient Flowing Light Rays
    class LightRay {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * (height > 1000 ? 1200 : height);
        this.length = Math.random() * 180 + 100;
        this.angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.2;
        this.speed = Math.random() * 1.2 + 0.6;
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.25 + 0.1;
        this.fadeIn = true;
        this.width = Math.random() * 2.5 + 1;
        this.color = Math.random() > 0.5 ? '#3B82F6' : '#10B981';
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.fadeIn) {
          this.alpha += 0.008;
          if (this.alpha >= this.maxAlpha) this.fadeIn = false;
        } else {
          this.alpha -= 0.005;
          if (this.alpha <= 0) this.reset();
        }

        if (this.x > width + 100 || this.y > height + 100) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.width;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.globalAlpha = Math.max(0, this.alpha);

        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;

        if (!Number.isFinite(this.x) || !Number.isFinite(this.y) || !Number.isFinite(endX) || !Number.isFinite(endY)) {
          ctx.restore();
          return;
        }

        const grad = ctx.createLinearGradient(this.x, this.y, endX, endY);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, this.color);
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Trigger Ambient Periodic Lightning Strike
    function triggerRandomLightning() {
      const startX = Math.random() * width;
      const startY = Math.random() * 300;
      const endX = startX + (Math.random() - 0.5) * 500;
      const endY = startY + Math.random() * 450 + 200;

      bolts.push(new LightningBolt(startX, startY, endX, endY));

      // Schedule next strike randomly between 2.5s and 5.5s
      const nextTime = Math.random() * 3000 + 2500;
      setTimeout(triggerRandomLightning, nextTime);
    }

    // Initialize initial rays
    for (let i = 0; i < 18; i++) {
      lightRays.push(new LightRay());
    }

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw light rays
      for (let i = 0; i < lightRays.length; i++) {
        lightRays[i].update();
        lightRays[i].draw();
      }

      // 2. Draw lightning bolts
      for (let i = bolts.length - 1; i >= 0; i--) {
        if (!bolts[i].update()) {
          bolts.splice(i, 1);
        } else {
          bolts[i].draw();
        }
      }

      // 3. Draw cursor sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        if (!sparks[i].update()) {
          sparks.splice(i, 1);
        } else {
          sparks[i].draw();
        }
      }

      requestAnimationFrame(animate);
    }

    // Mouse interactive electricity
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.pageY; // Absolute page Y coordinate

      const dx = mouse.x - mouse.lastX;
      const dy = mouse.y - mouse.lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 8 && sparks.length < 40) {
        sparks.push(new Spark(mouse.x, mouse.y));
        if (Math.random() < 0.25) {
          sparks.push(new Spark(mouse.x + (Math.random() - 0.5) * 10, mouse.y + (Math.random() - 0.5) * 10));
        }
      }

      mouse.lastX = mouse.x;
      mouse.lastY = mouse.y;

      clearTimeout(mouseTimer);
      mouseTimer = setTimeout(() => {
        mouse.isMoving = false;
      }, 100);
    });

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', () => {
      // Recheck height on dynamic content expansion
      if (Math.abs(canvas.height - document.documentElement.scrollHeight) > 200) {
        resize();
      }
    });

    resize();
    setTimeout(triggerRandomLightning, 1200);
    animate();
  }

  // ==========================================================================
  // 2. 3D CARD TILT & DEPTH
  // ==========================================================================
  function init3DTiltCards() {
    const tiltElements = document.querySelectorAll('.zoho-hero-video-box, .delivery-box-card, .testimonial-card, .zoho-rect-card');

    tiltElements.forEach((el) => {
      let isHovered = false;

      el.addEventListener('mouseenter', () => {
        isHovered = true;
        el.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
      });

      el.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      el.addEventListener('mouseleave', () => {
        isHovered = false;
        el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease';
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // ==========================================================================
  // 3. CURSOR PARALLAX ON AMBIENT ORBS
  // ==========================================================================
  function init3DDepthParallax() {
    const floatingOrbs = document.querySelectorAll('.zoho-3d-orb');
    if (!floatingOrbs.length) return;

    window.addEventListener('mousemove', (e) => {
      const xRatio = (e.clientX / window.innerWidth - 0.5) * 24;
      const yRatio = (e.clientY / window.innerHeight - 0.5) * 24;

      floatingOrbs.forEach((orb, idx) => {
        const speed = (idx + 1) * 0.7;
        orb.style.transform = `translate3d(${xRatio * speed}px, ${yRatio * speed}px, 0)`;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLightningBackground();
      init3DTiltCards();
      init3DDepthParallax();
    });
  } else {
    initLightningBackground();
    init3DTiltCards();
    init3DDepthParallax();
  }
})();
