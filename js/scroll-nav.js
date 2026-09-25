/**
 * DIGIOLIC — FLOATING SCROLL NAVIGATION CONTROLLER
 * High-performance, standalone scroll up/down button anchored above live chat widget.
 * Works seamlessly across all pages without external dependencies.
 */
(function () {
  'use strict';

  function initNav() {
    let btn = document.getElementById('floatingScrollNav');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'floatingScrollNav';
      btn.className = 'floating-scroll-nav is-down';
      btn.setAttribute('aria-label', 'Scroll down');
      btn.setAttribute('title', 'Scroll down');
      btn.innerHTML = `
        <svg class="scroll-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      `;
      if (document.body) {
        document.body.appendChild(btn);
      } else {
        document.addEventListener('DOMContentLoaded', () => document.body.appendChild(btn));
      }
    }

    if (btn.dataset.navBound === 'true') return;
    btn.dataset.navBound = 'true';

    let lastScrollPos = 0;
    const threshold = 220;

    function updateNavState() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (currentScroll > threshold) {
        if (!btn.classList.contains('is-up')) {
          btn.classList.remove('is-down');
          btn.classList.add('is-up');
          btn.setAttribute('aria-label', 'Scroll to top');
          btn.setAttribute('title', 'Scroll to top');
        }
      } else {
        if (!btn.classList.contains('is-down')) {
          btn.classList.remove('is-up');
          btn.classList.add('is-down');
          btn.setAttribute('aria-label', 'Scroll down');
          btn.setAttribute('title', 'Scroll down');
        }
      }
    }

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (currentScroll > threshold) {
        lastScrollPos = currentScroll;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = lastScrollPos > threshold ? lastScrollPos : (window.innerHeight * 0.85);
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    });

    window.addEventListener('scroll', updateNavState, { passive: true });
    updateNavState();
  }

  if (document.body) {
    initNav();
  } else {
    document.addEventListener('DOMContentLoaded', initNav);
  }
})();
