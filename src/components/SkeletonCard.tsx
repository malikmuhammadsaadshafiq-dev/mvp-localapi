'use client'

export function SkeletonCard() {
  return (
    <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 w-16 bg-white/10 rounded-md" />
        <div className="h-8 w-8 bg-white/10 rounded-lg" />
      </div>
      <div className="h-6 w-3/4 bg-white/10 rounded mb-2" />
      <div className="h-4 w-full bg-white/10 rounded mb-2" />
      <div className="h-4 w-2/3 bg-white/10 rounded mb-4" />
      <div className="h-16 w-full bg-black/20 rounded-lg mb-4" />
      <div className="flex justify-between">
        <div className="h-4 w-20 bg-white/10 rounded" />
        <div className="h-4 w-24 bg-white/10 rounded" />
      </div>
    </div>
  )
}