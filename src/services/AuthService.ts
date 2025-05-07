// CERBERUS Bot - Authentication Service
// Created: 2025-05-06 02:58:04 UTC
// Author: CERBERUSCHAIN1

import { User } from '../types/user';
import { WalletAdapter } from '../types/wallet';

/**
 * Authentication service for managing user authentication and sessions
 */
export interface AuthService {
  /**
   * Initialize the authentication service
   */
  initialize(): Promise<void>;
  
  /**
   * Check if a user is currently authenticated
   */
  isAuthenticated(): boolean;
  
  /**
   * Get the currently authenticated user
   */
  getCurrentUser(): User | null;
  
  /**
   * Register a new user with email and password
   */
  registerWithEmail(email: string, password: string): Promise<User>;
  
  /**
   * Login with email and password
   */
  loginWithEmail(email: string, password: string): Promise<User>;
  
  /**
   * Connect a wallet and authenticate
   */
  connectWallet(adapter: WalletAdapter): Promise<User>;
  
  /**
   * Sign a message using connected wallet to authenticate
   */
  signMessageWithWallet(message: string): Promise<string>;
  
  /**
   * Logout the current user
   */
  logout(): Promise<void>;
  
  /**
   * Refresh the authentication token
   */
  refreshToken(): Promise<boolean>;
  
  /**
   * Update the user profile
   */
  updateProfile(profile: Partial<User>): Promise<User>;
  
  /**
   * Change the user's password
   */
  changePassword(currentPassword: string, newPassword: string): Promise<boolean>;
  
  /**
   * Request a password reset
   */
  requestPasswordReset(email: string): Promise<boolean>;
  
  /**
   * Reset password using a reset token
   */
  resetPassword(token: string, newPassword: string): Promise<boolean>;
  
  /**
   * Setup two-factor authentication
   */
  setupTwoFactor(): Promise<{ secret: string, qrCode: string }>;
  
  /**
   * Verify and enable two-factor authentication
   */
  enableTwoFactor(code: string): Promise<boolean>;
  
  /**
   * Disable two-factor authentication
   */
  disableTwoFactor(password: string): Promise<boolean>;
  
  /**
   * Verify a two-factor authentication code
   */
  verifyTwoFactorCode(code: string): Promise<boolean>;
  
  /**
   * Subscribe to authentication state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}