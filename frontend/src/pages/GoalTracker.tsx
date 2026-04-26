import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface Goal {
  _id: string
  title: string
  target: number
  current: number
  frequency: 'weekly' | 'monthly'
  streak: number
  category: string
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    target: 100,
    frequency: 'monthly' as const,
    category: ''
  })

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGoals(response.data)
    } catch (error) {
      console.error('Failed to fetch goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/api/goals`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setFormData({
        title: '',
        target: 100,
        frequency: 'monthly',
        category: ''
      })
      setShowForm(false)
      fetchGoals()
    } catch (error) {
      console.error('Failed to create goal:', error)
    }
  }

  const handleUpdateProgress = async (goalId: string, increment: number) => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `${API_URL}/api/goals/${goalId}/progress`,
        { increment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchGoals()
    } catch (error) {
      console.error('Failed to update goal:', error)
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
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
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
              🎯 Goal Tracker
            </h1>
            <p className="text-white/60">Set and crush your weekly and monthly targets</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-gradient text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:scale-105"
          >
            {showForm ? '✕ Cancel' : '➕ New Goal'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleCreateGoal} className="glass p-8 rounded-3xl border-white/10 mb-8 animate-slide-in-up">
            <h2 className="text-2xl font-bold mb-6">Create New Goal</h2>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-white/80 font-semibold mb-2">Goal Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Generate ₹5000 in revenue"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 font-semibold mb-2">Target Value</label>
                <input
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                  required
                />
              </div>
              <div>
                <label className="block text-white/80 font-semibold mb-2">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'weekly' | 'monthly' })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 font-semibold mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Revenue, Clients, Content"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-gradient-green text-white font-bold py-3 rounded-2xl transition hover:shadow-lg hover:shadow-emerald-500/30"
            >
              Create Goal
            </button>
          </form>
        )}

        {/* Goals Grid */}
        {goals.length > 0 ? (
          <div className="grid gap-6">
            {goals.map((goal) => {
              const percentage = getProgressPercentage(goal.current, goal.target)
              return (
                <div key={goal._id} className="glass p-6 rounded-2xl border-white/10 hover:border-white/20 transition animate-slide-in-up">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
                      <p className="text-white/50 text-sm">
                        {goal.category} • {goal.frequency === 'weekly' ? '📅 Weekly' : '📆 Monthly'}
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <p className="text-3xl font-bold text-white">
                        {goal.current}/{goal.target}
                      </p>
                      <p className="text-purple-400 text-sm font-semibold">🔥 {goal.streak} streak</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden border border-white/20 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-700 h-full transition-all duration-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-sm">{percentage.toFixed(0)}% Complete</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleUpdateProgress(goal._id, 10)}
                      className="flex-1 glass-sm px-4 py-2 rounded-lg text-blue-400 border-blue-500/30 hover:bg-blue-500/20 transition font-semibold"
                    >
                      ➕ +10
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(goal._id, 25)}
                      className="flex-1 glass-sm px-4 py-2 rounded-lg text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 transition font-semibold"
                    >
                      ➕ +25
                    </button>
                    <button
                      onClick={() => handleUpdateProgress(goal._id, 50)}
                      className="flex-1 glass-sm px-4 py-2 rounded-lg text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20 transition font-semibold"
                    >
                      ➕ +50
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="glass p-12 rounded-3xl text-center border-white/10">
            <p className="text-white/60 text-lg">No goals yet. Create your first one! 🎯</p>
          </div>
        )}
      </div>
    </div>
  )
}
