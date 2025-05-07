// CERBERUS Bot - Dashboard Page
// Created: 2025-05-06 02:58:04 UTC
// Author: CERBERUSCHAIN1

import React from 'react';
import Head from 'next/head';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import { Dashboard } from '../components/Dashboard/Dashboard';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will happen automatically via ProtectedRoute
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 text-white">
        <Head>
          <title>CERBERUS Bot | Dashboard</title>
        </Head>
        
        <header className="bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">CERBERUS Bot Platform</h1>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                Welcome, <span className="text-indigo-400">{user?.username || 'CERBERUSCHAIN1'}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white"
              >
                Logout
              </button>
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">{user?.username?.[0]?.toUpperCase() || 'C'}</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Trading Dashboard</h2>
            
            <div className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
          
          <Dashboard userId={user?.id || 'user123'} />
        </main>
        
        <footer className="container mx-auto px-4 py-6 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm">
            CERBERUS Bot Platform | Created: 2025-05-06 02:58:04 UTC | User: CERBERUSCHAIN1
          </p>
        </footer>
      </div>
    </ProtectedRoute>
  );
}