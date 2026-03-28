import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiUser, HiLogout, HiHeart, HiShoppingCart, HiViewGrid } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-surface-950/80 backdrop-blur-2xl border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300">
              <span className="text-gray-900 font-extrabold text-xs">O</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Osvald</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/portfolios', label: 'Portfolios', show: true },
              { to: '/dashboard', label: 'Dashboard', show: !!user },
              { to: '/favorites', label: 'Favorites', show: !!user },
              { to: '/purchases', label: 'Purchases', show: !!user },
            ].filter(l => l.show).map(l => (
              <Link key={l.to} to={l.to} className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(l.to) ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-lg flex items-center justify-center">
                    <span className="text-gray-900 text-xs font-bold">{user.name?.charAt(0)}</span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-300">{user.name?.split(' ')[0]}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 card py-2 shadow-2xl anim-slide-down border border-white/[0.06]">
                    {[
                      { to: '/dashboard', icon: HiViewGrid, label: 'Dashboard' },
                      { to: '/profile', icon: HiUser, label: 'Profile' },
                      { to: '/favorites', icon: HiHeart, label: 'Favorites' },
                      { to: '/purchases', icon: HiShoppingCart, label: 'Purchases' },
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setProfileOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5 transition-colors">
                        <item.icon className="w-4 h-4 mr-3" /> {item.label}
                      </Link>
                    ))}
                    <hr className="my-1.5 border-white/[0.06]" />
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors">
                      <HiLogout className="w-4 h-4 mr-3" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2.5 px-5">Sign Up</Link>
              </div>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-white/[0.04] text-gray-400 transition-colors" aria-label="Toggle menu">
              {mobileOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.04] bg-surface-950/95 backdrop-blur-xl px-4 py-3 space-y-1 anim-slide-down">
          {['/portfolios', '/dashboard', '/favorites', '/purchases'].map(path => (
            (path === '/portfolios' || user) && (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)} className="block py-2.5 px-4 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors font-medium capitalize text-sm">
                {path.slice(1)}
              </Link>
            )
          ))}
        </div>
      )}
    </nav>
  );
}
