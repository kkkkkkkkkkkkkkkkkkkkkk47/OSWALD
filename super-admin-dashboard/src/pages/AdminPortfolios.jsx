import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiStar, HiOutlineStar } from 'react-icons/hi';
import api from '../lib/api';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';

export default function AdminPortfolios() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-portfolios'],
    queryFn: () => api.get('/portfolios/admin/all?limit=100').then(r => r.data),
  });

  const featuredMutation = useMutation({
    mutationFn: (id) => api.patch(`/portfolios/admin/${id}/featured`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-portfolios']); toast.success('Updated'); },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/portfolios/admin/${id}/status`, { status }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-portfolios']); toast.success('Status updated'); },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">All Portfolios</h1>
      {isLoading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-dark-200 dark:bg-dark-700 rounded-xl" />)}</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-sm text-dark-500 bg-dark-50 dark:bg-dark-800">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Partner</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Sales</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {data?.data?.map(p => (
                  <tr key={p._id} className="border-t border-dark-100 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-800/50">
                    <td className="px-6 py-4 font-medium text-dark-900 dark:text-white">{p.title}</td>
                    <td className="px-6 py-4 text-dark-500">{p.partner?.name}</td>
                    <td className="px-6 py-4">${p.price?.toLocaleString()}</td>
                    <td className="px-6 py-4"><Badge variant={p.status}>{p.status}</Badge></td>
                    <td className="px-6 py-4">{p.totalPurchases}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => featuredMutation.mutate(p._id)} className="p-1 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg" aria-label="Toggle featured">
                        {p.featured ? <HiStar className="w-5 h-5 text-yellow-500" /> : <HiOutlineStar className="w-5 h-5 text-dark-400" />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <select className="text-xs bg-transparent border border-dark-200 dark:border-dark-600 rounded-lg px-2 py-1"
                        value={p.status} onChange={e => statusMutation.mutate({ id: p._id, status: e.target.value })}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
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
