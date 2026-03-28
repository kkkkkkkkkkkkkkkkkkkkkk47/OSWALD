import { useQuery } from '@tanstack/react-query';
import { HiCollection, HiCurrencyDollar, HiShoppingCart, HiEye } from 'react-icons/hi';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['partner-dashboard'],
    queryFn: () => api.get('/partner/dashboard').then(r => r.data.data),
  });

  if (isLoading) return (
    <div className="space-y-6">
      <div className="h-20 bg-white/[0.02] rounded-2xl animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card p-6 h-24 animate-pulse" />)}</div>
    </div>
  );

  const stats = [
    { label: 'Portfolios', value: data?.stats?.totalPortfolios, icon: HiCollection, color: 'from-emerald-400 to-emerald-500' },
    { label: 'Published', value: data?.stats?.publishedPortfolios, icon: HiEye, color: 'from-cyan-400 to-cyan-500' },
    { label: 'Sales', value: data?.stats?.totalSales, icon: HiShoppingCart, color: 'from-violet-400 to-violet-500' },
    { label: 'Revenue', value: `$${(data?.stats?.totalRevenue || 0).toLocaleString()}`, icon: HiCurrencyDollar, color: 'from-amber-400 to-amber-500' },
  ];

  return (
    <div>
      <div className="anim-fade-up mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-gray-500 mt-1 text-sm">Here's how your portfolios are performing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`anim-fade-up d${i + 1} card p-5 hover:border-white/[0.08] transition-all duration-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center opacity-80`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="anim-fade-up d5 card p-6">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Recent Sales</h2>
        {data?.recentSales?.length === 0 ? (
          <div className="text-center py-12">
            <HiShoppingCart className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No sales yet. Publish portfolios to start selling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-[11px] uppercase tracking-wider text-gray-500 border-b border-white/[0.04]">
                <th className="pb-3 font-semibold">Buyer</th><th className="pb-3 font-semibold">Portfolio</th><th className="pb-3 font-semibold">Amount</th><th className="pb-3 font-semibold">Date</th>
              </tr></thead>
              <tbody>
                {data?.recentSales?.map(s => (
                  <tr key={s._id} className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 text-sm text-white font-medium">{s.user?.name}</td>
                    <td className="py-3.5 text-sm text-gray-400">{s.portfolio?.title}</td>
                    <td className="py-3.5 text-sm font-semibold text-white">${s.amount?.toLocaleString()}</td>
                    <td className="py-3.5 text-sm text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
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
