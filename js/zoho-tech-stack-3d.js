/**
 * Zoho Modern Technology Stack - 3D Interactive Parallax & Floating Engine
 * Implements smooth multiplane 3D perspective tracking modeled after Squarespace Blueprint AI
 */

(function () {
  'use strict';

  function initZohoTechStack3D() {
    const section = document.getElementById('zohoTechStackStage') || document.getElementById('zohoTechStackSection');
    if (!section) return;

    const cards = section.querySelectorAll('.zoho-3d-float-item');
    const orbs = section.querySelectorAll('.zoho-3d-ambient-orb');
    const core = section.querySelector('.zoho-tech-center-core');

    if (!cards.length) return;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isHovering = false;
    let rafId = null;

    // Listen for mousemove on the section
    function onMouseMove(e) {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalized coordinates from -1 to 1
      targetMouseX = (x / rect.width) * 2 - 1;
      targetMouseY = (y / rect.height) * 2 - 1;
      isHovering = true;

      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    }

    function onMouseLeave() {
      targetMouseX = 0;
      targetMouseY = 0;
      isHovering = false;
    }

    // Smooth lerp loop
    function updateParallax() {
      const ease = 0.07;
      currentMouseX += (targetMouseX - currentMouseX) * ease;
      currentMouseY += (targetMouseY - currentMouseY) * ease;

      // Update cards
      cards.forEach((card) => {
        const factor = parseFloat(card.getAttribute('data-depth') || '1');
        const moveX = currentMouseX * 30 * factor;
        const moveY = currentMouseY * 25 * factor;
        const tiltX = -currentMouseY * 12 * factor;
        const tiltY = currentMouseX * 15 * factor;

        card.style.setProperty('--px-x', `${moveX.toFixed(2)}px`);
        card.style.setProperty('--px-y', `${moveY.toFixed(2)}px`);
        card.style.setProperty('--px-rx', `${tiltX.toFixed(2)}deg`);
        card.style.setProperty('--px-ry', `${tiltY.toFixed(2)}deg`);
      });

      // Update ambient orbs
      if (orbs.length) {
        const orbX = -currentMouseX * 45;
        const orbY = -currentMouseY * 35;
        orbs.forEach((orb) => {
          orb.style.setProperty('--orb-x', `${orbX.toFixed(2)}px`);
          orb.style.setProperty('--orb-y', `${orbY.toFixed(2)}px`);
        });
      }

      // Update center core subtle counter-shift
      if (core) {
        const coreX = currentMouseX * 10;
        const coreY = currentMouseY * 8;
        core.style.setProperty('--core-x', `${coreX.toFixed(2)}px`);
        core.style.setProperty('--core-y', `${coreY.toFixed(2)}px`);
      }

      // Continue animating while mouse is active or until it settles near zero
      const delta = Math.abs(targetMouseX - currentMouseX) + Math.abs(targetMouseY - currentMouseY);
      if (isHovering || delta > 0.001) {
        rafId = requestAnimationFrame(updateParallax);
      } else {
        rafId = null;
      }
    }

    section.addEventListener('mousemove', onMouseMove, { passive: true });
    section.addEventListener('mouseleave', onMouseLeave, { passive: true });

    // Click effect on cards
    cards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('is-hovered');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-hovered');
      });
    });

    // Ensure starfield background video plays reliably
    const bgVideo = section.querySelector('.zoho-tech-bg-video');
    if (bgVideo) {
      bgVideo.muted = true;
      const playPromise = bgVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const tryPlay = () => {
            bgVideo.play();
            window.removeEventListener('scroll', tryPlay);
            window.removeEventListener('click', tryPlay);
            window.removeEventListener('touchstart', tryPlay);
          };
          window.addEventListener('scroll', tryPlay, { passive: true });
          window.addEventListener('click', tryPlay, { passive: true });
          window.addEventListener('touchstart', tryPlay, { passive: true });
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initZohoTechStack3D);
  } else {
    initZohoTechStack3D();
  }
})();
