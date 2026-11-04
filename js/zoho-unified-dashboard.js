/**
 * Zoho Unified Enterprise Dashboard Interactive Logic
 * Handles tab switching (Zoho CRM, Reports, Settings, Zoho Creator, Zoho Books),
 * Filter switching (Pipeline Stage, Deal Size, Region, Timeframe),
 * and subtle 3D tilt responsiveness.
 */

(function () {
  'use strict';

  function initUnifiedDashboard() {
    const section = document.getElementById('zohoUnifiedDashboardSection');
    if (!section) return;

    const navTabs = section.querySelectorAll('.zud-tab-btn');
    const filterPills = section.querySelectorAll('.zud-filter-pill-btn');
    const mainFigure = section.querySelector('.zud-main-figure');
    const growthBadge = section.querySelector('.zud-growth-badge');
    const dealsSub = section.querySelector('.zud-deals-sub span');
    const statVals = section.querySelectorAll('.zud-stat-item-val');
    const tablet = section.querySelector('.zud-center-tablet');

    // Data presets for tabs
    const tabData = {
      'crm': {
        amount: '$ 254,596,04',
        growth: '+13.95%',
        deals: 'Total Open Deals',
        p1: '2.25 M',
        p2: '53.86%',
        p3: '50,000'
      },
      'reports': {
        amount: '$ 482,120,50',
        growth: '+21.40%',
        deals: 'Executive Revenue Realized',
        p1: '4.80 M',
        p2: '62.15%',
        p3: '84,200'
      },
      'settings': {
        amount: '$ 120,450,00',
        growth: '+8.32%',
        deals: 'Automation Rules Active',
        p1: '1.10 M',
        p2: '94.20%',
        p3: '12,500'
      },
      'creator': {
        amount: '$ 315,800,20',
        growth: '+17.65%',
        deals: 'Custom Workflows Executed',
        p1: '3.40 M',
        p2: '71.50%',
        p3: '68,900'
      },
      'books': {
        amount: '$ 610,240,80',
        growth: '+28.90%',
        deals: 'Invoiced & Reconciled Total',
        p1: '5.90 M',
        p2: '88.40%',
        p3: '96,000'
      }
    };

    navTabs.forEach((tab) => {
      tab.addEventListener('click', function () {
        navTabs.forEach((t) => {
          t.classList.remove('is-active');
          const check = t.querySelector('.zud-check-badge');
          if (check) check.remove();
        });

        this.classList.add('is-active');
        
        // Add check badge if missing
        if (!this.querySelector('.zud-check-badge')) {
          const badge = document.createElement('span');
          badge.className = 'zud-check-badge';
          badge.textContent = '✓';
          this.appendChild(badge);
        }

        const tabKey = this.getAttribute('data-tab') || 'crm';
        const d = tabData[tabKey] || tabData['crm'];

        if (mainFigure) mainFigure.textContent = d.amount;
        if (growthBadge) growthBadge.textContent = d.growth;
        if (dealsSub) dealsSub.textContent = d.deals;
        if (statVals.length >= 3) {
          statVals[0].textContent = d.p1;
          statVals[1].textContent = d.p2;
          statVals[2].textContent = d.p3;
        }
      });
    });

    // Filter pills
    filterPills.forEach((pill) => {
      pill.addEventListener('click', function () {
        filterPills.forEach((p) => p.classList.remove('is-active'));
        this.classList.add('is-active');
      });
    });

    // Subtle 3D mouse parallax on desktop
    if (tablet && window.innerWidth > 1024) {
      section.addEventListener('mousemove', function (e) {
        const rect = section.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rotateY = (x / rect.width) * 6; // max 3 deg
        const rotateX = -(y / rect.height) * 6;

        tablet.style.transform = `perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      section.addEventListener('mouseleave', function () {
        tablet.style.transform = 'perspective(1600px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnifiedDashboard);
  } else {
    initUnifiedDashboard();
  }
})();
