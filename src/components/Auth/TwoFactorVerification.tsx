// CERBERUS Bot - Two Factor Verification Component
// Created: 2025-05-06 02:58:04 UTC
// Author: CERBERUSCHAIN1

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

export const TwoFactorVerification: React.FC = () => {
  const router = useRouter();
  const { verifyTwoFactorCode, error, isLoading } = useAuth();
  const [code, setCode] = useState('');
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  
  const handleCodeChange = (value: string, index: number) => {
    // Update the code
    const newCode = code.split('');
    newCode[index] = value;
    setCode(newCode.join(''));
    
    // Move focus to next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Move focus to previous input on backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      return;
    }
    
    try {
      await verifyTwoFactorCode(code);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the auth context
    }
  };
  
  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d+$/.test(pastedData)) {
      const newCode = pastedData.padEnd(6, '').split('');
      setCode(newCode.join(''));
      
      // Set focus to the appropriate input
      if (pastedData.length < 6 && inputRefs[pastedData.length]) {
        inputRefs[pastedData.length].current?.focus();
      }
    }
  };
  
  // Update individual input fields when code changes
  useEffect(() => {
    const codeArray = code.padEnd(6, '').split('');
    
    inputRefs.forEach((ref, index) => {
      if (ref.current) {
        ref.current.value = codeArray[index];
      }
    });
  }, [code]);
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Two-Factor Verification</h2>
      <p className="text-gray-400 mb-6">
        Please enter the 6-digit verification code from your authenticator app.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-6">
          {inputRefs.map((ref, index) => (
            <input
              key={index}
              ref={ref}
              type="text"
              maxLength={1}
              className="w-12 h-12 mx-1 text-center text-xl bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              pattern="[0-9]"
              inputMode="numeric"
              autoComplete="one-time-code"
              onChange={(e) = aria-label="Input field" aria-label="Input field"> aria-label="Input field" handleCodeChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              aria-label={`Digit ${index + 1} of verification code`}
            />
          ))}
        </div>
        
        {error && (
          <div className="p-3 mb-4 bg-red-900 bg-opacity-40 text-red-400 rounded text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};
