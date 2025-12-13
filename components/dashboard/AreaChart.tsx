'use client';

export default function AreaChart() {
  const points = [
    { x: 0, y: 35, val: '$1.2M' },
    { x: 30, y: 30, val: '$2.5M' },
    { x: 60, y: 15, val: '$3.8M' },
    { x: 100, y: 0, val: '$5.2M' }
  ];

  return (
    <div className="h-64 w-full relative group">
      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
        {/* Gradient Defs */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area Fill */}
        <path
          d="M0,50 L0,35 C10,32 20,40 30,30 C40,20 50,25 60,15 C70,5 80,10 90,5 L100,0 L100,50 Z"
          fill="url(#chartGradient)"
          className="transition-all duration-1000 ease-in-out opacity-80"
        />

        {/* Line Stroke */}
        <path
          d="M0,35 C10,32 20,40 30,30 C40,20 50,25 60,15 C70,5 80,10 90,5 L100,0"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="0.5"
          strokeLinecap="round"
          className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        />

        {/* Interactive Points */}
        {points.map((p, i) => (
          <g key={i} className="group/point hover:cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="1.5"
              fill="#000"
              stroke="#3B82F6"
              strokeWidth="0.5"
              className="transition-all duration-300 hover:fill-blue-500"
            />
            {/* Tooltip */}
            <foreignObject x={p.x - 10} y={p.y - 15} width="20" height="10" className="opacity-0 group-hover/point:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="bg-zinc-800 text-[3px] text-white px-1 rounded text-center border border-zinc-700">
                {p.val}
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </div>
  );
}
