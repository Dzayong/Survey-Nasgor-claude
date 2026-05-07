'use client'

import VoiceInput from './VoiceInput'

interface FreeTextProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  voiceMode?: boolean
}

export default function FreeText({ value, onChange, placeholder, voiceMode }: FreeTextProps) {
  return (
    <div className="py-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Tulis di sini... (boleh dikosongi)'}
        rows={4}
        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 placeholder-gray-400 text-lg resize-none focus:outline-none focus:border-brand-green transition-colors"
      />
      {voiceMode && (
        <VoiceInput
          onResult={(text) => onChange(text)}
          hint="Ketuk mic, lalu bicarakan kesulitan kamu"
        />
      )}
    </div>
  )
}
