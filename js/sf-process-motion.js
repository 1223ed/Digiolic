/**
 * ==========================================================================
 * SALESFORCE IMPLEMENTATION BUILT AROUND YOUR BUSINESS - MOTION CONTROLLER
 * 1:1 Exact Match to the Scroll Departure Animation of
 * "EVERYTHING YOU NEED TO GET MORE FROM SALESFORCE"
 * 
 * Choreography:
 * 1. Initial State:
 *    - Headline ("SALESFORCE IMPLEMENTATION BUILT AROUND YOUR BUSINESS") is
 *      prominently centered in the upper region of #processSection.
 * 
 * 2. Departure Motion (Progress 0.00 -> 1.00):
 *    - As user scrolls into the process methodology grid cards, the header
 *      smoothly glides straight UP and fades out (using easeInOutCubic and
 *      translate3d(0, -Y px, 0)), exactly matching the exit physics of
 *      "EVERYTHING YOU NEED TO GET MORE FROM SALESFORCE".
 * 
 * 3. Reverse Scroll:
 *    - When scrolling back up, the header glides smoothly down from above
 *      and fades back to 100% opacity.
 * ==========================================================================
 */

(function () {
  'use strict';

  function initProcessMotion() {
    const section = document.getElementById('processSection');
    if (!section) return;

    const header = section.querySelector('.sf-play-header-wrap') || document.getElementById('sfProcessHeaderWrap');
    if (!header) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let rafId = null;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function clamp(val, min, max) {
      return Math.min(Math.max(val, min), max);
    }

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Start departure as header docks near the top of the viewport
      const triggerStart = windowH * 0.16;
      const triggerDistance = Math.min(450, windowH * 0.52);

      const scrolledDist = triggerStart - rect.top;
      targetProgress = clamp(scrolledDist / triggerDistance, 0, 1);
    }

    function render() {
      // Physics lerp interpolation matching Webflow & Motion.ed
      currentProgress = lerp(currentProgress, targetProgress, 0.12);

      const easedHeader = easeInOutCubic(currentProgress);
      const exitDistance = 280;
      const headerY = -easedHeader * exitDistance;
      const headerOpacity = clamp(1 - easedHeader * 1.35, 0, 1);

      header.style.transform = `translate3d(0, ${headerY.toFixed(2)}px, 0)`;
      header.style.opacity = headerOpacity.toFixed(3);

      rafId = requestAnimationFrame(render);
    }

    onScroll();
    rafId = requestAnimationFrame(render);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProcessMotion);
  } else {
    initProcessMotion();
  }
})();
