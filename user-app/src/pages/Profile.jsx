import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Breadcrumb from '../components/ui/Breadcrumb';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const { register, handleSubmit } = useForm({ defaultValues: { name: user?.name, phone: user?.phone, bio: user?.bio } });
  const { register: regPw, handleSubmit: handlePw, reset: resetPw } = useForm();

  const onUpdateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      setUser(res.data.data.user);
      localStorage.setItem('osvald_user', JSON.stringify(res.data.data.user));
      toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const onChangePassword = async (data) => {
    try {
      await api.put('/auth/change-password', data);
      toast.success('Password changed');
      resetPw();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Profile' }]} />
      <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-8">Settings</h1>

      <div className="flex gap-2 mb-6">
        {['profile', 'password'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t ? 'bg-primary-600 text-white' : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400'}`}>
            {t === 'profile' ? 'Profile' : 'Password'}
          </button>
        ))}
      </div>

      {tab === 'profile' ? (
        <form onSubmit={handleSubmit(onUpdateProfile)} className="glass-card p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Name</label>
            <input id="name" className="input-field" {...register('name')} />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Phone</label>
            <input id="phone" className="input-field" {...register('phone')} />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Bio</label>
            <textarea id="bio" rows={3} className="input-field" {...register('bio')} />
          </div>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      ) : (
        <form onSubmit={handlePw(onChangePassword)} className="glass-card p-6 space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Current Password</label>
            <input id="currentPassword" type="password" className="input-field" {...regPw('currentPassword', { required: true })} />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">New Password</label>
            <input id="newPassword" type="password" className="input-field" {...regPw('newPassword', { required: true, minLength: 6 })} />
          </div>
          <button type="submit" className="btn-primary">Change Password</button>
        </form>
      )}
    </div>
  );
}
