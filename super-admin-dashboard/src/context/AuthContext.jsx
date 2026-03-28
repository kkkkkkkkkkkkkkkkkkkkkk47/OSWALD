import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('osvald_admin_token');
    const stored = localStorage.getItem('osvald_admin_user');
    if (token && stored) {
      setUser(JSON.parse(stored));
      api.get('/auth/me').then(res => {
        const u = res.data.data.user;
        if (u.role !== 'admin') { logout(); return; }
        setUser(u);
        localStorage.setItem('osvald_admin_user', JSON.stringify(u));
      }).catch(() => logout());
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: u, token } = res.data.data;
    if (u.role !== 'admin') throw new Error('Access denied. Admin accounts only.');
    localStorage.setItem('osvald_admin_token', token);
    localStorage.setItem('osvald_admin_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('osvald_admin_token');
    localStorage.removeItem('osvald_admin_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
