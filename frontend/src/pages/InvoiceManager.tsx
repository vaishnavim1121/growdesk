import { useState, useEffect } from 'react'
import axios from 'axios'
import ShareButtons from '../components/ShareButtons'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface Invoice {
  _id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  amount: number
  status: string
  dueDate: string
  items?: Array<{ description: string; quantity: number; rate: number }>
  createdAt: string
}

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    dueDate: ''
  })

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInvoices(response.data)
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/api/invoices`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setFormData({
        clientName: '',
        clientEmail: '',
        items: [{ description: '', quantity: 1, rate: 0 }],
        dueDate: ''
      })
      setShowForm(false)
      fetchInvoices()
    } catch (error) {
      console.error('Failed to create invoice:', error)
    }
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, rate: 0 }]
    })
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      sent: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      paid: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      overdue: 'bg-red-500/20 text-red-300 border-red-500/30'
    }
    return colors[status] || colors.draft
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-xl">🔄 Loading...</div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-2">
              📄 Invoice Manager
            </h1>
            <p className="text-white/60">Create and manage professional invoices</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-gradient-green text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition transform hover:scale-105"
          >
            {showForm ? '✕ Cancel' : '➕ New Invoice'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleCreateInvoice} className="glass p-8 rounded-3xl border-white/10 mb-8 animate-slide-in-up">
            <h2 className="text-2xl font-bold mb-6">Create New Invoice</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white/80 font-semibold mb-2">Client Name</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 font-semibold mb-2">Client Email</label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-gradient-green text-white font-bold py-3 rounded-2xl transition hover:shadow-lg hover:shadow-emerald-500/30"
            >
              Create Invoice
            </button>
          </form>
        )}

        {/* Invoices List */}
        {invoices.length > 0 ? (
          <div className="glass rounded-3xl border-white/10 overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Invoice #</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Client</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-white/60 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-6 py-4 font-mono text-blue-400 text-sm">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-semibold">{invoice.clientName}</p>
                        <p className="text-white/50 text-sm">{invoice.clientEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">₹{invoice.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm">{new Date(invoice.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <ShareButtons
                        content={`Invoice ${invoice.invoiceNumber}\nClient: ${invoice.clientName}\nAmount: ₹${invoice.amount}`}
                        title={`Invoice ${invoice.invoiceNumber}`}
                        type="invoice"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass p-12 rounded-3xl text-center border-white/10">
            <p className="text-white/60 text-lg">No invoices yet. Create your first one! 📄</p>
          </div>
        )}
      </div>
    </div>
  )
}
