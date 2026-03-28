export const CardSkeleton = () => (
  <div className="card p-4 space-y-4">
    <div className="h-48 bg-white/[0.03] rounded-xl animate-pulse" />
    <div className="space-y-3">
      <div className="h-4 bg-white/[0.04] rounded-lg w-3/4 animate-pulse" />
      <div className="h-3 bg-white/[0.03] rounded-lg w-full animate-pulse" />
      <div className="h-3 bg-white/[0.03] rounded-lg w-1/2 animate-pulse" />
    </div>
    <div className="flex justify-between pt-3 border-t border-white/[0.04]">
      <div className="h-6 bg-white/[0.04] rounded-lg w-20 animate-pulse" />
      <div className="h-6 bg-white/[0.03] rounded-lg w-16 animate-pulse" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-14 bg-white/[0.02] rounded-xl animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
    ))}
  </div>
);

export const StatSkeleton = () => (
  <div className="card p-6">
    <div className="flex items-center justify-between">
      <div className="space-y-3">
        <div className="h-3 bg-white/[0.04] rounded w-16 animate-pulse" />
        <div className="h-7 bg-white/[0.04] rounded-lg w-12 animate-pulse" />
      </div>
      <div className="w-12 h-12 bg-white/[0.03] rounded-xl animate-pulse" />
    </div>
  </div>
);
