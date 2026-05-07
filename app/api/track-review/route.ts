import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST() {
  const sheetId = process.env.SHEET_ID
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY

  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })

  if (!sheetId || !serviceAccountKey) {
    console.log('[TRACK] Review click at', timestamp)
    return NextResponse.json({ ok: true })
  }

  try {
    const { google } = await import('googleapis')
    const credentials = JSON.parse(serviceAccountKey)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    const sheets = google.sheets({ version: 'v4', auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, 'KLIK_TULIS_ULASAN', '', '', '', '', '', '', '']],
      },
    })
  } catch (err) {
    console.error('[TRACK] Failed to log review click:', err)
  }

  return NextResponse.json({ ok: true })
}
