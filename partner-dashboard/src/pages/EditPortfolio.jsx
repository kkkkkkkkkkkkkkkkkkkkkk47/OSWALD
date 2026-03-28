import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function EditPortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const { data: portfolio } = useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => api.get(`/portfolios/my`).then(r => r.data.data.find(p => p._id === id)),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.data.categories),
  });

  useEffect(() => {
    if (portfolio) reset({ ...portfolio, tags: portfolio.tags?.join(', '), category: portfolio.category?._id || portfolio.category });
  }, [portfolio, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => { if (val !== undefined && val !== null) formData.append(key, val); });
      if (data.tags) formData.set('tags', data.tags.split(',').map(t => t.trim()).filter(Boolean));
      if (thumbnail) formData.append('thumbnail', thumbnail);

      await api.put(`/portfolios/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Portfolio updated!');
      navigate('/portfolios');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  if (!portfolio) return <div className="animate-pulse"><div className="h-96 bg-dark-200 dark:bg-dark-700 rounded-2xl" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Edit Portfolio</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Title</label>
            <input className="input-field" {...register('title')} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Short Description</label>
            <input className="input-field" {...register('shortDescription')} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Full Description</label>
            <textarea rows={5} className="input-field" {...register('fullDescription')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Price ($)</label>
            <input type="number" step="0.01" className="input-field" {...register('price')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Strategy Type</label>
            <select className="input-field" {...register('strategyType')}>
              {['momentum', 'value', 'growth', 'income', 'balanced', 'aggressive', 'conservative', 'quantitative', 'swing', 'day-trading'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Market Type</label>
            <select className="input-field" {...register('marketType')}>
              {['stocks', 'crypto', 'forex', 'commodities', 'bonds', 'mixed'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Risk Level</label>
            <select className="input-field" {...register('riskLevel')}>
              {['low', 'medium', 'high', 'very-high'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Category</label>
            <select className="input-field" {...register('category')}>
              <option value="">Select...</option>
              {categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Estimated Return</label>
            <input className="input-field" {...register('estimatedReturn')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Duration</label>
            <input className="input-field" {...register('duration')} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Tags</label>
            <input className="input-field" {...register('tags')} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">New Thumbnail</label>
            <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} className="input-field" />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/portfolios')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </div>
  );
}
