import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const AuthContext = createContext(null);

// Determine a sensible API base URL for both local dev and production.
// - Prefer VITE_API_BASE_URL when provided (local .env or Vercel env).
// - Fallbacks:
//   - localhost → http://localhost:5000
//   - kodflix-front.vercel.app → https://kodflix-back.vercel.app
//   - otherwise use current origin (same domain backend).
function resolveApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:5000';
  }

  const { origin, hostname } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }

  if (hostname === 'kodflix-front.vercel.app') {
    return 'https://kodflix-back.vercel.app';
  }

  return origin;
}

const API_BASE_URL = resolveApiBaseUrl();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();
      setUser(data.user || null);
    } catch (err) {
      console.error('Failed to fetch current user', err);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchMe();
      setInitializing(false);
    })();
  }, [fetchMe]);

  const signup = useCallback(async ({ username, email, phone, password }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, email, phone, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.message || 'Signup failed. Please try again.';
      throw new Error(message);
    }

    // We intentionally do not keep the user "logged in" after signup;
    // the user should sign in explicitly with their new credentials.
    return data.user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.message || 'Login failed. Please check your credentials.';
      throw new Error(message);
    }

    setUser(data.user || null);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error during logout', err);
    } finally {
      setUser(null);
    }
  }, []);

  const value = {
    user,
    initializing,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

