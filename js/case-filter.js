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
      location: 'Bangalore, India',
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

    'case-manu-company': {
      company: 'Pierian Service',
      location: 'Bangalore, India',
      products: 'Zoho Books, Zoho Invoice',
      description: 'Pierian Service is a global business and financial consulting firm based in Bangalore, India, managing multi-currency global transactions, recurring service billing, and enterprise financial compliance.',
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
      location: 'Bangalore, India',
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
      company: 'Greenworld Solarwares Private Limited',
      location: 'Chhattisgarh, India',
      products: 'Zoho People, Zoho Payroll, Zoho Recruit',
      description: 'Greenworld Solarwares Private Limited is a leading renewable energy and solar solutions provider based in Chhattisgarh, India, managing extensive multi-departmental workforce recruitment, human resources, and monthly payroll operations.',
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
      location: 'Delhi, India',
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
      location: 'Uttar Pradesh, India',
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
    },

    'case-greenworld': {
      company: 'Greenworld Solarwares Private Limited',
      location: 'Chhattisgarh, India',
      products: 'Zoho People, Zoho Payroll, Zoho Recruit',
      description: 'Greenworld Solarwares Private Limited is a leading renewable energy and solar solutions provider based in Chhattisgarh, India, managing extensive multi-departmental workforce recruitment, human resources, and monthly payroll operations.',
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

    'case-deccan-herald': {
      company: 'Deccan Herald',
      location: 'Bangalore, India',
      products: 'Performance Marketing, Audience Segmentation, Data Analytics, Conversion Rate Optimization',
      description: 'Deccan Herald is one of India\'s premier daily English-language broadsheet publications. With millions of active monthly digital readers, Deccan Herald partnered with Digiolic to supercharge digital subscriber acquisitions, slash customer acquisition costs (CAC), and optimize programmatic subscription funnels.',
      challenges: [
        '<strong>Sub-Optimal Lead Conversion:</strong> Rising CAC and plateauing digital subscriber acquisitions across regional readership segments.',
        '<strong>Audience Channel Fragmentation:</strong> Inability to accurately attribute subscription conversions across print, organic search, and paid social campaigns.',
        '<strong>Subscription Funnel Drop-off:</strong> High bounce rates at paywalls and complex subscription payment checkout flows.'
      ],
      solution: [
        '<strong>Full-Funnel Paid Acquisition Re-Architecture:</strong> Deployed granular behavioral segmentation across Google Search, Display, and Meta Ads.',
        '<strong>Conversion Rate Optimization (CRO):</strong> Redesigned subscription landing page funnels with frictionless 1-click micro-paywalls and payment integrations.',
        '<strong>Attribution Modeling & Predictive LTV:</strong> Integrated real-time analytics to measure reader propensity and lifetime value across readership segments.'
      ],
      benefits: [
        '<strong>+37% Boost in Lead Generation:</strong> Qualified digital subscriber leads surged within the first 90 days of campaign deployment.',
        '<strong>-49% Reduction in CAC:</strong> Customer acquisition cost halved through algorithmic audience targeting and continuous funnel optimization.',
        '<strong>High-Yield Subscriber Retention:</strong> Enhanced retention rate of yearly premium digital news subscribers.'
      ]
    },

    'case-myntra': {
      company: 'Myntra',
      location: 'Bangalore, India',
      products: 'Organic SEO Engine, High-Velocity Content Marketing, Keyword Architecture',
      description: 'Myntra is India\'s foremost fashion and lifestyle e-commerce powerhouse. Digiolic engineered a programmatic SEO expansion and search authority architecture that catapulted thousands of high-intent search queries into top rankings, driving exponential organic traffic growth.',
      challenges: [
        '<strong>High-Velocity Category Indexing:</strong> Managing search ranking authority across hundreds of thousands of rapidly churning fashion SKUs.',
        '<strong>Intense Competitive SERP Pressure:</strong> Dominating ultra-competitive seasonal keyword categories (End of Reason Sale, Festive fashion).',
        '<strong>Crawl Budget & Technical Optimization:</strong> Navigating complex faceted navigation parameters and canonicalization at massive enterprise scale.'
      ],
      solution: [
        '<strong>Programmatic SEO & Canonical Architecture:</strong> Built automated internal linking hierarchies and faceted navigation indexing rules.',
        '<strong>Long-Tail Keyword Matrix:</strong> Deployed high-volume, high-intent seasonal style keyword clusters across women\'s, men\'s, and footwear categories.',
        '<strong>Core Web Vitals & Accelerated Indexing:</strong> Optimized structured data markup and mobile rendering speed for instant indexing by search engine crawlers.'
      ],
      benefits: [
        '<strong>10X Boost in Organic Search Traffic:</strong> Massive surge in high-intent non-brand organic discovery across primary fashion apparel keywords.',
        '<strong>100% Increase MOM:</strong> Consistent month-over-month compounding traffic growth during peak e-commerce sales cycles.',
        '<strong>Multi-Crore Organic Revenue Lift:</strong> Decreased reliance on high-cost paid search channels through dominant organic SERP ownership.'
      ]
    },

    'case-flipkart': {
      company: 'Flipkart',
      location: 'Bangalore, India',
      products: 'Social Media Growth Engine, Viral Video Production, Influencer Orchestration',
      description: 'Flipkart is India\'s leading homegrown e-commerce ecosystem. Digiolic partnered with Flipkart to craft high-impact, viral social campaigns and video engagement funnels that engaged Gen-Z and millennial shoppers nationwide during Big Billion Days and festive shopping festivals.',
      challenges: [
        '<strong>Social Engagement Fatigue:</strong> Standing out in an oversaturated e-commerce social landscape during competitive festive sale periods.',
        '<strong>Gen-Z Visual Content Demands:</strong> Transitioning from promotional static banners to authentic, short-form viral storytelling.',
        '<strong>Social Commerce Direct Conversion:</strong> Bridging the gap between social engagement (Instagram Reels, YouTube Shorts) and direct app checkouts.'
      ],
      solution: [
        '<strong>Interactive Social Content Frameworks:</strong> Designed engaging, dynamic carousel and short-form video campaigns showcasing exclusive product drops.',
        '<strong>Influencer-Led Video Creative Strategy:</strong> Directed targeted creator collaborations delivering relatable lifestyle narratives tied to Flipkart app promotions.',
        '<strong>Omnichannel Retargeting Loops:</strong> Deployed synchronized remarketing funnels converting social video viewers into in-app buyers.'
      ],
      benefits: [
        '<strong>+40% Boost in Instagram Engagement:</strong> Remarkable lift in comment shares, saves, and interactive sticker participation across brand channels.',
        '<strong>+70% Boost in YouTube Video Views:</strong> Record-breaking audience reach and watch time on high-energy campaign video launches.',
        '<strong>Viral App Installs & Cart Velocity:</strong> Exponential surge in new user app downloads and festive shopping bag checkouts.'
      ]
    },

    'case-via-milano': {
      company: 'via Milano',
      location: 'Bangalore & Hyderabad, India',
      products: 'Local Hospitality Growth, Micro-Targeted Ad Campaigns, Automated Table Booking Engine',
      description: 'via Milano is a premier authentic Italian fine dining restaurant brand in India. Digiolic delivered an integrated local search, visual social media, and digital booking system that dramatically increased table reservations and private dining revenue.',
      challenges: [
        '<strong>Weekday Dining Slowdowns:</strong> Inconsistent footfall between high-demand weekend dinner rushes and slower weekday lunch periods.',
        '<strong>Local Search Competition:</strong> Competing against new culinary outlets in prime urban dining districts.',
        '<strong>Table Reservation Friction:</strong> Third-party booking platforms charging heavy commissions without providing direct customer ownership.'
      ],
      solution: [
        '<strong>Hyper-Local Geo-Targeted Ad Engine:</strong> Launched radius-based Google and Instagram ad campaigns reaching corporate professionals within a 5km radius.',
        '<strong>Direct Commission-Free Reservation Funnel:</strong> Implemented seamless 1-click table booking and WhatsApp confirmation workflows.',
        '<strong>Sensory Food Visual Storytelling:</strong> Produced high-definition gastronomic imagery and behind-the-scenes chef specials highlighting woodfired craftsmanship.'
      ],
      benefits: [
        '<strong>4X Boost in Direct Table Bookings:</strong> Substantial surge in direct online dining reservations without high aggregator fees.',
        '<strong>100% Increase in Recurring Dining Revenue:</strong> Doubled seasonal revenue through corporate dining packages, wine tastings, and event bookings.',
        '<strong>Dominant Local Map Pack Ranking:</strong> Ranked #1 in local Google Maps searches for Italian fine dining in central metropolitan hubs.'
      ]
    },

    'case-siemens': {
      company: 'Siemens',
      location: 'Global / India',
      products: 'Enterprise CRM, Cloud Workflow Automation, Custom Analytics',
      description: 'Siemens is a global technology pioneer in electrification, automation, and digitalization. Digiolic implemented customized CRM workflow automations and multi-tier enterprise integrations to streamline project pipeline tracking, customer interactions, and field engineering coordination.',
      challenges: [
        '<strong>Complex B2B Sales Cycles:</strong> Tracking multi-month industrial infrastructure contract pipelines across international cross-functional teams.',
        '<strong>Siloed Field Service Data:</strong> Disconnected field technical service requests and customer feedback histories.',
        '<strong>Enterprise Security & Role Compliance:</strong> Strict regulatory compliance and fine-grained data permission requirements.'
      ],
      solution: [
        '<strong>Custom Enterprise Workflow Blueprints:</strong> Configured automated stage gates, risk approvals, and SLA escalations for multi-million dollar deals.',
        '<strong>Unified Engineering & Field Service Sync:</strong> Integrated technical customer ticket logging directly into central account management views.',
        '<strong>Role-Based Analytics Dashboards:</strong> Provided senior leadership with real-time pipeline velocity and regional performance forecasts.'
      ],
      benefits: [
        '<strong>Accelerated Sales Pipeline Velocity:</strong> Reduced enterprise proposal turnaround times by 35%.',
        '<strong>360-Degree Account Transparency:</strong> Complete historical visibility into client interactions across engineering, sales, and executive teams.',
        '<strong>Zero Data Compliance Violations:</strong> Full adherence to strict international security and data governance standards.'
      ]
    },

    'case-audible': {
      company: 'Audible India',
      location: 'Mumbai & Bangalore, India',
      products: 'Digital Engagement Architecture, CRM Automation, Retention Funnels',
      description: 'Audible (an Amazon company) is the leading creator and provider of premium audio storytelling. Digiolic architected customized audience engagement and automated communication workflows that increased member onboarding completion and subscription renewals.',
      challenges: [
        '<strong>Audio Discovery Onboarding:</strong> Guiding new trial listeners to their first listening milestone within 48 hours of signup.',
        '<strong>Member Churn Prevention:</strong> Identifying disengaged listeners before monthly subscription renewal cycles.',
        '<strong>Multi-Channel Notification Orchestration:</strong> Aligning email, in-app messaging, and push notifications to avoid message fatigue.'
      ],
      solution: [
        '<strong>Behavior-Driven Automation Workflows:</strong> Created automated onboarding sequences triggered by real-time listening habits and genre preferences.',
        '<strong>Predictive Churn Interventions:</strong> Configured re-engagement trigger alerts providing tailored audio recommendations to at-risk subscribers.',
        '<strong>Lifecycle Journey Dashboards:</strong> Monitored trial-to-paid conversion rates and catalog completion metrics.'
      ],
      benefits: [
        '<strong>+28% Trial-to-Paid Conversion Lift:</strong> Faster time-to-first-listen resulting in higher member retention.',
        '<strong>Streamlined Multi-Channel Messaging:</strong> Optimized communication cadence reducing user unsubscribe rates.',
        '<strong>Actionable Cohort Insights:</strong> Enabled marketing teams to rapidly identify trending regional language audiobooks.'
      ]
    },

    'case-betterplace': {
      company: 'Betterplace',
      location: 'Bangalore, India',
      products: 'Zoho CRM, Enterprise Cloud Integration, Automated Lead Routing',
      description: 'Betterplace is Asia\'s largest frontline workforce management platform. Digiolic implemented scalable CRM architectures and automated lead qualification pipelines capable of handling massive enterprise hiring and workforce management inquiries.',
      challenges: [
        '<strong>Massive Frontline Inbound Ingestion:</strong> Processing thousands of workforce inquiries per week across logistics, facility management, and retail sectors.',
        '<strong>Lead Routing Latency:</strong> Manual lead triage causing delays in connecting high-priority enterprise prospects with regional account directors.',
        '<strong>Cross-Product Cross-Selling:</strong> Lack of visibility into existing client adoption across onboarding, attendance, and compliance modules.'
      ],
      solution: [
        '<strong>Automated Intelligent Lead Routing:</strong> Configured rule-based auto-assignment algorithms prioritizing leads by industry tier and geography.',
        '<strong>Cross-Department Account Hierarchy:</strong> Structured parent-child enterprise account layouts displaying multi-branch usage in a unified portal.',
        '<strong>API Sync with Core Platforms:</strong> Connected CRM pipelines to internal workforce systems for seamless contract-to-onboarding transitions.'
      ],
      benefits: [
        '<strong>Instantaneous Lead Response:</strong> High-priority enterprise lead contact time dropped from 4 hours to under 8 minutes.',
        '<strong>+45% Improvement in Sales Follow-up Efficiency:</strong> Automated task generation eliminated dropped opportunities.',
        '<strong>Unified Enterprise View:</strong> Leadership gained real-time visibility into customer account health and expansion potential.'
      ]
    },

    'case-xiaomi': {
      company: 'Xiaomi',
      location: 'Global / India',
      products: 'Omnichannel CRM, Retail Partner Management, Automated Service Ticketing',
      description: 'Xiaomi is a global consumer electronics and smart manufacturing company. Digiolic optimized retail partner support networks, customer escalation flows, and CRM data pipelines to elevate post-sales partner and consumer satisfaction.',
      challenges: [
        '<strong>High-Density Retail Partner Inquiries:</strong> Managing thousands of authorized retail and service partner queries daily.',
        '<strong>Warranty & Escalation Delays:</strong> Fragmented communication between physical service centers and regional warehouse supply teams.',
        '<strong>KPI Tracking Across Centers:</strong> Inconsistent reporting on turnaround times and first-contact resolution rates.'
      ],
      solution: [
        '<strong>Omnichannel Partner Support Hub:</strong> Built a centralized support desk with automated ticketing, SLA tracking, and resolution escalations.',
        '<strong>Automated Spares & Inventory Alerts:</strong> Integrated service center requests directly into supply chain dispatch workflows.',
        '<strong>Live Executive Service Dashboards:</strong> Implemented real-time operational monitors tracking turnaround times across nationwide service hubs.'
      ],
      benefits: [
        '<strong>-40% Reduction in Ticket Resolution Time:</strong> Faster resolution of dealer inquiries and warranty claims.',
        '<strong>100% SLA Adherence:</strong> Automated escalation triggers ensured zero unresolved high-priority partner issues.',
        '<strong>Elevated Partner Satisfaction:</strong> Strengthened trust and operational efficiency across the retail ecosystem.'
      ]
    },

    'case-haldirams': {
      company: "Haldiram's",
      location: 'Nagpur & Delhi, India',
      products: 'Distribution CRM, FMCG Supply Chain Automation, Order Portal Integration',
      description: "Haldiram's is India's iconic sweets and snacks FMCG manufacturer. Digiolic deployed distribution management CRM workflows and automated retailer order tracking to accelerate distributor fulfillment and enhance supply chain visibility.",
      challenges: [
        '<strong>Pan-India Distributor Network Disconnect:</strong> Coordinating orders and inventory updates across hundreds of regional stockists manually.',
        '<strong>Order Processing Bottlenecks:</strong> Telephonic order taking leading to stock allocation mismatches during festive seasons.',
        '<strong>Credit & Payment Reconciliation Gaps:</strong> Delayed visibility into distributor credit limits and outstanding receivables.'
      ],
      solution: [
        '<strong>Automated Distributor Order Management:</strong> Implemented a connected distributor portal for order placement, stock checks, and status tracking.',
        '<strong>Credit Limit & Payment Workflows:</strong> Configured automated checks on distributor credit lines before order release approvals.',
        '<strong>Regional Performance Analytics:</strong> Created executive dashboards tracking SKU-level velocity and seasonal demand trends.'
      ],
      benefits: [
        '<strong>-50% Reduction in Order Processing Time:</strong> Automated validation eliminated manual re-keying of wholesale orders.',
        '<strong>Zero Festive Fulfillment Delays:</strong> Real-time demand forecasting prevented stockouts during major festival periods.',
        '<strong>Transparent Distributor Relations:</strong> Enhanced distributor satisfaction through instant digital invoice access and ledger visibility.'
      ]
    },

    'case-savaari': {
      company: 'Savaari Car Rentals',
      location: 'Bangalore, India',
      products: 'Travel CRM, Dynamic Pricing Sync, Driver Allocation Automation',
      description: "Savaari Car Rentals is India's largest outstation and chauffeur-driven car rental company. Digiolic engineered automated booking pipelines and customer journey messaging that enhanced traveler experience and repeat ride bookings.",
      challenges: [
        '<strong>Outstation Travel Itinerary Changes:</strong> Managing dynamic customer itinerary modifications and driver assignment updates in real time.',
        '<strong>Post-Trip Feedback & Review Ingestion:</strong> Low capture rate of post-journey traveler reviews and loyalty enrollments.',
        '<strong>Corporate Travel Billing Reconciliations:</strong> Manual processing of enterprise travel bills and GST invoice generation.'
      ],
      solution: [
        '<strong>Automated Journey Notification Engine:</strong> Configured WhatsApp and SMS automated journey updates with driver details and live tracking.',
        '<strong>Integrated Post-Trip Review Funnels:</strong> Triggered instant feedback prompts post-drop with automated resolution for low ratings.',
        '<strong>Corporate Billing Portal:</strong> Automated monthly consolidated GST invoicing for corporate accounts.'
      ],
      benefits: [
        '<strong>+32% Increase in Google & Tripadvisor Reviews:</strong> Rapid growth in 5-star ratings across all operating cities.',
        '<strong>Streamlined Corporate Account Management:</strong> Cut corporate billing reconciliation cycle from 10 days to 24 hours.',
        '<strong>Higher Customer Lifetime Value:</strong> Increased repeat leisure travel bookings through personalized seasonal destination campaigns.'
      ]
    },

    'case-nexus-wealth': {
      company: 'Nexus Wealth Management',
      location: 'Mumbai, India',
      products: 'FinTech CRM, High-Net-Worth Client Portal, Compliance & Portfolio Automation',
      description: 'Nexus Wealth Management delivers tailored wealth advisory and asset management for High-Net-Worth Individuals (HNIs). Digiolic architected an ultra-secure CRM and investor portal ensuring seamless portfolio reporting and regulatory compliance.',
      challenges: [
        '<strong>Strict Confidentiality & Role Security:</strong> Managing sensitive financial portfolios with strict regulatory compliance and auditable access.',
        '<strong>Quarterly Portfolio Reporting Delays:</strong> Manual compilation of multi-asset statements across equity, debt, and real estate.',
        '<strong>HNI Relationship Manager Allocation:</strong> Ensuring high-touch client communication without missed relationship milestones.'
      ],
      solution: [
        '<strong>Encrypted HNI CRM Architecture:</strong> Designed end-to-end encrypted client records with role-based access and full audit trail logging.',
        '<strong>Automated Portfolio Report Generator:</strong> Integrated market feeds to automatically produce customized quarterly performance statements.',
        '<strong>Milestone & Wealth Advisory Reminders:</strong> Set up automated advisory reviews and tax planning touchpoints for relationship managers.'
      ],
      benefits: [
        '<strong>100% Regulatory & Audit Compliance:</strong> Flawless compliance reviews with full digital paper trails.',
        '<strong>-75% Faster Report Generation:</strong> Quarterly portfolio reviews generated in minutes instead of days.',
        '<strong>Deepened Client Trust:</strong> Elevated client satisfaction and zero client attrition through proactive advisory communication.'
      ]
    },

    'case-melorra': {
      company: 'Melorra',
      location: 'Bangalore, India',
      products: 'E-Commerce CRM, Fine Jewellery Customer Care, VIP Concierge Workflows',
      description: 'Melorra designs lightweight, trendy fine jewellery for modern women. Digiolic built a bespoke VIP concierge and customer care workflow ecosystem that increased high-ticket jewellery conversions and customized styling appointments.',
      challenges: [
        '<strong>High-Value Cart Drop-off:</strong> Customers hesitating at high-value checkout points requiring human guidance on gold purity and ring sizing.',
        '<strong>Virtual Try-On & Styling Bookings:</strong> Uncoordinated scheduling of virtual video consultations between certified gemologists and shoppers.',
        '<strong>Post-Purchase Insurance & Certificate Queries:</strong> Repetitive inquiries about diamond certifications and hallmarking.'
      ],
      solution: [
        '<strong>Omnichannel Concierge Chat Hub:</strong> Integrated live stylist chat and WhatsApp concierge directly into CRM high-intent cart abandons.',
        '<strong>Automated Video Consultation Booking:</strong> Streamlined scheduling of 1-on-1 virtual styling sessions with automatic calendar sync.',
        '<strong>Digital Certificate Delivery:</strong> Automated post-order dispatch of authenticated certification documents and care guidelines.'
      ],
      benefits: [
        '<strong>+24% Recovery on High-Value Carts:</strong> Concierge consultations converted hesitant shoppers into verified orders.',
        '<strong>Flawless VIP Customer Experience:</strong> Seamless video consultation journey with 98% positive shopper feedback.',
        '<strong>Streamlined Support Overhead:</strong> Reduced certificate inquiries by 60% through proactive automated delivery.'
      ]
    },

    'case-medall': {
      company: 'Medall Diagnostics',
      location: 'Chennai, India',
      products: 'Healthcare CRM, Home Sample Collection Dispatch, Automated Report Dispatch',
      description: 'Medall Diagnostics is South India\'s largest integrated diagnostic services network. Digiolic implemented automated patient booking, phlebotomist field dispatching, and secure test report delivery workflows.',
      challenges: [
        '<strong>Home Sample Collection Logistics:</strong> Coordinating thousands of daily home blood sample collection appointments across multiple metropolitan cities.',
        '<strong>Turnaround Time & Report Delivery:</strong> Delays in transmitting diagnostic reports to patients and referring doctors.',
        '<strong>Patient Follow-up & Preventive Packages:</strong> Inability to recommend follow-up wellness screenings to chronic care patients.'
      ],
      solution: [
        '<strong>Automated Phlebotomist Field Dispatch:</strong> Integrated GPS-enabled appointment assignment matching patients with the nearest available technician.',
        '<strong>Instant Secure Report Dispatch:</strong> Automated SMS and WhatsApp report delivery with encrypted download links upon lab verification.',
        '<strong>Preventive Healthcare Journey Sequences:</strong> Configured automated annual health check reminders tailored to patient age and historical test categories.'
      ],
      benefits: [
        '<strong>+40% Increase in On-Time Sample Collections:</strong> Optimized routing and assignment slashed patient wait times.',
        '<strong>Zero Report Transmission Latency:</strong> 95% of routine test reports delivered to patients within minutes of laboratory sign-off.',
        '<strong>Expanded Repeat Test Engagement:</strong> Increased annual health checkup renewals by 28% through timely reminders.'
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

  // Globally expose modal opener for 3D sphere showcase cards
  window.openCaseStudyModal = openModal;
  window.caseDetailsData = caseDetailsData;

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
