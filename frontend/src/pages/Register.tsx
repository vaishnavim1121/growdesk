import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface RegisterProps {
  setIsAuthenticated: (value: boolean) => void
}

export default function Register({ setIsAuthenticated }: RegisterProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    businessName: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, formData)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setIsAuthenticated(true)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="glass max-w-md w-full p-8 rounded-3xl border-white/10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-2">
            🎉 Join GrowDesk
          </h2>
          <p className="text-white/60">Start your micro-business journey</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 font-semibold mb-2">Business Name (Optional)</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10"
            />
          </div>

          <div>
            <label className="block text-white/80 font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10"
              required
            />
          </div>

          <div>
            <label className="block text-white/80 font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gradient-green text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-500/30"
          >
            {loading ? '🔄 Creating account...' : '🚀 Register'}
          </button>
        </form>

        <p className="text-center mt-6 text-white/60">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
