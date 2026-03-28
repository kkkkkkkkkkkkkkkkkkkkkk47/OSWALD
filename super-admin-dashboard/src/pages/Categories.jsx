import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { HiPlus, HiTrash } from 'react-icons/hi';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function Categories() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/admin/categories').then(r => r.data.data.categories),
  });

  const createMutation = useMutation({
    mutationFn: (d) => api.post('/admin/categories', d),
    onSuccess: () => { queryClient.invalidateQueries(['admin-categories']); setShowCreate(false); reset(); toast.success('Category created'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-categories']); toast.success('Deleted'); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Categories</h1>
        <button onClick={() => setShowCreate(!showCreate)} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> Add Category</button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit(d => createMutation.mutate({ ...d, slug: d.name.toLowerCase().replace(/\s+/g, '-') }))} className="glass-card p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="input-field" placeholder="Name" {...register('name', { required: true })} />
          <input className="input-field" placeholder="Description" {...register('description')} />
          <input className="input-field" placeholder="Order" type="number" {...register('order')} />
          <button type="submit" className="btn-primary">{createMutation.isPending ? 'Creating...' : 'Create'}</button>
        </form>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 bg-dark-200 dark:bg-dark-700 rounded-xl" />)}</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-sm text-dark-500 bg-dark-50 dark:bg-dark-800">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {data?.map(c => (
                  <tr key={c._id} className="border-t border-dark-100 dark:border-dark-700">
                    <td className="px-6 py-4 font-medium text-dark-900 dark:text-white">{c.name}</td>
                    <td className="px-6 py-4 text-dark-500 font-mono text-sm">{c.slug}</td>
                    <td className="px-6 py-4 text-dark-500">{c.description}</td>
                    <td className="px-6 py-4">{c.order}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => { if (confirm('Delete?')) deleteMutation.mutate(c._id); }} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                        <HiTrash className="w-4 h-4" />
                      </button>
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
