// CERBERUS Bot - Security Context
// Created: 2025-05-06 17:00:05 UTC
// Author: CERBERUSCHAINNext

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  TwoFactorAuthType, 
  SecuritySettings, 
  SecurityEvent, 
  IPWhitelistEntry,
  WalletEncryptionStatus
} from '../types/security';
import { SecurityService } from '../services/SecurityService';
import { SecurityServiceImpl } from '../services/implementations/SecurityServiceImpl';
import { useAuth } from './AuthContext';

interface SecurityContextType {
  // State
  settings: SecuritySettings | null;
  ipWhitelist: IPWhitelistEntry[];
  encryptionStatus: WalletEncryptionStatus | null;
  securityEvents: SecurityEvent[];
  activeSessions: Array<{
    id: string;
    ipAddress: string;
    device: string;
    browser: string;
    location?: string;
    lastActive: string;
    current: boolean;
  }>;
  isLoading: boolean;
  error: string | null;
  
  // Methods
  fetchSecuritySettings: () => Promise<SecuritySettings>;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<SecuritySettings>;
  enableTwoFactorAuth: (type: TwoFactorAuthType) => Promise<{
    success: boolean;
    setupData?: {
      qrCodeUrl?: string;
      secretKey?: string;
      recoveryKeys?: string[];
      verificationRequired: boolean;
    };
  }>;
  verifyTwoFactorSetup: (type: TwoFactorAuthType, code: string) => Promise<{
    success: boolean;
    recoveryKeys?: string[];
  }>;
  disableTwoFactorAuth: (verificationCode: string) => Promise<boolean>;
  fetchIPWhitelist: () => Promise<IPWhitelistEntry[]>;
  addIPWhitelist: (ipAddress: string, label: string) => Promise<IPWhitelistEntry>;
  removeIPWhitelist: (id: string) => Promise<boolean>;
  testEncryptionPassword: (password: string) => Promise<boolean>;
  setupWalletEncryption: (password: string) => Promise<{
    success: boolean;
    encryptionKey?: string;
  }>;
  changeEncryptionPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  fetchEncryptionStatus: () => Promise<WalletEncryptionStatus>;
  fetchSecurityEventLog: (limit?: number, offset?: number) => Promise<SecurityEvent[]>;
  fetchActiveSessions: () => Promise<Array<{
    id: string;
    ipAddress: string;
    device: string;
    browser: string;
    location?: string;
    lastActive: string;
    current: boolean;
  }>>;
  terminateSession: (sessionId: string) => Promise<boolean>;
  updateSessionTimeout: (timeoutMinutes: number) => Promise<boolean>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [service, setService] = useState<SecurityService | null>(null);
  const [settings, setSettings] = useState<SecuritySettings | null>(null);
  const [ipWhitelist, setIPWhitelist] = useState<IPWhitelistEntry[]>([]);
  const [encryptionStatus, setEncryptionStatus] = useState<WalletEncryptionStatus | null>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [activeSessions, setActiveSessions] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize service when user is authenticated
  useEffect(() => {
    if (user) {
      const securityService = new SecurityServiceImpl();
      setService(securityService);
      
      // Fetch initial security data
      fetchInitialData(securityService);
    }
  }, [user]);
  
  const fetchInitialData = async (service: SecurityService) => {
    setIsLoading(true);
    try {
      // Fetch security settings
      const securitySettings = await service.getSecuritySettings();
      setSettings(securitySettings);
    } catch (error: any) {
      console.error('Error fetching initial security data:', error);
      setError(error.message || 'Failed to load security data');
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch security settings
   */
  const fetchSecuritySettings = async (): Promise<SecuritySettings> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const securitySettings = await service.getSecuritySettings();
      setSettings(securitySettings);
      return securitySettings;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch security settings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update security settings
   */
  const updateSecuritySettings = async (updatedSettings: Partial<SecuritySettings>): Promise<SecuritySettings> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newSettings = await service.updateSecuritySettings(updatedSettings);
      setSettings(newSettings);
      return newSettings;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update security settings';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Enable two-factor authentication
   */
  const enableTwoFactorAuth = async (type: TwoFactorAuthType): Promise<{
    success: boolean;
    setupData?: {
      qrCodeUrl?: string;
      secretKey?: string;
      recoveryKeys?: string[];
      verificationRequired: boolean;
    };
  }> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.enableTwoFactorAuth(type);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to enable two-factor authentication';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Verify two-factor authentication during setup
   */
  const verifyTwoFactorSetup = async (type: TwoFactorAuthType, code: string): Promise<{
    success: boolean;
    recoveryKeys?: string[];
  }> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await service.verifyTwoFactorSetup(type, code);
      
      if (result.success) {
        // Update settings to reflect 2FA is now enabled
        await fetchSecuritySettings();
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to verify two-factor authentication';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Disable two-factor authentication
   */
  const disableTwoFactorAuth = async (verificationCode: string): Promise<boolean> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.disableTwoFactorAuth(verificationCode);
      
      if (success) {
        // Update settings to reflect 2FA is now disabled
        await fetchSecuritySettings();
      }
      
      return success;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to disable two-factor authentication';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch IP whitelist
   */
  const fetchIPWhitelist = async (): Promise<IPWhitelistEntry[]> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const whitelist = await service.getIPWhitelist();
      setIPWhitelist(whitelist);
      return whitelist;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch IP whitelist';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Add IP to whitelist
   */
  const addIPWhitelist = async (ipAddress: string, label: string): Promise<IPWhitelistEntry> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const entry = await service.addIPWhitelist(ipAddress, label);
      setIPWhitelist(prev => [...prev, entry]);
      return entry;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add IP to whitelist';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Remove IP from whitelist
   */
  const removeIPWhitelist = async (id: string): Promise<boolean> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.removeIPWhitelist(id);
      
      if (success) {
        setIPWhitelist(prev => prev.filter(entry => entry.id !== id));
      }
      
      return success;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to remove IP from whitelist';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Test encryption password
   */
  const testEncryptionPassword = async (password: string): Promise<boolean> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.testEncryptionPassword(password);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to test encryption password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Setup wallet encryption
   */
  const setupWalletEncryption = async (password: string): Promise<{
    success: boolean;
    encryptionKey?: string;
  }> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await service.setupWalletEncryption(password);
      
      if (result.success) {
        // Update settings and encryption status
        await fetchSecuritySettings();
        await fetchEncryptionStatus();
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to setup wallet encryption';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Change encryption password
   */
  const changeEncryptionPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      return await service.changeEncryptionPassword(currentPassword, newPassword);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to change encryption password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch encryption status
   */
  const fetchEncryptionStatus = async (): Promise<WalletEncryptionStatus> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const status = await service.getEncryptionStatus();
      setEncryptionStatus(status);
      return status;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch encryption status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch security event log
   */
  const fetchSecurityEventLog = async (limit: number = 50, offset: number = 0): Promise<SecurityEvent[]> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const events = await service.getSecurityEventLog(limit, offset);
      setSecurityEvents(events);
      return events;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch security event log';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Fetch active sessions
   */
  const fetchActiveSessions = async (): Promise<Array<{
    id: string;
    ipAddress: string;
    device: string;
    browser: string;
    location?: string;
    lastActive: string;
    current: boolean;
  }>> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const sessions = await service.getActiveSessions();
      setActiveSessions(sessions);
      return sessions;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch active sessions';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Terminate session
   */
  const terminateSession = async (sessionId: string): Promise<boolean> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.terminateSession(sessionId);
      
      if (success) {
        // Update active sessions list
        setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      }
      
      return success;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to terminate session';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Update session timeout
   */
  const updateSessionTimeout = async (timeoutMinutes: number): Promise<boolean> => {
    if (!service) throw new Error('Security service not initialized');
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await service.updateSessionTimeout(timeoutMinutes);
      
      if (success) {
        // Update security settings to reflect new timeout
        await fetchSecuritySettings();
      }
      
      return success;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update session timeout';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const contextValue: SecurityContextType = {
    // State
    settings,
    ipWhitelist,
    encryptionStatus,
    securityEvents,
    activeSessions,
    isLoading,
    error,
    
    // Methods
    fetchSecuritySettings,
    updateSecuritySettings,
    enableTwoFactorAuth,
    verifyTwoFactorSetup,
    disableTwoFactorAuth,
    fetchIPWhitelist,
    addIPWhitelist,
    removeIPWhitelist,
    testEncryptionPassword,
    setupWalletEncryption,
    changeEncryptionPassword,
    fetchEncryptionStatus,
    fetchSecurityEventLog,
    fetchActiveSessions,
    terminateSession,
    updateSessionTimeout
  };
  
  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  
  return context;
};