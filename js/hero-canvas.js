/**
 * DIGIOLIC — HERO CANVAS SCROLL ENGINE
 * Progressive Frame Loading, Dynamic DPR Caching, requestAnimationFrame Scroll Sync
 */

(function () {
  'use strict';

  // Configuration
  const TOTAL_FRAMES = 240;
  const FRAME_PREFIX = 'assets/frames/hero/frame-';
  const FRAME_EXT = '.png';
  const BATCH_SIZE = 12; // Decode in progressive chunks

  // DOM Elements
  const wrapper = document.getElementById('heroScrollWrapper');
  const canvas = document.getElementById('heroCanvas');
  const loader = document.getElementById('heroLoader');
  const loaderFill = document.getElementById('heroLoaderFill');
  const scrollIndicator = document.getElementById('heroScrollIndicator');
  const storyBeats = document.querySelectorAll('.hero-beat');
  const beatDots = document.querySelectorAll('.hero-beat-dot');

  if (!wrapper || !canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  // State
  const images = new Map(); // frameIndex -> HTMLImageElement
  let currentFrameIndex = 0;
  let targetFrameIndex = 0;
  let loadedCount = 0;
  let isInitialLoaded = false;
  let _rafId = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let dpr = 1;

  /**
   * Format index to 4-digit frame name e.g. 1 -> 0001
   */
  function getFrameUrl(index) {
    const padded = String(index + 1).padStart(4, '0');
    return `${FRAME_PREFIX}${padded}${FRAME_EXT}`;
  }

  /**
   * Resize Canvas according to Device Pixel Ratio and Viewport
   */
  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for mobile memory performance
    const rect = canvas.getBoundingClientRect();
    canvasWidth = rect.width;
    canvasHeight = rect.height;

    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);

    renderFrame(currentFrameIndex);
  }

  /**
   * Draw the image on canvas centered with 'cover' aspect ratio math
   */
  function drawCoverImage(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const imgRatio = imgW / imgH;
    const canvasRatio = w / h;

    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderW = w;
      renderH = w / imgRatio;
      offsetX = 0;
      offsetY = (h - renderH) / 2;
    } else {
      renderH = h;
      renderW = h * imgRatio;
      offsetX = (w - renderW) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }

  /**
   * Render a specific frame index
   */
  function renderFrame(index) {
    const img = images.get(index);
    if (img && img.complete) {
      drawCoverImage(img);
    } else {
      // Find closest loaded frame for zero flickering
      let fallbackIndex = index;
      for (let offset = 1; offset < 20; offset++) {
        if (images.has(index - offset) && images.get(index - offset).complete) {
          fallbackIndex = index - offset;
          break;
        }
        if (images.has(index + offset) && images.get(index + offset).complete) {
          fallbackIndex = index + offset;
          break;
        }
      }
      const fallbackImg = images.get(fallbackIndex);
      if (fallbackImg) drawCoverImage(fallbackImg);
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
      // Decode fallback
    }

    loadedCount++;
    updateLoaderProgress();
    return img;
  }

  /**
   * Update initial loading UI
   */
  function updateLoaderProgress() {
    const percent = Math.min(Math.round((loadedCount / (TOTAL_FRAMES * 0.35)) * 100), 100);
    if (loaderFill) {
      loaderFill.style.width = `${percent}%`;
    }

    // Hide loader once the first 35% of frames (or frame 0) are ready
    if (!isInitialLoaded && loadedCount >= Math.min(25, TOTAL_FRAMES)) {
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
    // Step 1: Load First Frame Immediately
    const firstImg = await loadFrame(0);
    drawCoverImage(firstImg);

    // Step 2: Eagerly load keyframes every 4th frame for instant scrub response
    const keyframeIndices = [];
    for (let i = 0; i < TOTAL_FRAMES; i += 4) {
      keyframeIndices.push(i);
    }

    for (let i = 0; i < keyframeIndices.length; i += BATCH_SIZE) {
      const batch = keyframeIndices.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map((idx) => loadFrame(idx)));
    }

    // Step 3: Load all remaining intermediate frames in idle time
    const remaining = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      if (!images.has(i)) remaining.push(i);
    }

    for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
      const batch = remaining.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map((idx) => loadFrame(idx)));
    }

    // Fully loaded
    if (loader) loader.classList.add('is-hidden');
  }

  /**
   * Calculate Scroll Progress and Sync Frame + Story Beats
   */
  function updateScroll() {
    const rect = wrapper.getBoundingClientRect();
    const scrollDistance = wrapper.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) return;

    // Progress from 0.0 to 1.0
    const rawProgress = -rect.top / scrollDistance;
    const progress = Math.max(0, Math.min(1, rawProgress));

    // Target frame index
    targetFrameIndex = Math.min(Math.floor(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

    // Story Beats Transition Logic
    let activeBeat = 0;
    if (progress < 0.32) {
      activeBeat = 0;
    } else if (progress < 0.68) {
      activeBeat = 1;
    } else {
      activeBeat = 2;
    }

    storyBeats.forEach((beat, idx) => {
      if (idx === activeBeat) {
        beat.classList.add('is-active');
      } else {
        beat.classList.remove('is-active');
      }
    });

    beatDots.forEach((dot, idx) => {
      if (idx === activeBeat) {
        dot.classList.add('is-active');
      } else {
        dot.classList.remove('is-active');
      }
    });

    // Hide scroll prompt once user starts scrolling
    if (scrollIndicator) {
      if (progress > 0.08) {
        scrollIndicator.classList.add('is-hidden');
      } else {
        scrollIndicator.classList.remove('is-hidden');
      }
    }
  }

  /**
   * requestAnimationFrame Render Loop
   */
  function loop() {
    if (currentFrameIndex !== targetFrameIndex) {
      currentFrameIndex = targetFrameIndex;
      renderFrame(currentFrameIndex);
    }
    _rafId = requestAnimationFrame(loop);
  }

  // Clickable Beat Dots Navigation
  beatDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetBeat = parseInt(dot.getAttribute('data-beat'), 10);
      const scrollDistance = wrapper.offsetHeight - window.innerHeight;
      const targetScroll = wrapper.offsetTop + (targetBeat / 2) * scrollDistance;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });

  // Reduced Motion Check
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    if (loader) loader.classList.add('is-hidden');
    loadFrame(0).then(() => renderFrame(0));
    return;
  }

  // Listeners
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', updateScroll, { passive: true });

  // Init
  resizeCanvas();
  updateScroll();
  startProgressiveLoad();
  loop();
})();
