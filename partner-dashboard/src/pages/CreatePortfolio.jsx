import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.data.categories),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => { if (val) formData.append(key, val); });
      if (data.tags) formData.set('tags', data.tags.split(',').map(t => t.trim()).filter(Boolean));
      if (thumbnail) formData.append('thumbnail', thumbnail);

      await api.post('/portfolios', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Portfolio created!');
      navigate('/portfolios');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">Create Portfolio</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Title *</label>
            <input className="input-field" {...register('title', { required: 'Required' })} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Short Description *</label>
            <input className="input-field" maxLength={300} {...register('shortDescription', { required: 'Required' })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Full Description *</label>
            <textarea rows={5} className="input-field" {...register('fullDescription', { required: 'Required' })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Price ($) *</label>
            <input type="number" step="0.01" className="input-field" {...register('price', { required: 'Required', min: 0 })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Strategy Type *</label>
            <select className="input-field" {...register('strategyType', { required: 'Required' })}>
              <option value="">Select...</option>
              {['momentum', 'value', 'growth', 'income', 'balanced', 'aggressive', 'conservative', 'quantitative', 'swing', 'day-trading'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Market Type *</label>
            <select className="input-field" {...register('marketType', { required: 'Required' })}>
              <option value="">Select...</option>
              {['stocks', 'crypto', 'forex', 'commodities', 'bonds', 'mixed'].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Risk Level *</label>
            <select className="input-field" {...register('riskLevel', { required: 'Required' })}>
              <option value="">Select...</option>
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
            <input className="input-field" placeholder="e.g. 15-20% annually" {...register('estimatedReturn')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Duration</label>
            <input className="input-field" placeholder="e.g. 12 months" {...register('duration')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Min Buy Amount</label>
            <input type="number" className="input-field" {...register('minimumBuyAmount')} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Tags (comma separated)</label>
            <input className="input-field" placeholder="momentum, AI, equities" {...register('tags')} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Thumbnail</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="input-field" />
            {preview && <img src={preview} alt="Preview" className="mt-2 h-32 rounded-xl object-cover" />}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/portfolios')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">{loading ? 'Creating...' : 'Create Portfolio'}</button>
        </div>
      </form>
    </div>
  );
}
