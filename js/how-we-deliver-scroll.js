/**
 * ============================================================================
 * DIGIOLIC — HOW DO WE DELIVER SUCCESS?
 * Horizontal Scroll Methodology Engine
 * Replicating exact reference video interaction & visual aesthetics
 * - Vertical-to-Horizontal smooth synchronization
 * - Bi-directional horizontal scrolling (trackpad deltaX, touch swipe, mouse drag)
 * - Fluid background color morph (Pure White -> Slate Gray -> Midnight Obsidian)
 * - Giant watermark numeral parallax
 * - Interactive bottom step timeline with letter badges (D, D, I, T, L)
 * ============================================================================
 */

(function () {
  'use strict';

  function initHowWeDeliverScroll() {
    const section = document.getElementById('deliverySection');
    const viewport = document.getElementById('hscrollViewport');
    const track = document.getElementById('hscrollTrack');
    const bgMorph = document.getElementById('hscrollBgMorph');
    const bgDots = document.getElementById('hscrollBgDots');
    const navLineFill = document.getElementById('hscrollNavLineFill');
    const navNodes = document.querySelectorAll('.hscroll-nav-node');
    const slides = document.querySelectorAll('.hscroll-slide');
    const watermarks = document.querySelectorAll('.hscroll-watermark-num');

    if (!section || !viewport || !track) {
      return;
    }

    let isSectionActive = false;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartScrollY = 0;
    let hasMoved = false;
    let lastActiveStep = -1;

    // Precomputed step progress checkpoints (Intro = 0, Step 1 = 0.2, Step 2 = 0.4, Step 3 = 0.6, Step 4 = 0.8, Step 5 = 1.0)
    const stepCheckpoints = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];

    // RGB color stops for seamless frame-by-frame background blending
    // Stop 0 (0% - 50%): White #FFFFFF (255, 255, 255)
    // Stop 1 (72%): Slate Gray #334155 (51, 65, 85)
    // Stop 2 (92% - 100%): Obsidian Black #010204 (1, 2, 4) - Matching page background
    function interpolateBgColor(p) {
      let r, g, b;
      if (p <= 0.48) {
        return 'rgb(255, 255, 255)';
      } else if (p <= 0.74) {
        // Blend White to Slate Gray
        const t = (p - 0.48) / (0.74 - 0.48);
        r = Math.round(255 + (51 - 255) * t);
        g = Math.round(255 + (65 - 255) * t);
        b = Math.round(255 + (85 - 255) * t);
      } else {
        // Blend Slate Gray to FinSight Deep Obsidian #010204 (1, 2, 4)
        const t = Math.min(1, (p - 0.74) / (0.94 - 0.74));
        r = Math.round(51 + (1 - 51) * t);
        g = Math.round(65 + (2 - 65) * t);
        b = Math.round(85 + (4 - 85) * t);
      }
      return `rgb(${r}, ${g}, ${b})`;
    }

    // Main Update Function driven by scroll
    function updateScrollState() {
      const sectionRect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const totalScrollDistance = section.offsetHeight - viewportHeight;

      if (totalScrollDistance <= 0) return;

      const scrolledInSection = -sectionRect.top;
      let rawProgress = scrolledInSection / totalScrollDistance;
      const progress = Math.max(0, Math.min(1, rawProgress));

      isSectionActive = rawProgress >= -0.05 && rawProgress <= 1.05;

      // 1. Horizontal Track Translation
      const viewportWidth = viewport.clientWidth;
      const totalSlides = slides.length;
      const maxTranslateX = (totalSlides - 1) * viewportWidth;
      const currentTranslateX = -progress * maxTranslateX;

      track.style.transform = `translate3d(${currentTranslateX.toFixed(2)}px, 0, 0)`;

      // 2. Background Morphing & Themes
      const currentColor = interpolateBgColor(progress);
      if (bgMorph) {
        bgMorph.style.backgroundColor = currentColor;
      }
      viewport.style.setProperty('--hscroll-current-bg', currentColor);

      // Dot pattern visibility on final dark stage
      if (bgDots) {
        if (progress > 0.75) {
          const dotOpacity = Math.min(0.85, (progress - 0.75) / 0.2);
          bgDots.style.opacity = dotOpacity.toFixed(2);
        } else {
          bgDots.style.opacity = '0';
        }
      }

      // Viewport theme classes for contrast transitions
      if (progress >= 0.76) {
        viewport.classList.remove('theme-slate');
        viewport.classList.add('theme-dark');
      } else if (progress >= 0.52) {
        viewport.classList.remove('theme-dark');
        viewport.classList.add('theme-slate');
      } else {
        viewport.classList.remove('theme-slate', 'theme-dark');
      }

      // 3. Interactive Bottom Timeline Fill & Nodes
      // Timeline line fill connects node 1 to node 5
      if (navLineFill) {
        // Maps progress from Step 1 (0.15) to Step 5 (0.95) -> 0% to 100%
        let fillPct = 0;
        if (progress >= 0.15) {
          fillPct = Math.min(100, Math.max(0, ((progress - 0.15) / 0.8) * 100));
        }
        navLineFill.style.width = `${fillPct.toFixed(1)}%`;
      }

      // Update Node active/visited states
      // Active step ranges:
      // Step 1: ~0.10 - 0.28
      // Step 2: ~0.28 - 0.48
      // Step 3: ~0.48 - 0.68
      // Step 4: ~0.68 - 0.88
      // Step 5: ~0.88 - 1.00
      let activeStep = 0;
      if (progress >= 0.86) {
        activeStep = 5;
      } else if (progress >= 0.66) {
        activeStep = 4;
      } else if (progress >= 0.46) {
        activeStep = 3;
      } else if (progress >= 0.26) {
        activeStep = 2;
      } else if (progress >= 0.08) {
        activeStep = 1;
      }

      navNodes.forEach(node => {
        const stepNum = parseInt(node.getAttribute('data-target-step'), 10);
        node.classList.remove('is-active', 'is-visited');

        if (stepNum === activeStep) {
          node.classList.add('is-active');
        } else if (stepNum < activeStep) {
          node.classList.add('is-visited');
        }
      });

      // Trigger character wave on active slide title when entering a slide
      if (activeStep !== lastActiveStep) {
        lastActiveStep = activeStep;
        if (activeStep >= 1 && activeStep <= 5 && window.DigiolicCharWave) {
          const activeTitle = document.querySelector(`.hscroll-step-title[data-slide-title="${activeStep}"]`);
          if (activeTitle) {
            window.DigiolicCharWave.trigger(activeTitle);
          }
        }
      }

      // 4. Parallax Depth on Watermark Numerals (Subtle organic float)
      watermarks.forEach((wm, idx) => {
        const slideIndex = idx + 1; // Slide 1 corresponds to WM 01, etc.
        const slideProgressCenter = slideIndex / (totalSlides - 1);
        const diff = progress - slideProgressCenter;
        const parallaxX = diff * 80;
        wm.style.transform = `translate3d(${parallaxX.toFixed(1)}px, -50%, 0)`;
      });

      // 5. Fade out timeline navigation when approaching the end so it never overlaps the next section
      const bottomNav = document.querySelector('.hscroll-bottom-nav');
      if (bottomNav) {
        if (progress >= 0.96) {
          const fadeOut = Math.max(0, 1 - (progress - 0.96) / 0.035);
          bottomNav.style.opacity = fadeOut.toFixed(2);
          bottomNav.style.pointerEvents = fadeOut <= 0.05 ? 'none' : 'auto';
        } else {
          bottomNav.style.opacity = '1';
          bottomNav.style.pointerEvents = 'auto';
        }
      }
    }

    // Scroll listener with requestAnimationFrame throttling
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial calculation
    updateScrollState();

    // ========================================================================
    // BI-DIRECTIONAL HORIZONTAL SCROLL INTERACTION (Trackpad deltaX & Wheel)
    // Allows anyone to scroll left/right or right/left directly
    // ========================================================================
    viewport.addEventListener('wheel', (e) => {
      // Check if user is scrolling horizontally (trackpad two-finger swipe or Shift+Wheel)
      const absDeltaX = Math.abs(e.deltaX);
      const absDeltaY = Math.abs(e.deltaY);

      if (absDeltaX > absDeltaY && absDeltaX > 1.5) {
        // Horizontal intent: prevent native horizontal back/forward browser navigation
        e.preventDefault();
        
        // Convert horizontal scroll into section vertical scroll
        const scrollFactor = 1.35;
        window.scrollBy({
          top: e.deltaX * scrollFactor,
          behavior: 'auto'
        });
      }
    }, { passive: false });

    // ========================================================================
    // MOUSE DRAG & TOUCH SWIPE NAVIGATION (Drag left/right to navigate)
    // ========================================================================
    function handleDragStart(clientX, clientY) {
      if (!isSectionActive) return;
      isDragging = true;
      hasMoved = false;
      dragStartX = clientX;
      dragStartY = clientY;
      dragStartScrollY = window.scrollY;
      viewport.classList.add('is-dragging');
    }

    function handleDragMove(clientX, clientY, e) {
      if (!isDragging) return;
      const deltaX = clientX - dragStartX;
      const deltaY = clientY - dragStartY;

      // If predominantly horizontal drag
      if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) {
        hasMoved = true;
        if (e && e.cancelable) e.preventDefault();

        // Dragging left (negative deltaX) should advance forward (scroll down)
        // Dragging right (positive deltaX) should rewind back (scroll up)
        const dragSpeed = 2.4;
        const targetScrollY = dragStartScrollY - (deltaX * dragSpeed);
        window.scrollTo({
          top: targetScrollY,
          behavior: 'auto'
        });
      }
    }

    function handleDragEnd() {
      if (!isDragging) return;
      isDragging = false;
      viewport.classList.remove('is-dragging');
    }

    // Mouse Drag events
    viewport.addEventListener('mousedown', (e) => {
      // Don't drag if clicking buttons or links
      if (e.target.closest('button') || e.target.closest('a')) return;
      handleDragStart(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      handleDragMove(e.clientX, e.clientY, e);
    });

    window.addEventListener('mouseup', handleDragEnd);

    // Touch Swipe events
    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY, e);
      }
    }, { passive: false });

    viewport.addEventListener('touchend', handleDragEnd);
    viewport.addEventListener('touchcancel', handleDragEnd);

    // ========================================================================
    // INTERACTIVE TIMELINE NODE CLICKS (Smooth jump to each step)
    // ========================================================================
    navNodes.forEach(node => {
      node.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const stepIndex = parseInt(node.getAttribute('data-target-step'), 10);
        if (isNaN(stepIndex)) return;

        const currentScroll = window.scrollY || window.pageYOffset || 0;
        const sectionTop = currentScroll + section.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const totalScrollDistance = section.offsetHeight - viewportHeight;
        
        // Progress for step: 1 => 0.20, 2 => 0.40, 3 => 0.60, 4 => 0.80, 5 => 1.00
        const targetProgress = stepCheckpoints[stepIndex] !== undefined ? stepCheckpoints[stepIndex] : 0.2;
        const targetY = sectionTop + (targetProgress * totalScrollDistance);

        window.scrollTo({
          top: Math.round(targetY),
          behavior: 'smooth'
        });
      });
    });

    // ========================================================================
    // KEYBOARD NAVIGATION (Left / Right Arrow Keys)
    // ========================================================================
    window.addEventListener('keydown', (e) => {
      if (!isSectionActive) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const totalScrollDistance = section.offsetHeight - viewportHeight;
        const stepDistance = totalScrollDistance / 5;
        window.scrollBy({ top: stepDistance, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const totalScrollDistance = section.offsetHeight - viewportHeight;
        const stepDistance = totalScrollDistance / 5;
        window.scrollBy({ top: -stepDistance, behavior: 'smooth' });
      }
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHowWeDeliverScroll);
  } else {
    initHowWeDeliverScroll();
  }
})();
