import { request } from './api';

export const summaryService = {
  // Get monthly summary
  getMonthly: async (year, month) => {
    const query = new URLSearchParams();
    if (year) query.set('year', year);
    if (month) query.set('month', month);
    const queryString = query.toString();
    return request(`/summary/monthly${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  // Get yearly summary
  getYearly: async (year) => {
    const query = new URLSearchParams();
    if (year) query.set('year', year);
    const queryString = query.toString();
    return request(`/summary/yearly${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  // Get overall summary
  getOverall: async () => {
    return request('/summary/overall', { method: 'GET' });
  },

  // Aliases
  getMonthlySummary: async (year, month) => summaryService.getMonthly(year, month),
  getYearlySummary: async (year) => summaryService.getYearly(year),
  getOverallSummary: async () => summaryService.getOverall()
};
