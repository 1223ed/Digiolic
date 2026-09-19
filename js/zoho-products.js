/**
 * DIGIOLIC — ZOHO ALL-PRODUCTS DIRECTORY
 * Modern UI matching official Zoho product cards:
 * - Brand logo + Brand Prefix + Product Name
 * - Bold dark teal headline
 * - Informative description
 * - "Sign up for free" emerald green text CTA
 */

(function () {
  'use strict';

  // 44x44 Vector SVG Brand Icons matching Zoho Design
  const icons = {
    crm: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M12 22C12 17.5817 15.5817 14 20 14C23.0125 14 25.6175 15.6667 27 18.1578C28.3825 15.6667 30.9875 14 34 14C38.4183 14 42 17.5817 42 22C42 26.4183 38.4183 30 34 30C30.9875 30 28.3825 28.3333 27 25.8422C25.6175 28.3333 23.0125 30 20 30C15.5817 30 12 26.4183 12 22Z" stroke="#0284C7" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="20" cy="22" r="2.5" fill="#0284C7"/>
      <circle cx="34" cy="22" r="2.5" fill="#0284C7"/>
    </svg>`,

    crmplus: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M10 22C10 17.5817 13.5817 14 18 14C21.0125 14 23.6175 15.6667 25 18.1578C26.3825 15.6667 28.9875 14 32 14C36.4183 14 40 17.5817 40 22C40 26.4183 36.4183 30 32 30C28.9875 30 26.3825 28.3333 25 25.8422C23.6175 28.3333 21.0125 30 18 30C13.5817 30 10 26.4183 10 22Z" stroke="#006EB9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M33 11V17M30 14H36" stroke="#006EB9" stroke-width="2.6" stroke-linecap="round"/>
    </svg>`,

    bigin: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M10 12H34L25 25V34L19 31V25L10 12Z" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M17 12L22 20L27 12" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    salesiq: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <circle cx="20" cy="20" r="11" stroke="#EF4444" stroke-width="3"/>
      <path d="M20 14A6 6 0 0 1 26 20" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M28 28L35 35" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="20" cy="20" r="3" fill="#EF4444"/>
    </svg>`,

    marketingautomation: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M11 14H33L25 24V32L19 29V24L11 14Z" stroke="#3B82F6" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M27 11L33 11L33 17" stroke="#10B981" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M25 19L33 11" stroke="#10B981" stroke-width="2.8" stroke-linecap="round"/>
    </svg>`,

    social: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <circle cx="16" cy="17" r="5" stroke="#0284C7" stroke-width="2.8"/>
      <circle cx="28" cy="17" r="5" stroke="#F59E0B" stroke-width="2.8"/>
      <circle cx="22" cy="29" r="5" stroke="#EF4444" stroke-width="2.8"/>
      <path d="M19.5 20L21 24.5" stroke="#64748B" stroke-width="2"/>
      <path d="M24.5 20L23 24.5" stroke="#64748B" stroke-width="2"/>
      <path d="M21 17H23" stroke="#64748B" stroke-width="2"/>
    </svg>`,

    campaigns: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M12 18H16L27 12V32L16 26H12C10.8954 26 10 25.1046 10 24V20C10 18.8954 10.8954 18 12 18Z" stroke="#EA580C" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 26V32" stroke="#EA580C" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M31 17C33 19 33 25 31 27" stroke="#EA580C" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    forms: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="12" y="10" width="20" height="24" rx="3" stroke="#10B981" stroke-width="2.8"/>
      <path d="M17 17H27M17 22H27M17 27H23" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    sign: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="11" y="9" width="22" height="26" rx="3" stroke="#D97706" stroke-width="2.8"/>
      <path d="M16 16H28M16 21H24" stroke="#D97706" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M16 28C18 26.5 21 26.5 23 28C24.5 29 27 27 28 26" stroke="#D97706" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    bookings: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="11" y="12" width="22" height="22" rx="3" stroke="#0891B2" stroke-width="2.8"/>
      <path d="M16 8V12M28 8V12M11 18H33" stroke="#0891B2" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="22" cy="25" r="2" fill="#0891B2"/>
    </svg>`,

    thrive: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M14 16L22 10L30 16V26L22 32L14 26V16Z" stroke="#2563EB" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M22 16L23.5 20.5H28L24.5 23L26 27.5L22 25L18 27.5L19.5 23L16 20.5H20.5L22 16Z" fill="#2563EB"/>
    </svg>`,

    people: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <circle cx="22" cy="15" r="4.5" stroke="#2563EB" stroke-width="2.8"/>
      <path d="M13 31C13 26 17 23 22 23C27 23 31 26 31 31" stroke="#2563EB" stroke-width="2.8" stroke-linecap="round"/>
    </svg>`,

    peopleplus: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <circle cx="16" cy="16" r="4.5" stroke="#2563EB" stroke-width="2.5"/>
      <path d="M9 30C9 25 12.5 23 16 23C19.5 23 23 25 23 30" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M29 16V24M25 20H33" stroke="#F59E0B" stroke-width="2.8" stroke-linecap="round"/>
    </svg>`,

    recruit: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <circle cx="19" cy="19" r="6" stroke="#10B981" stroke-width="2.8"/>
      <path d="M24 24L32 32" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
      <circle cx="19" cy="19" r="2" fill="#10B981"/>
    </svg>`,

    payroll: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <circle cx="22" cy="22" r="11" stroke="#059669" stroke-width="2.8"/>
      <path d="M22 15V29M18 19H24C25.5 19 26.5 20 26.5 21.5C26.5 23 25.5 24 24 24H20C18.5 24 17.5 25 17.5 26.5C17.5 28 18.5 29 20 29H26" stroke="#059669" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,

    books: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M12 12H29C30.6569 12 32 13.3431 32 15V32H15C13.3431 32 12 30.6569 12 29V12Z" stroke="#2563EB" stroke-width="2.8"/>
      <path d="M12 28H32" stroke="#2563EB" stroke-width="2"/>
      <circle cx="20" cy="20" r="2" fill="#D97706"/>
    </svg>`,

    invoice: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="13" y="10" width="18" height="24" rx="3" stroke="#16A34A" stroke-width="2.8"/>
      <path d="M18 17H26M18 22H26M18 27H22" stroke="#16A34A" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,

    expense: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="11" y="13" width="22" height="18" rx="3" stroke="#EA580C" stroke-width="2.8"/>
      <path d="M11 19H33M20 25H27" stroke="#EA580C" stroke-width="2.4" stroke-linecap="round"/>
    </svg>`,

    inventory: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M12 17L22 12L32 17L22 22L12 17Z" stroke="#EA580C" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M12 17V27L22 32V22M32 17V27L22 32" stroke="#EA580C" stroke-width="2.8" stroke-linejoin="round"/>
    </svg>`,

    checkout: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="11" y="13" width="22" height="18" rx="3" stroke="#16A34A" stroke-width="2.8"/>
      <path d="M11 19H33M16 26H20" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    desk: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M13 23C13 17 17 13 22 13C27 13 31 17 31 23V28C31 29.5 30 30.5 28.5 30.5H27" stroke="#2563EB" stroke-width="2.8" stroke-linecap="round"/>
      <rect x="10" y="21" width="5" height="7" rx="2" fill="#2563EB"/>
      <rect x="29" y="21" width="5" height="7" rx="2" fill="#2563EB"/>
    </svg>`,

    assist: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="11" y="12" width="22" height="17" rx="3" stroke="#16A34A" stroke-width="2.8"/>
      <path d="M17 33H27M22 29V33M18 20L22 17L26 20" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    lens: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <circle cx="17" cy="22" r="5" stroke="#9333EA" stroke-width="2.8"/>
      <circle cx="27" cy="22" r="5" stroke="#9333EA" stroke-width="2.8"/>
      <path d="M22 22H22.01" stroke="#9333EA" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    voice: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M14 16C14 16 16 13 20 15C24 17 23 20 26 23C29 26 31 24 33 28C35 32 32 34 32 34C28 36 18 32 13 27C8 22 10 18 14 16Z" stroke="#2563EB" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    mail: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="11" y="13" width="22" height="18" rx="3" stroke="#DC2626" stroke-width="2.8"/>
      <path d="M11 16L22 24L33 16" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    cliq: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M13 21C13 16 17 13 22 13C27 13 31 16 31 21C31 24 29 26.5 26.5 27.5L28 32L23.5 29C23 29 22.5 29 22 29C17 29 13 25.5 13 21Z" stroke="#16A34A" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    workdrive: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M12 16H19L22 19H32V29H12V16Z" stroke="#2563EB" stroke-width="2.8" stroke-linejoin="round"/>
    </svg>`,

    projects: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <circle cx="22" cy="22" r="10" stroke="#EA580C" stroke-width="2.8"/>
      <path d="M22 16V22L26 25" stroke="#EA580C" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    sprints: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M26 15C29 17 31 20 31 24C31 29 27 33 22 33C17 33 13 29 13 24C13 19 17 15 22 15C23.5 15 25 15.5 26 16.5" stroke="#9333EA" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M26 11V16H21" stroke="#9333EA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    meeting: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="11" y="14" width="15" height="16" rx="3" stroke="#2563EB" stroke-width="2.8"/>
      <path d="M26 19L33 15V29L26 25V19Z" fill="#2563EB"/>
    </svg>`,

    writer: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="13" y="10" width="18" height="24" rx="3" stroke="#3B82F6" stroke-width="2.8"/>
      <path d="M17 16H27M17 21H27M17 26H23" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    sheet: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="11" y="11" width="22" height="22" rx="3" stroke="#16A34A" stroke-width="2.8"/>
      <path d="M11 19H33M11 26H33M19 11V33M26 11V33" stroke="#16A34A" stroke-width="1.8"/>
    </svg>`,

    show: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="11" y="13" width="22" height="17" rx="3" stroke="#EA580C" stroke-width="2.8"/>
      <path d="M18 17L26 21.5L18 26V17Z" fill="#EA580C"/>
    </svg>`,

    analytics: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M13 30V24M19 30V19M25 30V15M31 30V10" stroke="#2563EB" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="31" cy="8" r="2" fill="#D97706"/>
    </svg>`,

    dataprep: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <path d="M12 16H32M12 22H28M12 28H24" stroke="#16A34A" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    one: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <circle cx="22" cy="22" r="11" stroke="#1D4ED8" stroke-width="3"/>
      <path d="M19 17L22 15V28" stroke="#1D4ED8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    creator: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="11" y="11" width="8" height="8" rx="2" stroke="#EA580C" stroke-width="2.5"/>
      <rect x="25" y="11" width="8" height="8" rx="2" stroke="#EA580C" stroke-width="2.5"/>
      <rect x="11" y="25" width="8" height="8" rx="2" stroke="#EA580C" stroke-width="2.5"/>
      <rect x="25" y="25" width="8" height="8" rx="2" fill="#EA580C"/>
    </svg>`,

    flow: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <circle cx="15" cy="16" r="3.5" stroke="#059669" stroke-width="2.5"/>
      <circle cx="29" cy="16" r="3.5" stroke="#059669" stroke-width="2.5"/>
      <circle cx="22" cy="28" r="3.5" stroke="#059669" stroke-width="2.5"/>
      <path d="M17.5 18L20 25.5M26.5 18L24 25.5" stroke="#059669" stroke-width="2"/>
    </svg>`,

    backstage: `<svg viewBox="0 0 44 44" fill="none" class="brand-vector-icon">
      <rect x="10" y="11" width="24" height="22" rx="3" stroke="#2563EB" stroke-width="2.8"/>
      <path d="M10 18H34M17 25L22 28L27 25" stroke="#2563EB" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`
  };

  // Official Zoho Brand Image/Logo Map matching the user's provided folder: zoho logo photo
  const productImageMap = {
    // Revenue & Growth
    'CRM': 'zoho crm.svg',
    'CRM Plus': 'zoho crm plus.svg',
    'Bigin': 'zoho bigin.svg',
    'SalesIQ': 'Zoho SaleIQ.svg',
    'Marketing Automation': 'Zoho Marketimg automation.svg',
    'Social': 'zoho social.svg',
    'Campaigns': 'zoho campaigns.svg',
    'Forms': 'zoho forms.svg',
    'Sign': 'zoho sign.svg',
    'Bookings': 'zoho booking.svg',
    'Booking': 'zoho booking.svg',
    'Backstage': 'zoho backstage.svg',

    // People & Talent
    'People': 'zoho  people.svg',
    'People Plus': 'zoho people plus.svg',
    'Recruit': 'zoho recruit.svg',
    'Payroll': ' zoho payrol.svg',

    // Finance & Control
    'Books': 'zoho books.svg',
    'Invoice': 'zoho invoice.png',
    'Expense': 'zoho expance.svg',
    'Inventory': 'zoho inventory.svg',
    'Checkout': 'zoho checkout.svg',

    // Customer Experience
    'Desk': 'zoho desk.svg',
    'Assist': 'zoho assist.svg',
    'Lens': 'zoho lens.svg',

    // Operations & Workplace
    'Mail': 'zoho mail.svg',
    'Cliq': 'zoho cliq.svg',
    'WorkDrive': 'zoho workfrive.svg',
    'Projects': 'zoho_projects.svg',
    'Meeting': 'zoho meeting.svg',
    'Writer': 'zoho writer.svg',
    'Sheet': 'zoho sheet.svg',
    'Show': 'zoho show.svg',

    // Data & Insights
    'Analytics': 'zoho analytics.svg',
    'DataPrep': 'zoho dataprep.svg',

    // Strategy & Custom Solutions
    'One': 'zoho one.png',
    'Zoho One': 'zoho one.png',
    'Creator': 'zoho creator.svg',
    'Flow': 'zoho flow.svg'
  };

  // Complete Product Catalog with Exact Match to New Image
  const categories = [
    {
      id: 'revenue-growth',
      name: 'Revenue & Growth',
      serviceHighlight: 'Sales & Marketing',
      products: [
        {
          name: 'CRM',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'crm',
          headline: 'Attract, retain and delight customers',
          desc: 'Zoho CRM offers a complete 360° view of your sales cycle, helping you focus on sales by streamlining different processes.'
        },
        {
          name: 'CRM Plus',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'crmplus',
          headline: 'A CRM enhancement platform with integration capabilities',
          desc: 'Streamline customer interactions, enhance team collaboration and deliver exceptional end-to-end customer experiences.'
        },
        {
          name: 'Bigin',
          brandPrefix: '',
          subName: 'by Zoho CRM',
          icon: 'bigin',
          headline: 'One place to manage all your business contracts',
          desc: 'From sales deals, support tickets, delivery, contracts and everything in between—Bigin is your all-in-one platform to streamline all customer operations.'
        },
        {
          name: 'SalesIQ',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'salesiq',
          headline: 'Get insights about real-time visitor interactions',
          desc: 'Understand customer trends, optimise customer engagement, review feedback and create targeted marketing campaigns.'
        },
        {
          name: 'Marketing Automation',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'marketingautomation',
          headline: 'Maximize lead generation and conversion',
          desc: 'Zoho Marketing Automation is a robust platform designed to streamline marketing workflows, automate lead scoring, and manage omnichannel campaigns.'
        },
        {
          name: 'Social',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'social',
          headline: 'Manage your social media platforms in one place',
          desc: 'Zoho Social is a powerful tool that can help you manage all your social media channels, schedule posts, monitor engagement, and analyze performance.'
        },
        {
          name: 'Campaigns',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'campaigns',
          headline: 'Create email marketing campaigns with ease',
          desc: 'Zoho Campaigns is a comprehensive email marketing solution for businesses of all sizes to engage audiences and drive repeat revenue.'
        },
        {
          name: 'Forms',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'forms',
          headline: 'Build responsive online forms with conditional logic',
          desc: 'Create interactive forms to collect customer information, accept payments, and seamlessly trigger automated CRM workflows.'
        },
        {
          name: 'Sign',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'sign',
          headline: 'Complete digital signature workflows securely',
          desc: 'Legally binding digital signature and document workflow signing for contracts, NDAs, and agreements.'
        },
        {
          name: 'Bookings',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'bookings',
          headline: 'Effortless appointment scheduling for clients',
          desc: 'Sync calendars, manage staff availability, and enable customer self-scheduling with automated reminders.'
        },
        {
          name: 'Backstage',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'backstage',
          headline: 'End-to-end enterprise event management software',
          desc: 'Plan, design, promote, and execute virtual, hybrid, or in-person business conferences with custom ticketing and attendee networking.'
        }
      ]
    },
    {
      id: 'people-talent',
      name: 'People & Talent',
      serviceHighlight: 'HRMS & Talent Management',
      products: [
        {
          name: 'People',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'people',
          headline: 'Empower your workforce with smart HR management',
          desc: 'Complete HR management from onboarding to attendance, leave tracking, and annual 360° performance reviews.'
        },
        {
          name: 'People Plus',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'peopleplus',
          headline: 'An all-in-one HR management platform',
          desc: 'Deliver outstanding digital HR experiences to your employees.'
        },
        {
          name: 'Recruit',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'recruit',
          headline: 'Attract and hire top-tier industry talent faster',
          desc: 'All-in-one applicant tracking system (ATS) for sourcing candidates, scheduling interviews, and sending offer letters.'
        },
        {
          name: 'Payroll',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'payroll',
          headline: 'Automated, compliant, and stress-free payroll',
          desc: 'Automated salary disbursements, statutory tax compliance, direct deposits, and comprehensive employee payslips.'
        }
      ]
    },
    {
      id: 'finance-control',
      name: 'Finance & Control',
      serviceHighlight: 'Accounting, Billing & Inventory',
      products: [
        {
          name: 'Books',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'books',
          headline: 'Powerful cloud accounting built for growing business',
          desc: 'End-to-end accounting, automated invoicing, multi-currency transactions, bank reconciliations, and tax filing.'
        },
        {
          name: 'Invoice',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'invoice',
          headline: 'Get paid faster with beautiful online invoices',
          desc: 'Create custom professional invoices, track retainer payments, and collect client payments with zero transaction fees.'
        },
        {
          name: 'Expense',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'expense',
          headline: 'Automate corporate travel & expense reporting',
          desc: 'Smart receipt scanning, multi-tier approval workflows, corporate card reconciliations, and travel policy compliance.'
        },
        {
          name: 'Inventory',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'inventory',
          headline: 'Streamline multi-channel order fulfillment',
          desc: 'Real-time stock management, multi-warehouse routing, barcode scanning, and integrations with Amazon, eBay, and Shopify.'
        },
        {
          name: 'Checkout',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'checkout',
          headline: 'Customizable hosted checkout & payment pages',
          desc: 'Build secure, branded payment pages to collect one-time or recurring payments in minutes without writing code.'
        }
      ]
    },
    {
      id: 'customer-experience',
      name: 'Customer Experience',
      serviceHighlight: 'Support & Field Service',
      products: [
        {
          name: 'Desk',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'desk',
          headline: 'Deliver exceptional context-aware customer service',
          desc: 'Omnichannel customer ticket desk with AI-powered triage, SLA escalation rules, and multi-department knowledge bases.'
        },
        {
          name: 'Assist',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'assist',
          headline: 'Fast and secure on-demand remote support',
          desc: 'Remote desktop support, unattended computer access, and file transfer capabilities for IT help desks.'
        },
        {
          name: 'Lens',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'lens',
          headline: 'Augmented reality visual assistance for field techs',
          desc: 'Connect remote experts with on-site technicians via live AR video streaming and 3D spatial annotations.'
        }
      ]
    },
    {
      id: 'operations-workplace',
      name: 'Operations & Workplace',
      serviceHighlight: 'Collaboration & Productivity Suite',
      products: [
        {
          name: 'Mail',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'mail',
          headline: 'Ad-free, privacy-first business email hosting',
          desc: 'Secure, privacy-first business email hosting with custom domain support, calendar, and task management.'
        },
        {
          name: 'Cliq',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'cliq',
          headline: 'Real-time team communication and collaboration',
          desc: 'Organized team chat channels, audio/video conferencing, bot integrations, and contextual workflow actions.'
        },
        {
          name: 'WorkDrive',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'workdrive',
          headline: 'Secure cloud content collaboration platform',
          desc: 'Cloud team folders, granular role permissions, built-in document previewing, and encrypted file sharing.'
        },
        {
          name: 'Projects',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'projects',
          headline: 'Plan, track, and collaborate on complex deliverables',
          desc: 'Comprehensive project planning, interactive Gantt charts, timesheets, and milestone tracking.'
        },
        {
          name: 'Meeting',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'meeting',
          headline: 'Secure online video conferencing & webinars',
          desc: 'High-definition video meetings, screen sharing, interactive webinar polling, and cloud recording.'
        },
        {
          name: 'Writer',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'writer',
          headline: 'Clean and powerful collaborative word processor',
          desc: 'Real-time collaborative document editing, track changes, electronic signing, and automated templates.'
        },
        {
          name: 'Sheet',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'sheet',
          headline: 'Intelligent cloud spreadsheets with automated data',
          desc: 'Collaborative spreadsheets with 350+ functions, automated pivot tables, and Zia AI chart recommendations.'
        },
        {
          name: 'Show',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'show',
          headline: 'Create visually stunning animated slide decks',
          desc: 'Modern presentation design tool with collaborative real-time slide creation, transitions, and broadcasting.'
        }
      ]
    },
    {
      id: 'data-insights',
      name: 'Data & Insights',
      serviceHighlight: 'Business Intelligence & Web Analytics',
      products: [
        {
          name: 'Analytics',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'analytics',
          headline: 'Transform raw data into actionable visual insights',
          desc: 'Enterprise self-service BI dashboards, KPI tracking, automated data blending, and AI-assisted predictive analytics.'
        },
        {
          name: 'DataPrep',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'dataprep',
          headline: 'Automated data cleansing & transformation pipelines',
          desc: 'Machine-learning assisted data preparation, cleansing, deduplication, and automated ETL pipelines.'
        }
      ]
    },
    {
      id: 'strategy-custom',
      name: 'Strategy & Custom Solutions',
      serviceHighlight: 'Custom Deluge & Enterprise Architecture',
      products: [
        {
          name: 'One',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'one',
          headline: 'The unified operating system for your enterprise',
          desc: 'An all-in-one suite of 50+ enterprise apps to run your entire sales, marketing, support, and back-office operations.'
        },
        {
          name: 'Creator',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'creator',
          headline: 'Build custom low-code applications rapidly',
          desc: 'Low-code enterprise application development platform with Deluge scripting, automated workflows, and mobile app generation.'
        },
        {
          name: 'Flow',
          brandPrefix: 'Zoho',
          subName: '',
          icon: 'flow',
          headline: 'Connect cloud applications and automate workflows',
          desc: 'No-code integration engine with multi-step trigger logic connecting Zoho apps to 600+ third-party cloud tools.'
        }
      ]
    }
  ];

  function initZohoCatalog() {
    const catNavList = document.getElementById('zohoCatNav');
    const prodGridContainer = document.getElementById('zohoProductGrid');
    const searchInput = document.getElementById('zohoSearchInput');
    const currentCategoryTitle = document.getElementById('currentCatTitle');
    const currentCatCountBadge = document.getElementById('currentCatCountBadge');

    if (!catNavList || !prodGridContainer) return;

    let activeCatId = 'revenue-growth';
    let searchQuery = '';

    function renderCategories() {
      catNavList.innerHTML = categories
        .map((cat) => {
          const isActive = cat.id === activeCatId && !searchQuery ? 'active' : '';
          return `
            <button type="button" class="zoho-category-pill-btn ${isActive}" data-cat-id="${cat.id}">
              <span>${cat.name}</span>
            </button>
          `;
        })
        .join('');

      const catBtns = catNavList.querySelectorAll('.zoho-category-pill-btn');
      catBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const catId = btn.getAttribute('data-cat-id');
          activeCatId = catId;
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          renderCategories();
          renderProducts();
        });
      });
    }

    function renderProducts() {
      let displayList = [];
      let titleText = '';

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const allProds = [];
        const seen = new Set();

        categories.forEach((cat) => {
          cat.products.forEach((p) => {
            const fullName = p.brandPrefix ? `${p.brandPrefix} ${p.name}` : p.name;
            if (!seen.has(fullName)) {
              seen.add(fullName);
              allProds.push(p);
            }
          });
        });

        displayList = allProds.filter(
          (p) =>
            (p.brandPrefix && p.brandPrefix.toLowerCase().includes(q)) ||
            p.name.toLowerCase().includes(q) ||
            p.headline.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q)
        );

        titleText = `Search Results for "${searchQuery}"`;
      } else {
        const selectedCategory = categories.find((c) => c.id === activeCatId) || categories[0];
        displayList = selectedCategory.products;
        titleText = selectedCategory.name;
      }

      if (currentCategoryTitle) currentCategoryTitle.textContent = titleText;
      if (currentCatCountBadge) {
        currentCatCountBadge.textContent = `${displayList.length} Applications`;
      }

      if (displayList.length === 0) {
        prodGridContainer.innerHTML = `
          <div class="zoho-no-results-box" style="grid-column: 1 / -1; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 16px; padding: 3rem 2rem; text-align: center; color: #0F172A;">
            <h4 style="font-size: 1.2rem; font-weight: 800; margin-bottom: 0.5rem;">No applications found matching "${searchQuery}"</h4>
            <p style="color: #64748B; font-size: 0.9rem; margin-bottom: 1.2rem;">Try searching for "CRM", "SalesIQ", "Campaigns", "Social", or "Books".</p>
            <button class="btn-explore-blue" id="resetSearchBtn" style="border: none; cursor: pointer;">View All Applications</button>
          </div>
        `;
        const resetBtn = document.getElementById('resetSearchBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            renderCategories();
            renderProducts();
          });
        }
        return;
      }

      prodGridContainer.innerHTML = displayList
        .map((prod) => {
          const iconSvg = icons[prod.icon] || icons.crm;
          const fullDisplayName = prod.brandPrefix ? `${prod.brandPrefix} ${prod.name}` : prod.name;
          const imgFilename = productImageMap[prod.name] || productImageMap[fullDisplayName];

          let brandHeaderHtml = '';
          if (imgFilename) {
            const encodedPath = `../zoho%20logo%20photo/${encodeURIComponent(imgFilename)}`;
            const isOne = (prod.name === 'One' || prod.name === 'Zoho One');
            brandHeaderHtml = `
              <div class="zoho-card-brand-header zoho-has-brand-img ${isOne ? 'zoho-brand-one-wrap' : ''}">
                <img 
                  src="${encodedPath}" 
                  class="zoho-card-brand-logo-img ${isOne ? 'zoho-brand-one-img' : ''}" 
                  alt="${fullDisplayName}" 
                  loading="lazy"
                />
                ${isOne ? `
                <div class="zoho-card-brand-text" style="margin-left: 12px; display: inline-flex; align-items: baseline; gap: 4px;">
                  <span class="zoho-card-brand-prefix">Zoho</span>
                  <span class="zoho-card-brand-name">One</span>
                </div>
                ` : ''}
              </div>
            `;
          } else {
            brandHeaderHtml = `
              <div class="zoho-card-brand-header">
                <div class="zoho-card-icon-wrap">
                  ${iconSvg}
                </div>
                <div class="zoho-card-brand-text">
                  ${prod.brandPrefix ? `<span class="zoho-card-brand-prefix">${prod.brandPrefix}</span>` : ''}
                  <span class="zoho-card-brand-name">${prod.name}</span>
                  ${prod.subName ? `<span class="zoho-card-brand-subname">${prod.subName}</span>` : ''}
                </div>
              </div>
            `;
          }

          return `
            <div class="zoho-rect-card" data-product-name="${fullDisplayName}">
              
              <!-- Brand Header with Official Product Logo -->
              ${brandHeaderHtml}

              <!-- Headline matching image -->
              <h3 class="zoho-card-headline">${prod.headline}</h3>

              <!-- Description paragraph matching image -->
              <p class="zoho-card-desc">${prod.desc}</p>
              
              <!-- Action CTA: Contact Us (Smooth scroll to Contact section on Zoho page) -->
              <div class="zoho-card-footer">
                <a href="#zohoFaqContactSection" class="zoho-card-cta-link js-product-contact-btn" data-product="${fullDisplayName}">
                  <span>Contact Us</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 4px;">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>

            </div>
          `;
        })
        .join('');

      // Fallback for any image load error
      prodGridContainer.querySelectorAll('.zoho-card-brand-logo-img').forEach((img) => {
        img.addEventListener('error', function () {
          const parent = this.closest('.zoho-card-brand-header');
          const card = this.closest('.zoho-rect-card');
          const pName = card ? card.getAttribute('data-product-name') : 'Zoho Application';
          if (parent) {
            parent.innerHTML = `
              <div class="zoho-card-brand-text">
                <span class="zoho-card-brand-name" style="font-size: 1.05rem; font-weight: 800; color: #0F172A;">${pName}</span>
              </div>
            `;
          }
        });
      });

      const contactBtns = prodGridContainer.querySelectorAll('.js-product-contact-btn');
      contactBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const prodName = btn.getAttribute('data-product') || 'Zoho';
          const targetSec = document.getElementById('zohoFaqContactSection');
          if (targetSec) {
            targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Pre-fill message and select suite
            const msgInput = document.getElementById('LEADCF1') || document.getElementById('contactMessage');
            if (msgInput) {
              msgInput.value = `I am interested in implementing / integrating ${prodName}.`;
            }
            if (window.selectZohoService) {
              window.selectZohoService(prodName);
            }
            const nameInput = document.getElementById('Company') || document.getElementById('Last_Name') || document.getElementById('contactName');
            if (nameInput) {
              setTimeout(() => nameInput.focus(), 650);
            }
          }
        });
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
      });
    }

    // Connect Hero Department Pills to Categories
    document.querySelectorAll('.zoho-hero-dept-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const catTarget = pill.getAttribute('data-cat');
        if (catTarget) {
          activeCatId = catTarget;
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          renderCategories();
          renderProducts();
        }
      });
    });

    renderCategories();
    renderProducts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initZohoCatalog);
  } else {
    initZohoCatalog();
  }
})();
