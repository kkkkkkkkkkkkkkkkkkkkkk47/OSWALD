import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import Badge from '../components/ui/Badge';
import Breadcrumb from '../components/ui/Breadcrumb';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/LoadingSkeleton';
import { HiShoppingCart } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function Purchases() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-purchases-all'],
    queryFn: () => api.get('/purchases/my?limit=100').then(r => r.data),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Purchases' }]} />
      <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-8">Purchase History</h1>

      {isLoading ? <TableSkeleton rows={5} /> : data?.data?.length === 0 ? (
        <EmptyState icon={HiShoppingCart} title="No purchases yet" description="Start investing in expert trading portfolios."
          action={<Link to="/portfolios" className="btn-primary mt-2">Browse Portfolios</Link>} />
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="text-left text-sm text-dark-500 bg-dark-50 dark:bg-dark-800">
                <th className="px-6 py-4 font-medium">Portfolio</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr></thead>
              <tbody>
                {data?.data?.map(p => (
                  <tr key={p._id} className="border-t border-dark-100 dark:border-dark-700 hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors">
                    <td className="px-6 py-4">
                      {p.portfolio ? (
                        <Link to={`/portfolios/${p.portfolio.slug}`} className="font-medium text-dark-900 dark:text-white hover:text-primary-600">{p.portfolio.title}</Link>
                      ) : <span className="text-dark-400">Deleted portfolio</span>}
                    </td>
                    <td className="px-6 py-4 font-semibold text-dark-900 dark:text-white">${p.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4"><Badge variant={p.paymentStatus}>{p.paymentStatus}</Badge></td>
                    <td className="px-6 py-4 text-sm text-dark-500 font-mono">{p.transactionId || '—'}</td>
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
