// CERBERUS Bot - Bot Session Status Chart Component
// Created: 2025-05-07 00:48:50 UTC
// Author: CERBERUSCHAINYes

import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface BotSessionStatusChartProps {
  active: number;
  paused: number;
  error: number;
  idle: number;
}

export const BotSessionStatusChart: React.FC<BotSessionStatusChartProps> = ({
  active,
  paused,
  error,
  idle
}) => {
  // Prepare data for the pie chart
  const data = [
    { name: 'Active', value: active, color: '#10B981' }, // Green
    { name: 'Paused', value: paused, color: '#F59E0B' }, // Yellow
    { name: 'Error', value: error, color: '#EF4444' },   // Red
    { name: 'Idle', value: idle, color: '#6B7280' }      // Gray
  ].filter(item => item.value > 0); // Only include non-zero values
  
  // If no data, display a message
  if (data.length === 0 || (active === 0 && paused === 0 && error === 0 && idle === 0)) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No bot sessions data available
      </div>
    );
  }
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active: isActive, payload }: any) => {
    if (isActive && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-2 rounded-md shadow-lg">
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value} bot${payload[0].value !== 1 ? 's' : ''}`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              value,
              index
            }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + innerRadius + (outerRadius - innerRadius);
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              
              return (
                <text
                  x={x}
                  y={y}
                  fill={data[index].color}
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                  className="text-xs"
                >
                  {value > 0 ? `${value}` : ''}
                </text>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry, index) => (
              <span className="text-xs text-gray-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};