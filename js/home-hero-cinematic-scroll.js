/**
 * ============================================================================
 * DIGIOLIC — CINEMATIC SCROLL STORY CONTROLLER
 * Full Black Screen -> "D" -> "DIGIOLIC" -> "G" (GROWTH) -> 3 Services One-by-One
 * - 60fps RAF Lerp scroll tracking
 * - Canvas star dust & neural particle engine
 * - Episode cross-fades & 3D perspective gliding
 * - Interactive scrubber dots & jump arrow navigation
 * ============================================================================
 */

(function () {
  'use strict';

  const LERP_TAU = 14;
  const SNAP = 0.0015;

  function initCinematicStory() {
    const track = document.getElementById('cinematicStoryTrack');
    const stage = document.getElementById('cinematicStoryStage');
    const canvas = document.getElementById('storyCanvas');

    if (!track || !stage) return;

    // Episodes
    const epVoid = document.getElementById('epVoid');
    const epD = document.getElementById('epD');
    const epDigiolic = document.getElementById('epDigiolic');
    const epG = document.getElementById('epG');
    const epZoho = document.getElementById('epZoho');
    const epSf = document.getElementById('epSf');
    const epMkt = document.getElementById('epMkt');

    // Ambient Glows
    const glowCenter = document.getElementById('glowCenterGreen');
    const glowZoho = document.getElementById('glowZohoRed');
    const glowSf = document.getElementById('glowSfBlue');
    const glowMkt = document.getElementById('glowMktPurple');

    // Ticker & Navigation
    const tickerText = document.getElementById('storyTickerText');
    const dots = Array.from(document.querySelectorAll('.scrubber-dot'));
    const jumpBtn = document.getElementById('storyJumpBtn');
    const exploreBtn = document.getElementById('storyExploreBtn');
    const menuBtn = document.getElementById('cinematicMenuOpenBtn');

    let targetProgress = 0;
    let currentProgress = 0;
    let lastTime = performance.now();
    let rafId = null;

    // ==========================================================================
    // 1. HIGH-PERFORMANCE AMBIENT PARTICLES CANVAS
    // ==========================================================================
    let ctx = null;
    let width = 0;
    let height = 0;
    let particles = [];
    let drawParticles = null;
    const PARTICLE_COUNT = window.innerWidth < 768 ? 28 : 55;

    if (canvas && canvas.getContext) {
      ctx = canvas.getContext('2d');

      function resizeCanvas() {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }

      window.addEventListener('resize', resizeCanvas, { passive: true });
      resizeCanvas();

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 0.8,
          alpha: Math.random() * 0.5 + 0.2,
          pulseSpeed: Math.random() * 0.02 + 0.01
        });
      }

      drawParticles = function (p) {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        // Particle color tint transitions based on episode progress
        let particleR = 255, particleG = 255, particleB = 255;
        if (p >= 0.08 && p < 0.42) {
          // Green accent during D and DIGIOLIC
          particleR = 74; particleG = 222; particleB = 128;
        } else if (p >= 0.42 && p < 0.58) {
          // Cyan accent during G
          particleR = 56; particleG = 189; particleB = 248;
        } else if (p >= 0.58 && p < 0.72) {
          // Red accent during Zoho
          particleR = 239; particleG = 68; particleB = 68;
        } else if (p >= 0.72 && p < 0.86) {
          // Cyan accent during Salesforce
          particleR = 0; particleG = 161; particleB = 224;
        } else if (p >= 0.86) {
          // Purple accent during Marketing
          particleR = 168; particleG = 85; particleB = 247;
        }

        const speedBoost = 1 + p * 1.6;

        for (let i = 0; i < particles.length; i++) {
          const pt = particles[i];
          pt.x += pt.vx * speedBoost;
          pt.y += pt.vy * speedBoost;

          if (pt.x < 0) pt.x = width;
          if (pt.x > width) pt.x = 0;
          if (pt.y < 0) pt.y = height;
          if (pt.y > height) pt.y = 0;

          pt.alpha += Math.sin(performance.now() * pt.pulseSpeed) * 0.005;
          const currentAlpha = Math.max(0.12, Math.min(0.75, pt.alpha));

          ctx.fillStyle = `rgba(${particleR}, ${particleG}, ${particleB}, ${currentAlpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      };
    }

    // ==========================================================================
    // 2. SCROLL PROGRESS COMPUTATION
    // ==========================================================================
    function computeProgress() {
      const rect = track.getBoundingClientRect();
      const trackHeight = track.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollDistance = trackHeight - viewportHeight;

      if (scrollDistance <= 0) return 0;
      const scrolled = -rect.top;
      return Math.max(0, Math.min(1, scrolled / scrollDistance));
    }

    // Helper: calculate bell-curve or linear crossfade opacity within a range
    function calcOpacity(p, inStart, inEnd, holdStart, holdEnd, outStart, outEnd) {
      if (p < inStart || p > outEnd) return 0;
      if (p >= inStart && p < inEnd) return (p - inStart) / (inEnd - inStart);
      if (p >= holdStart && p <= holdEnd) return 1;
      if (p > holdEnd && p <= outEnd) return 1 - (p - holdEnd) / (outEnd - holdEnd);
      return 0;
    }

    // ==========================================================================
    // 3. EPISODIC SCROLL CHOREOGRAPHY
    // ==========================================================================
    function applyProgress(p) {
      // 0. Void: 0.00 -> 0.08
      let op0 = 0;
      if (p < 0.04) op0 = 1;
      else if (p < 0.08) op0 = 1 - (p - 0.04) / 0.04;

      // 1. "D" Letter: 0.08 -> 0.24 (fades in 0.07->0.11, holds to 0.19, fades out 0.19->0.23)
      const op1 = calcOpacity(p, 0.07, 0.11, 0.11, 0.19, 0.19, 0.24);

      // 2. "DIGIOLIC": 0.24 -> 0.42 (fades in 0.22->0.26, holds to 0.38, fades out 0.38->0.42)
      const op2 = calcOpacity(p, 0.22, 0.26, 0.26, 0.38, 0.38, 0.42);

      // 3. "G" (GROWTH): 0.42 -> 0.58 (fades in 0.40->0.44, holds to 0.53, fades out 0.53->0.57)
      const op3 = calcOpacity(p, 0.40, 0.44, 0.44, 0.53, 0.53, 0.57);

      // 4. Service 1 (Zoho): 0.58 -> 0.72 (fades in 0.56->0.60, holds to 0.67, fades out 0.67->0.71)
      const op4 = calcOpacity(p, 0.56, 0.60, 0.60, 0.67, 0.67, 0.71);

      // 5. Service 2 (Salesforce): 0.72 -> 0.86 (fades in 0.70->0.74, holds to 0.81, fades out 0.81->0.85)
      const op5 = calcOpacity(p, 0.70, 0.74, 0.74, 0.81, 0.81, 0.85);

      // 6. Service 3 (Marketing + Finale): 0.86 -> 1.00 (fades in 0.84->0.88, holds to 1.00)
      let op6 = 0;
      if (p >= 0.84 && p < 0.88) op6 = (p - 0.84) / 0.04;
      else if (p >= 0.88) op6 = 1;

      // Apply Episode 0 (Void)
      if (epVoid) {
        epVoid.style.opacity = op0.toFixed(3);
        epVoid.style.transform = `translate3d(0, ${(1 - op0) * -20}px, 0)`;
        epVoid.classList.toggle('is-active-episode', op0 > 0.08);
      }

      // Apply Episode 1 ("D" Letter)
      if (epD) {
        epD.style.opacity = op1.toFixed(3);
        const scaleD = 0.85 + op1 * 0.2;
        const yD = (1 - op1) * 30;
        epD.style.transform = `scale(${scaleD.toFixed(3)}) translate3d(0, ${yD.toFixed(1)}px, 0)`;
        epD.classList.toggle('is-active-episode', op1 > 0.08);
      }

      // Apply Episode 2 (DIGIOLIC Word)
      if (epDigiolic) {
        epDigiolic.style.opacity = op2.toFixed(3);
        const scaleWord = 0.92 + op2 * 0.08;
        const yWord = (1 - op2) * 25;
        epDigiolic.style.transform = `scale(${scaleWord.toFixed(3)}) translate3d(0, ${yWord.toFixed(1)}px, 0)`;
        epDigiolic.classList.toggle('is-active-episode', op2 > 0.08);
      }

      // Apply Episode 3 ("G" Focus)
      if (epG) {
        epG.style.opacity = op3.toFixed(3);
        const scaleG = 0.88 + op3 * 0.15;
        const yG = (1 - op3) * 25;
        epG.style.transform = `scale(${scaleG.toFixed(3)}) translate3d(0, ${yG.toFixed(1)}px, 0)`;
        epG.classList.toggle('is-active-episode', op3 > 0.08);
      }

      // Apply Episode 4 (Zoho Service)
      if (epZoho) {
        epZoho.style.opacity = op4.toFixed(3);
        const y4 = (1 - op4) * 35;
        epZoho.style.transform = `translate3d(0, ${y4.toFixed(1)}px, 0)`;
        epZoho.classList.toggle('is-active-episode', op4 > 0.08);
      }

      // Apply Episode 5 (Salesforce Service)
      if (epSf) {
        epSf.style.opacity = op5.toFixed(3);
        const y5 = (1 - op5) * 35;
        epSf.style.transform = `translate3d(0, ${y5.toFixed(1)}px, 0)`;
        epSf.classList.toggle('is-active-episode', op5 > 0.08);
      }

      // Apply Episode 6 (Digital Marketing & Finale)
      if (epMkt) {
        epMkt.style.opacity = op6.toFixed(3);
        const y6 = (1 - op6) * 35;
        epMkt.style.transform = `translate3d(0, ${y6.toFixed(1)}px, 0)`;
        epMkt.classList.toggle('is-active-episode', op6 > 0.08);
      }

      // Ambient Glow Adjustments
      if (glowCenter) {
        glowCenter.style.opacity = (op1 * 0.6 + op2 * 0.4).toFixed(2);
      }
      if (glowZoho) {
        glowZoho.style.opacity = (op4 * 0.65).toFixed(2);
      }
      if (glowSf) {
        glowSf.style.opacity = (op3 * 0.6 + op5 * 0.65).toFixed(2);
      }
      if (glowMkt) {
        glowMkt.style.opacity = (op6 * 0.65).toFixed(2);
      }

      // Ticker & Active Step Dot
      let activeIndex = 0;
      let stageLabel = 'THE VOID';

      if (p >= 0.85) {
        activeIndex = 6;
        stageLabel = 'SERVICE 03: DIGITAL MARKETING';
      } else if (p >= 0.71) {
        activeIndex = 5;
        stageLabel = 'SERVICE 02: SALESFORCE CLOUD';
      } else if (p >= 0.57) {
        activeIndex = 4;
        stageLabel = 'SERVICE 01: ZOHO ENTERPRISE';
      } else if (p >= 0.41) {
        activeIndex = 3;
        stageLabel = 'G — YOUR GROWTH ENGINE';
      } else if (p >= 0.23) {
        activeIndex = 2;
        stageLabel = 'DIGIOLIC ENTERPRISE';
      } else if (p >= 0.07) {
        activeIndex = 1;
        stageLabel = "'D' — THE GENESIS";
      }

      if (tickerText) {
        tickerText.textContent = stageLabel;
      }

      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active-dot', idx === activeIndex);
      });
    }

    // ==========================================================================
    // 4. MAIN 60FPS RAF LOOP
    // ==========================================================================
    function rafLoop(now) {
      const deltaSeconds = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(0.1, deltaSeconds);

      targetProgress = computeProgress();
      currentProgress += (targetProgress - currentProgress) * (1 - Math.exp(-dt * LERP_TAU));

      if (Math.abs(targetProgress - currentProgress) < SNAP) {
        currentProgress = targetProgress;
      }

      applyProgress(currentProgress);

      if (ctx && typeof drawParticles === 'function') {
        drawParticles(currentProgress);
      }

      rafId = requestAnimationFrame(rafLoop);
    }

    rafId = requestAnimationFrame(rafLoop);

    // Immediate handler for zero-lag touch scrolling on mobile
    function onImmediateScroll() {
      targetProgress = computeProgress();
      currentProgress = targetProgress;
      applyProgress(currentProgress);
    }

    window.addEventListener('scroll', onImmediateScroll, { passive: true });
    window.addEventListener('touchmove', onImmediateScroll, { passive: true });

    // ==========================================================================
    // 5. NAVIGATION CONTROLS (Dots & Jump)
    // ==========================================================================
    const stepTargetProgress = [
      0.00,  // 0: Void
      0.15,  // 1: D
      0.31,  // 2: DIGIOLIC
      0.48,  // 3: G
      0.64,  // 4: Zoho
      0.78,  // 5: Salesforce
      0.93   // 6: Marketing
    ];

    function scrollToProgress(pTarget) {
      const trackHeight = track.offsetHeight;
      const viewportHeight = window.innerHeight;
      const scrollDistance = trackHeight - viewportHeight;
      const trackTop = track.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);

      window.scrollTo({
        top: trackTop + scrollDistance * pTarget,
        behavior: 'smooth',
      });
    }

    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const stepIdx = parseInt(dot.getAttribute('data-step') || '0', 10);
        if (stepIdx >= 0 && stepIdx < stepTargetProgress.length) {
          scrollToProgress(stepTargetProgress[stepIdx]);
        }
      });
    });

    if (jumpBtn) {
      jumpBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const p = computeProgress();
        let nextIdx = 1;
        for (let i = 0; i < stepTargetProgress.length; i++) {
          if (stepTargetProgress[i] > p + 0.05) {
            nextIdx = i;
            break;
          }
          if (i === stepTargetProgress.length - 1) {
            nextIdx = -1;
          }
        }

        if (nextIdx !== -1) {
          scrollToProgress(stepTargetProgress[nextIdx]);
        } else {
          const metrics = document.getElementById('metricsSection');
          if (metrics) {
            metrics.scrollIntoView({ behavior: 'smooth' });
          } else {
            scrollToProgress(1.0);
          }
        }
      });
    }

    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const metrics = document.getElementById('metricsSection');
        if (metrics) {
          metrics.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof window.openCinematicMenu === 'function') {
          window.openCinematicMenu();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCinematicStory);
  } else {
    initCinematicStory();
  }
})();
