import { useQuery } from '@tanstack/react-query';
import { HiUsers, HiBriefcase, HiCollection, HiShoppingCart, HiCurrencyDollar } from 'react-icons/hi';
import api from '../lib/api';
import Badge from '../components/Badge';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then(r => r.data.data),
  });

  if (isLoading) return (
    <div className="space-y-6">
      <div className="h-24 bg-white/[0.02] rounded-2xl animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="card p-6 h-24 animate-pulse" />)}</div>
    </div>
  );

  const stats = [
    { label: 'Users', value: data?.stats?.totalUsers, icon: HiUsers, color: 'from-blue-400 to-blue-500', border: 'border-blue-500/20', text: 'text-blue-400' },
    { label: 'Partners', value: data?.stats?.totalPartners, icon: HiBriefcase, color: 'from-violet-400 to-violet-500', border: 'border-violet-500/20', text: 'text-violet-400' },
    { label: 'Portfolios', value: data?.stats?.totalPortfolios, icon: HiCollection, color: 'from-cyan-400 to-cyan-500', border: 'border-cyan-500/20', text: 'text-cyan-400' },
    { label: 'Purchases', value: data?.stats?.totalPurchases, icon: HiShoppingCart, color: 'from-amber-400 to-amber-500', border: 'border-amber-500/20', text: 'text-amber-400' },
    { label: 'Revenue', value: `$${(data?.stats?.totalRevenue || 0).toLocaleString()}`, icon: HiCurrencyDollar, color: 'from-emerald-400 to-emerald-500', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  ];

  return (
    <div>
      <div className="anim-fade-up mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-gray-500 mt-1 text-sm">Monitor and manage the Osvald ecosystem</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`anim-fade-up d${i + 1} card p-5 hover:${s.border} transition-all duration-500`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="anim-fade-up d3 card p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Recent Users</h2>
          {data?.recentUsers?.length === 0 ? (
            <p className="text-gray-600 text-center py-8 text-sm">No users yet</p>
          ) : (
            <div className="space-y-1">
              {data?.recentUsers?.map(u => (
                <div key={u._id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{u.name?.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-[11px] text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <Badge variant={u.status}>{u.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="anim-fade-up d4 card p-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Recent Purchases</h2>
          {data?.recentPurchases?.length === 0 ? (
            <p className="text-gray-600 text-center py-8 text-sm">No purchases yet</p>
          ) : (
            <div className="space-y-1">
              {data?.recentPurchases?.map(p => (
                <div key={p._id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">{p.portfolio?.title || 'N/A'}</p>
                    <p className="text-[11px] text-gray-500">by {p.user?.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-white bg-white/[0.04] px-3 py-1 rounded-lg">${p.portfolio?.price?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
