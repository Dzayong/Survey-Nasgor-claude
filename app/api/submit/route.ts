import { NextRequest, NextResponse } from 'next/server'
import { appendSurveyResponse } from '@/lib/sheets'
import type { SurveyAnswers } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body: SurveyAnswers = await request.json()

    const submission = {
      ...body,
      timestamp: new Date().toISOString(),
      user_agent: request.headers.get('user-agent') ?? '',
    }

    await appendSurveyResponse(submission)

    const isMock = !process.env.SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_KEY

    return NextResponse.json({ success: true, mock: isMock })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json({ success: false, error: 'Gagal menyimpan data' }, { status: 500 })
  }
}
