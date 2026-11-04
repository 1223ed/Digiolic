/**
 * Client Testimonials — Horizontal Pinned Scroll Controller
 * Seamlessly scrubs the 4 enterprise testimonial cards horizontally across the screen
 * based on user scroll (and touch swipe).
 */
(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHorizontalTestimonials);
  } else {
    initHorizontalTestimonials();
  }

  function initHorizontalTestimonials() {
    const section = document.getElementById('testimonialShowcase');
    if (!section) return;

    const stickyWrapper = section.querySelector('.t-horizontal-sticky');
    const track = document.getElementById('tHorizontalTrack');
    const cards = Array.from(section.querySelectorAll('.t-card-wrapper'));
    const progressBar = document.getElementById('tProgressBarFill');
    const counterCurrent = document.getElementById('tCounterCurrent');

    if (!track || cards.length === 0) return;

    let targetX = 0;
    let currentX = 0;
    let isTicking = false;
    let maxTranslateX = 0;

    function computeDimensions() {
      const totalWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      maxTranslateX = Math.max(0, totalWidth - viewportWidth);
    }

    computeDimensions();
    setTimeout(computeDimensions, 150);
    window.addEventListener('resize', () => {
      computeDimensions();
      onScroll();
    }, { passive: true });

    function calculateScrollProgress() {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalScroll = section.offsetHeight - vh;
      if (totalScroll <= 0) return 0;

      const rawProgress = -rect.top / totalScroll;
      return Math.max(0, Math.min(1, rawProgress));
    }

    function onScroll() {
      const progress = calculateScrollProgress();
      // Map 0.0 -> 0.86 to the full horizontal scroll range, leaving 0.86 -> 1.0 as reading dwell time for Card 4
      const normalizedProgress = Math.min(1, Math.max(0, progress / 0.86));
      targetX = normalizedProgress * maxTranslateX;

      if (!isTicking) {
        isTicking = true;
        requestAnimationFrame(updateAnimation);
      }
    }

    function updateAnimation() {
      // 60fps Silky Lerp Smoothing
      currentX += (targetX - currentX) * 0.09;

      // Apply horizontal translation
      track.style.transform = `translate3d(${-currentX.toFixed(2)}px, 0, 0)`;

      // Update top progress hairline
      if (progressBar && maxTranslateX > 0) {
        const p = Math.max(0, Math.min(1, currentX / maxTranslateX));
        progressBar.style.width = `${(p * 100).toFixed(2)}%`;
      }

      // Determine active card based on viewport center
      const viewportCenter = window.innerWidth / 2;
      let closestCardIdx = 0;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const dist = Math.abs(viewportCenter - cardCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestCardIdx = idx;
        }
      });

      cards.forEach((card, idx) => {
        const isActive = idx === closestCardIdx;
        card.classList.toggle('is-active', isActive);
      });

      if (counterCurrent) {
        const cardNum = String(closestCardIdx + 1).padStart(2, '0');
        if (counterCurrent.textContent !== cardNum) {
          counterCurrent.textContent = cardNum;
        }
      }

      // Continue animation loop until settled
      if (Math.abs(targetX - currentX) > 0.1) {
        requestAnimationFrame(updateAnimation);
      } else {
        isTicking = false;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial positioning
    onScroll();

    // =========================================================================
    // 3D TACTILE HOVER TILT ON CARDS (DESKTOP)
    // =========================================================================
    if (window.matchMedia('(pointer: fine)').matches) {
      cards.forEach((card) => {
        let cardTicking = false;
        let rotX = 0;
        let rotY = 0;

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Subtle, luxurious tilt (max 3 degrees)
          rotY = ((x - centerX) / centerX) * 3;
          rotX = -((y - centerY) / centerY) * 3;

          if (!cardTicking) {
            cardTicking = true;
            requestAnimationFrame(() => {
              const baseScale = card.classList.contains('is-active') ? 'scale(1.0)' : 'scale(0.975)';
              card.style.transform = `${baseScale} perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
              cardTicking = false;
            });
          }
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }

    // =========================================================================
    // TOUCH SWIPE BRIDGE (Allows direct swipe on track on mobile devices)
    // =========================================================================
    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    track.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;
      }
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isSwiping || e.touches.length !== 1) return;
      const dx = touchStartX - e.touches[0].clientX;
      const dy = touchStartY - e.touches[0].clientY;

      // If user swipes horizontally more than vertically, translate to vertical window scroll
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        window.scrollBy({ top: dx * 1.5, behavior: 'auto' });
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    track.addEventListener('touchend', () => {
      isSwiping = false;
    }, { passive: true });
  }
})();
