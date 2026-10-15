import { request } from './api';

export const incomeService = {
  // Create new income
  create: async (incomeData) => {
    return request('/income', {
      method: 'POST',
      body: incomeData
    });
  },

  // Get income list with filters
  getAll: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const queryString = query.toString();
    return request(`/income${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  // Get single income record by ID
  getById: async (id) => {
    return request(`/income/${id}`, { method: 'GET' });
  },

  // Update existing income record
  update: async (id, updates) => {
    return request(`/income/${id}`, {
      method: 'PATCH',
      body: updates
    });
  },

  // Delete income record
  delete: async (id) => {
    return request(`/income/${id}`, { method: 'DELETE' });
  },

  // Aliases
  createIncome: async (data) => incomeService.create(data),
  getIncomes: async (params) => incomeService.getAll(params),
  getIncomeById: async (id) => incomeService.getById(id),
  updateIncome: async (id, data) => incomeService.update(id, data),
  deleteIncome: async (id) => incomeService.delete(id)
};
