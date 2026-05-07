'use client'

// ── TTS ──────────────────────────────────────────────────────────────────────

export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, options?: { rate?: number; onEnd?: () => void }): void {
  if (!isTTSSupported()) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'id-ID'
  u.rate = options?.rate ?? 1.1
  u.pitch = 1.0
  if (options?.onEnd) u.onend = options.onEnd
  u.onerror = () => options?.onEnd?.()
  window.speechSynthesis.speak(u)
}

export function stopSpeaking(): void {
  if (isTTSSupported()) window.speechSynthesis.cancel()
}

// ── STT ──────────────────────────────────────────────────────────────────────

export function isSTTSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  )
}

type RecognitionResult = { text: string; isFinal: boolean }
type RecognitionError = 'permission' | 'network' | 'other'

export function startListening(options: {
  onResult: (r: RecognitionResult) => void
  onEnd?: () => void
  onError?: (type: RecognitionError) => void
}): () => void {
  if (!isSTTSupported()) { options.onEnd?.(); return () => {} }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Ctor = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r: any = new Ctor()
  r.lang = 'id-ID'
  r.interimResults = true
  r.continuous = true
  r.maxAlternatives = 1

  let active = true   // diset false saat user stop
  let restarting = false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  r.onresult = (e: any) => {
    restarting = false
    for (let i = e.resultIndex; i < e.results.length; i++) {
      options.onResult({
        text: e.results[i][0].transcript.trim(),
        isFinal: e.results[i].isFinal,
      })
    }
  }

  // Chrome Android selalu fire onend setelah tiap kalimat meski continuous=true
  // → auto-restart selama user belum tekan stop
  r.onend = () => {
    if (!active) { options.onEnd?.(); return }
    if (restarting) return
    restarting = true
    try { r.start() } catch { options.onEnd?.() }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  r.onerror = (e: any) => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      active = false
      options.onError?.('permission')
    } else if (e.error === 'network') {
      active = false
      options.onError?.('network')
    } else if (e.error === 'no-speech') {
      // jeda normal — biarkan onend restart sendiri
    } else if (e.error === 'aborted') {
      // dipanggil stop() manual — biarkan onend handle
    } else {
      active = false
      options.onError?.('other')
    }
  }

  r.start()
  return () => {
    active = false
    try { r.stop() } catch { /* ignore */ }
  }
}

// ── Matching ──────────────────────────────────────────────────────────────────

const NUMBER_MAP: Record<string, number> = {
  satu: 1, esa: 1, '1': 1, pertama: 1,
  dua: 2, '2': 2, kedua: 2,
  tiga: 3, '3': 3, ketiga: 3,
  empat: 4, '4': 4, keempat: 4,
  lima: 5, '5': 5, kelima: 5,
}

export function matchStarRating(text: string): number | null {
  const lower = text.toLowerCase()
  for (const [key, val] of Object.entries(NUMBER_MAP)) {
    if (lower.includes(key)) return val
  }
  return null
}

export function matchOption(spoken: string, options: string[]): string | null {
  const lower = spoken.toLowerCase()
  return (
    options.find((o) => o.toLowerCase() === lower) ??
    options.find((o) => lower.includes(o.toLowerCase()) || o.toLowerCase().includes(lower)) ??
    null
  )
}

export function isSubmitCommand(text: string): boolean {
  return ['selesai', 'lanjut', 'kirim', 'done', 'submit', 'oke', 'ok', 'next'].some((w) =>
    text.toLowerCase().includes(w)
  )
}
