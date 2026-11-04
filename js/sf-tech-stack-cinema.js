/**
 * Salesforce Modern Technology Stack - Awwwards 3D Cinema Engine
 * Direct Implementation of Natascha Vavrina (Awwwards SOTD) 3D Spatial Z-Tunnel
 * 
 * Key Features:
 * - True 3D Z-Space Camera / Tunnel: Cards travel along the Z axis from deep space
 *   (z: -2400px), reach hero focus at (z: 0px), and surge FORWARD OUT OF THE SCREEN (z: +500px)
 *   with realistic optical perspective foreshortening.
 * - Continuous Multi-Card Depth: Multiple cards visible simultaneously with dynamic depth-of-field blur.
 * - 60fps/120fps requestAnimationFrame Lerp engine for silky smooth inertial scrolling.
 * - Interactive 3D Holographic Mouse Parallax & Gyro Tilt (rotateX, rotateY, translate3d).
 * - Instant Interactive Hover / Click on 3-column list glides 3D camera to bring item directly to screen.
 * - Category filter pills smoothly re-align 3D depth spacing.
 * - Real-time synchronization of • bullet indicator and ambient diffuse glow.
 */

(function () {
  'use strict';

  const TECH_ITEMS = [
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'core',
      position: 'br',
      color: 'rgba(0, 161, 224, 0.40)',
      cardTitle: 'Salesforce 360',
      tag: 'Core Platform',
      desc: 'Enterprise CRM architecture unifying customer, sales, and service data.'
    },
    {
      id: 'apex',
      name: 'Apex',
      category: 'core',
      position: 'tl',
      color: 'rgba(56, 189, 248, 0.40)',
      cardTitle: 'Apex Code Engine',
      tag: 'Backend Runtime',
      desc: 'Strongly typed, object-oriented cloud language for robust enterprise transactions.'
    },
    {
      id: 'lwc',
      name: 'Lightning Web Components',
      category: 'core',
      position: 'tr',
      color: 'rgba(6, 182, 212, 0.40)',
      cardTitle: 'Lightning LWC',
      tag: 'Reactive UI',
      desc: 'High-performance modern web standards delivering responsive user experiences.'
    },
    {
      id: 'flow',
      name: 'Flow',
      category: 'core',
      position: 'bl',
      color: 'rgba(245, 158, 11, 0.40)',
      cardTitle: 'Flow Automation',
      tag: 'Process Engine',
      desc: 'Visual business logic and event-driven automation without rigid code overhead.'
    },
    {
      id: 'apis',
      name: 'APIs',
      category: 'integration',
      position: 'br',
      color: 'rgba(14, 165, 233, 0.40)',
      cardTitle: 'Enterprise APIs',
      tag: 'Gateway & Sync',
      desc: 'High-throughput endpoint orchestration connecting legacy and cloud endpoints.'
    },
    {
      id: 'rest',
      name: 'REST',
      category: 'integration',
      position: 'tl',
      color: 'rgba(34, 197, 94, 0.40)',
      cardTitle: 'RESTful Services',
      tag: 'HTTP Architecture',
      desc: 'Lightweight JSON streaming interfaces powering high-velocity mobile & web data.'
    },
    {
      id: 'soap',
      name: 'SOAP',
      category: 'integration',
      position: 'tr',
      color: 'rgba(234, 179, 8, 0.40)',
      cardTitle: 'SOAP Protocol',
      tag: 'Enterprise Contract',
      desc: 'WSDL-based enterprise XML contract validation ensuring zero data-loss transactional integrity.'
    },
    {
      id: 'mulesoft',
      name: 'MuleSoft',
      category: 'integration',
      position: 'bl',
      color: 'rgba(59, 130, 246, 0.40)',
      cardTitle: 'MuleSoft Anypoint',
      tag: 'Integration Mesh',
      desc: 'Universal API-led connectivity integrating hybrid clouds, ERPs, and microservices.'
    },
    {
      id: 'datacloud',
      name: 'Data Cloud',
      category: 'cloud',
      position: 'br',
      color: 'rgba(99, 102, 241, 0.40)',
      cardTitle: 'Data Cloud Lake',
      tag: 'Real-Time 360',
      desc: 'Hyperscale unified customer profiles streaming data across enterprise ecosystems.'
    },
    {
      id: 'marketingcloud',
      name: 'Marketing Cloud',
      category: 'cloud',
      position: 'tl',
      color: 'rgba(217, 70, 239, 0.40)',
      cardTitle: 'Marketing Cloud',
      tag: 'Omnichannel Growth',
      desc: 'Automated 1-to-1 customer journeys driven by behavioral AI and predictive touchpoints.'
    },
    {
      id: 'experiencecloud',
      name: 'Experience Cloud',
      category: 'cloud',
      position: 'tr',
      color: 'rgba(14, 165, 233, 0.40)',
      cardTitle: 'Experience Cloud',
      tag: 'Digital Portals',
      desc: 'Branded customer, partner, and employee communities with native CRM depth.'
    },
    {
      id: 'heroku',
      name: 'Heroku',
      category: 'cloud',
      position: 'bl',
      color: 'rgba(168, 85, 247, 0.40)',
      cardTitle: 'Heroku Platform',
      tag: 'Elastic Cloud PaaS',
      desc: 'Container-based polyglot app deployment scaling enterprise microservices effortlessly.'
    }
  ];

  function initSalesforceCinemaStack() {
    const track = document.getElementById('techStackSection');
    if (!track) return;

    const cardsLayer = track.querySelector('.sf-cinema-cards-layer');
    const cards = Array.from(track.querySelectorAll('.sf-cinema-card'));
    const items = Array.from(track.querySelectorAll('.sf-cinema-item-btn'));
    const filterBtns = Array.from(track.querySelectorAll('.sf-cinema-filter-btn'));
    const ambientGlow = track.querySelector('.sf-cinema-ambient-glow');
    const navList = track.querySelector('.sf-cinema-nav-list');
    const stage = track.querySelector('.sf-cinema-stage');

    if (!cards.length || !items.length) return;

    // Link DOM elements to data objects
    const itemData = TECH_ITEMS.map((item, index) => {
      return {
        ...item,
        index,
        cardEl: cards[index] || null,
        btnEl: items[index] || null
      };
    });

    const DISTANCE_BETWEEN = 650; // Z distance between cards
    let currentZ = 0;             // Current smoothed camera Z position
    let targetZ = 0;              // Target Z position from scroll or hover
    let isHovering = false;
    let hoverTimeout = null;
    let activeFilter = 'all';
    let activeItems = [...itemData];
    let currentHeroIndex = -1;

    // Mouse parallax variables
    let mouseX = 0;
    let mouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    // Update active item list based on category
    function updateActiveItems() {
      if (activeFilter === 'all') {
        activeItems = [...itemData];
      } else {
        activeItems = itemData.filter(it => it.category === activeFilter);
      }
    }

    // Update center ambient glow
    function updateAmbientGlow(color) {
      if (!ambientGlow) return;
      ambientGlow.style.background = `radial-gradient(circle, ${color} 0%, rgba(56, 189, 248, 0.12) 40%, transparent 70%)`;
      ambientGlow.style.opacity = '0.45';
    }

    // Set hero active item in list
    function setHeroItem(item) {
      if (!item || item.index === currentHeroIndex) return;
      currentHeroIndex = item.index;

      items.forEach((btn, idx) => {
        if (idx === item.index) {
          btn.classList.add('is-active');
        } else {
          btn.classList.remove('is-active');
        }
      });

      updateAmbientGlow(item.color);
    }

    // Smooth Scroll Sync
    function syncWithScroll() {
      if (isHovering) return;

      const rect = track.getBoundingClientRect();
      const trackHeight = track.offsetHeight;
      const viewHeight = window.innerHeight;
      const totalScrollable = trackHeight - viewHeight;

      if (totalScrollable <= 0) return;

      const scrollOffset = -rect.top;
      const progress = Math.max(0, Math.min(1, scrollOffset / totalScrollable));

      // Map progress to total distance
      const maxZ = Math.max(0, (activeItems.length - 1) * DISTANCE_BETWEEN);
      targetZ = progress * maxZ;
    }

    window.addEventListener('scroll', syncWithScroll, { passive: true });

    // Interactive Hover & Click on tech list items
    items.forEach((btn) => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      
      const selectItem = () => {
        isHovering = true;
        clearTimeout(hoverTimeout);

        // Find position of this item in activeItems
        const slotIdx = activeItems.findIndex(it => it.index === idx);
        if (slotIdx !== -1) {
          targetZ = slotIdx * DISTANCE_BETWEEN;
        }

        setHeroItem(itemData[idx]);
      };

      btn.addEventListener('mouseenter', selectItem);
      btn.addEventListener('click', selectItem);
    });

    if (navList) {
      navList.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          isHovering = false;
          syncWithScroll();
        }, 1200);
      });
    }

    // Clicking directly on cards
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        const slotIdx = activeItems.findIndex(it => it.index === idx);
        if (slotIdx !== -1) {
          isHovering = true;
          clearTimeout(hoverTimeout);
          targetZ = slotIdx * DISTANCE_BETWEEN;
          setHeroItem(itemData[idx]);
          hoverTimeout = setTimeout(() => {
            isHovering = false;
            syncWithScroll();
          }, 1800);
        }
      });
    });

    // Category Filter Buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-filter') || 'all';
        activeFilter = cat;

        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        // Update list button states
        items.forEach((itemBtn, i) => {
          const itemCat = itemData[i].category;
          if (cat === 'all' || itemCat === cat) {
            itemBtn.classList.remove('is-filtered-out');
          } else {
            itemBtn.classList.add('is-filtered-out');
          }
        });

        // Hide cards not in category
        itemData.forEach(it => {
          if (it.cardEl) {
            if (cat !== 'all' && it.category !== cat) {
              it.cardEl.style.opacity = '0';
              it.cardEl.style.visibility = 'hidden';
            }
          }
        });

        updateActiveItems();

        // Smoothly glide camera to the beginning of the filtered category
        isHovering = true;
        targetZ = 0;
        currentZ = Math.max(0, currentZ - DISTANCE_BETWEEN * 0.5);
        if (activeItems.length > 0) {
          setHeroItem(activeItems[0]);
        }

        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          isHovering = false;
          syncWithScroll();
        }, 1200);
      });
    });

    // Mouse Tracking for 3D Holographic Gyro Parallax
    if (stage) {
      stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to +1
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to +1
      }, { passive: true });

      stage.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
      });
    }

    // Set initial hero item
    setHeroItem(itemData[0]);
    syncWithScroll();

    // 60fps/120fps Main 3D Render Loop
    function renderLoop() {
      // Smooth camera Z lerp
      currentZ += (targetZ - currentZ) * 0.1;

      // Smooth mouse parallax lerp
      smoothMouseX += (mouseX - smoothMouseX) * 0.08;
      smoothMouseY += (mouseY - smoothMouseY) * 0.08;

      const tiltX = -smoothMouseY * 10;
      const tiltY = smoothMouseX * 12;
      const mouseTransX = smoothMouseX * 20;
      const mouseTransY = smoothMouseY * 16;

      let closestItem = null;
      let minDistance = Infinity;

      activeItems.forEach((item, slotIndex) => {
        const card = item.cardEl;
        if (!card) return;

        // Compute Z coordinate in 3D perspective tunnel:
        // When currentZ == slotIndex * DISTANCE_BETWEEN, z = 0 (hero focus)
        // When currentZ > slotIndex * DISTANCE_BETWEEN, z > 0 (comes OUT of the screen towards the user)
        const z = currentZ - slotIndex * DISTANCE_BETWEEN;

        const absZ = Math.abs(z);
        if (absZ < minDistance) {
          minDistance = absZ;
          closestItem = item;
        }

        // Visibility boundaries:
        // Deep behind: z < -2400
        // Past the camera: z > 580
        if (z < -2400 || z > 580) {
          card.style.opacity = '0';
          card.style.visibility = 'hidden';
          card.style.pointerEvents = 'none';
          return;
        }

        card.style.visibility = 'visible';

        // 3D Depth Opacity Curve
        let opacity = 1;
        if (z < -1400) {
          // Deep space fade in: -2400 to -1400
          opacity = Math.max(0, (z - (-2400)) / 1000 * 0.45);
        } else if (z < -400) {
          // Mid space approach: -1400 to -400
          opacity = 0.45 + ((z - (-1400)) / 1000) * 0.45;
        } else if (z <= 200) {
          // Hero focus & coming OUT OF THE SCREEN: -400 to +200
          opacity = 1.0;
        } else {
          // Exiting past the screen towards the user: +200 to +550
          opacity = Math.max(0, 1 - (z - 200) / 350);
        }

        // 3D Depth-of-Field Blur Curve
        let blur = 0;
        if (z < 0) {
          blur = Math.min(22, Math.max(0, (-z) / 80));
        } else if (z > 220) {
          blur = Math.min(8, (z - 220) / 40);
        }

        // Stacking order & pointer interaction
        let zIndex = 5;
        if (absZ < DISTANCE_BETWEEN * 0.45) {
          zIndex = 20;
          card.style.pointerEvents = 'auto';
          card.classList.add('is-active');
        } else if (z > 0) {
          zIndex = 25; // Coming out of screen in front
          card.style.pointerEvents = 'none';
          card.classList.remove('is-active');
        } else {
          zIndex = Math.max(1, Math.round(15 + z / 200));
          card.style.pointerEvents = 'none';
          card.classList.remove('is-active');
        }

        // Parallax scaling with depth (closer objects experience stronger parallax)
        const depthFactor = Math.max(0.3, (1000 + z) / 1000);
        const px = mouseTransX * depthFactor;
        const py = mouseTransY * depthFactor;

        // Apply true 3D Transform
        // As z goes positive, the card literally expands and comes OUT OF THE SCREEN
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : 'none';
        card.style.zIndex = zIndex;
        card.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      });

      // Synchronize active list item with the card currently at focus (z ≈ 0)
      if (closestItem && minDistance < DISTANCE_BETWEEN * 0.6) {
        setHeroItem(closestItem);
      }

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSalesforceCinemaStack);
  } else {
    initSalesforceCinemaStack();
  }
})();
