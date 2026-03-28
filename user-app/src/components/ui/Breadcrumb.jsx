import { Link } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-dark-500 dark:text-dark-400 mb-6" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          {i > 0 && <HiChevronRight className="w-4 h-4 mx-1" />}
          {item.href ? (
            <Link to={item.href} className="hover:text-primary-600 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-dark-900 dark:text-white font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
