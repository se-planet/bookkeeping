import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSummary } from '../hooks/useStatistics';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency, formatDate } from '../utils';

function Skeleton({ lines = 3 }) {
  return (
    <div className="card" style={{padding: 0, overflow: 'hidden'}}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="tx-item animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-100 mr-4" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-3 bg-gray-50 rounded w-32" />
          </div>
          <div className="h-4 bg-gray-100 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

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
        <div className="stat-card income">
          <div className="stat-label">收入</div>
          <div className="stat-value" style={{color: '#10b981'}}>
            {summaryLoading ? '...' : formatCurrency(summary.total_income)}
          </div>
        </div>
        <div className="stat-card expense">
          <div className="stat-label">支出</div>
          <div className="stat-value" style={{color: '#ef4444'}}>
            {summaryLoading ? '...' : formatCurrency(summary.total_expense)}
          </div>
        </div>
        <div className="stat-card balance">
          <div className="stat-label">结余</div>
          <div className="stat-value" style={{color: summary.balance >= 0 ? '#10b981' : '#ef4444'}}>
            {summaryLoading ? '...' : formatCurrency(summary.balance)}
          </div>
        </div>
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
              <div key={t.id} className="tx-item">
                <span className="text-2xl mr-4">{t.category_icon || '📦'}</span>
                <div className="flex-1">
                  <div className="font-medium text-[15px]">
                    {t.category_name}
                    {t.sub_category && <span className="text-gray-400 text-xs ml-1">·{t.sub_category}</span>}
                    {t.payment_method && (
                      <span className={`payment-badge ml-1.5 ${t.payment_method === '微信' ? 'payment-wechat' : t.payment_method === '支付宝' ? 'payment-alipay' : t.payment_method === '银行卡' ? 'payment-card' : 'payment-cash'}`}>
                        {t.payment_method}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mt-0.5">{t.note || formatDate(t.date)}</div>
                </div>
                <div className={`font-semibold text-[15px] ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                  {formatCurrency(t.type === 'income' ? t.amount : -t.amount)}
                </div>
              </div>
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
