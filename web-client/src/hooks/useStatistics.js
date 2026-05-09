import { useQuery } from '@tanstack/react-query';
import * as api from '../api/statistics';

export function useSummary(params) {
  return useQuery({ queryKey: ['statistics', 'summary', params], queryFn: () => api.fetchSummary(params) });
}

export function useByCategory(params) {
  return useQuery({ queryKey: ['statistics', 'by-category', params], queryFn: () => api.fetchByCategory(params) });
}

export function useMonthlyTrend(params) {
  return useQuery({ queryKey: ['statistics', 'monthly-trend', params], queryFn: () => api.fetchMonthlyTrend(params) });
}
