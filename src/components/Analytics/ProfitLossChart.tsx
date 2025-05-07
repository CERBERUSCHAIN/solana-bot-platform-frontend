// CERBERUS Bot - Profit/Loss Chart Component
// Created: 2025-05-06 16:45:54 UTC
// Author: CERBERUSCHAINYou choose

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ProfitLossData } from '../../types/analytics';

// Register Chart.js components
Chart.register(...registerables);

interface ProfitLossChartProps {
  data: ProfitLossData;
}

export const ProfitLossChart: React.FC<ProfitLossChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Determine gradient color based on profit/loss
    const isProfitable = data.netProfitLoss >= 0;
    const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
    
    if (isProfitable) {
      gradientFill.addColorStop(0, 'rgba(52, 211, 153, 0.2)'); // Green with opacity
      gradientFill.addColorStop(1, 'rgba(52, 211, 153, 0.0)');
    } else {
      gradientFill.addColorStop(0, 'rgba(248, 113, 113, 0.2)'); // Red with opacity
      gradientFill.addColorStop(1, 'rgba(248, 113, 113, 0.0)');
    }

    // Format data for chart
    const labels = data.timestamps.map(timestamp => {
      const date = new Date(timestamp);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    });

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Profit/Loss',
            data: data.values,
            borderColor: isProfitable ? 'rgb(52, 211, 153)' : 'rgb(248, 113, 113)',
            backgroundColor: gradientFill,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: isProfitable ? 'rgb(52, 211, 153)' : 'rgb(248, 113, 113)',
            pointHoverBorderColor: '#fff',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 6,
            callbacks: {
              label: (context) => `Profit/Loss: $${context.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: 'rgba(148, 163, 184, 0.8)',
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 7
            }
          },
          y: {
            grid: {
              color: 'rgba(71, 85, 105, 0.2)',
            },
            ticks: {
              color: 'rgba(148, 163, 184, 0.8)',
              callback: (value) => `$${value.toLocaleString()}`
            },
            beginAtZero: false
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="w-full h-80">
      <canvas ref={chartRef}></canvas>
      <div className="mt-4 flex justify-between text-sm">
        <div>
          <div className="text-gray-400">Net P&L</div>
          <div className={`font-medium ${data.netProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${data.netProfitLoss.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-gray-400">Change</div>
          <div className={`font-medium ${data.percentageChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {data.percentageChange >= 0 ? '+' : ''}{data.percentageChange.toFixed(2)}%
          </div>
        </div>
        {data.compareToMarket !== undefined && (
          <div>
            <div className="text-gray-400">vs Market</div>
            <div className={`font-medium ${data.compareToMarket >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {data.compareToMarket >= 0 ? '+' : ''}{data.compareToMarket.toFixed(2)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};