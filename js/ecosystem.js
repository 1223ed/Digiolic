/**
 * DIGIOLIC — CONNECTED BUSINESS ECOSYSTEM INTERACTIVE VISUALIZER
 * Switch between Zoho, Salesforce, Digital Marketing, and Unified Ops to show architecture sync
 */

(function () {
  'use strict';

  const ecosystemData = {
    all: {
      title: 'Unified Enterprise Architecture',
      desc: 'Digiolic integrates CRM, Marketing, and Operations into a synchronized single source of truth. Data flows seamlessly across lead capture, pipeline stages, client onboarding, and revenue analytics.',
      stats: [
        { label: 'Data Sync Latency', value: '< 200ms' },
        { label: 'System Uptime SLA', value: '99.99%' },
        { label: 'Automation Coverage', value: '88%' },
        { label: 'Adoption Rate', value: '94%' },
      ],
      nodes: ['crm-node', 'mkt-node', 'ops-node'],
    },
    zoho: {
      title: 'Zoho One & Custom Deluge Architecture',
      desc: 'End-to-end Zoho enterprise deployment: Custom CRM blueprints, automated Zoho Books billing reconciliations, real-time Zoho Analytics BI dashboards, and Creator portals.',
      stats: [
        { label: 'Module Customization', value: '100% Native' },
        { label: 'Deluge Workflows', value: '250+ Scripts' },
        { label: 'Integration Speed', value: '2x Faster' },
        { label: 'Total Cost of Ownership', value: '-45%' },
      ],
      nodes: ['crm-node'],
    },
    salesforce: {
      title: 'Salesforce Multi-Cloud & Apex Scale',
      desc: 'Enterprise Sales Cloud, Service Cloud, and Experience Cloud implementations with robust Apex triggers, sub-second Flow automations, and MuleSoft API governance.',
      stats: [
        { label: 'Pipeline Velocity', value: '+340%' },
        { label: 'Apex Test Coverage', value: '98%' },
        { label: 'Case Resolution Time', value: '-52%' },
        { label: 'Gov Limits Margin', value: 'Safe 80%' },
      ],
      nodes: ['crm-node', 'ops-node'],
    },
    marketing: {
      title: 'Performance Marketing & Revenue Engine',
      desc: 'Multi-touch attribution, programmatic paid campaigns, conversion-focused landing experiences, and predictive lead scoring tied directly to CRM revenue milestones.',
      stats: [
        { label: 'Average ROAS', value: '4.2x' },
        { label: 'Conversion Lift', value: '+165%' },
        { label: 'Lead Quality Score', value: '9.4/10' },
        { label: 'Cost Per Acquisition', value: '-38%' },
      ],
      nodes: ['mkt-node'],
    },
  };

  const tabs = document.querySelectorAll('.ecosystem-tab');
  const titleEl = document.querySelector('.ecosystem-title-dynamic');
  const descEl = document.querySelector('.ecosystem-desc-dynamic');
  const statsContainer = document.querySelector('.ecosystem-stats-dynamic');
  const nodes = document.querySelectorAll('.ecosystem-node');

  if (!tabs.length || !titleEl) return;

  function setEcosystemView(viewKey) {
    const data = ecosystemData[viewKey] || ecosystemData.all;

    // Update text
    titleEl.textContent = data.title;
    descEl.textContent = data.desc;

    // Update stats
    if (statsContainer) {
      statsContainer.innerHTML = data.stats
        .map(
          (stat) => `
        <div class="ecosystem-stat-box">
          <div class="ecosystem-stat-val">${stat.value}</div>
          <div class="ecosystem-stat-lbl">${stat.label}</div>
        </div>
      `
        )
        .join('');
    }

    // Highlight nodes
    nodes.forEach((node) => {
      const nodeId = node.getAttribute('data-node-id');
      if (data.nodes.includes(nodeId) || viewKey === 'all') {
        node.classList.add('active-node');
      } else {
        node.classList.remove('active-node');
      }
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const viewKey = tab.getAttribute('data-view');
      setEcosystemView(viewKey);
    });
  });

  // Initial set
  setEcosystemView('all');
})();
