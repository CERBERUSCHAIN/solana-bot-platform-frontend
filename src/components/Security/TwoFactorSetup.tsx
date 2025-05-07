// CERBERUS Bot - Two Factor Authentication Setup Component
// Created: 2025-05-06 20:33:16 UTC
// Author: CERBERUSCHAINStill isnt complete code.

import React, { useState } from 'react';
import { TwoFactorAuthType } from '../../types/security';
import { useSecurity } from '../../contexts/SecurityContext';

interface TwoFactorSetupProps {
  currentMethod: TwoFactorAuthType | null;
  isEnabled: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ 
  currentMethod,
  isEnabled, 
  onClose, 
  onComplete 
}) => {
  const { enableTwoFactorAuth, verifyTwoFactorSetup, disableTwoFactorAuth } = useSecurity();
  
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorAuthType>(currentMethod || 'app');
  const [step, setStep] = useState<'select' | 'setup' | 'verify' | 'complete' | 'disable'>('select');
  const [setupData, setSetupData] = useState<{
    qrCodeUrl?: string;
    secretKey?: string;
    recoveryKeys?: string[];
    verificationRequired: boolean;
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoveryKeys, setRecoveryKeys] = useState<string[]>([]);
  const [showRecoveryKeys, setShowRecoveryKeys] = useState(false);
  
  const handleSelectMethod = (method: TwoFactorAuthType) => {
    setSelectedMethod(method);
  };
  
  const handleStartSetup = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await enableTwoFactorAuth(selectedMethod);
      
      if (result.success) {
        setSetupData(result.setupData);
        setStep('setup');
      } else {
        setError('Failed to start 2FA setup. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while setting up 2FA.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifySetup = async () => {
    if (verificationCode.length < 6) {
      setError('Please enter a valid verification code.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await verifyTwoFactorSetup(selectedMethod, verificationCode);
      
      if (result.success) {
        if (result.recoveryKeys && result.recoveryKeys.length > 0) {
          setRecoveryKeys(result.recoveryKeys);
          setShowRecoveryKeys(true);
        }
        setStep('complete');
      } else {
        setError('Verification failed. Please check your code and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisable2FA = async () => {
    if (verificationCode.length < 6) {
      setError('Please enter a valid verification code.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await disableTwoFactorAuth(verificationCode);
      
      if (success) {
        onComplete();
      } else {
        setError('Failed to disable 2FA. Please check your code and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while disabling 2FA.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">
            {isEnabled ? 'Manage Two-Factor Authentication' : 'Set Up Two-Factor Authentication'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900 bg-opacity-20 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* Select Method Step */}
        {step === 'select' && (
          <div>
            {isEnabled ? (
              <div>
                <p className="mb-4">
                  You currently have two-factor authentication enabled using {currentMethod === 'app' ? 'an authenticator app' : 
                                                                             currentMethod === 'sms' ? 'SMS verification' : 'email verification'}.
                </p>
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => {
                      setSelectedMethod(currentMethod || 'app');
                      handleStartSetup();
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                    disabled={isLoading}
                  >
                    Change 2FA Method
                  </button>
                  <button
                    onClick={() => setStep('disable')}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                    disabled={isLoading}
                  >
                    Disable 2FA
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-4">
                  Choose how you want to receive your two-factor authentication codes:
                </p>
                <div className="space-y-4">
                  <div 
                    onClick={() => handleSelectMethod('app')}
                    className={`p-4 rounded-lg border ${
                      selectedMethod === 'app' 
                        ? 'border-indigo-500 bg-indigo-900 bg-opacity-20' 
                        : 'border-gray-700 bg-gray-750 hover:bg-gray-700'
                    } cursor-pointer`}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio"
                        checked={selectedMethod === 'app'} 
                        onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleSelectMethod('app')}
                        className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600"
                      />
                      <div className="ml-3">
                        <h4 className="font-medium">Authenticator App</h4>
                        <p className="text-sm text-gray-400">
                          Use an authenticator app like Google Authenticator or Authy
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => handleSelectMethod('sms')}
                    className={`p-4 rounded-lg border ${
                      selectedMethod === 'sms' 
                        ? 'border-indigo-500 bg-indigo-900 bg-opacity-20' 
                        : 'border-gray-700 bg-gray-750 hover:bg-gray-700'
                    } cursor-pointer`}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio"
                        checked={selectedMethod === 'sms'} 
                        onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleSelectMethod('sms')}
                        className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600"
                      />
                      <div className="ml-3">
                        <h4 className="font-medium">SMS Verification</h4>
                        <p className="text-sm text-gray-400">
                          Receive verification codes via SMS text message
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => handleSelectMethod('email')}
                    className={`p-4 rounded-lg border ${
                      selectedMethod === 'email' 
                        ? 'border-indigo-500 bg-indigo-900 bg-opacity-20' 
                        : 'border-gray-700 bg-gray-750 hover:bg-gray-700'
                    } cursor-pointer`}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio"
                        checked={selectedMethod === 'email'} 
                        onChange={() = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleSelectMethod('email')}
                        className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600"
                      />
                      <div className="ml-3">
                        <h4 className="font-medium">Email Verification</h4>
                        <p className="text-sm text-gray-400">
                          Receive verification codes via email
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleStartSetup}
                    className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Setting up...' : 'Continue'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Setup Step */}
        {step === 'setup' && setupData && (
          <div>
            {selectedMethod === 'app' ? (
              <div>
                <p className="mb-4">
                  Scan this QR code with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator).
                </p>
                
                {setupData.qrCodeUrl && (
                  <div className="flex justify-center mb-4">
                    <img 
                      src={setupData.qrCodeUrl} 
                      alt="QR Code" 
                      className="w-48 h-48 bg-white p-2 rounded"
                    />
                  </div>
                )}
                
                <p className="mb-2">
                  Or manually enter this secret key:
                </p>
                <div className="bg-gray-750 p-3 rounded font-mono text-center mb-6">
                  {setupData.secretKey}
                </div>
              </div>
            ) : selectedMethod === 'sms' ? (
              <p className="mb-4">
                We've sent a verification code to your phone number. Enter the code below to verify your phone.
              </p>
            ) : (
              <p className="mb-4">
                We've sent a verification code to your email address. Enter the code below to verify your email.
              </p>
            )}
            
            <div className="mb-4">
              <label htmlFor="verification-code" className="block text-sm font-medium text-gray-400 mb-1">
                Verification Code
              </label>
              <input
                id="verification-code"
                type="text"
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg tracking-widest"
                value={verificationCode}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setVerificationCode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                placeholder="000000"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifySetup}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                disabled={isLoading || verificationCode.length < 6}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        )}
        
        {/* Complete Step */}
        {step === 'complete' && (
          <div>
            {showRecoveryKeys ? (
              <div>
                <div className="bg-yellow-900 bg-opacity-20 p-4 rounded-lg mb-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <p className="font-medium mb-1">Save your recovery keys</p>
                      <p className="text-sm text-yellow-300">
                        Store these recovery keys in a safe place. You can use them to regain access to your account if you lose your device.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-750 p-4 rounded mb-6">
                  <h4 className="font-medium mb-3">Recovery Keys</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {recoveryKeys.map((key, index) => (
                      <div key={index} className="bg-gray-700 p-2 rounded font-mono text-center">
                        {key}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={onComplete}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                  >
                    I've Saved My Recovery Keys
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg mb-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication Enabled</h3>
                      <p className="text-sm text-green-300 mt-1">
                        Your account is now protected with two-factor authentication.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={onComplete}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Disable 2FA Step */}
        {step === 'disable' && (
          <div>
            <div className="bg-red-900 bg-opacity-20 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <div>
                  <h3 className="font-medium">Disable Two-Factor Authentication?</h3>
                  <p className="text-sm text-red-300 mt-1">
                    This will reduce the security of your account. Are you sure you want to continue?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="disable-verification-code" className="block text-sm font-medium text-gray-400 mb-1">
                Enter your current verification code to confirm:
              </label>
              <input
                id="disable-verification-code"
                type="text"
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-lg tracking-widest"
                value={verificationCode}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setVerificationCode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                placeholder="000000"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setStep('select')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDisable2FA}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                disabled={isLoading || verificationCode.length < 6}
              >
                {isLoading ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

