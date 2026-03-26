import React from 'react'

const map = {
  high: { label: 'High', cls: 'bg-red-50 text-red-700 border-red-200' },
  medium: { label: 'Medium', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  low: { label: 'Low', cls: 'bg-green-50 text-green-700 border-green-200' },
}

export default function UrgencyBadge({ urgency, size = 'sm' }) {
  const key = (urgency || '').toLowerCase()
  const config = map[key] || { label: urgency || 'Unknown', cls: 'bg-gray-50 text-gray-600 border-gray-200' }

  const dotMap = { high: 'bg-red-500', medium: 'bg-yellow-500', low: 'bg-green-500' }
  const dot = dotMap[key] || 'bg-gray-400'

  const sz = size === 'lg'
    ? 'px-3 py-1.5 text-sm font-semibold'
    : 'px-2.5 py-1 text-xs font-semibold'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.cls} ${sz}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {config.label}
    </span>
  )
}
