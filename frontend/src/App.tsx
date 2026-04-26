import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import IdeaValidator from './pages/IdeaValidator'
import InvoiceManager from './pages/InvoiceManager'
import ContentGenerator from './pages/ContentGenerator'
import GoalTracker from './pages/GoalTracker'
import EnhancedNavbar from './components/EnhancedNavbar'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token')
  })
  const [credits, setCredits] = useState(5)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  return (
    <Router>
      {isAuthenticated && <EnhancedNavbar onLogout={handleLogout} credits={credits} />}
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
        
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ideas" element={<IdeaValidator />} />
            <Route path="/invoices" element={<InvoiceManager />} />
            <Route path="/content" element={<ContentGenerator />} />
            <Route path="/goals" element={<GoalTracker />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  )
}

export default App
