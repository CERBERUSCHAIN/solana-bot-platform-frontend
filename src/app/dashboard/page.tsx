"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-2xl font-bold text-white mb-6" data-cy="dashboard-title">
        Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow" data-cy="performance-chart">
          <h2 className="text-xl font-semibold text-white mb-4">Performance</h2>
          <div className="h-40 bg-gray-700 rounded flex items-center justify-center">
            Chart Placeholder
          </div>
          <div className="mt-4" data-cy="total-profit">
            <span className="text-gray-400">Total Profit:</span>
            <span className="text-green-400 ml-2">+408.92 USD (10.2%)</span>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-white mb-4">Active Bots</h2>
          <div data-cy="bot-card" className="bg-gray-700 p-4 rounded mb-3 cursor-pointer">
            <div className="flex justify-between">
              <span>DCA Bot</span>
              <span className="bg-green-500 px-2 py-0.5 rounded text-xs">Active</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">SOL/USDT • Binance</div>
          </div>
          
          <div data-cy="bot-card" className="bg-gray-700 p-4 rounded cursor-pointer">
            <div className="flex justify-between">
              <span>Grid Bot</span>
              <span className="bg-yellow-500 px-2 py-0.5 rounded text-xs">Paused</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">ETH/USDT • Kraken</div>
          </div>
        </div>
      </div>
    </div>
  );
}
