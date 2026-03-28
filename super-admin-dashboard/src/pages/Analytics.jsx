import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import api from '../lib/api';

const COLORS = ['#a855f7', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899'];

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get('/admin/analytics').then(r => r.data.data),
  });

  if (isLoading) return <div className="animate-pulse space-y-6"><div className="h-80 bg-dark-200 dark:bg-dark-700 rounded-2xl" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Platform Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Revenue (Last 30 Days)</h2>
          {data?.purchasesOverTime?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.purchasesOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-center py-12">No data yet</p>}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Top Selling Portfolios</h2>
          {data?.topPortfolios?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topPortfolios.slice(0, 6)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis dataKey="title" type="category" tick={{ fontSize: 10 }} width={120} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="totalPurchases" fill="#a855f7" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-center py-12">No data yet</p>}
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Partner Performance</h2>
          {data?.partnerPerformance?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data.partnerPerformance} dataKey="totalRevenue" nameKey="partnerName" cx="50%" cy="50%" outerRadius={80} label={({ partnerName, percent }) => `${partnerName} (${(percent * 100).toFixed(0)}%)`}>
                    {data.partnerPerformance.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {data.partnerPerformance.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-dark-100 dark:border-dark-700 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm text-dark-900 dark:text-white">{p.partnerName}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-dark-900 dark:text-white">${p.totalRevenue?.toLocaleString()}</p>
                      <p className="text-xs text-dark-500">{p.totalSales} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-dark-500 text-center py-12">No data yet</p>}
        </div>
      </div>
    </div>
  );
}
