// CERBERUS Bot - Token Price Chart Component
// Created: 2025-05-06 15:51:38 UTC
// Author: CERBERUSCHAIN

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface TokenPriceChartProps {
  priceData: Array<{timestamp: number, price: number, volume: number}>;
  timeframe: string;
}

export const TokenPriceChart: React.FC<TokenPriceChartProps> = ({ priceData, timeframe }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    if (!chartRef.current || priceData.length === 0) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;
    
    // Format data for chart
    const labels = priceData.map(item => {
      const date = new Date(item.timestamp);
      switch (timeframe) {
        case '1h': return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        case '1d': return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        case '1w': return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        case '1m': return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        case 'all': return date.toLocaleDateString([], { year: 'numeric', month: 'short' });
        default: return date.toLocaleDateString();
      }
    });
    
    const prices = priceData.map(item => item.price);
    const volumes = priceData.map(item => item.volume);
    
    // Calculate min and max for better scale
    const minPrice = Math.min(...prices) * 0.95;
    const maxPrice = Math.max(...prices) * 1.05;
    
    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Price',
            data: prices,
            borderColor: '#6366f1', // Indigo color
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Volume',
            data: volumes,
            borderColor: 'rgba(100, 116, 139, 0.8)', // Slate color
            backgroundColor: 'rgba(100, 116, 139, 0.2)',
            borderWidth: 1,
            type: 'bar',
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(75, 85, 99, 0.2)'
            },
            ticks: {
              color: 'rgba(156, 163, 175, 0.8)'
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            min: minPrice,
            max: maxPrice,
            grid: {
              color: 'rgba(75, 85, 99, 0.2)'
            },
            ticks: {
              color: 'rgba(156, 163, 175, 0.8)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
              color: 'rgba(75, 85, 99, 0.2)'
            },
            ticks: {
              color: 'rgba(156, 163, 175, 0.8)'
            }
          }
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(99, 102, 241, 0.5)',
            borderWidth: 1,
            callbacks: {
              label: (context) => {
                if (context.dataset.label === 'Price') {
                  return `Price: $${context.parsed.y.toFixed(6)}`;
                } else {
                  return `Volume: $${context.parsed.y.toLocaleString()}`;
                }
              }
            }
          },
          legend: {
            display: true,
            labels: {
              color: 'rgba(156, 163, 175, 0.8)'
            }
          }
        }
      }
    });
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [priceData, timeframe]);
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 h-96">
      <canvas ref={chartRef} />
    </div>
  );
};