'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getToken, authenticatedFetch } from '@/lib/api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  // Function to validate token with server
  const validateToken = async (token) => {
    try {
      const result = await authenticatedFetch('/api/auth/validate', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
      
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthContext - Initializing authentication...');
      
      // Check localStorage first for immediate UI update
      const cachedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      console.log('AuthContext - Cached user:', cachedUser);
      
      if (cachedUser) {
        try {
          const userData = JSON.parse(cachedUser);
          console.log('AuthContext - Using cached user immediately:', userData);
          setUser(userData);
        } catch (error) {
          console.error('AuthContext - Error parsing cached user:', error);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
          }
        }
      }
      
      // Then validate token with server
      const token = getToken();
      console.log('AuthContext - Token found:', !!token);
      
      if (token) {
        try {
          console.log('AuthContext - Validating token...');
          const userData = await validateToken(token);
          console.log('AuthContext - User data from validation:', userData);
          
          if (userData) {
            setUser(userData);
            console.log('AuthContext - User state set from validation:', userData);
            // Save user info to localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(userData));
            }
          } else {
            // Token is invalid, but keep cached user if available
            console.log('AuthContext - Token invalid, keeping cached user if available');
            if (!cachedUser) {
              // Only clear if no cached user available
              document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('auth-token');
              }
              setUser(null);
            } else {
              // Keep the cached user for UI continuity
              console.log('AuthContext - Keeping cached user for UI continuity');
            }
          }
        } catch (error) {
          console.error('AuthContext - Token validation error:', error);
          // Don't logout on network error, keep cached user if available
          if (!cachedUser) {
            setUser(null);
          } else {
            console.log('AuthContext - Validation failed, keeping cached user');
          }
        }
      } else if (!cachedUser) {
        // No token and no cached user
        setUser(null);
      }
      
      console.log('AuthContext - Initialization complete, setting loading to false');
      setIsUserLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.data);
        // Save user info to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(result.data));
          // Store token in localStorage for frontend access
          if (result.data.token) {
            localStorage.setItem('auth-token', result.data.token);
          }
        }
        // Token is automatically set in HTTP-only cookie by the server
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.data);
        // Save user info to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(result.data));
        }
        // Token is automatically set in HTTP-only cookie by the server
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear client-side state
    setUser(null);
    
    // Clear HTTP-only cookie by calling server endpoint
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('auth-token');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isUserLoading,
        login,
        register,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
