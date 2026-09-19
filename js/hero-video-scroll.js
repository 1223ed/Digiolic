/**
 * DIGIOLIC — CINEMATIC SCROLL-TIED VIDEO HERO CONTROLLER
 * Smooth Lerp Scrubbing, Sequential Story Beats, Dynamic Staggers & Navbar Transitions
 * Sequence: Image 1 (Mountains, t=0s) > Image 2 (Clouds, t=3.5s) > Image 3 (Cargo Ship, t=6.8s)
 */

(function () {
  'use strict';

  const LERP_TAU = 8;
  const SNAP = 0.002;
  const MAX_SCRUB_TIME = 6.8; // Capped at cargo ship (t=6.8s), never reaching dark twilight (>7.5s)

  // Elements
  const heroWrapper = document.getElementById('heroScrollWrapper');
  const video = document.getElementById('heroBgVideo');
  const heroNavbar = document.getElementById('heroNavbar');
  const navLinks = document.querySelectorAll('.video-nav-link');
  const navRightCluster = document.getElementById('heroNavRightCluster');
  const mobileOverlay = document.getElementById('heroMobileOverlay');
  const hamburgerBtn = document.getElementById('heroHamburgerBtn');
  const menuLabelBtn = document.getElementById('heroMenuLabelBtn');
  const closeMenuBtn = document.getElementById('heroCloseMenuBtn');

  const s1 = document.getElementById('heroSection1');
  const s2 = document.getElementById('heroSection2');
  const s3 = document.getElementById('heroSection3');

  const s1Staggers = document.querySelectorAll('#heroSection1 .video-stagger-item');
  const s2Staggers = document.querySelectorAll('#heroSection2 .video-stagger-item');
  const s3Staggers = document.querySelectorAll('#heroSection3 .video-stagger-item');

  // State
  let currentTime = 0;
  let targetTime = 0;
  let lastTime = performance.now();
  let isSeeking = false;
  let pendingTime = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Navbar link entrance
  setTimeout(() => {
    navLinks.forEach((link) => {
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    });
    if (navRightCluster) {
      navRightCluster.style.opacity = '1';
      navRightCluster.style.transform = 'translateY(0)';
    }
  }, 200);

  // Mobile menu open/close
  function openMobileNav() {
    if (mobileOverlay) {
      mobileOverlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileOverlay) {
      mobileOverlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileNav);
  if (menuLabelBtn) menuLabelBtn.addEventListener('click', openMobileNav);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileNav);

  // Navigation action buttons inside sections
  document.getElementById('heroS1ActionBtn')?.addEventListener('click', () => {
    if (!heroWrapper) return;
    const maxScroll = heroWrapper.offsetHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.45, behavior: 'smooth' });
  });

  document.getElementById('heroS2DownBtn')?.addEventListener('click', () => {
    if (!heroWrapper) return;
    const maxScroll = heroWrapper.offsetHeight - window.innerHeight;
    window.scrollTo({ top: maxScroll * 0.85, behavior: 'smooth' });
  });

  document.getElementById('heroS2UpBtn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Apply smooth video seeking without queue clogging
  function applySeek(t) {
    if (!video || isNaN(t)) return;
    const clamped = Math.max(0.001, Math.min(MAX_SCRUB_TIME, t));

    if (isSeeking) {
      pendingTime = clamped;
      return;
    }

    if (Math.abs(video.currentTime - clamped) < 0.02) return;

    try {
      if ('fastSeek' in video) {
        video.fastSeek(clamped);
      } else {
        video.currentTime = clamped;
      }
    } catch {
      video.currentTime = clamped;
    }
  }

  if (video) {
    video.addEventListener('seeking', () => {
      isSeeking = true;
    });

    video.addEventListener('seeked', () => {
      isSeeking = false;
      if (pendingTime !== null) {
        const nextTime = pendingTime;
        pendingTime = null;
        applySeek(nextTime);
      }
    });

    // Prime the first frame (mountains) immediately
    function primeVideo() {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      if (video.readyState >= 1) {
        video.currentTime = 0.001;
      } else {
        video.addEventListener('loadedmetadata', () => {
          video.currentTime = 0.001;
        }, { once: true });
      }

      // Unlock video decoding pipeline safely
      const unlock = () => {
        if (video.paused) {
          const p = video.play();
          if (p !== undefined) {
            p.then(() => {
              video.pause();
              applySeek(currentTime || 0.001);
            }).catch(() => {});
          }
        }
        window.removeEventListener('scroll', unlock);
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('click', unlock);
      };
      window.addEventListener('scroll', unlock, { passive: true, once: true });
      window.addEventListener('touchstart', unlock, { passive: true, once: true });
      window.addEventListener('click', unlock, { once: true });
    }

    primeVideo();

    // Cache video into memory blob for instant, zero-latency seeking in RAM
    fetch(video.getAttribute('src') || 'hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4')
      .then((res) => {
        if (!res.ok) throw new Error('Video fetch failed');
        return res.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        const savedTime = video.currentTime;
        video.src = blobUrl;
        video.currentTime = savedTime || 0.001;
      })
      .catch(() => {
        // Fallback gracefully to direct source
      });
  }

  // Scroll Progress Calculation for the 500vh hero section
  function getProgress() {
    if (!heroWrapper) return 0;
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = heroWrapper.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return 0;
    return Math.max(0, Math.min(1, scrollY / maxScroll));
  }

  // Update Section Opacities, Staggers, and Navbar State
  function updateUI(p) {
    // Section 1: p < 0.22 -> 1, smooth fade out between 0.22 and 0.34
    const s1Opacity = p < 0.22 ? 1 : Math.max(0, 1 - (p - 0.22) / 0.12);

    // Section 2: smooth fade in 0.22 -> 0.34, stay 1 from 0.34 to 0.58, smooth fade out 0.58 -> 0.70
    const s2Opacity =
      p < 0.22
        ? 0
        : p < 0.34
        ? (p - 0.22) / 0.12
        : p < 0.58
        ? 1
        : Math.max(0, 1 - (p - 0.58) / 0.12);

    // Section 3: smooth fade in 0.58 -> 0.70, stay 1 from 0.70 to 1.0
    const s3Opacity = p < 0.58 ? 0 : p < 0.70 ? (p - 0.58) / 0.12 : 1;

    // Apply Section opacities
    if (s1) {
      s1.style.opacity = s1Opacity;
      s1.style.pointerEvents = s1Opacity > 0.08 ? 'auto' : 'none';
    }
    if (s2) {
      s2.style.opacity = s2Opacity;
      s2.style.pointerEvents = s2Opacity > 0.08 ? 'auto' : 'none';
    }
    if (s3) {
      s3.style.opacity = s3Opacity;
      s3.style.pointerEvents = s3Opacity > 0.08 ? 'auto' : 'none';
    }

    // Apply Staggers when section opacity > 0.2
    const s1Vis = s1Opacity > 0.2;
    s1Staggers.forEach((el) => {
      el.classList.toggle('is-visible', s1Vis);
    });

    const s2Vis = s2Opacity > 0.2;
    s2Staggers.forEach((el) => {
      el.classList.toggle('is-visible', s2Vis);
    });

    const s3Vis = s3Opacity > 0.2;
    s3Staggers.forEach((el) => {
      el.classList.toggle('is-visible', s3Vis);
    });

    // Update dots in Section 2
    const dots = document.querySelectorAll('.hero-v2-dot');
    if (dots.length >= 3) {
      dots[0].classList.toggle('active', p < 0.40);
      dots[0].classList.toggle('inactive', p >= 0.40);
      dots[1].classList.toggle('active', p >= 0.40 && p < 0.65);
      dots[1].classList.toggle('inactive', !(p >= 0.40 && p < 0.65));
      dots[2].classList.toggle('active', p >= 0.65);
      dots[2].classList.toggle('inactive', p < 0.65);
    }

    // Navbar Scroll Fade: At top (scrollY <= 20) visible; when scrolled down, hidden
    const heroNavLogo = document.getElementById('heroNavLogo');
    const currentScrollY = window.scrollY || window.pageYOffset;

    if (heroNavbar) {
      if (currentScrollY > 20) {
        heroNavbar.classList.add('is-scrolled');
        heroNavbar.style.setProperty('display', 'none', 'important');
        heroNavbar.style.setProperty('opacity', '0', 'important');
        heroNavbar.style.setProperty('visibility', 'hidden', 'important');
        heroNavbar.style.setProperty('pointer-events', 'none', 'important');
      } else {
        heroNavbar.classList.remove('is-scrolled');
        heroNavbar.style.removeProperty('display');
        heroNavbar.style.removeProperty('opacity');
        heroNavbar.style.removeProperty('visibility');
        heroNavbar.style.removeProperty('pointer-events');
      }

      heroNavbar.classList.add('is-light');
      if (heroNavLogo && (!heroNavLogo.src.includes('digiolic-logo-dark.png') || heroNavLogo.src.includes('digiolic-logo.png'))) {
        heroNavLogo.src = 'assets/images/digiolic-logo-dark.png?v=20260911_v4';
      }
    }
  }

  // RAF Lerp Scrubbing Loop
  function tick(now) {
    const p = getProgress();
    updateUI(p);

    // Map scroll progress to video time (0.0s = mountains, 3.5s = clouds, 6.8s = cargo ship)
    targetTime = p * MAX_SCRUB_TIME;

    const deltaSeconds = (now - lastTime) / 1000;
    lastTime = now;
    const dt = Math.min(0.1, Math.max(0.001, deltaSeconds));

    if (prefersReducedMotion) {
      currentTime = targetTime;
    } else {
      currentTime += (targetTime - currentTime) * (1 - Math.exp(-dt * LERP_TAU));
    }

    if (Math.abs(targetTime - currentTime) < SNAP) {
      currentTime = targetTime;
    }

    applySeek(currentTime);

    requestAnimationFrame(tick);
  }

  // Initial immediate frame calls
  updateUI(0);
  applySeek(0.001);
  requestAnimationFrame(tick);
})();
