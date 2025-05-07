// CERBERUS Bot - Protected Route Component
// Created: 2025-05-06 02:58:04 UTC
// Author: CERBERUSCHAIN1

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated
      router.push({
        pathname: '/auth/login',
        query: { returnUrl: router.asPath }
      });
    }
  }, [user, isLoading, router]);
  
  // Show loading indicator while checking auth state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="flex flex-col items-center">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-white mt-4">Loading...</span>
        </div>
      </div>
    );
  }
  
  // If authenticated, render the children
  return <>{children}</>;
};