import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiPlus, HiSearch } from 'react-icons/hi';
import api from '../lib/api';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';

export default function Users() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => api.get('/admin/users', { params: { search, limit: 100 } }).then(r => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/admin/users', d),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); setShowCreate(false); reset(); toast.success('User created'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/users/${id}/status`, { status }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-users']); toast.success('Status updated'); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Manage Users</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> Create User</button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit(d => createMutation.mutate(d))} className="glass-card p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="input-field" placeholder="Name" {...register('name', { required: true })} />
          <input className="input-field" placeholder="Email" type="email" {...register('email', { required: true })} />
          <input className="input-field" placeholder="Password" type="password" {...register('password', { required: true })} />
          <button type="submit" className="btn-primary" disabled={createMutation.isPending}>{createMutation.isPending ? 'Creating...' : 'Create'}</button>
        </form>
      )}

      <div className="relative mb-4 max-w-sm">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input type="text" placeholder="Search users..." className="input-field pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-dark-200 dark:bg-dark-700 rounded-xl" />)}</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-sm text-dark-500 bg-dark-50 dark:bg-dark-800">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {data?.data?.map(u => (
                  <tr key={u._id} className="border-t border-dark-100 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-800/50">
                    <td className="px-6 py-4 font-medium text-dark-900 dark:text-white">{u.name}</td>
                    <td className="px-6 py-4 text-dark-500">{u.email}</td>
                    <td className="px-6 py-4"><Badge variant={u.status}>{u.status}</Badge></td>
                    <td className="px-6 py-4 text-sm text-dark-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <select className="text-sm bg-transparent border border-dark-200 dark:border-dark-600 rounded-lg px-2 py-1"
                        value={u.status} onChange={e => statusMutation.mutate({ id: u._id, status: e.target.value })}>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
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
