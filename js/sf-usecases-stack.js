/**
 * Salesforce Use Cases - Qude-Style Scroll-Stacking Cards Engine
 * 100% Faithful Recreation of Award-Winning Card Stacking Physics & Monumental Hero Title
 * Featuring:
 * - Monumental architectural typography (matching Client Testimonials)
 * - Card 1 always present (no blank black dead zones)
 * - 5 Stepped Cards scroll runway (Lead Management, Customer 360, Reporting & Analytics, Workflow Automation, Communication)
 * - 3D depth layering, scale transformation, and progressive darkening overlay
 */

(function () {
  'use strict';

  function initQudeStack() {
    const section = document.getElementById('useCasesSection');
    if (!section) return;

    const track = section.querySelector('.sf-qude-track') || section;
    const cards = Array.from(section.querySelectorAll('.sf-qude-card'));
    if (!cards.length) return;

    // Stacking order for cards
    cards.forEach((card, idx) => {
      card.style.zIndex = (idx + 1) * 10;
    });

    // Schedule for cards entering over Card 0:
    // Card 0 (Lead Management): foundation, visible from progress = 0.00
    // Phase 1 (0.00 -> 0.18): Headline departs upward & fades out matching "EVERYTHING YOU NEED TO GET MORE FROM SALESFORCE"
    // Card 1 (Customer 360): enters 0.20 -> 0.38
    // Card 2 (Reporting & Analytics): enters 0.40 -> 0.58
    // Card 3 (Workflow Automation): enters 0.60 -> 0.78
    // Card 4 (Communication): enters 0.80 -> 0.98
    const schedule = [
      { enterStart: 0.00, enterEnd: 0.00 }, // Card 0 always present
      { enterStart: 0.20, enterEnd: 0.38 },
      { enterStart: 0.40, enterEnd: 0.58 },
      { enterStart: 0.60, enterEnd: 0.78 },
      { enterStart: 0.80, enterEnd: 0.98 }
    ];

    let ticking = false;
    let windowH = window.innerHeight;

    function clamp(val, min, max) {
      return Math.max(min, Math.min(max, val));
    }

    function onResize() {
      windowH = window.innerHeight;
      updateVisuals();
    }

    function updateVisuals() {
      ticking = false;

      const trackRect = track.getBoundingClientRect();
      const scrollableDist = track.offsetHeight - windowH;

      if (scrollableDist <= 0) return;

      const scrolled = -trackRect.top;
      const progress = clamp(scrolled / scrollableDist, 0, 1);

      // ------------------------------------------------------------------------
      // Phase 1: Header Departure (Progress 0.00 -> 0.18)
      // Identical motion & easing to "EVERYTHING YOU NEED TO GET MORE FROM SALESFORCE"
      // ------------------------------------------------------------------------
      const introEl = document.getElementById('sfQudeIntro');
      if (introEl) {
        if (window.innerWidth < 992) {
          introEl.style.transform = 'none';
          introEl.style.opacity = '1';
        } else {
          const riseProgress = clamp(progress / 0.18, 0, 1);
          const easedHeader = riseProgress < 0.5 
            ? 4 * riseProgress * riseProgress * riseProgress 
            : 1 - Math.pow(-2 * riseProgress + 2, 3) / 2;
          const headerY = -easedHeader * 340;
          const headerOpacity = clamp(1 - easedHeader * 1.35, 0, 1);

          introEl.style.transform = `translate3d(0, ${headerY.toFixed(2)}px, 0)`;
          introEl.style.opacity = headerOpacity.toFixed(3);
        }
      }

      // Smooth vertical centering of cards deck as headline departs
      const deckEl = section.querySelector('.sf-qude-deck');
      if (deckEl) {
        const riseProgress = clamp(progress / 0.18, 0, 1);
        const easedRise = 1 - Math.pow(1 - riseProgress, 3);
        const initialDeckOffset = clamp(190, windowH * 0.24, 230);
        const deckY = (1 - easedRise) * initialDeckOffset;
        deckEl.style.transform = `translate3d(0, ${deckY.toFixed(2)}px, 0)`;
      }

      cards.forEach((card, i) => {
        const overlay = card.querySelector('.sf-qude-card-overlay');

        if (i === 0) {
          // Card 0 is the foundation card - ALWAYS visible, never off-screen
          let depth = 0;
          for (let j = 1; j < cards.length; j++) {
            const nextSched = schedule[j];
            if (nextSched && progress > nextSched.enterStart) {
              const subT = clamp((progress - nextSched.enterStart) / (nextSched.enterEnd - nextSched.enterStart), 0, 1);
              depth += (1 - Math.pow(1 - subT, 3));
            }
          }
          const translateY = Math.round(-depth * 18);
          const scale = (1.0 - (depth * 0.038)).toFixed(4);
          const overlayAlpha = Math.min(0.78, depth * 0.22).toFixed(3);

          card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
          card.style.opacity = '1';
          card.style.visibility = 'visible';
          if (overlay) overlay.style.opacity = overlayAlpha;
        } else {
          // Cards 1 through 4 enter smoothly from bottom
          const sched = schedule[i];
          if (!sched) return;

          if (progress < sched.enterStart) {
            const initOffset = Math.round(windowH * 0.95);
            card.style.transform = `translate3d(0, ${initOffset}px, 0) scale(1)`;
            card.style.opacity = '0';
            card.style.visibility = 'hidden';
            if (overlay) overlay.style.opacity = '0';
          } else if (progress <= sched.enterEnd) {
            const t = (progress - sched.enterStart) / (sched.enterEnd - sched.enterStart);
            const easeOut = 1 - Math.pow(1 - t, 3);
            const currentY = Math.round((1 - easeOut) * (windowH * 0.95));
            const currentOpacity = Math.min(1, t * 2.5);

            card.style.transform = `translate3d(0, ${currentY}px, 0) scale(1)`;
            card.style.opacity = currentOpacity.toFixed(3);
            card.style.visibility = 'visible';
            if (overlay) overlay.style.opacity = '0';
          } else {
            let depth = 0;
            for (let j = i + 1; j < cards.length; j++) {
              const nextSched = schedule[j];
              if (nextSched && progress > nextSched.enterStart) {
                const subT = clamp((progress - nextSched.enterStart) / (nextSched.enterEnd - nextSched.enterStart), 0, 1);
                depth += (1 - Math.pow(1 - subT, 3));
              }
            }
            const translateY = Math.round(-depth * 18);
            const scale = (1.0 - (depth * 0.038)).toFixed(4);
            const overlayAlpha = Math.min(0.78, depth * 0.22).toFixed(3);

            card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            if (overlay) overlay.style.opacity = overlayAlpha;
          }
        }
      });
    }

    function requestUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateVisuals);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial render
    updateVisuals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQudeStack);
  } else {
    initQudeStack();
  }
})();
