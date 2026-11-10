/**
 * DIGIOLIC CONTACT PAGE — TRIONN MOTION & INTERACTION CONTROLLER
 * Handles GSAP ScrollTrigger Venetian Blinds Shutter Transition,
 * Custom Select Sync with Zoho CRM, Floating Labels & FAQ Accordion.
 */

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
  initShutterScrollTransition();
  initCustomServiceSelect();
  initFloatingLabels();
  initScrollDownAction();
  initHeroHangingVideoLoop();
  initContactAudio();
});

window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
});

/**
 * 1. GSAP ScrollTrigger Venetian Blinds Shutter Wipe Transition
 */
function initShutterScrollTransition() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded. Shutter animation will fallback.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const bannerSection = document.getElementById('contact-banner-section');
  const stripes = Array.from(document.querySelectorAll('.stripe-item')); // In order: 0 is top, 4 is bottom
  const bannerScrollBtn = document.getElementById('bannerScrollDownBtn');
  const bannerSoundBtn = document.getElementById('bannerAudioToggleBtn');
  const bannerText = document.querySelector('.banner-text-content');
  const navbar = document.getElementById('mainframeNavbar');
  const formsSection = document.getElementById('contact-forms-section');

  if (!bannerSection || stripes.length === 0) return;

  // Disable browser automatic scroll restoration to ensure precise GSAP coordinates on fresh reload
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  let heroVideoController = null;
  let activeShutterTl = null;

  // Foolproof navbar theme manager based on section boundaries & shutter progress
  function updateNavbarTheme() {
    if (!navbar || !formsSection) return;
    const formsRect = formsSection.getBoundingClientRect();
    const currentMapSection = document.getElementById('contactMapSection');
    const mapRect = currentMapSection ? currentMapSection.getBoundingClientRect() : null;

    if (mapRect && mapRect.bottom <= 80) {
      // Scrolled past the map into the dark footer
      navbar.classList.add('is-nav-dark');
    } else if (formsRect.bottom <= 80) {
      // Scrolled past the dark form section into the light Google Map
      navbar.classList.remove('is-nav-dark');
    } else if (formsRect.top <= 80) {
      // Inside the dark form section
      navbar.classList.add('is-nav-dark');
    } else {
      // Inside the hero banner: check shutter wipe progress if on desktop
      if (window.innerWidth > 768 && activeShutterTl && activeShutterTl.scrollTrigger) {
        const progress = activeShutterTl.scrollTrigger.progress;
        if (progress > 0.45) {
          navbar.classList.add('is-nav-dark');
          return;
        }
      }
      navbar.classList.remove('is-nav-dark');
    }
  }

  window.addEventListener('scroll', updateNavbarTheme, { passive: true });
  window.addEventListener('resize', updateNavbarTheme, { passive: true });

  // Use gsap.matchMedia for clean desktop vs mobile segregation
  const mm = gsap.matchMedia();

  // Desktop (> 768px): Pinned Venetian Blinds wipe
  mm.add("(min-width: 769px)", () => {
    stripes.forEach(s => {
      gsap.set(s, { scaleY: 0, transformOrigin: 'bottom' });
    });

    if (formsSection) {
      gsap.set(formsSection, { marginTop: '-100dvh' });
    }

    const shutterTl = gsap.timeline({
      scrollTrigger: {
        trigger: bannerSection,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        pinSpacing: true,
        onUpdate: () => {
          updateNavbarTheme();
          if (heroVideoController && heroVideoController.syncWithScroll) {
            heroVideoController.syncWithScroll();
          }
        }
      },
      defaults: { ease: 'none' }
    });

    activeShutterTl = shutterTl;

    if (bannerScrollBtn) {
      shutterTl.to(bannerScrollBtn, { opacity: 0, y: -20, duration: 0.15, ease: 'none' }, 0);
    }
    if (bannerText) {
      shutterTl.to(bannerText, { y: -60, opacity: 0.15, duration: 0.4, ease: 'none' }, 0);
    }

    shutterTl.addLabel('stripes_start', 0.05);
    const totalStripes = stripes.length;
    for (let e = 0; e < totalStripes; e++) {
      const r = (0.3 * (totalStripes - 1 - e)) / (totalStripes - 1);
      const s = r + 0.3;
      shutterTl.to(stripes[e], {
        scaleY: 1,
        duration: s - r,
        ease: 'none'
      }, `stripes_start+=${r}`);
    }
    shutterTl.to({}, { duration: 0.15 });

    return () => {
      activeShutterTl = null;
      if (formsSection) gsap.set(formsSection, { clearProps: 'marginTop' });
      stripes.forEach(s => gsap.set(s, { clearProps: 'all' }));
    };
  });

  // Mobile (<= 768px): Natural, frictionless scroll flow - zero empty spacer gaps
  mm.add("(max-width: 768px)", () => {
    activeShutterTl = null;
    if (formsSection) {
      gsap.set(formsSection, { marginTop: 0 });
    }
    stripes.forEach(s => {
      gsap.set(s, { scaleY: 0 });
    });
    if (bannerScrollBtn) {
      gsap.set(bannerScrollBtn, { opacity: 1, y: 0 });
    }
    if (bannerText) {
      gsap.set(bannerText, { opacity: 1, y: 0 });
    }
  });

  updateNavbarTheme();

  // Initialize Hero Centerpiece Hanging Video controller linked to scroll
  heroVideoController = initHeroHangingVideoLoop();
}

/**
 * 2. Hero Centerpiece Hanging Video Motion Controller
 * - Plays entrance animation ONCE on initial page load (0.0s to 4.55s: Zoho, Salesforce, Digital Marketing swing down on strings).
 * - From 4.55s onwards, keeps the hanging sway in continuous, infinite motion.
 * - Employs a seamless dual-video micro-crossfade between 9.85s and 4.55s so the entrance drop NEVER restarts/repeats and swaying is 100% fluid.
 * - Uses in-memory Blob caching to ensure instant, zero-latency seeking across all server types.
 * - Automatically pauses when scrolled down out of view, and resumes immediately when returning to the hero stage.
 */
function initHeroHangingVideoLoop() {
  const container = document.getElementById('bannerVideoContainer');
  const vidA = document.getElementById('bannerHeroVideoA');
  const vidB = document.getElementById('bannerHeroVideoB');

  if (!container || !vidA) return null;

  const LOOP_START = 4.55;
  const LOOP_END = 9.85;
  const CROSSFADE_DURATION = 0.35; // 350ms smooth blend window

  let activeVideo = vidA;
  let standbyVideo = vidB;
  let isTransitioning = false;
  let userScrolledAway = false;

  // Fetch as Blob for zero-latency seeking in memory
  const sourceEl = vidA.querySelector('source');
  const videoSrc = sourceEl ? sourceEl.getAttribute('src') : (vidA.currentSrc || '../assets/videos/contact-hero-video.mp4');

  fetch(videoSrc)
    .then(res => res.blob())
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const currentTimeA = vidA.currentTime || 0;
      const isPausedA = vidA.paused;

      vidA.src = blobUrl;
      vidA.currentTime = currentTimeA;
      const pA = vidA.play();
      if (pA !== undefined) {
        pA.catch(() => {});
      }

      if (vidB) {
        vidB.src = blobUrl;
        vidB.currentTime = LOOP_START;
      }
    })
    .catch(err => {
      console.warn('Hero video Blob caching fallback:', err);
    });

  function performCrossfade() {
    if (isTransitioning || !standbyVideo) return;
    isTransitioning = true;

    // Start standby video at the start of the hanging idle motion
    standbyVideo.currentTime = LOOP_START;
    const playPromise = standbyVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }

    // Blend: standby video fades in to visible, active video fades out
    standbyVideo.classList.remove('is-standby');
    activeVideo.classList.add('is-standby');

    // Swap active and standby references
    const prevActive = activeVideo;
    activeVideo = standbyVideo;
    standbyVideo = prevActive;

    setTimeout(() => {
      if (!userScrolledAway) {
        prevActive.pause();
        prevActive.currentTime = LOOP_START;
      }
      isTransitioning = false;
    }, CROSSFADE_DURATION * 1000 + 60);
  }

  function handleTimeUpdate(e) {
    const v = e.target;
    if (v !== activeVideo) return;

    if (v.currentTime >= (LOOP_END - CROSSFADE_DURATION)) {
      if (standbyVideo) {
        performCrossfade();
      } else {
        // Fallback for single video
        v.currentTime = LOOP_START;
        v.play().catch(() => {});
      }
    }
  }

  vidA.addEventListener('timeupdate', handleTimeUpdate);
  if (vidB) {
    vidB.addEventListener('timeupdate', handleTimeUpdate);
  }

  function handleEnded(e) {
    if (standbyVideo) {
      performCrossfade();
    } else {
      e.target.currentTime = LOOP_START;
      e.target.play().catch(() => {});
    }
  }

  vidA.addEventListener('ended', handleEnded);
  if (vidB) {
    vidB.addEventListener('ended', handleEnded);
  }

  // Ensure initial play
  vidA.play().catch(() => {
    const onFirstGesture = () => {
      vidA.play().catch(() => {});
      window.removeEventListener('pointerdown', onFirstGesture);
      window.removeEventListener('scroll', onFirstGesture);
    };
    window.addEventListener('pointerdown', onFirstGesture, { passive: true });
    window.addEventListener('scroll', onFirstGesture, { passive: true });
  });

  function syncWithScroll() {
    const bannerSection = document.getElementById('contact-banner-section');
    if (!bannerSection) return;
    const rect = bannerSection.getBoundingClientRect();
    const inView = rect.bottom > 80 && rect.top < window.innerHeight;

    if (!inView) {
      if (!userScrolledAway) {
        userScrolledAway = true;
        if (activeVideo && !activeVideo.paused) {
          activeVideo.pause();
        }
      }
    } else {
      if (userScrolledAway) {
        userScrolledAway = false;
        if (activeVideo && activeVideo.paused) {
          activeVideo.play().catch(() => {});
        }
      }
    }
  }

  window.addEventListener('scroll', syncWithScroll, { passive: true });

  return {
    syncWithScroll,
    getActiveVideo: () => activeVideo
  };
}

/**
 * 3. Contact Background Audio Controller (Exact match to Zoho & About Us pages)
 * - Plays name-story.mp3 in the background with interactive toggle button to the left of Menu
 * - Automatically unlocks on first gesture if browser blocks immediate unmuted autoplay
 */
function initContactAudio() {
  const audio = document.getElementById('contactStoryAudio');
  const toggleBtn = document.getElementById('contactAudioToggleBtn');
  if (!audio || !toggleBtn) return;

  let userManuallyPaused = false;
  let isPlaying = true;
  let gestureUnlocked = false;
  audio.volume = 0.85;

  function updateUI(active) {
    if (active) {
      toggleBtn.classList.add('is-playing');
      toggleBtn.classList.remove('is-paused');
      toggleBtn.setAttribute('aria-pressed', 'true');
      toggleBtn.setAttribute('title', 'Pause Song');
    } else {
      toggleBtn.classList.remove('is-playing');
      toggleBtn.classList.add('is-paused');
      toggleBtn.setAttribute('aria-pressed', 'false');
      toggleBtn.setAttribute('title', 'Play Song');
    }
  }

  function startAudio() {
    isPlaying = true;
    updateUI(true);
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          updateUI(true);
        })
        .catch(() => {
          // Autoplay policy caught initial play; wait for gesture
          if (!userManuallyPaused) {
            updateUI(true);
          }
        });
    } else {
      updateUI(true);
    }
  }

  function stopAudio() {
    if (!audio.paused) {
      audio.pause();
    }
    isPlaying = false;
    updateUI(false);
  }

  audio.addEventListener('play', () => {
    isPlaying = true;
    updateUI(true);
  });
  audio.addEventListener('pause', () => {
    if (userManuallyPaused) {
      isPlaying = false;
      updateUI(false);
    }
  });

  // Toggle button click: manual Play / Pause
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    gestureUnlocked = true;
    if (!audio.paused || isPlaying) {
      userManuallyPaused = true;
      stopAudio();
    } else {
      userManuallyPaused = false;
      startAudio();
    }
  });

  // Attempt initial playback immediately on load
  startAudio();

  // Gesture unlock on any user movement / gesture / click / scroll / keydown
  const unlockEvents = ['pointerdown', 'mousedown', 'click', 'touchstart', 'touchend', 'scroll', 'wheel', 'keydown', 'mousemove'];
  function unlockAutoplayOnGesture() {
    if (gestureUnlocked) return;
    if (userManuallyPaused) return;

    if (audio.paused) {
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          gestureUnlocked = true;
          unlockEvents.forEach((evt) => window.removeEventListener(evt, unlockAutoplayOnGesture));
          updateUI(true);
        }).catch(() => {});
      }
    }
  }

  unlockEvents.forEach((evt) => window.addEventListener(evt, unlockAutoplayOnGesture, { passive: true }));
}

/**
 * 4. Scroll Down Button Action
 */
function initScrollDownAction() {
  const btn = document.getElementById('bannerScrollDownBtn');
  const formsSection = document.getElementById('contact-forms-section');

  if (btn && formsSection) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        formsSection.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      // On desktop, smooth scroll past the pinned hero banner directly into the form
      const bannerSection = document.getElementById('contact-banner-section');
      const factor = 2.05;
      const targetOffset = bannerSection ? (bannerSection.offsetHeight * factor) : window.innerHeight * 2;
      window.scrollTo({
        top: targetOffset,
        behavior: 'smooth'
      });
    });
  }
}

/**
 * 3. Custom Multi-Select Dropdown Synced with Zoho CRM LEADCF1
 */
function initCustomServiceSelect() {
  const selectWrap = document.getElementById('trionnServicesSelect');
  const nativeSelect = document.getElementById('LEADCF1');
  if (!selectWrap || !nativeSelect) return;

  const trigger = selectWrap.querySelector('.trionn-select-trigger');
  const triggerText = document.getElementById('trionnSelectTriggerText');
  const checkboxes = selectWrap.querySelectorAll('.trionn-opt-item input[type="checkbox"]');
  const chipsDisplay = document.getElementById('trionnSelectedChips');

  function syncServices() {
    const selected = [];
    // Reset native options
    Array.from(nativeSelect.options).forEach(opt => opt.selected = false);

    checkboxes.forEach(cb => {
      if (cb.checked) {
        const val = cb.getAttribute('data-service-val');
        selected.push(val);
        // Find and select in native hidden select
        Array.from(nativeSelect.options).forEach(nativeOpt => {
          if (nativeOpt.value.toLowerCase() === val.toLowerCase()) {
            nativeOpt.selected = true;
          }
        });
      }
    });

    chipsDisplay.innerHTML = '';
    if (selected.length === 0) {
      triggerText.textContent = 'Select a service';
      triggerText.classList.remove('has-selection');
      selectWrap.closest('.form-field-group')?.classList.remove('has-value');
    } else {
      triggerText.textContent = selected.length === 1 
        ? selected[0] 
        : `${selected.length} services selected`;
      triggerText.classList.add('has-selection');
      selectWrap.closest('.form-field-group')?.classList.add('has-value');

      selected.forEach(svc => {
        const chip = document.createElement('span');
        chip.className = 'trionn-chip-tag';
        chip.innerHTML = `${svc} <span class="chip-del" data-val="${svc}">&times;</span>`;
        chipsDisplay.appendChild(chip);
      });
    }
  }

  // Toggle Dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    selectWrap.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', selectWrap.classList.contains('is-open'));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!selectWrap.contains(e.target)) {
      selectWrap.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Checkbox change
  checkboxes.forEach(cb => {
    cb.addEventListener('change', syncServices);
  });

  // Chip removal
  chipsDisplay.addEventListener('click', (e) => {
    if (e.target.classList.contains('chip-del')) {
      const val = e.target.getAttribute('data-val');
      checkboxes.forEach(cb => {
        if (cb.getAttribute('data-service-val') === val) {
          cb.checked = false;
        }
      });
      syncServices();
    }
  });

  syncServices();
}

/**
 * 4. Floating Labels & Badge State Transitions
 */
function initFloatingLabels() {
  const inputs = document.querySelectorAll('.trionn-input, .trionn-textarea');
  inputs.forEach(input => {
    const parent = input.closest('.form-field-group');
    if (!parent) return;

    function checkValue() {
      if (input.value && input.value.trim().length > 0) {
        parent.classList.add('has-value');
      } else {
        parent.classList.remove('has-value');
      }
    }

    input.addEventListener('focus', () => {
      parent.classList.add('is-focused');
      parent.classList.remove('has-error');
    });

    input.addEventListener('blur', () => {
      parent.classList.remove('is-focused');
      checkValue();
    });

    input.addEventListener('input', checkValue);
    checkValue();
  });
}


