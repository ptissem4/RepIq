import React from 'react';

interface DonutChartProps {
  data: { label: string; value: number }[];
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const total = data.reduce((acc, d) => acc + d.value, 0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const colors = ['#8B5CF6', '#34D399', '#FBBF24', '#6B7280'];
  
  let accumulatedAngle = 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        <svg width="200" height="200" viewBox="0 0 200 200">
            <g transform="rotate(-90 100 100)">
            {data.map((d, i) => {
                const percentage = d.value / total;
                const strokeDasharray = `${percentage * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedAngle * circumference;
                accumulatedAngle += percentage;

                return (
                <circle
                    key={d.label}
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke={colors[i % colors.length]}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                />
                );
            })}
            </g>
            <text x="100" y="100" textAnchor="middle" dy=".3em" className="fill-white text-3xl font-bold">
                {total}
            </text>
             <text x="100" y="125" textAnchor="middle" className="fill-gray-400 text-sm">
                Subscribers
            </text>
        </svg>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {data.map((d, i) => (
                <div key={d.label} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></span>
                    <span className="text-gray-300">{d.label}:</span>
                    <span className="font-bold text-white">{d.value}</span>
                </div>
            ))}
        </div>
    </div>
  );
};

export default DonutChart;
