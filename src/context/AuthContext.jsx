import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isDealer, setIsDealer] = useState(() => {
    const saved = localStorage.getItem('isDealer');
    return saved === 'true';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('isDealer', isDealer.toString());
  }, [isDealer]);

  const login = (userData) => {
    setUser(userData);
    setIsDealer(userData.role === 'dealer');
  };

  const logout = () => {
    setUser(null);
    setIsDealer(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isDealer,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
