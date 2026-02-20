'use client'

import React from 'react'

interface ChartProps {
    data: { label: string; value: number }[]
    height?: number
    color?: string
}

export function TrendLineChart({ data, height = 150, color = "#0088EE" }: ChartProps) {
    if (!data || data.length === 0) return <div className="h-[150px] flex items-center justify-center text-gray-300 text-xs">No data</div>

    const maxVal = Math.max(...data.map(d => d.value)) || 1
    const width = 1000 // Fixed SVG coordinate space
    const stepX = width / (data.length - 1)

    // Create points string for polyline
    const points = data.map((d, i) => {
        const x = i * stepX
        const y = height - (d.value / maxVal) * height
        return `${x},${y}`
    }).join(' ')

    // Gradient points for fill
    const fillPoints = `${points} ${width},${height} 0,${height}`

    return (
        <div className="w-full" style={{ height }}>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polyline
                    fill="url(#chartGradient)"
                    points={fillPoints}
                    stroke="none"
                />
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                    className="animate-in fade-in duration-1000"
                />
            </svg>
        </div>
    )
}

export function SimpleBarChart({ data, height = 200, color = "#0D1B2A" }: ChartProps) {
    if (!data || data.length === 0) return <div className="h-[200px] flex items-center justify-center text-gray-300 text-xs">No data</div>

    const maxVal = Math.max(...data.map(d => d.value)) || 1

    return (
        <div className="w-full flex items-end gap-2" style={{ height }}>
            {data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div
                        className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 relative"
                        style={{
                            height: `${(d.value / maxVal) * 100}%`,
                            backgroundColor: color,
                            minHeight: '4px'
                        }}
                    >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.value}
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter truncate w-full text-center">
                        {d.label}
                    </span>
                </div>
            ))}
        </div>
    )
}
