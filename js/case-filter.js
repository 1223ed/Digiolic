/**
 * Digiolic Enterprise Case Studies
 * Clean Box Design (Image 2) & Focused Case Breakdown Modal Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------------------------------------------------------------------
  // 1. DATA REPOSITORY FOR CASE STUDY DETAIL MODAL
  // ---------------------------------------------------------------------------
  const caseDetailsData = {
    'case-nz-immigration': {
      company: 'NZ Immigration',
      location: 'New Zealand',
      products: 'Zoho CRM, Zoho Form, Zoho Social, Zoho Workdrive',
      description: 'NZ Immigration is a premier education and immigration consultancy based in New Zealand, facilitating study abroad admissions, student counseling, university offers, visas, work permits, and final career placements across multiple international offices.',
      challenges: [
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
      benefits: [
        '360° view of every student from initial enquiry through admission and visa processing.',
        'Reduced manual work and improved follow-up efficiency through automation.',
        'Better tracking of applications, scholarships, university admissions, and visa stages.',
        'Improved coordination between counselling, sales, application, and marketing teams.',
        'Increased visibility into lead sources and social media campaign performance.',
        'Faster response times and more structured student engagement.',
        'Real-time dashboards helped management make data-driven business decisions.'
      ]
    },

    'case-blume-labs': {
      company: 'Blume Labs',
      location: 'Bangalore',
      products: 'Zoho CRM, Zoho Books',
      description: 'Blume Labs is an innovative technology services and engineering firm based in Bangalore, providing software solutions, tech consulting retainers, and milestone-based development projects.',
      challenges: [
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
      benefits: [
        'Faster Cash Flow: Immediate invoicing speeds up the order-to-cash cycle and boosts liquidity.',
        'Zero Manual Effort: Automation eliminates data entry, saving time for billable tech work.',
        'Better Team Alignment: Sales reps can see billing histories to avoid pitching clients with overdue accounts.',
        'Improved Client Experience: Prompt, error-free invoices enhance professionalism and trust.',
        'Informed Decision-Making: Management gets clear, real-time insights for resource and financial planning.'
      ]
    },

    'case-indiqube': {
      company: 'IndiQube',
      location: 'Bangalore',
      products: 'Zoho CRM, Zoho Campaign, 3rd party Whatsapp, Telephonic Integration',
      description: 'IndiQube is a leading enterprise flexible workspace and coworking network based in Bangalore, delivering tailored office spaces, private cabins, and dynamic work environments across India.',
      challenges: [
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
      benefits: [
        'Blazingly fast lead response times that significantly increase tour-to-booking conversion rates for prospective tenants.',
        'Complete visibility over all sales communications with automated logging of every phone call, WhatsApp chat, and campaign touchpoint.',
        'Elimination of manual data entry errors, freeing up community managers to focus on high-touch client relationships.',
        'Improved member retention and lower churn rates through timely, automated renewal reminders and membership engagement campaigns.',
        'Scalable workspace operations supported by a streamlined ecosystem capable of handling multi-location expansion effortlessly.'
      ]
    },

    'case-manu-company': {
      company: 'Manu Company Name',
      location: 'Bangalore',
      products: 'Zoho Books, Zoho Invoice',
      description: 'Manu Company is an expanding commercial business based in Bangalore managing multi-currency global transactions, recurring service billing, and enterprise financial compliance.',
      challenges: [
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
      benefits: [
        'Accelerated cash flow through automated payment reminders and instant delivery.',
        'Minimized compliance risks and complete financial accuracy via automated tax calculations.',
        'Significant time savings by eliminating manual data entry tasks.',
        'Enhanced client experience with professional invoices and seamless online payments.',
        'Real-time visibility into company profitability and financial health.'
      ]
    },

    'case-fyx': {
      company: 'FYX',
      location: 'Australia',
      products: 'Zoho CRM, Zoho Sign, Zoho Form',
      description: 'FYX is a forward-thinking Australian financial services and digital lending provider delivering commercial credit, consumer loans, and instant loan origination solutions nationwide.',
      challenges: [
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
      benefits: [
        'Accelerated loan processing times that significantly increase conversion rates.',
        'Paperless data collection that eliminates manual entry errors and misplaced documents.',
        'Complete end-to-end visibility over the entire loan lifecycle from inquiry to disbursement.',
        'Faster agreement turnarounds and legally binding contract execution using Zoho Sign.',
        'Increased operational efficiency allowing teams to handle higher application volumes effortlessly.'
      ]
    },

    'case-chanakya-university': {
      company: 'Chanakya University',
      location: 'Bangalore',
      products: 'Zoho CRM',
      description: 'Chanakya University is a multidisciplinary higher education institution based in Bangalore dedicated to academic excellence, student admissions, and streamlined counseling journeys.',
      challenges: [
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
      benefits: [
        'Accelerated response times that significantly increase student engagement.',
        'Complete 360-degree visibility over the entire admission lifecycle.',
        'Enhanced productivity through automated task assignment and workflow triggers.',
        'Improved cross-departmental collaboration between marketing and counseling.',
        'Data-driven decision making powered by real-time analytics.'
      ]
    },

    'case-rahul-hr': {
      company: 'Rahul',
      location: 'Bangalore',
      products: 'Zoho People, Zoho Payroll, Zoho Recruit',
      description: 'Rahul is an enterprise corporate organization based in Bangalore managing extensive multi-departmental workforce recruitment, human resources, and monthly payroll operations.',
      challenges: [
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
      benefits: [
        'Eliminated administrative overhead and redundant manual data entry through seamless cross-application synchronization.',
        'Accelerated onboarding turnarounds that instantly transition candidate hires into active, managed employees.',
        '100% accuracy in payroll processing and statutory compliance through automated attendance and leave integration.',
        'Improved visibility into workforce operations, recruitment efficiency, and monthly salary expenses.',
        'Enhanced employee experience via transparent self-service portals for leave tracking, attendance, and pay slip access.'
      ]
    }
  };

  // ---------------------------------------------------------------------------
  // 2. FILTER & SEARCH CONTROLLER
  // ---------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.cs-filter-btn');
  const searchInput = document.getElementById('csSearchInput');
  const caseBoxes = document.querySelectorAll('.cs-clean-box-card, .cs-bento-card');
  const noResultsMsg = document.getElementById('csNoResults');
  
  const allCards = Array.from(caseBoxes);

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
  // 3. READ MORE DETAIL MODAL LOGIC (Exact content as requested)
  // ---------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('csModalBackdrop');
  const modalCloseBtn = document.getElementById('csModalCloseBtn');
  const modalLocation = document.getElementById('csModalLocation');
  const modalProducts = document.getElementById('csModalProducts');
  const modalTitle = document.getElementById('csModalTitle');
  const modalOverview = document.getElementById('csModalOverview');
  const modalChallenge = document.getElementById('csModalChallenge');
  const modalSolution = document.getElementById('csModalSolution');
  const modalBenefits = document.getElementById('csModalBenefits');

  function openModal(caseKey) {
    const data = caseDetailsData[caseKey];
    if (!data || !modalBackdrop) return;

    if (modalTitle) modalTitle.textContent = data.company;
    if (modalLocation) modalLocation.textContent = `📍 Location: ${data.location}`;
    if (modalProducts) modalProducts.textContent = `Zoho Products: ${data.products}`;
    
    // Top: Company description
    if (modalOverview) {
      modalOverview.textContent = data.description;
    }

    // Key Challenges
    if (modalChallenge) {
      modalChallenge.innerHTML = `
        <ul class="cs-modal-list">
          ${data.challenges.map(c => `<li>${c}</li>`).join('')}
        </ul>
      `;
    }

    // Solution
    if (modalSolution) {
      modalSolution.innerHTML = `
        <ul class="cs-modal-list">
          ${data.solution.map(s => `<li>${s}</li>`).join('')}
        </ul>
      `;
    }

    // Business Benefits
    if (modalBenefits) {
      modalBenefits.innerHTML = `
        <ul class="cs-modal-list">
          ${data.benefits.map(b => `<li>${b}</li>`).join('')}
        </ul>
      `;
    }

    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // Open triggers on "Read More" buttons
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
