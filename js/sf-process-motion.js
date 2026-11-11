/**
 * ==========================================================================
 * SALESFORCE IMPLEMENTATION BUILT AROUND YOUR BUSINESS (#processSection)
 * HeartX Editorial Pixel-Grid Reveal, Hover Wipe & Scroll Parallax Engine
 * Reference: Screen Recording 2026-11-11 at 11.23.43 AM.mov
 *
 * Behavior:
 * 1. Builds a responsive diagonal square-tile overlay (.sf-hx-tile-grid) for
 *    each phase card with staggered --in-delay (top-left -> bottom-right) and
 *    reversed --out-delay (bottom-right -> top-left).
 * 2. Scroll Reveal: Cards enter sealed behind the pixel grid with the top-right
 *    + box rotated to 90deg; as each card crosses into viewport, the diagonal
 *    pixel grid wipes clear and the + box unwinds to 0deg.
 * 3. Scroll Parallax & HUD Tracker: Updates subtle column/image parallax via
 *    CSS custom properties (--sf-card-parallax, --sf-img-parallax) on desktop
 *    and keeps the sticky Progress HUD synced with the active card (01..07).
 * 4. Interactive Hover / Focus / Touch: Runs the exact forward/reverse diagonal
 *    pixel-tile wipe and smooth 0deg <-> 90deg + box rotation (45deg diamond
 *    mid-spin). Honors prefers-reduced-motion cleanly.
 * ==========================================================================
 */

(function () {
  'use strict';

  function initHeartxProcess() {
    const section = document.getElementById('processSection');
    if (!section) return;

    const cards = Array.from(section.querySelectorAll('.sf-hx-card'));
    if (!cards.length) return;

    const hudCountEl = section.querySelector('.sf-hx-hud-current');
    const hudNameEl = section.querySelector('.sf-hx-hud-name');
    const hudFillEl = section.querySelector('.sf-hx-hud-fill');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 991px)');

    function prefersReducedMotion() {
      return reducedMotionQuery.matches;
    }

    function getGridSpec(card) {
      if (mobileQuery.matches) {
        return { cols: 7, rows: 5 };
      }
      if (card.id === 'sfProcessCard7') {
        return { cols: 14, rows: 7 };
      }
      return { cols: 10, rows: 7 };
    }

    /**
     * Populates staggered pixel tiles matching the current responsive grid.
     */
    function buildTileGrids() {
      cards.forEach((card) => {
        const container = card.querySelector('.sf-hx-tile-grid');
        if (!container) return;

        const { cols, rows } = getGridSpec(card);
        const key = `${cols}x${rows}`;
        if (container.dataset.gridKey === key && container.childElementCount === cols * rows) {
          return;
        }

        container.dataset.gridKey = key;
        const fragment = document.createDocumentFragment();
        const maxCol = Math.max(cols - 1, 1);
        const maxRow = Math.max(rows - 1, 1);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const tile = document.createElement('span');
            tile.className = 'sf-hx-tile';

            // Diagonal wave factor: top-left (0,0) -> bottom-right (1,1)
            const normDiag = (c / maxCol) * 0.58 + (r / maxRow) * 0.42;
            const inDelayMs = Math.round(normDiag * 260);
            const outDelayMs = Math.round((1 - normDiag) * 240);

            tile.style.setProperty('--in-delay', `${inDelayMs}ms`);
            tile.style.setProperty('--out-delay', `${outDelayMs}ms`);
            fragment.appendChild(tile);
          }
        }

        container.replaceChildren(fragment);
      });
    }

    /**
     * Marks offscreen cards below the viewport fold as sealed so scrolling down
     * triggers their diagonal pixel-wipe reveal smoothly.
     */
    function seedInitialScrollCurtains() {
      if (prefersReducedMotion()) {
        cards.forEach((c) => c.classList.remove('is-scroll-sealed'));
        return;
      }

      const foldThreshold = window.innerHeight * 0.92;
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.top > foldThreshold) {
          card.classList.add('is-scroll-sealed');
        }
      });
    }

    function setupScrollRevealObserver() {
      if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
        cards.forEach((c) => c.classList.remove('is-scroll-sealed'));
        return null;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove('is-scroll-sealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          root: null,
          rootMargin: '0px 0px -10% 0px',
          threshold: 0.08
        }
      );

      cards.forEach((card) => {
        if (card.classList.contains('is-scroll-sealed')) {
          observer.observe(card);
        }
      });

      return observer;
    }

    let rafPending = false;
    let activeCardIndex = 0;

    function updateScrollPhysicsAndHud() {
      rafPending = false;

      const vh = window.innerHeight || 900;
      const isDesktop = !mobileQuery.matches;
      const reduceMotion = prefersReducedMotion();
      const targetCenterY = vh * 0.36;

      let closestIdx = 0;
      let closestDist = Infinity;

      cards.forEach((card, idx) => {
        const rect = card.getBoundingClientRect();
        const cardCenterY = rect.top + rect.height * 0.5;
        const dist = Math.abs(cardCenterY - targetCenterY);

        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }

        // Fallback reveal safety if observer didn't fire during rapid jumps
        if (!reduceMotion && card.classList.contains('is-scroll-sealed') && rect.top <= vh * 0.90) {
          card.classList.remove('is-scroll-sealed');
        }

        if (!isDesktop || reduceMotion) {
          card.style.removeProperty('--sf-card-parallax');
          card.style.removeProperty('--sf-img-parallax');
          return;
        }

        // Normalized position [-1..1] relative to viewport center
        const normY = Math.max(-1.2, Math.min(1.2, (cardCenterY - vh * 0.5) / (vh * 0.75)));
        const colSign = idx % 2 === 0 ? -1 : 1;
        const cardShiftPx = (-normY * 14 * colSign).toFixed(1);
        const imgShiftPct = (-4 + normY * 3.5).toFixed(2);

        card.style.setProperty('--sf-card-parallax', `${cardShiftPx}px`);
        card.style.setProperty('--sf-img-parallax', `${imgShiftPct}%`);
      });

      const firstRect = cards[0] ? cards[0].getBoundingClientRect() : null;
      if (firstRect && firstRect.top >= -40 && firstRect.top <= vh * 0.35) {
        closestIdx = 0;
      }

      if (closestIdx !== activeCardIndex || !updateScrollPhysicsAndHud.initialized) {
        activeCardIndex = closestIdx;
        updateScrollPhysicsAndHud.initialized = true;

        const activeCard = cards[activeCardIndex];
        const phaseNum = String(activeCardIndex + 1).padStart(2, '0');
        const titleEl = activeCard.querySelector('.sf-play-card-title');

        if (hudCountEl) hudCountEl.textContent = phaseNum;
        if (hudNameEl && titleEl) hudNameEl.textContent = titleEl.textContent.trim();
        if (hudFillEl) {
          const ratio = (activeCardIndex + 1) / cards.length;
          hudFillEl.style.transform = `scaleX(${ratio.toFixed(4)})`;
        }
      }
    }

    function scheduleScrollUpdate() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(updateScrollPhysicsAndHud);
    }

    function setupInteractions() {
      const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      cards.forEach((card) => {
        card.addEventListener('pointerenter', (e) => {
          if (e.pointerType !== 'touch' && canHover) {
            card.classList.remove('is-scroll-sealed');
            card.classList.add('is-hx-active');
          }
        });

        card.addEventListener('pointerleave', (e) => {
          if (e.pointerType !== 'touch' && canHover) {
            card.classList.remove('is-hx-active');
          }
        });

        // Touch / click toggle so mobile visitors can play the pixel wipe on tap
        card.addEventListener('click', (e) => {
          if (e.target && e.target.closest('a')) return;
          if (!canHover || mobileQuery.matches) {
            const wasActive = card.classList.contains('is-hx-active');
            cards.forEach((c) => c.classList.remove('is-hx-active'));
            if (!wasActive) {
              card.classList.remove('is-scroll-sealed');
              card.classList.add('is-hx-active');
            }
          }
        });
      });
    }

    buildTileGrids();
    seedInitialScrollCurtains();
    setupScrollRevealObserver();
    setupInteractions();
    updateScrollPhysicsAndHud();

    window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
    window.addEventListener('resize', () => {
      buildTileGrids();
      scheduleScrollUpdate();
    }, { passive: true });

    reducedMotionQuery.addEventListener('change', () => {
      if (prefersReducedMotion()) {
        cards.forEach((c) => {
          c.classList.remove('is-scroll-sealed', 'is-hx-active');
        });
      }
      scheduleScrollUpdate();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeartxProcess);
  } else {
    initHeartxProcess();
  }
})();
