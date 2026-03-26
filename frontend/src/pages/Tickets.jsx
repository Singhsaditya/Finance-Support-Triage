import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ChevronLeft, ChevronRight, RefreshCw, ExternalLink } from 'lucide-react'
import UrgencyBadge from '../components/UrgencyBadge'
import Spinner from '../components/Spinner'
import { api } from '../services/api'

const STATUS_OPTIONS = ['', 'PROCESSING', 'RESOLVED', 'PENDING']
const URGENCY_OPTIONS = ['', 'high', 'medium', 'low']

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)
  const [status, setStatus] = useState('')
  const [urgency, setUrgency] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, per_page: perPage }
      if (status) params.status = status
     if (urgency) params.urgency = urgency
      const res = await api.listTickets(params)
      setTickets(res.data.tickets || [])
      setTotalPages(res.data.total_pages || 1)
    } catch {
      setError('Failed to load tickets. Check your API connection.')
    } finally {
      setLoading(false)
    }
  }, [page, perPage, status, urgency])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  async function viewDetail(id) {
    setDetailLoading(true)
    try {
      const res = await api.getTicket(id)
      setSelected(res.data)
    } catch {}
    setDetailLoading(false)
  }

  const filtered = search
    ? tickets.filter(t =>
        t.query?.toLowerCase().includes(search.toLowerCase()) ||
        t.id?.includes(search)
      )
    : tickets

  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-display font-700 text-gray-900 tracking-tight">Tickets</h2>
          <p className="text-sm text-gray-400 mt-0.5">All triaged support queries and their AI analysis results.</p>
        </div>
        <button onClick={fetchTickets} className="btn-secondary text-xs py-2">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card p-3 flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tickets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-8 py-2 text-xs h-8"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <Filter size={13} className="text-gray-400" />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
            className="input-base py-1.5 text-xs h-8 w-auto pr-7 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.filter(Boolean).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Urgency filter */}
        <select
          value={urgency}
          onChange={(e) => { setUrgency(e.target.value); setPage(1) }}
          className="input-base py-1.5 text-xs h-8 w-auto pr-7 cursor-pointer"
        >
          <option value="">All Urgencies</option>
          {URGENCY_OPTIONS.filter(Boolean).map(u => (
            <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Ticket ID</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Message</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Intent</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Urgency</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">Date</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center">
                  <Spinner size={20} className="text-green-600 mx-auto" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">
                  {search ? 'No tickets match your search.' : 'No tickets found.'}
                </td>
              </tr>
            ) : (
              filtered.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors cursor-pointer"
                  onClick={() => viewDetail(t.id)}
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">
                    #{t.id?.slice(-8)}
                  </td>
                  <td className="px-5 py-3.5 max-w-[220px]">
                    <p className="truncate text-xs text-gray-700">{t.query}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[140px]">
                    <p className="truncate">{t.category || '—'}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <UrgencyBadge urgency={t.urgency || t.parsed?.urgency} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                      t.status === 'RESOLVED'
                        ? 'bg-green-50 border-green-100 text-green-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}>
                      {t.status || 'PROCESSING'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                    {t.date ? new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    <ExternalLink size={13} className="text-gray-300 hover:text-green-600 transition-colors" />
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="btn-secondary py-1.5 px-2.5 text-xs"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = page <= 3 ? i + 1 : page - 2 + i
              if (pg < 1 || pg > totalPages) return null
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-7 h-7 rounded-md text-xs font-medium transition-colors ${
                    pg === page
                      ? 'bg-green-600 text-white'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pg}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="btn-secondary py-1.5 px-2.5 text-xs"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Ticket Detail</h3>
                  <p className="text-xs font-mono text-gray-400 mt-0.5">{selected.id}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-sm p-1">✕</button>
              </div>
              {detailLoading ? (
                <div className="p-10 text-center"><Spinner size={20} className="text-green-600 mx-auto" /></div>
              ) : (
                <div className="p-6 space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Customer Query</p>
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3.5 border border-gray-100">{selected.query}</p>
                  </div>
                  {selected.parsed && Object.keys(selected.parsed).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Analysis</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selected.parsed).map(([k, v]) => (
                          <div key={k} className="bg-gray-50 rounded-lg px-3.5 py-2.5 border border-gray-100">
                            <p className="text-xs text-gray-400 capitalize mb-0.5">{k}</p>
                            <p className="text-xs font-semibold text-gray-900 truncate">
                              {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selected.ai_response && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">AI Response</p>
                      <p className="text-xs text-gray-700 leading-relaxed bg-green-50/50 rounded-lg p-3.5 border border-green-100 font-mono whitespace-pre-wrap">{selected.ai_response}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                    <span>Status: <span className="font-medium text-gray-600">{selected.status}</span></span>
                    {selected.created_at && (
                      <span>Created: <span className="font-medium text-gray-600">
                        {new Date(selected.created_at).toLocaleString()}
                      </span></span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
