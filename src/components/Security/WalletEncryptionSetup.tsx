// CERBERUS Bot - Wallet Encryption Setup Component
// Created: 2025-05-06 21:10:26 UTC
// Author: CERBERUSCHAINWalletEncryptionSetup.tsx is NOT complete

import React, { useState, useEffect } from 'react';
import { useSecurity } from '../../contexts/SecurityContext';

interface WalletEncryptionSetupProps {
  isSetup: boolean;
  onClose: () => void;
}

export const WalletEncryptionSetup: React.FC<WalletEncryptionSetupProps> = ({ isSetup, onClose }) => {
  const { 
    encryptionStatus, 
    fetchEncryptionStatus, 
    setupWalletEncryption, 
    changeEncryptionPassword,
    testEncryptionPassword
  } = useSecurity();
  
  const [step, setStep] = useState<'start' | 'create' | 'confirm' | 'success' | 'change' | 'current'>('start');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('weak');
  
  useEffect(() => {
    if (!isSetup) {
      fetchEncryptionStatus();
    }
  }, [isSetup]);
  
  useEffect(() => {
    // Check password strength
    if (password.length === 0) {
      setPasswordStrength('weak');
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [password]);
  
  const handleStartSetup = () => {
    setStep('create');
  };
  
  const handleCreatePassword = () => {
    // Validate password
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (passwordStrength === 'weak') {
      setError('Please create a stronger password');
      return;
    }
    
    setError(null);
    setStep('confirm');
  };
  
  const handleConfirmPassword = async () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (isSetup) {
        // Set up encryption
        const result = await setupWalletEncryption(password);
        if (result.success) {
          setStep('success');
        } else {
          setError('Failed to set up encryption. Please try again.');
        }
      } else {
        // Change encryption password
        const isValid = await testEncryptionPassword(currentPassword);
        if (!isValid) {
          setError('Current password is incorrect');
          setStep('current');
        } else {
          const success = await changeEncryptionPassword(currentPassword, password);
          if (success) {
            setStep('success');
          } else {
            setError('Failed to change encryption password. Please try again.');
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangePassword = () => {
    setStep('current');
  };
  
  const handleVerifyCurrentPassword = async () => {
    if (currentPassword.length < 8) {
      setError('Please enter your current password');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const isValid = await testEncryptionPassword(currentPassword);
      if (isValid) {
        setStep('create');
      } else {
        setError('Current password is incorrect');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSetup) {
    return (
      <div className="bg-gray-750 rounded-lg shadow-lg p-6">
        {step === 'start' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Set Up Wallet Encryption</h3>
            <p className="text-gray-400 mb-6">
              Wallet encryption provides an extra layer of security by encrypting your sensitive wallet data. 
              You'll need to enter your encryption password to perform wallet operations.
            </p>
            
            <div className="bg-yellow-900 bg-opacity-20 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-yellow-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <p className="font-medium mb-1">Important</p>
                  <p className="text-sm text-yellow-300">
                    If you forget your encryption password, your wallet data cannot be recovered. 
                    Make sure to use a strong password and keep it in a safe place.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleStartSetup}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {step === 'create' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Create Encryption Password</h3>
            
            {error && (
              <div className="bg-red-900 bg-opacity-20 text-red-500 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="encryption-password" className="block text-sm font-medium text-gray-400 mb-1">
                Encryption Password
              </label>
              <input
                id="encryption-password"
                type="password"
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setPassword(e.target.value)}
                placeholder="Enter a strong password"
              />
              
              <div className="mt-2">
                <div className="text-xs text-gray-400 mb-1">Password strength</div>
                <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      passwordStrength === 'weak' ? 'bg-red-500 w-1/3' :
                      passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                      'bg-green-500 w-full'
                    }`}
                  ></div>
                </div>
                
                <div className="text-xs mt-2 flex justify-between">
                  <span className={passwordStrength === 'weak' ? 'text-red-400' : 'text-gray-400'}>Weak</span>
                  <span className={passwordStrength === 'medium' ? 'text-yellow-400' : 'text-gray-400'}>Medium</span>
                  <span className={passwordStrength === 'strong' ? 'text-green-400' : 'text-gray-400'}>Strong</span>
                </div>
              </div>
              
              <ul className="mt-3 space-y-1 text-xs text-gray-400">
                <li className={password.length >= 8 ? 'text-green-400' : ''}>
                  • At least 8 characters
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-green-400' : ''}>
                  • At least one uppercase letter
                </li>
                <li className={/[a-z]/.test(password) ? 'text-green-400' : ''}>
                  • At least one lowercase letter
                </li>
                <li className={/[0-9]/.test(password) ? 'text-green-400' : ''}>
                  • At least one number
                </li>
                <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-400' : ''}>
                  • At least one special character
                </li>
              </ul>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setStep('start')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
              >
                Back
              </button>
              <button
                onClick={handleCreatePassword}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                disabled={password.length < 8 || passwordStrength === 'weak'}
              >
                Continue
              </button>
            </div>
          </div>
        )}
        
        {step === 'confirm' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Confirm Encryption Password</h3>
            
            {error && (
              <div className="bg-red-900 bg-opacity-20 text-red-500 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={confirmPassword}
                onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setStep('create')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={handleConfirmPassword}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                disabled={isLoading || !confirmPassword}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting Up...
                  </span>
                ) : 'Set Up Encryption'}
              </button>
            </div>
          </div>
        )}
        
        {step === 'success' && (
          <div>
            <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="font-medium">Wallet Encryption Set Up Successfully</h3>
                  <p className="text-sm text-green-300 mt-1">
                    Your wallet data is now encrypted. You'll need to enter your password to access your wallets.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    // Manage encryption settings
    return (
      <div>
        {encryptionStatus ? (
          <div>
            <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <div>
                  <h3 className="font-medium">Wallet Encryption is Active</h3>
                  <p className="text-sm text-green-300 mt-1">
                    Your wallet data is encrypted and protected.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-750 rounded-lg p-4">
                <div className="text-sm text-gray-400">Encryption Algorithm</div>
                <div className="font-medium">{encryptionStatus.encryptionAlgorithm}</div>
              </div>
              
              <div className="bg-gray-750 rounded-lg p-4">
                <div className="text-sm text-gray-400">Last Updated</div>
                <div className="font-medium">
                  {encryptionStatus.lastUpdated 
                    ? new Date(encryptionStatus.lastUpdated).toLocaleString() 
                    : 'N/A'}
                </div>
              </div>
              
              <div className="bg-gray-750 rounded-lg p-4">
                <div className="text-sm text-gray-400">Encryption Strength</div>
                <div className="font-medium capitalize">{encryptionStatus.strength}</div>
              </div>
              
              <div className="bg-gray-750 rounded-lg p-4">
                <div className="text-sm text-gray-400">Encrypted Wallets</div>
                <div className="font-medium">{encryptionStatus.encryptedWallets} of {encryptionStatus.encryptedWallets + encryptionStatus.unencryptedWallets}</div>
              </div>
            </div>
            
            {step !== 'create' && step !== 'confirm' && step !== 'current' && step !== 'success' && (
              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                >
                  Change Encryption Password
                </button>
              </div>
            )}
            
            {/* Current Password Step */}
            {step === 'current' && (
              <div className="bg-gray-750 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Enter Current Password</h3>
                
                {error && (
                  <div className="bg-red-900 bg-opacity-20 text-red-500 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                <div className="mb-6">
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-400 mb-1">
                    Current Encryption Password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={currentPassword}
                    onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setStep('start');
                      setCurrentPassword('');
                      setError(null);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyCurrentPassword}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                    disabled={isLoading || !currentPassword}
                  >
                    {isLoading ? 'Verifying...' : 'Continue'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Create New Password Step */}
            {step === 'create' && (
              <div className="bg-gray-750 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Create New Password</h3>
                
                {error && (
                  <div className="bg-red-900 bg-opacity-20 text-red-500 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="new-encryption-password" className="block text-sm font-medium text-gray-400 mb-1">
                    New Encryption Password
                  </label>
                  <input
                    id="new-encryption-password"
                    type="password"
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={password}
                    onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                  />
                  
                  <div className="mt-2">
                    <div className="text-xs text-gray-400 mb-1">Password strength</div>
                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          passwordStrength === 'weak' ? 'bg-red-500 w-1/3' :
                          passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                          'bg-green-500 w-full'
                        }`}
                      ></div>
                    </div>
                    
                    <div className="text-xs mt-2 flex justify-between">
                      <span className={passwordStrength === 'weak' ? 'text-red-400' : 'text-gray-400'}>Weak</span>
                      <span className={passwordStrength === 'medium' ? 'text-yellow-400' : 'text-gray-400'}>Medium</span>
                      <span className={passwordStrength === 'strong' ? 'text-green-400' : 'text-gray-400'}>Strong</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setStep('current');
                      setPassword('');
                      setError(null);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreatePassword}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                    disabled={password.length < 8 || passwordStrength === 'weak'}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            
            {/* Confirm New Password Step */}
            {step === 'confirm' && (
              <div className="bg-gray-750 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Confirm New Password</h3>
                
                {error && (
                  <div className="bg-red-900 bg-opacity-20 text-red-500 p-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                
                <div className="mb-6">
                  <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirm-new-password"
                    type="password"
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={confirmPassword}
                    onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setStep('create');
                      setConfirmPassword('');
                      setError(null);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmPassword}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                    disabled={isLoading || !confirmPassword}
                  >
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Success Step */}
            {step === 'success' && (
              <div className="bg-gray-750 rounded-lg p-6">
                <div className="bg-green-900 bg-opacity-20 p-4 rounded-lg mb-6">
                  <div className="flex items-start">
                    <svg className="w-6 h-6 text-green-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <h3 className="font-medium">Password Changed Successfully</h3>
                      <p className="text-sm text-green-300 mt-1">
                        Your encryption password has been updated. Please remember your new password.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="ml-3">Loading encryption status...</span>
          </div>
        )}
      </div>
    );
  }
};
