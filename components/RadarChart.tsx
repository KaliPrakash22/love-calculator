
import React from 'react';

interface RadarChartProps {
  factors: {
    passion: number;
    trust: number;
    communication: number;
    fun: number;
  };
}

const RadarChart: React.FC<RadarChartProps> = ({ factors }) => {
  const size = 200;
  const center = size / 2;
  const radius = size * 0.4;

  const points = [
    { x: center, y: center - (radius * factors.passion / 100), label: 'Passion' },
    { x: center + (radius * factors.trust / 100), y: center, label: 'Trust' },
    { x: center, y: center + (radius * factors.communication / 100), label: 'Comm.' },
    { x: center - (radius * factors.fun / 100), y: center, label: 'Fun' }
  ];

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Grids */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <path
            key={r}
            d={`M ${center} ${center - radius * r} L ${center + radius * r} ${center} L ${center} ${center + radius * r} L ${center - radius * r} ${center} Z`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}
        {/* Axis Lines */}
        <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="#cbd5e1" strokeWidth="1" />
        <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="#cbd5e1" strokeWidth="1" />
        
        {/* Data Shape */}
        <polygon
          points={polygonPath}
          fill="rgba(244, 63, 94, 0.3)"
          stroke="#f43f5e"
          strokeWidth="2"
          className="transition-all duration-1000 ease-out"
        />

        {/* Labels */}
        <text x={center} y={center - radius - 10} textAnchor="middle" fontSize="10" className="fill-rose-500 font-bold">Passion</text>
        <text x={center + radius + 10} y={center + 4} textAnchor="start" fontSize="10" className="fill-rose-500 font-bold">Trust</text>
        <text x={center} y={center + radius + 15} textAnchor="middle" fontSize="10" className="fill-rose-500 font-bold">Communication</text>
        <text x={center - radius - 10} y={center + 4} textAnchor="end" fontSize="10" className="fill-rose-500 font-bold">Fun</text>
      </svg>
    </div>
  );
};

export default RadarChart;
