import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  AUTH_CHANGED_EVENT,
  hasValidSession,
  logout as apiLogout,
} from '../api/partners';

type AuthContextValue = {
  authenticated: boolean;
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(hasValidSession);

  const refresh = useCallback(() => {
    setAuthenticated(hasValidSession());
  }, []);

  useEffect(() => {
    refresh();
    const onAuthChanged = () => refresh();
    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    window.addEventListener('storage', onAuthChanged);
    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
      window.removeEventListener('storage', onAuthChanged);
    };
  }, [refresh]);

  const logout = useCallback(() => {
    apiLogout('/');
  }, []);

  const value = useMemo(
    () => ({ authenticated, logout, refresh }),
    [authenticated, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
