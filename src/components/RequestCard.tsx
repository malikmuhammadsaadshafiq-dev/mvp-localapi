'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Request {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  description: string
  status: 'active' | 'archived'
  createdAt: string
  lastUsed: string
  collection: string
}

interface RequestCardProps {
  request: Request
  onDelete: (id: string) => void
  onExecute: (id: string) => void
  delay?: number
}

const methodColors = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
}

export function RequestCard({ request, onDelete, onExecute, delay = 0 }: RequestCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(true)
    setTimeout(() => {
      onDelete(request.id)
    }, 300)
  }

  const handleExecute = () => {
    onExecute(request.id)
  }

  return (
    <div 
      className={cn(
        "group bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/10 fade-in-up cursor-pointer",
        isDeleting && "opacity-0 -translate-x-full scale-95"
      )}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleExecute}
    >
      <div className="flex items-start justify-between mb-4">
        <span className={cn("px-2.5 py-1 rounded-md text-xs font-bold border uppercase tracking-wider", methodColors[request.method])}>
          {request.method}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleExecute}
            className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-white/60 hover:text-emerald-400 transition-colors"
            title="Execute request"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
            title="Delete request"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <h3 className="text-white font-semibold text-lg mb-2 tracking-tight line-clamp-1">{request.name}</h3>
      <p className="text-white/60 text-sm mb-4 line-clamp-2 leading-relaxed">{request.description}</p>
      <div className="bg-black/20 rounded-lg p-3 mb-4 border border-white/5">
        <code className="text-xs text-white/80 font-mono break-all block">{request.url}</code>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/40 font-medium">{request.collection}</span>
        <span className="text-white/30">{request.lastUsed}</span>
      </div>
    </div>
  )
}