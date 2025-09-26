import React from 'react';
import { CompletedSession } from '../types';
import Card from './common/Card';

interface ScoreEvolutionChartProps {
  sessions: CompletedSession[];
}

const ScoreEvolutionChart: React.FC<ScoreEvolutionChartProps> = ({ sessions }) => {
  if (sessions.length < 2) {
    return (
      <div className="text-center py-10 text-gray-500">
        <p>Complete at least two sessions to see your progress chart.</p>
      </div>
    );
  }
  
  // The component expects sessions to be sorted chronologically (oldest to newest).
  // The line will be drawn from left (oldest) to right (newest) to show progress.
  const sortedSessions = [...sessions];

  const scores = sortedSessions.map(s => s.feedback.overallScore);
  const maxScore = 100;
  const minScore = 0;

  const width = 500;
  const height = 150;
  const padding = 20;

  const points = scores.map((score, i) => {
    const x = padding + (i / (scores.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((score - minScore) / (maxScore - minScore)) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');
  
  const lastPoint = points.split(' ').pop()?.split(',');
  const lastX = lastPoint ? parseFloat(lastPoint[0]) : 0;
  const lastY = lastPoint ? parseFloat(lastPoint[1]) : 0;


  return (
    <div className="w-full h-[160px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
                <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
                </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[25, 50, 75, 100].map(val => {
                 const y = height - padding - ((val - minScore) / (maxScore - minScore)) * (height - 2 * padding);
                 return <line key={val} x1={padding} y1={y} x2={width-padding} y2={y} stroke="#27272A" strokeWidth="1"/>
            })}

            {/* Area under the line */}
            <polyline
                fill="url(#area-gradient)"
                points={`${padding},${height - padding} ${points} ${width-padding},${height-padding}`}
            />
            
            {/* The score line */}
            <polyline
                fill="none"
                stroke="url(#line-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />

            {/* Circles for each data point */}
            {points.split(' ').map((point, i) => {
                const [x, y] = point.split(',');
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="8" fill="#8B5CF6" fillOpacity="0.1" />
                        <circle cx={x} cy={y} r="4" fill="url(#line-gradient)" />
                    </g>
                );
            })}
        </svg>
    </div>
  );
};

export default ScoreEvolutionChart;