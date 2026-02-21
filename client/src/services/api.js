
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

export const bookService = {
    getAll: () => api.get('/books'),
    search: (query) => api.get('/books/search', { params: { query } }),
    add: (book) => api.post('/books', book),
    bulkUpload: (books) => api.post('/books/bulk', books),
};

export const userService = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    login: (credentials) => api.post('/users/login', credentials),
};

export const transactionService = {
    issue: (data) => api.post('/transactions/issue', data),
    return: (data) => api.post('/transactions/return', data),
    getStats: () => api.get('/transactions/stats'),
};

export default api;
