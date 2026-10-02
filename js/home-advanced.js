/**
 * DIGIOLIC — HOMEPAGE ADVANCED INTERACTIVITY & 3D MICRO-ANIMATIONS
 * Lightweight, strictly scoped to non-hero homepage sections.
 */
(function () {
  'use strict';

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 1. Subtle 3D Card Tilt on Practice Cards
  const practiceCards = document.querySelectorAll('.practice-rect-card');
  practiceCards.forEach((card) => {
    let ticking = false;

    function handleMouseMove(e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((cardY - centerY) / centerY) * -5;
        const rotateY = ((cardX - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
        ticking = false;
      });
    }

    function handleMouseLeave() {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    }

    function handleMouseEnter() {
      card.style.transition = 'transform 0.15s ease-out';
    }

    card.addEventListener('mousemove', handleMouseMove, { passive: true });
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);
  });

  // 2. Interactive Step Highlight on How We Deliver Nodes
  const deliverCols = document.querySelectorAll('.deliver-step-col');
  const pipelinePaths = document.querySelectorAll('.deliver-pipeline-svg path, .deliver-pipeline-svg line');
  
  deliverCols.forEach((col) => {
    col.addEventListener('mouseenter', () => {
      pipelinePaths.forEach((path) => {
        path.style.filter = 'drop-shadow(0 0 10px rgba(124, 58, 237, 0.85))';
        path.style.stroke = '#A855F7';
      });
    });

    col.addEventListener('mouseleave', () => {
      pipelinePaths.forEach((path) => {
        path.style.filter = '';
        path.style.stroke = '';
      });
    });
  });

})();
