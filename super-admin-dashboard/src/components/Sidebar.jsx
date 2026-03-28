import { NavLink } from 'react-router-dom';
import { HiViewGrid, HiUsers, HiBriefcase, HiCollection, HiShoppingCart, HiChartBar, HiCog, HiClipboardList, HiTag, HiLogout, HiX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', icon: HiViewGrid, label: 'Dashboard' },
  { to: '/users', icon: HiUsers, label: 'Users' },
  { to: '/partners', icon: HiBriefcase, label: 'Partners' },
  { to: '/portfolios', icon: HiCollection, label: 'Portfolios' },
  { to: '/purchases', icon: HiShoppingCart, label: 'Purchases' },
  { to: '/categories', icon: HiTag, label: 'Categories' },
  { to: '/analytics', icon: HiChartBar, label: 'Analytics' },
  { to: '/audit-logs', icon: HiClipboardList, label: 'Audit Logs' },
  { to: '/settings', icon: HiCog, label: 'Settings' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-[#0d1117] border-r border-white/[0.04] transform transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-extrabold text-xs">O</span>
            </div>
            <div>
              <span className="text-sm font-bold text-white block leading-tight">Osvald</span>
              <span className="text-[10px] text-violet-400 font-medium uppercase tracking-[0.15em]">Admin</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors text-gray-500" aria-label="Close"><HiX className="w-4 h-4" /></button>
        </div>

        <div className="px-4 mb-5">
          <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user?.name?.charAt(0)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="px-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-240px)]">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 group ${isActive ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] border border-transparent'}`}>
              <l.icon className="w-[18px] h-[18px] group-hover:scale-110 transition-transform duration-300" /> {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-3 right-3">
          <button onClick={logout} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 w-full transition-all duration-300 group">
            <HiLogout className="w-[18px] h-[18px] group-hover:scale-110 transition-transform" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
