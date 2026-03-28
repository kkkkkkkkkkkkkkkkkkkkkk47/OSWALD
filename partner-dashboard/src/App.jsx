import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Portfolios from './pages/Portfolios';
import CreatePortfolio from './pages/CreatePortfolio';
import EditPortfolio from './pages/EditPortfolio';
import Sales from './pages/Sales';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30000, retry: 1 } } });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/portfolios" element={<Portfolios />} />
              <Route path="/portfolios/create" element={<CreatePortfolio />} />
              <Route path="/portfolios/edit/:id" element={<EditPortfolio />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
          <Toaster position="top-right" toastOptions={{ style: { borderRadius: '12px', background: '#1e293b', color: '#fff' } }} />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
