import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import Badge from '../components/Badge';

export default function Purchases() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-purchases'],
    queryFn: () => api.get('/purchases/admin/all?limit=100').then(r => r.data),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">All Purchases</h1>
      {isLoading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-dark-200 dark:bg-dark-700 rounded-xl" />)}</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-sm text-dark-500 bg-dark-50 dark:bg-dark-800">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Portfolio</th>
                <th className="px-6 py-4 font-medium">Partner</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr></thead>
              <tbody>
                {data?.data?.map(p => (
                  <tr key={p._id} className="border-t border-dark-100 dark:border-dark-700">
                    <td className="px-6 py-4 text-dark-900 dark:text-white">{p.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-dark-600 dark:text-dark-300">{p.portfolio?.title || 'N/A'}</td>
                    <td className="px-6 py-4 text-dark-500">{p.partner?.name || 'N/A'}</td>
                    <td className="px-6 py-4 font-semibold">${p.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4"><Badge variant={p.paymentStatus}>{p.paymentStatus}</Badge></td>
                    <td className="px-6 py-4 text-sm text-dark-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
