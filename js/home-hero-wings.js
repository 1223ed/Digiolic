/**
 * ==========================================================================
 * DIGIOLIC HOMEPAGE HERO — THREE-STEP CINEMATIC CONTROLLER
 * Step 1: Solid Black Screen -> "YOUR WAIT IS WORTH NOW."
 * Step 2: Clean Stage with DIGI [PORTAL VIDEO] OLIC Expanding Stadium
 * Step 3: Portal Video Breaks Out to Full Bleed -> Settles into Manifest Lockup
 * ==========================================================================
 */

(function () {
  'use strict';

  function initHomeHeroWings() {
    const hero = document.getElementById('heroSection');
    const video = document.getElementById('homeHeroVideo');
    const toggleBtn = document.getElementById('heroMotionToggleBtn');
    const toggleLabel = toggleBtn ? toggleBtn.querySelector('.hero-motion-label') : null;

    if (!hero) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let userPaused = reducedMotionQuery.matches;

    // Settle timer: after 7.0s the intro choreography is complete
    let settleTimeoutId = null;
    function scheduleSettledState() {
      if (settleTimeoutId) clearTimeout(settleTimeoutId);
      if (reducedMotionQuery.matches) {
        hero.classList.add('is-hero-settled');
        return;
      }
      settleTimeoutId = setTimeout(function () {
        if (!userPaused) {
          hero.classList.add('is-hero-settled');
        }
      }, 7000);
    }

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
            p.catch(function () {});
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
      toggleBtn.addEventListener('click', function () {
        userPaused = !userPaused;
        syncVideoAndUi();
      });
    }

    const handleMotionPrefChange = function (e) {
      userPaused = e.matches;
      if (e.matches) {
        hero.classList.add('is-hero-settled');
      }
      syncVideoAndUi();
    };

    if (typeof reducedMotionQuery.addEventListener === 'function') {
      reducedMotionQuery.addEventListener('change', handleMotionPrefChange);
    }

    window.addEventListener('pageshow', function (e) {
      if (e.persisted && !userPaused && video) {
        video.currentTime = 0;
        syncVideoAndUi();
      }
    });

    scheduleSettledState();
    syncVideoAndUi();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeHeroWings);
  } else {
    initHomeHeroWings();
  }
})();
