import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import Landing from './pages/Landing'
import DashboardLayout from './pages/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import TriageAnalyzer from './pages/TriageAnalyzer'
import Tickets from './pages/Tickets'
import Settings from './pages/Settings'

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="triage" element={<TriageAnalyzer />} />
            <Route path="tickets" element={<Tickets />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  )
}
