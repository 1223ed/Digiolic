/**
 * Digiolic Zoho Enterprise Architecture - Feather 3D Scroll Choreography Engine
 * Inspired by composites.archi Awwwards-winning feather design & scroll choreography
 * 
 * Choreographs:
 * 1. Pinned 3D Feather WebGL Canvas across the entire Six Pillars section
 * 2. Stage 0 Section Intro ("Six Pillars Engineered for Scale & Resilience")
 * 3. 6 Enterprise Pillars:
 *    - 01 Custom Architecture (Stone Grey, Black Feather Right, Text Left)
 *    - 02 Workflow Automation (Obsidian Black, Radiant White Feather Left, Text Right)
 *    - 03 Migration & Cloud (Slate, Black Feather Right, Text Left)
 *    - 04 Deluge & Scripting (Midnight, Radiant White Feather Left, Text Right)
 *    - 05 Ecosystem APIs (Titanium, Black Feather Right, Text Left)
 *    - 06 Security & Governance (Pure Black, Radiant White Feather Left, Text Right)
 * 4. Clean sequential entrance & exit with ZERO overlap and ZERO blank gaps
 * 5. Minimalist bottom bar with live counter [ 01 / 06 ] & SKIP button
 */

(function () {
  'use strict';

  function initCorePillarsScroll() {
    const section = document.getElementById('coreEnterprisePillarsSection');
    const viewport = document.getElementById('corePillarsStickyViewport');
    const introStage = document.getElementById('maiPillarIntroStage');
    const rawSlides = Array.from(document.querySelectorAll('.mai-pillar-slide'));
    const dots = Array.from(document.querySelectorAll('.mai-nav-dot'));
    const counterCurrent = document.getElementById('featherCounterCurrent');
    const skipBtn = document.getElementById('featherSkipBtn');
    const beamBtn = document.getElementById('zohoTechBeamBtn');
    const bottomControls = document.getElementById('featherBottomControls');
    const cadGrid = document.getElementById('featherCadGrid');
    const cadLeft = document.getElementById('featherCadLeft');
    const cadRight = document.getElementById('featherCadRight');

    if (!section || !viewport || rawSlides.length === 0) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP / ScrollTrigger not loaded for Feather scroll.');
      return;
    }

    // Ensure manual scroll restoration to prevent erratic offsets on refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    let introWaveTriggered = false;

    gsap.registerPlugin(ScrollTrigger);

    // 1. Initialize 3D Feather WebGL Engine
    let featherEngine = null;
    if (window.FeatherScrollEngine && typeof window.FeatherScrollEngine.init === 'function') {
      featherEngine = window.FeatherScrollEngine.init('featherWebglCanvasContainer', 'featherWebglCanvas');
    }

    // Cubic-bezier smooth easing helpers
    function easeOutCubic(t) {
      const p = Math.min(1, Math.max(0, t));
      return 1 - Math.pow(1 - p, 3);
    }

    function easeInOutCubic(t) {
      const p = Math.min(1, Math.max(0, t));
      return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    }

    // Cache Slide Elements
    const slidesData = rawSlides.map((slide, idx) => {
      const splitWrap = slide.querySelector('.feather-slide-split');
      const content = slide.querySelector('.feather-slide-content');
      const badge = slide.querySelector('.feather-index-badge');
      const heading = slide.querySelector('.feather-slide-heading');
      const paragraphs = slide.querySelector('.feather-paragraphs-wrap');
      const chips = slide.querySelector('.feather-chips-row');
      return { slide, splitWrap, content, badge, heading, paragraphs, chips, idx };
    });

    // Initial state: hide all pillar slides completely
    slidesData.forEach(({ slide, content }) => {
      slide.style.opacity = '0';
      slide.style.visibility = 'hidden';
      slide.style.pointerEvents = 'none';
      if (content) {
        content.style.transform = 'translate3d(0, 40px, 0)';
        content.style.opacity = '0';
      }
    });

    // Section Intro Initial State
    if (introStage) {
      introStage.style.opacity = '1';
      introStage.style.visibility = 'visible';
      introStage.style.pointerEvents = 'auto';
      introStage.style.transform = 'translate3d(0, 0, 0)';

      const scrollIndicator = document.getElementById('maiScrollIndicator');
      if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function (e) {
          e.preventDefault();
          const stInst = ScrollTrigger.getById('featherCorePillarsScrollTrigger');
          if (stInst) {
            window.scrollTo({
              top: stInst.start + (stInst.end - stInst.start) * 0.24,
              behavior: 'smooth'
            });
          }
        });
      }
    }

    // Skip Button: smoothly jumps past Six Pillars into FAQs
    if (skipBtn) {
      skipBtn.addEventListener('click', function (e) {
        e.preventDefault();
        const faqSection = document.getElementById('zohoFaqSection');
        if (faqSection) {
          faqSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          const stInst = ScrollTrigger.getById('featherCorePillarsScrollTrigger');
          if (stInst) {
            window.scrollTo({
              top: stInst.end + 60,
              behavior: 'smooth'
            });
          }
        }
      });
    }

    // Enterprise Architecture Beam Button on Tech Stack section
    if (beamBtn) {
      beamBtn.addEventListener('click', function (e) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Dedicated Non-Overlapping Windows for 6 Pillars (0.0 to 1.0 progress)
    // Stage 0 Intro: 0.00 to 0.15
    // Slide 1: 0.15 to 0.33
    // Slide 2: 0.33 to 0.51
    // Slide Timing Windows (Cinematic Cross-Fade: Zero dead zones, always visible!)
    // Overlapping enter/exit ensures opacity(N) + opacity(N+1) >= 1.0 at all scroll positions across 5 pillars!
    const slideWindows = [
      // Slide 1: Custom Architecture (Right feather, Left text)
      { enterStart: 0.14, enterEnd: 0.19, exitStart: 0.32, exitEnd: 0.37, activeAt: 0.25 },
      // Slide 2: Workflow Automation (Left feather, Right text)
      { enterStart: 0.32, enterEnd: 0.37, exitStart: 0.49, exitEnd: 0.54, activeAt: 0.43 },
      // Slide 3: Migration & Cloud (Right feather, Left text)
      { enterStart: 0.49, enterEnd: 0.54, exitStart: 0.67, exitEnd: 0.72, activeAt: 0.60 },
      // Slide 4: Deluge & Scripting (Left feather, Right text)
      { enterStart: 0.67, enterEnd: 0.72, exitStart: 0.85, exitEnd: 0.89, activeAt: 0.78 },
      // Slide 5: Security & Governance (Right feather, Left text - Final Slide)
      // Enters 0.85-0.89, stays 100% visible all the way to 1.00!
      { enterStart: 0.85, enterEnd: 0.89, exitStart: 1.00, exitEnd: 1.00, activeAt: 0.95 }
    ];

    // Background color colorstops for smooth real-time interpolation
    // High-contrast deep obsidian luxury aesthetic across all slides
    const colorStops = [
      { p: 0.00, rgb: [206, 201, 201] }, // Stage 0 Intro: Image 2 (#cec9c9)
      { p: 0.14, rgb: [206, 201, 201] }, // Stage 0 Intro
      { p: 0.19, rgb: [8, 9, 13] },       // Pillar 1: Custom Arch (Deep Obsidian Dark)
      { p: 0.32, rgb: [8, 9, 13] },       // Pillar 1: Custom Arch
      { p: 0.37, rgb: [206, 201, 201] }, // Pillar 2: Workflow Automation (Image 2 #cec9c9)
      { p: 0.49, rgb: [206, 201, 201] }, // Pillar 2: Workflow Automation
      { p: 0.54, rgb: [206, 201, 201] }, // Pillar 3: Migration & Cloud (Image 2 #cec9c9)
      { p: 0.67, rgb: [206, 201, 201] }, // Pillar 3: Migration & Cloud
      { p: 0.72, rgb: [8, 9, 13] },       // Pillar 4: Deluge & Scripting (Deep Obsidian Dark)
      { p: 0.85, rgb: [8, 9, 13] },       // Pillar 4: Deluge & Scripting
      { p: 0.89, rgb: [2, 2, 4] },        // Pillar 5: Security & Governance (Pure Obsidian)
      { p: 1.00, rgb: [2, 2, 4] }         // Pillar 5: Security & Governance
    ];

    function getInterpolatedBgColor(progress) {
      const p = Math.max(0, Math.min(1, progress));
      if (p <= colorStops[0].p) return `rgb(${colorStops[0].rgb.join(',')})`;
      if (p >= colorStops[colorStops.length - 1].p) {
        return `rgb(${colorStops[colorStops.length - 1].rgb.join(',')})`;
      }

      for (let i = 0; i < colorStops.length - 1; i++) {
        const s1 = colorStops[i];
        const s2 = colorStops[i + 1];
        if (p >= s1.p && p <= s2.p) {
          const factor = (p - s1.p) / Math.max(0.0001, s2.p - s1.p);
          const r = Math.round(s1.rgb[0] + (s2.rgb[0] - s1.rgb[0]) * factor);
          const g = Math.round(s1.rgb[1] + (s2.rgb[1] - s1.rgb[1]) * factor);
          const b = Math.round(s1.rgb[2] + (s2.rgb[2] - s1.rgb[2]) * factor);
          return `rgb(${r}, ${g}, ${b})`;
        }
      }
      return 'rgb(206, 201, 201)';
    }

    // Geometry Calculation: Total Scroll Scrub Distance
    function getTotalScrollDistance() {
      const vh = window.innerHeight || 800;
      return vh * 6.5; // 6.5 viewport heights of silky scrub
    }

    // Helper to calculate CAD line pattern weights matching feather position:
    // Left feather slides (Pillars 2 & 4: Workflow Automation, Deluge & Scripting) -> Left CAD active
    // Right feather slides (Pillars 1, 3, 5: Custom Architecture, Migration & Cloud, Security & Governance) -> Right CAD active
    function getFeatherSideWeights(p) {
      if (p <= 0.14) {
        return { left: 0, right: 0 };
      }
      // Pillar 1: Custom Architecture (Right feather)
      if (p <= 0.32) {
        const enterFade = Math.min(1, (p - 0.14) / 0.05);
        return { left: 0, right: enterFade };
      }
      // Transition P1 -> P2 (Right to Left)
      if (p < 0.37) {
        const t = (p - 0.32) / 0.05;
        const ease = 0.5 * (1 - Math.cos(t * Math.PI));
        return { left: ease, right: 1 - ease };
      }
      // Pillar 2: Workflow Automation (Left feather)
      if (p <= 0.49) {
        return { left: 1, right: 0 };
      }
      // Transition P2 -> P3 (Left to Right)
      if (p < 0.54) {
        const t = (p - 0.49) / 0.05;
        const ease = 0.5 * (1 - Math.cos(t * Math.PI));
        return { left: 1 - ease, right: ease };
      }
      // Pillar 3: Migration & Cloud (Right feather)
      if (p <= 0.67) {
        return { left: 0, right: 1 };
      }
      // Transition P3 -> P4 (Right to Left)
      if (p < 0.72) {
        const t = (p - 0.67) / 0.05;
        const ease = 0.5 * (1 - Math.cos(t * Math.PI));
        return { left: ease, right: 1 - ease };
      }
      // Pillar 4: Deluge & Scripting (Left feather)
      if (p <= 0.85) {
        return { left: 1, right: 0 };
      }
      // Transition P4 -> P5 (Left to Right)
      if (p < 0.89) {
        const t = (p - 0.85) / 0.04;
        const ease = 0.5 * (1 - Math.cos(t * Math.PI));
        return { left: 1 - ease, right: ease };
      }
      // Pillar 5: Security & Governance (Right feather)
      return { left: 0, right: 1 };
    }

    // Render frame logic given normalized progress p (0.0 to 1.0)
    function renderPillarsFrame(p) {
      // 1. Interpolate background color in real-time
      const currentBg = getInterpolatedBgColor(p);
      section.style.setProperty('--feather-bg', currentBg);
      viewport.style.setProperty('--feather-bg', currentBg);
      section.style.backgroundColor = currentBg;
      viewport.style.backgroundColor = currentBg;

      // Theme toggle: Light theme for Stage 0 (#cec9c9), Pillar 2 (#cec9c9), Pillar 3 (#cec9c9);
      // Dark theme for Pillar 1 (Obsidian), Pillar 4 (Obsidian), Pillar 5 (Obsidian)
      const isLight = (p <= 0.165) || (p >= 0.345 && p < 0.695);
      if (isLight) {
        viewport.classList.add('is-light-theme');
        viewport.classList.remove('is-dark-slide', 'is-dark-theme');
        section.classList.add('is-light-theme');
        section.classList.remove('is-dark-slide', 'is-dark-theme');
      } else {
        viewport.classList.add('is-dark-slide', 'is-dark-theme');
        viewport.classList.remove('is-light-theme');
        section.classList.add('is-dark-slide', 'is-dark-theme');
        section.classList.remove('is-light-theme');
      }

      // 2. Stage 0: Section Intro ("FIVE PILLARS ENGINEERED FOR SCALE & RESILIENCE")
      // Resting from 0.00 to 0.14, smooth exit from 0.14 to 0.19
      if (introStage) {
        if (p <= 0.14) {
          introStage.style.opacity = '1';
          introStage.style.visibility = 'visible';
          introStage.style.pointerEvents = 'auto';
          introStage.style.transform = 'translate3d(0, 0, 0)';

          introWaveTriggered = true;
        } else if (p < 0.19) {
          const pExit = (p - 0.14) / 0.05;
          const eExit = easeOutCubic(pExit);
          introStage.style.transform = 'translate3d(0, 0, 0)';
          introStage.style.opacity = (1 - eExit).toFixed(3);
          introStage.style.visibility = 'visible';
          introStage.style.pointerEvents = 'none';
        } else {
          introStage.style.opacity = '0';
          introStage.style.visibility = 'hidden';
          introStage.style.pointerEvents = 'none';
          introStage.style.transform = 'translate3d(0, 0, 0)';
          if (p >= 0.22) {
            introWaveTriggered = false;
          }
        }
      }

      // Architectural CAD Line Grid:
      // Completely REMOVED / HIDDEN on Stage 0 Intro ("FIVE PILLARS ENGINEERED FOR SCALE & RESILIENCE" - user request)
      // Smoothly revealed for Pillar slides (P1 to P5)
      if (cadGrid) {
        if (p <= 0.14) {
          cadGrid.style.setProperty('opacity', '0', 'important');
          cadGrid.style.setProperty('visibility', 'hidden', 'important');
          cadGrid.style.setProperty('display', 'none', 'important');
          viewport.classList.add('is-intro-active');
        } else if (p < 0.19) {
          cadGrid.style.setProperty('display', 'block', 'important');
          cadGrid.style.setProperty('visibility', 'visible', 'important');
          const pFade = (p - 0.14) / 0.05;
          const targetOp = isLight ? 0.42 : 0.28;
          cadGrid.style.setProperty('opacity', (pFade * targetOp).toFixed(3), 'important');
          viewport.classList.remove('is-intro-active');
        } else {
          cadGrid.style.setProperty('display', 'block', 'important');
          cadGrid.style.setProperty('visibility', 'visible', 'important');
          cadGrid.style.setProperty('opacity', isLight ? '0.42' : '0.28', 'important');
          viewport.classList.remove('is-intro-active');
        }
      }

      // Feather Side CAD Line Groups (Always frames the 3D feather):
      // On Custom Architecture, Migration & Cloud, and Security & Governance (feather on right) -> Right CAD group is active!
      // On Workflow Automation and Deluge & Scripting (feather on left) -> Left CAD group is active!
      if (cadLeft && cadRight) {
        if (p <= 0.14) {
          cadLeft.style.opacity = '0';
          cadRight.style.opacity = '0';
        } else {
          const sideWeights = getFeatherSideWeights(p);
          cadLeft.style.opacity = sideWeights.left.toFixed(3);
          cadRight.style.opacity = sideWeights.right.toFixed(3);
        }
      }

      // 3. Bottom Control Bar ([ 01 / 05 ] + SKIP button) - visible during slides (p >= 0.14)
      if (bottomControls) {
        if (p < 0.14) {
          bottomControls.style.opacity = '0';
          bottomControls.style.visibility = 'hidden';
          bottomControls.style.pointerEvents = 'none';
        } else {
          const pControlsFade = Math.min(1, (p - 0.14) / 0.04);
          bottomControls.style.opacity = pControlsFade.toFixed(3);
          bottomControls.style.visibility = 'visible';
          bottomControls.style.pointerEvents = 'auto';
        }
      }

      // 4. Scrub & Animate the 5 Pillar Slides (strictly sequential & non-overlapping)
      let activeIdx = 0;
      let minDistance = Infinity;

      slidesData.forEach(({ slide, content, idx }) => {
        const win = slideWindows[idx];
        if (!win) return;

        const distToActive = Math.abs(p - win.activeAt);
        if (distToActive < minDistance) {
          minDistance = distToActive;
          activeIdx = idx;
        }

        let slideOpacity = 0;
        let contentY = 0;

        if (idx === slidesData.length - 1) {
          // FINAL SLIDE (PILLAR 5)
          // Enters cleanly, then stays 100% visible all the way to 1.00!
          if (p < win.enterStart) {
            slideOpacity = 0;
            contentY = 25;
          } else if (p <= win.enterEnd) {
            const pEnter = (p - win.enterStart) / (win.enterEnd - win.enterStart);
            const eEnter = 0.5 * (1 - Math.cos(pEnter * Math.PI));
            slideOpacity = eEnter;
            contentY = (1 - eEnter) * 25;
          } else {
            slideOpacity = 1;
            contentY = 0;
          }
        } else {
          // PILLARS 1 TO 5: Smooth complementary sinusoidal crossfade (User Requirement 2)
          if (p < win.enterStart) {
            slideOpacity = 0;
            contentY = 25;
          } else if (p <= win.enterEnd) {
            const pEnter = (p - win.enterStart) / (win.enterEnd - win.enterStart);
            const eEnter = 0.5 * (1 - Math.cos(pEnter * Math.PI));
            slideOpacity = eEnter;
            contentY = (1 - eEnter) * 25;
          } else if (p <= win.exitStart) {
            slideOpacity = 1;
            contentY = 0;
          } else if (p <= win.exitEnd) {
            const pExit = (p - win.exitStart) / (win.exitEnd - win.exitStart);
            const eExit = 0.5 * (1 - Math.cos(pExit * Math.PI));
            slideOpacity = 1 - eExit;
            contentY = -eExit * 25;
          } else {
            slideOpacity = 0;
            contentY = -25;
          }
        }

        if (slideOpacity <= 0.005 || (p <= 0.14 && idx === 0)) {
          slide.style.opacity = '0';
          slide.style.visibility = 'hidden';
          slide.style.pointerEvents = 'none';
          if (content) {
            content.style.opacity = '0';
          }
        } else {
          slide.style.opacity = '1';
          slide.style.visibility = 'visible';
          slide.style.pointerEvents = slideOpacity > 0.6 ? 'auto' : 'none';
          if (content) {
            content.style.transform = `translate3d(0, ${contentY.toFixed(2)}px, 0)`;
            content.style.opacity = slideOpacity.toFixed(3);
          }
        }
      });

      // 5. Update Live Counter & Side Dots
      if (counterCurrent) {
        counterCurrent.textContent = ('0' + (activeIdx + 1)).slice(-2);
      }

      dots.forEach((dot, dIdx) => {
        if (p < 0.14) {
          if (dIdx === 0) dot.classList.add('is-active');
          else dot.classList.remove('is-active');
        } else {
          if (dIdx === activeIdx + 1) dot.classList.add('is-active');
          else dot.classList.remove('is-active');
        }
      });

      // 6. Update 3D Feather Engine Transform & Motion
      if (featherEngine && typeof featherEngine.updateScroll === 'function') {
        featherEngine.updateScroll(p);
      }
    }

    // Master ScrollTrigger for Six Pillars Section
    const st = ScrollTrigger.create({
      id: 'featherCorePillarsScrollTrigger',
      trigger: section,
      pin: true,
      start: 'top top',
      end: () => '+=' + getTotalScrollDistance(),
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        renderPillarsFrame(self.progress);
      }
    });

    // Side Navigation Dots Click Handlers
    dots.forEach((dot, dIdx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        let targetProgress = 0;
        if (dIdx === 0) {
          targetProgress = 0.05; // Jump to Intro Stage 0
        } else {
          const sIdx = dIdx - 1;
          const win = slideWindows[sIdx];
          targetProgress = win ? win.activeAt : 0;
        }

        const stInst = ScrollTrigger.getById('featherCorePillarsScrollTrigger');
        if (stInst) {
          window.scrollTo({
            top: stInst.start + (stInst.end - stInst.start) * targetProgress,
            behavior: 'smooth'
          });
        }
      });
    });

    // Window Resize Handler
    window.addEventListener('resize', () => {
      if (st) st.refresh();
      if (featherEngine && typeof featherEngine.onResize === 'function') {
        featherEngine.onResize();
      }
    });

    // Clean initial calculation
    renderPillarsFrame(0);

    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
      if (st) {
        renderPillarsFrame(st.progress);
      }
    });

    // Initial refresh
    ScrollTrigger.refresh();

    window.CorePillarsScroll = {
      renderPillarsFrame,
      getScrollTrigger: () => st
    };
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCorePillarsScroll);
  } else {
    initCorePillarsScroll();
  }
})();
