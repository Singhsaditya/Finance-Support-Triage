import React from 'react'
import { motion } from 'framer-motion'

export default function EntityTable({ entities }) {
  if (!entities || entities.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic py-4 text-center">No entities extracted</p>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Entity</th>
            <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
          </tr>
        </thead>
        <tbody>
          {entities.map((ent, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-4 py-2.5 font-medium text-gray-900 font-mono text-xs">
                {ent.text || ent.entity || ent.value || JSON.stringify(ent)}
              </td>
              <td className="px-4 py-2.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
                  {ent.type || ent.label || '—'}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
