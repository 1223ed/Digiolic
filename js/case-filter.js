/**
 * Digiolic Enterprise Case Stories
 * Live Category Filtering, Real-time Search, and Architecture Breakdown Modal Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. DATA REPOSITORY FOR ARCHITECTURE BREAKDOWN MODAL
  // ---------------------------------------------------------------------------
  const caseDetailsData = {
    'case-nz-immigration': {
      domain: 'Zoho CRM, Forms & Social',
      domainClass: 'zoho',
      company: 'NZ Immigration',
      location: 'New Zealand',
      scale: 'New Zealand • 10+ Lakh Records Migrated',
      title: 'NZ Immigration: Centralized Student Lifecycle Architecture & 10+ Lakh Record Migration',
      clientOverview: 'NZ Immigration is a premier education and immigration consultancy based in New Zealand, facilitating study abroad admissions, student counseling, university offers, visas, work permits, and final career placements across multiple international offices.',
      challenge: [
        'Managing student enquiries and applications from multiple channels in a centralized system.',
        'Tracking students across the complete journey — enquiry, counselling, university application, offer, visa, work permit, and final placement.',
        'Manual follow-ups and processes leading to delays and missed student interactions.',
        'Limited visibility into counsellor performance, application status, lead sources, and conversion rates.',
        'Migrating and consolidating 10+ lakh existing student and application records while maintaining data accuracy, integrity, and historical information.'
      ],
      solution: [
        'Implemented an end-to-end Zoho CRM solution with customized modules, layouts, subforms, workflows, validation rules, and approval processes.',
        'Developed Blueprints and Deluge custom functions to automate lead assignment, follow-ups, application stages, notifications, validations, and business processes.',
        'Successfully migrated and consolidated 10+ lakh records using data mapping, transformation, deduplication, validation, and bulk migration techniques.',
        'Integrated Zoho Social, APIs, and webhooks to capture social media leads and synchronize data across CRM and external systems.',
        'Built custom dashboards, reports, role-based access, and analytics to provide real-time visibility into counsellor performance, applications, lead sources, conversions, and visa progress.'
      ],
      phases: [
        {
          title: 'Phase 1: 10+ Lakh Record Sanitization & Migration',
          desc: 'Mapped complex legacy student data, executed multi-level deduplication algorithms, and bulk-migrated 10+ lakh historical records with 100% data integrity.'
        },
        {
          title: 'Phase 2: Full-Lifecycle Journey Blueprints & Automation',
          desc: 'Engineered Deluge blueprints enforcing stage progression across inquiry, counselor assignment, university offers, visa applications, and placements.'
        },
        {
          title: 'Phase 3: Omnichannel Lead Capture & Executive BI',
          desc: 'Synchronized Zoho Social and webhook listeners for real-time lead capture alongside role-based counselor performance dashboards.'
        }
      ],
      metrics: [
        { val: '10L+', lbl: 'Records Consolidated' },
        { val: '360°', lbl: 'Student Journey Visibility' },
        { val: '100%', lbl: 'Stage Automation' }
      ],
      benefits: [
        '360° view of every student from initial enquiry through admission and visa processing.',
        'Reduced manual work and improved follow-up efficiency through automation.',
        'Better tracking of applications, scholarships, university admissions, and visa stages.',
        'Improved coordination between counselling, sales, application, and marketing teams.',
        'Increased visibility into lead sources and social media campaign performance.',
        'Faster response times and more structured student engagement.',
        'Real-time dashboards helped management make data-driven business decisions.'
      ],
      techStack: ['Zoho CRM', 'Zoho Form', 'Zoho Social', 'Zoho Workdrive', 'Deluge Blueprints', 'REST Webhooks']
    },

    'case-blume-labs': {
      domain: 'Zoho CRM & Zoho Books',
      domainClass: 'zoho',
      company: 'Blume Labs',
      location: 'Bangalore',
      scale: 'Bangalore • Technology & Engineering Services',
      title: 'Blume Labs: Bridging Sales-Finance Silos via Automated CRM & Zoho Books Integration',
      clientOverview: 'Blume Labs is a Bangalore-based technology and software development company managing high-growth client accounts, multi-tier tech service milestones, and retainer contracts.',
      challenge: [
        'Sales-Finance Silos: Disconnected systems cause communication gaps and delayed invoicing after closing deals.',
        'Manual Data Entry Errors: Typing client and project details into Zoho Books leads to billing mistakes.',
        'No Real-Time Payment Tracking: Sales reps must chase finance or log into Books to check if invoices are paid.',
        'Complex Billing Structures: Managing tech service milestones and retainers manually across systems is difficult.',
        'Fragmented Financial Reporting: Lack of a unified dashboard makes cash flow forecasting and pipeline projections hard.'
      ],
      solution: [
        'Automated Invoicing: Moving deals to "Closed Won" in CRM automatically generates invoices in Books.',
        'Two-Way Database Sync: Client and contact updates in CRM instantly sync over to Zoho Books.',
        'In-CRM Financial Visibility: Embed Zoho Books payment statuses and overdue alerts directly inside CRM layouts.',
        'Milestone Workflows: Configure CRM workflows to auto-generate invoices as project milestones are completed.',
        'Unified Dashboards: Combine CRM sales pipelines and Zoho Books revenue reports into a single view.'
      ],
      phases: [
        {
          title: 'Phase 1: Bidirectional Account & Contact Synchronization',
          desc: 'Configured automated real-time synchronization between Zoho CRM and Zoho Books to eliminate double entry of customer details.'
        },
        {
          title: 'Phase 2: Closed-Won & Milestone Automated Billing',
          desc: 'Architected custom Deluge triggers generating draft and final invoices in Zoho Books the moment project milestones are approved in CRM.'
        },
        {
          title: 'Phase 3: In-CRM Payment Alerts & Unified Revenue Dashboards',
          desc: 'Embedded live payment receipt badges and overdue notices inside CRM rep views alongside blended pipeline and cash-flow reporting.'
        }
      ],
      metrics: [
        { val: 'Instant', lbl: 'Invoice Generation' },
        { val: 'Zero', lbl: 'Manual Data Entry Errors' },
        { val: '100%', lbl: 'Payment Visibility' }
      ],
      benefits: [
        'Faster Cash Flow: Immediate invoicing speeds up the order-to-cash cycle and boosts liquidity.',
        'Zero Manual Effort: Automation eliminates data entry, saving time for billable tech work.',
        'Better Team Alignment: Sales reps can see billing histories to avoid pitching clients with overdue accounts.',
        'Improved Client Experience: Prompt, error-free invoices enhance professionalism and trust.',
        'Informed Decision-Making: Management gets clear, real-time insights for resource and financial planning.'
      ],
      techStack: ['Zoho CRM', 'Zoho Books', 'Finance-CRM Sync', 'Milestone Workflows', 'Cash Flow Intelligence']
    },

    'case-indiqube': {
      domain: 'Omnichannel Workspace CRM',
      domainClass: 'zoho',
      company: 'IndiQube',
      location: 'Bangalore',
      scale: 'Bangalore • Smart Managed Workspaces',
      title: 'IndiQube: Omnichannel Workspace Inbound, Telephony & WhatsApp Lead Automation',
      clientOverview: 'IndiQube is one of India\'s largest commercial managed workspace and commercial office providers, operating millions of square feet for high-growth enterprises and startups.',
      challenge: [
        'Managing high volumes of prospective tenant inquiries scattered across WhatsApp, telephony, and web forms without losing lead context.',
        'Delays in tour bookings and membership follow-ups caused by manual data entry across disconnected communication channels.',
        'Inability to track agent call recordings, chat histories, and interaction notes directly inside individual CRM lead profiles.',
        'Low conversion rates on manual email campaigns for hot desk renewals and private cabin upgrade pitches.',
        'Fragmented member data making it difficult to deliver personalized workspace experiences and targeted retention offers.'
      ],
      solution: [
        'Centralize all inbound inquiries from WhatsApp, telephony channels, and marketing campaigns directly into Zoho CRM as unified leads.',
        'Automate instant lead assignment and task creation triggered immediately upon missed calls or incoming WhatsApp inquiries.',
        'Integrate cloud telephony and WhatsApp business APIs natively into Zoho CRM for one-click calling and unified chat logs.',
        'Utilize Zoho Campaigns to launch automated, behavior-driven drip sequences based on user interaction history inside the CRM.',
        'Deploy custom multi-module workflows to segment members by space type and contract duration for precise campaign targeting.'
      ],
      phases: [
        {
          title: 'Phase 1: Cloud Telephony & WhatsApp CTI Integration',
          desc: 'Unified all incoming calls and WhatsApp inquiries into Zoho CRM with automated lead creation and call recording storage.'
        },
        {
          title: 'Phase 2: Instant Round-Robin Routing & Site Tour Workflows',
          desc: 'Built instant notification engines that assign missed calls and inquiries to community managers within 90 seconds.'
        },
        {
          title: 'Phase 3: Zoho Campaigns Member Retention & Renewal Drips',
          desc: 'Deployed targeted automated nurture flows segmented by desk count, lease duration, and upcoming renewal deadlines.'
        }
      ],
      metrics: [
        { val: '< 2 min', lbl: 'Lead Response Time' },
        { val: '100%', lbl: 'Call & Chat Logging' },
        { val: '+45%', lbl: 'Tour-to-Booking' }
      ],
      benefits: [
        'Blazingly fast lead response times that significantly increase tour-to-booking conversion rates for prospective tenants.',
        'Complete visibility over all sales communications with automated logging of every phone call, WhatsApp chat, and campaign touchpoint.',
        'Elimination of manual data entry errors, freeing up community managers to focus on high-touch client relationships.',
        'Improved member retention and lower churn rates through timely, automated renewal reminders and membership engagement campaigns.',
        'Scalable workspace operations supported by a streamlined ecosystem capable of handling multi-location expansion effortlessly.'
      ],
      techStack: ['Zoho CRM', 'Zoho Campaign', 'WhatsApp Business API', 'Cloud Telephony CTI', 'Custom Blueprints']
    },

    'case-manu-company': {
      domain: 'Finance & Multi-Currency Billing',
      domainClass: 'zoho',
      company: 'Manu Company',
      location: 'Bangalore',
      scale: 'Bangalore • Industrial & Manufacturing Commerce',
      title: 'Manu Company: Centralized Multi-Currency Accounting, Invoicing & Tax Automation',
      clientOverview: 'Manu Company is an established Bangalore-based manufacturing enterprise providing industrial components and equipment across international and domestic trade partners in multiple foreign currencies.',
      challenge: [
        'Managing manual multi-currency billing and complex financial compliance without a unified system.',
        'Delayed invoicing cycles and slow collections causing cash flow bottlenecks.',
        'High risk of human error and reconciliation discrepancies during recurring transactions.',
        'Lack of real-time visibility into profit margins and outstanding receivables.',
        'Operational delays caused by tedious manual entry of payments and expenses.'
      ],
      solution: [
        'Centralize accounting, billing, and invoicing workflows using Zoho Books and Zoho Invoice.',
        'Automate recurring billing schedules and collection reminders.',
        'Implement automated tax calculation engines to ensure compliance.',
        'Set up real-time payment gateway integrations with instant receipt logging.',
        'Utilize integrated dashboards to track core financial metrics continuously.'
      ],
      phases: [
        {
          title: 'Phase 1: Multi-Currency Chart of Accounts & Tax Rules',
          desc: 'Configured automated foreign currency exchange rates, GST/TDS tax calculation engines, and unified general ledger structures.'
        },
        {
          title: 'Phase 2: Recurring Invoicing & Payment Gateway Integration',
          desc: 'Implemented auto-recurring invoice generation, automated payment link delivery, and instant reconciliation with banking feeds.'
        },
        {
          title: 'Phase 3: Receivables Analytics & Margin Dashboards',
          desc: 'Constructed real-time financial health dashboards detailing aging accounts receivable, cash liquidity, and gross margin per product line.'
        }
      ],
      metrics: [
        { val: 'Multi-Cur', lbl: 'Automated Billing' },
        { val: '100%', lbl: 'Statutory Compliance' },
        { val: '-60%', lbl: 'Collection Lag' }
      ],
      benefits: [
        'Accelerated cash flow through automated payment reminders and instant delivery.',
        'Minimized compliance risks and complete financial accuracy via automated tax calculations.',
        'Significant time savings by eliminating manual data entry tasks.',
        'Enhanced client experience with professional invoices and seamless online payments.',
        'Real-time visibility into company profitability and financial health.'
      ],
      techStack: ['Zoho Books', 'Zoho Invoice', 'Payment Gateway APIs', 'Tax Automation Engine', 'Financial BI']
    },

    'case-fyx': {
      domain: 'Digital Lending & FinTech',
      domainClass: 'zoho',
      company: 'FYX',
      location: 'Australia',
      scale: 'Australia • Commercial & Consumer Lending',
      title: 'FYX: Paperless Digital Loan Origination, KYC Pipeline & Zoho Sign Execution',
      clientOverview: 'FYX is a forward-thinking Australian financial services and lending provider delivering flexible credit products, business financing, and consumer loans nationwide.',
      challenge: [
        'Managing scattered loan inquiries without a unified tracking system.',
        'High application drop-off rates caused by delayed document collection and follow-ups.',
        'Friction in passing applicant details and uploaded documents straight into sales pipelines.',
        'Limited centralized visibility into credit verification stages and approval bottlenecks.',
        'Slow loan agreement execution and manual delays in collecting verified signatures from borrowers.'
      ],
      solution: [
        'Implement Zoho CRM and Zoho Forms to instantly capture applications from digital touchpoints.',
        'Configure automated workflow rules to route leads directly to appropriate loan officers.',
        'Embed file upload fields in forms to auto-attach KYC documents and bank statements to CRM profiles.',
        'Set up automated notification triggers to keep applicants updated at every pipeline stage.',
        'Integrate Zoho Sign to trigger and collect secure digital signatures on loan documents directly from the CRM.'
      ],
      phases: [
        {
          title: 'Phase 1: Digital Application & KYC Document Vault',
          desc: 'Designed dynamic responsive Zoho Forms capturing borrower criteria and securely attaching identity proofs directly to CRM deals.'
        },
        {
          title: 'Phase 2: Automated Loan Officer Routing & Stage Triggers',
          desc: 'Configured automated assignment based on loan size and triggered multi-channel status updates during underwriting and verification.'
        },
        {
          title: 'Phase 3: Native Zoho Sign E-Contract Automation',
          desc: 'Integrated Zoho Sign to automatically populate approved loan agreements and collect legally binding borrower signatures in minutes.'
        }
      ],
      metrics: [
        { val: '3x Faster', lbl: 'Application Velocity' },
        { val: '100%', lbl: 'Paperless KYC Vault' },
        { val: '< 24 Hrs', lbl: 'Contract Execution' }
      ],
      benefits: [
        'Accelerated loan processing times that significantly increase conversion rates.',
        'Paperless data collection that eliminates manual entry errors and misplaced documents.',
        'Complete end-to-end visibility over the entire loan lifecycle from inquiry to disbursement.',
        'Faster agreement turnarounds and legally binding contract execution using Zoho Sign.',
        'Increased operational efficiency allowing teams to handle higher application volumes effortlessly.'
      ],
      techStack: ['Zoho CRM', 'Zoho Sign', 'Zoho Form', 'Document Vault', 'Underwriting Workflows']
    },

    'case-chanakya-university': {
      domain: 'Higher Education Admissions',
      domainClass: 'zoho',
      company: 'Chanakya University',
      location: 'Bangalore',
      scale: 'Bangalore • Premier Multi-Disciplinary Campus',
      title: 'Chanakya University: Centralized Admissions Funnel & Counselor Velocity System',
      clientOverview: 'Chanakya University is an esteemed multidisciplinary university located in Bangalore, offering innovative undergraduate, postgraduate, and doctoral degrees across technology, business, and humanities.',
      challenge: [
        'Managing scattered student inquiries without a unified tracking database.',
        'Delayed follow-ups and slow counseling responses reducing conversion rates.',
        'Inability to track student journeys across counseling and enrollment stages.',
        'Fragmented communication history between admission teams and students.',
        'Lack of real-time visibility into counselor performance and admission pipelines.'
      ],
      solution: [
        'Deploy Zoho CRM as the central hub to capture and manage prospective student inquiries.',
        'Configure automated assignment rules to ensure instant counselor outreach.',
        'Utilize customized CRM pipelines to monitor every stage of the student journey.',
        'Integrate communication tools to log all interactions directly inside student profiles.',
        'Build role-based dashboards to track counselor performance and enrollment metrics.'
      ],
      phases: [
        {
          title: 'Phase 1: Inbound Admissions Capture & Deduplication',
          desc: 'Unified all website forms, academic portals, and campaign inquiries into a centralized Zoho CRM prospective student repository.'
        },
        {
          title: 'Phase 2: Automated Counselor Allocation & Lifecycle Stages',
          desc: 'Engineered round-robin routing rules mapped to academic streams and built stage-by-stage pipelines tracking counseling through enrollment.'
        },
        {
          title: 'Phase 3: Real-Time Admissions Telemetry & Communication Logs',
          desc: 'Embedded omni-channel interaction logging inside student profiles and built leadership dashboards monitoring conversion velocity.'
        }
      ],
      metrics: [
        { val: 'Instant', lbl: 'Counselor Allocation' },
        { val: '360°', lbl: 'Admission Lifecycle' },
        { val: '+55%', lbl: 'Conversion Velocity' }
      ],
      benefits: [
        'Accelerated response times that significantly increase student engagement.',
        'Complete 360-degree visibility over the entire admission lifecycle.',
        'Enhanced productivity through automated task assignment and workflow triggers.',
        'Improved cross-departmental collaboration between marketing and counseling.',
        'Data-driven decision making powered by real-time analytics.'
      ],
      techStack: ['Zoho CRM', 'Academic Pipelines', 'Counselor Dashboards', 'Lead Routing Rules', 'Interaction Logging']
    },

    'case-rahul-hr': {
      domain: 'HRMS, Talent & Payroll',
      domainClass: 'zoho',
      company: 'Rahul',
      location: 'Bangalore',
      scale: 'Bangalore • Corporate Enterprise Workforce',
      title: 'Rahul: Unified Recruit-to-Payroll Integration (Recruit, People & Payroll)',
      clientOverview: 'Rahul is an expanding enterprise organization in Bangalore managing multi-departmental corporate teams, high-velocity talent recruitment, and complex shift-based payroll cycles.',
      challenge: [
        'Managing disconnected recruitment, HR, and payroll workflows across siloed systems without centralized data sharing.',
        'Tedious manual data entry when transferring newly hired candidates from recruitment systems into employee databases.',
        'Complex payroll processing errors caused by manual reconciliation of attendance, leave records, and salary structures.',
        'Lack of visibility into hiring pipelines, time-to-hire metrics, and overall workforce administration costs.',
        'Delays in onboarding new hires and initializing their active payroll profiles smoothly.'
      ],
      solution: [
        'Implement an integrated ecosystem connecting Zoho Recruit, Zoho People, and Zoho Payroll into a unified platform.',
        'Automate the conversion of successfully hired candidates in Zoho Recruit directly into employee profiles in Zoho People.',
        'Sync attendance, shift, and leave management data from Zoho People automatically with Zoho Payroll.',
        'Configure automated payroll calculation and tax compliance rules within Zoho Payroll for error-free disbursements.',
        'Utilize integrated dashboards across the suite to track recruitment metrics, headcount, and payroll expenditures in real time.'
      ],
      phases: [
        {
          title: 'Phase 1: Zoho Recruit Pipeline & Automated Conversion',
          desc: 'Configured end-to-end applicant tracking in Zoho Recruit with one-click conversion of accepted offers into Zoho People employee records.'
        },
        {
          title: 'Phase 2: Core HR, Attendance & Shift Automation',
          desc: 'Implemented biometric/mobile attendance, multi-tier shift rosters, and statutory leave policies in Zoho People.'
        },
        {
          title: 'Phase 3: Automated Payroll Calculation & Self-Service',
          desc: 'Synchronized verified attendance directly into Zoho Payroll for zero-error salary disbursements, tax calculations, and employee self-service portals.'
        }
      ],
      metrics: [
        { val: '100%', lbl: 'Payroll Accuracy' },
        { val: 'Zero', lbl: 'Manual Data Re-Entry' },
        { val: 'Instant', lbl: 'New-Hire Onboarding' }
      ],
      benefits: [
        'Eliminated administrative overhead and redundant manual data entry through seamless cross-application synchronization.',
        'Accelerated onboarding turnarounds that instantly transition candidate hires into active, managed employees.',
        '100% accuracy in payroll processing and statutory compliance through automated attendance and leave integration.',
        'Improved visibility into workforce operations, recruitment efficiency, and monthly salary expenses.',
        'Enhanced employee experience via transparent self-service portals for leave tracking, attendance, and pay slip access.'
      ],
      techStack: ['Zoho People', 'Zoho Payroll', 'Zoho Recruit', 'Employee Self-Service', 'Tax Compliance Engine']
    }
  };

  // ---------------------------------------------------------------------------
  // 2. FILTER & SEARCH CONTROLLER
  // ---------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.cs-filter-btn');
  const searchInput = document.getElementById('csSearchInput');
  const bentoCards = document.querySelectorAll('.cs-bento-card');
  const noResultsMsg = document.getElementById('csNoResults');
  
  const allCards = Array.from(bentoCards);

  let activeFilter = 'all';
  let searchQuery = '';

  function updateCounts() {
    const counts = { all: allCards.length, crm: 0, finance: 0, hr: 0 };
    allCards.forEach(card => {
      const cats = (card.getAttribute('data-category') || '').split(' ');
      cats.forEach(c => {
        if (counts[c] !== undefined) counts[c]++;
      });
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
      const cats = (card.getAttribute('data-category') || '').split(' ');
      const text = card.textContent.toLowerCase();

      const matchesCategory = (activeFilter === 'all' || cats.includes(activeFilter));
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
  const modalBenefits = document.getElementById('csModalBenefits');
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

    // Challenge formatted list
    if (modalChallenge) {
      if (Array.isArray(data.challenge)) {
        modalChallenge.innerHTML = '<ul style="margin:0; padding-left:1.15rem; display:flex; flex-direction:column; gap:0.45rem;">' +
          data.challenge.map(c => `<li style="line-height:1.55;">${c}</li>`).join('') + '</ul>';
      } else {
        modalChallenge.innerHTML = data.challenge;
      }
    }

    // Solution formatted list
    if (modalSolution) {
      if (Array.isArray(data.solution)) {
        modalSolution.innerHTML = '<ul style="margin:0; padding-left:1.15rem; display:flex; flex-direction:column; gap:0.45rem;">' +
          data.solution.map(s => `<li style="line-height:1.55;">${s}</li>`).join('') + '</ul>';
      } else {
        modalSolution.innerHTML = data.solution;
      }
    }

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

    // Business Benefits list
    if (modalBenefits) {
      if (data.benefits && data.benefits.length) {
        modalBenefits.innerHTML = `
          <h5 style="font-size:0.8rem; font-weight:800; color:#0F172A; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 0.75rem 0;">Key Business Outcomes</h5>
          <ul style="margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:0.5rem;">
            ${data.benefits.map(b => `
              <li style="display:flex; align-items:flex-start; gap:0.55rem; line-height:1.5; font-size:0.92rem; color:#1E293B;">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="#059669" style="flex-shrink:0; margin-top:2px;">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>${b}</span>
              </li>
            `).join('')}
          </ul>
        `;
        modalBenefits.style.display = 'block';
      } else {
        modalBenefits.style.display = 'none';
      }
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
