import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import SmartExpenseTracker from '../components/SmartExpenseTracker'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface DashboardData {
  summary: {
    totalInvoices: number
    paidInvoices: number
    totalRevenue: number
    activeGoals: number
    ideasValidated: number
  }
  goals: any[]
  recentInvoices: any[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-xl">🔄 Loading...</div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Welcome to GrowDesk 🚀
          </h1>
          <p className="text-white/60 text-lg">Your all-in-one micro-business toolkit</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Invoices', value: data?.summary.totalInvoices || 0, emoji: '📄', color: 'from-blue-500 to-blue-700' },
            { label: 'Paid Invoices', value: data?.summary.paidInvoices || 0, emoji: '✅', color: 'from-emerald-500 to-emerald-700' },
            { label: 'Total Revenue', value: `₹${data?.summary.totalRevenue || 0}`, emoji: '💰', color: 'from-yellow-500 to-yellow-700' },
            { label: 'Active Goals', value: data?.summary.activeGoals || 0, emoji: '🎯', color: 'from-purple-500 to-purple-700' },
            { label: 'Ideas Validated', value: data?.summary.ideasValidated || 0, emoji: '✨', color: 'from-pink-500 to-pink-700' }
          ].map((stat, i) => (
            <div key={i} className="glass p-6 rounded-2xl border-white/10 hover:border-white/20 transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.emoji}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Smart Expense Tracker */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">💡 Quick Log</h2>
          <SmartExpenseTracker />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { href: '/ideas', icon: '✨', label: 'Validate Ideas', color: 'from-blue-500/20 to-blue-700/20 border-blue-500/30' },
              { href: '/invoices', icon: '📄', label: 'Create Invoice', color: 'from-emerald-500/20 to-emerald-700/20 border-emerald-500/30' },
              { href: '/content', icon: '🤖', label: 'Generate Content', color: 'from-pink-500/20 to-pink-700/20 border-pink-500/30' },
              { href: '/goals', icon: '🎯', label: 'Set Goals', color: 'from-purple-500/20 to-purple-700/20 border-purple-500/30' }
            ].map((action, i) => (
              <Link
                key={i}
                to={action.href}
                className={`glass p-6 rounded-2xl border transition hover:scale-105 transform bg-gradient-to-br ${action.color}`}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className="font-semibold text-white">{action.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {data?.recentInvoices && data.recentInvoices.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">📊 Recent Invoices</h2>
            <div className="glass rounded-2xl border-white/10 overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-white/60 text-sm">Invoice</th>
                    <th className="px-6 py-4 text-left text-white/60 text-sm">Client</th>
                    <th className="px-6 py-4 text-left text-white/60 text-sm">Amount</th>
                    <th className="px-6 py-4 text-left text-white/60 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentInvoices.map((invoice) => (
                    <tr key={invoice._id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-6 py-4 font-mono text-sm text-blue-400">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-4 text-white">{invoice.clientName}</td>
                      <td className="px-6 py-4 font-semibold text-white">₹{invoice.amount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            invoice.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : invoice.status === 'sent'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}
                        >
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
