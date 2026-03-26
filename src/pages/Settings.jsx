import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Check, Globe, Moon, Sun, Info } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function Settings() {
  const { apiBase, setApiBase, darkMode, setDarkMode } = useSettings()
  const [localUrl, setLocalUrl] = useState(apiBase)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setApiBase(localUrl.trim() || 'http://127.0.0.1:8000')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="text-xl font-display font-700 text-gray-900 tracking-tight">Settings</h2>
        <p className="text-sm text-gray-400 mt-0.5">Configure your FinTriage environment.</p>
      </div>

      {/* API Config */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card p-6 space-y-5"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <Globe size={15} className="text-green-600" />
          <h3 className="font-semibold text-gray-900 text-sm">API Configuration</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Backend API Base URL</label>
          <input
            type="text"
            value={localUrl}
            onChange={(e) => setLocalUrl(e.target.value)}
            placeholder="http://127.0.0.1:8000"
            className="input-base text-sm font-mono"
          />
          <div className="flex items-start gap-1.5 text-xs text-gray-400">
            <Info size={11} className="mt-0.5 flex-shrink-0" />
            <span>
              This is the base URL for your FastAPI backend. All API calls will be prefixed with this URL.
              Default: <code className="bg-gray-100 px-1 rounded">http://127.0.0.1:8000</code>
            </span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3.5 border border-gray-100 space-y-1.5">
          <p className="text-xs font-semibold text-gray-500">Endpoints in use</p>
          {[
            ['POST', '/api/v1/triage', 'Submit a query for triage'],
            ['GET', '/api/v1/tickets', 'List all tickets'],
            ['GET', '/api/v1/tickets/:id', 'Get ticket detail'],
            ['GET', '/api/v1/stats', 'Dashboard statistics'],
          ].map(([method, path, desc]) => (
            <div key={path} className="flex items-center gap-2 text-xs">
              <span className={`font-mono font-semibold px-1.5 py-0.5 rounded text-xs ${
                method === 'POST' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
              }`}>
                {method}
              </span>
              <code className="text-gray-500 font-mono">{path}</code>
              <span className="text-gray-400">— {desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.08 }}
        className="card p-6 space-y-4"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          {darkMode ? <Moon size={15} className="text-indigo-500" /> : <Sun size={15} className="text-yellow-500" />}
          <h3 className="font-semibold text-gray-900 text-sm">Appearance</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Dark Mode</p>
            <p className="text-xs text-gray-400 mt-0.5">Switch between light and dark interface themes</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
              darkMode ? 'bg-green-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 flex items-center justify-center ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {darkMode
                ? <Moon size={10} className="text-indigo-500" />
                : <Sun size={10} className="text-yellow-500" />
              }
            </span>
          </button>
        </div>
      </motion.div>

      {/* Save */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex justify-end"
      >
        <button onClick={handleSave} className="btn-primary">
          {saved ? (
            <>
              <Check size={14} />
              Saved!
            </>
          ) : (
            <>
              <Save size={14} />
              Save Settings
            </>
          )}
        </button>
      </motion.div>
    </div>
  )
}
