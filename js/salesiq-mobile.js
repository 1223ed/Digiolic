/**
 * DIGIOLIC — ZOHO SALESIQ MOBILE CHATBOT CONTROLLER
 * Ensures the live chatbot launcher remains active, visible, and functional on mobile devices
 */

(function() {
  window.$zoho = window.$zoho || {};
  window.$zoho.salesiq = window.$zoho.salesiq || {
    ready: function() {}
  };

  // Enforce SalesIQ float button visibility via API
  var origReady = window.$zoho.salesiq.ready;
  window.$zoho.salesiq.ready = function() {
    if (typeof origReady === 'function') {
      try { origReady(); } catch(e) {}
    }
    showMobileFloat();
  };

  function showMobileFloat() {
    try {
      if (window.$zoho && window.$zoho.salesiq && window.$zoho.salesiq.floatbutton) {
        window.$zoho.salesiq.floatbutton.visible('show');
      }
    } catch(e) {}

    var floatEl = document.getElementById('zsiq_float');
    var chatWrap = document.getElementById('zsiq_chat_wrap');
    var isOpen = chatWrap && chatWrap.classList.contains('chat-iframe-open');

    if (floatEl) {
      if (isOpen) {
        floatEl.style.setProperty('display', 'none', 'important');
      } else {
        if (floatEl.classList.contains('zsiq-hide')) {
          floatEl.classList.remove('zsiq-hide');
        }
        floatEl.style.setProperty('display', 'flex', 'important');
        floatEl.style.setProperty('visibility', 'visible', 'important');
        floatEl.style.setProperty('opacity', '1', 'important');
        floatEl.style.setProperty('pointer-events', 'auto', 'important');
      }
    }
  }

  // Poll during initial script load
  var pollCount = 0;
  var pollInterval = setInterval(function() {
    showMobileFloat();
    pollCount++;
    if (pollCount > 25) {
      clearInterval(pollInterval);
    }
  }, 400);

  // MutationObserver to catch when Zoho SalesIQ script dynamically injects/mutates #zsiq_float or #zsiq_chat_wrap
  if (typeof MutationObserver !== 'undefined') {
    var observer = new MutationObserver(function(mutations) {
      showMobileFloat();
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
      });
    }
  }

  // Handle touch events on mobile to guarantee tap responsiveness
  document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('touchend', function(e) {
      var target = e.target;
      if (target && (target.id === 'zs_fl_chat' || target.closest('#zsiq_float'))) {
        var chatIcon = document.getElementById('zs_fl_chat') || document.getElementById('zsiq_float');
        if (chatIcon) {
          try { chatIcon.click(); } catch(err) {}
        }
      }
    }, { passive: true });
  });

  // Run on load and pageshow
  window.addEventListener('load', showMobileFloat);
  window.addEventListener('pageshow', showMobileFloat);
})();
