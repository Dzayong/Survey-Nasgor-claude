export type QuestionType = 'star' | 'choice' | 'multiselect' | 'text'

export interface Question {
  id: string
  type: QuestionType
  question: string
  options?: string[]
  placeholder?: string
}

export interface SurveyAnswers {
  q1_rating?: number
  q2_porsi?: string
  q3_kemasan?: string
  q4_channel?: string
  q5_kendala?: string
  q6_minat_app?: string
  q7_fitur?: string[]
}

export interface SurveySubmission extends SurveyAnswers {
  timestamp: string
  user_agent: string
}
