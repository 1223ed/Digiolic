/**
 * DIGIOLIC — DIGITAL MARKETING & SERVICES DIRECTORY ENGINE
 * Full services catalog matching digiolic.com/services/
 * Left Sidebar Category Navigation, Live Search, 3-Column Rectangle Cards, and Contact CTA
 */

(function () {
  'use strict';

  // Vector SVG Icons
  const icons = {
    performance: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#EFF6FF"/><path d="M9 21l4-5 3 3 7-9" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="19 10 23 10 23 14" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    affiliate: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#ECFDF5"/><circle cx="12" cy="14" r="3" stroke="#10B981" stroke-width="1.6"/><circle cx="20" cy="14" r="3" stroke="#10B981" stroke-width="1.6"/><path d="M15 14h2" stroke="#10B981" stroke-width="1.6"/><path d="M9 22c0-2.5 2-4 4.5-4h5c2.5 0 4.5 1.5 4.5 4" stroke="#10B981" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    cro: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#FFFBEB"/><circle cx="16" cy="16" r="7" stroke="#D97706" stroke-width="1.8"/><circle cx="16" cy="16" r="3.5" stroke="#D97706" stroke-width="1.6"/><circle cx="16" cy="16" r="1" fill="#D97706"/></svg>`,
    testing: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#EFF6FF"/><path d="M11 10h10M11 16h6M11 22h8" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round"/><circle cx="21" cy="22" r="1.5" fill="#2563EB"/></svg>`,
    analytics: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#EFF6FF"/><path d="M10 21v-4M14 21v-8M18 21v-6M22 21v-11" stroke="#2563EB" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="9" r="1.2" fill="#D97706"/></svg>`,
    seo: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#ECFDF5"/><circle cx="14" cy="14" r="5" stroke="#10B981" stroke-width="1.8"/><path d="M18 18l4 4" stroke="#10B981" stroke-width="2" stroke-linecap="round"/></svg>`,
    keyword: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#EFF6FF"/><circle cx="13" cy="13" r="3" stroke="#2563EB" stroke-width="1.6"/><path d="M15.5 15.5l5.5 5.5M18.5 18.5l2-2" stroke="#2563EB" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    onpage: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#EFF6FF"/><rect x="9" y="9" width="14" height="14" rx="2" stroke="#2563EB" stroke-width="1.6"/><path d="M9 13h14M13 9v4" stroke="#2563EB" stroke-width="1.6"/></svg>`,
    backlinks: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#FAF5FF"/><path d="M13 19l-2 2a4 4 0 0 1-5.6-5.6l2-2a4 4 0 0 1 5.6 0M19 13l2-2a4 4 0 0 0-5.6-5.6l-2 2a4 4 0 0 0 0 5.6" stroke="#9333EA" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    audit: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#FEF2F2"/><rect x="10" y="8" width="12" height="16" rx="2" stroke="#DC2626" stroke-width="1.6"/><path d="M13 13l2 2 4-4M13 18h6" stroke="#DC2626" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    ppc: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#FFF7ED"/><circle cx="16" cy="16" r="7" stroke="#EA580C" stroke-width="1.8"/><path d="M16 12v4l3 2" stroke="#EA580C" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    google: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#EFF6FF"/><circle cx="16" cy="16" r="7" stroke="#2563EB" stroke-width="1.8"/><path d="M16 12a4 4 0 0 1 4 4h-4" stroke="#2563EB" stroke-width="1.6"/></svg>`,
    socialads: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#EFF6FF"/><circle cx="12" cy="12" r="3" stroke="#2563EB" stroke-width="1.6"/><circle cx="20" cy="20" r="3" stroke="#2563EB" stroke-width="1.6"/><path d="M14.5 14.5l3 3" stroke="#2563EB" stroke-width="1.6"/></svg>`,
    retargeting: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#FAF5FF"/><path d="M19 12A6 6 0 1 0 21 17" stroke="#9333EA" stroke-width="1.8" stroke-linecap="round"/><polyline points="21 13 21 17 17 17" stroke="#9333EA" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    influencer: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#FEF3C7"/><path d="M16 9l2 4 4.5.7-3.2 3.1.8 4.4-4.1-2.2-4.1 2.2.8-4.4-3.2-3.1 4.5-.7 2-4z" stroke="#D97706" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    ai: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#ECFEFF"/><circle cx="16" cy="16" r="4" stroke="#0891B2" stroke-width="1.8"/><path d="M16 8v3M16 21v3M8 16h3M21 16h3M10.3 10.3l2.2 2.2M19.5 19.5l2.2 2.2M10.3 21.7l2.2-2.2M19.5 12.5l2.2-2.2" stroke="#0891B2" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    branding: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#FFF7ED"/><circle cx="16" cy="16" r="7" stroke="#EA580C" stroke-width="1.8"/><polygon points="16 11 18 15 22 16 18 17 16 21 14 17 10 16 14 15" fill="#EA580C"/></svg>`,
    content: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#EFF6FF"/><rect x="10" y="8" width="12" height="16" rx="2" stroke="#2563EB" stroke-width="1.6"/><path d="M13 12h6M13 16h6M13 20h4" stroke="#2563EB" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    video: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#FEF2F2"/><rect x="9" y="10" width="10" height="12" rx="2" stroke="#DC2626" stroke-width="1.6"/><path d="M19 13l5-2v10l-5-2v-6z" fill="#DC2626"/></svg>`,
    strategy: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#F0FDF4"/><circle cx="16" cy="16" r="7" stroke="#16A34A" stroke-width="1.8"/><path d="M16 11l1.5 3.5 3.5 1.5-3.5 1.5L16 21l-1.5-3.5L11 16l3.5-1.5L16 11z" fill="#16A34A"/></svg>`,
    web: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#EFF6FF"/><rect x="9" y="9" width="14" height="14" rx="2" stroke="#2563EB" stroke-width="1.6"/><path d="M9 13h14M13 10h1" stroke="#2563EB" stroke-width="1.6"/></svg>`,
    email: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#FEF2F2"/><rect x="9" y="10" width="14" height="12" rx="2" stroke="#DC2626" stroke-width="1.6"/><path d="M9 12l7 5 7-5" stroke="#DC2626" stroke-width="1.6"/></svg>`,
    orm: `<svg viewBox="0 0 32 32" fill="none" class="rect-icon"><rect width="32" height="32" rx="7" fill="#ECFDF5"/><path d="M12 22s8-4 8-10V7l-8-3-8 3v5c0 6 8 10 8 10z" stroke="#059669" stroke-width="1.6"/><path d="M13 14l2 2 4-4" stroke="#059669" stroke-width="1.6" stroke-linecap="round"/></svg>`
  };

  // Comprehensive Services Catalog matching digiolic.com/services/
  const categories = [
    {
      id: 'performance-ads',
      name: 'Performance & Paid Ads',
      serviceHighlight: 'Full-Funnel Paid Acquisition & CRO',
      services: [
        { name: 'Conversion Rate Optimization (CRO)', icon: 'cro', desc: 'Enhancing site architecture and user funnels to maximize conversion rates and revenue.' },
        { name: 'Google Ads & Paid Search', icon: 'google', desc: 'Capturing high-intent enterprise search traffic across Google Search, Display, and Performance Max.' },
        { name: 'Social Media Advertising', icon: 'socialads', desc: 'High-converting multi-tier ad campaigns on LinkedIn, Meta (Facebook/Instagram), and TikTok.' },
        { name: 'Affiliate Marketing & Partnerships', icon: 'affiliate', desc: 'Leveraging strategic publisher and affiliate networks to drive risk-free incremental sales.' },
        { name: 'A/B & Multivariate Testing', icon: 'testing', desc: 'Scientific experimentation on headlines, creative layouts, and checkout funnels for winning ROI.' },
        { name: 'Retargeting & Audience Funnels', icon: 'retargeting', desc: 'Re-engaging visitors and cart abandoners with dynamic multi-touch retargeting sequences.' },
        { name: 'Programmatic Display Advertising', icon: 'ppc', desc: 'Targeted high-impact display ads across premium publisher networks and contextual media.' },
        { name: 'Performance Data Analysis', icon: 'analytics', desc: 'Closed-loop multi-touch attribution connecting paid marketing clicks to CRM pipeline revenue.' }
      ]
    },
    {
      id: 'seo-visibility',
      name: 'SEO & Organic Growth',
      serviceHighlight: 'Search Engine Optimization & Authority',
      services: [
        { name: 'Keyword Research & Mapping', icon: 'keyword', desc: 'In-depth commercial and informational keyword analysis to target high-intent buyer search volume.' },
        { name: 'On-Page SEO Optimization', icon: 'onpage', desc: 'Optimizing internal content, meta tags, schema markup, and heading structure for rank dominance.' },
        { name: 'High-Authority Link Building', icon: 'backlinks', desc: 'Securing top-tier editorial backlinks and digital PR coverage to elevate domain trust.' },
        { name: 'Technical SEO Audits', icon: 'audit', desc: 'Fixing crawl errors, indexation issues, site speed, and Core Web Vitals to unlock organic rank.' }
      ]
    },
    {
      id: 'ai-automation',
      name: 'AI-Driven Marketing',
      serviceHighlight: 'AI Automation & Behavioral Intelligence',
      services: [
        { name: 'AI-Powered Campaigns', icon: 'ai', desc: 'Automate campaign creation, dynamic creative variation, and real-time ad bidding optimization.' },
        { name: 'Predictive Analytics & LTV', icon: 'analytics', desc: 'Leveraging AI algorithms to forecast customer behavior, churn risk, and future sales.' },
        { name: 'Marketing Workflow Automation', icon: 'ai', desc: 'Streamlining cross-channel nurturing processes to save hours and accelerate sales velocity.' },
        { name: 'Lifecycle Email Automation', icon: 'email', desc: 'Developing behavioral automated email sequences that convert prospects and retain buyers.' }
      ]
    },
    {
      id: 'influencer-social',
      name: 'Influencer & Social',
      serviceHighlight: 'Creator Partnerships & Community',
      services: [
        { name: 'Influencer Identification', icon: 'influencer', desc: 'Finding and vetting the perfect niche creators and brand ambassadors for your market.' },
        { name: 'Campaign Strategy & Briefs', icon: 'strategy', desc: 'Developing structured creative briefs, deliverables, and performance compensation terms.' },
        { name: 'Creator Content Collaboration', icon: 'influencer', desc: 'Managing co-branded Reels, YouTube integrations, and sponsor activations that build trust.' },
        { name: 'Social Media Management', icon: 'socialads', desc: 'End-to-end platform management, curated aesthetic feeds, and strategic publishing calendars.' },
        { name: 'Community Engagement & Moderation', icon: 'socialads', desc: 'Active conversation nurturing, customer interaction, and positive sentiment building.' }
      ]
    },
    {
      id: 'branding-identity',
      name: 'Branding & Design',
      serviceHighlight: 'Brand Identity & Visual Architecture',
      services: [
        { name: 'Brand Strategy & Positioning', icon: 'branding', desc: 'Defining your company mission, unique value proposition, tone of voice, and competitive moat.' },
        { name: 'Logo Design & Visual Identity', icon: 'branding', desc: 'Creating iconic logos, cohesive color systems, typography standards, and brand guidelines.' },
        { name: 'Brand Messaging Architecture', icon: 'content', desc: 'Crafting compelling brand stories and consistent elevator pitches across all touchpoints.' },
        { name: 'Custom Web Design & UX', icon: 'web', desc: 'Building stunning, ultra-fast responsive websites engineered for frictionless conversions.' }
      ]
    },
    {
      id: 'content-video',
      name: 'Content & Media',
      serviceHighlight: 'Editorial Strategy & Video Production',
      services: [
        { name: 'Content Marketing Strategy', icon: 'content', desc: 'Planning high-impact editorial themes that attract organic traffic and establish thought leadership.' },
        { name: 'B2B Blog & Whitepaper Writing', icon: 'content', desc: 'Authoritative articles, case studies, and research whitepapers written by domain experts.' },
        { name: 'High-Impact Video Production', icon: 'video', desc: 'Producing cinematic brand films, product walkthroughs, social reels, and testimonial videos.' },
        { name: 'Visual Infographics & Data Stories', icon: 'content', desc: 'Transforming complex business metrics into shareable visual graphics and decks.' }
      ]
    }
  ];

  function initMarketingCatalog() {
    const catNavList = document.getElementById('marketingCatNav');
    const prodGridContainer = document.getElementById('marketingProductGrid');
    const searchInput = document.getElementById('marketingSearchInput');
    const currentCategoryTitle = document.getElementById('currentCatTitle');
    const currentServiceHighlight = document.getElementById('currentServiceHighlight');

    if (!catNavList || !prodGridContainer) return;

    let activeCatId = 'performance-ads';
    let searchQuery = '';

    function renderCategories() {
      catNavList.innerHTML = categories
        .map((cat) => {
          const isActive = cat.id === activeCatId && !searchQuery ? 'active' : '';
          return `
            <button type="button" class="zoho-category-pill-btn ${isActive}" data-cat-id="${cat.id}">
              ${cat.name}
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
          renderServices();
        });
      });
    }

    function renderServices() {
      let displayList = [];
      let titleText = '';
      let serviceText = '';

      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const allServices = [];
        const seen = new Set();

        categories.forEach((cat) => {
          cat.services.forEach((s) => {
            if (!seen.has(s.name)) {
              seen.add(s.name);
              allServices.push(s);
            }
          });
        });

        displayList = allServices.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.desc.toLowerCase().includes(q)
        );

        titleText = `Search Results for "${searchQuery}"`;
        serviceText = `Matching ${displayList.length} Growth Capabilities`;
      } else {
        const selectedCategory = categories.find((c) => c.id === activeCatId) || categories[0];
        displayList = selectedCategory.services;
        titleText = selectedCategory.name;
        serviceText = selectedCategory.serviceHighlight;
      }

      if (currentCategoryTitle) currentCategoryTitle.textContent = titleText;
      if (currentServiceHighlight) {
        currentServiceHighlight.innerHTML = `
          <span class="service-highlight-title">${serviceText}</span>
          <span class="service-highlight-arrow">&rarr;</span>
        `;
      }

      if (displayList.length === 0) {
        prodGridContainer.innerHTML = `
          <div class="zoho-no-results-box" style="grid-column: 1 / -1;">
            <h4>No marketing services found matching "${searchQuery}"</h4>
            <p>Try searching for "SEO", "PPC", "CRO", "AI", "Branding", or "Influencer".</p>
            <button class="btn btn-secondary btn-sm" id="resetSearchBtn" style="margin-top: 0.5rem;">View All Services</button>
          </div>
        `;
        const resetBtn = document.getElementById('resetSearchBtn');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            searchQuery = '';
            if (searchInput) searchInput.value = '';
            renderCategories();
            renderServices();
          });
        }
        return;
      }

      prodGridContainer.innerHTML = displayList
        .map((srv) => {
          const iconSvg = icons[srv.icon] || icons.performance;

          return `
            <div class="zoho-rect-card" data-service-name="${srv.name}">
              <div class="zoho-rect-top">
                <div class="zoho-rect-icon-wrap">
                  ${iconSvg}
                </div>
                <div class="zoho-rect-content">
                  <div class="zoho-rect-title">${srv.name}</div>
                  <div class="zoho-rect-desc">${srv.desc}</div>
                </div>
              </div>
              
              <div class="zoho-rect-bottom">
                <a href="contact.html" class="zoho-rect-contact-btn js-service-contact-btn" data-service="${srv.name}" title="Consult about ${srv.name}">
                  <span>Contact Us</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </a>
              </div>
            </div>
          `;
        })
        .join('');
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCategories();
        renderServices();
      });
    }

    renderCategories();
    renderServices();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarketingCatalog);
  } else {
    initMarketingCatalog();
  }
})();
