import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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

