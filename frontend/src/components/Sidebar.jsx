import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Zap,
  Ticket,
  Settings,
  TrendingUp,
  ChevronRight,
} from 'lucide-react'

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Triage Analyzer', icon: Zap, to: '/dashboard/triage' },
  { label: 'Tickets', icon: Ticket, to: '/dashboard/tickets' },
  
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-100 flex flex-col shadow-panel sticky top-0">
      {/* Logo */}
      <div
        className="px-5 py-5 border-b border-gray-100 cursor-pointer flex items-center gap-2.5"
        onClick={() => navigate('/')}
      >
        <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shadow-sm">
          <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-700 text-gray-900 text-lg tracking-tight">
          FinTriage
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map(({ label, icon: Icon, to }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
          >
            <NavLink
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={16}
                    className={isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'}
                    strokeWidth={2}
                  />
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <motion.div layoutId="nav-indicator">
                      <ChevronRight size={14} className="text-green-500" />
                    </motion.div>
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-green-700">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">Agent</p>
            <p className="text-xs text-gray-400 truncate">Finance Support</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
