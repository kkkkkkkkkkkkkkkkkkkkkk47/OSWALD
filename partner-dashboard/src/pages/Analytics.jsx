import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import api from '../lib/api';

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['partner-analytics'],
    queryFn: () => api.get('/partner/analytics').then(r => r.data.data),
  });

  if (isLoading) return <div className="animate-pulse space-y-6"><div className="h-80 bg-dark-200 dark:bg-dark-700 rounded-2xl" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Sales Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Revenue (Last 30 Days)</h2>
          {data?.salesOverTime?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.salesOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="_id" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-center py-12">No data yet</p>}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">Top Portfolios</h2>
          {data?.topPortfolios?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topPortfolios}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="title" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="totalPurchases" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-center py-12">No data yet</p>}
        </div>
      </div>
    </div>
  );
}
