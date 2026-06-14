import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSummary } from '../hooks/useStatistics';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/format';
import StatCard from '../components/StatCard';
import Skeleton from '../components/Skeleton';
import TransactionItem from '../components/TransactionItem';

export default function Dashboard() {
  const [period, setPeriod] = useState('monthly');
  const now = new Date();
  const { data: summaryData, isLoading: summaryLoading } = useSummary({ period, year: now.getFullYear(), month: now.getMonth() + 1 });
  const { data: txData, isLoading: txLoading } = useTransactions({ limit: 5, sort_by: 'date', sort_order: 'desc' });

  const summary = summaryData?.data || { total_income: 0, total_expense: 0, balance: 0 };
  const transactions = txData?.data || [];

  return (
    <div>
      <h2 className="page-title">概览</h2>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setPeriod('monthly')} className={`filter-pill ${period === 'monthly' ? 'filter-pill-active' : ''}`}>本月</button>
        <button onClick={() => setPeriod('yearly')} className={`filter-pill ${period === 'yearly' ? 'filter-pill-active' : ''}`}>本年</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="收入" value={summaryLoading ? '...' : formatCurrency(summary.total_income)} variant="income" color="var(--income)" />
        <StatCard label="支出" value={summaryLoading ? '...' : formatCurrency(summary.total_expense)} variant="expense" color="var(--expense)" />
        <StatCard label="结余" value={summaryLoading ? '...' : formatCurrency(summary.balance)} variant="balance" color={summary.balance >= 0 ? 'var(--income)' : 'var(--expense)'} />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="chart-header" style={{marginBottom: 0}}>最近记录</h2>
        <Link to="/transactions" className="link">查看全部 →</Link>
      </div>

      {txLoading ? <Skeleton lines={3} /> : (
        <div className="card" style={{padding: 0, overflow: 'hidden'}}>
          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <div className="empty-state-text">暂无记录，点击右下角 + 添加一笔</div>
            </div>
          ) : (
            transactions.map(t => (
              <TransactionItem key={t.id} transaction={t} />
            ))
          )}
        </div>
      )}

      <Link to="/transactions/new" className="fab">
        +
      </Link>
    </div>
  );
}
