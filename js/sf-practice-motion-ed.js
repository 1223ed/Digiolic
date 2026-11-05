/**
 * ==========================================================================
 * SALESFORCE COMPREHENSIVE PRACTICE - MOTION.ED ENGINE
 * 1:1 Exact Match to Motion.ed "IMPLEMENTATION EXAMPLES" Reference Video
 * Reference: Screen Recording 2026-11-02 at 5.21.59 PM.mov
 * 
 * Choreography:
 * 1. Initial State (Progress 0.00):
 *    - Headline ("EVERYTHING YOU NEED TO GET MORE FROM SALESFORCE") is positioned
 *      in the upper region of the stage (matching user Image 3 upper blueprint).
 *    - Cards track is positioned with its top ~140-160px peaking up from the bottom
 *      of the viewport (matching user Image 3 lower blueprint & original Image 2).
 * 
 * 2. Phase 1: Vertical Rise & Header Departure (Progress 0.00 -> 0.22):
 *    - As user scrolls, headline translates straight UP and exits off top of screen,
 *      smoothly fading out (matching frames f_004 -> f_014 in reference video).
 *    - Simultaneously, cards track rises up from peaking position to vertical center
 *      of the stage (translateY: 0).
 *    - Horizontal trackX remains 0 (anchoring card 01 on left).
 * 
 * 3. Phase 2: Horizontal Card Scrub (Progress 0.22 -> 1.00):
 *    - Once cards reach centered height, horizontal track scrubs smoothly from
 *      translateX(0) to translateX(-maxTranslateX) across all 8 cards.
 *    - Subtly focuses center card with dynamic shadow & parabolic depth.
 *    - Top HUD counter updates (01 / 08 -> 08 / 08) and bottom scrub bar fills.
 * 
 * 4. Interactive 3D Perspective Tilt on Card Hover.
 * ==========================================================================
 */

(function () {
  'use strict';

  function initPracticeMotionEd() {
    const section = document.getElementById('servicesOverview');
    if (!section) return;

    const stage = section.querySelector('.sf-practice-stage');
    const heroHeader = section.querySelector('.sf-practice-hero-header');
    const cardsWrapper = section.querySelector('.sf-practice-cards-wrapper');
    const cardsTrack = section.querySelector('.sf-practice-cards-track');
    const cards = Array.from(section.querySelectorAll('.sf-pbox-card'));
    const scrubFill = section.querySelector('.sf-practice-scrub-fill');
    const counterEl = section.querySelector('.sf-practice-hud-counter');

    if (!stage || !heroHeader || !cardsWrapper || !cardsTrack || !cards.length) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let maxTranslateX = 0;
    let initialPeakingY = 0;
    let rafId = null;
    let isDesktop = window.innerWidth >= 992;

    // Cubic easing functions for liquid smooth physics
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function clamp(val, min, max) {
      return Math.min(Math.max(val, min), max);
    }

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function calculateDimensions() {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const trackWidth = cardsTrack.scrollWidth;

      // Generous right breathing space for card 08 docking
      maxTranslateX = Math.max(0, trackWidth - viewportWidth + clamp(viewportWidth * 0.08, 30, 140));

      // Calculate initial peaking position for cards track:
      // Top ~110-165px of the card should be visible peaking from the bottom edge
      const wrapperTop = cardsWrapper.offsetTop || clamp(60, viewportHeight * 0.14, 140);
      const peakingVisibleHeight = clamp(110, viewportHeight * 0.16, 170);
      const targetCardTop = viewportHeight - peakingVisibleHeight;
      initialPeakingY = Math.max(0, targetCardTop - wrapperTop);
    }

    function onScroll() {
      const rect = section.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;

      if (scrollableHeight <= 0) {
        targetProgress = 0;
        return;
      }

      const rawProgress = -rect.top / scrollableHeight;
      targetProgress = clamp(rawProgress, 0, 1);
    }

    // Main Animation Render Loop
    function render() {
      // Physics lerp interpolation matching Webflow & Motion.ed
      currentProgress = lerp(currentProgress, targetProgress, 0.09);

      // Headline is completely static - no animation (as requested)
      heroHeader.style.transform = 'none';
      heroHeader.style.opacity = '1';

      // Cards track remains in position
      cardsWrapper.style.transform = 'none';

      // ------------------------------------------------------------------------
      // Horizontal Card Glide (Progress 0.00 -> 1.00)
      // ------------------------------------------------------------------------
      const currentTrackX = -currentProgress * maxTranslateX;
      cardsTrack.style.transform = `translate3d(${currentTrackX.toFixed(2)}px, 0, 0)`;

      // Dynamic Card Depth & Shadow Focus
      const viewportCenter = window.innerWidth / 2;
      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distFromCenter = Math.abs(viewportCenter - cardCenter);
        const maxDist = window.innerWidth * 0.55;
        const normDist = clamp(distFromCenter / maxDist, 0, 1);

        const cardScale = lerp(1.0, 0.96, normDist * 0.7);
        const cardShadowAlpha = lerp(0.18, 0.06, normDist);

        card.style.transform = `scale(${cardScale.toFixed(3)})`;
        card.style.boxShadow = `0 24px 48px -12px rgba(0, 0, 0, ${cardShadowAlpha.toFixed(3)}), 0 4px 10px rgba(0, 0, 0, 0.04)`;
      });

      // Update Progress Scrub Bar & HUD Counter
      if (scrubFill) {
        scrubFill.style.width = `${(currentProgress * 100).toFixed(1)}%`;
      }

      if (counterEl) {
        const activeCardIdx = Math.min(cards.length, Math.max(1, Math.round(glideProgress * (cards.length - 1)) + 1));
        counterEl.textContent = `0${activeCardIdx} / 0${cards.length}`;
      }

      rafId = requestAnimationFrame(render);
    }

    // Interactive 3D Perspective Tilt Hover
    function initCardHoverTilt() {
      cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          if (!isDesktop) return;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = clamp((centerY - y) / 18, -4, 4);
          const rotateY = clamp((x - centerX) / 18, -4, 4);

          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px) scale(1.015)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1.0)';
        });
      });
    }

    calculateDimensions();
    onScroll();
    initCardHoverTilt();
    rafId = requestAnimationFrame(render);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      calculateDimensions();
      onScroll();
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPracticeMotionEd);
  } else {
    initPracticeMotionEd();
  }
})();
