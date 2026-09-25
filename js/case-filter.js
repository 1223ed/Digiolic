/**
 * Digiolic Enterprise Case Stories
 * Live Category Filtering, Real-time Search, and Architecture Breakdown Modal Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. DATA REPOSITORY FOR ARCHITECTURE BREAKDOWN MODAL
  // ---------------------------------------------------------------------------
  const caseDetailsData = {
    'case-sf-fintech': {
      domain: 'Salesforce Cloud',
      domainClass: 'salesforce',
      scale: 'FinTech SaaS • Series B ($40M ARR)',
      title: 'Refactoring Complex Apex & Flow Architecture for 10x Inbound Transaction Volume',
      clientOverview: 'A high-growth payments platform processing millions in daily transaction volume experienced severe backend lockups as inbound merchant sign-ups scaled tenfold.',
      challenge: 'Legacy Salesforce org was constantly hitting SOQL 101 governor limits due to recursive Apex triggers and 42 unoptimized Process Builders, causing lead drop-offs and a 4.5-hour sales rep response lag.',
      solution: 'Re-engineered the entire Salesforce architecture with a single-trigger framework, converted all Process Builders to bulkified sub-second Record-Triggered Flows, and deployed custom Lightning Web Components (LWC) for high-velocity qualification.',
      phases: [
        {
          title: 'Phase 1: Profiler Diagnostics & SOQL Optimization',
          desc: 'Identified query bottlenecks, bulkified DML operations, and eliminated circular trigger executions across core merchant objects.'
        },
        {
          title: 'Phase 2: Flow Consolidation & Async Processing',
          desc: 'Refactored 42 legacy Process Builders into streamlined, sub-second Record-Triggered Flows utilizing platform events for asynchronous workloads.'
        },
        {
          title: 'Phase 3: High-Velocity LWC Rep Workspace',
          desc: 'Engineered custom merchant qualification consoles that aggregate credit check APIs and contract generation into a unified screen.'
        }
      ],
      metrics: [
        { val: '9 min', lbl: 'Avg Lead Response' },
        { val: '+68%', lbl: 'Deal Close Rate' },
        { val: '100%', lbl: 'Governor Compliance' }
      ],
      techStack: ['Sales Cloud', 'Apex Trigger Framework', 'Flow Engine', 'Lightning Web Components (LWC)']
    },
    'case-mkt-healthtech': {
      domain: 'Digital Growth & CRO',
      domainClass: 'marketing',
      scale: 'HealthTech Enterprise • Specialized Diagnostics',
      title: 'Multi-Channel Performance Acquisition & Closed-Loop CRM Attribution',
      clientOverview: 'A specialized medical diagnostics provider required high-trust, compliant patient acquisition funnels connecting paid digital search directly into clinical booking calendars.',
      challenge: 'The organization was burning $80,000/month on generic search keywords with zero visibility into which marketing channels led to attended clinical consultations, resulting in inflated acquisition costs.',
      solution: 'Reconstructed Google Ads search architectures around high-intent medical queries, implemented closed-loop server-side GCLID conversion syncing into the CRM, and redesigned mobile landing pages for friction-free booking.',
      phases: [
        {
          title: 'Phase 1: Search Query Intent Restructuring',
          desc: 'Replaced broad keywords with high-intent phrase matching and segmented clinical categories by diagnostic urgency.'
        },
        {
          title: 'Phase 2: Server-Side Closed-Loop Attribution',
          desc: 'Engineered webhook listeners that send qualified CRM patient milestones back to Google Ads via Offline Conversion Tracking.'
        },
        {
          title: 'Phase 3: Mobile CRO & Calendar Integration',
          desc: 'Redesigned booking flows with real-time slot verification, cutting form abandonment by 42% on mobile devices.'
        }
      ],
      metrics: [
        { val: '4.6x', lbl: 'Attributed ROAS' },
        { val: '+185%', lbl: 'Booked Consultations' },
        { val: '-42%', lbl: 'Cost Per Lead (CPL)' }
      ],
      techStack: ['Google Ads PMax', 'Conversion Rate Optimization (CRO)', 'CRM Attribution', 'Meta Ads']
    },
    'case-zoho-manufacturing': {
      domain: 'Custom Zoho App',
      domainClass: 'zoho',
      scale: 'Industrial Manufacturing • 120 Field Engineers',
      title: 'Custom Field Service & Preventive Maintenance Offline Mobile App',
      clientOverview: 'A heavy industrial machinery manufacturer with over 120 dispatch technicians servicing critical plant infrastructure across North America.',
      challenge: 'Technicians relied on physical carbon forms and manual warehouse reorders, leading to 6-day repair turnarounds, inventory discrepancies, and $420,000 in lost parts annually.',
      solution: 'Engineered an offline-first custom Zoho Creator mobile app integrated directly with Zoho Inventory and Zoho CRM for real-time parts validation, automated barcode scanning, and client e-signatures.',
      phases: [
        {
          title: 'Phase 1: Field Workflow Journey Mapping',
          desc: 'Shadowed senior technicians to map offline edge cases, parts lookup schemas, and emergency dispatch routing protocols.'
        },
        {
          title: 'Phase 2: Bespoke Creator Offline App Development',
          desc: 'Constructed custom Deluge synchronization handlers with local SQLite caching for remote mining and industrial facilities without cellular service.'
        },
        {
          title: 'Phase 3: Inventory Integration & Fleet Deployment',
          desc: 'Provisioned 120 rugged field devices and integrated automated parts reorder triggers with central warehouse ERP systems.'
        }
      ],
      metrics: [
        { val: '100%', lbl: 'Paperless Field Ops' },
        { val: '-62%', lbl: 'Dispatch Latency' },
        { val: '$420k', lbl: 'Inventory Recovered' }
      ],
      techStack: ['Zoho Creator', 'Zoho Inventory', 'Deluge Offline Sync', 'REST Webhooks']
    },
    'case-sf-advisory': {
      domain: 'Salesforce Experience Cloud',
      domainClass: 'salesforce',
      scale: 'Global Advisory Firm • 800+ Partner Network',
      title: 'Partner Deal Registration & Self-Service Knowledge Community',
      clientOverview: 'An international management consultancy managing an external ecosystem of 800+ channel partners and regional advisory affiliates.',
      challenge: 'Affiliates experienced frequent channel conflict, duplicate deal registrations, and delayed commission payouts due to manual spreadsheet verification.',
      solution: 'Architected a secure Salesforce Experience Cloud partner portal with automated territory conflict detection, live commission tracking, and encrypted contract automation.',
      phases: [
        {
          title: 'Phase 1: Partner Role Hierarchy & Sharing Sets',
          desc: 'Designed granular data security architectures ensuring external affiliates only access their specific territory pipelines.'
        },
        {
          title: 'Phase 2: Automated Conflict Detection Engine',
          desc: 'Built custom LWC components that evaluate new deal submissions against existing active pipeline claims in real time.'
        },
        {
          title: 'Phase 3: Commission Engine & Document Generation',
          desc: 'Automated referral milestone payouts and integrated digital contract execution for expedited deal closes.'
        }
      ],
      metrics: [
        { val: '+240%', lbl: 'Registered Partner Leads' },
        { val: '85%', lbl: 'Self-Service Resolution' },
        { val: '12 Wks', lbl: 'Go-Live Deployment' }
      ],
      techStack: ['Experience Cloud', 'Custom LWC', 'Sharing Rules', 'Sales Cloud']
    },
    'case-mkt-edtech': {
      domain: 'Technical SEO & Growth',
      domainClass: 'marketing',
      scale: 'Enterprise EdTech • 2M+ Monthly Learners',
      title: 'Organic Topical Architecture & Automated Nurture Sequences',
      clientOverview: 'A global professional certification platform providing technical upskilling courses for Fortune 500 engineering teams.',
      challenge: 'Organic search growth had plateaued due to poor Core Web Vitals (LCP 4.8s) and unsegmented email nurture workflows with a 65% drop-off.',
      solution: 'Re-engineered technical frontend performance to 99/100 Core Web Vitals, mapped 18 authoritative B2B topic clusters, and created behavior-triggered email sequences based on course interaction telemetry.',
      phases: [
        {
          title: 'Phase 1: Core Web Vitals Engineering',
          desc: 'Refactored CSS and deferred JavaScript execution to achieve sub-second Largest Contentful Paint (LCP) and zero Cumulative Layout Shift (CLS).'
        },
        {
          title: 'Phase 2: Semantic Topical Authority Graph',
          desc: 'Architected programmatic topic hubs and structured schema markup covering 18 core technical certification disciplines.'
        },
        {
          title: 'Phase 3: Behavioral Telemetry Nurture Flows',
          desc: 'Configured automated lead nurturing that adapts curriculum recommendations based on video watch completion and practice quiz scores.'
        }
      ],
      metrics: [
        { val: '+290%', lbl: 'Organic Search Traffic' },
        { val: '5.2x', lbl: 'Email Nurture ROI' },
        { val: '99/100', lbl: 'Core Web Vitals' }
      ],
      techStack: ['Technical SEO', 'Content Architecture', 'Marketing Automation', 'Core Web Vitals']
    }
  };

  // ---------------------------------------------------------------------------
  // 2. FILTER & SEARCH CONTROLLER
  // ---------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.cs-filter-btn');
  const searchInput = document.getElementById('csSearchInput');
  const spotlightCard = document.querySelector('.cs-spotlight-card');
  const bentoCards = document.querySelectorAll('.cs-bento-card');
  const noResultsMsg = document.getElementById('csNoResults');
  
  const allCards = [];
  if (spotlightCard) allCards.push(spotlightCard);
  bentoCards.forEach(c => allCards.push(c));

  let activeFilter = 'all';
  let searchQuery = '';

  function updateCounts() {
    const counts = { all: 0, zoho: 0, salesforce: 0, marketing: 0 };
    allCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      counts.all++;
      if (counts[cat] !== undefined) counts[cat]++;
    });

    document.querySelectorAll('.cs-count-badge').forEach(badge => {
      const target = badge.getAttribute('data-count-target');
      if (counts[target] !== undefined) {
        badge.textContent = counts[target];
      }
    });
  }

  function applyFilters() {
    let visibleCount = 0;

    allCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const text = card.textContent.toLowerCase();

      const matchesCategory = (activeFilter === 'all' || category === activeFilter);
      const matchesSearch = (searchQuery === '' || text.includes(searchQuery));

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        card.style.opacity = '1';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });

    if (noResultsMsg) {
      if (visibleCount === 0) {
        noResultsMsg.classList.add('visible');
      } else {
        noResultsMsg.classList.remove('visible');
      }
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  updateCounts();

  // ---------------------------------------------------------------------------
  // 3. ARCHITECTURE BREAKDOWN MODAL LOGIC
  // ---------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('csModalBackdrop');
  const modalCloseBtn = document.getElementById('csModalCloseBtn');
  const modalDomainBadge = document.getElementById('csModalDomain');
  const modalScale = document.getElementById('csModalScale');
  const modalTitle = document.getElementById('csModalTitle');
  const modalOverview = document.getElementById('csModalOverview');
  const modalChallenge = document.getElementById('csModalChallenge');
  const modalSolution = document.getElementById('csModalSolution');
  const modalTimeline = document.getElementById('csModalTimeline');
  const modalMetricsGrid = document.getElementById('csModalMetrics');
  const modalTechStack = document.getElementById('csModalTechStack');

  function openModal(caseKey) {
    const data = caseDetailsData[caseKey];
    if (!data || !modalBackdrop) return;

    if (modalDomainBadge) {
      modalDomainBadge.textContent = data.domain;
      modalDomainBadge.className = `cs-tag-domain ${data.domainClass}`;
    }
    if (modalScale) modalScale.textContent = data.scale;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalOverview) modalOverview.textContent = data.clientOverview;
    if (modalChallenge) modalChallenge.textContent = data.challenge;
    if (modalSolution) modalSolution.textContent = data.solution;

    // Timeline phases
    if (modalTimeline) {
      modalTimeline.innerHTML = '';
      data.phases.forEach(phase => {
        const stepEl = document.createElement('div');
        stepEl.className = 'cs-timeline-step';
        stepEl.innerHTML = `
          <div class="cs-timeline-dot"></div>
          <h4 class="cs-step-title">${phase.title}</h4>
          <p class="cs-step-desc">${phase.desc}</p>
        `;
        modalTimeline.appendChild(stepEl);
      });
    }

    // Metrics grid
    if (modalMetricsGrid) {
      modalMetricsGrid.innerHTML = '';
      data.metrics.forEach(m => {
        const chip = document.createElement('div');
        chip.className = 'cs-metric-chip';
        chip.innerHTML = `
          <div class="cs-metric-val" style="color: #2563EB;">${m.val}</div>
          <div class="cs-metric-lbl">${m.lbl}</div>
        `;
        modalMetricsGrid.appendChild(chip);
      });
    }

    // Tech tags
    if (modalTechStack) {
      modalTechStack.innerHTML = '';
      data.techStack.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'cs-tech-tag';
        tag.textContent = tech;
        modalTechStack.appendChild(tag);
      });
    }

    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Open triggers
  document.querySelectorAll('.js-open-case-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const caseKey = btn.getAttribute('data-case-id');
      if (caseKey) openModal(caseKey);
    });
  });

  // Close triggers
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('is-open')) {
      closeModal();
    }
  });
});
