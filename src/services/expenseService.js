import { request } from './api';

export const expenseService = {
  // Create new expense
  create: async (expenseData) => {
    return request('/expenses', {
      method: 'POST',
      body: expenseData
    });
  },

  // Get expense list with filters
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
    return request(`/expenses${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  // Get single expense record by ID
  getById: async (id) => {
    return request(`/expenses/${id}`, { method: 'GET' });
  },

  // Update existing expense record
  update: async (id, updates) => {
    return request(`/expenses/${id}`, {
      method: 'PATCH',
      body: updates
    });
  },

  // Delete expense record
  delete: async (id) => {
    return request(`/expenses/${id}`, { method: 'DELETE' });
  },

  // Aliases
  createExpense: async (data) => expenseService.create(data),
  getExpenses: async (params) => expenseService.getAll(params),
  getExpenseById: async (id) => expenseService.getById(id),
  updateExpense: async (id, data) => expenseService.update(id, data),
  deleteExpense: async (id) => expenseService.delete(id)
};
