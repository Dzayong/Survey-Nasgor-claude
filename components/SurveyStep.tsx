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

  // Auto-read question aloud when in voice mode
  useEffect(() => {
    if (mode !== 'voice' || hasReadRef.current === questionIndex) return
    hasReadRef.current = questionIndex

    const optionText = question.options
      ? ' Pilihannya: ' + question.options.join(', ') + '.'
      : ''
    const hint =
      question.type === 'star'
        ? ' Ucapkan angka 1 sampai 5.'
        : question.type === 'multiselect'
        ? ' Ucapkan "selesai" kalau sudah pilih.'
        : question.type === 'text'
        ? ' Boleh langsung bicara atau lewati.'
        : ''

    speak(question.question + optionText + hint)

    return () => stopSpeaking()
  }, [questionIndex, mode, question])

  const currentValue = answers[question.id as keyof SurveyAnswers]

  const canProceed = (() => {
    if (question.type === 'text') return true
    if (question.type === 'star') return typeof currentValue === 'number' && currentValue > 0
    if (question.type === 'multiselect') return Array.isArray(currentValue) && currentValue.length > 0
    return typeof currentValue === 'string' && currentValue !== ''
  })()

  // Handle spoken answer
  const handleVoiceResult = (text: string) => {
    if (question.type === 'star') {
      const num = matchStarRating(text)
      if (num) onAnswer(question.id, num)
    } else if (question.type === 'choice') {
      const match = matchOption(text, question.options ?? [])
      if (match) onAnswer(question.id, match)
    } else if (question.type === 'multiselect') {
      if (isSubmitCommand(text)) {
        if (canProceed) onNext()
        return
      }
      const match = matchOption(text, question.options ?? [])
      if (match) {
        const current = (currentValue as string[]) ?? []
        if (current.includes(match)) {
          onAnswer(question.id, current.filter((v) => v !== match))
        } else {
          onAnswer(question.id, [...current, match])
        }
      }
    } else if (question.type === 'text') {
      onAnswer(question.id, text)
    }
  }

  const voiceHint =
    question.type === 'star' ? 'Ucapkan: satu, dua, tiga, empat, atau lima' :
    question.type === 'multiselect' ? 'Ucapkan nama fitur, lalu "selesai" bila sudah' :
    question.type === 'text' ? 'Ceritakan langsung, atau lewati' :
    'Ucapkan salah satu pilihan di atas'

  return (
    <div className="flex flex-col w-full">
      {/* Header: progress + mode toggle */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400 font-medium">
          {questionIndex + 1} / {totalQuestions}
        </span>

        <button type="button"
          onClick={() => {
            stopSpeaking()
            onModeChange(mode === 'tap' ? 'voice' : 'tap')
          }}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all
            ${mode === 'voice'
              ? 'bg-brand-green text-white border-brand-green'
              : 'bg-white text-brand-green border-brand-green'
            }`}
        >
          {mode === 'voice' ? (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
                <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V20H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.07A7 7 0 0 0 19 11z" />
              </svg>
              Mode Suara
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/>
              </svg>
              Mode Ketuk
            </>
          )}
        </button>
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

        {/* Voice input (non-text questions) */}
        {mode === 'voice' && question.type !== 'text' && (
          <VoiceInput
            onResult={handleVoiceResult}
            hint={voiceHint}
          />
        )}
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
