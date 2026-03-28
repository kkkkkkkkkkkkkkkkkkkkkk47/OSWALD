import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiShoppingCart, HiHeart, HiTrendingUp, HiArrowRight, HiSparkles } from 'react-icons/hi';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { StatSkeleton } from '../components/ui/LoadingSkeleton';
import Badge from '../components/ui/Badge';

export default function Dashboard() {
  const { user } = useAuth();

  const { data: purchases, isLoading: loadingPurchases } = useQuery({
    queryKey: ['my-purchases'],
    queryFn: () => api.get('/purchases/my?limit=5').then(r => r.data),
  });

  const { data: favorites, isLoading: loadingFavs } = useQuery({
    queryKey: ['my-favorites'],
    queryFn: () => api.get('/favorites/my').then(r => r.data.data.portfolios),
  });

  const totalSpent = purchases?.data?.reduce((sum, p) => sum + p.amount, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome banner */}
      <div className="animate-fade-in-up glass-card p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <HiSparkles className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Dashboard</span>
          </div>
          <h1 className="text-3xl font-extrabold text-dark-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-dark-500 dark:text-dark-400 mt-1">Here's your portfolio overview</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {loadingPurchases ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />) : (
          [
            { label: 'Purchased', value: purchases?.pagination?.total || 0, icon: HiShoppingCart, gradient: 'from-primary-500 to-primary-600', shadow: 'shadow-primary-500/20' },
            { label: 'Total Invested', value: `$${totalSpent.toLocaleString()}`, icon: HiTrendingUp, gradient: 'from-accent-500 to-accent-600', shadow: 'shadow-accent-500/20' },
            { label: 'Favorites', value: favorites?.length || 0, icon: HiHeart, gradient: 'from-rose-500 to-rose-600', shadow: 'shadow-rose-500/20' },
          ].map((s, i) => (
            <div key={i} className={`animate-fade-in-up stagger-${i + 1} glass-card p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-500 dark:text-dark-400 font-medium">{s.label}</p>
                  <p className="text-3xl font-extrabold text-dark-900 dark:text-white mt-1">{s.value}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${s.gradient} rounded-2xl flex items-center justify-center shadow-lg ${s.shadow}`}>
                  <s.icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Purchases */}
      <div className="animate-fade-in-up stagger-4 glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-dark-900 dark:text-white">Recent Purchases</h2>
          <Link to="/purchases" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-medium group">
            View all <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        {purchases?.data?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dark-100 dark:bg-dark-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <HiShoppingCart className="w-8 h-8 text-dark-400" />
            </div>
            <p className="text-dark-500 mb-3">No purchases yet</p>
            <Link to="/portfolios" className="btn-primary text-sm py-2 px-5">Browse Portfolios</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-xs uppercase tracking-wider text-dark-400 border-b border-dark-200 dark:border-dark-700">
                <th className="pb-3 font-semibold">Portfolio</th><th className="pb-3 font-semibold">Amount</th><th className="pb-3 font-semibold">Status</th><th className="pb-3 font-semibold">Date</th>
              </tr></thead>
              <tbody>
                {purchases?.data?.map((p, i) => (
                  <tr key={p._id} className={`border-b border-dark-100 dark:border-dark-800 last:border-0 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors animate-fade-in stagger-${i + 1}`}>
                    <td className="py-4 font-semibold text-dark-900 dark:text-white">{p.portfolio?.title || 'N/A'}</td>
                    <td className="py-4 text-dark-700 dark:text-dark-300 font-medium">${p.amount?.toLocaleString()}</td>
                    <td className="py-4"><Badge variant={p.paymentStatus}>{p.paymentStatus}</Badge></td>
                    <td className="py-4 text-dark-500 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
