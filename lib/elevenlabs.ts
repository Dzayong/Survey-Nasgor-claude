'use client'

let stream: MediaStream | null = null
let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []

export async function startRecording(onStart?: () => void, onError?: (e: string) => void) {
  audioChunks = []

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    })
  } catch {
    onError?.('Microphone error')
    return
  }

  const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : MediaRecorder.isTypeSupported('audio/webm')
    ? 'audio/webm'
    : MediaRecorder.isTypeSupported('audio/mp4')
    ? 'audio/mp4'
    : ''

  mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) audioChunks.push(e.data)
  }

  mediaRecorder.start(500)
  onStart?.()
}

export function stopAndTranscribe(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      cleanupStream()
      resolve('')
      return
    }

    mediaRecorder.onstop = async () => {
      const chunks = audioChunks
      audioChunks = []
      cleanupStream()

      if (chunks.length === 0) { resolve(''); return }

      const blob = new Blob(chunks, { type: chunks[0].type || 'audio/webm' })

      try {
        const formData = new FormData()
        formData.append('audio', blob, 'recording.webm')

        const res = await fetch('/api/transcribe', { method: 'POST', body: formData })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          reject(new Error(err.error ?? `API error ${res.status}`))
          return
        }

        const data = await res.json()
        resolve((data.text ?? '').trim())
      } catch (err) {
        reject(err)
      }
    }

    mediaRecorder.stop()
  })
}

export function cancelRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.ondataavailable = null
    mediaRecorder.onstop = null
    try { mediaRecorder.stop() } catch { /* ignore */ }
  }
  cleanupStream()
  audioChunks = []
}

function cleanupStream() {
  stream?.getTracks().forEach((t) => t.stop())
  stream = null
  mediaRecorder = null
}
