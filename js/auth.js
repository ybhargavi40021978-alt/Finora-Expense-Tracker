/**
 * Finora Expense Tracker — Global Client Authentication & Session Manager
 * Synchronizes authenticated user state between MongoDB, Express, and UI screens.
 */

(function (window) {
  'use strict';

  const TOKEN_KEY = 'finora_auth_token';
  const USER_KEY = 'finora_current_user';

  const Auth = {
    // Check if user has an auth token
    isAuthenticated() {
      return Boolean(localStorage.getItem(TOKEN_KEY));
    },

    // Retrieve raw JWT token
    getToken() {
      return localStorage.getItem(TOKEN_KEY);
    },

    // Retrieve cached user object
    getUser() {
      try {
        const u = localStorage.getItem(USER_KEY);
        return u ? JSON.parse(u) : null;
      } catch (e) {
        return null;
      }
    },

    // Save token and user into local storage
    setSession(token, user) {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    // Clear session and logout
    logout() {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = 'login.html';
    },

    // Authenticated fetch wrapper
    async fetchWithAuth(url, options = {}) {
      const token = this.getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(url, { ...options, headers });

      if (res.status === 401) {
        // Token expired or invalid — clear session and redirect to login
        this.logout();
        throw new Error('Session expired. Please log in again.');
      }

      return res;
    },

    // Generate dynamic greeting based on current local hour and user's first name
    getGreeting(fullName = '') {
      const firstName = (fullName || 'Friend').trim().split(' ')[0];
      const hour = new Date().getHours();
      let timeGreeting = 'Good Morning';
      if (hour >= 12 && hour < 17) {
        timeGreeting = 'Good Afternoon';
      } else if (hour >= 17) {
        timeGreeting = 'Good Evening';
      }
      return `${timeGreeting}, ${firstName}! 👋`;
    },

    // Refresh user profile from backend
    async refreshProfile() {
      if (!this.isAuthenticated()) return null;
      try {
        const res = await this.fetchWithAuth('/api/users/me');
        if (res.ok) {
          const json = await res.json();
          const user = json.user || json.data;
          if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            this.updateDOMUserInfo(user);
            return user;
          }
        }
      } catch (err) {
        console.warn('[Finora Auth] Failed to refresh profile:', err.message);
      }
      return this.getUser();
    },

    // Update headers, greetings, and avatar badges throughout any page
    updateDOMUserInfo(user) {
      if (!user) return;
      const fullName = user.name || user.fullName || 'User';
      const email = user.email || 'user@example.com';
      const firstName = fullName.split(' ')[0];

      // 1. Welcome Greeting on Dashboard
      const welcomeHeadings = document.querySelectorAll('.welcome-heading');
      welcomeHeadings.forEach(el => {
        el.textContent = this.getGreeting(fullName);
      });

      // 2. User name spans in top header
      const userNameSpans = document.querySelectorAll('.user-name');
      userNameSpans.forEach(el => {
        el.textContent = fullName;
      });

      // 3. Dropdown user info
      const dropdownNames = document.querySelectorAll('.dropdown-user-name');
      dropdownNames.forEach(el => {
        el.textContent = fullName;
      });

      const dropdownEmails = document.querySelectorAll('.dropdown-user-email');
      dropdownEmails.forEach(el => {
        el.textContent = email;
      });

      // 4. Avatars - Generate clean initials fallback
      const initials = fullName
        .split(' ')
        .filter(Boolean)
        .map(n => n[0].toUpperCase())
        .slice(0, 2)
        .join('');

      const avatarImages = document.querySelectorAll('.user-avatar, .user-avatar-small, .header-avatar');
      avatarImages.forEach(img => {
        if (user.avatar) {
          img.src = user.avatar;
          img.alt = fullName;
        } else {
          // Use dynamic SVG data URI with user initials
          const svgInitials = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="%237957FF"/><text x="32" y="38" font-family="sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${initials}</text></svg>`;
          img.src = svgInitials;
          img.alt = fullName;
        }
      });

      // Ensure user popovers are refreshed with latest profile
      this.initUserMenuAndPopovers();
    },

    // Initialize interactive user profile menu & dropdown popovers on the right side of the bar
    initUserMenuAndPopovers() {
      // Inject essential styling for popovers if not already in document
      if (!document.getElementById('finora-auth-popover-styles')) {
        const style = document.createElement('style');
        style.id = 'finora-auth-popover-styles';
        style.textContent = `
          .user-profile-menu, .user-profile {
            position: relative !important;
            cursor: pointer !important;
          }
          .profile-dropdown-popover {
            position: absolute !important;
            top: calc(100% + 8px) !important;
            right: 0 !important;
            min-width: 220px !important;
            background: #FFFFFF !important;
            border: 1px solid #E8EBF3 !important;
            border-radius: 12px !important;
            box-shadow: 0 12px 32px rgba(24, 33, 61, 0.14) !important;
            padding: 8px !important;
            display: none;
            flex-direction: column !important;
            z-index: 99999 !important;
            text-align: left !important;
          }
          .profile-dropdown-popover.open, .profile-dropdown-popover.show {
            display: flex !important;
          }
          .profile-dropdown-popover .dropdown-item {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            padding: 9px 12px !important;
            border-radius: 8px !important;
            font-size: 0.8125rem !important;
            color: #18213D !important;
            font-weight: 500 !important;
            text-decoration: none !important;
            background: transparent !important;
            border: none !important;
            cursor: pointer !important;
            width: 100% !important;
            box-sizing: border-box !important;
            transition: background 0.15s ease, color 0.15s ease !important;
          }
          .profile-dropdown-popover .dropdown-item:hover {
            background-color: #F6F7FC !important;
            color: #7957FF !important;
          }
          .profile-dropdown-popover .dropdown-item.text-danger {
            color: #F06575 !important;
          }
          .profile-dropdown-popover .dropdown-item.text-danger:hover {
            background-color: #FFF5F6 !important;
            color: #D63D4F !important;
          }
          .btn-settings-header, .header-settings-btn {
            position: relative;
            width: 38px;
            height: 38px;
            border-radius: 10px;
            border: 1px solid #E8EBF3;
            background: #FFFFFF;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #18213D;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .btn-settings-header:hover, .header-settings-btn:hover {
            background-color: #F6F7FC;
            border-color: #CBD5E1;
            color: #7957FF;
          }
        `;
        document.head.appendChild(style);
      }

      const user = this.getUser() || { name: 'User', email: 'user@example.com' };
      const fullName = user.name || user.fullName || 'User';
      const email = user.email || 'user@example.com';

      const userMenus = document.querySelectorAll('.user-profile-menu, .user-profile, #user-profile-menu');
      userMenus.forEach(menu => {
        let popover = menu.querySelector('.profile-dropdown-popover');
        if (!popover) {
          popover = document.createElement('div');
          popover.className = 'profile-dropdown-popover';
          popover.id = 'profile-popover';
          popover.setAttribute('role', 'menu');
          popover.innerHTML = `
            <div class="dropdown-user-header" style="padding: 8px 12px; border-bottom: 1px solid #E8EBF3; margin-bottom: 6px;">
              <div class="dropdown-user-name" style="font-weight: 700; font-size: 0.875rem; color: #18213D;">${fullName}</div>
              <div class="dropdown-user-email" style="font-size: 0.75rem; color: #75809A; overflow: hidden; text-overflow: ellipsis;">${email}</div>
            </div>
            <button class="dropdown-item" role="menuitem" data-action="go-profile">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              My Profile
            </button>
            <button class="dropdown-item" role="menuitem" data-action="go-settings">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Account Settings
            </button>
            <div style="border-top: 1px solid #E8EBF3; margin: 4px 0;"></div>
            <button class="dropdown-item text-danger" role="menuitem" data-action="logout">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          `;
          menu.appendChild(popover);
        }

        // Bind click toggle on menu (avoid duplicate handlers)
        if (!menu.dataset.authMenuInitialized) {
          menu.dataset.authMenuInitialized = 'true';
          menu.addEventListener('click', (e) => {
            // If clicking inside popover buttons/links, allow click action
            if (e.target.closest('.dropdown-item, a, button')) {
              return;
            }
            e.stopPropagation();
            const isOpen = popover.classList.contains('open') || popover.classList.contains('show');
            document.querySelectorAll('.profile-dropdown-popover').forEach(p => {
              p.classList.remove('open');
              p.classList.remove('show');
            });
            if (!isOpen) {
              popover.classList.add('open');
              popover.classList.add('show');
            }
          });
        }
      });

      // Bind all Profile, Settings, and Logout buttons inside popovers
      document.querySelectorAll('[data-action="go-profile"], .dropdown-item:not([data-action])').forEach(btn => {
        const text = btn.textContent.toLowerCase();
        if (text.includes('profile')) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'settings.html#profile';
          });
        } else if (text.includes('settings')) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'settings.html#preferences';
          });
        }
      });

      document.querySelectorAll('[data-action="go-settings"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'settings.html#preferences';
        });
      });

      // Close popover when clicking anywhere outside
      if (!window._finoraAuthClickBound) {
        window._finoraAuthClickBound = true;
        document.addEventListener('click', (e) => {
          if (!e.target.closest('.user-profile-menu, .user-profile')) {
            document.querySelectorAll('.profile-dropdown-popover').forEach(p => {
              p.classList.remove('open');
              p.classList.remove('show');
            });
          }
        });
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            document.querySelectorAll('.profile-dropdown-popover').forEach(p => {
              p.classList.remove('open');
              p.classList.remove('show');
            });
          }
        });
      }
    },

    // Initialize page authentication state
    async initPage(options = {}) {
      const { isProtected = false, isAuthPage = false } = options;
      const token = this.getToken();

      if (isProtected && !token) {
        // Redirect to login if user is not authenticated
        window.location.href = 'login.html';
        return;
      }

      if (isAuthPage && token) {
        // If already logged in, redirect straight to dashboard
        window.location.href = 'dashboard.html';
        return;
      }

      // Attach sign out handlers to all logout buttons
      document.querySelectorAll('#btn-logout, #dropdown-logout, .btn-signout, [data-action="logout"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.logout();
        });
      });

      // Ensure all sidebar settings links point to settings.html
      document.querySelectorAll('#nav-settings, a[href="#settings"]').forEach(a => {
        // Exclude in-page tabs on settings.html
        if (!window.location.pathname.includes('settings.html')) {
          a.href = 'settings.html';
        }
      });

      // Hydrate cached user first for zero lag, then refresh from server
      const cached = this.getUser();
      if (cached) {
        this.updateDOMUserInfo(cached);
      }

      this.initUserMenuAndPopovers();

      if (token) {
        await this.refreshProfile();
      }
    }
  };

  window.FinoraAuth = Auth;

  // Auto-init based on page path
  document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();
    const isAuthPage = path.includes('login') || path.includes('register');
    const isProtected = path.includes('dashboard') || path.includes('settings') || path.includes('transactions') || path.includes('budget') || path.includes('goals') || path.includes('analytics');

    FinoraAuth.initPage({ isProtected, isAuthPage });
  });

})(window);
