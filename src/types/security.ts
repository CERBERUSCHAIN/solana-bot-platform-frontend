// CERBERUS Bot - Security Type Definitions
// Created: 2025-05-06 17:00:05 UTC
// Author: CERBERUSCHAINNext

export type TwoFactorAuthType = 'app' | 'sms' | 'email';

export interface SecuritySettings {
  twoFactorAuthEnabled: boolean;
  twoFactorAuthType: TwoFactorAuthType | null;
  ipWhitelistEnabled: boolean;
  maxLoginAttempts: number;
  sessionTimeoutMinutes: number;
  lastPasswordChanged: string | null;
  walletEncryptionEnabled: boolean;
  emailNotificationsEnabled: boolean;
  notifyOnLogin: boolean;
  notifyOnWithdrawal: boolean;
  notifyOnSettingsChange: boolean;
}

export interface SecurityEvent {
  id: string;
  userId: string;
  eventType: 
    | 'login_success' 
    | 'login_failed' 
    | 'logout' 
    | 'password_changed' 
    | 'email_changed' 
    | 'two_factor_enabled' 
    | 'two_factor_disabled'
    | 'ip_whitelisted'
    | 'ip_blacklisted'
    | 'security_settings_changed'
    | 'wallet_encrypted'
    | 'wallet_decrypted'
    | 'suspicious_activity';
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
  details?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface IPWhitelistEntry {
  id: string;
  userId: string;
  ipAddress: string;
  label: string;
  createdAt: string;
  lastUsed: string | null;
}

export interface WalletEncryptionStatus {
  enabled: boolean;
  lastUpdated: string | null;
  strength: 'standard' | 'high';
  encryptedWallets: number;
  unencryptedWallets: number;
  encryptionAlgorithm: string;
}