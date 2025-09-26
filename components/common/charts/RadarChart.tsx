
import React, { useEffect, useRef } from 'react';

// A simple Chart.js-like radar chart component without external dependencies
interface RadarChartProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }[];
    };
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 30;
        const angleSlice = (Math.PI * 2) / data.labels.length;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw grid lines (web)
        ctx.strokeStyle = '#3F3F46'; // zinc-700
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            const r = radius * (i / 4);
            ctx.beginPath();
            ctx.moveTo(centerX + r, centerY);
            for (let j = 1; j <= data.labels.length; j++) {
                ctx.lineTo(centerX + r * Math.cos(j * angleSlice), centerY + r * Math.sin(j * angleSlice));
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Draw axis lines
        for (let i = 0; i < data.labels.length; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius * Math.cos(i * angleSlice), centerY + radius * Math.sin(i * angleSlice));
            ctx.stroke();
        }
        
        // Draw labels
        ctx.fillStyle = '#D1D5DB'; // gray-300
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < data.labels.length; i++) {
            const angle = i * angleSlice;
            const x = centerX + (radius + 15) * Math.cos(angle);
            const y = centerY + (radius + 15) * Math.sin(angle);
            ctx.fillText(data.labels[i], x, y);
        }

        // Draw datasets
        data.datasets.forEach(dataset => {
            ctx.strokeStyle = dataset.borderColor;
            ctx.fillStyle = dataset.backgroundColor;
            ctx.lineWidth = dataset.borderWidth;
            
            ctx.beginPath();
            dataset.data.forEach((point, i) => {
                const valueRadius = (point / 100) * radius;
                const x = centerX + valueRadius * Math.cos(i * angleSlice);
                const y = centerY + valueRadius * Math.sin(i * angleSlice);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

    }, [data]);

    return <canvas ref={canvasRef} width="300" height="300" />;
};

export default RadarChart;
