import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#0a0e1a]"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-[260px]">
        <header className="sticky top-0 z-30 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-white/[0.04] px-6 py-3.5">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/[0.04] text-gray-500 mr-3" aria-label="Open sidebar">
              <HiMenu className="w-5 h-5" />
            </button>
            <span className="text-xs text-gray-600 font-medium uppercase tracking-[0.15em]">Super Admin Panel</span>
          </div>
        </header>
        <main className="p-6 anim-fade-in"><Outlet /></main>
      </div>
    </div>
  );
}
