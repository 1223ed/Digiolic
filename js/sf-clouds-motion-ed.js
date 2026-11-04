/**
 * ==========================================================================
 * MOTION.ED SCROLL ENGINE FOR SALESFORCE SOLUTIONS
 * Frame-by-frame match to Awwwards Zajno Motion.ed Split-Curtain & Circle Morph.
 * Incoming slides bloom directly out of the rail dot (83.333% right, 16.667% left),
 * while the outgoing slide contracts into its dot and closes up.
 * ==========================================================================
 */

(function () {
  'use strict';

  function initMotionEdSection() {
    const track = document.querySelector('.sf-motion-track');
    const stage = document.querySelector('.sf-motion-stage');
    const intro = document.getElementById('sfMotionIntro');
    const introDot = document.getElementById('sfIntroDot');
    const slides = Array.from(document.querySelectorAll('.sf-motion-slide'));

    if (!track || !stage || !slides.length) return;

    const totalSlides = slides.length;
    let targetProgress = 0;
    let currentProgress = 0;
    let rafId = null;

    // Cubic easing functions for liquid smooth morphing
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function easeInCubic(t) {
      return t * t * t;
    }

    function clamp(val, min, max) {
      return Math.min(Math.max(val, min), max);
    }

    // Measure track position and compute scroll progress P in [0, 1]
    function updateProgressFromScroll() {
      const rect = track.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;
      if (scrollableDist <= 0) {
        targetProgress = 0;
        return;
      }
      const rawProgress = -rect.top / scrollableDist;
      targetProgress = clamp(rawProgress, 0, 1);
    }

    // Timeline configuration
    const timelineStart = 0.08;
    const timelineSpan = 1.00 - timelineStart;
    const slideSpan = timelineSpan / totalSlides;
    const transSpan = slideSpan * 0.70; // Ultra-wide transition window for slow, leisurely blooming

    // Precompute intervals for all slides
    const slideIntervals = slides.map((slide, idx) => {
      const center = timelineStart + (idx + 0.5) * slideSpan;
      let enterStart = Math.max(timelineStart, center - slideSpan / 2 - transSpan / 2);
      let enterEnd = enterStart + transSpan;
      let exitEnd = Math.min(1.00, center + slideSpan / 2 + transSpan / 2);
      let exitStart = exitEnd - transSpan;

      if (idx === 0) {
        enterStart = timelineStart;
        enterEnd = timelineStart + transSpan * 0.90;
      }
      if (idx === totalSlides - 1) {
        exitStart = 0.95;
        exitEnd = 1.00;
      }

      const isRight = slide.classList.contains('sf-side-right');

      return {
        enterStart,
        enterEnd,
        exitStart,
        exitEnd,
        isRight
      };
    });

    // Render frame based on progress P
    function renderFrame(p) {
      // ------------------------------------------------------------------------
      // 1. INTRO TYPOGRAPHY STAGE (P: 0.00 -> 0.08)
      // ------------------------------------------------------------------------
      const introEnd = 0.08;
      if (p <= introEnd) {
        const introT = p / introEnd;
        intro.style.visibility = 'visible';
        intro.style.opacity = (1 - introT).toFixed(3);
        intro.style.transform = `translate3d(${-introT * 120}px, 0, 0)`;
        if (introDot) {
          introDot.style.opacity = (1 - introT).toFixed(3);
          introDot.style.transform = `translate(50%, -50%) scale(${1 - introT * 0.4})`;
        }
      } else {
        intro.style.visibility = 'hidden';
        intro.style.opacity = '0';
        if (introDot) introDot.style.opacity = '0';
      }

      // ------------------------------------------------------------------------
      // 2. SLIDES TIMELINE (P: 0.08 -> 1.00)
      // ------------------------------------------------------------------------
      slides.forEach((slide, idx) => {
        const { enterStart, enterEnd, exitStart, exitEnd, isRight } = slideIntervals[idx];

        // Is this slide active?
        const eps = 0.003;
        if (p < enterStart - eps || p > exitEnd + eps) {
          slide.classList.remove('is-visible');
          slide.style.visibility = 'hidden';
          slide.style.opacity = '0';
          slide.style.zIndex = '10';
          return;
        }

        slide.classList.add('is-visible');
        slide.style.visibility = 'visible';
        slide.style.opacity = '1';

        const panel = slide.querySelector('.sf-slide-panel');
        const content = slide.querySelector('.sf-slide-content');
        const railDot = slide.querySelector('.sf-rail-dot');

        let radiusVmax = 110;
        let contentScale = 1.0;
        let contentOpacity = 1.0;
        let dotScale = 1.0;
        let zIndex = 30;
        // Side-right slides have the panel on right, so they bloom from the left seam (0%)
        // Side-left slides have the panel on left, so they bloom from the right seam (100%)
        const centerX = isRight ? '0%' : '100%';

        if (p < enterEnd) {
          // ENTER PHASE: Bloom outwards directly from the rail dot
          const t = clamp((p - enterStart) / (enterEnd - enterStart), 0, 1);
          const eased = easeOutCubic(t);
          radiusVmax = 0.6 + eased * 109.4; // 0.6vmax (dot size) -> 110vmax (full panel)
          contentScale = 0.88 + eased * 0.12;
          contentOpacity = clamp(eased * 1.5, 0, 1);
          dotScale = 0.6 + eased * 0.4;
          zIndex = 35; // Incoming slide blossoms on top of the stage!
        } else if (p <= exitStart) {
          // HOLD PHASE: Fully open rectangle
          radiusVmax = 110;
          contentScale = 1.0;
          contentOpacity = 1.0;
          dotScale = 1.0;
          zIndex = 30;
        } else {
          // EXIT PHASE: Contract inward into the dot and close up
          const t = clamp((p - exitStart) / (exitEnd - exitStart), 0, 1);
          const eased = easeInCubic(t);
          radiusVmax = 110 - eased * 109.4; // 110vmax down to 0.6vmax
          contentScale = 1.0 - eased * 0.12;
          contentOpacity = clamp((1 - eased) * 1.5, 0, 1);
          dotScale = Math.max(0, 1.0 - eased);
          zIndex = 30; // Outgoing slide recedes underneath incoming slide
        }

        // Apply circle clip-path from exact dot coordinate
        if (panel) {
          const clipVal = `circle(${radiusVmax.toFixed(2)}vmax at ${centerX} 50%)`;
          panel.style.clipPath = clipVal;
          panel.style.webkitClipPath = clipVal;
        }
        if (content) {
          content.style.transform = `scale(${contentScale.toFixed(3)}) translate3d(0, 0, 0)`;
          content.style.opacity = contentOpacity.toFixed(3);
        }
        slide.style.zIndex = zIndex;
        if (railDot) {
          railDot.style.transform = `scale(${dotScale.toFixed(2)})`;
        }
      });
    }

    // Animation Loop with smooth slow lerp
    function tick() {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0003) {
        currentProgress += diff * 0.065; // ultra-silky, slow cinematic spring lerp for leisurely pop up bloom
      } else {
        currentProgress = targetProgress;
      }

      renderFrame(currentProgress);
      rafId = requestAnimationFrame(tick);
    }

    // Passive scroll listener
    window.addEventListener('scroll', updateProgressFromScroll, { passive: true });
    window.addEventListener('resize', updateProgressFromScroll, { passive: true });

    // Expose programmatic setter for instant sync & testing
    window.__sfSetProgress = function(p) {
      targetProgress = clamp(p, 0, 1);
      currentProgress = targetProgress;
      renderFrame(currentProgress);
    };

    // Initial sync
    updateProgressFromScroll();
    currentProgress = targetProgress;
    renderFrame(currentProgress);
    rafId = requestAnimationFrame(tick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMotionEdSection);
  } else {
    initMotionEdSection();
  }
})();
