'use client'

import React from 'react'

interface DonutChartProps {
  data: {
    label: string
    value: number
    color: string
    percentage: number
  }[]
}

export function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -90

  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    currentAngle += angle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (currentAngle * Math.PI) / 180

    const x1 = 50 + 40 * Math.cos(startRad)
    const y1 = 50 + 40 * Math.sin(startRad)
    const x2 = 50 + 40 * Math.cos(endRad)
    const y2 = 50 + 40 * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ')

    return {
      ...item,
      pathData,
      percentage
    }
  })

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="20"
          />
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              fill={segment.color}
              className="transition-all duration-300 hover:opacity-80"
            />
          ))}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
      </div>
      <div className="flex flex-col gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{item.label}</span>
              <span className="text-xs text-gray-500">{item.percentage} %</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
