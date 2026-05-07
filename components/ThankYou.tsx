'use client'

import { useEffect } from 'react'
import Image from 'next/image'

const GOOGLE_REVIEW_URL = 'https://g.page/r/CbdpuIIv3vAxEAE/review'

function trackReviewClick() {
  fetch('/api/track-review', { method: 'POST' }).catch(() => {})
}

export default function ThankYou() {
  useEffect(() => {
    const launch = async () => {
      const confetti = (await import('canvas-confetti')).default
      const end = Date.now() + 3000
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#1a9e58', '#d42b25', '#ffffff'] })
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#1a9e58', '#d42b25', '#ffffff'] })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
    launch()
  }, [])

  return (
    <div className="flex flex-col items-center text-center px-2 py-6">
      {/* Badge resmi */}
      <div className="flex items-center gap-1.5 bg-brand-green text-white text-xs font-semibold px-3 py-1 rounded-full mb-5 shadow-sm">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
        </svg>
        Survei Resmi Nasi Goreng D4
      </div>

      <div className="w-20 h-20 rounded-full bg-brand-green-light border-4 border-brand-green flex items-center justify-center mb-5">
        <svg className="w-10 h-10 text-brand-green" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Terima kasih!</h2>
      <p className="text-gray-600 text-base leading-relaxed mb-6">
        Jawaban kamu sudah kami terima dan sangat berarti untuk kami.
      </p>

      {/* Google Review CTA */}
      <div className="w-full bg-white border-2 border-brand-green rounded-3xl p-5 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-brand-green-light flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-base">Kasih Ulasan di Google</p>
            <p className="text-xs text-gray-500">Bantu pelanggan lain menemukan kami</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 text-left leading-relaxed mb-4">
          Nasi Goreng D4 ingin mendengar masukan Anda. Berikan ulasan di profil kami.
        </p>

        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackReviewClick}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-green hover:bg-brand-green-dark text-white font-semibold text-base rounded-2xl transition-all active:scale-[0.98] shadow-sm"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/>
          </svg>
          Tulis Ulasan Sekarang
        </a>
      </div>

      {/* Info toko */}
      <div className="bg-brand-green-light border border-brand-green-mid rounded-3xl p-4 w-full mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-brand-green">
            <Image src="/logo.png" alt="Logo Nasi Goreng D4" fill className="object-cover" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-brand-green">Nasi Goreng D4</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Jl. Prasetya D4 no18 RT004 RW013{'\n'}Kab. Bandung, Jawa Barat 45363
            </p>
            <p className="text-xs text-gray-500 mt-0.5">WA: 085294954234</p>
          </div>
        </div>

        {/* Google Maps embed */}
        <div className="w-full rounded-2xl overflow-hidden border border-brand-green-mid">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d700.1169576735375!2d107.75436335785209!3d-6.95498817678513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c30021bf5011%3A0x8638638dd5cc5dbe!2sRumah!5e0!3m2!1sid!2sid!4v1778142735842!5m2!1sid!2sid"
            width="100%"
            height="200"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Nasi Goreng D4"
          />
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-2">Sampai jumpa di pesanan berikutnya!</p>
    </div>
  )
}
