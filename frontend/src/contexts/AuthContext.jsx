import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAuthToken } from '../utils/api';

const AuthContext = createContext();

function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Başlangıçta localStorage'daki token ve kullanıcı bilgisini al
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const decoded = parseJwt(storedToken);
      return decoded?.user ?? decoded ?? null;
    }
    return null;
  });

  // Eğer başlangıçta bir token varsa, axios için auth header ayarla
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, []);  // yalnızca ilk yüklemede çalışır

  /**
   * Giriş yaptıktan sonra token ve kullanıcı bilgisini state ve localStorage'da saklar.
   * Ardından API istekleri için Authorization header'ını ayarlar.
   */
  const login = (newToken, newUser = null) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setAuthToken(newToken);
    let userObj = newUser;
    if (!userObj) {
      const decoded = parseJwt(newToken);
      userObj = decoded?.user ?? decoded ?? null;
    }
    setUser(userObj);
    if (userObj) {
      localStorage.setItem('user', JSON.stringify(userObj));
    } else {
      localStorage.removeItem('user');
    }
  };

  /**
   * Çıkış yapıldığında state ve localStorage temizlenir, auth header kaldırılır.
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
