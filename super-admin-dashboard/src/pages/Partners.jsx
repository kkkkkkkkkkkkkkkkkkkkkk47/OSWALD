import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiPlus, HiSearch } from 'react-icons/hi';
import api from '../lib/api';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';

export default function Partners() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-partners', search],
    queryFn: () => api.get('/admin/partners', { params: { search, limit: 100 } }).then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/admin/partners', d),
    onSuccess: () => { queryClient.invalidateQueries(['admin-partners']); setShowCreate(false); reset(); toast.success('Partner created'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const approvalMutation = useMutation({
    mutationFn: ({ id, approvalStatus }) => api.patch(`/admin/partners/${id}/approval`, { approvalStatus }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-partners']); toast.success('Updated'); },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/users/${id}/status`, { status }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-partners']); toast.success('Status updated'); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Manage Partners</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> Create Partner</button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit(d => createMutation.mutate(d))} className="glass-card p-6 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input className="input-field" placeholder="Name" {...register('name', { required: true })} />
          <input className="input-field" placeholder="Email" type="email" {...register('email', { required: true })} />
          <input className="input-field" placeholder="Password" type="password" {...register('password', { required: true })} />
          <input className="input-field" placeholder="Company Name" {...register('companyName', { required: true })} />
          <button type="submit" className="btn-primary" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating...' : 'Create'}</button>
        </form>
      )}

      <div className="relative mb-4 max-w-sm">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input type="text" placeholder="Search partners..." className="input-field pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-dark-200 dark:bg-dark-700 rounded-xl" />)}</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-sm text-dark-500 bg-dark-50 dark:bg-dark-800">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Company</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Approval</th>
                <th className="px-6 py-4 font-medium">Sales</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {data?.data?.map(p => (
                  <tr key={p._id} className="border-t border-dark-100 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-800/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-dark-900 dark:text-white">{p.name}</p>
                      <p className="text-xs text-dark-500">{p.email}</p>
                    </td>
                    <td className="px-6 py-4 text-dark-600 dark:text-dark-300">{p.profile?.companyName || '—'}</td>
                    <td className="px-6 py-4"><Badge variant={p.status}>{p.status}</Badge></td>
                    <td className="px-6 py-4"><Badge variant={p.profile?.approvalStatus || 'pending'}>{p.profile?.approvalStatus || 'pending'}</Badge></td>
                    <td className="px-6 py-4 text-sm">{p.profile?.totalSales || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <select className="text-xs bg-transparent border border-dark-200 dark:border-dark-600 rounded-lg px-2 py-1"
                          value={p.status} onChange={e => statusMutation.mutate({ id: p._id, status: e.target.value })}>
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                        </select>
                        <select className="text-xs bg-transparent border border-dark-200 dark:border-dark-600 rounded-lg px-2 py-1"
                          value={p.profile?.approvalStatus || 'pending'} onChange={e => approvalMutation.mutate({ id: p._id, approvalStatus: e.target.value })}>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="suspended">Suspended</option>
                        </select>
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
