'use client'

import { useEffect, useRef, useState } from 'react'
import { isSTTSupported, startListening } from '@/lib/voice'

interface VoiceInputProps {
  onResult: (text: string) => void
  onFinal?: (text: string) => void
  disabled?: boolean
  hint?: string
}

export default function VoiceInput({ onResult, onFinal, disabled, hint }: VoiceInputProps) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(false)
  const stopRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    setSupported(isSTTSupported())
  }, [])

  const toggle = () => {
    if (listening) {
      stopRef.current?.()
      setListening(false)
      return
    }

    setTranscript('')
    setListening(true)

    stopRef.current = startListening({
      onResult: ({ text, isFinal }) => {
        setTranscript(text)
        onResult(text)
        if (isFinal) {
          onFinal?.(text)
          setListening(false)
        }
      },
      onEnd: () => setListening(false),
    })
  }

  if (!supported) return null

  return (
    <div className="flex flex-col items-center gap-2 mt-3">
      <button
        onClick={toggle}
        disabled={disabled}
        aria-label={listening ? 'Hentikan mikrofon' : 'Mulai berbicara'}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-md
          ${listening
            ? 'bg-brand-red text-white scale-110 shadow-red-200 shadow-lg'
            : 'bg-brand-green text-white hover:bg-brand-green-dark active:scale-95'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        `}
      >
        {listening ? (
          <svg className="w-7 h-7 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="2" />
            <rect x="14" y="4" width="4" height="16" rx="2" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
            <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V20H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.07A7 7 0 0 0 19 11z" />
          </svg>
        )}
      </button>

      {listening && (
        <div className="flex items-center gap-1.5">
          {[1,2,3,4,5].map((i) => (
            <span
              key={i}
              className="w-1 bg-brand-green rounded-full animate-bounce"
              style={{ height: `${8 + (i % 3) * 6}px`, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      )}

      {transcript ? (
        <p className="text-sm text-gray-600 text-center italic max-w-xs">"{transcript}"</p>
      ) : (
        <p className="text-sm text-gray-400 text-center">
          {listening ? 'Sedang mendengarkan...' : (hint ?? 'Ketuk untuk berbicara')}
        </p>
      )}
    </div>
  )
}
