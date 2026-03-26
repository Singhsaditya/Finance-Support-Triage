import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Ticket, AlertTriangle, AlertCircle, CheckCircle2,
  ArrowRight, Zap, Clock
} from 'lucide-react'
import StatCard from '../components/StatCard'
import UrgencyBadge from '../components/UrgencyBadge'
import { api } from '../services/api'

export default function DashboardHome() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [statsRes, ticketsRes] = await Promise.all([
          api.getStats(),
          api.listTickets({ page: 1, per_page: 5 }),
        ])
        setStats(statsRes.data)
        setRecent(ticketsRes.data.tickets || [])
      } catch (e) {
        setError('Could not reach the backend. Make sure the API server is running.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = [
  { label: 'Total Tickets', value: stats?.total, icon: Ticket, color: 'blue' },
  { label: 'High Urgency', value: stats?.high, icon: AlertTriangle, color: 'red' },
  { label: 'Medium Urgency', value: stats?.medium, icon: AlertCircle, color: 'yellow' },
  { label: 'Low Urgency', value: stats?.low, icon: CheckCircle2, color: 'green' },
]

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2 className="text-xl font-display font-700 text-gray-900 tracking-tight">
          Good morning, Agent 👋
        </h2>
        <p className="text-sm text-gray-400 mt-0.5">Here's what's happening with your finance support queue.</p>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
          >
            <StatCard
              label={card.label}
              value={card.value}
              icon={card.icon}
              color={card.color}
              loading={loading}
            />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/dashboard/triage')}
          className="card p-5 cursor-pointer hover:shadow-card-hover transition-all duration-200 group border-green-100 bg-gradient-to-br from-green-50/60 to-white"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center mb-3 shadow-sm">
                <Zap size={16} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Run Triage Analysis</h3>
              <p className="text-xs text-gray-500">Submit a customer message for instant AI classification</p>
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all mt-1" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36 }}
          onClick={() => navigate('/dashboard/tickets')}
          className="card p-5 cursor-pointer hover:shadow-card-hover transition-all duration-200 group"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                <Clock size={16} className="text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">View All Tickets</h3>
              <p className="text-xs text-gray-500">Browse, filter, and manage the full ticket queue</p>
            </div>
            <ArrowRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mt-1" />
          </div>
        </motion.div>
      </div>

      {/* Recent Tickets */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-sm">Recent Tickets</h3>
          <button
            onClick={() => navigate('/dashboard/tickets')}
            className="text-xs text-green-600 font-medium hover:text-green-700 flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </button>
        </div>

        {loading ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Loading tickets…</div>
        ) : recent.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-gray-400">No tickets yet.</p>
            <button onClick={() => navigate('/dashboard/triage')} className="btn-primary mt-3 text-xs py-2">
              Run first triage <Zap size={13} />
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">ID</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Query</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Urgency</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.42 + i * 0.05 }}
                  onClick={() => navigate('/dashboard/tickets')}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">
                    #{t.id.slice(-6)}
                  </td>
                  <td className="px-5 py-3 text-gray-700 max-w-xs truncate text-xs">{t.query}</td>
                  <td className="px-5 py-3">
                    <UrgencyBadge urgency={t.urgency || (t.parsed?.urgency)} />
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium">
                      {t.status || 'PROCESSING'}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  )
}
