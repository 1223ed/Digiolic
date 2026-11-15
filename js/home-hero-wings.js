/**
 * ==========================================================================
 * DIGIOLIC HOMEPAGE HERO — CINEMATIC GSAP THREE-STEP CONTROLLER
 * 
 * 1. Step 1 (Intro Screen):
 *    - Full-screen solid black background.
 *    - Large bold centered heading: "YOUR WAIT IS WORTH NOW".
 *    - 2.5-second hold before smooth fade-out.
 * 
 * 2. Step 2 (Video Reveal / Mask Animation):
 *    - Seamless transition into Wild-style video sequence (word 'DIGIOLIC').
 *    - Center vertical slit mask opens between DIGI and OLIC.
 *    - Expands into circle, then into wide stadium capsule mask.
 *    - Dynamic video element playing inside: assets/videos/hero-video.mp4
 * 
 * 3. Step 3 (Video Expansion / Card Displacement):
 *    - Video gracefully "comes out" and scales to fill framed background container.
 *    - DIGI and OLIC displace outward and fade away.
 *    - Framed container layout matching assets/images/hero-image.png settles in.
 *    - Triggered automatically as video progresses OR on user scroll / click.
 * ==========================================================================
 */

(function () {
  'use strict';

  // Modular Configuration Constants (Easily swappable)
  const HERO_CONFIG = {
    // Assets
    videoPlaceholder: 'assets/videos/hero-video.mp4',
    imagePlaceholder: 'assets/images/hero-image.png',

    // Timings (in seconds)
    step1Hold: 2.5,          // Requested 2.5s hold on black intro
    step1Fade: 0.8,          // Transition time for intro screen
    step2SlitOpen: 0.45,     // Slit mask opening
    step2CircleExpand: 0.55, // Expansion into circle
    step2StadiumWiden: 0.7,  // Widening into stadium pill
    step2Hold: 2.0,          // Hold showing video in stadium mask
    step3Expand: 1.0,        // Scaling / coming out to framed container
    step3LockupRise: 0.8,    // Lockup emergence matching hero-image.png
  };

  function initHomeHero() {
    const hero = document.getElementById('heroSection');
    if (!hero) return;

    const curtain = document.getElementById('heroStep1');
    const waitText = document.getElementById('heroWaitLine');
    const step2Stage = document.getElementById('heroStep2');
    const splitDigi = hero.querySelector('.hero-split-digi');
    const splitOlic = hero.querySelector('.hero-split-olic');
    const slitSpacer = document.getElementById('heroSlitSpacer');
    const portalWindow = document.getElementById('heroPortalWindow');
    const portalOverlay = document.getElementById('heroPortalOverlay');
    const video = document.getElementById('homeHeroVideo');
    const navbar = document.getElementById('heroNavbar');
    const bottomControls = document.getElementById('heroBottomControls');
    const manifestAct = document.getElementById('heroManifestAct');
    const toggleBtn = document.getElementById('heroMotionToggleBtn');
    const toggleLabel = toggleBtn ? toggleBtn.querySelector('.hero-motion-label') : null;

    // Check motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isUserPaused = prefersReducedMotion;
    let isStep3Active = false;

    // Responsive dimensions for Step 2 stadium pill
    function getPillDimensions() {
      const isMobile = window.innerWidth <= 480;
      const isTablet = window.innerWidth <= 768;
      const height = isMobile ? 100 : (isTablet ? 140 : 230);
      const width = isMobile ? Math.min(220, window.innerWidth * 0.44) : (isTablet ? 280 : 540);
      return { width, height };
    }

    // Ensure video plays continuously
    function startVideo() {
      if (!video) return;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    // GSAP Timeline Implementation
    let heroTl = null;

    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
      hero.classList.add('has-gsap-hero');

      const pillDims = getPillDimensions();

      // Initial State Setup with GSAP
      gsap.set(curtain, { opacity: 1, visibility: 'visible' });
      gsap.set(waitText, { opacity: 0, scale: 0.94, y: 28 });
      gsap.set(step2Stage, { opacity: 1, visibility: 'visible' });
      gsap.set(splitDigi, { x: 0, opacity: 1 });
      gsap.set(splitOlic, { x: 0, opacity: 1 });
      gsap.set(slitSpacer, { width: 0, height: pillDims.height });
      gsap.set(portalWindow, {
        width: 0,
        height: pillDims.height,
        borderRadius: 9999,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      });
      gsap.set(portalOverlay, { opacity: 0 });
      gsap.set(navbar, { opacity: 0, pointerEvents: 'none' });
      gsap.set(bottomControls, { opacity: 0, pointerEvents: 'none' });
      gsap.set(manifestAct, { opacity: 0, y: 28 });

      // Create Master Timeline
      heroTl = gsap.timeline({
        paused: isUserPaused,
        onComplete: function () {
          hero.classList.add('is-hero-settled');
        }
      });

      // ======================================================================
      // 1. Step 1 (Intro Screen): Black background + "YOUR WAIT IS WORTH NOW"
      // ======================================================================
      heroTl
        .to(waitText, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, 0.1)
        // Hold for the specified 2.5s duration
        .to(waitText, {
          opacity: 0,
          y: -18,
          scale: 1.02,
          duration: 0.5,
          ease: 'power2.in'
        }, HERO_CONFIG.step1Hold)
        .to(curtain, {
          opacity: 0,
          duration: HERO_CONFIG.step1Fade,
          ease: 'power2.inOut',
          onComplete: function () {
            curtain.style.visibility = 'hidden';
          }
        }, HERO_CONFIG.step1Hold + 0.1);

      // ======================================================================
      // 2. Step 2 (Video Reveal / Mask Animation): Slit -> Circle -> Stadium
      // ======================================================================
      const step2Start = HERO_CONFIG.step1Hold + HERO_CONFIG.step1Fade - 0.15;

      heroTl
        // 2a. Slit opens vertically between DIGI and OLIC
        .to([slitSpacer, portalWindow], {
          width: 14,
          duration: HERO_CONFIG.step2SlitOpen,
          ease: 'power1.inOut'
        }, step2Start)
        // 2b. Expands into circle
        .to([slitSpacer, portalWindow], {
          width: pillDims.height,
          duration: HERO_CONFIG.step2CircleExpand,
          ease: 'power2.out'
        }, step2Start + HERO_CONFIG.step2SlitOpen)
        // 2c. Widens into stadium pill, pushing DIGI left and OLIC right
        .to([slitSpacer, portalWindow], {
          width: pillDims.width,
          duration: HERO_CONFIG.step2StadiumWiden,
          ease: 'power3.out'
        }, step2Start + HERO_CONFIG.step2SlitOpen + HERO_CONFIG.step2CircleExpand);

      // ======================================================================
      // 3. Step 3 (Video Expansion / Card Displacement into Framed Layout):
      // ======================================================================
      const step3Start = step2Start + HERO_CONFIG.step2SlitOpen + HERO_CONFIG.step2CircleExpand + HERO_CONFIG.step2StadiumWiden + HERO_CONFIG.step2Hold;
      
      heroTl.addLabel('step3', step3Start);

      heroTl
        // 3a. Video container "comes out" / expands to full framed hero container
        .to(portalWindow, {
          width: '100%',
          height: '100%',
          borderRadius: 0,
          boxShadow: 'none',
          border: 'none',
          duration: HERO_CONFIG.step3Expand,
          ease: 'expo.out'
        }, 'step3')
        // 3b. DIGI and OLIC displace outward and fade out
        .to(splitDigi, {
          x: -120,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.in'
        }, 'step3')
        .to(splitOlic, {
          x: 120,
          opacity: 0,
          duration: 0.65,
          ease: 'power2.in'
        }, 'step3')
        .to(step2Stage, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: function () {
            step2Stage.style.visibility = 'hidden';
          }
        }, 'step3+=0.1')
        // 3c. Dark ambient vignette overlay fades in over the video
        .to(portalOverlay, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut'
        }, 'step3+=0.1')
        // 3d. Framed layout lockup emerges (matching hero-image.png)
        .to(manifestAct, {
          opacity: 1,
          y: 0,
          duration: HERO_CONFIG.step3LockupRise,
          ease: 'power3.out'
        }, 'step3+=0.3')
        // 3e. Navigation and bottom chrome fade into place
        .to([navbar, bottomControls], {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.7,
          ease: 'power2.out'
        }, 'step3+=0.3');

      // Update pill dimensions on resize if timeline is still before Step 3
      window.addEventListener('resize', function () {
        if (!isStep3Active && heroTl && heroTl.time() < step3Start) {
          const dims = getPillDimensions();
          gsap.set(slitSpacer, { height: dims.height });
        }
      }, { passive: true });

    } else {
      // Fallback or Reduced Motion Mode
      if (prefersReducedMotion) {
        hero.classList.add('is-hero-settled');
      } else {
        // Fallback timer for CSS animations
        setTimeout(function () {
          hero.classList.add('is-hero-settled');
        }, 7500);
      }
    }

    // Interactive Trigger: Jump/accelerate to Step 3 on user click or scroll
    function triggerStep3() {
      if (isStep3Active) return;
      isStep3Active = true;
      if (heroTl) {
        if (heroTl.time() < heroTl.labels.step3) {
          // Smoothly advance timeline to step3
          heroTl.tweenTo('step3', {
            duration: 0.35,
            ease: 'power2.inOut',
            onComplete: function () {
              heroTl.play();
            }
          });
        }
      } else {
        hero.classList.add('is-hero-settled');
      }
    }

    // Click trigger on hero section (excluding navigation links & controls)
    hero.addEventListener('click', function (e) {
      if (e.target.closest('a, button, .home-hero-actions, .home-hero-bottom')) return;
      triggerStep3();
    });

    // Scroll trigger: if user scrolls down, advance to Step 3 immediately
    window.addEventListener('scroll', function () {
      if (window.scrollY > 35) {
        triggerStep3();
      }
    }, { passive: true });

    // Pause / Play Controller
    function syncPlayback() {
      if (isUserPaused) {
        hero.classList.add('is-hero-paused');
        if (heroTl) heroTl.pause();
        if (video && !video.paused) video.pause();
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-label', 'Play hero animation');
          toggleBtn.setAttribute('title', 'Play animation');
        }
        if (toggleLabel) toggleLabel.textContent = 'Play';
      } else {
        hero.classList.remove('is-hero-paused');
        if (heroTl) heroTl.play();
        startVideo();
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-label', 'Pause hero animation');
          toggleBtn.setAttribute('title', 'Pause animation');
        }
        if (toggleLabel) toggleLabel.textContent = 'Pause';
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        isUserPaused = !isUserPaused;
        syncPlayback();
      });
    }

    // Prefers-reduced-motion listener
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (typeof reducedMotionQuery.addEventListener === 'function') {
      reducedMotionQuery.addEventListener('change', function (e) {
        if (e.matches) {
          if (heroTl) heroTl.progress(1);
          hero.classList.add('is-hero-settled');
        }
      });
    }

    // Auto-start video
    startVideo();
    syncPlayback();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeHero);
  } else {
    initHomeHero();
  }
})();
