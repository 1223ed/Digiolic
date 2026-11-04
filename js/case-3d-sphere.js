/**
 * ==========================================================================
 * DIGIOLIC CASE STUDIES — 3D CONCAVE DOME SHOWCASE
 * Exact replication of the iconic Squarespace 3D Curved Showcase Wall:
 * - 3-tier concave spherical/cylindrical amphitheater dome curved toward camera
 * - Pure black canvas with stationary serif center typography ("Transformed with Digiolic.")
 * - Center slot in middle row is kept open to perfectly frame the typography
 * - Top row cards tilt downward toward center (-13.5deg)
 * - Bottom row cards tilt upward toward center (+13.5deg)
 * - Side cards curve forward and angle inward facing the viewer
 * - Strictly the 10 client companies (Monster India, FYX Finance, Verzeo,
 *   Banaraswala, NZ Immigration, Greenworld, Pierian, Blume Labs, Loom Crafts,
 *   Chanakya University)
 * - 60fps GPU-accelerated CSS 3D translate3d transforms
 * - Interactive pointer & touch drag orbit with momentum physics
 * - Ambient continuous idle drift & hover elevation with white pill badge
 * - Case study modal click trigger & Category filter tabs
 * ==========================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init3DConcaveDome);

  function init3DConcaveDome() {
    const section = document.getElementById('cs3DShowcaseSection');
    const cylinder = document.getElementById('cs3DCylinder');
    if (!section || !cylinder) return;

    // Base cards defined in HTML
    const baseCards = Array.from(cylinder.querySelectorAll('.cs-3d-card-item'));
    if (baseCards.length === 0) return;

    // Reset cylinder transform so cards position relative to 3D world origin
    cylinder.style.transform = 'none';

    // Dynamic columns around 360 deg based on card count
    const TOTAL_COLS = baseCards.length;
    const ANGLE_STEP = 360 / TOTAL_COLS;

    // Clone cards to populate a dense 3 rows x TOTAL_COLS dome
    // Row -1: Top, Row 0: Middle, Row 1: Bottom
    cylinder.innerHTML = '';
    const allCards = [];

    for (let row = -1; row <= 1; row++) {
      for (let col = 0; col < TOTAL_COLS; col++) {
        // Offset clients per row to create visual variety across columns
        const offset = (row === -1) ? 4 : (row === 0 ? 0 : 7);
        const baseIndex = (col + offset) % baseCards.length;
        const card = baseCards[baseIndex].cloneNode(true);

        card.dataset.col = col;
        card.dataset.row = row;
        card.dataset.baseAngle = col * ANGLE_STEP;

        cylinder.appendChild(card);
        allCards.push(card);
      }
    }

    // --- RESPONSIVE DOME GEOMETRY CONFIGURATION ---
    function getDomeConfig() {
      const w = window.innerWidth;
      if (w < 768) {
        return { R: 480, rowH: 138, pitch: 11.5, curveK: 0.75 };
      }
      if (w < 1024) {
        return { R: 640, rowH: 165, pitch: 12, curveK: 0.78 };
      }
      if (w < 1440) {
        return { R: 780, rowH: 195, pitch: 12.5, curveK: 0.82 };
      }
      return { R: 820, rowH: 202, pitch: 12.5, curveK: 0.82 };
    }

    let cfg = getDomeConfig();
    window.addEventListener('resize', () => {
      cfg = getDomeConfig();
    }, { passive: true });

    // --- PHYSICS & MOMENTUM DRAG ENGINE ---
    let rotY = 0;
    let targetRotY = 0;
    let velY = 0;

    let isPointerDown = false;
    let startX = 0;
    let lastX = 0;
    let hasDragged = false;
    const DRAG_THRESHOLD = 6; // px

    let isAnyHovered = false;
    let activeFilter = 'all';

    // Renders the concave amphitheater dome based on current rotation angle
    function renderDome(currentRotY) {
      for (let i = 0; i < allCards.length; i++) {
        const card = allCards[i];
        const baseAngle = parseFloat(card.dataset.baseAngle);
        const row = parseInt(card.dataset.row, 10);

        let alpha = ((baseAngle + currentRotY + 180) % 360) - 180;
        if (alpha < -180) alpha += 360;

        // Visibility cull: hide cards outside front viewing arc (-95 deg to +95 deg)
        if (Math.abs(alpha) > 95) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          continue;
        }

        // Center cutout: middle row card directly behind center text is hidden
        if (row === 0 && Math.abs(alpha) < 22) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          continue;
        }

        // Concave 3D Geometry
        const alphaRad = alpha * (Math.PI / 180);
        const x = cfg.R * Math.sin(alphaRad);
        // Concave depth: center has z=0, sides curve forward towards the camera (z > 0)
        let z = cfg.R * (1 - Math.cos(alphaRad)) * cfg.curveK;
        const y = row * cfg.rowH;

        // Card Orientation: faces inward toward the viewer & center
        const rotCardY = -alpha * 0.88;
        const rotCardX = row * cfg.pitch;

        const isHovered = card.classList.contains('is-hovered');
        if (isHovered) {
          z += 42;
        }
        const scale = isHovered ? 1.06 : 1.0;

        // Smooth edge fade
        let opacity = 1;
        if (Math.abs(alpha) > 65) {
          opacity = 1 - ((Math.abs(alpha) - 65) / 30);
        }

        if (card.classList.contains('is-dimmed')) {
          opacity *= 0.2;
        }

        card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotCardY.toFixed(1)}deg) rotateX(${rotCardX.toFixed(1)}deg) scale(${scale})`;
        card.style.opacity = Math.max(0, opacity).toFixed(2);
        card.style.pointerEvents = 'auto';
        card.style.zIndex = isHovered ? 9999 : Math.round(z + 100);
      }
    }

    // Animation frame loop
    function updatePhysics() {
      if (!isPointerDown) {
        // Continuous gentle auto-orbit when not interacting
        if (!isAnyHovered) {
          targetRotY += 0.026;
        }

        // Apply friction to velocity
        velY *= 0.94;
        targetRotY += velY;
      }

      // Smooth lerp easing
      rotY += (targetRotY - rotY) * 0.12;

      renderDome(rotY);

      requestAnimationFrame(updatePhysics);
    }

    requestAnimationFrame(updatePhysics);

    // --- POINTER / MOUSE DRAG HANDLERS ---
    section.addEventListener('pointerdown', (e) => {
      // Don't drag if clicking controls or buttons
      if (e.target.closest('button') || e.target.closest('.cs-3d-filter-pills') || e.target.closest('.cs-3d-view-toggle')) {
        return;
      }

      isPointerDown = true;
      hasDragged = false;
      startX = e.clientX;
      lastX = e.clientX;
      velY = 0;

      section.classList.add('is-dragging');
    });

    window.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;

      const dx = e.clientX - lastX;
      const totalDist = Math.abs(e.clientX - startX);

      if (totalDist > DRAG_THRESHOLD) {
        hasDragged = true;
      }

      const sensitivityX = 0.26;
      targetRotY += dx * sensitivityX;
      velY = dx * sensitivityX;

      lastX = e.clientX;
    });

    window.addEventListener('pointerup', () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      section.classList.remove('is-dragging');
    });

    window.addEventListener('pointercancel', () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      section.classList.remove('is-dragging');
    });

    // --- CARD HOVER & CLICK ACTIONS ---
    allCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        isAnyHovered = true;
        card.classList.add('is-hovered');
      });

      card.addEventListener('mouseleave', () => {
        isAnyHovered = false;
        card.classList.remove('is-hovered');
      });

      card.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        const caseId = card.getAttribute('data-case-id');
        if (caseId) {
          openCaseStudyModal(caseId);
        }
      });
    });

    // --- MODAL TRIGGER HELPER ---
    function openCaseStudyModal(caseId) {
      if (caseId === 'case-greenworld') caseId = 'case-rahul-hr';
      if (caseId === 'case-pierian') caseId = 'case-manu-company';
      if (typeof window.openCaseStudyModal === 'function') {
        window.openCaseStudyModal(caseId);
        return;
      }
      const modalBtn = document.querySelector(`.js-open-case-modal[data-case-id="${caseId}"]`);
      if (modalBtn) {
        modalBtn.click();
      } else if (typeof window.triggerCaseModalById === 'function') {
        window.triggerCaseModalById(caseId);
      }
    }

    // --- NAVIGATION ARROW BUTTONS (ORBIT STEPPING) ---
    const prevBtn = document.getElementById('cs3DPrevBtn');
    const nextBtn = document.getElementById('cs3DNextBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        targetRotY += ANGLE_STEP; // Orbit to next column
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        targetRotY -= ANGLE_STEP; // Orbit to previous column
      });
    }

    // --- CATEGORY FILTER TABS ---
    const filterBtns = Array.from(document.querySelectorAll('.cs-3d-filter-btn'));
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        activeFilter = btn.getAttribute('data-filter') || 'all';
        applyCategoryFilter(activeFilter);
      });
    });

    function applyCategoryFilter(filter) {
      let firstMatchedAngle = null;

      allCards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        const isMatch = filter === 'all' || cat.includes(filter);

        if (isMatch) {
          card.classList.remove('is-dimmed');
          if (filter !== 'all') {
            card.classList.add('is-matched');
          } else {
            card.classList.remove('is-matched');
          }

          if (firstMatchedAngle === null && parseInt(card.dataset.row, 10) === 0) {
            firstMatchedAngle = parseFloat(card.dataset.baseAngle);
          }
        } else {
          card.classList.add('is-dimmed');
          card.classList.remove('is-matched');
        }
      });

      // Smoothly orbit so a matching card is placed prominently
      if (firstMatchedAngle !== null && filter !== 'all') {
        // Position card at approximately +36 deg (right beside center text)
        const targetAngle = 36;
        const currentRot = targetRotY % 360;
        const diff = ((-firstMatchedAngle + targetAngle - currentRot + 540) % 360) - 180;
        targetRotY += diff;
      }
    }
  }
})();
