// CERBERUS Bot - Authentication Context
// Created: 2025-05-06 02:58:04 UTC
// Author: CERBERUSCHAIN1

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/user';
import { AuthService } from '../services/AuthService';
import { AuthServiceImpl } from '../services/implementations/AuthServiceImpl';
import { WalletAdapter } from '../types/wallet';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Auth methods
  login: (email: string, password: string) => Promise<User>;
  loginWithWallet: (adapter: WalletAdapter) => Promise<User>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<User>;
  updateProfile: (profile: Partial<User>) => Promise<User>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  
  // Two-factor methods
  setupTwoFactor: () => Promise<{ secret: string, qrCode: string }>;
  enableTwoFactor: (code: string) => Promise<boolean>;
  disableTwoFactor: (password: string) => Promise<boolean>;
  verifyTwoFactorCode: (code: string) => Promise<boolean>;
  
  // States
  isTwoFactorRequired: boolean;
  setTwoFactorRequired: (required: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isTwoFactorRequired, setTwoFactorRequired] = useState<boolean>(false);
  
  // Initialize the auth service
  const authService = React.useMemo(() => new AuthServiceImpl(), []);
  
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await authService.initialize();
        // The onAuthStateChanged subscription below will handle setting the user
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
    
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setError(null);
      }
    });
    
    return () => unsubscribe();
  }, [authService]);
  
  // Login with email/password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authService.loginWithEmail(email, password);
      return user;
    } catch (err: any) {
      if (err.message === 'TWO_FACTOR_REQUIRED') {
        setTwoFactorRequired(true);
        throw err;
      } else {
        setError(err.response?.data?.message || err.message || 'Login failed');
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Login with wallet
  const loginWithWallet = async (adapter: WalletAdapter) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authService.connectWallet(adapter);
      return user;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Wallet login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Logout failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register
  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authService.registerWithEmail(email, password);
      return user;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update profile
  const updateProfile = async (profile: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await authService.updateProfile(profile);
      return updatedUser;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to change password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Request password reset
  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.requestPasswordReset(email);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to request password reset');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.resetPassword(token, newPassword);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Setup two-factor authentication
  const setupTwoFactor = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.setupTwoFactor();
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to setup two-factor authentication');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Enable two-factor authentication
  const enableTwoFactor = async (code: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.enableTwoFactor(code);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to enable two-factor authentication');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Disable two-factor authentication
  const disableTwoFactor = async (password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.disableTwoFactor(password);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to disable two-factor authentication');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify two-factor code
  const verifyTwoFactorCode = async (code: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.verifyTwoFactorCode(code);
      setTwoFactorRequired(false);
      return result;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Invalid verification code');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const contextValue = {
    user,
    isLoading,
    error,
    login,
    loginWithWallet,
    logout,
    register,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    setupTwoFactor,
    enableTwoFactor,
    disableTwoFactor,
    verifyTwoFactorCode,
    isTwoFactorRequired,
    setTwoFactorRequired
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};