import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('osvald_token');
    const stored = localStorage.getItem('osvald_user');
    if (token && stored) {
      setUser(JSON.parse(stored));
      api.get('/auth/me').then(res => {
        setUser(res.data.data.user);
        localStorage.setItem('osvald_user', JSON.stringify(res.data.data.user));
      }).catch(() => logout());
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: u, token, refreshToken } = res.data.data;
    if (u.role !== 'user') throw new Error('Access denied. Use the appropriate dashboard.');
    localStorage.setItem('osvald_token', token);
    localStorage.setItem('osvald_refresh', refreshToken);
    localStorage.setItem('osvald_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { user: u, token, refreshToken } = res.data.data;
    localStorage.setItem('osvald_token', token);
    localStorage.setItem('osvald_refresh', refreshToken);
    localStorage.setItem('osvald_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('osvald_token');
    localStorage.removeItem('osvald_refresh');
    localStorage.removeItem('osvald_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
