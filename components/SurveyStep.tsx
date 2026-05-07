'use client'

import { useEffect, useRef } from 'react'
import type { Question, SurveyAnswers } from '@/lib/types'
import { speak, stopSpeaking, matchStarRating, matchOption, isSubmitCommand } from '@/lib/voice'
import StarRating from './StarRating'
import MultiChoice from './MultiChoice'
import MultiSelect from './MultiSelect'
import FreeText from './FreeText'
import VoiceInput from './VoiceInput'

interface SurveyStepProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  answers: SurveyAnswers
  onAnswer: (questionId: string, value: unknown) => void
  onNext: () => void
  onBack: () => void
  isSubmitting?: boolean
  mode: 'tap' | 'voice'
  onModeChange: (mode: 'tap' | 'voice') => void
}

export default function SurveyStep({
  question, questionIndex, totalQuestions,
  answers, onAnswer, onNext, onBack,
  isSubmitting, mode, onModeChange,
}: SurveyStepProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100
  const isLast = questionIndex === totalQuestions - 1
  const hasReadRef = useRef<number>(-1)

  // Auto-read question aloud for every question
  useEffect(() => {
    if (hasReadRef.current === questionIndex) return
    hasReadRef.current = questionIndex
    speak(question.question, { rate: 1.0 })
    return () => stopSpeaking()
  }, [questionIndex, question])

  const currentValue = answers[question.id as keyof SurveyAnswers]

  const canProceed = (() => {
    if (question.type === 'text') return true
    if (question.type === 'star') return typeof currentValue === 'number' && currentValue > 0
    if (question.type === 'multiselect') return Array.isArray(currentValue) && currentValue.length > 0
    return typeof currentValue === 'string' && currentValue !== ''
  })()

  // Interim result — update UI saja, belum advance
  const handleVoiceResult = (text: string) => {
    if (question.type === 'star') {
      const num = matchStarRating(text)
      if (num) onAnswer(question.id, num)
    } else if (question.type === 'choice') {
      const match = matchOption(text, question.options ?? [])
      if (match) onAnswer(question.id, match)
    } else if (question.type === 'multiselect') {
      if (isSubmitCommand(text)) { if (canProceed) onNext(); return }
      const match = matchOption(text, question.options ?? [])
      if (match) {
        const current = (currentValue as string[]) ?? []
        onAnswer(question.id,
          current.includes(match) ? current.filter((v) => v !== match) : [...current, match]
        )
      }
    } else if (question.type === 'text') {
      onAnswer(question.id, text)
    }
  }

  // Final result — auto-advance jika cocok
  const handleVoiceFinal = (text: string) => {
    if (question.type === 'star') {
      const num = matchStarRating(text)
      if (num) { onAnswer(question.id, num); setTimeout(onNext, 600) }
    } else if (question.type === 'choice') {
      const match = matchOption(text, question.options ?? [])
      if (match) { onAnswer(question.id, match); setTimeout(onNext, 600) }
    } else if (question.type === 'text') {
      if (text) { onAnswer(question.id, text); setTimeout(onNext, 600) }
    }
    // multiselect: tidak auto-advance, user ucap "selesai"
  }

  const voiceHint =
    question.type === 'star' ? 'Ucapkan: satu, dua, tiga, empat, atau lima' :
    question.type === 'multiselect' ? 'Ucapkan pilihan, lalu "selesai" bila sudah' :
    question.type === 'text' ? 'Ceritakan langsung' :
    'Ucapkan salah satu pilihan'

  return (
    <div className="flex flex-col w-full">
      {/* Header: progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400 font-medium">
          {questionIndex + 1} / {totalQuestions}
        </span>
        {/* Mode toggle dinonaktifkan sementara */}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
        <div
          className="bg-brand-green h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-4">
        <p className="text-lg font-semibold text-gray-800 leading-snug mb-4">
          {question.question}
        </p>

        {question.type === 'star' && (
          <StarRating
            value={(currentValue as number) ?? 0}
            onChange={(v) => onAnswer(question.id, v)}
          />
        )}
        {question.type === 'choice' && (
          <MultiChoice
            options={question.options ?? []}
            value={(currentValue as string) ?? ''}
            onChange={(v) => onAnswer(question.id, v)}
          />
        )}
        {question.type === 'multiselect' && (
          <MultiSelect
            options={question.options ?? []}
            value={(currentValue as string[]) ?? []}
            onChange={(v) => onAnswer(question.id, v)}
          />
        )}
        {question.type === 'text' && (
          <FreeText
            value={(currentValue as string) ?? ''}
            onChange={(v) => onAnswer(question.id, v)}
            placeholder={question.placeholder}
            voiceMode={mode === 'voice'}
          />
        )}

        {/* Voice input — dinonaktifkan sementara
        {mode === 'voice' && question.type !== 'text' && (
          <VoiceInput
            key={questionIndex}
            autoStart
            onResult={handleVoiceResult}
            onFinal={handleVoiceFinal}
            hint={voiceHint}
          />
        )}
        */}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {questionIndex > 0 && (
          <button type="button"
            onClick={onBack}
            className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-base transition-all active:scale-[0.98] hover:border-gray-300"
          >
            Kembali
          </button>
        )}
        <button type="button"
          onClick={onNext}
          disabled={!canProceed || isSubmitting}
          className={`flex-[2] py-4 rounded-2xl font-bold text-base transition-all duration-150
            ${canProceed && !isSubmitting
              ? 'bg-brand-green hover:bg-brand-green-dark text-white shadow-md active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Mengirim...
            </span>
          ) : isLast ? 'Kirim Survei' : 'Lanjut'}
        </button>
      </div>
    </div>
  )
}
