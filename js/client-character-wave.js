/**
 * ============================================================================
 * DIGIOLIC — CLIENT CHARACTER WAVE ANIMATION CONTROLLER
 * Architectural split-text character wave & scroll scrubbing as seen in
 * Client Testimonials (#clientTestimonialsSection) & Why Choose Digiolic
 * ============================================================================
 */

(function () {
  'use strict';

  // Helper: recursively split text inside an element, preserving child tag hierarchy and word integrity
  function splitNodeToChars(node, charArray, isStartOfBlock, isEndOfBlock) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      if (!text) return;
      
      // Collapse multiple whitespace characters (including newlines and tabs) to single spaces
      text = text.replace(/[\t\r\n]+/g, ' ').replace(/\s{2,}/g, ' ');
      if (isStartOfBlock) {
        text = text.replace(/^\s+/, '');
      }
      if (isEndOfBlock) {
        text = text.replace(/\s+$/, '');
      }
      if (!text) {
        node.textContent = '';
        return;
      }

      const frag = document.createDocumentFragment();
      const tokens = text.split(/(\s+)/);

      tokens.forEach(token => {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          const spaceSpan = document.createElement('span');
          spaceSpan.className = 'ct-wave-char space';
          spaceSpan.textContent = '\u00A0';
          frag.appendChild(spaceSpan);
          charArray.push(spaceSpan);
        } else {
          const wordWrap = document.createElement('span');
          wordWrap.className = 'ct-wave-word';

          for (let i = 0; i < token.length; i++) {
            const char = token[i];
            const span = document.createElement('span');
            span.className = 'ct-wave-char';
            span.textContent = char;
            wordWrap.appendChild(span);
            charArray.push(span);
          }
          frag.appendChild(wordWrap);
        }
      });

      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Do not re-split if already a wave char or word container
      if (node.classList.contains('ct-wave-char') || node.classList.contains('ct-wave-word')) {
        charArray.push(node);
        return;
      }
      const children = Array.from(node.childNodes);
      children.forEach((child, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === children.length - 1;
        splitNodeToChars(child, charArray, isStartOfBlock && isFirst, isEndOfBlock && isLast);
      });
    }
  }

  // Setup character wave on a heading/text element
  function setupElementWave(container, options) {
    if (!container || container.dataset.waveSplitDone) return container._waveChars || [];

    const opts = Object.assign({
      stagger: 0.024,
      duration: 0.72,
      baseDelay: 0.05
    }, options || {});

    // Ensure container has overflow masks on lines
    let masks = Array.from(container.querySelectorAll('.ct-wave-mask'));
    if (masks.length === 0) {
      // If no explicit masks exist, wrap lines or innerHTML
      const lines = Array.from(container.querySelectorAll('.ct-wave-line'));
      if (lines.length > 0) {
        lines.forEach(line => {
          const mask = document.createElement('span');
          mask.className = 'ct-wave-mask';
          line.parentNode.insertBefore(mask, line);
          mask.appendChild(line);
        });
        masks = Array.from(container.querySelectorAll('.ct-wave-mask'));
      } else {
        const mask = document.createElement('span');
        mask.className = 'ct-wave-mask';
        while (container.firstChild) {
          mask.appendChild(container.firstChild);
        }
        container.appendChild(mask);
        masks = [mask];
      }
    }

    const allChars = [];
    masks.forEach(mask => {
      splitNodeToChars(mask, allChars, true, true);
    });

    // Set fallback CSS transition-delays
    allChars.forEach((ch, idx) => {
      const delay = opts.baseDelay + idx * opts.stagger;
      ch.style.transitionDelay = `${delay.toFixed(3)}s`;
    });

    container.dataset.waveSplitDone = 'true';
    container._waveChars = allChars;
    container._waveOpts = opts;

    // Trigger wave animation function
    container._triggerWave = function () {
      container.classList.add('is-wave-revealed', 'ct-wave-active');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(allChars, 
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: opts.duration,
            ease: "power3.out",
            stagger: opts.stagger,
            overwrite: "auto"
          }
        );
      }
    };

    // Reset wave animation function
    container._resetWave = function () {
      container.classList.remove('is-wave-revealed', 'ct-wave-active');
      if (typeof gsap !== 'undefined') {
        gsap.set(allChars, { yPercent: 115, opacity: 0 });
      }
    };

    return allChars;
  }

  // Trigger wave on an element
  function triggerWave(element) {
    if (!element) return;
    if (!element.dataset.waveSplitDone) {
      setupElementWave(element);
    }
    if (typeof element._triggerWave === 'function') {
      element._triggerWave();
    }
  }

  // Reset wave on an element
  function resetWave(element) {
    if (!element) return;
    if (typeof element._resetWave === 'function') {
      element._resetWave();
    }
  }

  // Master Initialization for Target Elements
  function initAll() {
    // -------------------------------------------------------------------------
    // 1. ABOUT US PAGE TARGETS:
    //    - "Create Bold. Deliver Better." (#aboutCtaTitle)
    //    - "DIGIOLIC" (#aboutDigiolicWatermark)
    // -------------------------------------------------------------------------
    const aboutCtaSection = document.getElementById('vvCtaBannerSection');
    const aboutCtaTitle = document.getElementById('aboutCtaTitle');
    const aboutDigiolic = document.getElementById('aboutDigiolicWatermark');

    if (aboutCtaTitle) {
      setupElementWave(aboutCtaTitle, { stagger: 0.024, duration: 0.72, baseDelay: 0.05 });
    }
    if (aboutDigiolic) {
      setupElementWave(aboutDigiolic, { stagger: 0.038, duration: 0.85, baseDelay: 0.15 });
    }

    if (aboutCtaSection && (aboutCtaTitle || aboutDigiolic)) {
      if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        ScrollTrigger.create({
          trigger: aboutCtaSection,
          start: "top 78%",
          onEnter: () => {
            if (aboutCtaTitle) aboutCtaTitle._triggerWave();
            if (aboutDigiolic) aboutDigiolic._triggerWave();
          },
          onEnterBack: () => {
            if (aboutCtaTitle) aboutCtaTitle._triggerWave();
            if (aboutDigiolic) aboutDigiolic._triggerWave();
          }
        });
      } else if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (aboutCtaTitle) aboutCtaTitle._triggerWave();
              if (aboutDigiolic) aboutDigiolic._triggerWave();
            }
          });
        }, { threshold: 0.2 });
        obs.observe(aboutCtaSection);
      } else {
        if (aboutCtaTitle) aboutCtaTitle._triggerWave();
        if (aboutDigiolic) aboutDigiolic._triggerWave();
      }
    }

    // -------------------------------------------------------------------------
    // 2. ZOHO PAGE TARGET:
    //    - "Explore 50+ Zoho Applications" (#zohoExploreHeading)
    // -------------------------------------------------------------------------
    const exploreHeading = document.getElementById('zohoExploreHeading');
    const exploreSectionHeader = document.querySelector('.zoho-section-header');
    if (exploreHeading) {
      setupElementWave(exploreHeading, { stagger: 0.022, duration: 0.75, baseDelay: 0.04 });
      const triggerEl = exploreSectionHeader || exploreHeading;

      if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined') {
        ScrollTrigger.create({
          trigger: triggerEl,
          start: "top 82%",
          onEnter: () => exploreHeading._triggerWave(),
          onEnterBack: () => exploreHeading._triggerWave()
        });
      } else if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) exploreHeading._triggerWave();
          });
        }, { threshold: 0.25 });
        obs.observe(triggerEl);
      } else {
        exploreHeading._triggerWave();
      }

      const r = triggerEl.getBoundingClientRect();
      if (r.top <= window.innerHeight * 0.95) {
        exploreHeading._triggerWave();
      }
    }

    // -------------------------------------------------------------------------
    // 3. ZOHO PAGE TARGET:
    //    - 5 Delivery Slide Titles in #deliverySection:
    //      1. Sales Operations
    //      2. Customer Experience
    //      3. Financial Management
    //      4. Employee Management
    //      5. Process Automation
    // -------------------------------------------------------------------------
    const slideTitles = document.querySelectorAll('.hscroll-step-title.ct-wave-heading, [data-slide-title]');
    slideTitles.forEach(title => {
      setupElementWave(title, { stagger: 0.024, duration: 0.68, baseDelay: 0.02 });
    });
  }

  // Auto-init on DOMContentLoaded or immediate if loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Export globally so other scroll controllers (how-we-deliver-scroll.js & core-pillars-scroll.js) can interact
  window.DigiolicCharWave = {
    setup: setupElementWave,
    trigger: triggerWave,
    reset: resetWave,
    initAll: initAll
  };
})();
