import { Link, useNavigate } from 'react-router-dom'
import CreditsDisplay from './CreditsDisplay'
import { useState } from 'react'

interface EnhancedNavbarProps {
  onLogout: () => void
  credits?: number
}

export default function EnhancedNavbar({ onLogout, credits = 5 }: EnhancedNavbarProps) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            🚀 GrowDesk
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-white/70 hover:text-white transition">Dashboard</Link>
            <Link to="/ideas" className="text-white/70 hover:text-white transition">Validate Ideas</Link>
            <Link to="/invoices" className="text-white/70 hover:text-white transition">Invoices</Link>
            <Link to="/content" className="text-white/70 hover:text-white transition">Content</Link>
            <Link to="/goals" className="text-white/70 hover:text-white transition">Goals</Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/60 hidden md:block">{user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="glass-sm px-4 py-2 rounded-lg text-red-400 border-red-500/30 hover:bg-red-500/10 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Credits Display */}
      <CreditsDisplay credits={credits} />
    </nav>
  )
}
