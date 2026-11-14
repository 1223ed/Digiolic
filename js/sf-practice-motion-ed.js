/**
 * DIGIOLIC - SALESFORCE COMPREHENSIVE PRACTICE SECTION (#servicesOverview)
 * Progressive Fallback Engine for Crosswalk Editorial Scroll Choreography
 *
 * - Modern browsers (native view() + animation-range support): exits cleanly with zero JS scroll work.
 * - Older browsers without full view()/animation-range support: drives matching cover progress via rAF.
 * - Respects prefers-reduced-motion: reduce completely (all elements static & visible).
 */
(function () {
  'use strict';

  function clamp01(val) {
    return val < 0 ? 0 : val > 1 ? 1 : val;
  }

  function mapRange(val, start, end) {
    if (end <= start) return val >= end ? 1 : 0;
    return clamp01((val - start) / (end - start));
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - clamp01(t), 3);
  }

  function computeCoverProgress(el, vh) {
    var rect = el.getBoundingClientRect();
    var total = vh + rect.height;
    return total > 0 ? clamp01((vh - rect.top) / total) : 0;
  }

  function initCrosswalkPracticeFallback() {
    var section = document.getElementById('servicesOverview');
    if (!section) return;

    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    // Require BOTH animation-timeline: view() and animation-range: entry before deferring to native CSS
    var nativeViewSupported =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline', 'view()') &&
      CSS.supports('animation-range', 'entry');

    if (nativeViewSupported) return;

    var staircase = section.querySelector('.sf-cw-staircase');
    var steps = staircase ? Array.prototype.slice.call(staircase.querySelectorAll('.sf-cw-step')) : [];
    var headerBand = section.querySelector('.sf-cw-header-band');
    var headerLines = headerBand ? Array.prototype.slice.call(headerBand.querySelectorAll('.sf-cw-line-inner')) : [];
    var rows = Array.prototype.slice.call(section.querySelectorAll('.sf-cw-row'));

    section.classList.add('sf-cw-js-fallback');

    var ticking = false;

    function updateFrame() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight || 800;
      var vw = window.innerWidth || document.documentElement.clientWidth || 1280;
      var isStackedMobile = vw <= 820;

      // 1. 14-Column Staircase Entry Wipe
      if (staircase && steps.length) {
        var stairP = computeCoverProgress(staircase, vh);
        for (var i = 0; i < steps.length; i++) {
          var stepStart = 0.24 + i * 0.015;
          var stepEnd = 0.50 + i * 0.015;
          var p = easeOutCubic(mapRange(stairP, stepStart, stepEnd));
          steps[i].style.setProperty('--cw-step-p', p.toFixed(4));
        }
      }

      // 2. Asymmetric Header Band Rules & Line Masks
      if (headerBand) {
        var rect = headerBand.getBoundingClientRect();
        var headCover = computeCoverProgress(headerBand, vh);
        var entrySpan = rect.height > 0 ? vh / (vh + rect.height) : 0.6;
        var headEntryNorm = clamp01(headCover / Math.max(entrySpan, 0.2));

        var ruleP = easeOutCubic(mapRange(headCover, 0.08, 0.44));
        headerBand.style.setProperty('--cw-head-rule-p', ruleP.toFixed(4));

        for (var j = 0; j < headerLines.length; j++) {
          var lineP = easeOutCubic(mapRange(headCover, 0.16 + j * 0.05, 0.46 + j * 0.05));
          headerLines[j].style.setProperty('--cw-line-y', ((1 - lineP) * 108).toFixed(2) + '%');
        }

        var descP = easeOutCubic(mapRange(Math.max(headCover, headEntryNorm * 0.48), 0.22, 0.54));
        headerBand.style.setProperty('--cw-head-desc-op', descP.toFixed(4));
        headerBand.style.setProperty('--cw-head-desc-y', ((1 - descP) * 28).toFixed(2) + 'px');
      }

      // 3. Alternating Service Rows (Spine Banner Slide + Copy Reveal + Portrait Parallax)
      for (var k = 0; k < rows.length; k++) {
        var row = rows[k];
        var rowP = computeCoverProgress(row, vh);
        var side = row.getAttribute('data-side');

        var bannerP = easeOutCubic(mapRange(rowP, 0.08, 0.42));
        var fromLeftSpine = isStackedMobile || side === 'right';
        var bannerX = fromLeftSpine ? -(1 - bannerP) * 100 : (1 - bannerP) * 100;
        row.style.setProperty('--cw-banner-x', bannerX.toFixed(2) + '%');

        var detailsP = easeOutCubic(mapRange(rowP, 0.16, 0.48));
        row.style.setProperty('--cw-details-op', detailsP.toFixed(4));
        row.style.setProperty('--cw-details-y', ((1 - detailsP) * 28).toFixed(2) + 'px');

        var frameY = isStackedMobile ? 0 : (0.5 - rowP) * 52;
        var imgY = (rowP - 0.5) * 12;
        row.style.setProperty('--cw-frame-y', frameY.toFixed(2) + 'px');
        row.style.setProperty('--cw-img-y', imgY.toFixed(2) + '%');
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateFrame);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateFrame();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCrosswalkPracticeFallback);
  } else {
    initCrosswalkPracticeFallback();
  }
})();
