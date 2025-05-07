// CERBERUS Bot - Create Strategy Page
// Created: 2025-05-07 05:09:07 UTC
// Author: CERBERUSCHAIN

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout/Dashboard';
import { StrategyBuilder } from '../../../components/Strategy/StrategyBuilder';

export default function CreateStrategyPage() {
  const router = useRouter();
  
  const handleSave = async (strategy: any) => {
    try {
      // Here you'd make an API call to save the strategy
      // const response = await fetch('/api/strategies', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(strategy),
      // });
      
      // For demo, simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success notification or toast
      alert('Strategy created successfully');
      
      // Redirect to strategy list
      router.push('/trading/strategies');
    } catch (error) {
      console.error('Failed to create strategy:', error);
      alert('Failed to create strategy');
    }
  };
  
  const handleCancel = () => {
    router.push('/trading/strategies');
  };
  
  return (
    <Layout>
      <Head>
        <title>Create Strategy | CERBERUS Bot Platform</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create Trading Strategy</h1>
        
        <StrategyBuilder 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
}