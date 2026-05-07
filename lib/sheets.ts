import type { SurveySubmission } from './types'

export async function appendSurveyResponse(data: SurveySubmission): Promise<void> {
  const sheetId = process.env.SHEET_ID
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY

  if (!sheetId || !serviceAccountKey) {
    console.log('[MOCK] Survey response received:', JSON.stringify(data, null, 2))
    return
  }

  const { google } = await import('googleapis')

  let credentials: object
  try {
    credentials = JSON.parse(serviceAccountKey)
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY bukan JSON yang valid')
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  const row = [
    data.timestamp,
    data.q1_rating ?? '',
    data.q2_porsi ?? '',
    data.q3_kemasan ?? '',
    data.q4_channel ?? '',
    data.q5_kendala ?? '',
    data.q6_minat_app ?? '',
    Array.isArray(data.q7_fitur) ? data.q7_fitur.join(', ') : '',
    data.user_agent,
  ]

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A:I',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  })
}
