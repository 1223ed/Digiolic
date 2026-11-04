/**
 * Client Testimonials Hero — Monumental Spatial Intro
 * Exact same architectural split-text character wave & scroll scrubbing as Why Choose Digiolic
 */
(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initClientTestimonialsHero);
  } else {
    initClientTestimonialsHero();
  }

  function initClientTestimonialsHero() {
    const section = document.getElementById('clientTestimonialsHero');
    if (!section) return;

    const titleLine1 = section.querySelector('#ctTitleLine1');
    const titleLine2 = section.querySelector('#ctTitleLine2');
    const pillBadge = section.querySelector('#ctPillBadge');
    const leadDesc = section.querySelector('#ctLeadDesc');
    const scrollPrompt = section.querySelector('#ctScrollPrompt');

    if (!titleLine1 || !titleLine2) return;

    // =========================================================================
    // 1. CHARACTER-LEVEL SPLIT TEXT INITIALIZATION (Same as Why Choose Digiolic)
    // =========================================================================
    let allChars = [];

    function setupTextAnimation() {
      function splitIntoChars(element, startingIndex) {
        const rawText = element.textContent.trim();
        element.innerHTML = '';
        let currentIndex = startingIndex;

        for (let i = 0; i < rawText.length; i++) {
          const char = rawText[i];
          const span = document.createElement('span');
          span.className = 'ct-char' + (char === ' ' ? ' space' : '');
          span.textContent = char === ' ' ? '\u00A0' : char;
          element.appendChild(span);
          allChars.push({ el: span, index: currentIndex });
          currentIndex++;
        }
        return currentIndex;
      }

      allChars = [];
      const nextIdx = splitIntoChars(titleLine1, 0);
      splitIntoChars(titleLine2, nextIdx);
    }

    setupTextAnimation();

    // =========================================================================
    // 2. BUTTERY SMOOTH LERPED SCROLL SCRUBBING ENGINE (Same as Why Choose Digiolic)
    // =========================================================================
    let targetProgress = 0;
    let currentProgress = 0;
    let isTicking = false;

    function easeOutCubic(t) {
      const p = Math.min(1, Math.max(0, t));
      return 1 - Math.pow(1 - p, 3);
    }

    function calculateScrollProgress() {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = section.offsetHeight - vh;
      if (totalScroll <= 0) return 0;

      const rawProgress = -rect.top / totalScroll;
      return Math.max(0, Math.min(1, rawProgress));
    }

    function onScroll() {
      targetProgress = calculateScrollProgress();

      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateScrollAnimation);
      }
    }

    function updateScrollAnimation() {
      // Silky, slow, luxurious lerp smoothing (0.09) - matching Why Choose Digiolic
      currentProgress += (targetProgress - currentProgress) * 0.09;

      // 1. Title Character Wave Entrance (Progress: 0.00 -> 0.38)
      const totalChars = allChars.length;
      allChars.forEach((item) => {
        const charStart = (item.index / totalChars) * 0.18;
        const charP = Math.max(0, Math.min(1, (currentProgress - charStart) / 0.16));
        const charEase = easeOutCubic(charP);
        const transY = Math.round((1 - charEase) * 115);
        item.el.style.transform = `translateY(${transY}%)`;
        item.el.style.opacity = charP > 0.04 ? '1' : '0';
      });

      // 2. Pill Badge, Lead Description & Scroll Prompt Fade-in (Progress: 0.22 -> 0.45)
      const auxProgress = Math.max(0, Math.min(1, (currentProgress - 0.20) / 0.25));
      const auxEase = easeOutCubic(auxProgress);

      if (pillBadge) {
        pillBadge.style.opacity = (auxEase).toFixed(3);
        pillBadge.style.transform = `translateY(${Math.round((1 - auxEase) * 20)}px)`;
      }

      if (leadDesc) {
        leadDesc.style.opacity = (auxEase).toFixed(3);
        leadDesc.style.transform = `translateY(${Math.round((1 - auxEase) * 20)}px)`;
      }

      if (scrollPrompt) {
        scrollPrompt.style.opacity = (auxEase * 0.7).toFixed(3);
        scrollPrompt.style.transform = `translateY(${Math.round((1 - auxEase) * 20)}px)`;
      }

      // Continue animation frame while smoothing difference exists
      if (Math.abs(targetProgress - currentProgress) > 0.001) {
        requestAnimationFrame(updateScrollAnimation);
      } else {
        isTicking = false;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      targetProgress = calculateScrollProgress();
      currentProgress = targetProgress;
      updateScrollAnimation();
    });

    // Initial check
    targetProgress = calculateScrollProgress();
    currentProgress = targetProgress;
    updateScrollAnimation();
  }
})();
