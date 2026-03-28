import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiSearch, HiAdjustments } from 'react-icons/hi';
import api from '../lib/api';
import PortfolioCard from '../components/portfolio/PortfolioCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import Breadcrumb from '../components/ui/Breadcrumb';

export default function Portfolios() {
  const [filters, setFilters] = useState({ search: '', riskLevel: '', category: '', sort: 'newest', page: 1 });
  const [showFilters, setShowFilters] = useState(false);

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.data.categories),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['portfolios', filters],
    queryFn: () => api.get('/portfolios', { params: { ...filters, limit: 12 } }).then(r => r.data),
  });

  const updateFilter = (key, value) => setFilters(f => ({ ...f, [key]: value, page: 1 }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Portfolios' }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">Trading Portfolios</h1>
          <p className="text-dark-500 dark:text-dark-400 mt-1">{data?.pagination?.total || 0} portfolios available</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-72">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input type="text" placeholder="Search portfolios..." className="input-field pl-10" value={filters.search} onChange={e => updateFilter('search', e.target.value)} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary flex items-center gap-2">
            <HiAdjustments className="w-5 h-5" /> Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="glass-card p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Risk Level</label>
            <select className="input-field" value={filters.riskLevel} onChange={e => updateFilter('riskLevel', e.target.value)}>
              <option value="">All Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very-high">Very High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Category</label>
            <select className="input-field" value={filters.category} onChange={e => updateFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {categoriesData?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Sort By</label>
            <select className="input-field" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => setFilters({ search: '', riskLevel: '', category: '', sort: 'newest', page: 1 })} className="btn-secondary w-full">Clear Filters</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : data?.data?.length === 0 ? (
        <EmptyState title="No portfolios found" description="Try adjusting your filters or search terms." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{data?.data?.map(p => <PortfolioCard key={p._id} portfolio={p} />)}</div>
          {data?.pagination?.pages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: data.pagination.pages }).map((_, i) => (
                <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                  className={`w-10 h-10 rounded-xl font-medium transition-all ${filters.page === i + 1 ? 'bg-primary-600 text-white' : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-200 dark:hover:bg-dark-700'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
