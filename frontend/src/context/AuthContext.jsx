// src/context/AuthContext.jsx — จัดการสถานะล็อกอินแอดมิน
import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin,   setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล admin จาก token ที่บันทึกไว้
  useEffect(() => {
    const token = localStorage.getItem('nutrisite_token');
    if (token) {
      getMe()
        .then(res => setAdmin(res.data.data))
        .catch(()  => localStorage.removeItem('nutrisite_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await apiLogin({ username, password });
    localStorage.setItem('nutrisite_token', res.data.token);
    setAdmin(res.data.admin);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('nutrisite_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAdmin: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
