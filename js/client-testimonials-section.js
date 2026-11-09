/**
 * CLIENT TESTIMONIALS MASTER SECTION CONTROLLER
 * - Monumental character-by-character upward wave emergence
 * - Dynamic slide-in from off-screen right over the architectural hero backdrop
 * - Silky 60fps lerped continuous horizontal scrolling through all 4 client reviews
 * - Dynamic active card focus, 3D hover tilt, progress bar and counter synchronization
 */

(function () {
  'use strict';

  function initClientTestimonialsSection() {
    const section = document.getElementById('clientTestimonialsSection');
    if (!section) return;

    const heroStage = document.getElementById('ctHeroStage');
    const pillBadge = document.getElementById('ctPillBadge');
    const titleLine1 = document.getElementById('ctTitleLine1');
    const titleLine2 = document.getElementById('ctTitleLine2');
    const leadDesc = document.getElementById('ctLeadDesc');
    const scrollPrompt = document.getElementById('ctScrollPrompt');

    const track = document.getElementById('ctCardsTrack');
    const cards = Array.from(section.querySelectorAll('.t-card-wrapper'));
    const progressBar = document.getElementById('ctProgressBarFill');
    const counterCurrent = document.getElementById('ctCounterCurrent');

    if (!track || cards.length === 0) return;

    // Split text lines into individual .ct-char spans
    function splitLineToChars(lineEl) {
      if (!lineEl || lineEl.dataset.splitDone) return [];
      const text = lineEl.textContent.trim();
      lineEl.innerHTML = '';
      const charSpans = [];

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const span = document.createElement('span');
        span.className = 'ct-char' + (char === ' ' ? ' space' : '');
        span.textContent = char;
        lineEl.appendChild(span);
        charSpans.push(span);
      }
      lineEl.dataset.splitDone = 'true';
      return charSpans;
    }

    const chars1 = splitLineToChars(titleLine1);
    const chars2 = splitLineToChars(titleLine2);
    const allChars = [...chars1, ...chars2];

    // Physics & Scroll State
    let currentProgress = 0;
    let targetProgress = 0;
    let currentTrackX = window.innerWidth;
    let targetTrackX = window.innerWidth;
    let isTicking = false;
    let rafId = null;

    // Cache layout dimensions
    let scrollDistance = 1;
    let totalTrackTravel = 0;
    let hiddenRightOffset = window.innerWidth;

    function updateMetrics() {
      scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);

      // Track scroll range: from 0 (Card 1 centered) to -totalTrackTravel (Card 4 centered)
      const viewportWidth = window.innerWidth;
      totalTrackTravel = Math.max(0, track.scrollWidth - viewportWidth);

      // Exact offset needed to put Card 1 just off-screen to the right
      const firstCard = cards[0];
      const cardRect = firstCard.getBoundingClientRect();
      const cardWidth = cardRect.width || Math.min(1120, Math.max(700, viewportWidth * 0.7));
      const paddingLeft = Math.max(24, (viewportWidth - cardWidth) / 2);
      hiddenRightOffset = (viewportWidth - paddingLeft) + 40;
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function easeOutQuad(t) {
      return 1 - (1 - t) * (1 - t);
    }

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    // Bulletproof progress calculation using getBoundingClientRect().top
    // Immune to page scroll restoration and dynamic layout shifts!
    function calculateProgress() {
      const rect = section.getBoundingClientRect();
      const relativeY = -rect.top;
      return clamp(relativeY / scrollDistance, 0, 1);
    }

    // Main 60fps render loop with lerp
    function render() {
      currentProgress += (targetProgress - currentProgress) * 0.12;
      currentTrackX += (targetTrackX - currentTrackX) * 0.12;

      const p = currentProgress;

      // -------------------------------------------------------------
      // 1. CHARACTER WAVE ENTRANCE (p: 0.00 -> 0.18)
      // -------------------------------------------------------------
      const totalChars = allChars.length;
      allChars.forEach((charEl, idx) => {
        const charStart = (idx / totalChars) * 0.10;
        const charEnd = charStart + 0.06;
        const charP = clamp((p - charStart) / (charEnd - charStart), 0, 1);

        const translateY = (1 - easeOutQuad(charP)) * 115;
        const opacity = charP;

        charEl.style.transform = `translate3d(0, ${translateY.toFixed(2)}%, 0)`;
        charEl.style.opacity = opacity.toFixed(3);
      });

      // Badge, description, and scroll prompt reveal
      if (pillBadge) {
        const badgeP = clamp((p - 0.04) / 0.07, 0, 1);
        const fadeOut = clamp((p - 0.28) / 0.08, 0, 1);
        pillBadge.style.opacity = Math.max(0, badgeP - fadeOut).toFixed(3);
        pillBadge.style.transform = `translate3d(0, ${((1 - badgeP) * 20).toFixed(1)}px, 0)`;
      }

      if (leadDesc) {
        const descP = clamp((p - 0.07) / 0.08, 0, 1);
        const fadeOut = clamp((p - 0.30) / 0.08, 0, 1);
        leadDesc.style.opacity = Math.max(0, descP - fadeOut).toFixed(3);
        leadDesc.style.transform = `translate3d(0, ${((1 - descP) * 20).toFixed(1)}px, 0)`;
      }

      if (scrollPrompt) {
        const promptP = clamp((p - 0.09) / 0.07, 0, 1);
        const fadeOut = clamp((p - 0.24) / 0.06, 0, 1);
        scrollPrompt.style.opacity = Math.max(0, promptP - fadeOut).toFixed(3);
      }

      // -------------------------------------------------------------
      // 2. HERO STAGE DIMMING AS CARDS ENTER CENTER (p: 0.28 -> 0.40)
      // -------------------------------------------------------------
      if (heroStage) {
        if (p < 0.22) {
          heroStage.style.opacity = '1';
          heroStage.style.transform = 'scale(1)';
          heroStage.style.filter = 'blur(0px)';
          heroStage.style.visibility = 'visible';
        } else if (p >= 0.22 && p <= 0.36) {
          const dimT = (p - 0.22) / 0.14;
          const stageOpacity = Math.max(0, 1 - dimT);
          const stageScale = 1 - dimT * 0.06;
          heroStage.style.opacity = stageOpacity.toFixed(3);
          heroStage.style.transform = `scale(${stageScale.toFixed(3)})`;
          heroStage.style.filter = `blur(${(dimT * 4).toFixed(1)}px)`;
          heroStage.style.visibility = stageOpacity > 0.01 ? 'visible' : 'hidden';
        } else {
          heroStage.style.opacity = '0';
          heroStage.style.visibility = 'hidden';
        }
      }

      // -------------------------------------------------------------
      // 3. RIGHT-SIDE SLIDE-IN & HORIZONTAL TRACK TRANSLATION
      // -------------------------------------------------------------
      track.style.transform = `translate3d(${currentTrackX.toFixed(2)}px, 0, 0)`;

      // Progress bar fill (0% to 100%)
      if (progressBar) {
        progressBar.style.width = `${(p * 100).toFixed(1)}%`;
      }

      // -------------------------------------------------------------
      // 4. ACTIVE CARD DETECTION & HIGHLIGHT
      // -------------------------------------------------------------
      const viewportCenter = window.innerWidth / 2;
      let minDistance = Infinity;
      let activeIndex = 0;

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(viewportCenter - cardCenter);

        if (dist < minDistance) {
          minDistance = dist;
          activeIndex = i;
        }
      });

      cards.forEach((card, i) => {
        if (i === activeIndex && p > 0.30) {
          if (!card.classList.contains('is-active')) {
            card.classList.add('is-active');
          }
        } else {
          if (card.classList.contains('is-active')) {
            card.classList.remove('is-active');
          }
        }
      });

      // Update counter (01 / 04 ... 04 / 04)
      if (counterCurrent) {
        const displayIndex = String(activeIndex + 1).padStart(2, '0');
        if (counterCurrent.textContent !== displayIndex) {
          counterCurrent.textContent = displayIndex;
        }
      }

      const diffProgress = Math.abs(targetProgress - currentProgress);
      const diffTrack = Math.abs(targetTrackX - currentTrackX);

      if (diffProgress > 0.0005 || diffTrack > 0.5) {
        rafId = requestAnimationFrame(render);
      } else {
        isTicking = false;
      }
    }

    function onScroll() {
      targetProgress = calculateProgress();
      const p = targetProgress;

      if (p <= 0.22) {
        targetTrackX = hiddenRightOffset;
      } else if (p > 0.22 && p <= 0.40) {
        const slideT = (p - 0.22) / 0.18;
        const easedSlideT = easeInOutCubic(slideT);
        targetTrackX = (1 - easedSlideT) * hiddenRightOffset;
      } else if (p > 0.40 && p <= 0.90) {
        const scrubT = (p - 0.40) / 0.50;
        targetTrackX = -scrubT * totalTrackTravel;
      } else {
        targetTrackX = -totalTrackTravel;
      }

      if (!isTicking) {
        isTicking = true;
        rafId = requestAnimationFrame(render);
      }
    }

    // -------------------------------------------------------------
    // 5. 3D HOVER TILT FOR CARDS
    // -------------------------------------------------------------
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;

        card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // Event Listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateMetrics();
      onScroll();
    }, { passive: true });

    // Initial setup
    updateMetrics();
    targetProgress = calculateProgress();
    currentProgress = targetProgress;

    if (targetProgress <= 0.22) {
      targetTrackX = hiddenRightOffset;
    } else if (targetProgress > 0.22 && targetProgress <= 0.40) {
      const slideT = (targetProgress - 0.22) / 0.18;
      targetTrackX = (1 - easeInOutCubic(slideT)) * hiddenRightOffset;
    } else if (targetProgress > 0.40 && targetProgress <= 0.90) {
      const scrubT = (targetProgress - 0.40) / 0.50;
      targetTrackX = -scrubT * totalTrackTravel;
    } else {
      targetTrackX = -totalTrackTravel;
    }
    currentTrackX = targetTrackX;

    // Ensure ambient background video plays reliably
    const bgVideo = section.querySelector('.ct-bg-video');
    if (bgVideo) {
      bgVideo.muted = true;
      const playPromise = bgVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const tryPlay = () => {
            bgVideo.play();
            window.removeEventListener('scroll', tryPlay);
            window.removeEventListener('click', tryPlay);
            window.removeEventListener('touchstart', tryPlay);
          };
          window.addEventListener('scroll', tryPlay, { passive: true });
          window.addEventListener('click', tryPlay, { passive: true });
          window.addEventListener('touchstart', tryPlay, { passive: true });
        });
      }
    }

    // Initialize Celestial Background Constellation Particles
    initCelestialBackgroundParticles('ctCelestialCanvas', section);

    // Trigger immediate render
    render();
  }

  // =========================================================================
  // CELESTIAL BACKGROUND PARTICLES (Exact Same Engine as HOW DO WE DELIVER SUCCESS?)
  // =========================================================================
  function initCelestialBackgroundParticles(canvasId, sectionEl) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !sectionEl) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let isVisible = false;
    let rafId = null;
    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    let scrollVelocity = 0;

    // Number of particles matching HOW DO WE DELIVER SUCCESS?
    const PARTICLE_COUNT = window.innerWidth <= 768 ? 32 : 58;

    function resizeCanvas() {
      const container = canvas.parentElement || sectionEl;
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
        const z = 0.25 + Math.random() * 0.75; // 3D depth layer [0.25, 1.0]
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: z,
          radius: 0.8 + z * 1.4, // larger particles in foreground
          baseAlpha: 0.18 + z * 0.42, // higher opacity in foreground
          alpha: 0.2,
          pulseSpeed: 0.012 + Math.random() * 0.018,
          pulsePhase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.22,
          driftY: -0.12 - Math.random() * 0.18, // gentle upward cosmic float
          // 85% pure white, 15% soft pale lilac stardust
          color: Math.random() > 0.20 ? '255, 255, 255' : '216, 180, 254'
        });
      }
    }

    function onScroll() {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      scrollVelocity = (currentScrollY - lastScrollY) * 0.12;
      lastScrollY = currentScrollY;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Decay scroll velocity smoothly
      scrollVelocity *= 0.92;

      const len = particles.length;

      // 1. Draw subtle constellation micro-hairlines between nearby foreground particles
      for (let i = 0; i < len; i++) {
        const p1 = particles[i];
        if (p1.z < 0.55) continue; // Only deeper/closer particles link
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          if (p2.z < 0.55) continue;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          // Connect if within 115px
          if (distSq < 13225) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 115) * 0.08 * (p1.z * p2.z);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha.toFixed(4)})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      // 2. Update and draw particles
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.pulsePhase += p.pulseSpeed;
          p.x += p.driftX;
          // Apply vertical drift + 3D scroll parallax based on depth z
          p.y += p.driftY - scrollVelocity * (p.z * 1.2);

          // Toroidal wrap around canvas borders
          if (p.x < -10) p.x = width + 10;
          else if (p.x > width + 10) p.x = -10;

          if (p.y < -10) p.y = height + 10;
          else if (p.y > height + 10) p.y = -10;
        }

        // Shimmering breathing luminosity
        const shimmer = 0.75 + 0.25 * Math.sin(p.pulsePhase);
        const currentAlpha = (p.baseAlpha * shimmer).toFixed(3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
        ctx.fill();

        // Delicate luminous halo aura for larger foreground stars
        if (p.z > 0.75) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${(currentAlpha * 0.20).toFixed(3)})`;
          ctx.fill();
        }
      }

      if (isVisible && !prefersReducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    }

    // Set up IntersectionObserver for 0% CPU consumption when off-screen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (!rafId && !prefersReducedMotion) {
              lastScrollY = window.scrollY || window.pageYOffset || 0;
              rafId = requestAnimationFrame(draw);
            } else if (prefersReducedMotion) {
              draw();
            }
          } else {
            if (rafId) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
          }
        });
      }, { rootMargin: '100px 0px 100px 0px', threshold: 0.01 });

      observer.observe(sectionEl);
    } else {
      isVisible = true;
      rafId = requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      resizeCanvas();
      if (!isVisible || prefersReducedMotion) draw();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClientTestimonialsSection);
  } else {
    initClientTestimonialsSection();
  }
})();
