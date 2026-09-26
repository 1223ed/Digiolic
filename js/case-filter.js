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
      description: 'New Zealand immigration consultants who assess your immigration situation, establish eligibility, gather information, identify barriers, evaluate options, give immigration NZ provide, and then represent you throughout the immigration application process in a professional, ethical and responsible manner to ensure the best possible outcome.',
      challenges: [
        '<strong>Centralized Lead Ingestion:</strong> Managing student enquiries and applications from multiple channels in a centralized system.',
        '<strong>End-to-End Journey Tracking:</strong> Tracking students across the complete journey — enquiry, counselling, university application, offer, visa, work permit, and final placement.',
        '<strong>Automated Follow-up Slashes Delays:</strong> Manual follow-ups and processes leading to delays and missed student interactions.',
        '<strong>Counsellor & Pipeline Visibility:</strong> Limited visibility into counsellor performance, application status, lead sources, and conversion rates.',
        '<strong>10+ Lakh Legacy Data Consolidation:</strong> Migrating and consolidating 10+ lakh existing student and application records while maintaining data accuracy, integrity, and historical information.'
      ],
      solution: [
        '<strong>Customized Zoho CRM Architecture:</strong> Implemented an end-to-end Zoho CRM solution with customized modules, layouts, subforms, workflows, validation rules, and approval processes.',
        '<strong>Blueprints & Deluge Functions:</strong> Developed Blueprints and Deluge custom functions to automate lead assignment, follow-ups, application stages, notifications, validations, and business processes.',
        '<strong>Mass Scale 10+ Lakh Migration:</strong> Successfully migrated and consolidated 10+ lakh records using data mapping, transformation, deduplication, validation, and bulk migration techniques.',
        '<strong>Zoho Social & Webhook Integration:</strong> Integrated Zoho Social, APIs, and webhooks to capture social media leads and synchronize data across CRM and external systems.',
        '<strong>Executive Real-Time Dashboards:</strong> Built custom dashboards, reports, role-based access, and analytics to provide real-time visibility into counsellor performance, applications, lead sources, conversions, and visa progress.'
      ],
      benefits: [
        '<strong>360° Student Journey Lifecycle:</strong> 360° view of every student from initial enquiry through admission and visa processing.',
        '<strong>Automated Operational Efficiency:</strong> Reduced manual work and improved follow-up efficiency through automation.',
        '<strong>Unified Application & Visa Milestones:</strong> Better tracking of applications, scholarships, university admissions, and visa stages.',
        '<strong>Cross-Departmental Collaboration:</strong> Improved coordination between counselling, sales, application, and marketing teams.',
        '<strong>Campaign Source Attribution:</strong> Increased visibility into lead sources and social media campaign performance.',
        '<strong>Rapid Student Engagement:</strong> Faster response times and more structured student engagement.',
        '<strong>Data-Driven Strategic Decisions:</strong> Real-time dashboards helped management make data-driven business decisions.'
      ]
    },

    'case-blume-labs': {
      company: 'Blume Labs',
      location: 'Bangalore',
      products: 'Zoho CRM, Zoho Books',
      description: 'Blume Labs is an innovative technology services and engineering firm based in Bangalore, providing software solutions, tech consulting retainers, and milestone-based development projects.',
      challenges: [
        '<strong>Sales-Finance Silos:</strong> Disconnected systems cause communication gaps and delayed invoicing after closing deals.',
        '<strong>Manual Data Entry Errors:</strong> Typing client and project details into Zoho Books leads to billing mistakes.',
        '<strong>No Real-Time Payment Tracking:</strong> Sales reps must chase finance or log into Books to check if invoices are paid.',
        '<strong>Complex Billing Structures:</strong> Managing tech service milestones and retainers manually across systems is difficult.',
        '<strong>Fragmented Financial Reporting:</strong> Lack of a unified dashboard makes cash flow forecasting and pipeline projections hard.'
      ],
      solution: [
        '<strong>Automated Invoicing:</strong> Moving deals to "Closed Won" in CRM automatically generates invoices in Books.',
        '<strong>Two-Way Database Sync:</strong> Client and contact updates in CRM instantly sync over to Zoho Books.',
        '<strong>In-CRM Financial Visibility:</strong> Embed Zoho Books payment statuses and overdue alerts directly inside CRM layouts.',
        '<strong>Milestone Workflows:</strong> Configure CRM workflows to auto-generate invoices as project milestones are completed.',
        '<strong>Unified Dashboards:</strong> Combine CRM sales pipelines and Zoho Books revenue reports into a single view.'
      ],
      benefits: [
        '<strong>Faster Cash Flow:</strong> Immediate invoicing speeds up the order-to-cash cycle and boosts liquidity.',
        '<strong>Zero Manual Effort:</strong> Automation eliminates data entry, saving time for billable tech work.',
        '<strong>Better Team Alignment:</strong> Sales reps can see billing histories to avoid pitching clients with overdue accounts.',
        '<strong>Improved Client Experience:</strong> Prompt, error-free invoices enhance professionalism and trust.',
        '<strong>Informed Decision-Making:</strong> Management gets clear, real-time insights for resource and financial planning.'
      ]
    },

    'case-indiqube': {
      company: 'IndiQube',
      location: 'Bangalore',
      products: 'Zoho CRM, Zoho Campaign, 3rd party Whatsapp, Telephonic Integration',
      description: 'Indiqube Spaces Ltd. is a provider of managed office spaces and flexible workspace solutions.',
      challenges: [
        '<strong>Multi-Channel Inquiry Ingestion:</strong> Managing high volumes of prospective tenant inquiries scattered across WhatsApp, telephony, and web forms without losing lead context.',
        '<strong>Tour Booking & Follow-up Lags:</strong> Delays in tour bookings and membership follow-ups caused by manual data entry across disconnected communication channels.',
        '<strong>Siloed Communication Histories:</strong> Inability to track agent call recordings, chat histories, and interaction notes directly inside individual CRM lead profiles.',
        '<strong>Low Renewal Campaign Conversions:</strong> Low conversion rates on manual email campaigns for hot desk renewals and private cabin upgrade pitches.',
        '<strong>Fragmented Member Records:</strong> Fragmented member data making it difficult to deliver personalized workspace experiences and targeted retention offers.'
      ],
      solution: [
        '<strong>Centralized Inbound CRM Repository:</strong> Centralize all inbound inquiries from WhatsApp, telephony channels, and marketing campaigns directly into Zoho CRM as unified leads.',
        '<strong>Instant Lead Routing & SLA Triggers:</strong> Automate instant lead assignment and task creation triggered immediately upon missed calls or incoming WhatsApp inquiries.',
        '<strong>Native Cloud Telephony & WhatsApp APIs:</strong> Integrate cloud telephony and WhatsApp business APIs natively into Zoho CRM for one-click calling and unified chat logs.',
        '<strong>Automated Behavioral Drip Sequences:</strong> Utilize Zoho Campaigns to launch automated, behavior-driven drip sequences based on user interaction history inside the CRM.',
        '<strong>Dynamic Multi-Module Segmentation:</strong> Deploy custom multi-module workflows to segment members by space type and contract duration for precise campaign targeting.'
      ],
      benefits: [
        '<strong>Accelerated Tour-to-Booking Conversions:</strong> Blazingly fast lead response times that significantly increase tour-to-booking conversion rates for prospective tenants.',
        '<strong>Full Omnichannel Audit Trails:</strong> Complete visibility over all sales communications with automated logging of every phone call, WhatsApp chat, and campaign touchpoint.',
        '<strong>Community Focus Over Administration:</strong> Elimination of manual data entry errors, freeing up community managers to focus on high-touch client relationships.',
        '<strong>Proactive Member Retention:</strong> Improved member retention and lower churn rates through timely, automated renewal reminders and membership engagement campaigns.',
        '<strong>Scalable Multi-Location Rollouts:</strong> Scalable workspace operations supported by a streamlined ecosystem capable of handling multi-location expansion effortlessly.'
      ]
    },

    'case-manu-company': {
      company: 'Manoj',
      location: 'Bangalore',
      products: 'Zoho Books, Zoho Invoice',
      description: 'Manoj is an expanding commercial business based in Bangalore managing multi-currency global transactions, recurring service billing, and enterprise financial compliance.',
      challenges: [
        '<strong>Multi-Currency Compliance Silos:</strong> Managing manual multi-currency billing and complex financial compliance without a unified system.',
        '<strong>Delayed Invoicing & Collection Cycles:</strong> Delayed invoicing cycles and slow collections causing cash flow bottlenecks.',
        '<strong>Manual Reconciliation Discrepancies:</strong> High risk of human error and reconciliation discrepancies during recurring transactions.',
        '<strong>Opaque Profit Margins & Receivables:</strong> Lack of real-time visibility into profit margins and outstanding receivables.',
        '<strong>Tedious Expense Management:</strong> Operational delays caused by tedious manual entry of payments and expenses.'
      ],
      solution: [
        '<strong>Integrated Financial Workflow Hub:</strong> Centralize accounting, billing, and invoicing workflows using Zoho Books and Zoho Invoice.',
        '<strong>Recurring Billing Schedules:</strong> Automate recurring billing schedules and collection reminders.',
        '<strong>Automated Tax Calculation Engine:</strong> Implement automated tax calculation engines to ensure compliance.',
        '<strong>Instant Payment Gateway Logging:</strong> Set up real-time payment gateway integrations with instant receipt logging.',
        '<strong>Continuous Metrics Tracking:</strong> Utilize integrated dashboards to track core financial metrics continuously.'
      ],
      benefits: [
        '<strong>Accelerated Cash Flow Turnarounds:</strong> Accelerated cash flow through automated payment reminders and instant delivery.',
        '<strong>Guaranteed Financial Accuracy:</strong> Minimized compliance risks and complete financial accuracy via automated tax calculations.',
        '<strong>Zero Manual Ledger Overhead:</strong> Significant time savings by eliminating manual data entry tasks.',
        '<strong>Seamless Client Invoicing Portals:</strong> Enhanced client experience with professional invoices and seamless online payments.',
        '<strong>Comprehensive Financial Transparency:</strong> Real-time visibility into company profitability and financial health.'
      ]
    },

    'case-fyx': {
      company: 'FYX Finance',
      location: 'Australia',
      products: 'Zoho CRM, Zoho Sign, Zoho Form',
      description: 'FYX Finance is an independent Mortgage Manager and non-bank lender helping Australians make smarter moves in a shifting market.',
      challenges: [
        '<strong>Scattered Digital Loan Inquiries:</strong> Managing scattered loan inquiries without a unified tracking system.',
        '<strong>Application Drop-Off Bottlenecks:</strong> High application drop-off rates caused by delayed document collection and follow-ups.',
        '<strong>KYC Document Pipeline Disconnect:</strong> Friction in passing applicant details and uploaded documents straight into sales pipelines.',
        '<strong>Opaque Verification Stages:</strong> Limited centralized visibility into credit verification stages and approval bottlenecks.',
        '<strong>Manual Signature Execution Delays:</strong> Slow loan agreement execution and manual delays in collecting verified signatures from borrowers.'
      ],
      solution: [
        '<strong>Omnichannel Application Ingestion:</strong> Implement Zoho CRM and Zoho Forms to instantly capture applications from digital touchpoints.',
        '<strong>Automated Loan Officer Routing:</strong> Configure automated workflow rules to route leads directly to appropriate loan officers.',
        '<strong>Direct KYC & Statement Uploads:</strong> Embed file upload fields in forms to auto-attach KYC documents and bank statements to CRM profiles.',
        '<strong>Automated Pipeline Alerts:</strong> Set up automated notification triggers to keep applicants updated at every pipeline stage.',
        '<strong>Native Zoho Sign Verification:</strong> Integrate Zoho Sign to trigger and collect secure digital signatures on loan documents directly from the CRM.'
      ],
      benefits: [
        '<strong>Rapid Loan Processing Turnaround:</strong> Accelerated loan processing times that significantly increase conversion rates.',
        '<strong>100% Paperless Application Flow:</strong> Paperless data collection that eliminates manual entry errors and misplaced documents.',
        '<strong>End-to-End Lifecycle Visibility:</strong> Complete end-to-end visibility over the entire loan lifecycle from inquiry to disbursement.',
        '<strong>Legally Binding Instant Execution:</strong> Faster agreement turnarounds and legally binding contract execution using Zoho Sign.',
        '<strong>High-Capacity Lending Scale:</strong> Increased operational efficiency allowing teams to handle higher application volumes effortlessly.'
      ]
    },

    'case-chanakya-university': {
      company: 'Chanakya University',
      location: 'Bangalore',
      products: 'Zoho CRM',
      description: "Chanakya University is a multidisciplinary private university near Bengaluru known for blending modern global education under India's National Education Policy (NEP) 2020 with traditional Indian civilizational values and knowledge systems.",
      challenges: [
        '<strong>Disparate Student Inquiry Channels:</strong> Managing scattered student inquiries without a unified tracking database.',
        '<strong>Counseling Response Latency:</strong> Delayed follow-ups and slow counseling responses reducing conversion rates.',
        '<strong>Unmapped Enrollment Journeys:</strong> Inability to track student journeys across counseling and enrollment stages.',
        '<strong>Fragmented Interaction Records:</strong> Fragmented communication history between admission teams and students.',
        '<strong>Opaque Admission Pipeline Metrics:</strong> Lack of real-time visibility into counselor performance and admission pipelines.'
      ],
      solution: [
        '<strong>Centralized Admissions CRM Core:</strong> Deploy Zoho CRM as the central hub to capture and manage prospective student inquiries.',
        '<strong>Instant Counselor Assignment:</strong> Configure automated assignment rules to ensure instant counselor outreach.',
        '<strong>Multi-Stage Journey Pipelines:</strong> Utilize customized CRM pipelines to monitor every stage of the student journey.',
        '<strong>Omnichannel Communication Logging:</strong> Integrate communication tools to log all interactions directly inside student profiles.',
        '<strong>Role-Based Analytics & Reports:</strong> Build role-based dashboards to track counselor performance and enrollment metrics.'
      ],
      benefits: [
        '<strong>Instant Outreach & Engagement:</strong> Accelerated response times that significantly increase student engagement.',
        '<strong>360° Admission Lifecycle Oversight:</strong> Complete 360-degree visibility over the entire admission lifecycle.',
        '<strong>Automated Counselor Productivity:</strong> Enhanced productivity through automated task assignment and workflow triggers.',
        '<strong>Integrated Marketing & Counseling:</strong> Improved cross-departmental collaboration between marketing and counseling.',
        '<strong>Data-Driven Enrollment Growth:</strong> Data-driven decision making powered by real-time analytics.'
      ]
    },

    'case-rahul-hr': {
      company: 'Rahul',
      location: 'Bangalore',
      products: 'Zoho People, Zoho Payroll, Zoho Recruit',
      description: 'Rahul is an enterprise corporate organization based in Bangalore managing extensive multi-departmental workforce recruitment, human resources, and monthly payroll operations.',
      challenges: [
        '<strong>Disconnected HR & Payroll Silos:</strong> Managing disconnected recruitment, HR, and payroll workflows across siloed systems without centralized data sharing.',
        '<strong>Manual Candidate Transfer Redundancy:</strong> Tedious manual data entry when transferring newly hired candidates from recruitment systems into employee databases.',
        '<strong>Attendance & Payroll Discrepancies:</strong> Complex payroll processing errors caused by manual reconciliation of attendance, leave records, and salary structures.',
        '<strong>Opaque Workforce Metrics:</strong> Lack of visibility into hiring pipelines, time-to-hire metrics, and overall workforce administration costs.',
        '<strong>Onboarding & Initialisation Delays:</strong> Delays in onboarding new hires and initializing their active payroll profiles smoothly.'
      ],
      solution: [
        '<strong>Integrated HRMS Ecosystem:</strong> Implement an integrated ecosystem connecting Zoho Recruit, Zoho People, and Zoho Payroll into a unified platform.',
        '<strong>Automated Candidate-to-Employee Conversion:</strong> Automate the conversion of successfully hired candidates in Zoho Recruit directly into employee profiles in Zoho People.',
        '<strong>Direct Attendance & Leave Sync:</strong> Sync attendance, shift, and leave management data from Zoho People automatically with Zoho Payroll.',
        '<strong>Error-Free Statutory Calculations:</strong> Configure automated payroll calculation and tax compliance rules within Zoho Payroll for error-free disbursements.',
        '<strong>Unified Executive Dashboards:</strong> Utilize integrated dashboards across the suite to track recruitment metrics, headcount, and payroll expenditures in real time.'
      ],
      benefits: [
        '<strong>Zero Administrative Redundancy:</strong> Eliminated administrative overhead and redundant manual data entry through seamless cross-application synchronization.',
        '<strong>Rapid Onboarding Velocity:</strong> Accelerated onboarding turnarounds that instantly transition candidate hires into active, managed employees.',
        '<strong>100% Payroll & Statutory Accuracy:</strong> 100% accuracy in payroll processing and statutory compliance through automated attendance and leave integration.',
        '<strong>Complete Workforce Transparency:</strong> Improved visibility into workforce operations, recruitment efficiency, and monthly salary expenses.',
        '<strong>Empowered Employee Self-Service:</strong> Enhanced employee experience via transparent self-service portals for leave tracking, attendance, and pay slip access.'
      ]
    },

    'case-monster-india': {
      company: 'Monster India',
      location: 'India',
      products: 'Salesforce CRM, 3rd Party Integration: Razorpay & Google Maps Matrix API',
      description: 'Monster India operates as an online recruitment platform that rebranded its core job-seeking marketplace to foundit.',
      challenges: [
        '<strong>Recruiter Subscription Volume:</strong> Managing massive volumes of high-frequency recruiter subscriptions and corporate user data across fragmented transactional platforms.',
        '<strong>Multi-Tiered Enterprise Billing:</strong> Complex billing cycles and multi-tiered pricing plans for enterprise clients requiring robust payment handling.',
        '<strong>Dynamic Tax & Regional Calculation:</strong> Inability to seamlessly calculate location-based vendor taxes, logistics fees, or regional service matching rules dynamically.',
        '<strong>Manual Geographic Verification:</strong> High operational overhead in manually verifying recruiter geographic footprints and aligning them with regional sales targets.',
        '<strong>Fragmented Milestone Tracking:</strong> Fragmented tracking of corporate client accounts, payment clearances, and service activation milestones inside legacy systems.'
      ],
      solution: [
        '<strong>Customized Salesforce CRM Framework:</strong> Architect and deploy an end-to-end Salesforce CRM development framework customized for India\'s high-volume recruitment ecosystem.',
        '<strong>Native Razorpay Payment Integration:</strong> Integrate Razorpay payment gateways natively within Salesforce to process automated corporate subscription checkouts and instantaneous invoice generation.',
        '<strong>Google Maps Matrix API Integration:</strong> Implement Google Maps Matrix API integrations to compute precise geographic distances, regional service radiuses, and field sales routing parameters.',
        '<strong>Custom Apex Fulfillment Workflows:</strong> Build custom Apex triggers and automated workflows to match corporate hiring locations with localized recruitment fulfillment teams.',
        '<strong>Centralized Real-Time Dashboards:</strong> Establish centralized dashboards combining CRM pipeline metrics with real-time financial reconciliation data from payment and location engines.'
      ],
      benefits: [
        '<strong>Accelerated Subscription Checkouts:</strong> Accelerated subscription checkouts and frictionless payment processing for enterprise recruiters via Razorpay integration.',
        '<strong>Optimized Geographic Targeting:</strong> Optimized geographic targeting and accurate field execution enabled by real-time distance metrics from the Google Maps Matrix API.',
        '<strong>Enhanced National Account Visibility:</strong> Enhanced operational visibility across national accounts, reducing administrative overhead and manual tracking errors.',
        '<strong>Scalable High-Volume Infrastructure:</strong> Scalable sales and billing infrastructure capable of handling high transaction spikes across multiple regional hubs in India.',
        '<strong>Instant Campaign Activation:</strong> Improved client onboarding turnaround times, transforming raw corporate inquiries into activated recruitment campaigns instantly.'
      ]
    },

    'case-verzeo': {
      company: 'Verzeo Technologies',
      location: 'Bangalore, India',
      products: 'Salesforce CRM, 3rd Party Integration: WhatsApp & Google Maps API',
      description: "Verzeo is India's Largest E-Learning Platform. Being able to help thousands of students decide on their careers, we guarantee that Verzeo is the one-stop-learning online platform that has provided students with all the resources they need to make them industry-ready.",
      challenges: [
        '<strong>Demographic & Campus Mapping:</strong> Difficulty in mapping student demographics to specific college tie-ups and partner training campuses across different regions.',
        '<strong>Enrollment Verification Drop-Off:</strong> High drop-off rates during payment and enrollment verification stages due to lack of real-time communication follow-ups.',
        '<strong>Hybrid Class Scheduling & Attendance:</strong> Complex scheduling and attendance tracking for live virtual classes, webinars, and hybrid training sessions.',
        '<strong>Disconnected Career Milestones:</strong> Disconnected tracking of student project progress, internship milestones, and final placement interviews.',
        '<strong>Opaque Multi-Channel Marketing ROI:</strong> Inability of management to monitor multi-channel marketing ROI and counselor target achievements in real time.'
      ],
      solution: [
        '<strong>Custom Lightning Web Components (LWC):</strong> Build custom Salesforce Lightning Web Components (LWC) and objects to manage student batches, courses, and partner institution networks.',
        '<strong>Automated WhatsApp Notifications:</strong> Implement automated WhatsApp notification triggers for fee payment links, batch start dates, and class reminders.',
        '<strong>Google Maps API Hub Locator:</strong> Utilize Google Maps API within Salesforce to locate nearby physical training hubs and assign regional placement coordinators.',
        '<strong>Custom Apex Certification Controllers:</strong> Develop custom Apex controllers to handle automated certificate generation and milestone tracking upon course completion.',
        '<strong>Executive Performance Dashboards:</strong> Create advanced Salesforce reports and executive dashboards for granular tracking of student progression and counselor KPIs.'
      ],
      benefits: [
        '<strong>Higher Completion & Fee Collection:</strong> Higher course completion and fee collection rates driven by instant, automated WhatsApp alerts.',
        '<strong>Streamlined Hybrid Operations:</strong> Streamlined hybrid operations with precise location-based tracking for physical bootcamps and training hubs.',
        '<strong>Full Student Lifecycle Transparency:</strong> Enhanced transparency across the entire student lifecycle from enrollment to internship placement.',
        '<strong>Productivity Through Automation:</strong> Increased team productivity through automated milestone updates and digital certificate processing.',
        '<strong>Data-Driven Course Oversight:</strong> Complete data-driven oversight for management to optimize course offerings and regional marketing spend.'
      ]
    },

    'case-banaraswala': {
      company: 'Banaraswala',
      location: 'Delhi',
      products: 'Salesforce CRM, 3rd Party Integration: Facebook Chatbot & SMS Integration',
      description: 'Banaraswala serves authentic culinary traditions from the vibrant lanes of Banaras, ranging from time-honored sweets and crispy savouries to iconic street food and comforting North Indian meals.',
      challenges: [
        '<strong>Scattered B2B Order Inquiries:</strong> Managing bulk industrial B2B orders and inquiries for wire mesh and perforated sheets scattered across legacy communication channels.',
        '<strong>High Specification Turnaround Times:</strong> High turnaround times for handling repetitive customer queries regarding custom metal specifications, pricing, and bulk availability.',
        '<strong>After-Hours Lead Capture Gaps:</strong> Inability to capture and qualify incoming digital leads automatically outside regular business hours.',
        '<strong>Fragmented Client Communications:</strong> Fragmented communication tracking between regional sales agents and industrial clients discussing custom product requirements.',
        '<strong>Delayed Field Quotation Alerts:</strong> Lack of instant notification systems to update field sales teams regarding urgent B2B quotation requests.'
      ],
      solution: [
        '<strong>Manufacturing Salesforce CRM Architecture:</strong> Implement a full Salesforce CRM development lifecycle tailored for industrial manufacturing and supply workflows.',
        '<strong>24/7 Facebook Chatbot API:</strong> Integrate a Facebook Chatbot API within Salesforce to automate initial B2B engagement, sizing queries, and catalog sharing 24/7.',
        '<strong>Automated SMS Notification Gateway:</strong> Configure automated SMS integration inside Salesforce to trigger instant dispatch updates, quote notifications, and follow-ups.',
        '<strong>Custom Apex Routing Rules:</strong> Build custom Apex automation rules to instantly route qualified chatbot leads to appropriate regional industrial sales reps.',
        '<strong>Centralized Velocity Dashboards:</strong> Create centralized Salesforce dashboards to monitor social media lead conversion rates and sales pipeline velocities.'
      ],
      benefits: [
        '<strong>Instant 24/7 Lead Capture:</strong> Instant 24/7 customer engagement and lead capture via automated Facebook chatbot interactions.',
        '<strong>Accelerated Quotation & Sales Cycles:</strong> Accelerated sales cycles and improved communication reliability through automated SMS alerts and updates.',
        '<strong>Prioritized High-Value Inquiries:</strong> Enhanced operational efficiency for sales teams by filtering out routine queries and prioritizing high-value bulk orders.',
        '<strong>360° Order & Dispatch Visibility:</strong> Complete 360-degree visibility over customer interactions from social media inquiry to final dispatch.',
        '<strong>Scalable Industrial Acquisition:</strong> Scalable digital infrastructure supporting high-volume industrial client acquisition and regional growth.'
      ]
    },

    'case-loomcrafts': {
      company: 'Loom Crafts',
      location: 'Uttar Pradesh',
      products: 'Salesforce CRM, 3rd Party Integration: Facebook Chatbot, SMS, Razorpay, WhatsApp',
      description: "Loom Crafts is India's premier manufacturer of luxury outdoor furniture and bespoke architectural solutions, trusted by top designers and hospitality brands since 2005. Operating out of a state-of-the-art facility, the company delivers weather-resistant sofas, cabanas, and custom installations for high-end residential and commercial projects across the globe. Beyond manufacturing, Loom Crafts provides end-to-end support—from expert design consultation and technical detailing to nationwide installation and dependable after-sales care.",
      challenges: [
        '<strong>High-Volume Luxury Inquiries:</strong> Handling high volumes of customer inquiries for custom outdoor furniture and luxury shading systems across multiple uncoordinated communication touchpoints.',
        '<strong>Checkout & Consultation Drop-Off:</strong> High drop-off rates during online design consultations and custom order checkout phases due to payment friction.',
        '<strong>Disjointed Omnichannel Tracking:</strong> Fragmented tracking of telephonic conversations, WhatsApp chats, and SMS follow-ups between sales reps and premium clients.',
        '<strong>Custom Order Deposit Verification:</strong> Difficulty in managing payment verifications and security deposits for heavy, made-to-order manufacturing projects.',
        '<strong>Field & Digital History Gaps:</strong> Lack of real-time visibility into customer interaction history across field sales teams and digital channels.'
      ],
      solution: [
        '<strong>Luxury Manufacturing CRM Architecture:</strong> Architect a comprehensive Salesforce CRM development environment tailored for luxury custom manufacturing and direct-to-consumer sales.',
        '<strong>Cloud Telephony & Call Logging:</strong> Integrate cloud telephony systems directly into Salesforce to enable click-to-call functionality and automatic call logging for every agent.',
        '<strong>WhatsApp Business & SMS API Integration:</strong> Embed WhatsApp Business and SMS API integrations within Salesforce to automate design catalog sharing, appointment reminders, and follow-ups.',
        '<strong>Native Razorpay Advance Checkouts:</strong> Implement native Razorpay integration inside Salesforce to securely collect advance payments and custom order deposits instantly.',
        '<strong>Executive Multi-Channel Dashboards:</strong> Build advanced executive dashboards to monitor multi-channel lead engagement, conversion rates, and sales pipeline velocities.'
      ],
      benefits: [
        '<strong>Frictionless High-Value Checkouts:</strong> Accelerated order conversion and frictionless revenue collection through secure, integrated Razorpay checkouts.',
        '<strong>100% Automated Communication Logging:</strong> Complete visibility over all customer communications with 100% automated logging across calls, WhatsApp chats, and SMS alerts.',
        '<strong>Elevated Luxury Buyer Experience:</strong> Enhanced customer experience for luxury buyers via instant, responsive multi-channel engagement and automated status updates.',
        '<strong>Maximized Sales Productivity:</strong> Improved sales team productivity by eliminating manual data entry and streamlining lead follow-up workflows.',
        '<strong>Scalable Pan-India Growth:</strong> Scalable operational infrastructure supporting high-value custom manufacturing orders and pan-India growth.'
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

  if (filterBtns.length > 0) {
    updateCounts();
  }

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
    if (modalProducts) modalProducts.textContent = data.products;
    
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
