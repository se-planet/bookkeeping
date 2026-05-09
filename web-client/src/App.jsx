import { Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import TransactionForm from './pages/TransactionForm';
import Categories from './pages/Categories';
import Statistics from './pages/Statistics';
import Export from './pages/Export';
import Import from './pages/Import';
import NotFound from './pages/NotFound';

const navItems = [
  { to: '/', label: '首页', icon: '💰' },
  { to: '/transactions', label: '账单', icon: '📋' },
  { to: '/statistics', label: '统计', icon: '📊' },
  { to: '/categories', label: '分类', icon: '📂' },
  { to: '/export', label: '导出', icon: '📤' },
  { to: '/import', label: '导入', icon: '📥' },
];

export default function App() {
  return (
    <div className="app-layout">
      <nav className="sidebar">
        <h1 className="sidebar-title">记账本</h1>
        <div className="sidebar-subtitle">个人财务管理</div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span> {item.label}
          </NavLink>
        ))}
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/new" element={<TransactionForm />} />
          <Route path="/transactions/:id/edit" element={<TransactionForm />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/export" element={<Export />} />
          <Route path="/import" element={<Import />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
