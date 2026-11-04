/**
 * Digiolic Organic Liquid Ink Scroll Transition
 * Exact WeEvolveIT SVG Displacement Map & Fractal Noise Fluid Animation.
 *
 * - Rides across the bottom 100vh of Zoho People (#corePillarsSection)
 *   into the white Delivery Section (#deliverySection)
 * - Rides across the bottom 100vh of Zoho Modern Tech Stack (#zohoTechStackSection)
 *   into the stone grey Five Pillars Section (#coreEnterprisePillarsSection)
 * - White liquid droplets rise smoothly to hide Zoho People on scroll down
 * - Stone grey liquid droplets rise smoothly to hide Tech Stack into Five Pillars on scroll down
 * - Reverses smoothly on scroll up
 * - Zero jumping droplets, zero synthetic particles, zero spacer pages
 */

(function () {
  'use strict';

  function initLiquidInkTransition() {
    const delivery = document.getElementById('deliverySection');
    const inkRect = document.getElementById('coreInkTransitionRect');

    const pillars = document.getElementById('coreEnterprisePillarsSection');
    const pillarInkRect = document.getElementById('pillarInkTransitionRect');

    // WeEvolveIT easing curve for organic liquid displacement map
    function getEaseScale(p) {
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      if (p < 0.02) return (p / 0.02) * 0.18;
      return 0.18 + ((p - 0.02) / 0.98) * 0.82;
    }

    function updateOnScroll() {
      const vh = window.innerHeight;

      // 1. Delivery Section Transition (White liquid over Zoho People into #deliverySection)
      if (delivery && inkRect) {
        const dRect = delivery.getBoundingClientRect();
        let progress = (vh - dRect.top) / vh;
        progress = Math.max(0, Math.min(1, progress));
        const scaleY = getEaseScale(progress);
        inkRect.style.transform = 'scale(1, ' + scaleY.toFixed(4) + ')';
      }

      // 2. Core Enterprise Pillars Transition (#cec9c9 liquid over Tech Stack into #coreEnterprisePillarsSection)
      if (pillars && pillarInkRect) {
        const targetEl = (pillars.parentElement && pillars.parentElement.classList.contains('pin-spacer'))
          ? pillars.parentElement
          : pillars;
        const pRect = targetEl.getBoundingClientRect();
        let progress = (vh - pRect.top) / vh;
        progress = Math.max(0, Math.min(1, progress));
        const scaleY = getEaseScale(progress);
        pillarInkRect.style.transform = 'scale(1, ' + scaleY.toFixed(4) + ')';
      }
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateOnScroll();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateOnScroll, { passive: true });
    if (window.ScrollTrigger) {
      window.ScrollTrigger.addEventListener('refresh', updateOnScroll);
    }
    updateOnScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidInkTransition);
  } else {
    initLiquidInkTransition();
  }
})();

