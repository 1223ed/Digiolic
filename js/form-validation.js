/**
 * DIGIOLIC — FORM VALIDATION & CONSULTATION BOOKING HANDLER
 * Strict frontend validation, interactive demo feedback, and booking widget interactions
 */

(function () {
  'use strict';

  // Email regex RFC-compliant
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Phone regex (allowing standard international + spaces + dashes)
  const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

  /* ==========================================================================
     1. CONTACT FORM VALIDATOR
     ========================================================================== */
  const contactForms = document.querySelectorAll('.js-contact-form');

  contactForms.forEach((form) => {
    // If form has custom handler like supportContactForm or dmEditorialForm, skip
    if (form.id === 'supportContactForm' || form.id === 'dmEditorialForm' || form.hasAttribute('data-custom-handler')) {
      return;
    }

    const nameInput = form.querySelector('[name="Last Name"]') || form.querySelector('[name="fullName"]');
    const emailInput = form.querySelector('[name="Email"]') || form.querySelector('[name="workEmail"]');
    const phoneInput = form.querySelector('[name="Phone"]') || form.querySelector('[name="phoneNumber"]');
    const companyInput = form.querySelector('[name="Company"]') || form.querySelector('[name="companyName"]');
    const serviceSelect = form.querySelector('[name="LEADCF2"]') || form.querySelector('[name="service"]');
    const messageInput = form.querySelector('[name="LEADCF1"]') || form.querySelector('[name="projectDetails"]');
    const submitBtn = form.querySelector('.js-submit-btn');
    const successBanner = form.querySelector('.form-success-banner');

    function validateField(input, isValid, errorMsg) {
      if (!input) return true;
      const formGroup = input.closest('.form-group');
      let errorEl = formGroup ? formGroup.querySelector('.form-error-msg') : null;

      if (!errorEl && formGroup) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error-msg';
        formGroup.appendChild(errorEl);
      }

      if (!isValid) {
        input.classList.add('is-invalid');
        if (errorEl) {
          errorEl.textContent = errorMsg;
          errorEl.style.display = 'block';
        }
        return false;
      } else {
        input.classList.remove('is-invalid');
        if (errorEl) {
          errorEl.style.display = 'none';
        }
        return true;
      }
    }

    // Inline blur validation
    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        validateField(nameInput, nameInput.value.trim().length >= 2, 'Please enter your full name (at least 2 characters).');
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        validateField(emailInput, EMAIL_REGEX.test(emailInput.value.trim()), 'Please enter a valid work email address.');
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('blur', () => {
        validateField(phoneInput, PHONE_REGEX.test(phoneInput.value.trim()), 'Please enter a valid phone number with area code.');
      });
    }

    if (companyInput) {
      companyInput.addEventListener('blur', () => {
        validateField(companyInput, companyInput.value.trim().length >= 2, 'Please enter your company or organization name.');
      });
    }

    if (serviceSelect) {
      serviceSelect.addEventListener('change', () => {
        validateField(serviceSelect, serviceSelect.value !== '', 'Please select a primary service area.');
      });
    }

    if (messageInput) {
      messageInput.addEventListener('blur', () => {
        validateField(messageInput, messageInput.value.trim().length >= 5, 'Please provide project details (minimum 5 characters).');
      });
    }

    // Form submission handler
    form.addEventListener('submit', (e) => {
      let isFormValid = true;

      if (nameInput) {
        const valid = validateField(nameInput, nameInput.value.trim().length >= 2, 'Please enter your full name (at least 2 characters).');
        if (!valid) isFormValid = false;
      }

      if (emailInput) {
        const valid = validateField(emailInput, EMAIL_REGEX.test(emailInput.value.trim()), 'Please enter a valid work email address.');
        if (!valid) isFormValid = false;
      }

      if (phoneInput) {
        const valid = validateField(phoneInput, PHONE_REGEX.test(phoneInput.value.trim()), 'Please enter a valid phone number with area code.');
        if (!valid) isFormValid = false;
      }

      if (companyInput) {
        const valid = validateField(companyInput, companyInput.value.trim().length >= 2, 'Please enter your company or organization name.');
        if (!valid) isFormValid = false;
      }

      if (serviceSelect) {
        const valid = validateField(serviceSelect, serviceSelect.value !== '', 'Please select a primary service area.');
        if (!valid) isFormValid = false;
      }

      if (messageInput) {
        const valid = validateField(messageInput, messageInput.value.trim().length >= 5, 'Please provide project details (minimum 5 characters).');
        if (!valid) isFormValid = false;
      }

      if (!isFormValid) {
        e.preventDefault();
        // Focus first invalid element
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // If form targets Zoho CRM, format Company into message and allow native POST submission
      if (form.getAttribute('action') && form.getAttribute('action').includes('WebToLeadForm')) {
        if (companyInput && companyInput.value.trim() && messageInput) {
          const raw = messageInput.value;
          if (!raw.includes('Company:')) {
            messageInput.value = `Company: ${companyInput.value.trim()}\n\n${raw}`;
          }
        }

        if (submitBtn) {
          submitBtn.classList.add('is-submitting');
          submitBtn.style.pointerEvents = 'none';
          const originalText = submitBtn.querySelector('.btn-text');
          if (originalText) originalText.textContent = 'Submitting...';
          setTimeout(() => { submitBtn.disabled = true; }, 150);
        }

        // Native browser submission proceeds to Zoho CRM thank-you page!
        return;
      }

      // Fallback for non-Zoho forms: simulated demo banner
      e.preventDefault();
      if (submitBtn) {
        submitBtn.classList.add('is-submitting');
        submitBtn.disabled = true;
        const originalText = submitBtn.querySelector('.btn-text');
        if (originalText) originalText.textContent = 'Submitting...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('is-submitting');
          submitBtn.disabled = false;
          const originalText = submitBtn.querySelector('.btn-text');
          if (originalText) originalText.textContent = 'Submit Inquiry';
        }

        // Hide form inputs and show success banner
        const formFieldsContainer = form.querySelector('.form-fields-wrapper');
        if (formFieldsContainer) formFieldsContainer.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'none';

        if (successBanner) {
          successBanner.classList.add('is-visible');
        }

        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 700);
    });

    // Reset handler
    const resetBtn = form.querySelector('.js-reset-form');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        if (messageInput) {
          messageInput.removeAttribute('data-raw-content');
        }
        const formFieldsContainer = form.querySelector('.form-fields-wrapper');
        if (formFieldsContainer) formFieldsContainer.style.display = 'block';
        if (submitBtn) submitBtn.style.display = 'inline-flex';
        if (successBanner) successBanner.classList.remove('is-visible');
      });
    }
  });

  /* ==========================================================================
     2. BOOKING CONSULTATION WIDGET HANDLER
     ========================================================================== */
  const bookingWidgets = document.querySelectorAll('.booking-widget-card');

  bookingWidgets.forEach((widget) => {
    const serviceChips = widget.querySelectorAll('.booking-chip');
    const slotChips = widget.querySelectorAll('.booking-slot');
    const bookBtn = widget.querySelector('.js-book-consultation-btn');

    let selectedService = 'Zoho';

    serviceChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        serviceChips.forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedService = chip.getAttribute('data-service') || chip.textContent.trim();
      });
    });

    slotChips.forEach((slot) => {
      slot.addEventListener('click', () => {
        slotChips.forEach((s) => s.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });

    if (bookBtn) {
      bookBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Scroll to contact form
        const targetForm = document.querySelector('#contactForm') || document.querySelector('.js-contact-form');
        if (targetForm) {
          // Pre-select service in form
          const formServiceSelect = targetForm.querySelector('[name="LEADCF2"]') || targetForm.querySelector('[name="service"]');
          if (formServiceSelect) {
            for (let i = 0; i < formServiceSelect.options.length; i++) {
              if (formServiceSelect.options[i].text.toLowerCase().includes(selectedService.toLowerCase()) || formServiceSelect.options[i].value.toLowerCase().includes(selectedService.toLowerCase())) {
                formServiceSelect.selectedIndex = i;
                break;
              }
            }
          }

          targetForm.scrollIntoView({ behavior: 'smooth', block: 'start' });

          // Flash highlight the form
          targetForm.style.transition = 'box-shadow 0.3s ease';
          targetForm.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.35)';
          setTimeout(() => {
            targetForm.style.boxShadow = '';
          }, 1500);
        } else {
          window.location.href = 'pages/contact.html';
        }
      });
    }
  });
})();
