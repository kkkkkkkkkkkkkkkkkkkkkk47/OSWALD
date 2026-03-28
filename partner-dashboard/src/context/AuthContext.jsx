import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('osvald_partner_token');
    const stored = localStorage.getItem('osvald_partner_user');
    if (token && stored) {
      setUser(JSON.parse(stored));
      api.get('/auth/me').then(res => {
        const u = res.data.data.user;
        if (u.role !== 'partner') { logout(); return; }
        setUser(u);
        localStorage.setItem('osvald_partner_user', JSON.stringify(u));
      }).catch(() => logout());
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: u, token } = res.data.data;
    if (u.role !== 'partner') throw new Error('Access denied. Partner accounts only.');
    localStorage.setItem('osvald_partner_token', token);
    localStorage.setItem('osvald_partner_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('osvald_partner_token');
    localStorage.removeItem('osvald_partner_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
