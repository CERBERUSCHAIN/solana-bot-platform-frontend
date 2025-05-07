// CERBERUS Bot - Security Service
// Created: 2025-05-06 17:00:05 UTC
// Author: CERBERUSCHAINNext

import { 
    TwoFactorAuthType, 
    SecuritySettings, 
    SecurityEvent, 
    IPWhitelistEntry,
    WalletEncryptionStatus
  } from '../types/security';
  
  /**
   * Service for managing security features
   */
  export interface SecurityService {
    /**
     * Get the user's security settings
     */
    getSecuritySettings(): Promise<SecuritySettings>;
    
    /**
     * Update security settings
     */
    updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings>;
    
    /**
     * Enable two-factor authentication
     */
    enableTwoFactorAuth(type: TwoFactorAuthType): Promise<{
      success: boolean;
      setupData?: {
        qrCodeUrl?: string;
        secretKey?: string;
        recoveryKeys?: string[];
        verificationRequired: boolean;
      };
    }>;
    
    /**
     * Verify two-factor authentication during setup
     */
    verifyTwoFactorSetup(type: TwoFactorAuthType, code: string): Promise<{
      success: boolean;
      recoveryKeys?: string[];
    }>;
    
    /**
     * Disable two-factor authentication
     */
    disableTwoFactorAuth(verificationCode: string): Promise<boolean>;
    
    /**
     * Get IP whitelist entries
     */
    getIPWhitelist(): Promise<IPWhitelistEntry[]>;
    
    /**
     * Add IP to whitelist
     */
    addIPWhitelist(ipAddress: string, label: string): Promise<IPWhitelistEntry>;
    
    /**
     * Remove IP from whitelist
     */
    removeIPWhitelist(id: string): Promise<boolean>;
    
    /**
     * Test encryption password
     */
    testEncryptionPassword(password: string): Promise<boolean>;
    
    /**
     * Setup wallet encryption
     */
    setupWalletEncryption(password: string): Promise<{
      success: boolean;
      encryptionKey?: string;
    }>;
    
    /**
     * Change encryption password
     */
    changeEncryptionPassword(currentPassword: string, newPassword: string): Promise<boolean>;
    
    /**
     * Get encryption status
     */
    getEncryptionStatus(): Promise<WalletEncryptionStatus>;
    
    /**
     * Get security event log
     */
    getSecurityEventLog(limit?: number, offset?: number): Promise<SecurityEvent[]>;
    
    /**
     * Create active sessions
     */
    getActiveSessions(): Promise<Array<{
      id: string;
      ipAddress: string;
      device: string;
      browser: string;
      location?: string;
      lastActive: string;
      current: boolean;
    }>>;
    
    /**
     * Terminate session
     */
    terminateSession(sessionId: string): Promise<boolean>;
    
    /**
     * Update session timeout settings
     */
    updateSessionTimeout(timeoutMinutes: number): Promise<boolean>;
  }