/**
 * Finora Expense Tracker — Screen 3: Registration Page Logic
 * Handles:
 * - Real-time password strength calculation (4 segments)
 * - Password & Confirm Password visibility toggles
 * - Form validation (Name, Email format, Password rules, Mismatch, Terms)
 * - Interactive loading, error alert, and account creation feedback
 * - 3D parallax tilt on left panel
 * - Terms of Service & Privacy Policy modal dialog
 */

document.addEventListener('DOMContentLoaded', () => {
  // Form Elements
  const registerForm = document.getElementById('register-form');
  const fullnameInput = document.getElementById('fullname-input');
  const emailInput = document.getElementById('email-input');
  const passwordInput = document.getElementById('password-input');
  const confirmPasswordInput = document.getElementById('confirm-password-input');
  const termsCheckbox = document.getElementById('terms-checkbox');

  // Error Elements
  const fullnameError = document.getElementById('fullname-error');
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const confirmPasswordError = document.getElementById('confirm-password-error');
  const termsError = document.getElementById('terms-error');

  // Groups
  const groupFullname = document.getElementById('group-fullname');
  const groupEmail = document.getElementById('group-email');
  const groupPassword = document.getElementById('group-password');
  const groupConfirmPassword = document.getElementById('group-confirm-password');
  const groupTerms = document.getElementById('group-terms');

  // Password Visibility Toggles
  const btnTogglePassword = document.getElementById('btn-toggle-password');
  const eyeIconOpen = document.getElementById('eye-icon-open');
  const eyeIconClosed = document.getElementById('eye-icon-closed');

  const btnToggleConfirm = document.getElementById('btn-toggle-confirm');
  const eyeConfirmOpen = document.getElementById('eye-confirm-open');
  const eyeConfirmClosed = document.getElementById('eye-confirm-closed');

  // Strength Meter Elements
  const bar1 = document.getElementById('bar-1');
  const bar2 = document.getElementById('bar-2');
  const bar3 = document.getElementById('bar-3');
  const bar4 = document.getElementById('bar-4');
  const strengthCaption = document.getElementById('strength-caption');

  // Action Buttons & Feedback
  const btnRegister = document.getElementById('btn-register');
  const btnText = btnRegister.querySelector('.btn-text');
  const btnSpinner = btnRegister.querySelector('.btn-spinner');
  const btnGoogle = document.getElementById('btn-google');

  const registerAlert = document.getElementById('register-alert');
  const alertIcon = document.getElementById('alert-icon');
  const alertMessage = document.getElementById('alert-message');

  // Terms Modal Elements
  const linkTerms = document.getElementById('link-terms');
  const linkPrivacy = document.getElementById('link-privacy');
  const termsModal = document.getElementById('terms-modal');
  const termsClose = document.getElementById('terms-close');
  const btnTermsAccept = document.getElementById('btn-terms-accept');

  // Parallax elements
  const leftPanel = document.querySelector('.left-panel');
  const characterImg = document.getElementById('register-character-img');
  const floatingBadges = document.querySelectorAll('.panel-floating-badge');

  // Prevent browser autofill popups on text boxes
  const preventAutofillInputs = [fullnameInput, emailInput, passwordInput, confirmPasswordInput].filter(Boolean);
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
     2. Password Visibility Toggles
     ========================================================================== */
  const setupToggle = (btn, input, iconOpen, iconClosed) => {
    btn.addEventListener('click', () => {
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');

      if (isPassword) {
        iconOpen.style.display = 'none';
        iconClosed.style.display = 'block';
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        iconOpen.style.display = 'block';
        iconClosed.style.display = 'none';
        btn.setAttribute('aria-label', 'Show password');
      }
      input.focus();
    });
  };

  if (btnTogglePassword && passwordInput) {
    setupToggle(btnTogglePassword, passwordInput, eyeIconOpen, eyeIconClosed);
  }

  if (btnToggleConfirm && confirmPasswordInput) {
    setupToggle(btnToggleConfirm, confirmPasswordInput, eyeConfirmOpen, eyeConfirmClosed);
  }

  /* ==========================================================================
     3. Password Strength Evaluation (4 Segments)
     ========================================================================== */
  const calculatePasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;

    // Length check
    if (pass.length >= 8) score++;
    if (pass.length >= 10) score++;

    // Complexity checks
    const hasLower = /[a-z]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (varietyCount >= 3) score++;
    if (varietyCount === 4 && pass.length >= 8) score++;

    // Clamp score to 1-4 if password has at least 1 char
    return Math.min(Math.max(score, 1), 4);
  };

  const updateStrengthUI = (val) => {
    const bars = [bar1, bar2, bar3, bar4];
    bars.forEach(b => {
      b.className = 'strength-bar';
    });

    if (!val) {
      strengthCaption.textContent = 'Use at least 8 characters.';
      strengthCaption.className = 'strength-caption';
      return;
    }

    const strength = calculatePasswordStrength(val);

    if (strength === 1) {
      bar1.classList.add('weak');
      strengthCaption.textContent = 'Weak — use at least 8 characters.';
      strengthCaption.className = 'strength-caption weak';
    } else if (strength === 2) {
      bar1.classList.add('fair');
      bar2.classList.add('fair');
      strengthCaption.textContent = 'Fair — add uppercase or numbers.';
      strengthCaption.className = 'strength-caption fair';
    } else if (strength === 3) {
      bar1.classList.add('good');
      bar2.classList.add('good');
      bar3.classList.add('good');
      strengthCaption.textContent = 'Good password.';
      strengthCaption.className = 'strength-caption good';
    } else if (strength >= 4) {
      bars.forEach(b => b.classList.add('strong'));
      strengthCaption.textContent = 'Strong password!';
      strengthCaption.className = 'strength-caption strong';
    }
  };

  passwordInput.addEventListener('input', (e) => {
    updateStrengthUI(e.target.value);
    if (groupPassword.classList.contains('has-error')) {
      groupPassword.classList.remove('has-error');
      passwordError.textContent = '';
    }
  });

  /* ==========================================================================
     4. Inline Validation Helpers & Live Clearing
     ========================================================================== */
  const validateEmailFormat = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

  const clearErrors = () => {
    [groupFullname, groupEmail, groupPassword, groupConfirmPassword, groupTerms].forEach(g => {
      if (g) g.classList.remove('has-error');
    });
    [fullnameError, emailError, passwordError, confirmPasswordError, termsError].forEach(e => {
      if (e) e.textContent = '';
    });
    registerAlert.style.display = 'none';
    registerAlert.className = 'alert-banner';
  };

  const showAlert = (message, type = 'error') => {
    registerAlert.className = `alert-banner ${type}`;
    alertMessage.textContent = message;
    alertIcon.innerHTML = type === 'error'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E5484D" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#43D9A3" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`;
    registerAlert.style.display = 'flex';
  };

  // Live clear on input
  fullnameInput.addEventListener('input', () => {
    groupFullname.classList.remove('has-error');
    fullnameError.textContent = '';
  });

  emailInput.addEventListener('input', () => {
    groupEmail.classList.remove('has-error');
    emailError.textContent = '';
  });

  confirmPasswordInput.addEventListener('input', () => {
    groupConfirmPassword.classList.remove('has-error');
    confirmPasswordError.textContent = '';
  });

  termsCheckbox.addEventListener('change', () => {
    if (termsCheckbox.checked) {
      groupTerms.classList.remove('has-error');
      termsError.textContent = '';
    }
  });

  /* ==========================================================================
     5. Form Submission & Validation Logic
     ========================================================================== */
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const nameVal = fullnameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const passwordVal = passwordInput.value;
    const confirmVal = confirmPasswordInput.value;
    const termsChecked = termsCheckbox.checked;

    let hasValidationError = false;

    // Full Name validation
    if (!nameVal) {
      groupFullname.classList.add('has-error');
      fullnameError.textContent = 'Please enter your full name.';
      hasValidationError = true;
    }

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
    } else if (passwordVal.length < 8) {
      groupPassword.classList.add('has-error');
      passwordError.textContent = 'Password must be at least 8 characters.';
      hasValidationError = true;
    }

    // Confirm password validation
    if (!confirmVal) {
      groupConfirmPassword.classList.add('has-error');
      confirmPasswordError.textContent = 'Please confirm your password.';
      hasValidationError = true;
    } else if (passwordVal && confirmVal !== passwordVal) {
      groupConfirmPassword.classList.add('has-error');
      confirmPasswordError.textContent = 'Passwords do not match.';
      hasValidationError = true;
    }

    // Terms agreement validation
    if (!termsChecked) {
      groupTerms.classList.add('has-error');
      termsError.textContent = 'You must agree to the Terms of Service to continue.';
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    // Loading State
    btnRegister.disabled = true;
    btnText.textContent = 'Creating account...';
    btnSpinner.style.display = 'inline-block';

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          password: passwordVal
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        btnRegister.disabled = false;
        btnText.textContent = 'Create Account';
        btnSpinner.style.display = 'none';

        const errMsg = data.message || (data.errors && Object.values(data.errors)[0]) || 'Registration failed. Please check your information.';
        showAlert(errMsg, 'error');
        if (data.error === 'Conflict' || (data.message && data.message.includes('already exists'))) {
          groupEmail.classList.add('has-error');
          emailError.textContent = 'An account with this email already exists.';
        }
        return;
      }

      // Success State
      showAlert('Account created successfully! Redirecting to Dashboard...', 'success');
      btnText.textContent = 'Account Created!';
      btnRegister.style.backgroundColor = '#43D9A3';
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
      }, 900);

    } catch (err) {
      btnRegister.disabled = false;
      btnText.textContent = 'Create Account';
      btnSpinner.style.display = 'none';
      showAlert('Network error: Unable to reach Finora servers. Please try again.', 'error');
    }
  });

  /* ==========================================================================
     6. Google Registration OAuth Simulation
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
        showAlert('Google account linked! Setting up your Finora profile...', 'success');
        setTimeout(() => {
          window.location.href = 'index.html?onboarding=google';
        }, 1100);
      }, 900);
    });
  }

  /* ==========================================================================
     7. Terms & Privacy Modal Dialog
     ========================================================================== */
  const openTerms = (e) => {
    e.preventDefault();
    termsModal.classList.add('open');
    termsModal.setAttribute('aria-hidden', 'false');
  };

  const closeTerms = () => {
    termsModal.classList.remove('open');
    termsModal.setAttribute('aria-hidden', 'true');
  };

  if (linkTerms) linkTerms.addEventListener('click', openTerms);
  if (linkPrivacy) linkPrivacy.addEventListener('click', openTerms);
  if (termsClose) termsClose.addEventListener('click', closeTerms);
  if (btnTermsAccept) {
    btnTermsAccept.addEventListener('click', () => {
      termsCheckbox.checked = true;
      groupTerms.classList.remove('has-error');
      termsError.textContent = '';
      closeTerms();
    });
  }

  if (termsModal) {
    termsModal.addEventListener('click', (e) => {
      if (e.target === termsModal) closeTerms();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && termsModal.classList.contains('open')) {
      closeTerms();
    }
  });
});
