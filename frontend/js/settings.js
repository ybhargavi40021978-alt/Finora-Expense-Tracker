/**
 * Finora Expense Tracker — Screen 14: Profile & Settings JavaScript
 * Comprehensive interactive logic for personal profile, preferences, notifications,
 * security credentials, appearance customization, data export, and session management.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================================
  // 1. Initial State & In-Memory Store
  // ========================================================================
  // Authenticated fetch helper
  const fetchAuth = async (url, options = {}) => {
    if (window.FinoraAuth) {
      return window.FinoraAuth.fetchWithAuth(url, options);
    }
    const token = localStorage.getItem('finora_auth_token');
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
  };

  const state = {
    activeTab: 'tab-profile',
    isDirty: false,
    profile: {
      fullName: '',
      displayName: '',
      email: '',
      phoneCountry: '+91',
      phoneNumber: '',
      dob: '',
      country: 'India',
      language: 'en-IN',
      about: '',
      photoUrl: ''
    },
    preferences: {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      timeZone: 'Asia/Kolkata',
      firstDayOfWeek: 'Monday',
      showCents: true,
      compactNumbers: false,
      hideBalances: false,
      confirmDelete: true,
      showIcons: true,
      defaultType: 'Expense',
      defaultDate: 'Today',
      defaultMethod: 'UPI',
      defaultCategory: 'Food & Dining'
    },
    notifications: {
      budgetApproaching: true,
      budgetReached: true,
      budgetExceeded: true,
      budgetThreshold: '90%',
      recurringEnabled: true,
      reminderTiming: '1 day before',
      dueToday: true,
      upcomingPayments: true,
      overdueAlerts: true,
      largeExpenseAlerts: true,
      largeExpenseThreshold: 5000,
      weeklySummary: true,
      monthlySummary: true,
      goalProgress: true,
      goalCompletion: true,
      channelInApp: true,
      channelEmail: true,
      channelPush: false
    },
    security: {
      twoFactorEnabled: false,
      newLoginAlert: true,
      passwordChangeAlert: true,
      weeklySecurityDigest: false
    },
    appearance: {
      theme: 'light',
      accent: '#7957FF',
      reduceMotion: false,
      largeText: false,
      highContrast: false,
      largeTouchTargets: false
    }
  };

  // Restore saved theme & accent from localStorage if available
  const savedTheme = localStorage.getItem('finora_theme');
  if (savedTheme) {
    state.appearance.theme = savedTheme;
    applyTheme(savedTheme);
  }
  const savedAccent = localStorage.getItem('finora_accent');
  if (savedAccent) {
    state.appearance.accent = savedAccent;
    applyAccent(savedAccent);
  }

  // ========================================================================
  // 2. Tab Navigation (Desktop Sidebar & Mobile Scrollable Bar)
  // ========================================================================
  const navButtons = document.querySelectorAll('.settings-nav-btn');
  const mobileTabButtons = document.querySelectorAll('.settings-mobile-tab-btn');
  const panels = document.querySelectorAll('.settings-panel');
  const unsavedBanner = document.getElementById('unsaved-banner');

  function switchTab(targetId) {
    if (state.isDirty) {
      if (!confirm('You have unsaved changes in your current settings. Do you want to leave without saving?')) {
        return;
      }
      setDirty(false);
    }

    state.activeTab = targetId;

    // Update active nav button
    navButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update mobile tab button
    mobileTabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Show corresponding panel
    panels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Scroll smoothly to top of panel on mobile
    if (window.innerWidth <= 768) {
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  mobileTabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  const handleHashTab = () => {
    const rawHash = (window.location.hash || '').replace('#', '').toLowerCase();
    if (!rawHash) return;
    const tabMap = {
      'profile': 'tab-profile',
      'tab-profile': 'tab-profile',
      'my-profile': 'tab-profile',
      'preferences': 'tab-preferences',
      'tab-preferences': 'tab-preferences',
      'settings': 'tab-preferences',
      'account-settings': 'tab-preferences',
      'notifications': 'tab-notifications',
      'tab-notifications': 'tab-notifications',
      'security': 'tab-security',
      'tab-security': 'tab-security',
      'password': 'tab-security',
      'appearance': 'tab-appearance',
      'tab-appearance': 'tab-appearance',
      'theme': 'tab-appearance',
      'account': 'tab-account',
      'tab-account': 'tab-account',
      'data': 'tab-account'
    };
    const target = tabMap[rawHash];
    if (target) {
      switchTab(target);
    }
  };

  handleHashTab();
  window.addEventListener('hashchange', handleHashTab);

  function setDirty(isDirty) {
    state.isDirty = isDirty;
    if (unsavedBanner) {
      if (isDirty) {
        unsavedBanner.classList.add('show');
      } else {
        unsavedBanner.classList.remove('show');
      }
    }
  }

  // Unsaved Banner Cancel button
  const btnDiscardChanges = document.getElementById('btn-discard-changes');
  if (btnDiscardChanges) {
    btnDiscardChanges.addEventListener('click', () => {
      syncFormWithState();
      setDirty(false);
      showToast('Unsaved changes discarded.', 'info');
    });
  }

  // ========================================================================
  // 3. Profile Information Form & Photo Upload
  // ========================================================================
  const avatarImg = document.getElementById('avatar-preview-img');
  const avatarFallback = document.getElementById('avatar-fallback');
  const fileInputPhoto = document.getElementById('file-input-photo');
  const btnChangePhoto = document.getElementById('btn-change-photo');
  const btnRemovePhoto = document.getElementById('btn-remove-photo');
  const formProfile = document.getElementById('form-profile');

  if (btnChangePhoto && fileInputPhoto) {
    btnChangePhoto.addEventListener('click', () => fileInputPhoto.click());
    fileInputPhoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please upload a valid image file (PNG, JPG, WebP).', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast('Photo size must not exceed 5MB.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        state.profile.photoUrl = event.target.result;
        if (avatarImg) {
          avatarImg.src = event.target.result;
          avatarImg.style.display = 'block';
        }
        if (avatarFallback) avatarFallback.style.display = 'none';
        setDirty(true);
        showToast('Photo uploaded. Save changes to finalize.', 'info');
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener('click', () => {
      state.profile.photoUrl = '';
      if (avatarImg) avatarImg.style.display = 'none';
      if (avatarFallback) {
        avatarFallback.style.display = 'flex';
        avatarFallback.textContent = state.profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2);
      }
      setDirty(true);
      showToast('Profile photo removed.', 'info');
    });
  }

  // Listen to profile form inputs to flag dirty
  if (formProfile) {
    formProfile.addEventListener('input', () => setDirty(true));

    formProfile.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullNameInput = document.getElementById('profile-full-name');
      const emailInput = document.getElementById('profile-email');

      if (!fullNameInput.value.trim()) {
        fullNameInput.classList.add('is-invalid');
        showToast('Full Name is required.', 'error');
        return;
      }
      fullNameInput.classList.remove('is-invalid');

      const btnSave = document.getElementById('btn-save-profile');
      if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Saving to MongoDB...';
      }

      try {
        const payload = {
          name: fullNameInput.value.trim(),
          displayName: document.getElementById('profile-display-name').value.trim(),
          phoneCountry: document.getElementById('profile-phone-code').value,
          phone: document.getElementById('profile-phone-number').value.trim(),
          dob: document.getElementById('profile-dob').value,
          country: document.getElementById('profile-country').value,
          language: document.getElementById('profile-language').value,
          bio: document.getElementById('profile-about').value.trim()
        };

        const res = await fetchAuth('/api/users/me', {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || 'Failed to update profile.');
        }

        const updatedUser = data.user || data.data;
        if (updatedUser) {
          state.profile.fullName = updatedUser.name || payload.name;
          state.profile.displayName = updatedUser.displayName || payload.displayName;
          state.profile.phoneNumber = updatedUser.phone || payload.phone;
          state.profile.about = updatedUser.bio || payload.bio;

          if (window.FinoraAuth) {
            localStorage.setItem('finora_current_user', JSON.stringify(updatedUser));
            window.FinoraAuth.updateDOMUserInfo(updatedUser);
          }
        }

        const headerName = document.querySelector('.user-name');
        if (headerName) headerName.textContent = state.profile.fullName;
        const photoName = document.querySelector('.photo-user-name span');
        if (photoName) photoName.textContent = state.profile.fullName;
        const displayProf = document.getElementById('display-profile-name');
        if (displayProf) displayProf.textContent = state.profile.fullName;

        setDirty(false);
        showToast('Profile information successfully updated!', 'success');
      } catch (err) {
        showToast(err.message || 'Error updating profile.', 'error');
      } finally {
        if (btnSave) {
          btnSave.disabled = false;
          btnSave.innerHTML = '<i class="ri-check-line"></i> Save Changes';
        }
      }
    });

    const btnCancelProfile = document.getElementById('btn-cancel-profile');
    if (btnCancelProfile) {
      btnCancelProfile.addEventListener('click', () => {
        syncFormWithState();
        setDirty(false);
        showToast('Profile changes reverted.', 'info');
      });
    }
  }

  // ========================================================================
  // 4. Regional & Financial Preferences
  // ========================================================================
  const formPreferences = document.getElementById('form-preferences');
  const currencySelect = document.getElementById('pref-currency');
  const currencyPreview = document.getElementById('currency-preview-val');
  const currencyNumberPreview = document.getElementById('currency-number-preview');
  const dateFormatSelect = document.getElementById('pref-date-format');
  const timeFormatSelect = document.getElementById('pref-time-format');
  const dateTimePreview = document.getElementById('datetime-preview-val');

  function updateCurrencyPreview() {
    const code = currencySelect.value;
    let symbol = '₹';
    let formattedSample = '₹1,25,450.00';

    switch (code) {
      case 'USD':
        symbol = '$';
        formattedSample = '$125,450.00';
        break;
      case 'EUR':
        symbol = '€';
        formattedSample = '€125,450.00';
        break;
      case 'GBP':
        symbol = '£';
        formattedSample = '£125,450.00';
        break;
      case 'AED':
        symbol = 'د.إ';
        formattedSample = 'AED 125,450.00';
        break;
      case 'JPY':
        symbol = '¥';
        formattedSample = '¥125,450';
        break;
      default:
        symbol = '₹';
        formattedSample = '₹1,25,450.00';
        break;
    }

    if (currencyPreview) currencyPreview.textContent = `${code} (${symbol})`;
    if (currencyNumberPreview) currencyNumberPreview.textContent = formattedSample;
  }

  function updateDateTimePreview() {
    const df = dateFormatSelect.value;
    const tf = timeFormatSelect.value;
    let dSample = '15/10/2026';
    if (df === 'MM/DD/YYYY') dSample = '10/15/2026';
    if (df === 'YYYY-MM-DD') dSample = '2026-10-15';

    let tSample = tf === '12h' ? '02:30 PM' : '14:30';
    if (dateTimePreview) {
      dateTimePreview.textContent = `${dSample} • ${tSample}`;
    }
  }

  if (currencySelect) currencySelect.addEventListener('change', () => { updateCurrencyPreview(); setDirty(true); });
  if (dateFormatSelect) dateFormatSelect.addEventListener('change', () => { updateDateTimePreview(); setDirty(true); });
  if (timeFormatSelect) timeFormatSelect.addEventListener('change', () => { updateDateTimePreview(); setDirty(true); });

  if (formPreferences) {
    formPreferences.addEventListener('change', () => setDirty(true));

    formPreferences.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btnSave = document.getElementById('btn-save-preferences');
      if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Saving to MongoDB...';
      }

      try {
        const payload = {
          currency: currencySelect.value,
          dateFormat: dateFormatSelect.value,
          timeFormat: timeFormatSelect.value,
          timeZone: document.getElementById('pref-timezone').value,
          firstDayOfWeek: document.getElementById('pref-first-day').value,
          showCents: document.getElementById('pref-show-cents').checked,
          compactNumbers: document.getElementById('pref-compact-numbers').checked,
          hideBalances: document.getElementById('pref-hide-balances').checked,
          confirmDelete: document.getElementById('pref-confirm-delete').checked,
          showIcons: document.getElementById('pref-show-icons').checked,
          defaultType: document.getElementById('pref-default-type').value,
          defaultDate: document.getElementById('pref-default-date').value,
          defaultMethod: document.getElementById('pref-default-method').value,
          defaultCategory: document.getElementById('pref-default-category').value
        };

        const res = await fetchAuth('/api/settings', {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || 'Failed to save preferences.');
        }

        Object.assign(state.preferences, payload);
        setDirty(false);
        showToast('Preferences successfully updated in MongoDB!', 'success');
      } catch (err) {
        showToast(err.message || 'Error saving preferences.', 'error');
      } finally {
        if (btnSave) {
          btnSave.disabled = false;
          btnSave.innerHTML = '<i class="ri-check-line"></i> Save Preferences';
        }
      }
    });

    const btnResetPref = document.getElementById('btn-reset-preferences');
    if (btnResetPref) {
      btnResetPref.addEventListener('click', () => {
        if (confirm('Reset all regional and financial preferences to Finora defaults?')) {
          currencySelect.value = 'INR';
          dateFormatSelect.value = 'DD/MM/YYYY';
          timeFormatSelect.value = '12h';
          document.getElementById('pref-first-day').value = 'Monday';
          document.getElementById('pref-show-cents').checked = true;
          document.getElementById('pref-compact-numbers').checked = false;
          document.getElementById('pref-hide-balances').checked = false;
          document.getElementById('pref-confirm-delete').checked = true;
          document.getElementById('pref-show-icons').checked = true;
          updateCurrencyPreview();
          updateDateTimePreview();
          setDirty(true);
          showToast('Preferences reset to default. Click Save Preferences to confirm.', 'info');
        }
      });
    }
  }

  // ========================================================================
  // 5. Notification Preferences
  // ========================================================================
  const formNotifications = document.getElementById('form-notifications');
  const thresholdChips = document.querySelectorAll('.threshold-chip');

  thresholdChips.forEach(chip => {
    chip.addEventListener('click', () => {
      thresholdChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.notifications.budgetThreshold = chip.getAttribute('data-threshold');
      setDirty(true);
    });
  });

  const btnSendTestNotification = document.getElementById('btn-send-test-notification');
  if (btnSendTestNotification) {
    btnSendTestNotification.addEventListener('click', () => {
      showToast('🔔 Test Notification: Your Food & Dining budget is on track for October 2026.', 'success');
    });
  }

  if (formNotifications) {
    formNotifications.addEventListener('change', () => setDirty(true));
    formNotifications.addEventListener('submit', (e) => {
      e.preventDefault();
      const btnSave = document.getElementById('btn-save-notifications');
      if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Saving...';
      }

      setTimeout(() => {
        setDirty(false);
        if (btnSave) {
          btnSave.disabled = false;
          btnSave.innerHTML = '<i class="ri-check-line"></i> Save Notification Settings';
        }
        showToast('Notification preferences successfully saved!', 'success');
      }, 500);
    });
  }

  // ========================================================================
  // 6. Account Security & Password Strength
  // ========================================================================
  const inputNewPass = document.getElementById('new-password');
  const inputConfirmPass = document.getElementById('confirm-password');
  const strengthBars = document.querySelectorAll('.strength-segment');
  const reqLen = document.getElementById('req-len');
  const reqUpper = document.getElementById('req-upper');
  const reqLower = document.getElementById('req-lower');
  const reqNum = document.getElementById('req-num');
  const reqSym = document.getElementById('req-sym');
  const formPassword = document.getElementById('form-change-password');

  // Toggle Password Show/Hide
  document.querySelectorAll('.btn-toggle-pw').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetInput = document.getElementById(btn.getAttribute('data-target'));
      if (!targetInput) return;
      if (targetInput.type === 'password') {
        targetInput.type = 'text';
        btn.innerHTML = '<i class="ri-eye-off-line"></i>';
      } else {
        targetInput.type = 'password';
        btn.innerHTML = '<i class="ri-eye-line"></i>';
      }
    });
  });

  if (inputNewPass) {
    inputNewPass.addEventListener('input', () => {
      const val = inputNewPass.value;
      const hasLen = val.length >= 8;
      const hasUpper = /[A-Z]/.test(val);
      const hasLower = /[a-z]/.test(val);
      const hasNum = /[0-9]/.test(val);
      const hasSym = /[^A-Za-z0-9]/.test(val);

      if (reqLen) reqLen.classList.toggle('met', hasLen);
      if (reqUpper) reqUpper.classList.toggle('met', hasUpper);
      if (reqLower) reqLower.classList.toggle('met', hasLower);
      if (reqNum) reqNum.classList.toggle('met', hasNum);
      if (reqSym) reqSym.classList.toggle('met', hasSym);

      let score = 0;
      if (hasLen) score++;
      if (hasUpper && hasLower) score++;
      if (hasNum) score++;
      if (hasSym) score++;

      strengthBars.forEach((bar, idx) => {
        bar.style.backgroundColor = '';
        if (idx < score) {
          if (score <= 1) bar.style.backgroundColor = '#F06575';
          else if (score === 2) bar.style.backgroundColor = '#F5B544';
          else if (score === 3) bar.style.backgroundColor = '#48B9F5';
          else bar.style.backgroundColor = '#23B981';
        }
      });
    });
  }

  if (formPassword) {
    formPassword.addEventListener('submit', async (e) => {
      e.preventDefault();
      const curPass = document.getElementById('current-password').value;
      const newPass = inputNewPass.value;
      const confirmPass = inputConfirmPass.value;

      if (!curPass) {
        showToast('Please enter your current password.', 'error');
        return;
      }
      if (newPass.length < 8) {
        showToast('New password must be at least 8 characters long.', 'error');
        return;
      }
      if (newPass !== confirmPass) {
        showToast('New password and confirmation do not match.', 'error');
        return;
      }

      const btnSave = document.getElementById('btn-save-password');
      if (btnSave) {
        btnSave.disabled = true;
        btnSave.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Updating password...';
      }

      try {
        const res = await fetchAuth('/api/auth/change-password', {
          method: 'POST',
          body: JSON.stringify({ currentPassword: curPass, newPassword: newPass })
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.message || 'Failed to update password.');
        }

        formPassword.reset();
        strengthBars.forEach(b => b.style.backgroundColor = '');
        document.querySelectorAll('.req-item').forEach(r => r.classList.remove('met'));
        showToast('Password successfully updated! All active sessions refreshed.', 'success');
      } catch (err) {
        showToast(err.message || 'Error updating password.', 'error');
      } finally {
        if (btnSave) {
          btnSave.disabled = false;
          btnSave.innerHTML = '<i class="ri-lock-password-line"></i> Save New Password';
        }
      }
    });
  }

  // Active Sessions: Sign Out Other Sessions
  const btnSignOutOthers = document.getElementById('btn-sign-out-others');
  if (btnSignOutOthers) {
    btnSignOutOthers.addEventListener('click', () => {
      if (confirm('Sign out of all other devices and browser sessions?')) {
        const otherSession = document.getElementById('session-other-device');
        if (otherSession) {
          otherSession.style.display = 'none';
        }
        showToast('All other sessions signed out successfully.', 'success');
      }
    });
  }

  // 2FA Setup Flow Modal
  const modal2FA = document.getElementById('modal-2fa');
  const btnConfigure2FA = document.getElementById('btn-configure-2fa');
  const btnClose2FA = document.getElementById('btn-close-2fa');
  const btnCancel2FA = document.getElementById('btn-cancel-2fa');
  const btnVerify2FA = document.getElementById('btn-verify-2fa');
  const badge2FA = document.getElementById('badge-2fa-status');

  if (btnConfigure2FA && modal2FA) {
    btnConfigure2FA.addEventListener('click', () => {
      if (state.security.twoFactorEnabled) {
        if (confirm('Disable Two-Factor Authentication for your account?')) {
          state.security.twoFactorEnabled = false;
          update2FAStatusUI();
          showToast('Two-Factor Authentication disabled.', 'info');
        }
      } else {
        modal2FA.classList.add('open');
      }
    });
  }

  if (btnClose2FA) btnClose2FA.addEventListener('click', () => modal2FA.classList.remove('open'));
  if (btnCancel2FA) btnCancel2FA.addEventListener('click', () => modal2FA.classList.remove('open'));

  if (btnVerify2FA) {
    btnVerify2FA.addEventListener('click', () => {
      const codeInput = document.getElementById('input-totp-code');
      if (!codeInput || codeInput.value.trim().length !== 6) {
        showToast('Please enter a valid 6-digit authenticator code.', 'error');
        return;
      }
      state.security.twoFactorEnabled = true;
      modal2FA.classList.remove('open');
      update2FAStatusUI();
      showToast('Two-Factor Authentication is now enabled on your account!', 'success');
    });
  }

  function update2FAStatusUI() {
    if (badge2FA && btnConfigure2FA) {
      if (state.security.twoFactorEnabled) {
        badge2FA.textContent = 'Enabled';
        badge2FA.style.backgroundColor = '#E8F9F2';
        badge2FA.style.color = '#23B981';
        btnConfigure2FA.textContent = 'Disable 2FA';
        btnConfigure2FA.className = 'btn-secondary';
      } else {
        badge2FA.textContent = 'Disabled';
        badge2FA.style.backgroundColor = '#FDEEF0';
        badge2FA.style.color = '#F06575';
        btnConfigure2FA.textContent = 'Configure 2FA';
        btnConfigure2FA.className = 'btn-primary';
      }
    }
  }

  // ========================================================================
  // 7. Appearance & Accessibility
  // ========================================================================
  const themeCards = document.querySelectorAll('.theme-card');
  const accentOptions = document.querySelectorAll('.accent-option');
  const chkReduceMotion = document.getElementById('chk-reduce-motion');
  const chkLargeText = document.getElementById('chk-large-text');
  const chkHighContrast = document.getElementById('chk-high-contrast');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    } else if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('theme-dark', isDark);
    } else {
      document.body.classList.remove('theme-dark');
    }
    localStorage.setItem('finora_theme', theme);
  }

  function applyAccent(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    let hoverColor = '#6744EE';
    let lightColor = '#F2EEFF';

    if (color === '#48B9F5') {
      hoverColor = '#32A3E0';
      lightColor = 'rgba(72, 185, 245, 0.12)';
    } else if (color === '#23B981') {
      hoverColor = '#1EA06F';
      lightColor = 'rgba(35, 185, 129, 0.12)';
    } else if (color === '#F06575') {
      hoverColor = '#D63D4F';
      lightColor = 'rgba(240, 101, 117, 0.12)';
    }

    document.documentElement.style.setProperty('--accent-hover', hoverColor);
    document.documentElement.style.setProperty('--accent-light', lightColor);
    localStorage.setItem('finora_accent', color);
  }

  themeCards.forEach(card => {
    card.addEventListener('click', () => {
      themeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const selectedTheme = card.getAttribute('data-theme');
      state.appearance.theme = selectedTheme;
      applyTheme(selectedTheme);
      showToast(`Theme switched to ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}.`, 'info');
    });
  });

  accentOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      accentOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const color = opt.getAttribute('data-color');
      state.appearance.accent = color;
      applyAccent(color);
      showToast('Accent color updated across Finora.', 'info');
    });
  });

  if (chkReduceMotion) {
    chkReduceMotion.addEventListener('change', (e) => {
      document.body.classList.toggle('acc-reduce-motion', e.target.checked);
      showToast(e.target.checked ? 'Motion animations reduced.' : 'Motion animations restored.', 'info');
    });
  }

  if (chkLargeText) {
    chkLargeText.addEventListener('change', (e) => {
      document.body.classList.toggle('acc-large-text', e.target.checked);
      showToast(e.target.checked ? 'Large text display enabled.' : 'Standard text size restored.', 'info');
    });
  }

  if (chkHighContrast) {
    chkHighContrast.addEventListener('change', (e) => {
      document.body.classList.toggle('acc-high-contrast', e.target.checked);
      showToast(e.target.checked ? 'High contrast mode enabled.' : 'Standard contrast restored.', 'info');
    });
  }

  // ========================================================================
  // 8. Account Management (Data Export & Deletion)
  // ========================================================================
  const btnExportData = document.getElementById('btn-export-data');
  const exportFormatSelect = document.getElementById('export-format');
  const exportScopeSelect = document.getElementById('export-scope');

  if (btnExportData) {
    btnExportData.addEventListener('click', () => {
      const format = exportFormatSelect.value;
      const scope = exportScopeSelect.value;

      btnExportData.disabled = true;
      btnExportData.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Preparing Export...';

      setTimeout(() => {
        let fileContent = '';
        let fileName = `finora_financial_export_${new Date().toISOString().split('T')[0]}`;

        if (format === 'json') {
          fileName += '.json';
          const exportObj = {
            brand: 'Finora Expense Tracker',
            exportedAt: new Date().toISOString(),
            scope: scope,
            user: {
              name: state.profile.fullName,
              email: state.profile.email,
              currency: state.preferences.currency
            },
            sampleTransactions: [
              { id: 'TXN-2026-10482', title: 'Dinner at Urban Cafe', type: 'Expense', amount: 1250, category: 'Food & Dining', date: '2026-10-14' },
              { id: 'TXN-2026-10481', title: 'Client Payment - Web App', type: 'Income', amount: 45000, category: 'Freelance', date: '2026-10-13' },
              { id: 'TXN-2026-10480', title: 'Monthly Metro Pass', type: 'Expense', amount: 1850, category: 'Transportation', date: '2026-10-12' }
            ]
          };
          fileContent = JSON.stringify(exportObj, null, 2);
        } else {
          fileName += '.csv';
          fileContent = 'Transaction ID,Date,Title,Type,Category,Amount (INR),Payment Method,Status\n' +
            'TXN-2026-10482,2026-10-14,"Dinner at Urban Cafe",Expense,"Food & Dining",1250.00,UPI,Completed\n' +
            'TXN-2026-10481,2026-10-13,"Client Payment - Web App",Income,Freelance,45000.00,Bank Transfer,Completed\n' +
            'TXN-2026-10480,2026-10-12,"Monthly Metro Pass",Expense,Transportation,1850.00,Metro Card,Completed\n';
        }

        // Trigger native browser download
        const blob = new Blob([fileContent], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        btnExportData.disabled = false;
        btnExportData.innerHTML = '<i class="ri-download-2-line"></i> Download Financial Data';
        showToast(`Financial data successfully exported as ${format.toUpperCase()}!`, 'success');
      }, 900);
    });
  }

  // Delete Account Modal
  const modalDelete = document.getElementById('modal-delete-account');
  const btnOpenDelete = document.getElementById('btn-open-delete-modal');
  const btnCloseDelete = document.getElementById('btn-close-delete');
  const btnCancelDelete = document.getElementById('btn-cancel-delete');
  const inputDeleteConfirm = document.getElementById('input-delete-confirm');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');

  if (btnOpenDelete && modalDelete) {
    btnOpenDelete.addEventListener('click', () => {
      modalDelete.classList.add('open');
      if (inputDeleteConfirm) inputDeleteConfirm.value = '';
      if (btnConfirmDelete) btnConfirmDelete.disabled = true;
    });
  }

  if (btnCloseDelete) btnCloseDelete.addEventListener('click', () => modalDelete.classList.remove('open'));
  if (btnCancelDelete) btnCancelDelete.addEventListener('click', () => modalDelete.classList.remove('open'));

  if (inputDeleteConfirm && btnConfirmDelete) {
    inputDeleteConfirm.addEventListener('input', () => {
      btnConfirmDelete.disabled = inputDeleteConfirm.value.trim() !== 'DELETE';
    });
  }

  if (btnConfirmDelete) {
    btnConfirmDelete.addEventListener('click', () => {
      btnConfirmDelete.disabled = true;
      btnConfirmDelete.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Deleting Account...';

      setTimeout(() => {
        modalDelete.classList.remove('open');
        showToast('Your Finora account has been permanently scheduled for deletion.', 'error');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
      }, 1000);
    });
  }

  // Sign Out Buttons
  const btnSignOut = document.getElementById('btn-sign-out');
  const dropdownSignOut = document.getElementById('dropdown-logout');
  function handleSignOut() {
    if (confirm('Are you sure you want to sign out of Finora?')) {
      showToast('Signing out...', 'info');
      if (window.FinoraAuth) {
        window.FinoraAuth.logout();
      } else {
        localStorage.removeItem('finora_auth_token');
        localStorage.removeItem('finora_current_user');
        window.location.href = 'login.html';
      }
    }
  }
  if (btnSignOut) btnSignOut.addEventListener('click', handleSignOut);
  if (dropdownSignOut) dropdownSignOut.addEventListener('click', handleSignOut);

  // ========================================================================
  // 9. User Profile Popover & Mobile Navigation Drawer
  // ========================================================================
  const userProfileMenu = document.getElementById('user-profile-menu');
  const profilePopover = document.getElementById('profile-popover');

  if (userProfileMenu && profilePopover) {
    userProfileMenu.addEventListener('click', (e) => {
      profilePopover.classList.toggle('open');
      e.stopPropagation();
    });

    document.addEventListener('click', () => {
      profilePopover.classList.remove('open');
    });

    profilePopover.addEventListener('click', (e) => e.stopPropagation());
  }

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (mobileToggle && sidebar && backdrop) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      backdrop.classList.toggle('mobile-open');
    });

    backdrop.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      backdrop.classList.remove('mobile-open');
    });
  }

  // Helper function to sync form with current in-memory state
  function syncFormWithState() {
    const fullNameInput = document.getElementById('profile-full-name');
    if (fullNameInput) fullNameInput.value = state.profile.fullName;
    const dispInput = document.getElementById('profile-display-name');
    if (dispInput) dispInput.value = state.profile.displayName;
    const phoneInput = document.getElementById('profile-phone-number');
    if (phoneInput) phoneInput.value = state.profile.phoneNumber;
    const aboutInput = document.getElementById('profile-about');
    if (aboutInput) aboutInput.value = state.profile.about;
  }

  // ========================================================================
  // 10. Interactive Demo Switcher Toolbar
  // ========================================================================
  const demoButtons = document.querySelectorAll('.demo-btn');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      demoButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-demo');

      if (mode === 'standard') {
        setDirty(false);
        state.security.twoFactorEnabled = false;
        update2FAStatusUI();
        switchTab('tab-profile');
        showToast('Standard Profile loaded.', 'info');
      } else if (mode === 'unsaved') {
        const fullNameInput = document.getElementById('profile-full-name');
        if (fullNameInput) fullNameInput.value = `${state.profile.fullName || 'User'} (Modified)`;
        setDirty(true);
        switchTab('tab-profile');
        showToast('Unsaved Changes banner activated.', 'info');
      } else if (mode === '2fa') {
        state.security.twoFactorEnabled = true;
        update2FAStatusUI();
        switchTab('tab-security');
        showToast('Two-Factor Authentication Enabled state loaded.', 'success');
      } else if (mode === 'appearance') {
        switchTab('tab-appearance');
        showToast('Appearance & Theme Settings loaded.', 'info');
      } else if (mode === 'error') {
        showToast('Error: Failed to reach /api/users/me/preferences. Server timed out.', 'error');
      }
    });
  });

  // ========================================================================
  // 11. Toast Utility
  // ========================================================================
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    let icon = 'ri-information-line';
    if (type === 'success') icon = 'ri-checkbox-circle-fill';
    if (type === 'error') icon = 'ri-error-warning-fill';

    toast.innerHTML = `<i class="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ========================================================================
  // 12. Load Real Authenticated User Profile & Preferences from MongoDB
  // ========================================================================
  async function loadUserData() {
    try {
      const res = await fetchAuth('/api/users/me');
      if (res.ok) {
        const data = await res.json();
        const user = data.user || data.data;
        if (user) {
          state.profile.fullName = user.name || '';
          state.profile.displayName = user.displayName || user.name || '';
          state.profile.email = user.email || '';
          state.profile.phoneCountry = user.phoneCountry || '+91';
          state.profile.phoneNumber = user.phone || '';
          state.profile.dob = user.dob || '';
          state.profile.country = user.country || 'India';
          state.profile.language = user.language || 'en-IN';
          state.profile.about = user.bio || '';
          state.profile.photoUrl = user.avatar || '';

          // Populate inputs
          const fn = document.getElementById('profile-full-name');
          if (fn) fn.value = state.profile.fullName;
          const dn = document.getElementById('profile-display-name');
          if (dn) dn.value = state.profile.displayName;
          const em = document.getElementById('profile-email');
          if (em) em.value = state.profile.email;
          const pc = document.getElementById('profile-phone-code');
          if (pc) pc.value = state.profile.phoneCountry;
          const pn = document.getElementById('profile-phone-number');
          if (pn) pn.value = state.profile.phoneNumber;
          const dob = document.getElementById('profile-dob');
          if (dob) dob.value = state.profile.dob;
          const cntry = document.getElementById('profile-country');
          if (cntry) cntry.value = state.profile.country;
          const lang = document.getElementById('profile-language');
          if (lang) lang.value = state.profile.language;
          const ab = document.getElementById('profile-about');
          if (ab) ab.value = state.profile.about;

          // Populate avatar & fallback
          if (user.avatar && avatarImg) {
            avatarImg.src = user.avatar;
            avatarImg.style.display = 'block';
            if (avatarFallback) avatarFallback.style.display = 'none';
          } else if (avatarFallback && user.name) {
            if (avatarImg) avatarImg.style.display = 'none';
            avatarFallback.style.display = 'flex';
            const initials = user.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();
            avatarFallback.textContent = initials || 'U';
          }

          // Update header / sidebar display
          if (window.FinoraAuth) {
            window.FinoraAuth.updateDOMUserInfo(user);
          }
          const headerName = document.querySelector('.user-name');
          if (headerName) headerName.textContent = user.name;
          const photoName = document.querySelector('.photo-user-name span');
          if (photoName) photoName.textContent = user.name;
          const displayProf = document.getElementById('display-profile-name');
          if (displayProf) displayProf.textContent = user.name;
        }
      }

      // Also load settings
      const settingsRes = await fetchAuth('/api/settings');
      if (settingsRes.ok) {
        const sData = await settingsRes.json();
        const settings = sData.settings || sData.data;
        if (settings) {
          Object.assign(state.preferences, settings);
          if (currencySelect && settings.currency) currencySelect.value = settings.currency;
          if (dateFormatSelect && settings.dateFormat) dateFormatSelect.value = settings.dateFormat;
          if (timeFormatSelect && settings.timeFormat) timeFormatSelect.value = settings.timeFormat;
          const tz = document.getElementById('pref-timezone');
          if (tz && settings.timeZone) tz.value = settings.timeZone;
          const fd = document.getElementById('pref-first-day');
          if (fd && settings.firstDayOfWeek) fd.value = settings.firstDayOfWeek;
          const sc = document.getElementById('pref-show-cents');
          if (sc && settings.showCents !== undefined) sc.checked = settings.showCents;
          const cn = document.getElementById('pref-compact-numbers');
          if (cn && settings.compactNumbers !== undefined) cn.checked = settings.compactNumbers;
          const hb = document.getElementById('pref-hide-balances');
          if (hb && settings.hideBalances !== undefined) hb.checked = settings.hideBalances;
          const cd = document.getElementById('pref-confirm-delete');
          if (cd && settings.confirmDelete !== undefined) cd.checked = settings.confirmDelete;
          const si = document.getElementById('pref-show-icons');
          if (si && settings.showIcons !== undefined) si.checked = settings.showIcons;

          updateCurrencyPreview();
          updateDateTimePreview();
        }
      }
    } catch (err) {
      console.error('Failed to load user settings:', err);
    }
  }

  // Initialize previews & load real user
  updateCurrencyPreview();
  updateDateTimePreview();
  loadUserData();
});
