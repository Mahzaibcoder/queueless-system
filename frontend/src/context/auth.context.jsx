import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then(({ user }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (email, password) => {
    const { user, error } = await authService.login(email, password);
    if (!error) {
      setUser(user);
    }
    return { user, error };
  }, []);

  const register = useCallback(async (userData) => {
    const { user, error } = await authService.register(userData);
    if (!error) {
      setUser(user);
    }
    return { user, error };
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isOwner: user && user.role === "owner",
    isCustomer: user && user.role === "customer",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
