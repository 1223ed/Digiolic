/**
 * ==========================================================================
 * CLIENT TESTIMONIALS CAROUSEL CONTROLLER
 * Supports the Denim/Yellow Torn-Paper design on Homepage (index.html)
 * and the 3D Stage design on Zoho (pages/zoho.html)
 * Autoplay, Prev/Next buttons, Pagination dots, Touch swipe, Pause on hover
 * ==========================================================================
 */

(function () {
  'use strict';

  function initTestimonials() {
    // 1. Check for Denim Torn-Paper section on Homepage
    const denimSection = document.querySelector('.denim-testimonial-section');
    if (denimSection) {
      initDenimCarousel(denimSection);
    }

    // 2. Check for 3D Stage section (on Zoho page or fallback)
    const ztSection = document.querySelector('.zoho-testimonials-3d-section');
    if (ztSection) {
      init3DStageCarousel(ztSection);
    }
  }

  // --- DENIM TORN-PAPER CAROUSEL CONTROLLER (HOMEPAGE) ---
  function initDenimCarousel(section) {
    const track = section.querySelector('#dtSlidesTrack') || section.querySelector('.dt-slides-track');
    const prevBtn = section.querySelector('#dtPrevBtn');
    const nextBtn = section.querySelector('#dtNextBtn');
    const dots = Array.from(section.querySelectorAll('.dt-dot'));
    const cardStage = section.querySelector('.dt-card-stage') || section;

    if (!track) return;
    const originalSlides = Array.from(track.querySelectorAll('.dt-slide'));
    const totalOriginal = originalSlides.length;
    if (totalOriginal === 0) return;

    // Clone original cards at the beginning and end to create a 3-set seamless buffer (identical to Zoho)
    originalSlides.forEach((card) => {
      const clonePre = card.cloneNode(true);
      clonePre.setAttribute('aria-hidden', 'true');
      clonePre.classList.add('is-clone');
      track.insertBefore(clonePre, track.firstChild);
    });

    originalSlides.forEach((card) => {
      const clonePost = card.cloneNode(true);
      clonePost.setAttribute('aria-hidden', 'true');
      clonePost.classList.add('is-clone');
      track.appendChild(clonePost);
    });

    // Start at middle real set
    let currentIndex = totalOriginal;
    let isAnimating = false;
    let animSafetyTimer = null;
    let autoplayTimer = null;
    const AUTOPLAY_INTERVAL = 3800; // Comfortable reading interval

    function getStepWidth() {
      const vp = section.querySelector('#dtSliderWrap') || section.querySelector('.dt-slider-wrap');
      return vp ? (vp.clientWidth || vp.getBoundingClientRect().width) : 800;
    }

    function updateSlideWidths() {
      const width = getStepWidth();
      const allSlides = track.querySelectorAll('.dt-slide');
      allSlides.forEach((s) => {
        s.style.width = width + 'px';
        s.style.minWidth = width + 'px';
        s.style.maxWidth = width + 'px';
      });
    }

    function updateDots(realIdx) {
      const normalized = ((realIdx % totalOriginal) + totalOriginal) % totalOriginal;
      dots.forEach((dot, idx) => {
        const isActive = idx === normalized;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', String(isActive));
      });
    }

    function applyPosition(animated = true) {
      const stepWidth = getStepWidth();
      const offset = -(currentIndex * stepWidth);
      if (animated) {
        track.style.setProperty('transition', 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)', 'important');
      } else {
        track.style.setProperty('transition', 'none', 'important');
      }
      track.style.setProperty('transform', `translate3d(${offset}px, 0, 0)`, 'important');
      updateDots(currentIndex - totalOriginal);
    }

    function handleTransitionEnd() {
      if (animSafetyTimer) {
        clearTimeout(animSafetyTimer);
        animSafetyTimer = null;
      }
      isAnimating = false;
      // Scrolled past middle set into right clones
      if (currentIndex >= totalOriginal * 2) {
        currentIndex -= totalOriginal;
        applyPosition(false);
      }
      // Scrolled into left clones
      else if (currentIndex < totalOriginal) {
        currentIndex += totalOriginal;
        applyPosition(false);
      }
    }

    track.addEventListener('transitionend', handleTransitionEnd);

    function triggerMove() {
      applyPosition(true);
      if (animSafetyTimer) clearTimeout(animSafetyTimer);
      // Guarantee animation lock releases even if browser suppresses transitionend
      animSafetyTimer = setTimeout(handleTransitionEnd, 420);
    }

    function nextSlide() {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex++;
      triggerMove();
    }

    function prevSlide() {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex--;
      triggerMove();
    }

    function startAutoplay(delay = AUTOPLAY_INTERVAL) {
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, delay);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay(pauseDelay = 6000) {
      stopAutoplay();
      // Allow user generous time to read before restarting autoplay
      setTimeout(() => {
        startAutoplay(AUTOPLAY_INTERVAL);
      }, pauseDelay);
    }

    // Touch-optimized reliable button binder
    function bindButton(btn, callback) {
      if (!btn) return;
      let lastTrigger = 0;

      const handler = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        const now = Date.now();
        if (now - lastTrigger < 320) return; // Prevent double-trigger from touchend + click
        lastTrigger = now;
        callback();
      };

      btn.addEventListener('click', handler);
      btn.addEventListener('touchend', handler, { passive: false });
    }

    bindButton(nextBtn, () => {
      nextSlide();
      resetAutoplay(6000);
    });

    bindButton(prevBtn, () => {
      prevSlide();
      resetAutoplay(6000);
    });

    // Dot indicators
    dots.forEach((dot, idx) => {
      bindButton(dot, () => {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = totalOriginal + idx;
        triggerMove();
        resetAutoplay(6000);
      });
    });

    // Pause on hover
    cardStage.addEventListener('mouseenter', stopAutoplay);
    cardStage.addEventListener('mouseleave', () => startAutoplay(AUTOPLAY_INTERVAL));
    cardStage.addEventListener('focusin', stopAutoplay);
    cardStage.addEventListener('focusout', () => startAutoplay(AUTOPLAY_INTERVAL));

    // Touch swipe gestures
    let touchStartX = 0;
    let touchStartY = 0;
    cardStage.addEventListener('touchstart', (e) => {
      // Do not process swipe if touching the navigation buttons or dots
      if (e.target.closest('#dtPrevBtn, #dtNextBtn, .dt-arrow-btn, .dt-dot')) {
        return;
      }
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
      stopAutoplay();
    }, { passive: true });

    cardStage.addEventListener('touchend', (e) => {
      if (e.target.closest('#dtPrevBtn, #dtNextBtn, .dt-arrow-btn, .dt-dot')) {
        return;
      }
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      // Require clear horizontal swipe intent over vertical page scrolling
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY * 1.5)) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      resetAutoplay(5000);
    }, { passive: true });

    // Arrow keys navigation
    section.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoplay(6000);
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoplay(6000);
      }
    });

    window.addEventListener('resize', () => {
      updateSlideWidths();
      applyPosition(false);
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        updateSlideWidths();
        applyPosition(false);
      }, 100);
    });

    // Initialize starting position at real set without animation
    updateSlideWidths();
    applyPosition(false);
    startAutoplay();
  }

  // --- 3D STAGE CAROUSEL CONTROLLER (ZOHO PAGE) ---
  function init3DStageCarousel(section) {
    const slides = Array.from(section.querySelectorAll('.zt-slide'));
    const prevBtn = section.querySelector('#testimonialPrevBtn') || section.querySelector('.zt-arrow-prev');
    const nextBtn = section.querySelector('#testimonialNextBtn') || section.querySelector('.zt-arrow-next');
    const dots = Array.from(section.querySelectorAll('.zt-dot'));

    if (!slides.length) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    const AUTOPLAY_INTERVAL = 5500;
    let isTransitioning = false;

    function goToSlide(targetIndex) {
      if (isTransitioning) return;
      const total = slides.length;
      if (total <= 1) return;

      const nextIndex = (targetIndex + total) % total;
      if (nextIndex === currentIndex) return;

      isTransitioning = true;

      slides.forEach((slide, idx) => {
        slide.classList.toggle('is-active', idx === nextIndex);
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === nextIndex);
        dot.setAttribute('aria-selected', idx === nextIndex ? 'true' : 'false');
      });

      currentIndex = nextIndex;

      setTimeout(() => {
        isTransitioning = false;
      }, 420);
    }

    function resetAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), AUTOPLAY_INTERVAL);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentIndex + 1);
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentIndex - 1);
        resetAutoplay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
        resetAutoplay();
      });
    });

    autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), AUTOPLAY_INTERVAL);
  }

  // DOM ready check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTestimonials);
  } else {
    initTestimonials();
  }
})();
