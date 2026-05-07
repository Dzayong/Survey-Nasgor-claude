'use client'

// ── TTS (Text-to-Speech) ─────────────────────────────────────────────────────

export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string, options?: { rate?: number; onEnd?: () => void }): void {
  if (!isTTSSupported()) return
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'id-ID'
  utterance.rate = options?.rate ?? 0.9
  utterance.pitch = 1.0

  if (options?.onEnd) utterance.onend = options.onEnd
  utterance.onerror = () => options?.onEnd?.()

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if (isTTSSupported()) window.speechSynthesis.cancel()
}

// ── STT (Speech-to-Text) ─────────────────────────────────────────────────────

export function isSTTSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  )
}

type RecognitionResult = {
  text: string
  isFinal: boolean
}

export function startListening(options: {
  onResult: (r: RecognitionResult) => void
  onEnd?: () => void
  lang?: string
  continuous?: boolean
}): () => void {
  if (!isSTTSupported()) {
    options.onEnd?.()
    return () => {}
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SpeechRecognitionImpl = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognition: any = new SpeechRecognitionImpl()
  recognition.lang = options.lang ?? 'id-ID'
  recognition.interimResults = true
  recognition.continuous = options.continuous ?? false
  recognition.maxAlternatives = 3

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i]
      options.onResult({
        text: result[0].transcript.trim(),
        isFinal: result.isFinal,
      })
    }
  }

  recognition.onend = () => options.onEnd?.()
  recognition.onerror = () => options.onEnd?.()

  recognition.start()
  return () => recognition.stop()
}

// ── Matching spoken text to options ─────────────────────────────────────────

const NUMBER_MAP: Record<string, number> = {
  satu: 1, esa: 1, '1': 1, pertama: 1,
  dua: 2, '2': 2, kedua: 2,
  tiga: 3, '3': 3, ketiga: 3,
  empat: 4, '4': 4, keempat: 4,
  lima: 5, '5': 5, kelima: 5,
}

export function matchStarRating(text: string): number | null {
  const lower = text.toLowerCase().trim()
  for (const [key, val] of Object.entries(NUMBER_MAP)) {
    if (lower.includes(key)) return val
  }
  return null
}

export function matchOption(spoken: string, options: string[]): string | null {
  const lower = spoken.toLowerCase()
  // Exact match first
  const exact = options.find((o) => o.toLowerCase() === lower)
  if (exact) return exact
  // Partial match
  const partial = options.find((o) => lower.includes(o.toLowerCase()) || o.toLowerCase().includes(lower))
  return partial ?? null
}

export function isSubmitCommand(text: string): boolean {
  const lower = text.toLowerCase()
  return ['selesai', 'lanjut', 'kirim', 'done', 'submit', 'oke', 'ok'].some((w) =>
    lower.includes(w)
  )
}
