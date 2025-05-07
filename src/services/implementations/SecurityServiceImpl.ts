// CERBERUS Bot - Security Service Implementation
// Created: 2025-05-06 17:00:05 UTC
// Author: CERBERUSCHAINNext

import { SecurityService } from '../SecurityService';
import { 
  TwoFactorAuthType, 
  SecuritySettings, 
  SecurityEvent, 
  IPWhitelistEntry,
  WalletEncryptionStatus
} from '../../types/security';
import axios from 'axios';

export class SecurityServiceImpl implements SecurityService {
  /**
   * Get headers with authentication
   */
  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem('cerberus_access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
  
  /**
   * Get the user's security settings
   */
  async getSecuritySettings(): Promise<SecuritySettings> {
    try {
      const response = await axios.get(
        '/api/security/settings',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching security settings:', error);
      throw error;
    }
  }
  
  /**
   * Update security settings
   */
  async updateSecuritySettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    try {
      const response = await axios.put(
        '/api/security/settings',
        settings,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating security settings:', error);
      throw error;
    }
  }
  
  /**
   * Enable two-factor authentication
   */
  async enableTwoFactorAuth(type: TwoFactorAuthType): Promise<{
    success: boolean;
    setupData?: {
      qrCodeUrl?: string;
      secretKey?: string;
      recoveryKeys?: string[];
      verificationRequired: boolean;
    };
  }> {
    try {
      const response = await axios.post(
        '/api/security/2fa/enable',
        { type },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error enabling two-factor authentication:', error);
      throw error;
    }
  }
  
  /**
   * Verify two-factor authentication during setup
   */
  async verifyTwoFactorSetup(type: TwoFactorAuthType, code: string): Promise<{
    success: boolean;
    recoveryKeys?: string[];
  }> {
    try {
      const response = await axios.post(
        '/api/security/2fa/verify',
        { type, code },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error verifying two-factor authentication:', error);
      throw error;
    }
  }
  
  /**
   * Disable two-factor authentication
   */
  async disableTwoFactorAuth(verificationCode: string): Promise<boolean> {
    try {
      const response = await axios.post(
        '/api/security/2fa/disable',
        { verificationCode },
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error disabling two-factor authentication:', error);
      throw error;
    }
  }
  
  /**
   * Get IP whitelist entries
   */
  async getIPWhitelist(): Promise<IPWhitelistEntry[]> {
    try {
      const response = await axios.get(
        '/api/security/ip-whitelist',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching IP whitelist:', error);
      throw error;
    }
  }
  
  /**
   * Add IP to whitelist
   */
  async addIPWhitelist(ipAddress: string, label: string): Promise<IPWhitelistEntry> {
    try {
      const response = await axios.post(
        '/api/security/ip-whitelist',
        { ipAddress, label },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding IP to whitelist:', error);
      throw error;
    }
  }
  
  /**
   * Remove IP from whitelist
   */
  async removeIPWhitelist(id: string): Promise<boolean> {
    try {
      const response = await axios.delete(
        `/api/security/ip-whitelist/${id}`,
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error removing IP from whitelist:', error);
      throw error;
    }
  }
  
  /**
   * Test encryption password
   */
  async testEncryptionPassword(password: string): Promise<boolean> {
    try {
      const response = await axios.post(
        '/api/security/encryption/test',
        { password },
        { headers: this.getHeaders() }
      );
      return response.data.valid;
    } catch (error) {
      console.error('Error testing encryption password:', error);
      throw error;
    }
  }
  
  /**
   * Setup wallet encryption
   */
  async setupWalletEncryption(password: string): Promise<{
    success: boolean;
    encryptionKey?: string;
  }> {
    try {
      const response = await axios.post(
        '/api/security/encryption/setup',
        { password },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error setting up wallet encryption:', error);
      throw error;
    }
  }
  
  /**
   * Change encryption password
   */
  async changeEncryptionPassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const response = await axios.put(
        '/api/security/encryption/password',
        { currentPassword, newPassword },
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error changing encryption password:', error);
      throw error;
    }
  }
  
  /**
   * Get encryption status
   */
  async getEncryptionStatus(): Promise<WalletEncryptionStatus> {
    try {
      const response = await axios.get(
        '/api/security/encryption/status',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching encryption status:', error);
      throw error;
    }
  }
  
  /**
   * Get security event log
   */
  async getSecurityEventLog(limit: number = 50, offset: number = 0): Promise<SecurityEvent[]> {
    try {
      const response = await axios.get(
        `/api/security/events?limit=${limit}&offset=${offset}`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching security event log:', error);
      throw error;
    }
  }
  
  /**
   * Get active sessions
   */
  async getActiveSessions(): Promise<Array<{
    id: string;
    ipAddress: string;
    device: string;
    browser: string;
    location?: string;
    lastActive: string;
    current: boolean;
  }>> {
    try {
      const response = await axios.get(
        '/api/security/sessions',
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching active sessions:', error);
      throw error;
    }
  }
  
  /**
   * Terminate session
   */
  async terminateSession(sessionId: string): Promise<boolean> {
    try {
      const response = await axios.delete(
        `/api/security/sessions/${sessionId}`,
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error terminating session:', error);
      throw error;
    }
  }
  
  /**
   * Update session timeout settings
   */
  async updateSessionTimeout(timeoutMinutes: number): Promise<boolean> {
    try {
      const response = await axios.put(
        '/api/security/session-timeout',
        { timeoutMinutes },
        { headers: this.getHeaders() }
      );
      return response.data.success;
    } catch (error) {
      console.error('Error updating session timeout:', error);
      throw error;
    }
  }
}