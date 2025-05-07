import React from "react";

type DataPoint = {
  date: string;
  value: number;
};

type ProfitChartProps = {
  data: DataPoint[];
  title?: string;
  height?: number;
};

export default function ProfitChart({ data, title = "Profit Chart", height = 200 }: ProfitChartProps) { 
  // In a real app, you'd use a charting library like recharts or chart.js
  // This is a simple visual representation for testing

  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;
  const minValue = data.length > 0 ? Math.min(...data.map(d => d.value)) : 0;

  return (
    <div className="bg-gray-800 p-4 rounded-lg" data-cy="profit-chart">
      {title && <h3 className="text-white font-medium mb-3">{title}</h3>}

      <div
        className="bg-gray-900 rounded overflow-hidden"
        style={{ height: `${height}px` }}
        data-cy="chart-container"
      >
        <div className="flex h-full">
          {data.map((point, index) => {
            const normalizedHeight = ((point.value - minValue) / (maxValue - minValue || 1)) * 100;     
            return (
              <div
                key={index}
                className="flex-1 flex flex-col-reverse"
                title={`${point.date}: ${point.value}`}
                data-cy="chart-bar"
                data-value={point.value}
                data-date={point.date}
              >
                <div
                  className={`${point.value >= 0 ? 'bg-green-500' : 'bg-red-500'} w-full`}
                  style={{ height: `${Math.max(normalizedHeight, 5)}%` }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {data.length > 0 && (
          <>
            <span data-cy="chart-first-date">{data[0].date}</span>
            <span data-cy="chart-last-date">{data[data.length - 1].date}</span>
          </>
        )}
      </div>
    </div>
  );
}
