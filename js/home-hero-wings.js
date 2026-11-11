/**
 * ==========================================================================
 * DIGIOLIC HOMEPAGE HERO — WINGS CINEMATIC CONTROLLER
 * 1. Initializes looped ambient playback of wings-v8_1080p.mp4 without scroll lock
 * 2. Applies fallback --sibling-index custom property for letter stagger ONLY
 *    when native CSS sibling-index() is unsupported (Modern Web Guidance)
 * 3. Respects prefers-reduced-motion and wires the Pause/Play accessibility button
 * ==========================================================================
 */

(function () {
  'use strict';

  function initHomeHeroWings() {
    const hero = document.getElementById('heroSection');
    const video = document.getElementById('homeHeroVideo');
    const wordEl = document.getElementById('heroDigiolicWord');
    const toggleBtn = document.getElementById('heroMotionToggleBtn');
    const toggleLabel = toggleBtn ? toggleBtn.querySelector('.hero-motion-label') : null;

    if (!hero) return;

    // Sibling-index fallback for older browsers without native CSS sibling-index()
    if (wordEl && !CSS.supports('animation-delay: calc(sibling-index() * 0.1s)')) {
      Array.from(wordEl.children).forEach((el, index) => {
        el.style.setProperty('--sibling-index', String(index + 1));
      });
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let userPaused = reducedMotionQuery.matches;

    function syncVideoAndUi() {
      if (userPaused) {
        hero.classList.add('is-hero-paused');
        if (video && !video.paused) {
          video.pause();
        }
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-label', 'Play hero animation');
          toggleBtn.setAttribute('title', 'Play animation');
        }
        if (toggleLabel) toggleLabel.textContent = 'Play';
      } else {
        hero.classList.remove('is-hero-paused');
        if (video) {
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          const p = video.play();
          if (p && typeof p.catch === 'function') {
            p.catch(() => {});
          }
        }
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-label', 'Pause hero animation');
          toggleBtn.setAttribute('title', 'Pause animation');
        }
        if (toggleLabel) toggleLabel.textContent = 'Pause';
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        userPaused = !userPaused;
        syncVideoAndUi();
      });
    }

    const handleMotionPrefChange = (e) => {
      userPaused = e.matches;
      syncVideoAndUi();
    };

    if (typeof reducedMotionQuery.addEventListener === 'function') {
      reducedMotionQuery.addEventListener('change', handleMotionPrefChange);
    }

    window.addEventListener('pageshow', (e) => {
      if (e.persisted && !userPaused && video) {
        video.currentTime = 0;
        syncVideoAndUi();
      }
    });

    syncVideoAndUi();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeHeroWings);
  } else {
    initHomeHeroWings();
  }
})();

