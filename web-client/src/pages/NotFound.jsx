import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state" style={{paddingTop: '120px'}}>
      <div className="empty-state-icon" style={{fontSize: '64px'}}>🔍</div>
      <div className="empty-state-text text-base mb-2">页面不存在</div>
      <div className="text-gray-400 text-sm mb-6">你要找的页面不存在或已被移除</div>
      <Link to="/" className="btn btn-primary">返回首页</Link>
    </div>
  );
}
