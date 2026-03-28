import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const { register: regProfile, handleSubmit: handleProfile, reset: resetProfile } = useForm();

  const { data: profile } = useQuery({
    queryKey: ['partner-profile'],
    queryFn: () => api.get('/partner/profile').then(r => r.data.data.profile),
  });

  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone, bio: user.bio });
    if (profile) resetProfile({ companyName: profile.companyName, description: profile.description, website: profile.website });
  }, [user, profile, reset, resetProfile]);

  const onUpdateUser = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      setUser(res.data.data.user);
      localStorage.setItem('osvald_partner_user', JSON.stringify(res.data.data.user));
      toast.success('Profile updated');
    } catch (err) { toast.error('Update failed'); }
  };

  const onUpdatePartner = async (data) => {
    try {
      await api.put('/partner/profile', data);
      toast.success('Company profile updated');
    } catch (err) { toast.error('Update failed'); }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Profile Settings</h1>

      <form onSubmit={handleSubmit(onUpdateUser)} className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white">Personal Info</h2>
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Name</label>
          <input className="input-field" {...register('name')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Phone</label>
          <input className="input-field" {...register('phone')} />
        </div>
        <button type="submit" className="btn-primary">Save</button>
      </form>

      <form onSubmit={handleProfile(onUpdatePartner)} className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-dark-900 dark:text-white">Company Info</h2>
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Company Name</label>
          <input className="input-field" {...regProfile('companyName')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Description</label>
          <textarea rows={3} className="input-field" {...regProfile('description')} />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-1">Website</label>
          <input className="input-field" {...regProfile('website')} />
        </div>
        <button type="submit" className="btn-primary">Save Company Info</button>
      </form>
    </div>
  );
}
