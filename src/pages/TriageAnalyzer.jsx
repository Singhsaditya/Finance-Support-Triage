import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Tag, AlertTriangle, List, MessageSquare } from 'lucide-react'
import UrgencyBadge from '../components/UrgencyBadge'
import EntityTable from '../components/EntityTable'
import ResponseEditor from '../components/ResponseEditor'
import Spinner from '../components/Spinner'
import { api } from '../services/api'

const CHAR_LIMIT = 2000

export default function TriageAnalyzer() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [regenerating, setRegenerating] = useState(false)

  async function handleSubmit() {
    if (!query.trim() || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      // Step 1: triage
      const triageRes = await api.triage(query.trim())
      const { ticket_id } = triageRes.data
      // Step 2: fetch full ticket for parsed + response
      const ticketRes = await api.getTicket(ticket_id)
      setResult(ticketRes.data)
    } catch (e) {
      setError(
        e?.response?.data?.detail ||
        'Failed to connect to the backend. Make sure the API server is running at the configured URL.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleRegenerate() {
    if (!query.trim() || regenerating) return
    setRegenerating(true)
    setError(null)
    try {
      const triageRes = await api.triage(query.trim())
      const { ticket_id } = triageRes.data
      const ticketRes = await api.getTicket(ticket_id)
      setResult(ticketRes.data)
    } catch (e) {
      setError('Regeneration failed. Please try again.')
    } finally {
      setRegenerating(false)
    }
  }

  const parsed = result?.parsed || {}
  const entities = parsed.entities || []

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h2 className="text-xl font-display font-700 text-gray-900 tracking-tight">Triage Analyzer</h2>
        <p className="text-sm text-gray-400 mt-0.5">Paste a customer message to classify intent, urgency, and extract entities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Input */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={15} className="text-green-600" />
              <h3 className="text-sm font-semibold text-gray-900">Customer Message</h3>
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, CHAR_LIMIT))}
              placeholder="Paste the customer's support message here…&#10;&#10;Example: &quot;I was charged twice for my subscription last week. I need a refund immediately.&quot;"
              rows={11}
              className="input-base resize-none text-sm leading-relaxed mb-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
              }}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {query.length}/{CHAR_LIMIT} · ⌘↵ to submit
              </span>
              <button
                onClick={handleSubmit}
                disabled={!query.trim() || loading}
                className="btn-primary"
              >
                {loading ? (
                  <>
                    <Spinner size={14} className="text-white/80" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    Run Triage
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="card p-4 bg-green-50/40 border-green-100">
            <p className="text-xs font-semibold text-green-700 mb-2">Tips for best results</p>
            <ul className="space-y-1.5 text-xs text-green-700/80">
              <li>• Include specific amounts, dates, or transaction IDs if available</li>
              <li>• Use the customer's own words — avoid paraphrasing</li>
              <li>• Messages with clear context produce more accurate classifications</li>
            </ul>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}

            {loading && !result && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card p-10 flex flex-col items-center justify-center gap-4 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <Spinner size={22} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Analyzing message…</p>
                  <p className="text-xs text-gray-400 mt-1">AI agents are classifying intent and extracting entities</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  {['Validator', 'Classifier', 'Responder'].map((step, i) => (
                    <motion.span
                      key={step}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                      className="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full"
                    >
                      {step}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Intent */}
                <div className="card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={14} className="text-blue-500" />
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Intent Classification</h4>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {parsed.intent || parsed.category || parsed.classification || 'Not classified'}
                  </p>
                  {parsed.summary && (
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{parsed.summary}</p>
                  )}
                </div>

                {/* Urgency */}
                <div className="card p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={14} className="text-yellow-500" />
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Urgency Level</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <UrgencyBadge urgency={parsed.urgency} size="lg" />
                    {parsed.urgency_reason && (
                      <p className="text-xs text-gray-500 flex-1">{parsed.urgency_reason}</p>
                    )}
                  </div>
                </div>

                {/* Entities */}
                {entities.length > 0 && (
                  <div className="card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <List size={14} className="text-purple-500" />
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Extracted Entities
                        <span className="ml-1.5 text-gray-300 font-normal normal-case">({entities.length})</span>
                      </h4>
                    </div>
                    <EntityTable entities={entities} />
                  </div>
                )}

                {/* Parsed fields fallback */}
                {entities.length === 0 && Object.keys(parsed).length > 0 && (
                  <div className="card p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <List size={14} className="text-purple-500" />
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Parsed Fields</h4>
                    </div>
                    <div className="space-y-1.5">
                      {Object.entries(parsed)
                        .filter(([k]) => !['intent', 'urgency', 'urgency_reason', 'summary', 'category', 'classification'].includes(k))
                        .map(([k, v]) => (
                          <div key={k} className="flex items-start gap-3 text-xs">
                            <span className="font-mono text-gray-400 capitalize min-w-[80px]">{k}</span>
                            <span className="text-gray-700 font-medium">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Response */}
                <div className="card p-4">
                  <ResponseEditor
                    response={result.ai_response}
                    onRegenerate={handleRegenerate}
                    regenerating={regenerating}
                  />
                </div>

                {/* Ticket ref */}
                <div className="flex items-center gap-2 text-xs text-gray-400 px-1">
                  <span>Ticket ID:</span>
                  <span className="font-mono bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-600">
                    {result.id}
                  </span>
                </div>
              </motion.div>
            )}

            {!loading && !result && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-10 flex flex-col items-center justify-center gap-3 text-center border-dashed"
              >
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                  <Zap size={20} className="text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Results will appear here</p>
                  <p className="text-xs text-gray-300 mt-1">Submit a message to run triage analysis</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
