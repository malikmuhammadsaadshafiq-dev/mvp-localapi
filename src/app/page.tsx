'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { RequestCard } from '@/components/RequestCard'
import { RequestForm } from '@/components/RequestForm'
import { Toast } from '@/components/Toast'
import { SkeletonCard } from '@/components/SkeletonCard'
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

const initialRequests: Request[] = [
  {
    id: '1',
    name: 'Stripe Customer Retrieval',
    method: 'GET',
    url: 'https://api.stripe.com/v1/customers/cus_1234567890',
    description: 'Fetches complete customer profile including subscription status, payment methods, and billing history for the account dashboard.',
    status: 'active',
    createdAt: '2024-03-15',
    lastUsed: '2024-03-20',
    collection: 'Payments'
  },
  {
    id: '2',
    name: 'Create Payment Intent',
    method: 'POST',
    url: 'https://api.stripe.com/v1/payment_intents',
    description: 'Initializes a new payment flow with automatic confirmation disabled, supporting 3D Secure authentication for European cards.',
    status: 'active',
    createdAt: '2024-03-14',
    lastUsed: '2024-03-19',
    collection: 'Payments'
  },
  {
    id: '3',
    name: 'SendGrid Email Dispatch',
    method: 'POST',
    url: 'https://api.sendgrid.com/v3/mail/send',
    description: 'Sends transactional email with dynamic template data, including order confirmations and password reset instructions.',
    status: 'active',
    createdAt: '2024-03-12',
    lastUsed: '2024-03-18',
    collection: 'Notifications'
  },
  {
    id: '4',
    name: 'GitHub Repository Update',
    method: 'PUT',
    url: 'https://api.github.com/repos/acme-corp/dashboard',
    description: 'Updates repository metadata including description, homepage URL, and visibility settings for the analytics project.',
    status: 'active',
    createdAt: '2024-03-10',
    lastUsed: '2024-03-17',
    collection: 'DevOps'
  },
  {
    id: '5',
    name: 'Delete S3 Object',
    method: 'DELETE',
    url: 'https://s3.amazonaws.com/bucket-name/temp-uploads/file.pdf',
    description: 'Removes temporary files from AWS S3 storage after processing is complete to minimize storage costs.',
    status: 'archived',
    createdAt: '2024-03-08',
    lastUsed: '2024-03-16',
    collection: 'Storage'
  },
  {
    id: '6',
    name: 'Patch User Settings',
    method: 'PATCH',
    url: 'https://api.internal.com/v2/users/42/preferences',
    description: 'Partially updates user notification preferences and privacy settings without affecting other account data.',
    status: 'active',
    createdAt: '2024-03-05',
    lastUsed: '2024-03-15',
    collection: 'Authentication'
  },
  {
    id: '7',
    name: 'Algolia Search Index',
    method: 'GET',
    url: 'https://latency-dsn.algolia.net/1/indexes/products?query=laptop',
    description: 'Performs fuzzy search across product catalog with typo tolerance and faceted filtering for e-commerce search.',
    status: 'active',
    createdAt: '2024-03-01',
    lastUsed: '2024-03-14',
    collection: 'Search'
  },
  {
    id: '8',
    name: 'Slack Webhook Notify',
    method: 'POST',
    url: 'https://hooks.slack.com/services/YOUR_WEBHOOK_URL',
    description: 'Posts deployment notifications to the engineering channel with commit hashes and build status indicators.',
    status: 'active',
    createdAt: '2024-02-28',
    lastUsed: '2024-03-13',
    collection: 'Notifications'
  },
  {
    id: '9',
    name: 'Google Maps Geocode',
    method: 'GET',
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway',
    description: 'Converts physical addresses into precise latitude and longitude coordinates for delivery route optimization.',
    status: 'active',
    createdAt: '2024-02-25',
    lastUsed: '2024-03-12',
    collection: 'Location'
  },
  {
    id: '10',
    name: 'Twilio SMS Send',
    method: 'POST',
    url: 'https://api.twilio.com/2010-04-01/Accounts/ACxxx/Messages.json',
    description: 'Dispatches two-factor authentication codes via SMS to verified phone numbers with delivery status tracking.',
    status: 'active',
    createdAt: '2024-02-20',
    lastUsed: '2024-03-11',
    collection: 'Authentication'
  },
  {
    id: '11',
    name: 'OpenAI Completion',
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    description: 'Generates AI-powered content suggestions using GPT-4 with temperature 0.7 and max_tokens 150 constraints.',
    status: 'archived',
    createdAt: '2024-02-18',
    lastUsed: '2024-03-10',
    collection: 'AI Services'
  },
  {
    id: '12',
    name: 'MongoDB Atlas Search',
    method: 'GET',
    url: 'https://data.mongodb-api.com/app/data-xxx/endpoint/data/v1/action/find',
    description: 'Queries document database for user sessions with aggregation pipeline for analytics dashboard population.',
    status: 'active',
    createdAt: '2024-02-15',
    lastUsed: '2024-03-09',
    collection: 'Database'
  },
  {
    id: '13',
    name: 'Cloudflare Cache Purge',
    method: 'DELETE',
    url: 'https://api.cloudflare.com/client/v4/zones/xxx/purge_cache',
    description: 'Invalidates CDN cache for specific URLs after content updates to ensure users receive latest assets immediately.',
    status: 'active',
    createdAt: '2024-02-10',
    lastUsed: '2024-03-08',
    collection: 'DevOps'
  },
  {
    id: '14',
    name: 'HubSpot Contact Create',
    method: 'POST',
    url: 'https://api.hubapi.com/crm/v3/objects/contacts',
    description: 'Creates new CRM contact with lifecycle stage mapping and custom property synchronization from signup forms.',
    status: 'active',
    createdAt: '2024-02-05',
    lastUsed: '2024-03-07',
    collection: 'CRM'
  },
  {
    id: '15',
    name: 'Datadog Metrics Submit',
    method: 'POST',
    url: 'https://api.datadoghq.com/api/v1/series',
    description: 'Pushes custom application metrics including response times and error rates for real-time monitoring dashboards.',
    status: 'active',
    createdAt: '2024-02-01',
    lastUsed: '2024-03-06',
    collection: 'Monitoring'
  }
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const [items, setItems] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [userName, setUserName] = useState('Alex Chen')
  const [executingId, setExecutingId] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('localapi_requests')
    const savedUser = localStorage.getItem('localapi_user')
    const savedTheme = localStorage.getItem('localapi_theme')
    
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        setItems(initialRequests)
      }
    } else {
      setItems(initialRequests)
    }
    
    if (savedUser) setUserName(savedUser)
    if (savedTheme) setDarkMode(savedTheme === 'dark')
    
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('localapi_requests', JSON.stringify(items))
    }
  }, [items])

  useEffect(() => {
    localStorage.setItem('localapi_user', userName)
  }, [userName])

  useEffect(() => {
    localStorage.setItem('localapi_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const filteredItems = items
    .filter(i => 
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.collection.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'method') return a.method.localeCompare(b.method)
      return 0
    })

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    setToast({ message: 'Request deleted from collection', type: 'success' })
  }

  const handleAdd = (requestData: Omit<Request, 'id' | 'createdAt'>) => {
    const newRequest: Request = {
      ...requestData,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date().toISOString().split('T')[0]
    }
    setItems(prev => [newRequest, ...prev])
    setShowForm(false)
    setToast({ message: 'New request added to collection', type: 'success' })
  }

  const handleExecute = (id: string) => {
    setExecutingId(id)
    setTimeout(() => {
      setExecutingId(null)
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, lastUsed: new Date().toISOString().split('T')[0] } : item
      ))
      setToast({ message: 'Request executed successfully', type: 'success' })
    }, 1500)
  }

  const exportData = async () => {
    const data = JSON.stringify(items, null, 2)
    await navigator.clipboard.writeText(data)
    setToast({ message: 'Collection JSON copied to clipboard', type: 'success' })
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string)
            if (Array.isArray(imported)) {
              setItems(imported)
              setToast({ message: 'Collection imported successfully', type: 'success' })
            }
          } catch {
            setToast({ message: 'Invalid JSON file', type: 'error' })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const stats = {
    total: items.length,
    active: items.filter(i => i.status === 'active').length,
    archived: items.filter(i => i.status === 'archived').length,
    methods: items.reduce((acc, item) => {
      acc[item.method] = (acc[item.method] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const completionRate = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0

  return (
    <div className={cn("min-h-screen mesh-bg", !darkMode && "light")}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-6 fade-in-up">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-1">API Collections</h2>
                <p className="text-white/60">Manage your local API endpoints</p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Request
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search requests, URLs, or collections..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="method">Sort by Method</option>
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white/[.03] rounded-2xl border border-white/10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">No requests found</h3>
                <p className="text-white/50 mb-6">Get started by adding your first API request</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2.5 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Add your first request
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((request, index) => (
                  <RequestCard 
                    key={request.id} 
                    request={request} 
                    onDelete={handleDelete}
                    onExecute={handleExecute}
                    delay={index * 50}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8 fade-in-up">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-1">Dashboard</h2>
              <p className="text-white/60">Overview of your API collections</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="text-white/60 text-sm font-medium mb-2">Total Requests</div>
                <div className="text-4xl font-bold text-white">{stats.total}</div>
                <div className="mt-2 text-emerald-400 text-sm">+{items.filter(i => new Date(i.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week</div>
              </div>
              <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="text-white/60 text-sm font-medium mb-2">Active Endpoints</div>
                <div className="text-4xl font-bold text-white">{stats.active}</div>
                <div className="mt-2 text-white/40 text-sm">{stats.archived} archived</div>
              </div>
              <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="text-white/60 text-sm font-medium mb-2">Completion Rate</div>
                <div className="text-4xl font-bold text-white">{completionRate}%</div>
                <div className="mt-2 text-blue-400 text-sm">{stats.active} active</div>
              </div>
              <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6 hover:-translate-y-1 transition-transform duration-300">
                <div className="text-white/60 text-sm font-medium mb-2">Collections</div>
                <div className="text-4xl font-bold text-white">{new Set(items.map(i => i.collection)).size}</div>
                <div className="mt-2 text-white/40 text-sm">Organized groups</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6">
                <h3 className="text-white font-semibold text-lg mb-6">Requests by Method</h3>
                <div className="space-y-4">
                  {Object.entries(stats.methods).sort((a, b) => b[1] - a[1]).map(([method, count]) => (
                    <div key={method} className="flex items-center gap-4">
                      <span className="w-16 text-white font-medium">{method}</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full transition-all duration-500"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-white/60">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6">
                <h3 className="text-white font-semibold text-lg mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {items.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div>
                        <div className="text-white font-medium text-sm">{item.name}</div>
                        <div className="text-white/40 text-xs">{item.collection}</div>
                      </div>
                      <span className="text-white/40 text-xs">{item.lastUsed}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl fade-in-up">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight mb-1">Settings</h2>
              <p className="text-white/60">Manage your preferences and data</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Display Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Appearance</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Dark Mode</div>
                    <div className="text-white/50 text-sm">Toggle between light and dark themes</div>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={cn(
                      "w-14 h-8 rounded-full transition-colors relative",
                      darkMode ? "bg-pink-500" : "bg-white/20"
                    )}
                  >
                    <div className={cn(
                      "absolute top-1 w-6 h-6 rounded-full bg-white transition-transform",
                      darkMode ? "left-7" : "left-1"
                    )} />
                  </button>
                </div>
              </div>

              <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Data Management</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={exportData}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Export JSON
                  </button>
                  <button
                    onClick={importData}
                    className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Import JSON
                  </button>
                </div>
              </div>

              <div className="bg-white/[.07] backdrop-blur-xl rounded-2xl border border-white/[.1] p-6">
                <h3 className="text-white font-semibold text-lg mb-4">Danger Zone</h3>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all data?')) {
                      setItems([])
                      setToast({ message: 'All data cleared', type: 'info' })
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 font-medium hover:bg-red-500/30 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showForm && <RequestForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}