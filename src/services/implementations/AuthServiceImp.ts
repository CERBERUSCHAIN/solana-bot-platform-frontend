// CERBERUS Bot - Authentication Service Implementation
// Created: 2025-05-06 02:58:04 UTC
// Author: CERBERUSCHAIN1

import { AuthService } from '../AuthService';
import { User } from '../../types/user';
import { WalletAdapter } from '../../types/wallet';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Token storage keys
const ACCESS_TOKEN_KEY = 'cerberus_access_token';
const REFRESH_TOKEN_KEY = 'cerberus_refresh_token';

interface TokenPayload {
  sub: string;  // User ID
  exp: number;  // Expiration timestamp
  iat: number;  // Issued at timestamp
}

export class AuthServiceImpl implements AuthService {
  private currentUser: User | null = null;
  private subscribers: ((user: User | null) => void)[] = [];
  
  /**
   * Initialize the authentication service
   */
  async initialize(): Promise<void> {
    // Try to restore session from tokens in localStorage
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (accessToken) {
      try {
        // Check if token is valid and not expired
        const payload = jwtDecode<TokenPayload>(accessToken);
        const isExpired = payload.exp < Date.now() / 1000;
        
        if (isExpired) {
          // Try to refresh the token
          const refreshed = await this.refreshToken();
          if (!refreshed) {
            this.clearTokens();
            this.notifySubscribers(null);
            return;
          }
        }
        
        // Fetch the user data
        const response = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        this.currentUser = response.data;
        this.notifySubscribers(this.currentUser);
      } catch (error) {
        console.error('Failed to initialize auth service:', error);
        this.clearTokens();
        this.notifySubscribers(null);
      }
    }
  }
  
  /**
   * Check if a user is currently authenticated
   */
  isAuthenticated(): boolean {
    return !!this.currentUser;
  }
  
  /**
   * Get the currently authenticated user
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  /**
   * Register a new user with email and password
   */
  async registerWithEmail(email: string, password: string): Promise<User> {
    const response = await axios.post('/api/auth/register', { email, password });
    
    const { user, accessToken, refreshToken } = response.data;
    
    // Store tokens
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    this.currentUser = user;
    this.notifySubscribers(user);
    
    return user;
  }
  
  /**
   * Login with email and password
   */
  async loginWithEmail(email: string, password: string): Promise<User> {
    const response = await axios.post('/api/auth/login', { email, password });
    
    const { user, accessToken, refreshToken, requiresTwoFactor } = response.data;
    
    // If 2FA is required, we don't complete login yet
    if (requiresTwoFactor) {
      throw new Error('TWO_FACTOR_REQUIRED');
    }
    
    // Store tokens
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    this.currentUser = user;
    this.notifySubscribers(user);
    
    return user;
  }
  
  /**
   * Connect a wallet and authenticate
   */
  async connectWallet(adapter: WalletAdapter): Promise<User> {
    if (!adapter.connected) {
      await adapter.connect();
    }
    
    // Get the wallet address
    const walletAddress = adapter.publicKey.toString();
    
    // Request a challenge from the server
    const challengeResponse = await axios.post('/api/auth/wallet-challenge', { 
      walletAddress 
    });
    
    const { challenge } = challengeResponse.data;
    
    // Sign the challenge with the wallet
    const signature = await adapter.signMessage(
      new TextEncoder().encode(challenge)
    );
    
    // Verify the signature on the server
    const authResponse = await axios.post('/api/auth/wallet-verify', {
      walletAddress,
      signature: Buffer.from(signature).toString('base64'),
      challenge
    });
    
    const { user, accessToken, refreshToken } = authResponse.data;
    
    // Store tokens
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    this.currentUser = user;
    this.notifySubscribers(user);
    
    return user;
  }
  
  /**
   * Sign a message using connected wallet to authenticate
   */
  async signMessageWithWallet(message: string): Promise<string> {
    // This would require a connected wallet adapter
    throw new Error('Not implemented - requires wallet adapter instance');
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (accessToken) {
        // Notify server to invalidate token
        await axios.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    // Clear tokens and user regardless of server response
    this.clearTokens();
    this.currentUser = null;
    this.notifySubscribers(null);
  }
  
  /**
   * Refresh the authentication token
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return false;
    }
    
    try {
      const response = await axios.post('/api/auth/refresh-token', { refreshToken });
      const { accessToken, newRefreshToken } = response.data;
      
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearTokens();
      return false;
    }
  }
  
  /**
   * Update the user profile
   */
  async updateProfile(profile: Partial<User>): Promise<User> {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (!accessToken || !this.currentUser) {
      throw new Error('Not authenticated');
    }
    
    const response = await axios.put('/api/users/profile', profile, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const updatedUser = response.data;
    this.currentUser = updatedUser;
    this.notifySubscribers(updatedUser);
    
    return updatedUser;
  }
  
  /**
   * Change the user's password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (!accessToken || !this.currentUser) {
      throw new Error('Not authenticated');
    }
    
    await axios.post('/api/users/change-password', 
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    
    return true;
  }
  
  /**
   * Request a password reset
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    await axios.post('/api/auth/request-password-reset', { email });
    return true;
  }
  
  /**
   * Reset password using a reset token
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    await axios.post('/api/auth/reset-password', { token, newPassword });
    return true;
  }
  
  /**
   * Setup two-factor authentication
   */
  async setupTwoFactor(): Promise<{ secret: string, qrCode: string }> {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (!accessToken || !this.currentUser) {
      throw new Error('Not authenticated');
    }
    
    const response = await axios.post('/api/auth/setup-2fa', {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    return response.data;
  }
  
  /**
   * Verify and enable two-factor authentication
   */
  async enableTwoFactor(code: string): Promise<boolean> {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (!accessToken || !this.currentUser) {
      throw new Error('Not authenticated');
    }
    
    await axios.post('/api/auth/enable-2fa', { code }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    // Update the user object
    this.currentUser = {
      ...this.currentUser,
      isTwoFactorEnabled: true
    };
    
    this.notifySubscribers(this.currentUser);
    
    return true;
  }
  
  /**
   * Disable two-factor authentication
   */
  async disableTwoFactor(password: string): Promise<boolean> {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    
    if (!accessToken || !this.currentUser) {
      throw new Error('Not authenticated');
    }
    
    await axios.post('/api/auth/disable-2fa', { password }, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    // Update the user object
    this.currentUser = {
      ...this.currentUser,
      isTwoFactorEnabled: false
    };
    
    this.notifySubscribers(this.currentUser);
    
    return true;
  }
  
  /**
   * Verify a two-factor authentication code
   */
  async verifyTwoFactorCode(code: string): Promise<boolean> {
    const response = await axios.post('/api/auth/verify-2fa', { code });
    
    const { user, accessToken, refreshToken } = response.data;
    
    // Store tokens
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    this.currentUser = user;
    this.notifySubscribers(user);
    
    return true;
  }
  
  /**
   * Subscribe to authentication state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.subscribers.push(callback);
    
    // Immediately call with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }
  
  /**
   * Clear authentication tokens
   */
  private clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  
  /**
   * Notify all subscribers of auth state change
   */
  private notifySubscribers(user: User | null): void {
    this.subscribers.forEach(callback => callback(user));
  }
}