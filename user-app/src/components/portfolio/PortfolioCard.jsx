import { Link } from 'react-router-dom';
import { HiTrendingUp, HiStar, HiArrowRight } from 'react-icons/hi';
import Badge from '../ui/Badge';

export default function PortfolioCard({ portfolio }) {
  const { title, slug, thumbnail, shortDescription, price, riskLevel, strategyType, estimatedReturn, partner, featured, category } = portfolio;

  return (
    <Link to={`/portfolios/${slug}`} className="group card-hover overflow-hidden flex flex-col">
      <div className="relative h-48 bg-gradient-to-br from-cyan-500/10 via-surface-900 to-violet-500/10 overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiTrendingUp className="w-12 h-12 text-gray-700 group-hover:text-cyan-500/50 transition-colors duration-500" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-transparent to-transparent" />
        {featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-500/90 text-gray-900 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            <HiStar className="w-3 h-3" /> Featured
          </div>
        )}
        <div className="absolute top-3 right-3"><Badge variant={riskLevel}>{riskLevel}</Badge></div>
        <div className="absolute bottom-3 right-3 w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <HiArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2.5">
          {category && <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">{category.name}</span>}
          <span className="text-gray-700">·</span>
          <span className="text-[11px] text-gray-500 capitalize">{strategyType}</span>
        </div>
        <h3 className="font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-1">{shortDescription}</p>
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <span className="text-xl font-bold text-white">${price?.toLocaleString()}</span>
          {estimatedReturn && (
            <div className="text-right">
              <span className="text-[10px] text-gray-600 uppercase tracking-wider">Return</span>
              <p className="text-sm font-semibold text-emerald-400">{estimatedReturn}</p>
            </div>
          )}
        </div>
        {partner && <p className="text-xs text-gray-600 mt-3">by {partner.name}</p>}
      </div>
    </Link>
  );
}
