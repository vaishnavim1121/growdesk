import { useState } from 'react'
import MagicPasteInput from '../components/MagicPasteInput'
import ShareButtons from '../components/ShareButtons'

interface ValidationResult {
  viabilityScore: number
  marketFit: string
  competition: string
  revenuePotential: string
  risks: string[]
  opportunities: string[]
  competitorStrengths?: string[]
  competitorWeaknesses?: string[]
  yourDifferentiator?: string
}

export default function IdeaValidator() {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleValidate = (data: any) => {
    setResult(data.analysis)
    setLoading(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'bg-emerald-500/20 border-emerald-500/30'
    if (score >= 50) return 'bg-yellow-500/20 border-yellow-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            ✨ Business Idea Validator
          </h1>
          <p className="text-white/60 text-lg">Paste text, URL, or image. AI will analyze viability instantly.</p>
        </div>

        {/* Magic Paste Input */}
        <div className="mb-8">
          <MagicPasteInput onValidate={handleValidate} loading={loading} />
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-slide-in-up">
            {/* Viability Score */}
            <div className={`glass p-8 rounded-3xl border ${getScoreBg(result.viabilityScore)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-2">Viability Score</p>
                  <p className={`text-6xl font-bold ${getScoreColor(result.viabilityScore)}`}>
                    {result.viabilityScore}/100
                  </p>
                </div>
                <div className="text-6xl">
                  {result.viabilityScore >= 70 ? '🚀' : result.viabilityScore >= 50 ? '⚡' : '⚠️'}
                </div>
              </div>

              {/* Score interpretation */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/70">
                  {result.viabilityScore >= 70
                    ? '💚 This idea has strong market potential. Consider launching soon!'
                    : result.viabilityScore >= 50
                    ? '💛 Moderate potential. Refine your value proposition before launch.'
                    : '⚠️ High risk. Consider pivoting or validating with customers first.'}
                </p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Market Fit */}
              <div className="glass-sm p-6 rounded-2xl border-white/10">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span>🎯</span> Market Fit
                </h3>
                <p className="text-white/80">{result.marketFit}</p>
              </div>

              {/* Competition */}
              <div className="glass-sm p-6 rounded-2xl border-white/10">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span>⚔️</span> Competition
                </h3>
                <p className="text-white/80">{result.competition}</p>
              </div>

              {/* Revenue Potential */}
              <div className="glass-sm p-6 rounded-2xl border-white/10">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <span>💰</span> Revenue Potential
                </h3>
                <p className="text-white/80">{result.revenuePotential}</p>
              </div>

              {/* Your Differentiator (if available) */}
              {result.yourDifferentiator && (
                <div className="glass-sm p-6 rounded-2xl border-white/10 bg-blue-500/10 border-blue-500/30">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span>💎</span> Your Edge
                  </h3>
                  <p className="text-blue-300">{result.yourDifferentiator}</p>
                </div>
              )}
            </div>

            {/* Risks & Opportunities */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Risks */}
              <div className="glass-sm p-6 rounded-2xl border-red-500/30 bg-red-500/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                  <span>⚠️</span> Risks to Consider
                </h3>
                <ul className="space-y-3">
                  {result.risks.map((risk, i) => (
                    <li key={i} className="flex gap-3 text-white/80">
                      <span className="text-red-400 flex-shrink-0">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="glass-sm p-6 rounded-2xl border-emerald-500/30 bg-emerald-500/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-400">
                  <span>🎯</span> Opportunities
                </h3>
                <ul className="space-y-3">
                  {result.opportunities.map((opp, i) => (
                    <li key={i} className="flex gap-3 text-white/80">
                      <span className="text-emerald-400 flex-shrink-0">•</span>
                      <span>{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Competitor Strengths & Weaknesses (if available) */}
            {result.competitorStrengths && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-sm p-6 rounded-2xl border-white/10">
                  <h3 className="text-lg font-bold mb-4">💪 Competitor Strengths</h3>
                  <ul className="space-y-2">
                    {result.competitorStrengths.map((strength, i) => (
                      <li key={i} className="text-white/80 flex gap-2">
                        <span>✓</span> {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-sm p-6 rounded-2xl border-white/10">
                  <h3 className="text-lg font-bold mb-4">🔓 Competitor Weaknesses</h3>
                  <ul className="space-y-2">
                    {result.competitorWeaknesses?.map((weakness, i) => (
                      <li key={i} className="text-white/80 flex gap-2">
                        <span>✗</span> {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="glass p-6 rounded-2xl border-white/10">
              <h3 className="text-lg font-bold mb-4">📤 Share This Analysis</h3>
              <ShareButtons
                content={`Viability Score: ${result.viabilityScore}/100\n\nMarket Fit: ${result.marketFit}\n\nRevenue Potential: ${result.revenuePotential}`}
                title="Business Idea Analysis"
                type="general"
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && (
          <div className="text-center py-12">
            <p className="text-white/40 text-lg">Upload an idea to get started 👆</p>
          </div>
        )}
      </div>
    </div>
  )
}
