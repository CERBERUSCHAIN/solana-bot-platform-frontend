// CERBERUS Bot - Forgot Password Page
// Created: 2025-05-06 02:58:04 UTC
// Author: CERBERUSCHAIN1

import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const { requestPasswordReset, error, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch (err) {
      // Error is handled by the auth context
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center">
      <Head>
        <title>CERBERUS Bot | Forgot Password</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">CERBERUS Bot Platform</h1>
            <p className="text-gray-400 mt-2">Reset your password</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            {submitted ? (
              <div className="text-center">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
                <p className="text-gray-400 mb-6">
                  If an account exists with {email}, we've sent instructions to reset your password.
                </p>
                <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300">
                  Back to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="text-gray-400 mb-6">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
                
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
                  />
                </div>
                
                {error && (
                  <div className="p-3 mb-4 bg-red-900 bg-opacity-40 text-red-400 rounded text-sm">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300">
                Login
              </Link>
            </p>
          </div>
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