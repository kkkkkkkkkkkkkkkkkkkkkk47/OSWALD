import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiUserAdd } from 'react-icons/hi';

export default function Register() {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await signup(data.name, data.email, data.password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-50/50 to-primary-50/50 dark:from-dark-950 dark:to-dark-900" />
      <div className="absolute top-20 right-1/4 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />

      <div className="animate-scale-in glass-card p-8 w-full max-w-md relative shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent-500/20 animate-float">
            <HiUserAdd className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-dark-900 dark:text-white">Create Account</h1>
          <p className="text-dark-500 dark:text-dark-400 mt-2">Start investing in expert portfolios</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-1.5">Full Name</label>
            <input id="name" className="input-field" placeholder="John Doe" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-1.5">Email</label>
            <input id="email" type="email" className="input-field" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} />
            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-1.5">Password</label>
            <input id="password" type="password" className="input-field" placeholder="Min 6 characters" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} />
            {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-1.5">Confirm Password</label>
            <input id="confirmPassword" type="password" className="input-field" placeholder="••••••••" {...register('confirmPassword', { validate: v => v === watch('password') || 'Passwords do not match' })} />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn-accent w-full py-3 text-base disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-dark-500 dark:text-dark-400 mt-6">
          Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
