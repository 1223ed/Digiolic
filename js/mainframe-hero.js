/**
 * MAINFRAME HERO CONTROLLER
 * Mouse-scrub video playback, typewriter effect, mobile drawer, and clipboard copy
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initVideoScrub();
    initTypewriter();
    initPillButtons();
    initNavbarAndDrawer();
  });

  /* ==========================================================================
     1. MOUSE-SCRUB VIDEO PLAYBACK (Anti-flood frame queueing)
     ========================================================================== */
  function initVideoScrub() {
    const video = document.getElementById('mainframeBgVideo');
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    let prevX = null;
    let targetTime = 0;
    let isSeeking = false;
    const SENSITIVITY = 0.8;

    video.addEventListener('loadedmetadata', () => {
      targetTime = Math.min(0.1, video.duration || 1);
      video.currentTime = targetTime;
    });

    video.addEventListener('seeked', () => {
      isSeeking = false;
      if (Math.abs(video.currentTime - targetTime) > 0.02) {
        performSeek();
      }
    });

    function performSeek() {
      if (isSeeking || !video.duration) return;
      isSeeking = true;
      video.currentTime = targetTime;
    }

    window.addEventListener('mousemove', (e) => {
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }

      const delta = e.clientX - prevX;
      prevX = e.clientX;

      if (!video.duration) return;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime + timeOffset));

      if (!isSeeking) {
        performSeek();
      }
    });

    // Touch support for mobile scrubbing
    let touchStartX = null;
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (touchStartX === null || !video.duration || e.touches.length === 0) return;
      const currentTouchX = e.touches[0].clientX;
      const delta = currentTouchX - touchStartX;
      touchStartX = currentTouchX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime + timeOffset));

      if (!isSeeking) {
        performSeek();
      }
    }, { passive: true });
  }

  /* ==========================================================================
     2. TYPEWRITER EFFECT WITH BLINKING CURSOR
     ========================================================================== */
  function initTypewriter() {
    const textEl = document.getElementById('mainframeTypewriterText');
    const cursorEl = document.getElementById('mainframeTypewriterCursor');
    if (!textEl) return;

    const fullText = "Glad you stopped in. Good taste tends to find us. Now, what are we building?";
    const speed = 38; // ms per character
    const startDelay = 600; // ms

    textEl.textContent = '';

    setTimeout(() => {
      let index = 0;
      const timer = setInterval(() => {
        if (index < fullText.length) {
          textEl.textContent += fullText.charAt(index);
          index++;
        } else {
          clearInterval(timer);
          if (cursorEl) {
            cursorEl.style.display = 'none';
          }
        }
      }, speed);
    }, startDelay);
  }

  /* ==========================================================================
     3. ACTION PILL BUTTONS & COPY EMAIL HANDLER
     ========================================================================== */
  function initPillButtons() {
    const container = document.getElementById('mainframeActionPills');
    if (container) {
      setTimeout(() => {
        container.classList.add('is-visible');
      }, 400);
    }

    const copyBtn = document.getElementById('mainframeCopyEmailBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = 'hello@mainframe.co';
        navigator.clipboard.writeText(email).then(() => {
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = `<span>Copied hello@mainframe.co!</span> <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
          copyBtn.style.background = '#FFFFFF';
          copyBtn.style.color = '#000000';
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
            copyBtn.style.color = '';
          }, 2000);
        }).catch(() => {
          // Fallback
          window.location.href = 'mailto:hello@mainframe.co';
        });
      });
    }
  }

  /* ==========================================================================
     4. NAVBAR & MOBILE DRAWER TOGGLE
     ========================================================================== */
  function initNavbarAndDrawer() {
    const menuBtn = document.getElementById('mainframeMenuBtn');
    const overlay = document.getElementById('mainframeMobileOverlay');
    if (!menuBtn || !overlay) return;

    let isOpen = false;

    function toggleMenu() {
      isOpen = !isOpen;
      menuBtn.classList.toggle('is-active', isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      overlay.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    menuBtn.addEventListener('click', toggleMenu);

    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (isOpen) toggleMenu();
      });
    });
  }
})();
