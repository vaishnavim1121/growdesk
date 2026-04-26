import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface ExpenseData {
  amount: number
  category: string
  description: string
  type: 'in' | 'out'
  tags: string[]
}

interface SmartExpenseTrackerProps {
  onExpenseAdded?: (expense: ExpenseData) => void
}

export default function SmartExpenseTracker({ onExpenseAdded }: SmartExpenseTrackerProps) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ExpenseData | null>(null)

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/api/expenses/parse`,
        { naturalText: input },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setResult(response.data)
      onExpenseAdded?.(response.data)
      setInput('')
    } catch (error) {
      console.error('Failed to parse expense:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryEmoji = (category: string) => {
    const emojis: any = {
      'Food & Beverage': '🍕',
      'Marketing': '📢',
      'Networking': '🤝',
      'Software': '💻',
      'Office': '🏢',
      'Transportation': '🚗',
      'Other': '📌'
    }
    return emojis[category] || '💰'
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleParse} className="glass p-8 rounded-3xl">
        <h3 className="text-xl font-bold mb-4">💡 Smart Ledger</h3>
        <p className="text-white/60 text-sm mb-4">Just describe it naturally...</p>
        
        <div className="space-y-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'Spent 500 on coffee with a client' or 'Made 5000 from invoice #INV-123'"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
          />

          <button
            type="submit"
            disabled={!input || loading}
            className="w-full btn-gradient-green text-white font-bold py-3 rounded-xl disabled:opacity-50 transition"
          >
            {loading ? '🔄 Processing...' : '📝 Log Entry'}
          </button>
        </div>
      </form>

      {result && (
        <div className="glass-sm p-6 rounded-2xl animate-slide-in-up">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold mb-2">
                {getCategoryEmoji(result.category)} {result.category}
              </h4>
              <p className="text-white/60 text-sm">{result.description}</p>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${
                result.type === 'out' ? 'text-red-400' : 'text-green-400'
              }`}>
                {result.type === 'out' ? '-' : '+'} ₹{result.amount}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {result.tags.map((tag, i) => (
              <span key={i} className="bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
