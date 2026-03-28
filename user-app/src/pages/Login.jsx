import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-20 left-1/3 w-80 h-80 bg-cyan-500/[0.04] rounded-full blur-[100px]" />

      <div className="anim-scale-in card p-8 sm:p-10 w-full max-w-[420px] relative border border-white/[0.06]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-cyan-500/20">
            <span className="text-gray-900 font-extrabold text-lg">O</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input id="email" type="email" className="input-field" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input id="password" type="password" className="input-field" placeholder="••••••••" {...register('password', { required: 'Password is required' })} />
            {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> Signing in...</span> : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account? <Link to="/register" className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
