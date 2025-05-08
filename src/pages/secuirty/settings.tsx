// CERBERUS Bot - Security Settings Page
// Created: 2025-05-06 20:33:16 UTC
// Author: CERBERUSCHAIN

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { ProtectedRoute } from '../../components/Auth/ProtectedRoute';
import { useSecurity } from '../../contexts/SecurityContext';
import { useAuth } from '../../contexts/AuthContext';
import { TwoFactorSetup } from '../../components/Security/TwoFactorSetup';
import { IPWhitelistManager } from '../../components/Security/IPWhitelistManager';
import { SecurityEventLog } from '../../components/Security/SecurityEventLog';
import { ActiveSessions } from '../../components/Security/ActiveSessions';
import { WalletEncryptionSetup } from '../../components/Security/WalletEncryptionSetup';

export default function SecuritySettingsPage() {
  const { user } = useAuth();
  const {
    settings,
    isLoading,
    error,
    fetchSecuritySettings,
    updateSecuritySettings,
    fetchIPWhitelist,
    fetchEncryptionStatus,
    fetchActiveSessions,
    fetchSecurityEventLog
  } = useSecurity();
  
  const [activeTab, setActiveTab] = useState<
    'general' | 'twoFactor' | 'ipWhitelist' | 'walletEncryption' | 'sessions' | 'activityLog'
  >('general');
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [showEncryptionSetup, setShowEncryptionSetup] = useState(false);
  
  // Fetch data on initial load
  useEffect(() => {
    const fetchData = async () => {
      await fetchSecuritySettings();
      
      if (activeTab === 'ipWhitelist') {
        await fetchIPWhitelist();
      } else if (activeTab === 'walletEncryption') {
        await fetchEncryptionStatus();
      } else if (activeTab === 'sessions') {
        await fetchActiveSessions();
      } else if (activeTab === 'activityLog') {
        await fetchSecurityEventLog();
      }
    };
    
    fetchData();
  }, [activeTab]);
  
  const handleToggleSetting = async (setting: string, value: boolean | number) => {
    try {
      await updateSecuritySettings({ [setting]: value });
    } catch (error) {
      console.error('Error updating security setting:', error);
    }
  };
  
  const handleSessionTimeoutChange = async (minutes: number) => {
    try {
      await updateSecuritySettings({ sessionTimeoutMinutes: minutes });
    } catch (error) {
      console.error('Error updating session timeout:', error);
    }
  };
  
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>Security Settings | CERBERUS Bot</title>
        </Head>
        
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">CERBERUS Bot Platform</h1>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welcome, <span className="text-indigo-400">{user?.username || 'CERBERUSCHAIN'}</span>
              </div>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user?.username?.[0]?.toUpperCase() || 'C'}</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 mb-6 md:mb-0 flex-shrink-0">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow">
                <div className="p-4 border-b border-gray-700">
                  <h2 className="text-lg font-medium">Security Settings</h2>
                </div>
                
                <nav className="p-2">
                  <button
                    onClick={() => handleTabChange('general')}
                    className={`w-full text-left p-3 rounded flex items-center ${
                      activeTab === 'general' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    General
                  </button>
                  
                  <button
                    onClick={() => handleTabChange('twoFactor')}
                    className={`w-full text-left p-3 rounded flex items-center ${
                      activeTab === 'twoFactor' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                    Two-Factor Authentication
                  </button>
                  
                  <button
                    onClick={() => handleTabChange('ipWhitelist')}
                    className={`w-full text-left p-3 rounded flex items-center ${
                      activeTab === 'ipWhitelist' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    IP Whitelist
                  </button>
                  
                  <button
                    onClick={() => handleTabChange('walletEncryption')}
                    className={`w-full text-left p-3 rounded flex items-center ${
                      activeTab === 'walletEncryption' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    Wallet Encryption
                  </button>
                  
                  <button
                    onClick={() => handleTabChange('sessions')}
                    className={`w-full text-left p-3 rounded flex items-center ${
                      activeTab === 'sessions' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Active Sessions
                  </button>
                  
                  <button
                    onClick={() => handleTabChange('activityLog')}
                    className={`w-full text-left p-3 rounded flex items-center ${
                      activeTab === 'activityLog' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Activity Log
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {error && (
                <div className="bg-red-900 bg-opacity-20 text-red-500 p-4 rounded-lg mb-6">
                  {error}
                </div>
              )}
              
              {isLoading && !settings ? (
                <div className="bg-gray-800 rounded-lg p-6 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : settings ? (
                <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                  {/* General Security Settings */}
                  {activeTab === 'general' && (
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-6">General Security Settings</h2>
                      
                      <div className="space-y-6">
                        {/* Email Notification Settings */}
                        <div className="border-b border-gray-700 pb-6">
                          <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Security Email Notifications</p>
                                <p className="text-sm text-gray-400">Receive security-related notifications via email</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={settings.emailNotificationsEnabled}
                                  onChange={(e) => handleToggleSetting('emailNotificationsEnabled', e.target.checked)}
                                  aria-label="Toggle security email notifications"
                                />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                              </label>
                            </div>
                            
                            <div className="flex items-center justify-between pl-6">
                              <div>
                                <p className="font-medium">Login Notifications</p>
                                <p className="text-sm text-gray-400">Get notified when someone logs into your account</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={settings.notifyOnLogin}
                                  onChange={(e) => handleToggleSetting('notifyOnLogin', e.target.checked)}
                                  disabled={!settings.emailNotificationsEnabled}
                                  aria-label="Toggle login notifications"
                                />
                                <div className={`w-11 h-6 ${!settings.emailNotificationsEnabled ? 'bg-gray-800 opacity-50' : 'bg-gray-700'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600`}></div>
                              </label>
                            </div>
                            
                            <div className="flex items-center justify-between pl-6">
                              <div>
                                <p className="font-medium">Withdrawal Notifications</p>
                                <p className="text-sm text-gray-400">Get notified when funds are withdrawn</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={settings.notifyOnWithdrawal}
                                  onChange={(e) => handleToggleSetting('notifyOnWithdrawal', e.target.checked)}
                                  disabled={!settings.emailNotificationsEnabled}
                                  aria-label="Toggle withdrawal notifications"
                                />
                                <div className={`w-11 h-6 ${!settings.emailNotificationsEnabled ? 'bg-gray-800 opacity-50' : 'bg-gray-700'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600`}></div>
                              </label>
                            </div>
                            
                            <div className="flex items-center justify-between pl-6">
                              <div>
                                <p className="font-medium">Settings Change Notifications</p>
                                <p className="text-sm text-gray-400">Get notified when account settings are changed</p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  className="sr-only peer"
                                  checked={settings.notifyOnSettingsChange}
                                  onChange={(e) => handleToggleSetting('notifyOnSettingsChange', e.target.checked)}
                                  disabled={!settings.emailNotificationsEnabled}
                                  aria-label="Toggle settings change notifications"
                                />
                                <div className={`w-11 h-6 ${!settings.emailNotificationsEnabled ? 'bg-gray-800 opacity-50' : 'bg-gray-700'} peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600`}></div>
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        {/* Session Timeout Settings */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Session Management</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <p className="font-medium mb-2">Session Timeout</p>
                              <p className="text-sm text-gray-400 mb-3">Automatically log out after a period of inactivity</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                {[15, 30, 60, 120].map((minutes) => (
                                  <button
                                    key={minutes}
                                    onClick={() => handleSessionTimeoutChange(minutes)}
                                    className={`py-2 px-4 rounded-lg ${
                                      settings.sessionTimeoutMinutes === minutes
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                  >
                                    {minutes} minutes
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Maximum Login Attempts */}
                            <div className="pt-4">
                              <p className="font-medium mb-2">Maximum Login Attempts</p>
                              <p className="text-sm text-gray-400 mb-3">Account will be temporarily locked after this many failed attempts</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                                {[3, 5, 10].map((attempts) => (
                                  <button
                                    key={attempts}
                                    onClick={() => handleToggleSetting('maxLoginAttempts', attempts)}
                                    className={`py-2 px-4 rounded-lg ${
                                      settings.maxLoginAttempts === attempts
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                  >
                                    {attempts} attempts
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Two-Factor Authentication */}
                  {activeTab === 'twoFactor' && (
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-6">Two-Factor Authentication</h2>
                      
                      {settings.twoFactorAuthEnabled ? (
                        <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg mb-6">
                          <div className="flex items-start">
                            <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                            </svg>
                            <div>
                              <h3 className="font-medium">Two-Factor Authentication is enabled</h3>
                              <p className="text-sm text-green-300 mt-1">
                                Your account is secured with {settings.twoFactorAuthType === 'app' ? 'an authenticator app' : 
                                                             settings.twoFactorAuthType === 'sms' ? 'SMS verification' : 'email verification'}.
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <button
                              onClick={() => setShowTwoFactorSetup(true)}
                              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white mr-3"
                            >
                              Change Method
                            </button>
                            <button
                              onClick={() => setShowTwoFactorSetup(true)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                            >
                              Disable
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="bg-yellow-900 bg-opacity-20 p-4 rounded-lg mb-6">
                            <div className="flex items-start">
                              <svg className="w-6 h-6 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                              </svg>
                              <div>
                                <h3 className="font-medium">Two-Factor Authentication is not enabled</h3>
                                <p className="text-sm text-yellow-300 mt-1">
                                  Adding a second authentication factor greatly increases your account security.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Authenticator App */}
                            <div className="bg-gray-750 rounded-lg p-5 border border-gray-700">
                              <div className="flex justify-center mb-4">
                                <svg className="w-12 h-12 text-indigo-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
                                  <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z" />
                                </svg>
                              </div>
                              <h3 className="font-medium text-center mb-2">Authenticator App</h3>
                              <p className="text-sm text-gray-400 text-center mb-4">
                                Use an authenticator app like Google Authenticator or Authy.
                              </p>
                              <button
                                onClick={() => setShowTwoFactorSetup(true)}
                                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                              >
                                Set Up
                              </button>
                            </div>
                            
                            {/* SMS Verification */}
                            <div className="bg-gray-750 rounded-lg p-5 border border-gray-700">
                              <div className="flex justify-center mb-4">
                                <svg className="w-12 h-12 text-indigo-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20 2H4c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 18H4V4h16v16z" />
                                  <path d="M7 12h2v2H7zm0-4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm-8 8h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2zm0-4h2v2h-2zm-4 0h2v2h-2z" />
                                </svg>
                              </div>
                              <h3 className="font-medium text-center mb-2">SMS Verification</h3>
                              <p className="text-sm text-gray-400 text-center mb-4">
                                Receive verification codes via SMS text message.
                              </p>
                              <button
                                onClick={() => setShowTwoFactorSetup(true)}
                                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                              >
                                Set Up
                              </button>
                            </div>
                            
                            {/* Email Verification */}
                            <div className="bg-gray-750 rounded-lg p-5 border border-gray-700">
                              <div className="flex justify-center mb-4">
                                <svg className="w-12 h-12 text-indigo-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z" />
                                </svg>
                              </div>
                              <h3 className="font-medium text-center mb-2">Email Verification</h3>
                              <p className="text-sm text-gray-400 text-center mb-4">
                                Receive verification codes via email.
                              </p>
                              <button
                                onClick={() => setShowTwoFactorSetup(true)}
                                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                              >
                                Set Up
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* IP Whitelist */}
                  {activeTab === 'ipWhitelist' && (
                    <IPWhitelistManager />
                  )}
                  
                  {/* Wallet Encryption */}
                  {activeTab === 'walletEncryption' && (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Wallet Encryption</h2>
                        
                        {!settings.walletEncryptionEnabled && (
                          <button
                            onClick={() => setShowEncryptionSetup(true)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                          >
                            Set Up Encryption
                          </button>
                        )}
                      </div>
                      
                      {settings.walletEncryptionEnabled ? (
                        <WalletEncryptionSetup 
                          isSetup={false} 
                          onClose={() => setShowEncryptionSetup(false)} 
                        />
                      ) : showEncryptionSetup ? (
                        <WalletEncryptionSetup 
                          isSetup={true} 
                          onClose={() => setShowEncryptionSetup(false)} 
                        />
                      ) : (
                        <div className="bg-yellow-900 bg-opacity-20 p-4 rounded-lg mb-6">
                          <div className="flex items-start">
                            <svg className="w-6 h-6 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            <div>
                              <h3 className="font-medium">Your wallet data is not encrypted</h3>
                              <p className="text-sm text-yellow-300 mt-1">
                                For maximum security, add encryption to protect your wallet data with a password.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Active Sessions */}
                  {activeTab === 'sessions' && (
                    <ActiveSessions />
                  )}
                  
                  {/* Activity Log */}
                  {activeTab === 'activityLog' && (
                    <SecurityEventLog />
                  )}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400">Error loading security settings. Please try again.</p>
                  <button
                    onClick={() => fetchSecuritySettings()}
                    className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <footer className="container mx-auto px-4 py-6 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm">
            CERBERUS Bot Platform | Created: 2025-05-06 20:33:16 UTC | User: CERBERUSCHAIN
          </p>
        </footer>
      </div>
      
      {/* 2FA Setup Modal */}
      {showTwoFactorSetup && (
        <TwoFactorSetup 
          currentMethod={settings?.twoFactorAuthType} 
          isEnabled={settings?.twoFactorAuthEnabled || false}
          onClose={() => setShowTwoFactorSetup(false)}
          onComplete={() => {
            setShowTwoFactorSetup(false);
            fetchSecuritySettings();
          }}
        />
      )}
    </ProtectedRoute>
  );
}