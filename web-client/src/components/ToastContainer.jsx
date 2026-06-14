const ICONS = { success: '✓', error: '✕', info: 'ℹ' };

export default function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => onDismiss(t.id)}>
          <span className="text-base">{ICONS[t.type] || ICONS.info}</span>
          <span className="flex-1">{t.message}</span>
        </div>
      ))}
    </div>
  );
}
