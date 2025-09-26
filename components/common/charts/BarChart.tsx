import React from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const chartHeight = 300;
  const barWidth = 30;
  const barMargin = 15;
  const chartWidth = data.length * (barWidth + barMargin);

  return (
    <div className="w-full h-full overflow-x-auto overflow-y-hidden">
      <svg width={chartWidth} height={chartHeight} className="font-sans">
        <defs>
            <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#34D399" stopOpacity="0.8"/>
            </linearGradient>
        </defs>
        {data.map((d, i) => {
          const barHeight = (d.value / maxValue) * (chartHeight - 40);
          const x = i * (barWidth + barMargin);
          const y = chartHeight - barHeight - 20;

          return (
            <g key={d.label} className="group">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="url(#barGradient)"
                rx="4"
                className="transition-opacity duration-200 opacity-80 group-hover:opacity-100"
              />
              <text
                x={x + barWidth / 2}
                y={y - 8}
                textAnchor="middle"
                fill="#FFFFFF"
                className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                ${d.value.toLocaleString()}
              </text>
              <text
                x={x + barWidth / 2}
                y={chartHeight - 5}
                textAnchor="middle"
                fill="#9CA3AF"
                className="text-xs font-medium"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
