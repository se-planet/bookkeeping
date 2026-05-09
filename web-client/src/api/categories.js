import apiClient from './client';

export function fetchCategories(type) {
  return apiClient.get('/categories', { params: type ? { type } : {} }).then(r => r.data);
}

export function createCategory(data) {
  return apiClient.post('/categories', data).then(r => r.data);
}

export function updateCategory(id, data) {
  return apiClient.put(`/categories/${id}`, data).then(r => r.data);
}

export function deleteCategory(id) {
  return apiClient.delete(`/categories/${id}`).then(r => r.data);
}
