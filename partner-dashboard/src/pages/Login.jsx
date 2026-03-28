import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiBriefcase } from 'react-icons/hi';

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
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] px-4 relative overflow-hidden">
      <div className="absolute top-1/3 right-1/3 w-[500px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[150px]" />

      <div className="anim-scale-in card p-8 sm:p-10 w-full max-w-[420px] relative border border-white/[0.06]">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
            <HiBriefcase className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Partner Login</h1>
          <p className="text-gray-500 mt-2 text-sm">Access your partner dashboard</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input id="email" type="email" className="input-field" {...register('email', { required: 'Required' })} />
            {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input id="password" type="password" className="input-field" {...register('password', { required: 'Required' })} />
            {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin" /> Signing in...</span> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
