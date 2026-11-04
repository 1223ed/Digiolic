/**
 * DIGIOLIC — HIGH-PERFORMANCE HERO CANVAS SCROLL ENGINE
 * Dual-Direction Scrub (L-to-R Forward & R-to-L Reverse)
 * Progressive 60FPS Frame Loading, Dynamic DPR Caching, Lerp Inertia
 */

(function () {
  'use strict';

  // Configuration
  const TOTAL_FRAMES = 300;
  const PRIMARY_FRAME_PREFIX = 'assets/hero-frames/frame-';
  const PRIMARY_FRAME_EXT = '.webp';
  const BATCH_SIZE = 15;

  // Chapter Milestones (normalized 0.0 to 1.0)
  const CHAPTERS = [
    { id: 0, progress: 0.0, name: 'Digiolic Intro', frame: 0 },
    { id: 1, progress: 0.30, name: 'BIC Partnership', frame: 89 },
    { id: 2, progress: 0.65, name: 'Saint Laurent', frame: 194 },
    { id: 3, progress: 0.92, name: 'Groupauto', frame: 275 },
  ];

  // DOM Elements
  const wrapper = document.getElementById('heroScrollWrapper');
  const stage = document.getElementById('heroStickyStage');
  const canvas = document.getElementById('heroCanvas');
  const loader = document.getElementById('heroCanvasLoader');
  const loaderFill = document.getElementById('heroLoaderFill');
  const directionHud = document.getElementById('heroDirectionHud');
  const directionText = document.getElementById('heroDirectionText');
  const timelineFill = document.getElementById('heroTimelineFill');
  const timelinePercent = document.getElementById('heroTimelinePercent');
  const timelineTrack = document.getElementById('heroTimelineTrack');
  const scrollCue = document.getElementById('heroScrollCue');
  const prevBtn = document.getElementById('heroArrowPrev');
  const nextBtn = document.getElementById('heroArrowNext');
  const chapterBtns = document.querySelectorAll('.hero-chapter-btn');

  if (!wrapper || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  if (!ctx) return;

  // State
  const images = new Map(); // frameIndex -> HTMLImageElement
  let currentProgress = 0;
  let targetProgress = 0;
  let currentFrameIndex = 0;
  let loadedCount = 0;
  let isInitialLoaded = false;
  let lastScrollY = window.scrollY || 0;
  let scrollDirection = 'idle'; // 'L-R', 'R-L', 'idle'
  let directionTimeout = null;
  let _rafId = null;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartProgress = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let dpr = 1;

  /**
   * Resolve frame URL (Primary WebP with fallback to raw frames)
   */
  function getFrameUrl(index) {
    const padded = String(index + 1).padStart(4, '0');
    return `${PRIMARY_FRAME_PREFIX}${padded}${PRIMARY_FRAME_EXT}`;
  }

  /**
   * Fallback URL from original assets/111111 and assets/22222 folders
   */
  function getRawFallbackUrl(index) {
    const globalIdx = Math.round((index / (TOTAL_FRAMES - 1)) * 1570);
    if (globalIdx <= 880) {
      const p = String(globalIdx + 1).padStart(4, '0');
      return `assets/111111/frame-${p}.png`;
    } else {
      const p = String(globalIdx - 880 + 1).padStart(4, '0');
      return `assets/22222/frame-${p}.png`;
    }
  }

  /**
   * Resize Canvas according to Device Pixel Ratio and Viewport
   */
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvasWidth = rect.width;
    canvasHeight = rect.height;

    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);

    renderFrame(currentFrameIndex);
  }

  /**
   * Draw the image on canvas centered with cover aspect ratio math
   */
  function drawCoverImage(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const imgRatio = iw / ih;
    const canvasRatio = cw / ch;

    let rw, rh, ox, oy;

    if (canvasRatio > imgRatio) {
      rw = cw;
      rh = cw / imgRatio;
      ox = 0;
      oy = (ch - rh) / 2;
    } else {
      rh = ch;
      rw = ch * imgRatio;
      ox = (cw - rw) / 2;
      oy = 0;
    }

    ctx.drawImage(img, Math.round(ox), Math.round(oy), Math.round(rw), Math.round(rh));
  }

  /**
   * Render a specific frame index with zero-flicker neighbor lookup
   */
  function renderFrame(index) {
    const img = images.get(index);
    if (img && img.complete && img.naturalWidth > 0) {
      drawCoverImage(img);
    } else {
      // Find closest already-decoded frame
      let fallbackIndex = index;
      for (let offset = 1; offset < 24; offset++) {
        const left = index - offset;
        const right = index + offset;
        if (left >= 0 && images.has(left) && images.get(left).complete) {
          fallbackIndex = left;
          break;
        }
        if (right < TOTAL_FRAMES && images.has(right) && images.get(right).complete) {
          fallbackIndex = right;
          break;
        }
      }
      const fallbackImg = images.get(fallbackIndex);
      if (fallbackImg && fallbackImg.complete) {
        drawCoverImage(fallbackImg);
      }
    }
  }

  /**
   * Asynchronously load and decode an image frame
   */
  async function loadFrame(index) {
    if (images.has(index)) return images.get(index);

    const img = new Image();
    img.src = getFrameUrl(index);
    images.set(index, img);

    try {
      if ('decode' in img) {
        await img.decode();
      } else {
        await new Promise((res, rej) => {
          img.onload = res;
          img.onerror = rej;
        });
      }
    } catch {
      // Fallback to raw PNG if WebP fails
      img.src = getRawFallbackUrl(index);
      try {
        if ('decode' in img) await img.decode();
      } catch {}
    }

    loadedCount++;
    updateLoaderProgress();
    return img;
  }

  /**
   * Update initial loading UI
   */
  function updateLoaderProgress() {
    const percent = Math.min(Math.round((loadedCount / 30) * 100), 100);
    if (loaderFill) {
      loaderFill.style.width = `${percent}%`;
    }

    // Dismiss loader as soon as the first 10 frames are ready (<200ms)
    if (!isInitialLoaded && loadedCount >= 8) {
      isInitialLoaded = true;
      if (loader) {
        loader.classList.add('is-hidden');
      }
      renderFrame(0);
    }
  }

  /**
   * Progressive Loader Queue
   */
  async function startProgressiveLoad() {
    // Step 1: Eagerly load Frame 0 immediately
    const firstImg = await loadFrame(0);
    drawCoverImage(firstImg);

    // Step 2: Eagerly load milestone keyframes across the sequence
    const keyframes = [0, 45, 90, 135, 180, 225, 270, 299];
    await Promise.all(keyframes.map(idx => loadFrame(idx)));

    // Step 3: Stream in frames spaced every 4th frame for instant scrub coverage
    const streamPhase1 = [];
    for (let i = 0; i < TOTAL_FRAMES; i += 4) {
      if (!images.has(i)) streamPhase1.push(i);
    }
    for (let i = 0; i < streamPhase1.length; i += BATCH_SIZE) {
      const batch = streamPhase1.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(idx => loadFrame(idx)));
    }

    // Step 4: Stream in all remaining frames in idle time
    const remaining = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!images.has(i)) remaining.push(i);
    }

    const loadIdleBatch = () => {
      if (remaining.length === 0) {
        if (loader) loader.classList.add('is-hidden');
        return;
      }
      const batch = remaining.splice(0, BATCH_SIZE);
      Promise.all(batch.map(idx => loadFrame(idx))).then(() => {
        if (window.requestIdleCallback) {
          window.requestIdleCallback(loadIdleBatch, { timeout: 250 });
        } else {
          setTimeout(loadIdleBatch, 16);
        }
      });
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(loadIdleBatch, { timeout: 250 });
    } else {
      setTimeout(loadIdleBatch, 30);
    }
  }

  /**
   * Set Direction HUD Badge (L-to-R or R-to-L)
   */
  function setDirection(dir) {
    scrollDirection = dir;
    if (!directionHud || !directionText) return;

    directionHud.classList.remove('is-lr', 'is-rl', 'is-idle');

    if (dir === 'L-R') {
      directionHud.classList.add('is-lr');
      directionText.textContent = '▶ L → R (Forward)';
    } else if (dir === 'R-L') {
      directionHud.classList.add('is-rl');
      directionText.textContent = '◀ R ← L (Reverse)';
    } else {
      directionHud.classList.add('is-idle');
      directionText.textContent = '↕ Scroll (L-R · R-L)';
    }

    clearTimeout(directionTimeout);
    directionTimeout = setTimeout(() => {
      directionHud.classList.remove('is-lr', 'is-rl');
      directionHud.classList.add('is-idle');
      directionText.textContent = '↕ Scroll (L-R · R-L)';
    }, 1400);
  }

  /**
   * Synchronize scroll position with target progress and track direction
   */
  function handleScroll() {
    const currentY = window.scrollY || window.pageYOffset || 0;
    const deltaY = currentY - lastScrollY;
    lastScrollY = currentY;

    if (Math.abs(deltaY) > 1.5) {
      if (deltaY > 0) {
        setDirection('L-R');
      } else {
        setDirection('R-L');
      }
    }

    const rect = wrapper.getBoundingClientRect();
    const scrollDistance = wrapper.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) return;

    const rawProgress = -rect.top / scrollDistance;
    targetProgress = Math.max(0, Math.min(1, rawProgress));

    // Hide scroll cue after initial scroll
    if (scrollCue) {
      if (targetProgress > 0.05) {
        scrollCue.classList.add('is-hidden');
      } else {
        scrollCue.classList.remove('is-hidden');
      }
    }
  }

  /**
   * Smooth Lerp RAF Animation Loop
   */
  function loop() {
    // Lerp progress for fluid momentum
    const diff = targetProgress - currentProgress;
    if (Math.abs(diff) > 0.0004) {
      currentProgress += diff * 0.18;
    } else {
      currentProgress = targetProgress;
    }

    // Convert progress to target frame index
    const newFrameIndex = Math.min(
      Math.floor(currentProgress * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    );

    if (newFrameIndex !== currentFrameIndex) {
      currentFrameIndex = newFrameIndex;
      renderFrame(currentFrameIndex);
    }

    // Update bottom timeline fill and percentage
    const pct = Math.round(currentProgress * 100);
    if (timelineFill) {
      timelineFill.style.width = `${currentProgress * 100}%`;
    }
    if (timelinePercent) {
      timelinePercent.textContent = `${String(pct).padStart(2, '0')}%`;
    }

    // Update Chapter Navigator Active State
    let activeChapter = 0;
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (currentProgress >= CHAPTERS[i].progress - 0.08) {
        activeChapter = i;
        break;
      }
    }

    chapterBtns.forEach((btn, idx) => {
      if (idx === activeChapter) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    _rafId = requestAnimationFrame(loop);
  }

  /**
   * Smoothly scroll to a designated normalized progress target
   */
  function scrollToProgress(p, directionLabel) {
    p = Math.max(0, Math.min(1, p));
    if (directionLabel) setDirection(directionLabel);

    const scrollDistance = wrapper.offsetHeight - window.innerHeight;
    const targetScrollY = wrapper.offsetTop + p * scrollDistance;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  }

  // Prev Button (R-L Scrub backward)
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToProgress(targetProgress - 0.25, 'R-L');
    });
  }

  // Next Button (L-R Scrub forward)
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToProgress(targetProgress + 0.25, 'L-R');
    });
  }

  // Chapter Buttons Click Navigation
  chapterBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const chapterIdx = parseInt(btn.getAttribute('data-chapter'), 10);
      const ch = CHAPTERS[chapterIdx];
      if (ch) {
        const dir = ch.progress > targetProgress ? 'L-R' : 'R-L';
        scrollToProgress(ch.progress, dir);
      }
    });
  });

  // Timeline Click / Scrub
  if (timelineTrack) {
    timelineTrack.addEventListener('click', (e) => {
      const rect = timelineTrack.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const dir = clickRatio > targetProgress ? 'L-R' : 'R-L';
      scrollToProgress(clickRatio, dir);
    });
  }

  // Keyboard Arrow Navigation (← / ↑ for R-L, → / ↓ for L-R)
  window.addEventListener('keydown', (e) => {
    const isHeroVisible =
      window.scrollY < wrapper.offsetTop + wrapper.offsetHeight &&
      window.scrollY + window.innerHeight > wrapper.offsetTop;

    if (!isHeroVisible) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      scrollToProgress(targetProgress + 0.08, 'L-R');
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      scrollToProgress(targetProgress - 0.08, 'R-L');
    }
  });

  // Touch Swipe & Mouse Drag Horizontal Scrub
  if (stage) {
    stage.addEventListener('mousedown', (e) => {
      // Don't trigger on interactive buttons/nav
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.hero-timeline-track')) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartProgress = targetProgress;
      stage.classList.add('is-grabbing');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const progressDelta = -dx / (window.innerWidth * 0.75);
      const newP = Math.max(0, Math.min(1, dragStartProgress + progressDelta));
      setDirection(dx < 0 ? 'L-R' : 'R-L');
      scrollToProgress(newP, dx < 0 ? 'L-R' : 'R-L');
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        stage.classList.remove('is-grabbing');
      }
    });

    // Touch events for mobile swiping
    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        dragStartX = e.touches[0].clientX;
        dragStartProgress = targetProgress;
      }
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - dragStartX;
        if (Math.abs(dx) > 12) {
          setDirection(dx < 0 ? 'L-R' : 'R-L');
        }
      }
    }, { passive: true });
  }

  // Reduced Motion Accessibility
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    if (loader) loader.classList.add('is-hidden');
    loadFrame(0).then(() => renderFrame(0));
    return;
  }

  // Event Listeners
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initialization
  resizeCanvas();
  handleScroll();
  startProgressiveLoad();
  loop();
})();
