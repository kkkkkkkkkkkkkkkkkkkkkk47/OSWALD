const variants = {
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'very-high': 'bg-red-500/10 text-red-400 border-red-500/20',
  published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  draft: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  archived: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  refunded: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Badge({ variant = 'draft', children }) {
  return <span className={`badge border ${variants[variant] || variants.draft}`}>{children || variant}</span>;
}
