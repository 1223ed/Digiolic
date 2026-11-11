/**
 * Why Choose Digiolic — Interactive Spatial Showcase
 * Faithful 1:1 recreation of reference animation (composites.archi design)
 * 
 * Features:
 * 1. Pinned Scroll Scrubbing: Locks to viewport and scrubs character wave & pointer emergence smoothly
 * 2. Radial Emergence: All 6 pointers glide outward from deep inside "WHY CHOOSE DIGIOLIC"
 * 3. Smooth Lerping: 60fps buttery-smooth, slow, luxurious motion tied to user scroll
 * 4. Solid Orange Hover & Active states with jet black text and icons
 * 5. Slow, silky editorial detail drawer slide-out with pagination [ ← | → ]
 * 6. Floating white square close button attached to top-right
 * 7. Ambient floating & subtle 3D perspective mouse tilt
 */
(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhyChooseInteractive);
  } else {
    initWhyChooseInteractive();
  }

  function initWhyChooseInteractive() {
    const section = document.getElementById('whyDigiolicSection');
    if (!section) return;

    const stickyWrapper = section.querySelector('.wcu-sticky-wrapper');
    const stage = section.querySelector('.wcu-stage-container');
    const heroTitle = section.querySelector('.wcu-hero-title');
    const titleLine1 = section.querySelector('#wcuTitleLine1');
    const titleLine2 = section.querySelector('#wcuTitleLine2');
    const cardWrapper = section.querySelector('.wcu-detail-card-wrapper');
    const backdrop = section.querySelector('.wcu-overlay-backdrop');
    const pills = Array.from(section.querySelectorAll('.wcu-pill'));
    const pillWrappers = Array.from(section.querySelectorAll('.wcu-pill-wrapper'));
    const ctaContainer = section.querySelector('.wcu-cta-container');

    const titleEl = section.querySelector('#wcuCardTitle');
    const iconEl = section.querySelector('#wcuCardIcon');
    const descEl = section.querySelector('#wcuCardDesc');
    const counterEl = section.querySelector('#wcuCardCounter');
    const prevBtn = section.querySelector('#wcuPrevBtn');
    const nextBtn = section.querySelector('#wcuNextBtn');
    const closeBtn = section.querySelector('#wcuCloseBtn');

    if (!stage || !cardWrapper || pills.length === 0) return;

    // Ensure ambient background video autoplays smoothly
    const bgVideo = section.querySelector('.wcu-bg-video');
    if (bgVideo) {
      bgVideo.muted = true;
      const playPromise = bgVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const tryPlay = () => {
            bgVideo.play().catch(() => {});
            window.removeEventListener('scroll', tryPlay);
            window.removeEventListener('pointerdown', tryPlay);
          };
          window.addEventListener('scroll', tryPlay, { passive: true });
          window.addEventListener('pointerdown', tryPlay, { passive: true });
        });
      }
    }

    // =========================================================================
    // 1. CHARACTER-LEVEL SPLIT TEXT INITIALIZATION
    // =========================================================================
    let allChars = [];

    function setupTextAnimation() {
      if (!titleLine1 || !titleLine2) return;

      function splitIntoChars(element, startingIndex) {
        const rawText = element.textContent.trim();
        element.innerHTML = '';
        let currentIndex = startingIndex;

        for (let i = 0; i < rawText.length; i++) {
          const char = rawText[i];
          const span = document.createElement('span');
          span.className = 'wcu-char' + (char === ' ' ? ' space' : '');
          span.textContent = char === ' ' ? '\u00A0' : char;
          element.appendChild(span);
          allChars.push({ el: span, index: currentIndex });
          currentIndex++;
        }
        return currentIndex;
      }

      allChars = [];
      const nextIdx = splitIntoChars(titleLine1, 0);
      splitIntoChars(titleLine2, nextIdx);
    }

    setupTextAnimation();

    // =========================================================================
    // 2. RADIAL BURST VECTORS COMPUTATION
    // Calculates the exact vector from the center of "WHY CHOOSE DIGIOLIC"
    // so every pointer smoothly expands outward from the center
    // =========================================================================
    let burstVectors = [];

    function computeBurstVectors() {
      const centerX = stage.offsetWidth / 2;
      const centerY = stage.offsetHeight / 2;
      if (centerX === 0 || centerY === 0) return;

      burstVectors = pillWrappers.map((pw) => {
        const pillCenterX = pw.offsetLeft + pw.offsetWidth / 2;
        const pillCenterY = pw.offsetTop + pw.offsetHeight / 2;

        return {
          dx: Math.round(centerX - pillCenterX),
          dy: Math.round(centerY - pillCenterY)
        };
      });
    }

    // Initial computation & resize listener
    computeBurstVectors();
    setTimeout(computeBurstVectors, 100);
    window.addEventListener('resize', () => {
      computeBurstVectors();
      targetProgress = calculateScrollProgress();
      currentProgress = targetProgress;
      updateScrollAnimation();
    });

    // =========================================================================
    // 3. BUTTERY SMOOTH LERPED SCROLL SCRUBBING ENGINE
    // =========================================================================
    let targetProgress = 0;
    let currentProgress = 0;
    let isTicking = false;
    let isOpen = false;
    let scrollAtOpen = 0;

    function easeOutCubic(t) {
      const p = Math.min(1, Math.max(0, t));
      return 1 - Math.pow(1 - p, 3);
    }

    function calculateScrollProgress() {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = section.offsetHeight - vh;
      if (totalScroll <= 0) return 0;

      // When section top hits top of viewport (pinned start), progress = 0
      // When section bottom hits bottom of viewport (unpinned end), progress = 1
      const rawProgress = -rect.top / totalScroll;
      return Math.max(0, Math.min(1, rawProgress));
    }

    function onScroll() {
      targetProgress = calculateScrollProgress();

      // If user scrolls by more than 160px while detail card is open, dismiss card smoothly
      if (isOpen && Math.abs(window.scrollY - scrollAtOpen) > 160) {
        closeCard();
      }

      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateScrollAnimation);
      }
    }

    function updateScrollAnimation() {
      // Silky, slow, luxurious lerp smoothing (0.09)
      currentProgress += (targetProgress - currentProgress) * 0.09;

      // 1. Title Character Wave Entrance (Progress: 0.00 -> 0.32)
      // Exactly matches reference video frames time_00 -> time_02
      const totalChars = allChars.length;
      allChars.forEach((item) => {
        const charStart = (item.index / totalChars) * 0.16;
        const charP = Math.max(0, Math.min(1, (currentProgress - charStart) / 0.14));
        const charEase = easeOutCubic(charP);
        const transY = Math.round((1 - charEase) * 115);
        item.el.style.transform = `translateY(${transY}%)`;
        item.el.style.opacity = charP > 0.04 ? '1' : '0';
      });

      // 2. Radial Pointers Emergence from INSIDE the center text (Progress: 0.22 -> 0.72)
      // Exactly matches reference video frames time_03 -> time_04
      const burstProgress = Math.max(0, Math.min(1, (currentProgress - 0.22) / 0.50));
      const burstEase = easeOutCubic(burstProgress);

      pillWrappers.forEach((pw, idx) => {
        const vec = burstVectors[idx] || { dx: 0, dy: 0 };
        const curX = Math.round(vec.dx * (1 - burstEase));
        const curY = Math.round(vec.dy * (1 - burstEase));
        const curScale = (0.25 + 0.75 * burstEase).toFixed(3);
        const curOpacity = Math.max(0, Math.min(1, (burstProgress - 0.04) * 2.4)).toFixed(3);

        if (!isOpen) {
          pw.style.transform = `translate3d(${curX}px, ${curY}px, 0) scale(${curScale})`;
          pw.style.opacity = curOpacity;
          pw.style.filter = 'none';
        }

        // Once emerged to near resting orbit (burstProgress >= 0.70), enable click & floating
        if (burstProgress >= 0.70) {
          pw.style.pointerEvents = 'auto';
          pw.classList.add('floating');
        } else {
          pw.style.pointerEvents = 'none';
          pw.classList.remove('floating');
        }
      });

      // 3. Bottom CTA Button Appearance (Progress: 0.65 -> 0.82)
      if (ctaContainer) {
        if (currentProgress >= 0.65) {
          ctaContainer.classList.add('is-visible');
        } else {
          ctaContainer.classList.remove('is-visible');
        }
      }

      // Continue animation loop if still interpolating
      if (Math.abs(targetProgress - currentProgress) > 0.001) {
        requestAnimationFrame(updateScrollAnimation);
      } else {
        isTicking = false;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Trigger initial calculation
    targetProgress = calculateScrollProgress();
    currentProgress = targetProgress;
    updateScrollAnimation();

    // =========================================================================
    // 4. INTERACTIVE 3D MOUSE PARALLAX & PERSPECTIVE TILT
    // =========================================================================
    let parallaxRaf = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function onMouseMove(e) {
      if (window.innerWidth < 992 || isOpen) return;
      const rect = section.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (!parallaxRaf) {
        parallaxRaf = requestAnimationFrame(updateParallax);
      }
    }

    function updateParallax() {
      currentX += (targetX - currentX) * 0.10;
      currentY += (targetY - currentY) * 0.10;

      if (heroTitle && !isOpen) {
        const transX = currentX * -16;
        const transY = currentY * -10;
        const rotY = currentX * 3.5;
        const rotX = currentY * -3.5;
        heroTitle.style.transform = `translate(calc(-50% + ${transX}px), calc(-50% + ${transY}px)) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
      }

      if (Math.abs(targetX - currentX) > 0.005 || Math.abs(targetY - currentY) > 0.005) {
        parallaxRaf = requestAnimationFrame(updateParallax);
      } else {
        parallaxRaf = null;
      }
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
      if (heroTitle && !isOpen) {
        heroTitle.style.transform = 'translate(-50%, -50%) rotateY(0deg) rotateX(0deg)';
      }
    }

    section.addEventListener('mousemove', onMouseMove, { passive: true });
    section.addEventListener('mouseleave', onMouseLeave);

    // =========================================================================
    // 5. DATA & EDITORIAL DETAIL MODAL DRAWER
    // =========================================================================
    const items = [
      {
        id: 'client-support',
        title: 'CLIENT SUPPORT',
        iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
        </svg>`,
        description: 'We bring deep industry insight across Professional Services, Retail, Manufacturing, BFSI, and Healthcare, tailoring our Zoho, Salesforce, and digital marketing strategies to your sector.'
      },
      {
        id: 'our-strategy',
        title: 'OUR STRATEGY',
        iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2"></circle>
        </svg>`,
        description: 'We optimize your operational ecosystem—spanning Sales, Support, and Marketing—by seamlessly integrating Zoho, Salesforce, and performance growth channels.'
      },
      {
        id: 'expert-team',
        title: 'EXPERT TEAM',
        iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>`,
        description: 'We guide you to the absolute best-fit tools across the Zoho and Salesforce landscapes, expertly pairing them with high-impact digital marketing solutions.'
      },
      {
        id: 'more-growth',
        title: 'MORE GROWTH',
        iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
          <polyline points="3 8 9 2 15 8"></polyline>
        </svg>`,
        description: 'We leverage 30+ years of technical expertise to deploy scalable Zoho and Salesforce environments backed by performance-driven marketing systems.'
      },
      {
        id: 'more-reach',
        title: 'MORE REACH',
        iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>`,
        description: 'We manage your end-to-end digital transformation using proven project management methodologies across all Zoho, Salesforce, and marketing rollouts.'
      },
      {
        id: 'creative-ideas',
        title: 'CREATIVE IDEAS',
        iconSvg: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18h6"></path>
          <path d="M10 22h4"></path>
          <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.25 4.7 3.2 5.8.5.3.8.8.8 1.4V17h6v-.8c0-.6.3-1.1.8-1.4A7.03 7.03 0 0 0 19 9a7 7 0 0 0-7-7z"></path>
        </svg>`,
        description: 'We provide ongoing technical and strategic support to keep your Zoho, Salesforce, and digital marketing campaigns synchronized, secure, and scaling.'
      }
    ];

    let currentIndex = 0;

    function renderItem(index, animate = false) {
      if (index < 0 || index >= items.length) return;
      currentIndex = index;
      const data = items[index];

      // Update pills active state
      pills.forEach((pill, idx) => {
        const pw = pillWrappers[idx];
        if (idx === index) {
          pill.classList.add('is-active');
          pill.setAttribute('aria-expanded', 'true');
          if (pw) pw.classList.add('is-active-wrapper');
        } else {
          pill.classList.remove('is-active');
          pill.setAttribute('aria-expanded', 'false');
          if (pw) pw.classList.remove('is-active-wrapper');
        }
      });

      if (animate && descEl) {
        descEl.style.opacity = '0';
        descEl.style.transform = 'translateY(6px)';
        setTimeout(() => {
          if (titleEl) titleEl.textContent = data.title;
          if (iconEl) iconEl.innerHTML = data.iconSvg;
          if (descEl) descEl.textContent = data.description;
          if (counterEl) counterEl.textContent = `${index + 1} / ${items.length}`;
          descEl.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          descEl.style.opacity = '1';
          descEl.style.transform = 'translateY(0)';
        }, 150);
      } else {
        if (titleEl) titleEl.textContent = data.title;
        if (iconEl) iconEl.innerHTML = data.iconSvg;
        if (descEl) descEl.textContent = data.description;
        if (counterEl) counterEl.textContent = `${index + 1} / ${items.length}`;
      }
    }

    function openCard(index) {
      scrollAtOpen = window.scrollY;
      renderItem(index, false);
      cardWrapper.classList.add('is-open');
      cardWrapper.setAttribute('aria-hidden', 'false');
      if (backdrop) backdrop.classList.add('is-active');
      stage.classList.add('has-open-card');
      isOpen = true;

      // Lock all pill wrappers to full resting coordinates
      pillWrappers.forEach((pw, idx) => {
        pw.style.transform = 'translate3d(0, 0, 0) scale(1)';
        pw.style.opacity = idx === index ? '1' : '0.12';
      });
    }

    function closeCard() {
      cardWrapper.classList.remove('is-open');
      cardWrapper.setAttribute('aria-hidden', 'true');
      if (backdrop) backdrop.classList.remove('is-active');
      stage.classList.remove('has-open-card');
      pills.forEach((p, idx) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-expanded', 'false');
        if (pillWrappers[idx]) {
          pillWrappers[idx].classList.remove('is-active-wrapper');
        }
      });
      isOpen = false;
      if (heroTitle) {
        heroTitle.style.transform = 'translate(-50%, -50%) rotateY(0deg) rotateX(0deg)';
      }
      updateScrollAnimation();
    }

    function goToPrev() {
      const newIndex = (currentIndex - 1 + items.length) % items.length;
      renderItem(newIndex, true);
    }

    function goToNext() {
      const newIndex = (currentIndex + 1) % items.length;
      renderItem(newIndex, true);
    }

    // Attach pill events
    pills.forEach((pill) => {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(pill.getAttribute('data-index'), 10);
        if (isOpen && currentIndex === idx) {
          closeCard();
        } else {
          openCard(idx);
        }
      });
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCard();
      });
    }

    // Pagination buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToPrev();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToNext();
      });
    }

    // Backdrop click dismiss
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        if (isOpen) closeCard();
      });
    }

    // Click outside stage dismiss
    document.addEventListener('click', (e) => {
      if (!isOpen) return;
      if (!cardWrapper.contains(e.target) && !stage.contains(e.target)) {
        closeCard();
      }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        closeCard();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    });

    // Initialize Celestial Background Constellation Particles
    initCelestialBackgroundParticles('wcuCelestialCanvas', section);
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
})();
