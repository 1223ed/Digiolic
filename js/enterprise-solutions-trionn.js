/**
 * Enterprise Solutions Built for Compound Growth & The 5-Phase Delivery Framework
 * 1:1 Faithful Recreation of TRIONN showcase motion architecture
 * References:
 * - Screen Recording 2026-10-26 at 10.58.10 PM copy.mov (original video: trionn.com/work)
 * - Reference Image 1: Hairline celestial filament wire bundles with luminous terminal dots
 * - Entire page scrolls vertically through the 5 delivery phases
 * 
 * Architecture:
 * 1. Horizontal Track Showcase (#servicesSection):
 *    - Intro Panel (50vw)
 *    - Enterprise Zoho Practice Card (50vw)
 *    - Salesforce Engineering Practice Card (50vw - parabolic entrance)
 *    - Digital Marketing Practice Card (50vw - parabolic entrance)
 *    - Discover Our Complete Collection Bridge (50vw)
 *    - White Camera Shutter Hero ("HOW DO WE DELIVER SUCCESS?")
 * 2. Dedicated Vertical Showcase (#howWeDeliverSection):
 *    - Entire page scrolls vertically up and down with mouse wheel / trackpad
 *    - Atmospheric deep dark canvas (#08080B) with radial purple glow & grid lines
 *    - Hairline celestial filament bezier curves with glowing terminal dots (Image 1)
 *    - Sequential 5 Phase Cards: 01 Consulting, 02 Gap Analysis, 03 Implementation,
 *      04 Support, 05 Training & Adoption with smooth scroll parallax & 3D tilt hover.
 */
(function () {
  'use strict';

  // Prevent scroll-behavior: smooth from corrupting ScrollTrigger coordinate calculations
  if (typeof document !== 'undefined') {
    if (document.documentElement) document.documentElement.style.scrollBehavior = 'auto';
    if (document.body) document.body.style.scrollBehavior = 'auto';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllComponents);
  } else {
    initAllComponents();
  }

  function initAllComponents() {
    initEnterpriseHorizontalShowcase();
    initDeliveryVerticalFlow();
    initCelestialBackgroundParticles();
  }

  /* ==========================================================================
     1. HORIZONTAL TRACK SHOWCASE (#servicesSection)
     ========================================================================== */
  function initEnterpriseHorizontalShowcase() {
    const section = document.getElementById('servicesSection');
    if (!section) return;

    const stickyWrapper = section.querySelector('.enterprise-sticky-wrapper');
    const track = section.querySelector('.enterprise-horizontal-track');
    const panels = Array.from(section.querySelectorAll('.enterprise-panel'));
    const mediaBoxes = Array.from(section.querySelectorAll('.enterprise-media-box'));

    if (!stickyWrapper || !track || panels.length === 0) return;

    const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

    if (hasGsap) {
      initGsapImplementation();
    } else {
      initRafImplementation();
    }

    // Attach 3D Card Hover Perspective Tilt to horizontal practice cards
    initHorizontalCardHoverTilt();

    function initGsapImplementation() {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize'
      });

      const mm = gsap.matchMedia();

      mm.add('(min-width: 992px)', () => {
        const cardWrappers = panels.map(p => p.querySelector('.enterprise-card-wrapper'));
        const images = panels.map(p => p.querySelector('.enterprise-card-img'));

        // Panel 4 (Discover Bridge)
        const panelDiscoverBridge = document.getElementById('panelDiscoverBridge');
        const discoverContent = panelDiscoverBridge ? panelDiscoverBridge.querySelector('.trionn-discover-content') : null;

        // Panel 5 (White Shutter Hero Panel)
        const panelHowHero = document.getElementById('panelHowWeDeliver');
        const whiteHero = document.getElementById('deliveryWhiteHero');
        const stackLines = panelHowHero ? Array.from(panelHowHero.querySelectorAll('.trionn-stack-line')) : [];
        const heroLead = panelHowHero ? panelHowHero.querySelector('.trionn-services-lead') : null;
        const heroTop = panelHowHero ? panelHowHero.querySelector('.trionn-hero-top') : null;
        const heroBottom = panelHowHero ? panelHowHero.querySelector('.trionn-hero-bottom') : null;
        const heroCornerLink = document.getElementById('explorePhasesBtn');

        // Physical track distance
        const totalTrackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxTranslateX = Math.max(0, totalTrackWidth - viewportWidth);
        const maxTranslateY = Math.min(240, Math.max(160, window.innerHeight * 0.22));

        // Pin distance: track scroll + comfortable pause at White Hero curtain
        const pinScrollDistance = Math.round(maxTranslateX + window.innerWidth * 0.25);

        const tl = gsap.timeline({
          scrollTrigger: {
            id: 'trionnMasterTrack',
            trigger: section,
            pin: true,
            anticipatePin: 1,
            start: 'top top',
            end: () => '+=' + pinScrollDistance,
            scrub: 0.8, // 0.8s silky momentum matching TRIONN Webflow physics
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress >= 0.88) {
                if (panelHowHero) panelHowHero.classList.add('is-dark');
                if (whiteHero) whiteHero.classList.add('is-dark');
              } else {
                if (panelHowHero) panelHowHero.classList.remove('is-dark');
                if (whiteHero) whiteHero.classList.remove('is-dark');
              }
            },
            onLeave: () => {
              if (panelHowHero) panelHowHero.classList.add('is-dark');
              if (whiteHero) whiteHero.classList.add('is-dark');
            },
            onLeaveBack: () => {
              if (panelHowHero) panelHowHero.classList.remove('is-dark');
              if (whiteHero) whiteHero.classList.remove('is-dark');
            }
          }
        });

        // Horizontal track glide (duration 0.82)
        tl.to(track, {
          x: () => -maxTranslateX,
          ease: 'none',
          duration: 0.82
        }, 0);

        // Card 2 (Salesforce) Parabolic Entrance
        if (cardWrappers[2]) {
          tl.fromTo(cardWrappers[2],
            { y: maxTranslateY, scale: 0.78, opacity: 0.45 },
            { y: 0, scale: 1.0, opacity: 1.0, ease: 'power2.out', duration: 0.25 },
            0.05
          );
        }

        // Card 3 (Digital Marketing) Parabolic Entrance
        if (cardWrappers[3]) {
          tl.fromTo(cardWrappers[3],
            { y: maxTranslateY, scale: 0.78, opacity: 0.45 },
            { y: 0, scale: 1.0, opacity: 1.0, ease: 'power2.out', duration: 0.25 },
            0.22
          );
        }

        // Panel 4 (Discover Bridge) Docking & Reveal
        if (discoverContent) {
          tl.fromTo(discoverContent,
            { y: 40, opacity: 0.35 },
            { y: 0, opacity: 1.0, ease: 'power2.out', duration: 0.25 },
            0.42
          );
        }

        // Panel 5 White Shutter Camera Wipe (sweeps in from right as Panel 5 arrives)
        if (whiteHero) {
          tl.fromTo(whiteHero,
            { x: () => -window.innerWidth },
            { x: 0, ease: 'none', duration: 0.35 },
            0.45
          );
        }

        if (panelHowHero) {
          if (heroTop) {
            tl.fromTo(heroTop,
              { opacity: 0.2, y: 15 },
              { opacity: 1.0, y: 0, ease: 'power2.out', duration: 0.18 },
              0.55
            );
          }

          stackLines.forEach((line, i) => {
            tl.fromTo(line,
              { y: 55, opacity: 0.25, letterSpacing: '-0.02em' },
              { y: 0, opacity: 1.0, letterSpacing: '-0.04em', ease: 'power2.out', duration: 0.22 },
              0.58 + i * 0.05
            );
          });

          if (heroLead) {
            tl.fromTo(heroLead,
              { y: 30, opacity: 0.2 },
              { y: 0, opacity: 1.0, ease: 'power2.out', duration: 0.18 },
              0.68
            );
          }

          if (heroBottom) {
            tl.fromTo(heroBottom,
              { opacity: 0.2, y: 18 },
              { opacity: 1.0, y: 0, ease: 'power2.out', duration: 0.18 },
              0.72
            );
          }

          if (heroCornerLink) {
            tl.fromTo(heroCornerLink,
              { opacity: 0.2, x: 25 },
              { opacity: 1.0, x: 0, ease: 'power2.out', duration: 0.18 },
              0.72
            );
          }

          // Smooth scrubbed color conversion to black as the user scrolls down through "HOW DO WE DELIVER SUCCESS?"
          tl.fromTo([panelHowHero, whiteHero],
            { backgroundColor: '#FFFFFF' },
            { backgroundColor: '#000000', ease: 'power1.inOut', duration: 0.14 },
            0.84
          );

          const darkTitleLines = stackLines.filter(l => !l.classList.contains('highlight-word'));
          if (darkTitleLines.length) {
            tl.fromTo(darkTitleLines,
              { color: '#121316' },
              { color: '#FFFFFF', ease: 'power1.inOut', duration: 0.14 },
              0.84
            );
          }

          if (heroLead) {
            tl.fromTo(heroLead,
              { color: '#475569' },
              { color: '#94A3B8', ease: 'power1.inOut', duration: 0.14 },
              0.84
            );
          }

          if (heroTop) {
            const eyebrow = heroTop.querySelector('.trionn-eyebrow-caps');
            if (eyebrow) {
              tl.fromTo(eyebrow,
                { color: '#64748B' },
                { color: '#C084FC', ease: 'power1.inOut', duration: 0.14 },
                0.84
              );
            }
          }

          if (heroBottom) {
            const pillText = heroBottom.querySelector('.trionn-services-pill-text');
            if (pillText) {
              tl.fromTo(pillText,
                { color: '#64748B' },
                { color: '#A78BFA', ease: 'power1.inOut', duration: 0.14 },
                0.84
              );
            }
          }

          if (heroCornerLink) {
            tl.fromTo(heroCornerLink,
              { color: '#121316', borderColor: 'rgba(18, 19, 22, 0.2)' },
              { color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.25)', ease: 'power1.inOut', duration: 0.14 },
              0.84
            );
          }
        }

        // Card image counter-parallax
        if (images[1]) {
          tl.fromTo(images[1], { x: 18 }, { x: -18, ease: 'none', duration: 0.35 }, 0);
        }
        if (images[2]) {
          tl.fromTo(images[2], { x: 22 }, { x: -22, ease: 'none', duration: 0.35 }, 0.18);
        }
        if (images[3]) {
          tl.fromTo(images[3], { x: 22 }, { x: -22, ease: 'none', duration: 0.35 }, 0.35);
        }

        // Smooth scroll jump to vertical delivery section when clicking "EXPLORE PHASES"
        if (heroCornerLink) {
          heroCornerLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('howWeDeliverSection');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          });
        }

        return () => {
          tl.kill();
          gsap.set(track, { clearProps: 'all' });
          cardWrappers.forEach(cw => { if (cw) gsap.set(cw, { clearProps: 'all' }); });
          images.forEach(img => { if (img) gsap.set(img, { clearProps: 'all' }); });
          if (discoverContent) gsap.set(discoverContent, { clearProps: 'all' });
          if (whiteHero) gsap.set(whiteHero, { clearProps: 'all' });
          stackLines.forEach(l => { gsap.set(l, { clearProps: 'all' }); });
        };
      });

      window.addEventListener('load', () => ScrollTrigger.refresh());
      setTimeout(() => ScrollTrigger.refresh(), 300);
      setTimeout(() => ScrollTrigger.refresh(), 800);
    }

    /* Fallback rAF for horizontal section */
    function initRafImplementation() {
      let targetProgress = 0;
      let currentProgress = 0;
      let isTicking = false;
      let maxTranslateX = 0;
      let isMobile = window.innerWidth <= 991;

      function computeDimensions() {
        isMobile = window.innerWidth <= 991;
        if (isMobile) {
          track.style.transform = 'none';
          return;
        }
        const totalTrackWidth = track.scrollWidth;
        const viewportWidth = window.innerWidth;
        maxTranslateX = Math.max(0, totalTrackWidth - viewportWidth);
      }

      function calculateProgress() {
        if (isMobile) return 0;
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const totalScroll = section.offsetHeight - vh;
        if (totalScroll <= 0) return 0;
        const rawProgress = -rect.top / totalScroll;
        return Math.max(0, Math.min(1, rawProgress));
      }

      function updateAnimation() {
        const delta = targetProgress - currentProgress;
        currentProgress += delta * 0.085;

        if (Math.abs(delta) < 0.0001) {
          currentProgress = targetProgress;
        }

        const currentX = currentProgress * maxTranslateX;
        track.style.transform = `translate3d(${-currentX.toFixed(2)}px, 0, 0)`;

        if (Math.abs(targetProgress - currentProgress) > 0.0001) {
          requestAnimationFrame(updateAnimation);
        } else {
          isTicking = false;
        }
      }

      function onScroll() {
        if (isMobile) return;
        targetProgress = calculateProgress();
        if (!isTicking) {
          isTicking = true;
          requestAnimationFrame(updateAnimation);
        }
      }

      computeDimensions();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => {
        computeDimensions();
        onScroll();
      });
    }

    function initHorizontalCardHoverTilt() {
      mediaBoxes.forEach((box) => {
        let rafTilt = null;
        box.addEventListener('mousemove', (e) => {
          if (window.innerWidth <= 991) return;
          if (rafTilt) cancelAnimationFrame(rafTilt);
          rafTilt = requestAnimationFrame(() => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const rotateX = (-y / rect.height * 7).toFixed(2);
            const rotateY = (x / rect.width * 7).toFixed(2);
            box.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          });
        });

        box.addEventListener('mouseleave', () => {
          if (rafTilt) cancelAnimationFrame(rafTilt);
          box.style.transform = '';
        });
      });
    }
  }

  /* ==========================================================================
     2. VERTICAL DELIVERY FRAMEWORK SHOWCASE (#howWeDeliverSection)
     1:1 Recreation of Screen Recording 2026-10-27 at 12.14.24 PM.mov:
     - 3 delicate hairline celestial filament lines start from the card border.
     - They extend and fan out into 3 distinct glowing dots in mid-flight.
     - As the user scrolls down, the 3 dots dynamically CONVERGE together.
     - When all 3 lines meet together at a single anchor point, the next card
       box generates / populates (expanding into view with scale & opacity).
     - Scrolling up or down scrubs the entire motion bidirectionally.
     ========================================================================== */
  function initDeliveryVerticalFlow() {
    const howSection = document.getElementById('howWeDeliverSection');
    if (!howSection) return;

    const svg = document.getElementById('celestialCanvas');
    const phaseRows = Array.from(howSection.querySelectorAll('.trionn-phase-row'));
    const phaseCards = Array.from(howSection.querySelectorAll('.trionn-phase-card'));

    if (phaseCards.length === 0) return;

    // Attach 3D tilt hover physics to phase cards
    phaseCards.forEach((card, idx) => {
      const body = card.querySelector('.phase-card-media') || card.querySelector('.dark-card-body') || card;
      if (!body) return;
      let raf = null;

      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 991) return;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const rotateX = (-y / rect.height * 6).toFixed(2);
          const rotateY = (x / rect.width * 6).toFixed(2);
          body.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
      });

      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        body.style.transform = '';
      });

      // Highlight connected wire bundle on card hover
      card.addEventListener('mouseenter', () => {
        const bIn = howSection.querySelector(`.bundle-${idx}`);
        const bOut = howSection.querySelector(`.bundle-${idx + 1}`);
        if (bIn) bIn.style.filter = 'drop-shadow(0 0 14px rgba(192, 132, 252, 0.95))';
        if (bOut) bOut.style.filter = 'drop-shadow(0 0 14px rgba(192, 132, 252, 0.95))';
      });

      card.addEventListener('mouseleave', () => {
        const bIn = howSection.querySelector(`.bundle-${idx}`);
        const bOut = howSection.querySelector(`.bundle-${idx + 1}`);
        if (bIn) bIn.style.filter = '';
        if (bOut) bOut.style.filter = '';
      });
    });

    const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
    if (!hasGsap) return;

    gsap.registerPlugin(ScrollTrigger);

    // Initial state for all phase cards: hidden and scaled down until lines meet
    phaseCards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.82) translateY(24px)';
      card.style.transformOrigin = 'top center';
      card.style.pointerEvents = 'none';
      card.style.willChange = 'transform, opacity';
    });

    let bundleInstances = [];
    let scrollTriggerInstances = [];

    function buildAndInitBundles() {
      if (!svg) return;

      // Clean up old ScrollTriggers
      scrollTriggerInstances.forEach(st => st.kill());
      scrollTriggerInstances = [];
      bundleInstances = [];

      // Temporarily clear transforms for pristine layout measurement
      const prevTransforms = phaseCards.map(c => c.style.transform);
      phaseCards.forEach(c => { c.style.transform = 'none'; });

      const secRect = howSection.getBoundingClientRect();
      const secW = howSection.offsetWidth;
      const secH = howSection.offsetHeight;

      svg.setAttribute('viewBox', `0 0 ${secW} ${secH}`);
      svg.setAttribute('width', secW);
      svg.setAttribute('height', secH);

      // SVG Definitions container for dynamic linear gradients (light white and black color)
      let defsMarkup = '';
      let bundlesMarkup = '';
      const isMobile = window.innerWidth <= 767;

      // Bundle 0: from bottom of lead text to Phase 01 card
      // Bundles 1..4: from Phase k-1 card to Phase k card
      const totalBundles = phaseCards.length;

      for (let k = 0; k < totalBundles; k++) {
        let x1, y1, x2, y2, d1, d2, d3, x1a, x1b, x1c;
        let y1_a, y1_b, y1_c;
        const targetCard = phaseCards[k];
        const cardBody = targetCard.querySelector('.phase-card-media') || targetCard.querySelector('.dark-card-body') || targetCard;
        const cardRect = cardBody.getBoundingClientRect();

        if (k === 0) {
          // Starting lines originate directly below the lead paragraph text
          const heroLead = document.querySelector('.trionn-services-lead');
          const panelHow = document.getElementById('panelHowWeDeliver');

          if (isMobile) {
            x2 = Math.round((cardRect.left + cardRect.right) / 2 - secRect.left);
            y2 = Math.round(cardRect.top - secRect.top);
          } else {
            // Arrives directly at top-center apex of Card 1
            x2 = Math.round((cardRect.left + cardRect.right) / 2 - secRect.left);
            y2 = Math.round(cardRect.top - secRect.top);
          }

          // Calculate y1 relative to panel bottom
          if (panelHow && heroLead) {
            const pr = panelHow.getBoundingClientRect();
            const lr = heroLead.getBoundingClientRect();
            y1 = -Math.round(pr.bottom - lr.bottom) + 14;
          } else {
            y1 = -180;
          }

          const leadW = heroLead ? heroLead.offsetWidth : 580;
          const leadLeft = Math.round((secW - leadW) / 2);

          if (isMobile) {
            const centerX = Math.round(secW / 2);
            x1a = centerX - 18;
            x1b = centerX;
            x1c = centerX + 18;
          } else {
            // 3 departure anchor positions below lead text, grouped with clean 22px spacing
            const centerX = Math.round(leadLeft + leadW * 0.50);
            x1a = centerX - 24;
            x1b = centerX;
            x1c = centerX + 24;
          }
          x1 = x1b;
          y1_a = y1;
          y1_b = y1;
          y1_c = y1;

          const dy = Math.max(160, y2 - y1);

          if (isMobile) {
            const centerX = Math.round(secW / 2);
            x1a = centerX - 18;
            x1b = centerX;
            x1c = centerX + 18;
            const dy = Math.max(160, y2 - y1);
            const cp2y = Math.round(y2 - dy * 0.30);
            d2 = `M ${x1b} ${y1} C ${x1b} ${Math.round(y1 + dy * 0.45)}, ${x2} ${cp2y}, ${x2} ${y2}`;
            d1 = `M ${x1a} ${y1} C ${x1a - 45} ${Math.round(y1 + dy * 0.35)}, ${x2 + 30} ${cp2y}, ${x2} ${y2}`;
            d3 = `M ${x1c} ${y1} C ${x1c + 45} ${Math.round(y1 + dy * 0.35)}, ${x2 - 30} ${cp2y}, ${x2} ${y2}`;
          } else {
            const centerX = Math.round(leadLeft + leadW * 0.50);
            x1a = centerX - 24;
            x1b = centerX;
            x1c = centerX + 24;

            const dy = Math.max(160, y2 - y1);
            const dx_b = x2 - x1b;

            // Wire 1 (starts left): loops wide left, then crosses to the right of destination before connecting
            const cp1_1x = Math.round(x1a - 75);
            const cp1_1y = Math.round(y1 + dy * 0.38);
            const cp2_1x = Math.round(x2 + 20);
            const cp2_1y = Math.round(y2 - dy * 0.24);
            d1 = `M ${x1a} ${y1} C ${cp1_1x} ${cp1_1y}, ${cp2_1x} ${cp2_1y}, ${x2} ${y2}`;

            // Wire 2 (center carrier wave): smooth balanced trajectory
            const cp1_2x = Math.round(x1b + dx_b * 0.35);
            const cp1_2y = Math.round(y1 + dy * 0.36);
            const cp2_2x = Math.round(x2);
            const cp2_2y = Math.round(y2 - dy * 0.30);
            d2 = `M ${x1b} ${y1} C ${cp1_2x} ${cp1_2y}, ${cp2_2x} ${cp2_2y}, ${x2} ${y2}`;

            // Wire 3 (starts right): swoops inward across the center, CROSSING over Wire 2 & Wire 1 in flight!
            const cp1_3x = Math.round(centerX - 65);
            const cp1_3y = Math.round(y1 + dy * 0.24);
            const cp2_3x = Math.round(x2 - 20);
            const cp2_3y = Math.round(y2 - dy * 0.26);
            d3 = `M ${x1c} ${y1} C ${cp1_3x} ${cp1_3y}, ${cp2_3x} ${cp2_3y}, ${x2} ${y2}`;
          }
        } else {
          // From Phase k-1 to Phase k
          const prevCard = phaseCards[k - 1];
          const prevBody = prevCard.querySelector('.phase-card-media') || prevCard.querySelector('.dark-card-body') || prevCard;
          const r1 = prevBody.getBoundingClientRect();
          const r2 = cardRect;

          const isLeft = (k - 1) % 2 === 0;

          if (isMobile) {
            x1 = Math.round((r1.left + r1.right) / 2 - secRect.left);
            y1 = Math.round(r1.bottom - 12 - secRect.top);
            x1a = x1 - 18;
            x1b = x1;
            x1c = x1 + 18;
            y1_a = y1;
            y1_b = y1;
            y1_c = y1;

            x2 = Math.round((r2.left + r2.right) / 2 - secRect.left);
            y2 = Math.round(r2.top - secRect.top);

            const dy = y2 - y1;
            const cp2y = Math.round(y2 - dy * 0.28);

            // Wires weave and cross over each other vertically in mobile
            d2 = `M ${x1b} ${y1} C ${x1b} ${Math.round(y1 + dy * 0.45)}, ${x2} ${cp2y}, ${x2} ${y2}`;
            d1 = `M ${x1a} ${y1} C ${x1a - 45} ${Math.round(y1 + dy * 0.35)}, ${x2 + 20} ${cp2y}, ${x2} ${y2}`;
            d3 = `M ${x1c} ${y1} C ${x1c + 45} ${Math.round(y1 + dy * 0.35)}, ${x2 - 20} ${cp2y}, ${x2} ${y2}`;
          } else if (isLeft) {
            // Left Card -> Right Card: departs from upper right edge of prev card
            x1 = Math.round(r1.right - 2 - secRect.left);
            x1a = x1;
            x1b = x1;
            x1c = x1;
            y1_a = Math.round(r1.top + 30 - secRect.top);
            y1_b = Math.round(r1.top + 55 - secRect.top);
            y1_c = Math.round(r1.top + 80 - secRect.top);
            y1 = y1_b;

            // Arrives directly at top-center apex of target card
            x2 = Math.round((r2.left + r2.right) / 2 - secRect.left);
            y2 = Math.round(r2.top - secRect.top);

            const dx = x2 - x1;
            const dy = y2 - y1_b;

            // WIRE 1: Starts highest (y1_a), plunges down-right into inner airspace,
            // then swings up to approach the target from the RIGHT (x2 + 22),
            // crossing under Wire 2 & Wire 3 in flight and crossing Wire 3 directly above the card socket!
            const cp1_1x = Math.round(x1 + dx * 0.22);
            const cp1_1y = Math.round(y1_a + dy * 0.48);
            const cp2_1x = Math.round(x2 + 22);
            const cp2_1y = Math.round(y2 - dy * 0.24);
            d1 = `M ${x1} ${y1_a} C ${cp1_1x} ${cp1_1y}, ${cp2_1x} ${cp2_1y}, ${x2} ${y2}`;

            // WIRE 2: Primary central carrier wave, smooth balanced trajectory
            const cp1_2x = Math.round(x1 + dx * 0.62);
            const cp1_2y = Math.round(y1_b + dy * 0.20);
            const cp2_2x = Math.round(x2);
            const cp2_2y = Math.round(y2 - dy * 0.30);
            d2 = `M ${x1} ${y1_b} C ${cp1_2x} ${cp1_2y}, ${cp2_2x} ${cp2_2y}, ${x2} ${y2}`;

            // WIRE 3: Starts lowest (y1_c), SHOOTS WAY OUT in a wide buoyant whip across the void (matching TRIONN video),
            // arches high up, then swoops back in from outside to approach the target from the LEFT (x2 - 22),
            // crossing over Wire 1 & Wire 2 in flight and cross-correcting right above the card socket!
            const cp1_3x = Math.min(secW - 40, Math.round(x1 + dx * 1.25 + 75));
            const cp1_3y = Math.round(y1_c - dy * 0.08); // Arches up high!
            const cp2_3x = Math.round(x2 - 22);
            const cp2_3y = Math.round(y2 - dy * 0.22);
            d3 = `M ${x1} ${y1_c} C ${cp1_3x} ${cp1_3y}, ${cp2_3x} ${cp2_3y}, ${x2} ${y2}`;
          } else {
            // Right Card -> Left Card: departs from upper left edge of prev card
            x1 = Math.round(r1.left + 2 - secRect.left);
            x1a = x1;
            x1b = x1;
            x1c = x1;
            y1_a = Math.round(r1.top + 30 - secRect.top);
            y1_b = Math.round(r1.top + 55 - secRect.top);
            y1_c = Math.round(r1.top + 80 - secRect.top);
            y1 = y1_b;

            // Arrives directly at top-center apex of target card
            x2 = Math.round((r2.left + r2.right) / 2 - secRect.left);
            y2 = Math.round(r2.top - secRect.top);

            const dx = x2 - x1; // dx < 0
            const dy = y2 - y1_b;
            const absDx = Math.abs(dx);

            // WIRE 1: Starts highest (y1_a), plunges down-left into inner airspace,
            // then swings up to approach the target from the LEFT (x2 - 22),
            // crossing under Wire 2 & Wire 3 in flight and crossing Wire 3 directly above the card socket!
            const cp1_1x = Math.round(x1 - absDx * 0.22);
            const cp1_1y = Math.round(y1_a + dy * 0.48);
            const cp2_1x = Math.round(x2 - 22);
            const cp2_1y = Math.round(y2 - dy * 0.24);
            d1 = `M ${x1} ${y1_a} C ${cp1_1x} ${cp1_1y}, ${cp2_1x} ${cp2_1y}, ${x2} ${y2}`;

            // WIRE 2: Primary central carrier wave, smooth balanced trajectory
            const cp1_2x = Math.round(x1 - absDx * 0.62);
            const cp1_2y = Math.round(y1_b + dy * 0.20);
            const cp2_2x = Math.round(x2);
            const cp2_2y = Math.round(y2 - dy * 0.30);
            d2 = `M ${x1} ${y1_b} C ${cp1_2x} ${cp1_2y}, ${cp2_2x} ${cp2_2y}, ${x2} ${y2}`;

            // WIRE 3: Starts lowest (y1_c), SHOOTS WAY OUT in a wide buoyant whip across the void to the left,
            // arches high up, then swoops back in to approach the target from the RIGHT (x2 + 22),
            // crossing over Wire 1 & Wire 2 in flight and cross-correcting right above the card socket!
            const cp1_3x = Math.max(40, Math.round(x1 - absDx * 1.25 - 75));
            const cp1_3y = Math.round(y1_c - dy * 0.08); // Arches up high!
            const cp2_3x = Math.round(x2 + 22);
            const cp2_3y = Math.round(y2 - dy * 0.22);
            d3 = `M ${x1} ${y1_c} C ${cp1_3x} ${cp1_3y}, ${cp2_3x} ${cp2_3y}, ${x2} ${y2}`;
          }
        }

        // Linear Gradients along the wires: Black & dark charcoal at start, light white/silver in flight, crisp white near tip
        defsMarkup += `
          <linearGradient id="wireGrad-${k}-1" x1="${x1a || x1}" y1="${y1_a}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#0a0a0f" stop-opacity="0.95"/>
            <stop offset="18%" stop-color="#1e222b" stop-opacity="0.80"/>
            <stop offset="48%" stop-color="#555c6e" stop-opacity="0.65"/>
            <stop offset="82%" stop-color="#c5cddb" stop-opacity="0.70"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0.85"/>
          </linearGradient>
          <linearGradient id="wireGrad-${k}-2" x1="${x1b || x1}" y1="${y1_b}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#0a0a0f" stop-opacity="0.95"/>
            <stop offset="18%" stop-color="#242934" stop-opacity="0.85"/>
            <stop offset="48%" stop-color="#646c7f" stop-opacity="0.75"/>
            <stop offset="82%" stop-color="#d6dde8" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0.95"/>
          </linearGradient>
          <linearGradient id="wireGrad-${k}-3" x1="${x1c || x1}" y1="${y1_c}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#0a0a0f" stop-opacity="0.95"/>
            <stop offset="18%" stop-color="#1a1e26" stop-opacity="0.75"/>
            <stop offset="48%" stop-color="#4d5464" stop-opacity="0.60"/>
            <stop offset="82%" stop-color="#b8c0ce" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0.80"/>
          </linearGradient>
        `;

        bundlesMarkup += `
        <g class="celestial-wire-bundle bundle-${k}" data-bundle="${k}">
          ${k === 0 ? `
          <g class="bundle-start-group">
            <circle class="bundle-start-dot" cx="${x1a}" cy="${y1}" r="2.2" fill="#FFFFFF" opacity="0.6"/>
            <circle class="bundle-start-dot" cx="${x1b}" cy="${y1}" r="2.5" fill="#FFFFFF" opacity="0.8"/>
            <circle class="bundle-start-dot" cx="${x1c}" cy="${y1}" r="2.2" fill="#FFFFFF" opacity="0.6"/>
          </g>
          ` : ''}

          <!-- Subtle Landing Target Dot waiting at destination -->
          <circle class="bundle-target-dot" cx="${x2}" cy="${y2}" r="2.2" fill="#FFFFFF" opacity="0.30"/>

          <!-- 3 Dynamic Filaments with Light White & Black gradient (exact video palette) -->
          <path class="celestial-wire wire-1" d="${d1}" stroke="url(#wireGrad-${k}-1)" stroke-width="1.1" stroke-linecap="round"/>
          <path class="celestial-wire wire-2" d="${d2}" stroke="url(#wireGrad-${k}-2)" stroke-width="1.25" stroke-linecap="round"/>
          <path class="celestial-wire wire-3" d="${d3}" stroke="url(#wireGrad-${k}-3)" stroke-width="1.0" stroke-linecap="round"/>

          <!-- 3 Travelling Pure White Pointers at the tips of the 3 lines (TRIONN comet heads) -->
          <g class="travelling-dot dot-1" style="opacity: 0;">
            <circle cx="0" cy="0" r="4.2" fill="rgba(255, 255, 255, 0.22)"/>
            <circle cx="0" cy="0" r="2.2" fill="#FFFFFF"/>
          </g>
          <g class="travelling-dot dot-2" style="opacity: 0;">
            <circle cx="0" cy="0" r="4.8" fill="rgba(255, 255, 255, 0.25)"/>
            <circle cx="0" cy="0" r="2.5" fill="#FFFFFF"/>
          </g>
          <g class="travelling-dot dot-3" style="opacity: 0;">
            <circle cx="0" cy="0" r="3.8" fill="rgba(255, 255, 255, 0.20)"/>
            <circle cx="0" cy="0" r="2.0" fill="#FFFFFF"/>
          </g>

          <!-- Destination Convergence Point tucked behind target card -->
          <g class="bundle-arrival-spark" style="opacity: 0; transform-origin: ${x2}px ${y2}px;">
            <circle cx="${x2}" cy="${y2}" r="5.0" fill="rgba(255, 255, 255, 0.25)"/>
            <circle cx="${x2}" cy="${y2}" r="2.5" fill="#FFFFFF"/>
          </g>
        </g>`;
      }

      // Restore card transforms after layout measurement
      phaseCards.forEach((c, idx) => {
        c.style.transform = prevTransforms[idx] || 'scale(0.88) translateY(20px)';
      });

      svg.innerHTML = `<defs>${defsMarkup}</defs>${bundlesMarkup}`;

      // Extract DOM elements & calculate path lengths for each bundle
      for (let k = 0; k < totalBundles; k++) {
        const bundleEl = svg.querySelector(`.bundle-${k}`);
        if (!bundleEl) continue;

        const path1 = bundleEl.querySelector('.wire-1');
        const path2 = bundleEl.querySelector('.wire-2');
        const path3 = bundleEl.querySelector('.wire-3');

        const dot1 = bundleEl.querySelector('.dot-1');
        const dot2 = bundleEl.querySelector('.dot-2');
        const dot3 = bundleEl.querySelector('.dot-3');

        const targetDot = bundleEl.querySelector('.bundle-target-dot');
        const arrivalSpark = bundleEl.querySelector('.bundle-arrival-spark');
        const targetCard = phaseCards[k];
        const cardBody = targetCard ? (targetCard.querySelector('.phase-card-media') || targetCard.querySelector('.dark-card-body') || targetCard) : null;
        const prevCard = k > 0 ? phaseCards[k - 1] : null;
        const targetRow = phaseRows[k];

        if (!path1 || !path2 || !path3) continue;

        const L1 = path1.getTotalLength() || 1;
        const L2 = path2.getTotalLength() || 1;
        const L3 = path3.getTotalLength() || 1;

        path1.style.strokeDasharray = L1;
        path2.style.strokeDasharray = L2;
        path3.style.strokeDasharray = L3;

        path1.style.strokeDashoffset = L1;
        path2.style.strokeDashoffset = L2;
        path3.style.strokeDashoffset = L3;

        const bundleData = {
          bundleEl,
          path1, path2, path3,
          L1, L2, L3,
          dot1, dot2, dot3,
          targetDot,
          arrivalSpark,
          targetCard,
          cardBody,
          prevCard,
          targetRow,
          index: k,
          progress: 0
        };

        bundleInstances.push(bundleData);

        // Define scroll trigger range for this bundle matching TRIONN flight pace
        let triggerEl, startPos, endTriggerEl, endPos;

        if (k === 0) {
          triggerEl = howSection;
          startPos = 'top 75%';
          endTriggerEl = phaseRows[0];
          endPos = 'top 45%';
        } else {
          triggerEl = phaseRows[k - 1];
          startPos = 'top 35%';
          endTriggerEl = phaseRows[k];
          endPos = 'top 45%';
        }

        const st = ScrollTrigger.create({
          trigger: triggerEl,
          start: startPos,
          endTrigger: endTriggerEl,
          end: endPos,
          scrub: 0.5,
          onUpdate: (self) => {
            bundleData.progress = self.progress;
            renderBundle(bundleData, self.progress);
          }
        });

        scrollTriggerInstances.push(st);

        // Immediate initial render for current scroll position
        renderBundle(bundleData, st.progress);
      }
    }

    /**
     * Render Bundle at scroll progress p in [0, 1]:
     * - p = 0 to 0.84: 3 lines draw with staggered flight, leading white pointers at tips.
     * - p = 0.84: All 3 lines & pointers touch together at single destination coordinate.
     * - p >= 0.78 to 1.0: Destination card box generates / populates (expands with scale & opacity).
     * - Scrolling up: bidirectionally scrubs backwards in real-time.
     */
    function renderBundle(b, progress) {
      if (!b) return;

      const CONVERGE_P = 0.84;
      const CARD_POP_START = 0.78;

      // Normalized tip progress [0, 1]
      const pNorm = Math.min(1, Math.max(0, progress / CONVERGE_P));

      // Staggered speed matching TRIONN video:
      // Dot 1 leads ahead
      // Dot 2 in middle
      // Dot 3 trails closely behind
      // At pNorm = 1.0, ALL THREE reach 100% of length and touch simultaneously!
      const u1 = Math.pow(pNorm, 0.88);
      const u2 = Math.pow(pNorm, 0.96);
      const u3 = Math.pow(pNorm, 1.06);

      const d1 = b.L1 * u1;
      const d2 = b.L2 * u2;
      const d3 = b.L3 * u3;

      b.path1.style.strokeDashoffset = (b.L1 - d1);
      b.path2.style.strokeDashoffset = (b.L2 - d2);
      b.path3.style.strokeDashoffset = (b.L3 - d3);

      if (pNorm > 0.01) {
        const pt1 = b.path1.getPointAtLength(d1);
        const pt2 = b.path2.getPointAtLength(d2);
        const pt3 = b.path3.getPointAtLength(d3);

        b.dot1.setAttribute('transform', `translate(${pt1.x}, ${pt1.y})`);
        b.dot2.setAttribute('transform', `translate(${pt2.x}, ${pt2.y})`);
        b.dot3.setAttribute('transform', `translate(${pt3.x}, ${pt3.y})`);

        // Smooth fade-in when departing, full visibility during flight
        const inAlpha = Math.min(1, pNorm * 6);
        // Soft merge into arrival point right at convergence
        const fadeDots = pNorm > 0.96 ? Math.max(0, (1 - pNorm) / 0.04) : 1;
        const finalAlpha = (inAlpha * fadeDots).toFixed(3);

        b.dot1.style.opacity = finalAlpha;
        b.dot2.style.opacity = finalAlpha;
        b.dot3.style.opacity = finalAlpha;
      } else {
        b.dot1.style.opacity = '0';
        b.dot2.style.opacity = '0';
        b.dot3.style.opacity = '0';
      }

      // Target landing dot brightens to 1.0 as lines converge
      if (b.targetDot) {
        const dotAlpha = 0.30 + 0.70 * Math.min(1, Math.max(0, (progress - 0.55) / 0.30));
        b.targetDot.style.opacity = dotAlpha.toFixed(2);
      }

      // Arrival spark illuminates as the 3 lines meet together
      if (b.arrivalSpark) {
        if (progress < 0.76) {
          b.arrivalSpark.style.opacity = '0';
        } else {
          const sparkP = Math.min(1, (progress - 0.76) / 0.14);
          b.arrivalSpark.style.opacity = sparkP.toFixed(2);
        }
      }

      // CARD BOX POPULATION:
      // The box generates and populates into view as the lines arrive behind it
      if (b.targetCard) {
        if (progress < CARD_POP_START) {
          b.targetCard.style.opacity = '0';
          b.targetCard.style.transform = 'scale(0.88) translateY(20px)';
          b.targetCard.style.pointerEvents = 'none';

          if (b.cardBody) {
            b.cardBody.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            b.cardBody.style.boxShadow = 'none';
          }
        } else {
          const popP = Math.min(1, (progress - CARD_POP_START) / (1 - CARD_POP_START));
          // Cubic ease-out expansion matching TRIONN
          const ease = 1 - Math.pow(1 - popP, 3);
          const scale = (0.88 + 0.12 * ease).toFixed(4);
          const ty = (20 * (1 - ease)).toFixed(2);

          b.targetCard.style.opacity = popP.toFixed(3);
          b.targetCard.style.transform = `scale(${scale}) translateY(${ty}px)`;
          b.targetCard.style.pointerEvents = popP > 0.5 ? 'auto' : 'none';

          if (b.cardBody) {
            b.cardBody.style.borderColor = `rgba(255, 255, 255, ${(0.10 + 0.12 * ease).toFixed(2)})`;
            b.cardBody.style.boxShadow = '0 25px 60px -10px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.08)';
          }
        }
      }
    }


    // Build bundles on load and window resize
    buildAndInitBundles();

    window.addEventListener('resize', () => {
      clearTimeout(window._trionnFilamentResize);
      window._trionnFilamentResize = setTimeout(buildAndInitBundles, 150);
    });

    window.addEventListener('load', () => {
      setTimeout(buildAndInitBundles, 250);
      setTimeout(() => ScrollTrigger.refresh(), 300);
    });

    ScrollTrigger.addEventListener('refresh', () => {
      bundleInstances.forEach(b => {
        const st = scrollTriggerInstances[b.index];
        if (st) renderBundle(b, st.progress);
      });
    });
  }

  /* ==========================================================================
     3. FLOATING CELESTIAL STARDUST PARTICLES ENGINE (Subtle 3D Depth & Parallax)
     - Rendered on #celestialParticlesCanvas inside .dark-stage-bg-atmosphere
     - Hardware-accelerated 60fps canvas with HiDPI support
     - 55 multi-depth celestial stardust particles drifting in Brownian cosmic flow
     - Subtle scroll-driven parallax: foreground particles move faster than background
     - Delicate constellation micro-hairlines connecting nearby particle nodes
     - IntersectionObserver: completely sleeps when off-screen for 0% idle CPU/GPU usage
     - prefers-reduced-motion: renders a static crisp constellation field with no RAF
     ========================================================================== */
  function initCelestialBackgroundParticles() {
    const canvas = document.getElementById('celestialParticlesCanvas');
    const howSection = document.getElementById('howWeDeliverSection');
    if (!canvas || !howSection) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let isVisible = false;
    let rafId = null;
    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    let scrollVelocity = 0;

    // Number of particles (balanced for delicate luxury look and top performance)
    const PARTICLE_COUNT = window.innerWidth <= 768 ? 32 : 58;

    function resizeCanvas() {
      width = howSection.offsetWidth || window.innerWidth;
      height = howSection.offsetHeight || window.innerHeight * 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (particles.length === 0) {
        initParticles();
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const z = 0.25 + Math.random() * 0.75; // 3D depth layer [0.25, 1.0]
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: z,
          radius: 0.8 + z * 1.4, // larger particles in foreground
          baseAlpha: 0.18 + z * 0.42, // higher opacity in foreground
          alpha: 0.2,
          pulseSpeed: 0.012 + Math.random() * 0.018,
          pulsePhase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.22,
          driftY: -0.12 - Math.random() * 0.18, // gentle upward cosmic float
          // 85% pure white, 15% soft pale lilac stardust
          color: Math.random() > 0.20 ? '255, 255, 255' : '216, 180, 254'
        });
      }
    }

    function onScroll() {
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      scrollVelocity = (currentScrollY - lastScrollY) * 0.12;
      lastScrollY = currentScrollY;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Decay scroll velocity smoothly
      scrollVelocity *= 0.92;

      const len = particles.length;

      // 1. Draw subtle constellation micro-hairlines between nearby foreground particles
      for (let i = 0; i < len; i++) {
        const p1 = particles[i];
        if (p1.z < 0.55) continue; // Only deeper/closer particles link
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          if (p2.z < 0.55) continue;
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          // Connect if within 115px
          if (distSq < 13225) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 115) * 0.08 * (p1.z * p2.z);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha.toFixed(4)})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      // 2. Update and draw particles
      for (let i = 0; i < len; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.pulsePhase += p.pulseSpeed;
          p.x += p.driftX;
          // Apply vertical drift + 3D scroll parallax based on depth z
          p.y += p.driftY - scrollVelocity * (p.z * 1.2);

          // Toroidal wrap around canvas borders
          if (p.x < -10) p.x = width + 10;
          else if (p.x > width + 10) p.x = -10;

          if (p.y < -10) p.y = height + 10;
          else if (p.y > height + 10) p.y = -10;
        }

        // Shimmering breathing luminosity
        const shimmer = 0.75 + 0.25 * Math.sin(p.pulsePhase);
        const currentAlpha = (p.baseAlpha * shimmer).toFixed(3);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${currentAlpha})`;
        ctx.fill();

        // Delicate luminous halo aura for larger foreground stars
        if (p.z > 0.75) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${(currentAlpha * 0.20).toFixed(3)})`;
          ctx.fill();
        }
      }

      if (isVisible && !prefersReducedMotion) {
        rafId = requestAnimationFrame(draw);
      }
    }

    // Set up IntersectionObserver for 0% CPU consumption when off-screen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (!rafId && !prefersReducedMotion) {
              lastScrollY = window.scrollY || window.pageYOffset || 0;
              rafId = requestAnimationFrame(draw);
            } else if (prefersReducedMotion) {
              draw();
            }
          } else {
            if (rafId) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
          }
        });
      }, { rootMargin: '100px 0px 100px 0px', threshold: 0.01 });

      observer.observe(howSection);
    } else {
      isVisible = true;
      rafId = requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      resizeCanvas();
      if (!isVisible || prefersReducedMotion) draw();
    });
  }
})();
