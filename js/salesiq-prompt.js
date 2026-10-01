/**
 * Zoho SalesIQ Prompt Engine - Disabled
 * Reverted to native default Zoho SalesIQ chatbot launcher.
 */
(function () {
  'use strict';
  // Remove existing prompt element if present in DOM
  const existing = document.getElementById('salesiq-chat-prompt');
  if (existing) {
    existing.remove();
  }
})();
