'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface RequestFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function RequestForm({ onSubmit, onCancel }: RequestFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    method: 'GET',
    url: '',
    description: '',
    collection: 'Default'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Request name is required'
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else if (!formData.url.startsWith('http')) {
      newErrors.url = 'URL must start with http:// or https://'
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.collection.trim()) newErrors.collection = 'Collection name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, url: true, description: true, collection: true })
    if (!validate()) return
    
    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit({
        ...formData,
        status: 'active',
        lastUsed: new Date().toISOString().split('T')[0]
      })
      setIsSubmitting(false)
    }, 600)
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    validate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in-up">
      <div className="bg-[#1e293b] rounded-2xl border border-white/10 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-white text-xl font-bold">New API Request</h2>
          <p className="text-white/50 text-sm mt-1">Add a new endpoint to your collection</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Request Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g., Get User Profile"
              className={cn(
                "w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all",
                errors.name && touched.name ? "border-red-500" : "border-white/10"
              )}
            />
            {errors.name && touched.name && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400"/>{errors.name}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">HTTP Method</label>
              <select
                value={formData.method}
                onChange={(e) => handleChange('method', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 appearance-none cursor-pointer"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Collection</label>
              <input
                type="text"
                value={formData.collection}
                onChange={(e) => handleChange('collection', e.target.value)}
                onBlur={() => handleBlur('collection')}
                placeholder="e.g., Authentication"
                className={cn(
                  "w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50",
                  errors.collection && touched.collection ? "border-red-500" : "border-white/10"
                )}
              />
              {errors.collection && touched.collection && <p className="text-red-400 text-xs mt-1.5">{errors.collection}</p>}
            </div>
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Endpoint URL</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              onBlur={() => handleBlur('url')}
              placeholder="https://api.example.com/v1/users"
              className={cn(
                "w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all",
                errors.url && touched.url ? "border-red-500" : "border-white/10"
              )}
            />
            {errors.url && touched.url && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400"/>{errors.url}</p>}
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="Describe the purpose of this API endpoint and expected response..."
              rows={3}
              className={cn(
                "w-full bg-white/5 border rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50 resize-none transition-all",
                errors.description && touched.description ? "border-red-500" : "border-white/10"
              )}
            />
            {errors.description && touched.description && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-red-400"/>{errors.description}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}