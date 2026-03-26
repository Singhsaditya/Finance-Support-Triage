import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'

const titles = {
  '/dashboard': 'Dashboard',
  '/dashboard/triage': 'Triage Analyzer',
  '/dashboard/tickets': 'Tickets',
  '/dashboard/settings': 'Settings',
}

export default function Navbar() {
  const { pathname } = useLocation()
  const title = titles[pathname] || 'Dashboard'

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 sticky top-0 z-10">
      <div className="flex-1">
        <h1 className="text-base font-semibold text-gray-900 font-display">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        
        
      </div>
    </header>
  )
}
