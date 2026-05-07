'use client'

import Image from 'next/image'
import VoiceGreeting from './VoiceGreeting'

interface LandingScreenProps {
  onStart: (mode: 'tap' | 'voice') => void
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="flex flex-col items-center text-center px-2">
      {/* Logo */}
      <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-brand-green shadow-lg mb-4">
        <Image
          src="/logo.png"
          alt="Logo Nasi Goreng D4"
          fill
          className="object-cover"
          priority
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-0.5">Nasi Goreng D4</h1>
      <p className="text-sm text-brand-green font-medium mb-5">
        Perum Abdi Negara Blok D4 No.18, Rancaekek
      </p>

      {/* Sambutan */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-5 w-full text-left">
        <p className="text-gray-700 text-base leading-relaxed">
          Halo! Terima kasih sudah pesan di{' '}
          <span className="font-semibold text-brand-green">Nasi Goreng D4</span>.
        </p>
        <p className="text-gray-600 text-sm mt-2 leading-relaxed">
          Kami ingin tau pendapat kamu tentang pesanan tadi.
          Hanya <span className="font-semibold">2–3 menit</span> aja!
        </p>
      </div>

      <VoiceGreeting />

      {/* Info */}
      <div className="flex items-center justify-center gap-4 text-sm text-gray-400 mb-6">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
          </svg>
          2–3 menit
        </span>
        <span className="w-1 h-1 rounded-full bg-gray-300" />
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
          7 pertanyaan
        </span>
      </div>

      {/* 2 Mode tombol */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => onStart('tap')}
          className="w-full py-4 bg-brand-green hover:bg-brand-green-dark active:bg-brand-green-dark text-white font-bold text-lg rounded-2xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/>
          </svg>
          Isi dengan Ketuk
        </button>

        <button
          onClick={() => onStart('voice')}
          className="w-full py-4 bg-white hover:bg-brand-green-light active:bg-brand-green-light border-2 border-brand-green text-brand-green font-bold text-lg rounded-2xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
            <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V20H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.07A7 7 0 0 0 19 11z" />
          </svg>
          Isi dengan Suara
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Jawaban kamu sangat berarti untuk kami
      </p>
    </div>
  )
}
