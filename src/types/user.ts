// CERBERUS Bot - User Type Definitions
// Created: 2025-05-06 02:58:04 UTC
// Author: CERBERUSCHAIN1

export interface User {
    /** Unique identifier for the user */
    id: string;
    
    /** User's username */
    username: string;
    
    /** User's email address */
    email: string;
    
    /** User's profile picture URL */
    avatar?: string;
    
    /** Whether the user's email is verified */
    isEmailVerified: boolean;
    
    /** Whether the user has two-factor authentication enabled */
    isTwoFactorEnabled: boolean;
    
    /** User's created date */
    createdAt: string;
    
    /** Last login date */
    lastLogin?: string;
    
    /** Connected wallet addresses */
    walletAddresses: string[];
    
    /** User's subscription plan */
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    
    /** User's subscription status */
    subscriptionStatus: 'active' | 'inactive' | 'trial' | 'expired';
    
    /** User's role */
    role: 'user' | 'admin' | 'moderator';
    
    /** User's preferences */
    preferences: {
      theme: 'dark' | 'light' | 'system';
      notifications: {
        email: boolean;
        push: boolean;
        botAlerts: boolean;
      };
      defaultWallet?: string;
    };
  }