import { useState, useRef } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

type InputType = 'text' | 'url' | 'image' | null

interface MagicPasteInputProps {
  onValidate: (data: any) => void
  loading: boolean
}

export default function MagicPasteInput({ onValidate, loading }: MagicPasteInputProps) {
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState<InputType>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const detectInputType = (value: string): InputType => {
    if (!value.trim()) return null
    if (value.startsWith('http://') || value.startsWith('https://')) return 'url'
    return 'text'
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInput(value)
    setInputType(detectInputType(value))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setPreview(base64)
        setInput(base64)
        setInputType('image')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleValidate = async () => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await axios.post(
        `${API_URL}/api/ideas/validate-advanced`,
        {
          input,
          inputType,
          timestamp: new Date()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      onValidate(response.data)
      setInput('')
      setPreview(null)
      setInputType(null)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  return (
    <div className="glass p-8 rounded-3xl space-y-4">
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => document.getElementById('magic-input')?.focus()}
          className={`glass-sm px-4 py-2 rounded-lg font-semibold transition ${
            inputType === 'text' || inputType === null ? 'bg-blue-500/30 border-blue-500/50' : 'border-white/10'
          }`}
        >
          📝 Text
        </button>
        <button
          onClick={() => document.getElementById('magic-input')?.focus()}
          className={`glass-sm px-4 py-2 rounded-lg font-semibold transition ${
            inputType === 'url' ? 'bg-blue-500/30 border-blue-500/50' : 'border-white/10'
          }`}
        >
          🔗 URL
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`glass-sm px-4 py-2 rounded-lg font-semibold transition ${
            inputType === 'image' ? 'bg-blue-500/30 border-blue-500/50' : 'border-white/10'
          }`}
        >
          🖼️ Image
        </button>
      </div>

      {preview && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-white/20">
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <button
            onClick={() => {
              setPreview(null)
              setInput('')
              setInputType(null)
            }}
            className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>
      )}

      <textarea
        id="magic-input"
        value={input}
        onChange={handleInputChange}
        placeholder="✨ Magic works with:\n📝 Text: Describe your idea\n🔗 URL: Paste competitor website\n🖼️ Image: Upload napkin sketch"
        rows={8}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 focus:bg-white/10"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <button
        onClick={handleValidate}
        disabled={!input || loading}
        className="w-full btn-gradient text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20 transition"
      >
        {loading ? '🔄 Analyzing with AI...' : '🚀 Validate Idea'}
      </button>

      {inputType && (
        <p className="text-xs text-white/50 text-center">
          Detected: {inputType === 'text' ? '📝 Text' : inputType === 'url' ? '🔗 URL' : '🖼️ Image'}
        </p>
      )}
    </div>
  )
}
