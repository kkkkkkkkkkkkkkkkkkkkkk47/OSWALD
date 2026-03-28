import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import PortfolioCard from '../components/portfolio/PortfolioCard';
import { CardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import Breadcrumb from '../components/ui/Breadcrumb';
import { HiHeart } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function Favorites() {
  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['my-favorites'],
    queryFn: () => api.get('/favorites/my').then(r => r.data.data.portfolios),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Favorites' }]} />
      <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-8">My Favorites</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : portfolios?.length === 0 ? (
        <EmptyState icon={HiHeart} title="No favorites yet" description="Save portfolios you're interested in for quick access."
          action={<Link to="/portfolios" className="btn-primary mt-2">Browse Portfolios</Link>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{portfolios?.map(p => <PortfolioCard key={p._id} portfolio={p} />)}</div>
      )}
    </div>
  );
}
