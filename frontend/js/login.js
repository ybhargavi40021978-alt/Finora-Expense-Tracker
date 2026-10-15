/**
 * Finora Expense Tracker — Screen 2: Login Page Logic
 * Handles:
 * - Form validation (empty fields, email format, missing password)
 * - Password visibility toggle (eye open / closed)
 * - Loading, error, and successful authentication states
 * - Password recovery modal
 * - Interactive 3D mouse parallax on the left illustration
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const groupEmail = document.getElementById('group-email');
  const groupPassword = document.getElementById('group-password');
  
  const btnTogglePassword = document.getElementById('btn-toggle-password');
  const eyeIconOpen = document.getElementById('eye-icon-open');
  const eyeIconClosed = document.getElementById('eye-icon-closed');
  
  const btnLogin = document.getElementById('btn-login');
  const btnText = btnLogin.querySelector('.btn-text');
  const btnSpinner = btnLogin.querySelector('.btn-spinner');
  
  const loginAlert = document.getElementById('login-alert');
  const alertIcon = document.getElementById('alert-icon');
  const alertMessage = document.getElementById('alert-message');

  const btnGoogle = document.getElementById('btn-google');
  const rememberCheckbox = document.getElementById('remember-me');

  // Password Recovery Modal Elements
  const linkForgotPassword = document.getElementById('link-forgot-password');
  const recoveryModal = document.getElementById('recovery-modal');
  const recoveryClose = document.getElementById('recovery-close');
  const recoveryForm = document.getElementById('recovery-form');
  const recoveryEmail = document.getElementById('recovery-email');
  const btnRecoverySubmit = document.getElementById('btn-recovery-submit');

  // Parallax elements
  // Parallax elements
  const leftPanel = document.querySelector('.left-panel');
  const characterImg = document.getElementById('login-character-img');
  const floatingBadges = document.querySelectorAll('.panel-floating-badge');

  // Prevent browser autofill popups on login text boxes
  const preventAutofillInputs = [emailInput, passwordInput].filter(Boolean);
  preventAutofillInputs.forEach(input => {
    input.setAttribute('autocomplete', 'one-time-code');
    input.setAttribute('data-lpignore', 'true');
    const removeReadonly = () => {
      input.removeAttribute('readonly');
    };
    input.addEventListener('focus', removeReadonly);
    input.addEventListener('mousedown', removeReadonly);
    input.addEventListener('touchstart', removeReadonly);
    input.addEventListener('blur', () => {
      input.setAttribute('readonly', 'readonly');
    });
  });

  // Load saved remember-me email if available
  const savedEmail = localStorage.getItem('finora_remembered_email');
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }

  /* ==========================================================================
     1. Interactive 3D Mouse Parallax on Left Panel
     ========================================================================== */
  if (leftPanel && characterImg) {
    leftPanel.addEventListener('mousemove', (e) => {
      const rect = leftPanel.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotY = (x / rect.width) * 7;
      const rotX = -(y / rect.height) * 7;

      characterImg.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;

      floatingBadges.forEach(badge => {
        const factor = parseFloat(badge.getAttribute('data-parallax') || '0.04');
        badge.style.transform = `translate3d(${x * factor * 1.6}px, ${y * factor * 1.6}px, 0)`;
      });
    });

    leftPanel.addEventListener('mouseleave', () => {
      characterImg.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
      floatingBadges.forEach(badge => {
        badge.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     2. Password Visibility Toggle
     ========================================================================== */
  if (btnTogglePassword && passwordInput) {
    btnTogglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      
      if (isPassword) {
        eyeIconOpen.style.display = 'none';
        eyeIconClosed.style.display = 'block';
        btnTogglePassword.setAttribute('aria-label', 'Hide password');
      } else {
        eyeIconOpen.style.display = 'block';
        eyeIconClosed.style.display = 'none';
        btnTogglePassword.setAttribute('aria-label', 'Show password');
      }
      passwordInput.focus();
    });
  }

  /* ==========================================================================
     3. Inline Validation Helpers
     ========================================================================== */
  const validateEmailFormat = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const clearErrors = () => {
    groupEmail.classList.remove('has-error');
    groupPassword.classList.remove('has-error');
    emailError.textContent = '';
    passwordError.textContent = '';
    loginAlert.style.display = 'none';
    loginAlert.className = 'alert-banner';
  };

  const showAlert = (message, type = 'error') => {
    loginAlert.className = `alert-banner ${type}`;
    alertMessage.textContent = message;
    alertIcon.innerHTML = type === 'error'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`;
    loginAlert.style.display = 'flex';
  };

  // Live clear errors on input
  emailInput.addEventListener('input', () => {
    if (groupEmail.classList.contains('has-error')) {
      groupEmail.classList.remove('has-error');
      emailError.textContent = '';
    }
  });

  passwordInput.addEventListener('input', () => {
    if (groupPassword.classList.contains('has-error')) {
      groupPassword.classList.remove('has-error');
      passwordError.textContent = '';
    }
  });

  /* ==========================================================================
     4. Form Submission & Authentication Simulation
     ========================================================================== */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value;
    let hasValidationError = false;

    // Email validation
    if (!emailVal) {
      groupEmail.classList.add('has-error');
      emailError.textContent = 'Email address is required.';
      hasValidationError = true;
    } else if (!validateEmailFormat(emailVal)) {
      groupEmail.classList.add('has-error');
      emailError.textContent = 'Please enter a valid email address.';
      hasValidationError = true;
    }

    // Password validation
    if (!passwordVal) {
      groupPassword.classList.add('has-error');
      passwordError.textContent = 'Password is required.';
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    // Remember-me handling
    if (rememberCheckbox.checked) {
      localStorage.setItem('finora_remembered_email', emailVal);
    } else {
      localStorage.removeItem('finora_remembered_email');
    }

    // Loading State
    btnLogin.disabled = true;
    btnText.textContent = 'Signing in...';
    btnSpinner.style.display = 'inline-block';

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailVal,
          password: passwordVal
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        btnLogin.disabled = false;
        btnText.textContent = 'Login';
        btnSpinner.style.display = 'none';

        const errMsg = data.message || 'Invalid email or password. Please verify your credentials and try again.';
        showAlert(errMsg, 'error');
        groupEmail.classList.add('has-error');
        groupPassword.classList.add('has-error');
        return;
      }

      // Success State
      const displayName = (data.user && (data.user.name || data.user.displayName)) || 'User';
      showAlert(`Welcome back, ${displayName}! Redirecting to Dashboard...`, 'success');
      btnText.textContent = 'Success!';
      btnLogin.style.backgroundColor = '#10B981';
      btnSpinner.style.display = 'none';

      // Save real session
      if (window.FinoraAuth) {
        window.FinoraAuth.setSession(data.token, data.user);
      } else {
        localStorage.setItem('finora_auth_token', data.token);
        localStorage.setItem('finora_current_user', JSON.stringify(data.user));
      }

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);

    } catch (err) {
      btnLogin.disabled = false;
      btnText.textContent = 'Login';
      btnSpinner.style.display = 'none';
      showAlert('Network error: Unable to reach Finora servers. Please try again.', 'error');
    }
  });

  /* ==========================================================================
     5. Google OAuth Simulation
     ========================================================================== */
  if (btnGoogle) {
    btnGoogle.addEventListener('click', () => {
      clearErrors();
      btnGoogle.style.opacity = '0.7';
      btnGoogle.innerHTML = `
        <span class="btn-spinner" style="border-color: #7957FF; border-top-color: transparent;"></span>
        <span class="google-text">Connecting to Google...</span>
      `;
      setTimeout(() => {
        showAlert('Google account authenticated! Redirecting to Finora Dashboard...', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1100);
      }, 900);
    });
  }

  /* ==========================================================================
     6. Password Recovery Modal
     ========================================================================== */
  const openRecoveryModal = () => {
    recoveryModal.classList.add('open');
    recoveryModal.setAttribute('aria-hidden', 'false');
    if (emailInput.value) {
      recoveryEmail.value = emailInput.value;
    }
    recoveryEmail.focus();
  };

  const closeRecoveryModal = () => {
    recoveryModal.classList.remove('open');
    recoveryModal.setAttribute('aria-hidden', 'true');
  };

  if (linkForgotPassword) {
    linkForgotPassword.addEventListener('click', (e) => {
      e.preventDefault();
      openRecoveryModal();
    });
  }

  if (recoveryClose) {
    recoveryClose.addEventListener('click', closeRecoveryModal);
  }

  if (recoveryModal) {
    recoveryModal.addEventListener('click', (e) => {
      if (e.target === recoveryModal) closeRecoveryModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && recoveryModal.classList.contains('open')) {
      closeRecoveryModal();
    }
  });

  if (recoveryForm) {
    recoveryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = recoveryEmail.value.trim();
      if (!validateEmailFormat(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      btnRecoverySubmit.disabled = true;
      btnRecoverySubmit.textContent = 'Sending...';
      setTimeout(() => {
        alert(`Password reset instructions have been sent to ${email}.`);
        btnRecoverySubmit.disabled = false;
        btnRecoverySubmit.textContent = 'Send Reset Link';
        closeRecoveryModal();
      }, 800);
    });
  }
});
