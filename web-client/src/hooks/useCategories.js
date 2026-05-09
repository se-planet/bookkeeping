import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/categories';

export function useCategories(type) {
  return useQuery({ queryKey: ['categories', { type }], queryFn: () => api.fetchCategories(type) });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createCategory, onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => api.updateCategory(id, data), onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteCategory, onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });
}
