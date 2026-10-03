/**
 * ==========================================================================
 * DIGIOLIC CASE STUDIES — 3D CURVED CYLINDER SPHERE SHOWCASE
 * Exact replication of the Squarespace 3D Curved Showcase Wall:
 * - 3-tier curved cylindrical / spherical card cloud in 3D perspective
 * - 60fps GPU-accelerated CSS 3D transforms
 * - Interactive pointer & touch drag orbit with momentum physics
 * - Ambient continuous idle drift
 * - Floating hover pill badges with arrow ("Client Name ↗")
 * - Case study modal click trigger
 * - Category filter tabs & Left/Right navigation orbit buttons
 * ==========================================================================
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init3DShowcase);

  function init3DShowcase() {
    const section = document.getElementById('cs3DShowcaseSection');
    const cylinder = document.getElementById('cs3DCylinder');
    if (!section || !cylinder) return;

    const cards = Array.from(cylinder.querySelectorAll('.cs-3d-card-item'));
    if (cards.length === 0) return;

    // --- 3D GEOMETRY CONFIGURATION ---
    const TOTAL_COLUMNS = 8;
    const ANGLE_STEP = 360 / TOTAL_COLUMNS; // 45 deg per column

    function getCylinderRadius() {
      const w = window.innerWidth;
      if (w < 768) return 460;
      if (w < 1024) return 600;
      if (w < 1440) return 780;
      return 850;
    }

    function getRowConfig() {
      const w = window.innerWidth;
      const yOffset = w < 768 ? 172 : (w < 1024 ? 208 : 242);
      return [
        { y: -yOffset, tiltX: -6 }, // Top Row (tilted slightly down)
        { y: 0, tiltX: 0 },         // Middle Row (straight eye-level)
        { y: yOffset, tiltX: 6 }    // Bottom Row (tilted slightly up)
      ];
    }

    let radius = getCylinderRadius();
    let rowConfig = getRowConfig();

    // Position cards initially around cylinder
    function layoutCards() {
      radius = getCylinderRadius();
      rowConfig = getRowConfig();

      cards.forEach((card, idx) => {
        const col = idx % TOTAL_COLUMNS;
        const row = Math.floor(idx / TOTAL_COLUMNS) % 3;
        // Stagger middle row by 22.5 deg so center visual window is open for branding
        const rowAngleOffset = (row === 1) ? (ANGLE_STEP / 2) : 0;
        const angle = (col * ANGLE_STEP) + rowAngleOffset;
        const cfg = rowConfig[row] || { y: 0, tiltX: 0 };

        card.dataset.col = col;
        card.dataset.row = row;
        card.dataset.angle = angle;
        card.dataset.y = cfg.y;
        card.dataset.tiltX = cfg.tiltX;

        applyCardTransform(card, false);
      });
    }

    function applyCardTransform(card, isHovered) {
      const angle = parseFloat(card.dataset.angle);
      const y = parseFloat(card.dataset.y);
      const tiltX = parseFloat(card.dataset.tiltX);
      const currentRadius = isHovered ? (radius + 40) : radius;
      const scale = isHovered ? 1.08 : 1.0;

      card.style.transform = `rotateY(${angle}deg) translateY(${y}px) translateZ(${currentRadius}px) rotateX(${tiltX}deg) scale(${scale})`;
      card.style.zIndex = isHovered ? '999' : '10';
    }

    layoutCards();
    window.addEventListener('resize', () => {
      layoutCards();
    }, { passive: true });

    // --- PHYSICS & MOMENTUM DRAG ENGINE ---
    let rotY = 0;
    let rotX = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let velY = 0;
    let velX = 0;

    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let hasDragged = false;
    const DRAG_THRESHOLD = 6; // px

    let isHoveringCard = false;

    // Animation frame loop
    function updatePhysics() {
      if (!isPointerDown) {
        // Continuous gentle auto-orbit when not interacting
        if (!isHoveringCard) {
          targetRotY += 0.045;
        }

        // Apply friction to velocity
        velY *= 0.93;
        velX *= 0.93;

        targetRotY += velY;
        targetRotX += velX;

        // Clamp vertical tilt to subtle range (-10deg to +10deg)
        targetRotX = Math.max(-10, Math.min(10, targetRotX));
      }

      // Smooth lerp easing
      rotY += (targetRotY - rotY) * 0.12;
      rotX += (targetRotX - rotX) * 0.12;

      // Update cylinder transform
      cylinder.style.transform = `rotateX(${-rotX}deg) rotateY(${rotY}deg)`;

      requestAnimationFrame(updatePhysics);
    }

    requestAnimationFrame(updatePhysics);

    // --- POINTER / MOUSE HANDLERS ---
    section.addEventListener('pointerdown', (e) => {
      // Don't drag if clicking buttons
      if (e.target.closest('button') || e.target.closest('.cs-3d-filter-pills') || e.target.closest('.cs-3d-view-toggle')) {
        return;
      }

      isPointerDown = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      velY = 0;
      velX = 0;

      section.classList.add('is-dragging');
    });

    window.addEventListener('pointermove', (e) => {
      if (!isPointerDown) return;

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const totalDist = Math.hypot(e.clientX - startX, e.clientY - startY);

      if (totalDist > DRAG_THRESHOLD) {
        hasDragged = true;
      }

      // Sensitivity tuning
      const sensitivityX = 0.28;
      const sensitivityY = 0.18;

      targetRotY += dx * sensitivityX;
      targetRotX -= dy * sensitivityY;
      targetRotX = Math.max(-10, Math.min(10, targetRotX));

      velY = dx * sensitivityX;
      velX = -dy * sensitivityY;

      lastX = e.clientX;
      lastY = e.clientY;
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
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        isHoveringCard = true;
        applyCardTransform(card, true);
      });

      card.addEventListener('mouseleave', () => {
        isHoveringCard = false;
        applyCardTransform(card, false);
      });

      card.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        const caseId = card.getAttribute('data-case-id');
        if (caseId) {
          // Open case study modal
          openCaseStudyModal(caseId);
        }
      });
    });

    // --- MODAL TRIGGER HELPER ---
    function openCaseStudyModal(caseId) {
      if (typeof window.openCaseStudyModal === 'function') {
        window.openCaseStudyModal(caseId);
        return;
      }
      // Fallback: Find corresponding button or trigger modal directly
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
        targetRotY += ANGLE_STEP; // Orbit counter-clockwise
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        targetRotY -= ANGLE_STEP; // Orbit clockwise
      });
    }

    // --- CATEGORY FILTER TABS ---
    const filterBtns = Array.from(document.querySelectorAll('.cs-3d-filter-btn'));
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const filter = btn.getAttribute('data-filter') || 'all';
        applyCategoryFilter(filter);
      });
    });

    function applyCategoryFilter(filter) {
      let firstMatchedCard = null;

      cards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        const isMatch = filter === 'all' || cat.includes(filter);

        if (isMatch) {
          card.classList.remove('is-dimmed');
          if (filter !== 'all') {
            card.classList.add('is-matched');
          } else {
            card.classList.remove('is-matched');
          }
          if (!firstMatchedCard) {
            firstMatchedCard = card;
          }
        } else {
          card.classList.add('is-dimmed');
          card.classList.remove('is-matched');
        }
      });

      // Smoothly orbit to face the first matching card
      if (firstMatchedCard && filter !== 'all') {
        const angle = parseFloat(firstMatchedCard.dataset.angle);
        // We want this card's angle to face 0deg (front):
        // (angle + targetRotY) % 360 == 0 => targetRotY = -angle
        const currentRot = targetRotY % 360;
        const diff = ((-angle - currentRot + 540) % 360) - 180;
        targetRotY += diff;
      }
    }

    // --- 3D VS GRID VIEW TOGGLE ---
    const viewToggleBtn = document.getElementById('cs3DViewToggle');
    const gridContainer = document.getElementById('csGridContainerFallback');

    if (viewToggleBtn && gridContainer) {
      let isGridView = false;
      viewToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isGridView = !isGridView;

        if (isGridView) {
          section.style.display = 'none';
          gridContainer.style.display = 'block';
          viewToggleBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
            </svg>
            <span>3D Sphere View</span>
          `;
        } else {
          section.style.display = 'flex';
          gridContainer.style.display = 'none';
          viewToggleBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span>Grid View</span>
          `;
          layoutCards();
        }
      });
    }
  }
})();
