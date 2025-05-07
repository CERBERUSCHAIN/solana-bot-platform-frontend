// CERBERUS Bot - Portfolio Distribution Chart Component
// Created: 2025-05-06 16:45:54 UTC
// Author: CERBERUSCHAINYou choose

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { PortfolioDistribution } from '../../types/analytics';

// Register Chart.js components
Chart.register(...registerables);

interface PortfolioDistributionChartProps {
  data: PortfolioDistribution;
}

export const PortfolioDistributionChart: React.FC<PortfolioDistributionChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Color palette for chart segments
  const colorPalette = [
    'rgba(99, 102, 241, 0.8)',   // Indigo
    'rgba(52, 211, 153, 0.8)',   // Green
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(249, 115, 22, 0.8)',   // Orange
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(245, 158, 11, 0.8)',   // Amber
    'rgba(16, 185, 129, 0.8)',   // Emerald
    'rgba(244, 63, 94, 0.8)',    // Rose
    'rgba(14, 165, 233, 0.8)',   // Sky
  ];

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!chartRef.current || !data || !data.items || data.items.length === 0) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Extract data for chart
    const labels = data.items.map(item => item.name);
    const values = data.items.map(item => item.value);

    // Assign colors, either from item.color or from our palette
    const backgroundColors = data.items.map((item, index) => 
      item.color || colorPalette[index % colorPalette.length]
    );

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors,
            borderColor: 'rgba(17, 24, 39, 0.8)',
            borderWidth: 2,
            hoverOffset: 15
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'rgba(148, 163, 184, 0.8)',
              padding: 15,
              font: {
                size: 11
              },
              generateLabels: (chart) => {
                const dataset = chart.data.datasets[0];
                return chart.data.labels?.map((label, i) => {
                  const value = dataset.data?.[i] as number;
                  const percentage = ((value / (data.totalValue || 1)) * 100).toFixed(1);
                  return {
                    text: `${label} - ${percentage}%`,
                    fillStyle: dataset.backgroundColor?.[i] as string,
                    strokeStyle: dataset.borderColor as string,
                    lineWidth: dataset.borderWidth as number,
                    hidden: false,
                    index: i
                  };
                }) || [];
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(30, 41, 59, 0.9)',
            titleColor: '#e2e8f0',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(99, 102, 241, 0.3)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 6,
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const percentage = ((value / data.totalValue) * 100).toFixed(1);
                return `$${value.toLocaleString()} (${percentage}%)`;
              }
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
  }, [data]);

  return (
    <div className="w-full h-80 relative">
      <canvas ref={chartRef}></canvas>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-xs">Total Value</div>
          <div className="font-bold text-lg">${data.totalValue.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};