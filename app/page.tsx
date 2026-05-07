'use client'

import { useState } from 'react'
import { questions } from '@/lib/questions'
import type { SurveyAnswers } from '@/lib/types'
import LandingScreen from '@/components/LandingScreen'
import Instructions from '@/components/Instructions'
import SurveyStep from '@/components/SurveyStep'
import ThankYou from '@/components/ThankYou'

type AppStep = 'landing' | 'instructions' | 'survey' | 'thankYou'

export default function Page() {
  const [appStep, setAppStep] = useState<AppStep>('landing')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswers>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mode, setMode] = useState<'tap' | 'voice'>('tap')

  const handleAnswer = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = async () => {
    const isLast = currentQuestion === questions.length - 1
    if (isLast) {
      setIsSubmitting(true)
      try {
        await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answers),
        })
      } catch (err) {
        console.error('Submit failed:', err)
      } finally {
        setIsSubmitting(false)
        setAppStep('thankYou')
      }
    } else {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1)
  }

  const handleSelectMode = (selectedMode: 'tap' | 'voice') => {
    setMode(selectedMode)
    setAppStep('instructions')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {appStep === 'landing' && <LandingScreen onStart={handleSelectMode} />}

        {appStep === 'instructions' && (
          <Instructions
            mode={mode}
            onContinue={() => setAppStep('survey')}
            onBack={() => setAppStep('landing')}
          />
        )}

        {appStep === 'survey' && (
          <SurveyStep
            question={questions[currentQuestion]}
            questionIndex={currentQuestion}
            totalQuestions={questions.length}
            answers={answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            mode={mode}
            onModeChange={setMode}
          />
        )}

        {appStep === 'thankYou' && <ThankYou />}
      </div>
    </main>
  )
}
