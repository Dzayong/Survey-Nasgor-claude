import type { Question } from './types'

export const questions: Question[] = [
  {
    id: 'q1_rating',
    type: 'star',
    question: 'Seberapa puas kamu dengan rasa nasi gorengnya?',
  },
  {
    id: 'q2_porsi',
    type: 'choice',
    question: 'Porsinya sesuai dengan harganya?',
    options: ['Ya', 'Cukup', 'Kurang'],
  },
  {
    id: 'q3_kemasan',
    type: 'choice',
    question: 'Kemasannya rapi dan tidak bocor?',
    options: ['Ya', 'Tidak'],
  },
  {
    id: 'q4_channel',
    type: 'choice',
    question: 'Kamu order dari mana?',
    options: ['GoFood', 'Shopee Food', 'Langsung', 'Lainnya'],
  },
  {
    id: 'q5_kendala',
    type: 'text',
    question: 'Pernah kesulitan saat pesan? (misal: susah dihubungi, lama, dll)',
    placeholder: 'Tulis di sini... (boleh dikosongi)',
  },
  {
    id: 'q6_minat_app',
    type: 'choice',
    question: 'Kalau ada fitur pesan langsung lewat website/app sendiri, kamu mau pakai?',
    options: ['Mau banget', 'Mungkin', 'Tidak perlu'],
  },
  {
    id: 'q7_fitur',
    type: 'multiselect',
    question: 'Fitur apa yang paling kamu butuhkan?',
    options: ['Lacak pesanan', 'Pilih menu custom', 'Promo member', 'Jadwal pesan'],
  },
]
