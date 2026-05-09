import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories';

const EMOJIS = ['🍔', '🚌', '🛍️', '🎮', '🏠', '💡', '🏥', '📚', '💸', '💰', '💻', '📈', '🎁', '💵', '🐾', '✈️', '📱', '🏋️', '🎬', '☕'];
const COLORS = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6', '#6B7280', '#F59E0B'];

export default function Categories() {
  const [tab, setTab] = useState('expense');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('expense');
  const [formIcon, setFormIcon] = useState('📦');
  const [formColor, setFormColor] = useState('#6B7280');

  const { data } = useCategories(tab);
  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();

  const categories = data?.data || [];

  const openEdit = (cat) => {
    setEditing(cat);
    setFormName(cat.name);
    setFormType(cat.type);
    setFormIcon(cat.icon);
    setFormColor(cat.color);
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setFormName('');
    setFormType(tab);
    setFormIcon('📦');
    setFormColor('#6B7280');
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formName.trim()) return alert('请输入分类名称');
    const data = { name: formName.trim(), type: formType, icon: formIcon, color: formColor };
    const onSuccess = () => setShowForm(false);
    const onError = (err) => alert(err.response?.data?.error || '操作失败');
    if (editing) {
      updateCat.mutate({ id: editing.id, data }, { onSuccess, onError });
    } else {
      createCat.mutate(data, { onSuccess, onError });
    }
  };

  const handleDelete = (cat) => {
    if (cat.is_default) return alert('默认分类不可删除');
    if (confirm(`确定删除「${cat.name}」？`)) deleteCat.mutate(cat.id);
  };

  return (
    <div>
      <h2 className="page-title">分类管理</h2>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('expense')} className={`filter-pill ${tab === 'expense' ? 'filter-pill-active' : ''}`}>
          支出分类
        </button>
        <button onClick={() => setTab('income')} className={`filter-pill ${tab === 'income' ? 'filter-pill-active' : ''}`}>
          收入分类
        </button>
        <button onClick={openNew} className="btn btn-primary ml-auto">+ 新增</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map(c => (
          <div key={c.id} className="card flex items-center gap-3 group" style={{padding: '14px 16px'}}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: c.color + '18' }}>
              {c.icon}
            </div>
            <span className="flex-1 font-semibold text-sm">{c.name}</span>
            {c.is_default && <span className="text-[10px] text-gray-300 bg-gray-100 px-2 py-0.5 rounded font-medium">默认</span>}
            <button onClick={() => openEdit(c)} className="text-gray-300 hover:text-primary opacity-0 group-hover:opacity-100 transition-all text-sm">✎</button>
            {!c.is_default && (
              <button onClick={() => handleDelete(c)} className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm">✕</button>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-5">{editing ? '编辑分类' : '新增分类'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              {!editing && (
                <div className="type-toggle">
                  <button type="button" onClick={() => setFormType('expense')}
                    className={`type-toggle-btn ${formType === 'expense' ? 'active-expense' : ''}`}>支出</button>
                  <button type="button" onClick={() => setFormType('income')}
                    className={`type-toggle-btn ${formType === 'income' ? 'active-income' : ''}`}>收入</button>
                </div>
              )}
              <input value={formName} onChange={e => setFormName(e.target.value)}
                placeholder="分类名称" maxLength={30} autoFocus />
              <div>
                <div className="text-sm text-gray-400 mb-2 font-medium">图标</div>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJIS.map(em => (
                    <button key={em} type="button" onClick={() => setFormIcon(em)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-lg transition-all ${em === formIcon ? 'bg-indigo-50 ring-2 ring-primary scale-110' : 'hover:bg-gray-100'}`}>{em}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-2 font-medium">颜色</div>
                <div className="flex gap-2.5">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setFormColor(c)}
                      className={`w-9 h-9 rounded-full transition-all ${c === formColor ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn btn-primary flex-1">保存</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost flex-1">取消</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
