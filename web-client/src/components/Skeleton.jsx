export default function Skeleton({ lines = 3 }) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
