/**
 * Authentication & User Profile Service for Finora React frontend
 */
import { request } from './api';

export const authService = {
  /**
   * Register a new user
   */
  async register(userData) {
    const res = await request('/auth/register', {
      method: 'POST',
      body: userData
    });
    if (res.token) {
      localStorage.setItem('finora_auth_token', res.token);
      localStorage.setItem('finora_current_user', JSON.stringify(res.user));
    }
    return res;
  },

  /**
   * Log in an existing user
   */
  async login(credentials) {
    const res = await request('/auth/login', {
      method: 'POST',
      body: credentials
    });
    if (res.token) {
      localStorage.setItem('finora_auth_token', res.token);
      localStorage.setItem('finora_current_user', JSON.stringify(res.user));
    }
    return res;
  },

  /**
   * Log out current user and clear local storage
   */
  logout() {
    localStorage.removeItem('finora_auth_token');
    localStorage.removeItem('finora_current_user');
    window.location.href = 'login.html';
  },

  /**
   * Get authenticated user profile
   */
  async getMe() {
    return request('/users/me', { method: 'GET' });
  },

  /**
   * Update authenticated user profile
   */
  async updateMe(profileData) {
    const res = await request('/users/me', {
      method: 'PATCH',
      body: profileData
    });
    if (res.user) {
      localStorage.setItem('finora_current_user', JSON.stringify(res.user));
    }
    return res;
  },

  /**
   * Change password
   */
  async changePassword(currentPassword, newPassword) {
    return request('/auth/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword }
    });
  },

  /**
   * Get user settings
   */
  async getSettings() {
    return request('/settings', { method: 'GET' });
  },

  /**
   * Update user settings
   */
  async updateSettings(settings) {
    return request('/settings', {
      method: 'PATCH',
      body: settings
    });
  },

  /**
   * Get authenticated dashboard data
   */
  async getDashboard(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/dashboard?${query}` : '/dashboard';
    return request(endpoint, { method: 'GET' });
  },

  /**
   * Get currently cached user object
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem('finora_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('finora_auth_token');
  }
};

export default authService;
