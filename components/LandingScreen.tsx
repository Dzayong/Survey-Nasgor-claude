'use client'

import Image from 'next/image'
import VoiceGreeting from './VoiceGreeting'

interface LandingScreenProps {
  onStart: (mode: 'tap' | 'voice') => void
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="flex flex-col items-center text-center px-2">
      {/* Badge resmi */}
      <div className="flex items-center gap-1.5 bg-brand-green text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 shadow-sm">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
        Survei Resmi Nasi Goreng D4
      </div>

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
        Jl. Prasetya D4 No.18, Kab. Bandung
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

      {/* Tombol mulai — tap mode only */}
      <div className="w-full">
        <button type="button"
          onClick={() => onStart('tap')}
          className="w-full py-4 bg-brand-green hover:bg-brand-green-dark active:bg-brand-green-dark text-white font-bold text-lg rounded-2xl shadow-md transition-all active:scale-[0.98]"
        >
          Mulai Survei
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Jawaban kamu sangat berarti untuk kami
      </p>
    </div>
  )
}
