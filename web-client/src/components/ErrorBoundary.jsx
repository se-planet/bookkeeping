import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-state" style={{ paddingTop: '80px' }}>
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-text" style={{ marginBottom: '8px', fontWeight: 600, color: 'var(--text)' }}>
            页面出错了
          </div>
          <div className="empty-state-text" style={{ marginBottom: '24px' }}>
            {process.env.NODE_ENV === 'development' ? this.state.error?.message : '请尝试刷新页面'}
          </div>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            className="btn btn-primary"
          >
            返回首页
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
