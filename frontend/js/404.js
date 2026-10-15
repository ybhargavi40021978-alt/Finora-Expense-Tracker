/**
 * Finora — Screen 17: 404 Error Page Logic
 * Handles interactive elements:
 * 1. Safe browser history back navigation with Dashboard fallback
 * 2. Application route search widget with live suggestions
 * 3. Smooth scrolling for About and Contact navigation
 * 4. Contact Support form validation, rate-limiting & asynchronous submission
 * 5. Functional footer dialog modals (Help Center, Support, Privacy Policy)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. History Back Navigation
  const btnHistoryBack = document.getElementById('btn-history-back');
  if (btnHistoryBack) {
    btnHistoryBack.addEventListener('click', (e) => {
      e.preventDefault();
      const hasPreviousPage = window.history.length > 1 && document.referrer && document.referrer.includes(window.location.host);
      if (hasPreviousPage) {
        window.history.back();
      } else {
        window.location.href = 'dashboard.html';
      }
    });
  }

  // 2. Application Route Search Widget
  const searchInput = document.getElementById('page-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchDropdown = document.getElementById('search-dropdown');

  const APP_PAGES = [
    { title: 'Dashboard', url: 'dashboard.html', icon: 'ri-dashboard-line', description: 'Overview, balances & metrics' },
    { title: 'Transactions', url: 'transactions.html', icon: 'ri-exchange-dollar-line', description: 'View, filter & manage transactions' },
    { title: 'Add Income', url: 'add-income.html', icon: 'ri-arrow-down-circle-line', description: 'Log salary, freelance or dividends' },
    { title: 'Add Expense', url: 'add-expense.html', icon: 'ri-arrow-up-circle-line', description: 'Record spending & categorize' },
    { title: 'Analytics & Reports', url: 'analytics.html', icon: 'ri-pie-chart-line', description: 'Visual spending trends & breakdowns' },
    { title: 'Budgets Management', url: 'budgets.html', icon: 'ri-wallet-3-line', description: 'Category budgets & alerts' },
    { title: 'Goals & Savings', url: 'goals.html', icon: 'ri-funds-line', description: 'Savings milestones & targets' },
    { title: 'Categories Management', url: 'categories.html', icon: 'ri-apps-2-line', description: 'Custom expense & income categories' },
    { title: 'Recurring Transactions', url: 'recurring.html', icon: 'ri-repeat-2-line', description: 'Scheduled bills & subscriptions' },
    { title: 'Profile & Settings', url: 'settings.html', icon: 'ri-settings-4-line', description: 'Preferences, security & notifications' }
  ];

  if (searchInput && searchDropdown) {
    const renderResults = (query) => {
      const trimmed = query.trim().toLowerCase();
      if (!trimmed) {
        searchDropdown.innerHTML = '';
        searchDropdown.classList.remove('active');
        if (searchClearBtn) searchClearBtn.style.display = 'none';
        return;
      }

      if (searchClearBtn) searchClearBtn.style.display = 'block';

      const filtered = APP_PAGES.filter(page => 
        page.title.toLowerCase().includes(trimmed) || 
        page.description.toLowerCase().includes(trimmed)
      );

      if (filtered.length > 0) {
        searchDropdown.innerHTML = filtered.map(item => `
          <a href="${item.url}" class="search-result-item" role="option">
            <i class="${item.icon}" aria-hidden="true"></i>
            <div>
              <div style="font-weight: 600; color: var(--color-deep-navy);">${escapeHtml(item.title)}</div>
              <div style="font-size: 11.5px; color: var(--color-secondary-text);">${escapeHtml(item.description)}</div>
            </div>
          </a>
        `).join('');
      } else {
        searchDropdown.innerHTML = `
          <div class="search-empty-state">
            <i class="ri-search-line" style="font-size: 20px; display: block; margin-bottom: 4px; color: var(--color-secondary-text);"></i>
            No matching pages found for "<strong>${escapeHtml(trimmed)}</strong>"
          </div>
        `;
      }
      searchDropdown.classList.add('active');
    };

    searchInput.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.trim().length > 0) {
        searchDropdown.classList.add('active');
      }
    });

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderResults('');
        searchInput.focus();
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-widget-container')) {
        searchDropdown.classList.remove('active');
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstItem = searchDropdown.querySelector('.search-result-item');
        if (firstItem) {
          e.preventDefault();
          window.location.href = firstItem.getAttribute('href');
        }
      } else if (e.key === 'Escape') {
        searchDropdown.classList.remove('active');
      }
    });
  }

  // 3. Smooth Scrolling for Header Anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#help' || targetId === '#support' || targetId === '#privacy') {
        return; // Handled by modals or default
      }
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // 4. Contact Support Form Submission & Validation
  const contactForm = document.getElementById('support-contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('btn-contact-submit');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorSubject = document.getElementById('error-subject');
  const errorMessage = document.getElementById('error-message');

  const successBanner = document.getElementById('contact-success-banner');
  const successText = document.getElementById('contact-success-text');
  const errorBanner = document.getElementById('contact-error-banner');
  const errorText = document.getElementById('contact-error-text');

  const clearErrors = () => {
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
      if (input) input.classList.remove('has-error');
    });
    [errorName, errorEmail, errorSubject, errorMessage].forEach(errEl => {
      if (errEl) errEl.textContent = '';
    });
    if (errorBanner) errorBanner.style.display = 'none';
  };

  // Clear errors dynamically on input
  [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
    if (field) {
      field.addEventListener('input', () => {
        field.classList.remove('has-error');
        const errSpan = document.getElementById(`error-${field.name}`);
        if (errSpan) errSpan.textContent = '';
        if (errorBanner) errorBanner.style.display = 'none';
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();
      if (successBanner) successBanner.style.display = 'none';

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Client-side validation
      let hasError = false;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameVal || nameVal.length < 2) {
        if (nameInput) nameInput.classList.add('has-error');
        if (errorName) errorName.textContent = 'Please enter your full name (at least 2 characters).';
        hasError = true;
      }

      if (!emailVal || !emailPattern.test(emailVal)) {
        if (emailInput) emailInput.classList.add('has-error');
        if (errorEmail) errorEmail.textContent = 'Please provide a valid email address.';
        hasError = true;
      }

      if (!subjectVal || subjectVal.length < 3) {
        if (subjectInput) subjectInput.classList.add('has-error');
        if (errorSubject) errorSubject.textContent = 'Please specify a subject.';
        hasError = true;
      }

      if (!messageVal || messageVal.length < 10) {
        if (messageInput) messageInput.classList.add('has-error');
        if (errorMessage) errorMessage.textContent = 'Message must be at least 10 characters long.';
        hasError = true;
      }

      if (hasError) {
        // Focus first field with error
        const firstInvalid = contactForm.querySelector('.has-error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Enter loading state and disable double-submission
      if (submitBtn) {
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            subject: subjectVal,
            message: messageVal
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Success: Show confirmation banner and clear form
          if (successBanner && successText) {
            successText.textContent = result.message || 'Thank you! Your message has been sent successfully.';
            successBanner.style.display = 'flex';
            successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          contactForm.reset();
          clearErrors();
        } else {
          // Failure: Show error banner and preserve input data
          if (errorBanner && errorText) {
            errorText.textContent = result.message || 'Failed to send message. Please review your details and try again.';
            errorBanner.style.display = 'flex';
          }
          if (result.errors) {
            if (result.errors.name && errorName && nameInput) {
              nameInput.classList.add('has-error');
              errorName.textContent = result.errors.name;
            }
            if (result.errors.email && errorEmail && emailInput) {
              emailInput.classList.add('has-error');
              errorEmail.textContent = result.errors.email;
            }
            if (result.errors.subject && errorSubject && subjectInput) {
              subjectInput.classList.add('has-error');
              errorSubject.textContent = result.errors.subject;
            }
            if (result.errors.message && errorMessage && messageInput) {
              messageInput.classList.add('has-error');
              errorMessage.textContent = result.errors.message;
            }
          }
        }
      } catch (networkErr) {
        if (errorBanner && errorText) {
          errorText.textContent = 'Unable to reach support service. Please check your internet connection and try again.';
          errorBanner.style.display = 'flex';
        }
      } finally {
        if (submitBtn) {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
        }
      }
    });
  }

  // 5. Footer Informational Modals
  const infoModalBackdrop = document.getElementById('info-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDismissBtn = document.getElementById('modal-dismiss-btn');

  const MODAL_CONTENT = {
    help: {
      title: 'Finora Help Center',
      body: `Need assistance navigating your Finora workspace?
        <br><br>
        • <strong>Troubleshooting routes:</strong> If you arrived here from a bookmarked link, the URL structure may have been updated.
        <br>
        • <strong>Dashboard recovery:</strong> Select "Back to Dashboard" anytime to regain your primary financial overview.
        <br>
        • <strong>Support Form:</strong> Use the contact form right on this page to report broken links directly to our engineering team.`
    },
    support: {
      title: 'Contact Finora Support',
      body: `We are here to help you get back on track!
        <br><br>
        • <strong>Email:</strong> <a href="mailto:support@finora.app" style="color: var(--color-primary-violet); font-weight: 600;">support@finora.app</a>
        <br>
        • <strong>Live Helpdesk:</strong> Available Monday to Friday, 9:00 AM – 6:00 PM EST.
        <br>
        • <strong>Direct Form:</strong> Submit your request directly in the "Need a little help?" section below.`
    },
    privacy: {
      title: 'Finora Privacy Policy & Security',
      body: `Your financial confidentiality and data protection are paramount.
        <br><br>
        • <strong>Encryption:</strong> All financial entries and account details are protected using AES-256 standard encryption.
        <br>
        • <strong>Zero Third-Party Sharing:</strong> Finora never sells or shares your personal expenditure records.
        <br>
        • <strong>Compliance:</strong> Fully compliant with modern data protection regulations and secure session token guidelines.`
    }
  };

  const openModal = (type) => {
    if (!infoModalBackdrop || !MODAL_CONTENT[type]) return;
    modalTitle.textContent = MODAL_CONTENT[type].title;
    modalBody.innerHTML = MODAL_CONTENT[type].body;
    infoModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!infoModalBackdrop) return;
    infoModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const type = trigger.getAttribute('data-modal-trigger');
      openModal(type);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeModal);
  if (infoModalBackdrop) {
    infoModalBackdrop.addEventListener('click', (e) => {
      if (e.target === infoModalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoModalBackdrop && infoModalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
