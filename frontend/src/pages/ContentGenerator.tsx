import { useState } from 'react'
import axios from 'axios'
import ShareButtons from '../components/ShareButtons'
import CreditsDisplay from '../components/CreditsDisplay'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

type ContentType = 'social' | 'email' | 'product'

interface GeneratedContent {
  content: string
  creditsRemaining: number
}

const contentTypes = [
  { id: 'social', label: '📱 Social Media', emoji: '📱', color: 'from-pink-500 to-pink-700' },
  { id: 'email', label: '✉️ Email Pitches', emoji: '✉️', color: 'from-blue-500 to-blue-700' },
  { id: 'product', label: '📦 Product Desc', emoji: '📦', color: 'from-purple-500 to-purple-700' }
] as const

export default function ContentGenerator() {
  const [contentType, setContentType] = useState<ContentType>('social')
  const [context, setContext] = useState('')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [credits, setCredits] = useState(5)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/api/content/generate`,
        { type: contentType, context },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setGeneratedContent(response.data)
      setCredits(response.data.creditsRemaining)
      setContext('')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.content)
      alert('✅ Copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
            🤖 AI Content Generator
          </h1>
          <p className="text-white/60 text-lg">Generate captions, emails, and product descriptions powered by AI.</p>
        </div>

        {/* Credits Display */}
        <CreditsDisplay credits={credits} />

        {/* Main Form */}
        <div className="glass p-8 rounded-3xl border-white/10 mt-12 mb-8">
          <h2 className="text-2xl font-bold mb-6">What type of content?</h2>

          {/* Content Type Selector */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setContentType(type.id as ContentType)}
                className={`p-4 rounded-2xl border-2 transition transform hover:scale-105 ${
                  contentType === type.id
                    ? `border-white/40 bg-white/10`
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <span className="text-3xl block mb-2">{type.emoji}</span>
                <span className="font-semibold text-sm">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Input Field */}
          <form onSubmit={handleGenerate}>
            <div className="mb-6">
              <label className="block text-white/80 font-semibold mb-3">What should the content be about?</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., I'm launching an AI productivity tool for remote teams. Highlight the time-saving features."
                rows={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || credits <= 0}
              className="w-full btn-gradient text-white font-bold py-3 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:scale-105"
            >
              {loading ? '🔄 Generating...' : credits <= 0 ? '❌ No Credits' : '✨ Generate Content'}
            </button>
          </form>
        </div>

        {/* Generated Content Display */}
        {generatedContent && (
          <div className="glass p-8 rounded-3xl border-white/10 animate-slide-in-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🎉 Your Content</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="glass-sm px-4 py-2 rounded-lg text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 transition font-semibold"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-6 whitespace-pre-wrap text-white/90 leading-relaxed">
              {generatedContent.content}
            </div>

            {/* Share Section */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-white/60 text-sm mb-4">📤 Share directly:</p>
              <ShareButtons
                content={generatedContent.content}
                title={`Check out this ${contentType} content!`}
                type="caption"
              />
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/50 text-sm">💡 Credits remaining: <span className="text-blue-400 font-bold">{generatedContent.creditsRemaining}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
