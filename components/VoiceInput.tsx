'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { isSTTSupported, startListening } from '@/lib/voice'

type MicState = 'idle' | 'listening' | 'error'
type ErrorType = 'permission' | 'https' | 'no_mic' | 'other'

interface VoiceInputProps {
  onResult: (text: string) => void
  onFinal?: (text: string) => void
  disabled?: boolean
  hint?: string
}

export default function VoiceInput({ onResult, onFinal, disabled, hint }: VoiceInputProps) {
  const [micState, setMicState] = useState<MicState>('idle')
  const [errorType, setErrorType] = useState<ErrorType | null>(null)
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const stopSTTRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    setSupported(isSTTSupported())
  }, [])

  // Draw waveform loop — garis lurus saat idle, bergelombang saat ada suara
  const drawLoop = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const analyser = analyserRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.lineWidth = 2.5
    ctx.strokeStyle = '#1a9e58'
    ctx.beginPath()

    if (analyser) {
      const buf = new Uint8Array(analyser.fftSize)
      analyser.getByteTimeDomainData(buf)
      const step = W / buf.length
      buf.forEach((val, i) => {
        const y = ((val / 128) - 1) * (H / 2) + H / 2
        i === 0 ? ctx.moveTo(0, y) : ctx.lineTo(i * step, y)
      })
    } else {
      // flat line when idle
      ctx.moveTo(0, H / 2)
      ctx.lineTo(W, H / 2)
    }

    ctx.stroke()
    animRef.current = requestAnimationFrame(drawLoop)
  }, [])

  useEffect(() => {
    animRef.current = requestAnimationFrame(drawLoop)
    return () => cancelAnimationFrame(animRef.current)
  }, [drawLoop])

  const stopRecording = useCallback(() => {
    stopSTTRef.current?.()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    audioCtxRef.current?.close()
    analyserRef.current = null
    streamRef.current = null
    audioCtxRef.current = null
    setMicState('idle')
  }, [])

  const startRecording = useCallback(async () => {
    setTranscript('')
    setErrorType(null)

    // Deteksi HTTP non-localhost (mic diblokir browser)
    if (
      typeof window !== 'undefined' &&
      window.location.protocol !== 'https:' &&
      window.location.hostname !== 'localhost'
    ) {
      setErrorType('https')
      setMicState('error')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const audioCtx = new AudioContext()
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      analyserRef.current = analyser

      setMicState('listening')

      stopSTTRef.current = startListening({
        onResult: ({ text, isFinal }) => {
          setTranscript(text)
          onResult(text)
          if (isFinal) {
            onFinal?.(text)
            stopRecording()
          }
        },
        onEnd: () => stopRecording(),
      })
    } catch (err: unknown) {
      const name = (err as { name?: string }).name ?? ''
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setErrorType('permission')
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setErrorType('no_mic')
      } else {
        setErrorType('other')
      }
      setMicState('error')
    }
  }, [onFinal, onResult, stopRecording])

  const toggle = () => {
    if (micState === 'listening') stopRecording()
    else startRecording()
  }

  if (!supported) return null

  // ── Error / Panduan izin ──────────────────────────────────────────────────
  if (micState === 'error') {
    return (
      <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-2 mb-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <p className="text-sm font-semibold text-amber-700">
            {errorType === 'permission' && 'Izin Mikrofon Ditolak'}
            {errorType === 'https' && 'Mikrofon Butuh Koneksi Aman (HTTPS)'}
            {errorType === 'no_mic' && 'Mikrofon Tidak Ditemukan'}
            {errorType === 'other' && 'Mikrofon Tidak Bisa Diakses'}
          </p>
        </div>

        {errorType === 'permission' && (
          <div className="mb-3 rounded-xl bg-white p-3 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-gray-800 mb-1">Cara izinkan mikrofon di Chrome HP:</p>
            <p>1. Ketuk ikon <strong>kunci</strong> atau <strong>info</strong> di address bar</p>
            <p>2. Pilih <strong>Izin situs</strong></p>
            <p>3. Cari <strong>Mikrofon</strong> lalu pilih <strong>Izinkan</strong></p>
            <p>4. Muat ulang halaman</p>
          </div>
        )}

        {errorType === 'https' && (
          <div className="mb-3 rounded-xl bg-white p-3 text-xs text-gray-600 space-y-1">
            <p>Browser memblokir mikrofon di jaringan lokal (HTTP).</p>
            <p className="mt-1">Untuk menggunakan fitur suara, akses melalui:</p>
            <p className="font-mono bg-gray-100 rounded px-2 py-1 mt-1">localhost:3000</p>
            <p className="mt-1">atau deploy ke <strong>Vercel</strong> (HTTPS otomatis).</p>
          </div>
        )}

        {errorType === 'no_mic' && (
          <p className="text-xs text-amber-600 mb-3">
            Tidak ada mikrofon yang terdeteksi. Gunakan mode Ketuk.
          </p>
        )}

        <button
          type="button"
          onClick={() => setMicState('idle')}
          className="w-full rounded-xl bg-brand-green py-2.5 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Kembali
        </button>
      </div>
    )
  }

  // ── Normal (idle + listening) ─────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-2 mt-3">
      {/* Waveform */}
      <div className={`w-full rounded-xl overflow-hidden transition-all duration-300 ${micState === 'listening' ? 'bg-brand-green-light' : 'bg-gray-50'}`}>
        <canvas
          ref={canvasRef}
          width={320}
          height={48}
          className="w-full h-12"
        />
      </div>

      {/* Mic button */}
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-label={micState === 'listening' ? 'Hentikan mikrofon' : 'Mulai berbicara'}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all duration-200
          ${micState === 'listening'
            ? 'bg-brand-red text-white scale-110'
            : 'bg-brand-green text-white hover:bg-brand-green-dark active:scale-95'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        `}
      >
        {micState === 'listening' ? (
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
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

      <p className="text-sm text-gray-400 text-center min-h-5">
        {micState === 'listening'
          ? transcript ? `"${transcript}"` : 'Mendengarkan...'
          : (hint ?? 'Ketuk untuk berbicara')}
      </p>
    </div>
  )
}
