// CERBERUS Bot - Login Page
// Created: 2025-05-06 02:58:04 UTC
// Author: CERBERUSCHAIN1

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { TwoFactorVerification } from '../../components/Auth/TwoFactorVerification';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithWallet, error, isLoading, isTwoFactorRequired } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the auth context
      // If 2FA is required, the UI will show the verification form
    }
  };
  
  const handleConnectWallet = async () => {
    try {
      // In a real app, you would get the wallet adapter from a wallet context
      // const { adapter } = useWallet();
      // await loginWithWallet(adapter);
      
      // For now, just show an alert
      alert('This feature requires wallet integration');
    } catch (err) {
      console.error('Wallet connection error:', err);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center">
      <Head>
        <title>CERBERUS Bot | Login</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">CERBERUS Bot Platform</h1>
            <p className="text-gray-400 mt-2">Login to access your trading bots</p>
          </div>
          
          {isTwoFactorRequired ? (
            <TwoFactorVerification />
          ) : (
            <>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      data-cy="email-input" // Added data-cy attribute
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      data-cy="password-input" // Added data-cy attribute
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded"
                      /> aria-label="Input field"
                      <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                        Remember me
                      </label>
                    </div>
                    
                    <Link href="/auth/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
                      Forgot password?
                    </Link>
                  </div>
                  
                  {error && (
                    <div className="p-3 mb-4 bg-red-900 bg-opacity-40 text-red-400 rounded text-sm" data-cy="login-error">
                      {error}
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
                    disabled={isLoading}
                    data-cy="login-button" // Added data-cy attribute
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
                
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center transition-colors"
                      onClick={handleConnectWallet}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                      Solana Wallet
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300">
                    Register now
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <footer className="mt-auto py-4 text-center">
        <p className="text-gray-500 text-sm">
          CERBERUS Bot Platform | Created: 2025-05-06 02:58:04 UTC | User: CERBERUSCHAIN1
        </p>
      </footer>
    </div>
  );
}
