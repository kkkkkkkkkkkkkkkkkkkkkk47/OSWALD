import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiPencil, HiTrash, HiEye, HiEyeOff, HiPlus } from 'react-icons/hi';
import api from '../lib/api';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';

export default function Portfolios() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['my-portfolios'],
    queryFn: () => api.get('/portfolios/my?limit=100').then(r => r.data),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => api.patch(`/portfolios/${id}/toggle-publish`),
    onSuccess: () => { queryClient.invalidateQueries(['my-portfolios']); toast.success('Status updated'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/portfolios/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['my-portfolios']); toast.success('Portfolio deleted'); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">My Portfolios</h1>
        <Link to="/portfolios/create" className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> Create</Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-dark-200 dark:bg-dark-700 rounded-xl" />)}</div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <p className="text-dark-500 mb-4">No portfolios yet</p>
          <Link to="/portfolios/create" className="btn-primary">Create Your First Portfolio</Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-sm text-dark-500 bg-dark-50 dark:bg-dark-800">
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Sales</th>
                <th className="px-6 py-4 font-medium">Revenue</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {data?.data?.map(p => (
                  <tr key={p._id} className="border-t border-dark-100 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-800/50">
                    <td className="px-6 py-4 font-medium text-dark-900 dark:text-white">{p.title}</td>
                    <td className="px-6 py-4">${p.price?.toLocaleString()}</td>
                    <td className="px-6 py-4"><Badge variant={p.status}>{p.status}</Badge></td>
                    <td className="px-6 py-4">{p.totalPurchases}</td>
                    <td className="px-6 py-4 font-semibold">${p.totalRevenue?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleMutation.mutate(p._id)} className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700" title={p.status === 'published' ? 'Unpublish' : 'Publish'}>
                          {p.status === 'published' ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                        </button>
                        <Link to={`/portfolios/edit/${p._id}`} className="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700"><HiPencil className="w-4 h-4" /></Link>
                        <button onClick={() => { if (confirm('Delete this portfolio?')) deleteMutation.mutate(p._id); }} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"><HiTrash className="w-4 h-4" /></button>
                      </div>
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
