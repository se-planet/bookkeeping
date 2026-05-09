import { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSummary, useByCategory, useMonthlyTrend } from '../hooks/useStatistics';
import { formatCurrency } from '../utils';

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#f472b6', '#fb923c', '#fbbf24', '#34d399', '#60a5fa', '#f87171'];

export default function Statistics() {
  const [period, setPeriod] = useState('monthly');
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: summaryData, isLoading: summaryLoading } = useSummary({ period, year, month });
  const { data: catData, isLoading: catLoading } = useByCategory({ period, year, month });
  const { data: trendData, isLoading: trendLoading } = useMonthlyTrend({ year });

  const summary = summaryData?.data || { total_income: 0, total_expense: 0, balance: 0 };
  const categories = catData?.data || [];
  const trends = trendData?.data || [];

  const pieData = categories.filter(d => d.total > 0).map(d => ({ name: d.category_name, value: d.total, color: d.category_color }));

  return (
    <div>
      <h2 className="page-title">统计</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="stat-card income">
          <div className="stat-label">总收入</div>
          <div className="stat-value" style={{color: '#10b981'}}>
            {summaryLoading ? '...' : formatCurrency(summary.total_income)}
          </div>
        </div>
        <div className="stat-card expense">
          <div className="stat-label">总支出</div>
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

      <div className="flex items-center gap-4 mb-6">
        <div className="type-toggle" style={{width: 'auto'}}>
          <button onClick={() => setPeriod('monthly')}
            className={`type-toggle-btn ${period === 'monthly' ? 'active-expense' : ''}`} style={{minWidth: '72px'}}>月度</button>
          <button onClick={() => setPeriod('yearly')}
            className={`type-toggle-btn ${period === 'yearly' ? 'active-expense' : ''}`} style={{minWidth: '72px'}}>年度</button>
        </div>
        {period === 'monthly' && (
          <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-2.5 shadow-sm">
            <button onClick={() => { if (month > 1) setMonth(month - 1); else { setMonth(12); setYear(year - 1); } }} className="text-gray-400 hover:text-primary font-bold text-lg transition-colors">◀</button>
            <span className="font-semibold text-sm">{year}年{month}月</span>
            <button onClick={() => { if (month < 12) setMonth(month + 1); else { setMonth(1); setYear(year + 1); } }} className="text-gray-400 hover:text-primary font-bold text-lg transition-colors">▶</button>
          </div>
        )}
        {period === 'yearly' && (
          <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-2.5 shadow-sm">
            <button onClick={() => setYear(y => y - 1)} className="text-gray-400 hover:text-primary font-bold text-lg transition-colors">◀</button>
            <span className="font-semibold text-sm">{year}年</span>
            <button onClick={() => setYear(y => y + 1)} className="text-gray-400 hover:text-primary font-bold text-lg transition-colors">▶</button>
          </div>
        )}
      </div>

      {catLoading ? (
        <div className="card mb-6 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-24 mb-4" />
          <div className="h-[350px] bg-gray-50 rounded-xl" />
        </div>
      ) : pieData.length > 0 && (
        <div className="card mb-6">
          <h3 className="chart-header">分类占比</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} innerRadius={50}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color || PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {trendLoading ? (
        <div className="card animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-32 mb-4" />
          <div className="h-[300px] bg-gray-50 rounded-xl" />
        </div>
      ) : trends.length > 0 && (
        <div className="card">
          <h3 className="chart-header">{year}年 月度趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tickFormatter={m => `${m}月`} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13}} />
              <YAxis tickFormatter={v => `¥${(v / 1000).toFixed(0)}k`} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip formatter={(v) => formatCurrency(v)} labelFormatter={(m) => `${m}月`}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}} />
              <Legend formatter={(v) => v === 'income' ? '收入' : '支出'} />
              <Bar dataKey="income" name="income" fill="#34d399" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="expense" fill="#a78bfa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
