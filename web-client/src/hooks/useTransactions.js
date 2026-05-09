import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/transactions';

export function useTransactions(params) {
  return useQuery({ queryKey: ['transactions', params], queryFn: () => api.fetchTransactions(params) });
}

export function useTransaction(id) {
  return useQuery({ queryKey: ['transactions', id], queryFn: () => api.fetchTransactionById(id), enabled: !!id });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createTransaction, onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); qc.invalidateQueries({ queryKey: ['statistics'] }); } });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, data }) => api.updateTransaction(id, data), onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); qc.invalidateQueries({ queryKey: ['statistics'] }); } });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteTransaction, onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); qc.invalidateQueries({ queryKey: ['statistics'] }); } });
}
