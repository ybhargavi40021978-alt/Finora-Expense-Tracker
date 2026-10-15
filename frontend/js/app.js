/**
 * Finora Expense Tracker — Production Landing Page Script
 * Interactive behaviors:
 * 1. 3D Parallax Tilt on Hero Stage
 * 2. Navigation Smooth Scrolling & Scrollspy Active States
 * 3. Interactive FAQ Accordion
 * 4. Contact Form Validation, Character Counter & Async API Submission
 * 5. Modal Dialogs (Demo, Auth, Privacy Policy)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const visualStage = document.getElementById('visual-stage');
  const floatingCards = document.querySelectorAll('.floating-card, .floating-decor');
  const characterImg = document.getElementById('character-img');
  
  // Navigation
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Modals
  const demoModal = document.getElementById('demo-modal');
  const authModal = document.getElementById('auth-modal');
  const privacyModal = document.getElementById('privacy-modal');
  const demoCloseBtn = document.getElementById('demo-modal-close');
  const authCloseBtn = document.getElementById('auth-modal-close');
  const privacyCloseBtn = document.getElementById('privacy-modal-close');
  const triggerPrivacyModal = document.getElementById('trigger-privacy-modal');
  const footerPrivacyBtn = document.getElementById('footer-privacy-btn');
  
  // Buttons
  const ctaWatchDemo = document.getElementById('cta-watch-demo');
  const ctaGetStarted = document.getElementById('cta-get-started');
  const navGetStarted = document.getElementById('nav-get-started-btn');
  const navLoginBtn = document.getElementById('nav-login-btn');
  const demoModalCta = document.getElementById('demo-modal-cta');

  // Auth Toggle Mode
  const authTitle = document.getElementById('auth-modal-title');
  const authDesc = document.getElementById('auth-modal-desc');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authToggleBtn = document.getElementById('auth-toggle-mode');
  const authToggleText = document.getElementById('auth-toggle-text');
  const nameGroup = document.getElementById('name-group');

  let isSignUpMode = true;

  /* ==========================================================================
     1. Interactive 3D Parallax Tilt on Mouse Move
     ========================================================================== */
  if (visualStage) {
    const handleMouseMove = (e) => {
      const rect = visualStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      if (characterImg) {
        const rotY = (x / rect.width) * 8;
        const rotX = -(y / rect.height) * 8;
        characterImg.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
      }

      floatingCards.forEach(card => {
        const factor = parseFloat(card.getAttribute('data-parallax') || '0.04');
        const moveX = x * factor * 1.5;
        const moveY = y * factor * 1.5;
        card.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    };

    const handleMouseLeave = () => {
      if (characterImg) {
        characterImg.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      }
      floatingCards.forEach(card => {
        card.style.transform = '';
      });
    };

    visualStage.addEventListener('mousemove', handleMouseMove);
    visualStage.addEventListener('mouseleave', handleMouseLeave);
  }

  /* ==========================================================================
     2. Navigation Smooth Scrolling & Scrollspy Active States
     ========================================================================== */
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }

      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      if (navMenu && navMenu.classList.contains('mobile-open')) {
        navMenu.classList.remove('mobile-open');
      }
    });
  });

  // Mobile navigation drawer toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  // Scrollspy: Highlight navigation links based on scroll position
  const sectionsToWatch = [
    { id: 'home', linkId: 'nav-home' },
    { id: 'features', linkId: 'nav-features' },
    { id: 'about', linkId: 'nav-about' },
    { id: 'contact', linkId: 'nav-contact' }
  ];

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;
    for (let i = sectionsToWatch.length - 1; i >= 0; i--) {
      const section = document.getElementById(sectionsToWatch[i].id);
      if (section && section.offsetTop <= scrollPos) {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.getElementById(sectionsToWatch[i].linkId);
        if (activeLink) activeLink.classList.add('active');
        break;
      }
    }
  }, { passive: true });

  /* ==========================================================================
     3. Frequently Asked Questions (FAQ) Accordion Toggle
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close others for clean single-expand behavior
        faqItems.forEach(other => {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* ==========================================================================
     4. Contact Form Validation, Character Counter & Async API Submission
     ========================================================================== */
  const landingContactForm = document.getElementById('landing-contact-form');
  const landingName = document.getElementById('landing-name');
  const landingEmail = document.getElementById('landing-email');
  const landingSubject = document.getElementById('landing-subject');
  const landingMessage = document.getElementById('landing-message');
  const landingPrivacy = document.getElementById('landing-privacy-check');
  const landingSubmitBtn = document.getElementById('btn-landing-submit');

  const errName = document.getElementById('err-landing-name');
  const errEmail = document.getElementById('err-landing-email');
  const errSubject = document.getElementById('err-landing-subject');
  const errMessage = document.getElementById('err-landing-message');
  const errPrivacy = document.getElementById('err-landing-privacy');
  const charCounter = document.getElementById('message-char-counter');

  const successAlert = document.getElementById('landing-contact-success');
  const successText = document.getElementById('landing-success-text');
  const errorAlert = document.getElementById('landing-contact-error');
  const errorText = document.getElementById('landing-error-text');

  // Live message character counter
  if (landingMessage && charCounter) {
    landingMessage.addEventListener('input', () => {
      const len = landingMessage.value.length;
      charCounter.textContent = `${len} / 1000`;
      if (len > 950) {
        charCounter.style.color = '#EF4444';
      } else {
        charCounter.style.color = '#94A3B8';
      }
    });
  }

  // Clear errors dynamically on input
  [
    { el: landingName, err: errName },
    { el: landingEmail, err: errEmail },
    { el: landingSubject, err: errSubject },
    { el: landingMessage, err: errMessage },
    { el: landingPrivacy, err: errPrivacy }
  ].forEach(pair => {
    if (pair.el) {
      const evt = pair.el.type === 'checkbox' || pair.el.tagName === 'SELECT' ? 'change' : 'input';
      pair.el.addEventListener(evt, () => {
        pair.el.classList.remove('err');
        if (pair.err) pair.err.textContent = '';
        if (errorAlert) errorAlert.style.display = 'none';
      });
    }
  });

  if (landingContactForm) {
    landingContactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Reset alert banners
      if (successAlert) successAlert.style.display = 'none';
      if (errorAlert) errorAlert.style.display = 'none';

      // Trim values
      const nameVal = landingName ? landingName.value.trim() : '';
      const emailVal = landingEmail ? landingEmail.value.trim() : '';
      const subjectVal = landingSubject ? landingSubject.value.trim() : '';
      const messageVal = landingMessage ? landingMessage.value.trim() : '';
      const privacyChecked = landingPrivacy ? landingPrivacy.checked : false;

      let hasError = false;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameVal || nameVal.length < 2) {
        if (landingName) landingName.classList.add('err');
        if (errName) errName.textContent = 'Please enter your full name (at least 2 characters).';
        hasError = true;
      }

      if (!emailVal || !emailPattern.test(emailVal)) {
        if (landingEmail) landingEmail.classList.add('err');
        if (errEmail) errEmail.textContent = 'Please provide a valid email address.';
        hasError = true;
      }

      if (!subjectVal) {
        if (landingSubject) landingSubject.classList.add('err');
        if (errSubject) errSubject.textContent = 'Please choose a subject for your inquiry.';
        hasError = true;
      }

      if (!messageVal || messageVal.length < 10) {
        if (landingMessage) landingMessage.classList.add('err');
        if (errMessage) errMessage.textContent = 'Message must be at least 10 characters long.';
        hasError = true;
      }

      if (!privacyChecked) {
        if (errPrivacy) errPrivacy.textContent = 'Please agree to the privacy policy to submit.';
        hasError = true;
      }

      if (hasError) {
        const firstErr = landingContactForm.querySelector('.err');
        if (firstErr) firstErr.focus();
        return;
      }

      // Enter loading state & disable button
      if (landingSubmitBtn) {
        landingSubmitBtn.classList.add('loading');
        landingSubmitBtn.disabled = true;
      }

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameVal,
            email: emailVal,
            subject: subjectVal,
            message: messageVal
          })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          // Success: Display confirmation and reset form
          if (successAlert && successText) {
            successText.textContent = data.message || 'Thank you! Your message has been sent successfully.';
            successAlert.style.display = 'flex';
            successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          landingContactForm.reset();
          if (charCounter) charCounter.textContent = '0 / 1000';
        } else {
          // Failure: Display error and preserve entered data
          if (errorAlert && errorText) {
            errorText.textContent = data.message || 'Unable to submit your message. Please review the fields and try again.';
            errorAlert.style.display = 'flex';
          }
          if (data.errors) {
            if (data.errors.name && errName && landingName) {
              landingName.classList.add('err');
              errName.textContent = data.errors.name;
            }
            if (data.errors.email && errEmail && landingEmail) {
              landingEmail.classList.add('err');
              errEmail.textContent = data.errors.email;
            }
            if (data.errors.subject && errSubject && landingSubject) {
              landingSubject.classList.add('err');
              errSubject.textContent = data.errors.subject;
            }
            if (data.errors.message && errMessage && landingMessage) {
              landingMessage.classList.add('err');
              errMessage.textContent = data.errors.message;
            }
          }
        }
      } catch (networkErr) {
        if (errorAlert && errorText) {
          errorText.textContent = 'Network communication error. Please check your connection and try again.';
          errorAlert.style.display = 'flex';
        }
      } finally {
        if (landingSubmitBtn) {
          landingSubmitBtn.classList.remove('loading');
          landingSubmitBtn.disabled = false;
        }
      }
    });
  }

  /* ==========================================================================
     5. Modal Dialog Controls (Demo, Auth, Privacy Policy)
     ========================================================================== */
  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Watch Demo CTA
  if (ctaWatchDemo) {
    ctaWatchDemo.addEventListener('click', () => openModal(demoModal));
  }

  // Privacy Policy modal triggers
  if (triggerPrivacyModal) {
    triggerPrivacyModal.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  }

  if (footerPrivacyBtn) {
    footerPrivacyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  }

  // Close buttons
  if (demoCloseBtn) demoCloseBtn.addEventListener('click', () => closeModal(demoModal));
  if (authCloseBtn) authCloseBtn.addEventListener('click', () => closeModal(authModal));
  if (privacyCloseBtn) privacyCloseBtn.addEventListener('click', () => closeModal(privacyModal));

  // Backdrop click to close
  [demoModal, authModal, privacyModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(demoModal);
      closeModal(authModal);
      closeModal(privacyModal);
    }
  });

  /* ==========================================================================
     6. Auth Modal Mode Toggle
     ========================================================================== */
  const updateAuthView = () => {
    if (isSignUpMode) {
      authTitle.textContent = 'Get Started with Finora';
      authDesc.textContent = 'Start taking control of your financial future today.';
      authSubmitBtn.textContent = 'Create Free Account';
      nameGroup.style.display = 'flex';
      authToggleText.textContent = 'Already have an account?';
      authToggleBtn.textContent = 'Log in';
    } else {
      authTitle.textContent = 'Welcome Back to Finora';
      authDesc.textContent = 'Sign in to access your financial dashboard.';
      authSubmitBtn.textContent = 'Sign In';
      nameGroup.style.display = 'none';
      authToggleText.textContent = "Don't have an account?";
      authToggleBtn.textContent = 'Sign up';
    }
  };

  if (authToggleBtn) {
    authToggleBtn.addEventListener('click', () => {
      isSignUpMode = !isSignUpMode;
      updateAuthView();
    });
  }

  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('user-email').value;
      authSubmitBtn.textContent = 'Connecting...';
      authSubmitBtn.style.opacity = '0.8';
      setTimeout(() => {
        authSubmitBtn.textContent = 'Success! Welcome to Finora';
        authSubmitBtn.style.backgroundColor = '#43D9A3';
        setTimeout(() => {
          closeModal(authModal);
          authSubmitBtn.style.backgroundColor = '';
          authSubmitBtn.style.opacity = '1';
          updateAuthView();
          alert(`Welcome to Finora! Demo session initialized for ${email}`);
        }, 800);
      }, 700);
    });
  }
});
