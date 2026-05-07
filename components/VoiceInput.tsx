'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { startRecording, stopAndTranscribe, cancelRecording } from '@/lib/elevenlabs'

type MicState = 'idle' | 'listening' | 'processing' | 'error'
type ErrorType = 'permission' | 'https' | 'other'

interface VoiceInputProps {
  onResult: (text: string) => void
  onFinal?: (text: string) => void
  disabled?: boolean
  hint?: string
  /** Auto-mulai mic begitu component mount */
  autoStart?: boolean
}

const BARS = [14, 22, 32, 26, 36, 24, 30, 20, 12]
const DELAYS = [0, 0.15, 0.05, 0.25, 0.1, 0.3, 0.08, 0.2, 0.35]

export default function VoiceInput({ onResult, onFinal, disabled, hint, autoStart }: VoiceInputProps) {
  const [micState, setMicState] = useState<MicState>('idle')
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [transcript, setTranscript] = useState('')
  const busyRef = useRef(false)

  const handleStop = useCallback(async () => {
    if (busyRef.current) return
    busyRef.current = true
    setMicState('processing')

    try {
      const text = await stopAndTranscribe()
      if (text) {
        setTranscript(text)
        onResult(text)
        onFinal?.(text)
      }
    } catch {
      // tetap kembali ke idle, jangan show error
    } finally {
      setMicState('idle')
      busyRef.current = false
    }
  }, [onFinal, onResult])

  const handleStart = useCallback(async () => {
    if (busyRef.current || disabled) return
    busyRef.current = true

    setTranscript('')
    setErrorType(null)

    if (
      typeof window !== 'undefined' &&
      window.location.protocol !== 'https:' &&
      window.location.hostname !== 'localhost'
    ) {
      setErrorType('https')
      setMicState('error')
      busyRef.current = false
      return
    }

    await startRecording(
      () => { setMicState('listening'); busyRef.current = false },
      (err) => {
        setErrorType(err === 'Microphone error' ? 'permission' : 'other')
        setMicState('error')
        busyRef.current = false
      },
    )
  }, [disabled])

  // Auto-start saat mount jika autoStart=true
  useEffect(() => {
    if (autoStart && micState === 'idle' && !errorType) {
      // delay sebentar biar TTS sempat mulai dulu
      const t = setTimeout(() => handleStart(), 100)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart])

  // Cleanup saat unmount (ganti soal)
  useEffect(() => {
    return () => { cancelRecording() }
  }, [])

  const toggle = () => {
    if (disabled || micState === 'error' || micState === 'processing') return
    if (micState === 'listening') handleStop()
    else handleStart()
  }

  // ── Error UI ──────────────────────────────────────────────────────────────
  if (micState === 'error') {
    return (
      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="mb-3 flex items-start gap-2">
          <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p className="text-sm font-semibold text-amber-700">
            {errorType === 'permission' ? 'Izin Mikrofon Ditolak' :
             errorType === 'https'      ? 'Mikrofon Butuh HTTPS' :
             'Mikrofon Tidak Bisa Diakses'}
          </p>
        </div>

        {errorType === 'permission' && (
          <div className="mb-3 space-y-1 rounded-xl bg-white p-3 text-xs text-gray-600">
            <p className="mb-1 font-semibold text-gray-800">Cara mengaktifkan mikrofon:</p>
            <p>1. Ketuk ikon <strong>kunci</strong> di address bar</p>
            <p>2. Pilih <strong>Izin Situs</strong></p>
            <p>3. Aktifkan <strong>Mikrofon</strong> → Refresh halaman</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => { setMicState('idle'); setErrorType(null) }}
          className="w-full rounded-xl bg-brand-green py-2.5 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  // ── Normal UI ─────────────────────────────────────────────────────────────
  return (
    <div className="mt-3 flex flex-col items-center gap-2">
      <div className={`flex h-12 w-full items-center justify-center gap-1 rounded-xl transition-colors duration-300 ${
        micState === 'listening' ? 'bg-brand-green-light' :
        micState === 'processing' ? 'bg-blue-50' : 'bg-gray-50'
      }`}>
        {micState === 'listening' ? (
          BARS.map((maxH, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-brand-green"
              style={{
                height: '4px',
                '--bar-max': `${maxH}px`,
                animation: `soundbar 0.7s ease-in-out ${DELAYS[i]}s infinite`,
              } as React.CSSProperties}
            />
          ))
        ) : micState === 'processing' ? (
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs text-blue-500 font-medium">Memproses suara...</span>
          </div>
        ) : (
          <div className="h-0.5 w-4/5 rounded-full bg-gray-300" />
        )}
      </div>

      <button
        type="button"
        onClick={toggle}
        disabled={disabled || micState === 'processing'}
        aria-label={micState === 'listening' ? 'Selesai bicara' : 'Mulai bicara'}
        className={`flex h-16 w-16 items-center justify-center rounded-full shadow-md transition-all duration-200
          ${micState === 'listening'
            ? 'scale-110 bg-brand-red text-white'
            : micState === 'processing'
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-brand-green text-white hover:bg-brand-green-dark active:scale-95'
          }
          ${disabled ? 'cursor-not-allowed opacity-40' : ''}
        `}
      >
        {micState === 'listening' ? (
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" rx="2" />
            <rect x="14" y="4" width="4" height="16" rx="2" />
          </svg>
        ) : micState === 'processing' ? (
          <svg className="h-7 w-7 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
            <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V20H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.07A7 7 0 0 0 19 11z" />
          </svg>
        )}
      </button>

      <p className="min-h-5 text-center text-sm text-gray-400">
        {micState === 'listening'
          ? 'Bicara sekarang, ketuk lagi bila selesai'
          : micState === 'processing'
          ? ''
          : transcript
          ? `"${transcript}"`
          : (hint ?? 'Ketuk untuk berbicara')}
      </p>
    </div>
  )
}
