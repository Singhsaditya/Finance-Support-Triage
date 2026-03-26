import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (target === undefined || target === null) return
    const start = performance.now()
    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(ease * target))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return value
}

export default function StatCard({ label, value, icon: Icon, color = 'green', delta, loading }) {
  const animated = useCountUp(loading ? 0 : (value ?? 0))

  const colorMap = {
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500', border: 'border-green-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500', border: 'border-red-100' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'text-yellow-500', border: 'border-yellow-100' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500', border: 'border-blue-100' },
  }

  const c = colorMap[color] || colorMap.green

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="card p-5 hover:shadow-card-hover transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{label}</p>
          <p className="text-3xl font-display font-700 text-gray-900">
            {loading ? '—' : animated.toLocaleString()}
          </p>
          {delta !== undefined && (
            <p className={`text-xs mt-1 font-medium ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {delta >= 0 ? '+' : ''}{delta}% this week
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
            <Icon size={18} className={c.icon} strokeWidth={2} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
