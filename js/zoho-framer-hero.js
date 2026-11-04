/**
 * Zoho Framer Mosaic Hero Interactive Controller
 * Dynamic cursor spotlight tracking, mosaic cell interactions,
 * and seamless scroll integration with the products directory.
 */
(function() {
  'use strict';

  function initZohoFramerHero() {
    var hero = document.getElementById('zohoHero');
    if (!hero) return;

    var ticking = false;
    var mouseX = 25;
    var mouseY = 25;

    // Track cursor for ambient spotlight
    hero.addEventListener('mousemove', function(e) {
      var rect = hero.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;

      mouseX = Math.max(0, Math.min(100, x));
      mouseY = Math.max(0, Math.min(100, y));

      if (!ticking) {
        requestAnimationFrame(function() {
          hero.style.setProperty('--mouse-x', mouseX.toFixed(2) + '%');
          hero.style.setProperty('--mouse-y', mouseY.toFixed(2) + '%');
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Reset softly on mouse leave
    hero.addEventListener('mouseleave', function() {
      hero.style.setProperty('--mouse-x', '22%');
      hero.style.setProperty('--mouse-y', '20%');
    });

    // Department pills click event - smooth scroll to directory and select category
    var deptPills = hero.querySelectorAll('.zoho-framer-dept-pill');
    deptPills.forEach(function(pill) {
      pill.addEventListener('click', function(e) {
        var cat = this.getAttribute('data-cat');
        var targetSec = document.querySelector('#allProductsSection, #zohoDirectorySection, .zoho-directory-section');
        
        if (targetSec) {
          e.preventDefault();
          targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // If a category button with matching data-cat exists, trigger it
          if (cat) {
            setTimeout(function() {
              var catBtn = document.querySelector('.zoho-cat-nav-btn[data-category="' + cat + '"], .zoho-category-pill-btn[data-category="' + cat + '"]');
              if (catBtn) {
                catBtn.click();
              }
            }, 600);
          }
        }
      });
    });

    // Secondary / Explore Apps button smooth scroll
    var exploreBtns = hero.querySelectorAll('#heroExploreProductsBtn, .zoho-framer-floating-cta, .zoho-framer-secondary-link');
    exploreBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
          var target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initZohoFramerHero);
  } else {
    initZohoFramerHero();
  }
})();
