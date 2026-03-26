import React, { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [apiBase, setApiBase] = useState(
    () => localStorage.getItem('apiBase') || 'http://127.0.0.1:8000'
  )
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  )

  useEffect(() => {
    localStorage.setItem('apiBase', apiBase)
  }, [apiBase])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [darkMode])

  return (
    <SettingsContext.Provider value={{ apiBase, setApiBase, darkMode, setDarkMode }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
