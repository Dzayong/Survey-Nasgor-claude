import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

async function transcribeWithGroq(audio: Blob): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not configured')

  const form = new FormData()
  form.append('file', audio, 'recording.webm')
  form.append('model', 'whisper-large-v3-turbo')
  form.append('language', 'id')
  form.append('response_format', 'json')

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Groq ${res.status}`)
  }

  const data = await res.json()
  return (data.text ?? '').trim()
}

async function transcribeWithElevenLabs(audio: Blob): Promise<string> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not configured')

  const form = new FormData()
  form.append('file', audio, 'recording.webm')
  form.append('model_id', 'scribe_v1')
  form.append('language_code', 'id')

  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.detail?.message ?? `ElevenLabs ${res.status}`)
  }

  const data = await res.json()
  return (data.text ?? '').trim()
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const audio = formData.get('audio')
  if (!(audio instanceof Blob)) {
    return NextResponse.json({ error: 'No audio provided' }, { status: 400 })
  }

  // Try Groq first (faster + cheaper), fallback to ElevenLabs
  try {
    const text = await transcribeWithGroq(audio)
    return NextResponse.json({ text, provider: 'groq' })
  } catch (groqErr) {
    console.warn('Groq failed, falling back to ElevenLabs:', (groqErr as Error).message)
  }

  try {
    const text = await transcribeWithElevenLabs(audio)
    return NextResponse.json({ text, provider: 'elevenlabs' })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
