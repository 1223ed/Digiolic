/**
 * Digiolic — "Talk with an expert" Floating Speech Bubble Engine
 * Manages the message card docked next to the Zoho SalesIQ live chat widget.
 */
(function () {
  'use strict';

  function initChatPrompt() {
    let promptEl = document.getElementById('salesiq-chat-prompt');

    if (!promptEl) {
      promptEl = document.createElement('div');
      promptEl.id = 'salesiq-chat-prompt';
      promptEl.className = 'salesiq-chat-prompt';
      promptEl.setAttribute('role', 'button');
      promptEl.setAttribute('tabindex', '0');
      promptEl.setAttribute('aria-label', 'Talk with an expert. How can I help you today?');

      promptEl.innerHTML = `
        <button type="button" class="chat-prompt-close" id="chatPromptClose" aria-label="Dismiss message" title="Dismiss">&times;</button>
        <div class="chat-prompt-content">
          <div class="chat-prompt-title">Talk with an expert.</div>
          <div class="chat-prompt-subtitle">How can I help you today?</div>
        </div>
        <div class="chat-prompt-arrow" aria-hidden="true"></div>
      `;

      document.body.appendChild(promptEl);
    }

    const closeBtn = document.getElementById('chatPromptClose');

    function openChat() {
      let opened = false;
      if (window.$zoho && window.$zoho.salesiq) {
        if (typeof window.$zoho.salesiq.floatwindow !== 'undefined' && window.$zoho.salesiq.floatwindow.visible) {
          window.$zoho.salesiq.floatwindow.visible('show');
          opened = true;
        } else if (typeof window.$zoho.salesiq.chat !== 'undefined' && window.$zoho.salesiq.chat.start) {
          window.$zoho.salesiq.chat.start();
          opened = true;
        }
      }

      // Smooth fallback if Zoho SalesIQ isn't active on localhost
      if (!opened) {
        const contactSec = document.getElementById('zohoContactSection') ||
                           document.getElementById('contactSection') ||
                           document.querySelector('form[action*="WebToLead"]');
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Hide the prompt once clicked
      promptEl.classList.add('is-hidden');
    }

    promptEl.addEventListener('click', function (e) {
      if (e.target.closest('#chatPromptClose')) return;
      openChat();
    });

    promptEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openChat();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        promptEl.classList.add('is-hidden');
      });
    }

    // If visitor clicks the Zoho native chat bubble directly, hide prompt
    document.addEventListener('click', function (e) {
      if (e.target.closest('[id*="zsiq"]') || e.target.closest('[class*="zsiq"]')) {
        promptEl.classList.add('is-hidden');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatPrompt);
  } else {
    initChatPrompt();
  }
})();
