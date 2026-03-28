import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiTrendingUp, HiClock, HiCurrencyDollar, HiShieldCheck, HiHeart, HiOutlineHeart, HiChartBar } from 'react-icons/hi';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/ui/Breadcrumb';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export default function PortfolioDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showBuyModal, setShowBuyModal] = useState(false);

  const { data: portfolio, isLoading } = useQuery({
    queryKey: ['portfolio', slug],
    queryFn: () => api.get(`/portfolios/slug/${slug}`).then(r => r.data.data.portfolio),
  });

  const { data: purchaseCheck } = useQuery({
    queryKey: ['purchase-check', portfolio?._id],
    queryFn: () => api.get(`/purchases/check/${portfolio._id}`).then(r => r.data.data),
    enabled: !!user && !!portfolio,
  });

  const { data: favCheck } = useQuery({
    queryKey: ['fav-check', portfolio?._id],
    queryFn: () => api.get(`/favorites/check/${portfolio._id}`).then(r => r.data.data),
    enabled: !!user && !!portfolio,
  });

  const buyMutation = useMutation({
    mutationFn: () => api.post('/purchases', { portfolioId: portfolio._id }),
    onSuccess: () => {
      toast.success('Purchase successful!');
      setShowBuyModal(false);
      queryClient.invalidateQueries(['purchase-check', portfolio._id]);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Purchase failed'),
  });

  const favMutation = useMutation({
    mutationFn: () => api.post('/favorites/toggle', { portfolioId: portfolio._id }),
    onSuccess: () => queryClient.invalidateQueries(['fav-check', portfolio._id]),
  });

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-64 bg-dark-200 dark:bg-dark-700 rounded-2xl" />
        <div className="h-8 bg-dark-200 dark:bg-dark-700 rounded w-1/2" />
        <div className="h-4 bg-dark-200 dark:bg-dark-700 rounded w-full" />
      </div>
    </div>
  );

  if (!portfolio) return <div className="text-center py-20 text-dark-500">Portfolio not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Portfolios', href: '/portfolios' }, { label: portfolio.title }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl overflow-hidden">
            {portfolio.banner || portfolio.thumbnail ? (
              <img src={portfolio.banner || portfolio.thumbnail} alt={portfolio.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><HiTrendingUp className="w-24 h-24 text-primary-300" /></div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge variant={portfolio.riskLevel}>{portfolio.riskLevel} risk</Badge>
              <Badge variant={portfolio.status}>{portfolio.status}</Badge>
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                {portfolio.category && <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">{portfolio.category.name}</span>}
                <h1 className="text-3xl font-bold text-dark-900 dark:text-white mt-1">{portfolio.title}</h1>
                <p className="text-dark-500 dark:text-dark-400 mt-1">by {portfolio.partner?.name}</p>
              </div>
              {user && (
                <button onClick={() => favMutation.mutate()} className="p-2 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors" aria-label="Toggle favorite">
                  {favCheck?.favorited ? <HiHeart className="w-6 h-6 text-red-500" /> : <HiOutlineHeart className="w-6 h-6 text-dark-400" />}
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-3">About This Portfolio</h2>
            <p className="text-dark-600 dark:text-dark-300 leading-relaxed whitespace-pre-line">{portfolio.fullDescription}</p>
          </div>

          {/* Performance */}
          {portfolio.historicalPerformance?.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center gap-2"><HiChartBar className="w-5 h-5" /> Historical Performance</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolio.historicalPerformance.map((p, i) => (
                  <div key={i} className="bg-dark-50 dark:bg-dark-800 rounded-xl p-4 text-center">
                    <p className="text-sm text-dark-500 mb-1">{p.period}</p>
                    <p className={`text-2xl font-bold ${p.returnPercent >= 0 ? 'text-accent-600' : 'text-red-500'}`}>{p.returnPercent >= 0 ? '+' : ''}{p.returnPercent}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {portfolio.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {portfolio.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400 rounded-full text-sm">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 sticky top-24">
            <div className="text-center mb-6">
              <p className="text-sm text-dark-500 mb-1">Portfolio Price</p>
              <p className="text-4xl font-bold text-dark-900 dark:text-white">${portfolio.price?.toLocaleString()}</p>
            </div>

            {purchaseCheck?.purchased ? (
              <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl p-4 text-center">
                <HiShieldCheck className="w-8 h-8 text-accent-600 mx-auto mb-2" />
                <p className="font-semibold text-accent-700 dark:text-accent-400">You own this portfolio</p>
              </div>
            ) : user ? (
              <button onClick={() => setShowBuyModal(true)} className="btn-primary w-full text-lg py-3">Buy Portfolio</button>
            ) : (
              <button onClick={() => navigate('/login')} className="btn-primary w-full">Login to Purchase</button>
            )}

            <div className="mt-6 space-y-4">
              {[
                { icon: HiTrendingUp, label: 'Strategy', value: portfolio.strategyType },
                { icon: HiShieldCheck, label: 'Market', value: portfolio.marketType },
                { icon: HiCurrencyDollar, label: 'Est. Return', value: portfolio.estimatedReturn || 'N/A' },
                { icon: HiClock, label: 'Duration', value: portfolio.duration || 'N/A' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-dark-100 dark:border-dark-700 last:border-0">
                  <div className="flex items-center gap-2 text-dark-500 dark:text-dark-400">
                    <item.icon className="w-4 h-4" /> <span className="text-sm">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-dark-900 dark:text-white capitalize">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-dark-400">
              {portfolio.totalPurchases} purchases
            </div>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <Modal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} title="Confirm Purchase">
        <div className="space-y-4">
          <div className="bg-dark-50 dark:bg-dark-800 rounded-xl p-4">
            <p className="font-medium text-dark-900 dark:text-white">{portfolio.title}</p>
            <p className="text-2xl font-bold text-dark-900 dark:text-white mt-2">${portfolio.price?.toLocaleString()}</p>
          </div>
          <p className="text-sm text-dark-500">This is a mock payment. In production, you would be redirected to a payment gateway.</p>
          <div className="flex gap-3">
            <button onClick={() => setShowBuyModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={() => buyMutation.mutate()} disabled={buyMutation.isPending} className="btn-primary flex-1 disabled:opacity-50">
              {buyMutation.isPending ? 'Processing...' : 'Confirm Purchase'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
