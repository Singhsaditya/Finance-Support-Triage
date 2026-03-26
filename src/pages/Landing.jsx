import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  TrendingUp, Zap, ShieldCheck, BarChart3, ArrowRight,
  Brain, Clock, CheckCircle2, Layers
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Intent Classification',
    desc: 'Automatically identifies whether a query is a refund request, fraud report, billing issue, or other support category.',
  },
  {
    icon: Zap,
    title: 'Urgency Detection',
    desc: 'Prioritizes incoming queries into High, Medium, and Low urgency levels so your team always knows what to tackle first.',
  },
  {
    icon: Layers,
    title: 'Entity Extraction',
    desc: 'Pulls out key financial entities — account numbers, amounts, dates, merchants — from free-form customer messages.',
  },
  {
    icon: ShieldCheck,
    title: 'AI Response Drafts',
    desc: 'Generates a contextually accurate response draft that your support agents can review, edit, and send instantly.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'Track ticket volumes, urgency distributions, and team throughput with a live operations dashboard.',
  },
  {
    icon: Clock,
    title: 'Ticket History',
    desc: 'Every query, classification, and AI response is logged and searchable — full audit trail for compliance.',
  },
]

function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
              <TrendingUp size={14} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-700 text-gray-900 tracking-tight">FinTriage</span>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-primary text-xs py-2 px-3.5">
            Open Dashboard
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
       

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl md:text-6xl font-800 text-gray-900 leading-tight tracking-tight mb-6"
        >
          Finance Support Triage
          <br />
          <span className="text-green-600">Powered by AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          FinTriage classifies customer intent, detects urgency, extracts financial entities,
          and drafts AI responses — so your team spends time solving problems, not reading tickets.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center justify-center gap-3"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary py-3 px-6 text-base"
          >
            Open Dashboard
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/dashboard/triage')}
            className="btn-secondary py-3 px-6 text-base"
          >
            Try the Analyzer
          </button>
        </motion.div>

      </section>

      {/* Features */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-14">
            <h2 className="font-display text-3xl font-700 text-gray-900 mb-3 tracking-tight">
              Everything your support team needs
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              FinTriage handles the cognitive load of triage so agents focus on resolution.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.07}>
                <div className="card p-5 h-full hover:shadow-card-hover transition-shadow duration-200">
                  <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center mb-4">
                    <f.icon size={17} className="text-green-600" strokeWidth={2} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5 text-sm">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500">
              <CheckCircle2 size={16} className="text-green-500" />
           
            </div>
            <h2 className="font-display text-3xl font-700 text-gray-900 mb-4 tracking-tight">
              Ready to streamline support?
            </h2>
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              Open the dashboard to see live stats, run triage queries, and manage tickets.
            </p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary py-3 px-7 text-base">
              Open Dashboard <ArrowRight size={16} />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-green-600 flex items-center justify-center">
              <TrendingUp size={11} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-500">FinTriage</span>
          </div>
          <p className="text-xs text-gray-400">Finance AI Triage Agent · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
