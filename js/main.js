/**
 * DIGIOLIC — MAIN SITE CONTROLLER
 * High-Impact Scroll-Synced Reveals, Video-Style Progressive Transitions, Metric Counters
 */

(function () {
  'use strict';

  // DOM Elements
  const backToTopBtn = document.querySelector('.back-to-top');

  /* ==========================================================================
     1. SCROLL BEHAVIOR (Navbar Backdrop & Back to Top Button)
     ========================================================================== */
  const navElements = document.querySelectorAll('.mainframe-navbar, .hero-video-navbar, #mainframeNavbar, #heroNavbar');
  
  function handleNavScroll() {
    const isScrolled = window.scrollY > 20;
    navElements.forEach((nav) => {
      if (isScrolled) {
        nav.classList.add('is-scrolled');
        nav.style.setProperty('display', 'none', 'important');
        nav.style.setProperty('opacity', '0', 'important');
        nav.style.setProperty('visibility', 'hidden', 'important');
        nav.style.setProperty('pointer-events', 'none', 'important');
      } else {
        nav.classList.remove('is-scrolled');
        nav.style.removeProperty('display');
        nav.style.removeProperty('opacity');
        nav.style.removeProperty('visibility');
        nav.style.removeProperty('pointer-events');
      }
    });
  }

  function handleBackToTopScroll() {
    if (backToTopBtn) {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  }

  window.addEventListener('scroll', () => {
    handleNavScroll();
    handleBackToTopScroll();
  }, { passive: true });
  
  handleNavScroll();
  handleBackToTopScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     2. FULLSCREEN MOBILE NAVIGATION DRAWER (UNIVERSAL)
     ========================================================================== */
  const menuButtons = document.querySelectorAll(
    '#mainframeMenuBtn, #heroHamburgerBtn, .mainframe-hamburger-btn, .video-nav-hamburger, .mobile-menu-btn'
  );
  const menuDrawers = document.querySelectorAll(
    '#mainframeMobileOverlay, #heroMobileOverlay, #mobileNavDrawer, .mainframe-mobile-overlay, .mobile-nav-drawer, .hero-video-mobile-overlay'
  );

  function isDrawerOpen() {
    return Array.from(menuDrawers).some((drawer) => drawer.classList.contains('is-open'));
  }

  function openAllDrawers() {
    menuDrawers.forEach((d) => d.classList.add('is-open'));
    menuButtons.forEach((b) => {
      b.classList.add('is-active');
      b.setAttribute('aria-expanded', 'true');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeAllDrawers() {
    menuDrawers.forEach((d) => d.classList.remove('is-open'));
    menuButtons.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-expanded', 'false');
    });
    document.body.style.overflow = '';
  }

  function toggleAllDrawers() {
    if (isDrawerOpen()) {
      closeAllDrawers();
    } else {
      openAllDrawers();
    }
  }

  menuButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAllDrawers();
    });
  });

  menuDrawers.forEach((drawer) => {
    // Close on link click
    const links = drawer.querySelectorAll('a');
    links.forEach((link) => {
      link.addEventListener('click', closeAllDrawers);
    });

    // Close on any close button inside drawer
    const closeBtns = drawer.querySelectorAll(
      '#heroCloseMenuBtn, .hero-video-mobile-close, .mobile-nav-close, .mobile-drawer-close'
    );
    closeBtns.forEach((cb) => {
      cb.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllDrawers();
      });
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isDrawerOpen()) {
      closeAllDrawers();
    }
  });

  /* ==========================================================================
     3. HIGH-IMPACT SCROLL-SYNCED REVEAL OBSERVER
     ========================================================================== */
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Only reveal elements immediately if they are in the initial hero viewport
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
          el.classList.add('is-revealed');
        } else {
          el.classList.remove('is-revealed');
          revealObserver.observe(el);
        }
      });
    } else {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
    }
  }

  /* ==========================================================================
     4. ANIMATED METRIC COUNTERS (Scroll-Triggered)
     ========================================================================== */
  function initMetricCounters() {
    const countElements = document.querySelectorAll('[data-count]');
    if (!countElements.length) return;

    if ('IntersectionObserver' in window) {
      const countObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startCounterAnimation(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );

      countElements.forEach((el) => countObserver.observe(el));
    }
  }

  function startCounterAnimation(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Fluid ease-out curve
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = target * easeOut;

      el.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
    }

    requestAnimationFrame(update);
  }

  /* ==========================================================================
     5. SEQUENTIAL DELIVERY STEPS SCROLL ACTIVATION
     ========================================================================== */
  function initDeliveryStepsMotion() {
    const deliverySection = document.getElementById('howWeDeliverSection');
    if (!deliverySection) return;

    const stepCards = deliverySection.querySelectorAll('.process-card, .deliver-step-card-compact');
    if (!stepCards.length) return;

    function checkDeliveryScroll() {
      const rect = deliverySection.getBoundingClientRect();
      const windowH = window.innerHeight;

      if (rect.top < windowH * 0.8 && rect.bottom > 0) {
        stepCards.forEach((card, idx) => {
          setTimeout(() => {
            card.classList.add('is-revealed');
          }, idx * 120);
        });
      }
    }

    window.addEventListener('scroll', checkDeliveryScroll, { passive: true });
    checkDeliveryScroll();
  }

  /* ==========================================================================
     6. FAQ ACCORDION INTERACTION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn && !btn.hasAttribute('onclick') && !btn.dataset.faqHandled) {
      btn.dataset.faqHandled = 'true';
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open') || item.classList.contains('active');
        faqItems.forEach((other) => {
          other.classList.remove('is-open', 'active');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open', 'active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* ==========================================================================
     7. ACTIVE NAVIGATION LINK DETECTION
     ========================================================================== */
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    if (
      (currentPath.endsWith('/') || currentPath.endsWith('index.html')) &&
      (href === '/' || href === 'index.html' || href === './index.html' || href === './')
    ) {
      link.classList.add('active');
    } else if (href !== '/' && href !== 'index.html' && currentPath.includes(href.replace('../', '').replace('./', ''))) {
      link.classList.add('active');
    }
  });

  /* ==========================================================================
     8. ZOHO CAMPAIGNS SUBSCRIPTION CONTROLLER
     ========================================================================== */
  function initZohoSubscriptionHandler() {
    const form = document.getElementById('zcampaignOptinForm');
    const btn = document.getElementById('zcWebOptin');
    const input = document.getElementById('EMBED_FORM_EMAIL_LABEL');
    const errDiv = document.getElementById('errorMsgDiv');
    if (!form || !btn || !input) return;

    // Ensure hidden submission iframe exists
    let iframe = document.getElementById('_zcSignup');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.name = '_zcSignup';
      iframe.id = '_zcSignup';
      iframe.style.display = 'none';
      iframe.setAttribute('title', 'Zoho Campaigns Target');
      document.body.appendChild(iframe);
    }

    function submitSubscription(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const email = input.value.trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !emailRegex.test(email)) {
        if (errDiv) {
          errDiv.style.display = 'block';
          setTimeout(() => { errDiv.style.display = 'none'; }, 4000);
        }
        input.focus();
        return false;
      }

      if (errDiv) errDiv.style.display = 'none';

      // Visual button feedback
      btn.disabled = true;
      const btnSpan = btn.querySelector('span');
      if (btnSpan) btnSpan.textContent = 'Subscribing...';

      // Submit form natively into hidden iframe so Zoho Campaigns POST receives all tokens
      form.target = '_zcSignup';
      form.submit();

      // Display immediate success modal to user
      setTimeout(() => {
        const overlay = document.getElementById('zcOptinOverLay');
        const popup = document.getElementById('zcOptinSuccessPopup');
        const panel = document.getElementById('zcOptinSuccessPanel');

        if (panel) {
          panel.innerHTML = `
            <div style="text-align: center; padding: 10px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              <div style="width: 56px; height: 56px; background: #DCFCE7; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <h3 style="font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 8px;">Welcome to Digiolic!</h3>
              <p style="font-size: 15px; color: #475569; margin: 0 0 16px; line-height: 1.5;">You have successfully subscribed to our newsletter.</p>
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px 16px; font-size: 13px; color: #475569; line-height: 1.6; text-align: left;">
                <strong style="color: #0F172A; display: block; margin-bottom: 4px;">📧 Action Required: Confirmation Email Sent</strong>
                We have sent a verification link to <strong>${email}</strong>. Please check your inbox (and spam folder) and click the link to confirm your subscription and start receiving updates!
              </div>
            </div>
          `;
        }
        if (overlay) overlay.style.display = 'block';
        if (popup) popup.style.display = 'block';

        if (btn) {
          btn.disabled = false;
          if (btnSpan) btnSpan.textContent = 'Subscribed ✓';
          setTimeout(() => {
            if (btnSpan) btnSpan.textContent = 'Join Now';
          }, 5000);
        }
        input.value = '';
      }, 600);

      return false;
    }

    btn.onclick = submitSubscription;
    form.onsubmit = submitSubscription;
  }

  /* ==========================================================================
     BRAND TYPOGRAPHY: Ensure 'D' in Digiolic is always colored green (not g)
     ========================================================================== */
  function applyBrandGreenD() {
    try {
      if (!document.body) return;
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {
            if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (tag === 'script' || tag === 'style' || tag === 'textarea' || tag === 'title' || tag === 'input' || tag === 'noscript' || parent.classList.contains('brand-d') || parent.classList.contains('digi-d') || parent.classList.contains('brand-g') || parent.classList.contains('digi-g')) {
              return NodeFilter.FILTER_REJECT;
            }
            if (/(?:Digiolic|DIGIOLIC)/.test(node.nodeValue)) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          }
        }
      );

      const nodesToReplace = [];
      while (walker.nextNode()) {
        nodesToReplace.push(walker.currentNode);
      }

      nodesToReplace.forEach(node => {
        const parent = node.parentElement;
        if (!parent) return;
        const html = node.nodeValue
          .replace(/Digiolic/g, '<span class="brand-d">D</span>igiolic')
          .replace(/DIGIOLIC/g, '<span class="brand-d">D</span>IGIOLIC');
        const span = document.createElement('span');
        span.innerHTML = html;
        parent.replaceChild(span, node);
      });
    } catch (e) {
      console.warn('Brand typography highlight non-critical error:', e);
    }
  }

  // Initialize
  function initAll() {
    initScrollReveals();
    initMetricCounters();
    initDeliveryStepsMotion();
    initZohoSubscriptionHandler();
    applyBrandGreenD();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
