import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

interface CreditsDisplayProps {
  credits: number
  onUpgrade?: () => void
}

export default function CreditsDisplay({ credits, onUpgrade }: CreditsDisplayProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const isLow = credits <= 2
  const isEmpty = credits === 0

  return (
    <>
      {/* Credits Badge */}
      <div
        className={`fixed top-20 right-8 glass px-6 py-3 rounded-full font-semibold flex items-center gap-2 z-40 ${
          isEmpty ? 'animate-pulse-glow border-red-500/50' : isLow ? 'border-yellow-500/50' : 'border-blue-500/50'
        }`}
      >
        <span className="text-xl">⚡</span>
        <div>
          <span className={isEmpty ? 'text-red-400' : isLow ? 'text-yellow-400' : 'text-blue-400'}>
            {credits} Credits
          </span>
          <span className="text-white/60 text-xs ml-2">/Month</span>
        </div>
        {isEmpty && (
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="ml-4 bg-red-500/20 hover:bg-red-500/30 px-3 py-1 rounded-full text-xs font-bold border border-red-500/50"
          >
            UPGRADE
          </button>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-slide-in-up">
          <div className="glass max-w-md w-full p-8">
            <h3 className="text-2xl font-bold mb-4">✨ Out of Credits!</h3>
            <p className="text-white/70 mb-6">
              You've used all your monthly AI credits. Upgrade to Pro to keep generating amazing content.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-white/80">
                <span>✅</span>
                <span>Unlimited AI generations</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <span>✅</span>
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <span>✅</span>
                <span>Priority support</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-white/60">Pro Plan</p>
              <p className="text-3xl font-bold">₹199 <span className="text-lg text-white/60">/month</span></p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-white/20 hover:bg-white/5 transition"
              >
                Later
              </button>
              <button
                onClick={onUpgrade}
                className="flex-1 btn-gradient-green text-white px-4 py-2 rounded-lg font-semibold"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
