import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-extrabold text-xs">O</span>
              </div>
              <span className="text-lg font-bold text-white">Osvald</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">Professional trading portfolio management for modern investors.</p>
          </div>
          {[
            { title: 'Platform', links: [{ label: 'Portfolios', to: '/portfolios' }, { label: 'Get Started', to: '/register' }] },
            { title: 'Company', links: [{ label: 'About' }, { label: 'Contact' }, { label: 'Careers' }] },
            { title: 'Legal', links: [{ label: 'Privacy' }, { label: 'Terms' }, { label: 'Risk Disclosure' }] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-4">{col.title}</h4>
              <div className="space-y-3">
                {col.links.map((link, j) => link.to ? (
                  <Link key={j} to={link.to} className="block text-sm text-gray-500 hover:text-cyan-400 transition-colors duration-300">{link.label}</Link>
                ) : (
                  <span key={j} className="block text-sm text-gray-600 cursor-default">{link.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.04] mt-12 pt-8 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Osvald Trading Portfolio Systems
        </div>
      </div>
    </footer>
  );
}
