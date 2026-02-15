'use client'

import { cn } from '@/lib/utils'

interface NavbarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const tabs = [
    { id: 'home', label: 'Collections' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'settings', label: 'Settings' }
  ]

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f172a]/80 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">LocalAPI</h1>
            <p className="text-white/50 text-xs">Zero-cloud API client</p>
          </div>
        </div>
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === tab.id 
                  ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/25" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}