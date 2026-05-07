/**
 * Script setup header Google Spreadsheet untuk Survei Nasi Goreng D4
 *
 * Cara pakai:
 *   node scripts/setup-sheet.mjs path/ke/service-account.json SHEET_ID
 *
 * Langkah sebelum menjalankan script ini:
 *   1. Buka sheets.new → buat spreadsheet baru
 *   2. Share spreadsheet ke email Service Account (Editor access)
 *   3. Copy SHEET_ID dari URL spreadsheet
 *   4. Jalankan script ini
 *
 * Script ini akan:
 *   1. Menulis header row dengan 9 kolom
 *   2. Memformat header (bold, warna teal, freeze row)
 */

import { google } from 'googleapis'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const keyPath = process.argv[2]
const spreadsheetId = process.argv[3]

if (!keyPath || !spreadsheetId) {
  console.error('\n❌  Cara pakai: node scripts/setup-sheet.mjs path/ke/service-account.json SHEET_ID\n')
  process.exit(1)
}

let credentials
try {
  credentials = JSON.parse(readFileSync(resolve(keyPath), 'utf8'))
} catch {
  console.error(`\n❌  Tidak bisa baca file: ${keyPath}\n`)
  process.exit(1)
}

console.log('\n🔧  Menghubungkan ke Google Sheets API...')

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const sheets = google.sheets({ version: 'v4', auth })

// --- 1. Tulis header row ---
console.log('📝  Menulis header kolom...')

const headers = [
  'timestamp',
  'q1_rating',
  'q2_porsi',
  'q3_kemasan',
  'q4_channel',
  'q5_kendala',
  'q6_minat_app',
  'q7_fitur',
  'user_agent',
]

await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: 'Sheet1!A1:I1',
  valueInputOption: 'RAW',
  requestBody: { values: [headers] },
})

console.log('✅  Header ditambahkan')

// --- 2. Format header (bold, warna teal, freeze row) ---
console.log('🎨  Menerapkan format header...')

await sheets.spreadsheets.batchUpdate({
  spreadsheetId,
  requestBody: {
    requests: [
      {
        repeatCell: {
          range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 9 },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.051, green: 0.580, blue: 0.533 },
              textFormat: {
                bold: true,
                foregroundColor: { red: 1, green: 1, blue: 1 },
                fontSize: 11,
              },
              horizontalAlignment: 'CENTER',
            },
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
        },
      },
      {
        updateSheetProperties: {
          properties: { sheetId: 0, gridProperties: { frozenRowCount: 1 } },
          fields: 'gridProperties.frozenRowCount',
        },
      },
      {
        autoResizeDimensions: {
          dimensions: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 9 },
        },
      },
    ],
  },
})

// --- 3. Tampilkan hasil ---
const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`

console.log('\n' + '='.repeat(60))
console.log('✅  SETUP SELESAI!')
console.log('='.repeat(60))
console.log(`\n📊  Spreadsheet URL:\n    ${spreadsheetUrl}`)
console.log(`\n🔑  SHEET_ID:\n    ${spreadsheetId}`)
console.log('\n📋  Langkah selanjutnya:')
console.log('    1. Copy .env.local.example → .env.local')
console.log(`    2. Isi SHEET_ID=${spreadsheetId}`)
console.log('    3. Isi GOOGLE_SERVICE_ACCOUNT_KEY dengan isi file JSON key')
console.log('    4. Restart server: npm run dev')
console.log('\n' + '='.repeat(60) + '\n')
