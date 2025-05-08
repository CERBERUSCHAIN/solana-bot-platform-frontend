// CERBERUS Bot - IP Whitelist Manager Component
// Created: 2025-05-06 21:03:30 UTC
// Author: CERBERUSCHAIN

import React, { useState, useEffect } from 'react';
import { useSecurity } from '../../contexts/SecurityContext';
import { IPWhitelistEntry } from '../../types/security';

export const IPWhitelistManager: React.FC = () => {
  const { 
    settings, 
    ipWhitelist, 
    isLoading, 
    // Removed unused 'error' variable
    fetchIPWhitelist, 
    addIPWhitelist, 
    removeIPWhitelist, 
    updateSecuritySettings 
  } = useSecurity();
  
  const [isAdding, setIsAdding] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [ipLabel, setIpLabel] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [deletingIpId, setDeletingIpId] = useState<string | null>(null);
  
  useEffect(() => {
    fetchIPWhitelist();
  }, [fetchIPWhitelist]); // Added missing dependency
  
  const handleToggleWhitelist = async (enabled: boolean) => {
    try {
      await updateSecuritySettings({ ipWhitelistEnabled: enabled });
    } catch (error) {
      console.error('Error toggling IP whitelist:', error);
    }
  };
  
  const handleAddIP = async () => {
    // Very basic IP validation
    const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
      setValidationError('Please enter a valid IP address (e.g. 192.168.1.1)');
      return;
    }
    
    if (!ipLabel) {
      setValidationError('Please enter a label for this IP address');
      return;
    }
    
    try {
      await addIPWhitelist(ipAddress, ipLabel);
      setIsAdding(false);
      setIpAddress('');
      setIpLabel('');
      setValidationError(null);
    } catch (error) {
      console.error('Error adding IP to whitelist:', error);
      setValidationError('Failed to add IP address. Please try again.');
    }
  };
  
  const handleRemoveIP = async (id: string) => {
    setDeletingIpId(id);
    try {
      await removeIPWhitelist(id);
    } catch (error) {
      console.error('Error removing IP from whitelist:', error);
    } finally {
      setDeletingIpId(null);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">IP Whitelist</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-medium">IP Whitelist Protection</p>
            <p className="text-sm text-gray-400">Only allow login from pre-approved IP addresses</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              id="ipWhitelistToggle"
              className="sr-only peer"
              checked={settings?.ipWhitelistEnabled || false}
              onChange={(e) => handleToggleWhitelist(e.target.checked)}
              aria-label="Toggle IP whitelist protection"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            <span className="sr-only">Toggle IP whitelist protection</span>
          </label>
        </div>
        
        {settings?.ipWhitelistEnabled && (
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-sm">
              {ipWhitelist.length === 0 
                ? 'No IP addresses have been whitelisted yet. Add your current IP address to get started.' 
                : 'Only the IP addresses on your whitelist will be allowed to login to your account.'}
            </p>
          </div>
        )}
      </div>
      
      {settings?.ipWhitelistEnabled && (
        <>
          {/* Whitelist Table */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Whitelisted IPs</h3>
              <button
                onClick={() => setIsAdding(true)}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm text-white"
                disabled={isAdding}
              >
                Add IP
              </button>
            </div>
            
            {isLoading ? (
              <div className="bg-gray-750 rounded-lg p-6 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : ipWhitelist.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-750">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Label</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Added</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Used</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-800">
                    {ipWhitelist.map((entry: IPWhitelistEntry) => (
                      <tr key={entry.id} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {entry.ipAddress}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {entry.label}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(entry.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(entry.lastUsed)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => handleRemoveIP(entry.id)}
                            className="text-red-400 hover:text-red-300"
                            disabled={deletingIpId === entry.id}
                          >
                            {deletingIpId === entry.id ? (
                              <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Removing
                              </span>
                            ) : 'Remove'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-gray-750 rounded-lg p-6 text-center">
                <p className="text-gray-400">No IP addresses are currently whitelisted.</p>
              </div>
            )}
          </div>
          
          {/* Add IP Form */}
          {isAdding && (
            <div className="bg-gray-750 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-medium mb-4">Add IP Address</h4>
              
              {validationError && (
                <div className="bg-red-900 bg-opacity-20 text-red-500 p-3 rounded-lg mb-4">
                  {validationError}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="ip-address" className="block text-sm font-medium text-gray-400 mb-1">
                    IP Address
                  </label>
                  <input
                    id="ip-address"
                    type="text"
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    placeholder="e.g. 192.168.1.1"
                  />
                </div>
                
                <div>
                  <label htmlFor="ip-label" className="block text-sm font-medium text-gray-400 mb-1">
                    Label
                  </label>
                  <input
                    id="ip-label"
                    type="text"
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={ipLabel}
                    onChange={(e) => setIpLabel(e.target.value)}
                    placeholder="e.g. Home Office, Work"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setIpAddress('');
                    setIpLabel('');
                    setValidationError(null);
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddIP}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
                >
                  Add IP
                </button>
              </div>
            </div>
          )}
          
          {/* Current IP Section */}
          <div className="bg-gray-750 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-medium">Your Current IP Address</h4>
                <p className="text-sm text-gray-400">This is the IP address you&apos;re currently using to access CERBERUS Bot Platform</p>
              </div>
              <button
                onClick={() => {
                  // In a real implementation, this would fetch the current IP from the server
                  // and pre-fill the form
                  setIpAddress('123.45.67.89'); // This would be dynamic in real app
                  setIpLabel('Current Location');
                  setIsAdding(true);
                }}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm text-white"
              >
                Add Current IP
              </button>
            </div>
            <div className="mt-4 p-3 bg-gray-700 rounded font-mono">
              123.45.67.89
            </div>
          </div>
        </>
      )}
    </div>
  );
};