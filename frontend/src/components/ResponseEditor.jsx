import React, { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ResponseEditor({ response, onRegenerate, regenerating }) {
  const [text, setText] = useState(response || '')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setText(response || '')
  }, [response])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">AI Response Draft</p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!text}
            className="btn-secondary py-1.5 px-3 text-xs"
          >
            {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={regenerating}
              className="btn-secondary py-1.5 px-3 text-xs"
            >
              <RefreshCw size={13} className={regenerating ? 'animate-spin' : ''} />
              Regenerate
            </button>
          )}
        </div>
      </div>
      <motion.textarea
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="AI response will appear here…"
        rows={7}
        className="input-base resize-none font-mono text-xs leading-relaxed"
      />
    </div>
  )
}
