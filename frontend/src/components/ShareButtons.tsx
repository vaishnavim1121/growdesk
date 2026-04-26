interface ShareButtonsProps {
  content: string
  title?: string
  type?: 'invoice' | 'caption' | 'general'
}

export default function ShareButtons({ content, title = 'Check this out', type = 'general' }: ShareButtonsProps) {
  const shareToWhatsApp = () => {
    const message = `${title}\n\n${content}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
  }

  const shareToTelegram = () => {
    const message = `${title}\n\n${content}`
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://t.me/share/url?url=${encodedMessage}`, '_blank')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
    alert('Copied to clipboard!')
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={shareToWhatsApp}
        className="glass-sm px-4 py-2 rounded-lg font-semibold hover:bg-white/15 flex items-center gap-2 text-green-400 border-green-500/30"
      >
        <span>💬</span>
        WhatsApp
      </button>

      <button
        onClick={shareToTelegram}
        className="glass-sm px-4 py-2 rounded-lg font-semibold hover:bg-white/15 flex items-center gap-2 text-blue-400 border-blue-500/30"
      >
        <span>✈️</span>
        Telegram
      </button>

      <button
        onClick={copyToClipboard}
        className="glass-sm px-4 py-2 rounded-lg font-semibold hover:bg-white/15 flex items-center gap-2 text-purple-400 border-purple-500/30"
      >
        <span>📋</span>
        Copy
      </button>
    </div>
  )
}
