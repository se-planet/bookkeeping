import { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSummary, useByCategory, useMonthlyTrend } from '../hooks/useStatistics';
import { formatCurrency } from '../utils/format';
import StatCard from '../components/StatCard';

const PIE_COLORS = ['#4f5de4', '#0d9488', '#f59e0b', '#8b5cf6', '#e11d48', '#06b6d4', '#10b981', '#f97316', '#6366f1', '#ec4899'];

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
        <StatCard label="总收入" value={summaryLoading ? '...' : formatCurrency(summary.total_income)} variant="income" color="var(--income)" />
        <StatCard label="总支出" value={summaryLoading ? '...' : formatCurrency(summary.total_expense)} variant="expense" color="var(--expense)" />
        <StatCard label="结余" value={summaryLoading ? '...' : formatCurrency(summary.balance)} variant="balance" color={summary.balance >= 0 ? 'var(--income)' : 'var(--expense)'} />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button onClick={() => setPeriod('monthly')} className={`filter-pill ${period === 'monthly' ? 'filter-pill-active' : ''}`}>月度</button>
          <button onClick={() => setPeriod('yearly')} className={`filter-pill ${period === 'yearly' ? 'filter-pill-active' : ''}`}>年度</button>
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
              <Bar dataKey="income" name="income" fill="#0d9488" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" name="expense" fill="#e11d48" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
