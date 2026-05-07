'use client'

import { useEffect, useRef, useState } from 'react'
import { speak, stopSpeaking, isTTSSupported } from '@/lib/voice'

const GREETING_TEXT =
  'Halo! Terima kasih sudah pesan di Nasi Goreng D4. Kami ingin tau pendapat kamu tentang pesanan tadi. Hanya 2 sampai 3 menit aja!'

interface VoiceGreetingProps {
  onDone?: () => void
}

export default function VoiceGreeting({ onDone }: VoiceGreetingProps) {
  const [speaking, setSpeaking] = useState(false)
  const [supported, setSupported] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const hasPlayed = useRef(false)

  useEffect(() => {
    setSupported(isTTSSupported())
  }, [])

  useEffect(() => {
    if (!supported || hasPlayed.current) return
    const timer = setTimeout(() => {
      hasPlayed.current = true
      setSpeaking(true)
      speak(GREETING_TEXT, {
        onEnd: () => {
          setSpeaking(false)
          onDone?.()
        },
      })
    }, 600)
    return () => clearTimeout(timer)
  }, [supported, onDone])

  const dismiss = () => {
    stopSpeaking()
    setSpeaking(false)
    setDismissed(true)
    onDone?.()
  }

  if (!supported || dismissed) return null

  return (
    <div className="flex items-center gap-3 bg-brand-green-light border border-brand-green-mid rounded-2xl px-4 py-3 mb-4">
      <div className={`w-8 h-8 rounded-full bg-brand-green flex items-center justify-center flex-shrink-0 ${speaking ? 'animate-pulse' : ''}`}>
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
      </div>
      <p className="text-sm text-brand-green flex-1 font-medium">
        {speaking ? 'Memutar sapaan suara...' : 'Sapaan suara aktif'}
      </p>
      <button onClick={dismiss} className="text-brand-green text-xs underline flex-shrink-0">
        Lewati
      </button>
    </div>
  )
}
