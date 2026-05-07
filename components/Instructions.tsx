'use client'

interface InstructionsProps {
  mode: 'tap' | 'voice'
  onContinue: () => void
  onBack: () => void
}

export default function Instructions({ mode, onContinue, onBack }: InstructionsProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <button
        type="button"
        onClick={onBack}
        className="self-start flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-700"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
        Kembali
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
        {/* Mode badge */}
        <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4
          ${mode === 'voice' ? 'bg-brand-green-light text-brand-green' : 'bg-gray-100 text-gray-700'}`}>
          {mode === 'voice' ? (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
                <path d="M19 11a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V20H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.07A7 7 0 0 0 19 11z" />
              </svg>
              Mode Suara
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/>
              </svg>
              Mode Ketuk
            </>
          )}
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-1">Cara mengisi survei</h2>
        <p className="text-sm text-gray-500 mb-5">Baca dulu sebentar biar lancar 👌</p>

        {mode === 'voice' ? <VoiceSteps /> : <TapSteps />}
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="w-full py-4 bg-brand-green hover:bg-brand-green-dark text-white font-bold text-lg rounded-2xl shadow-md transition-all active:scale-[0.98]"
      >
        Saya Mengerti, Mulai
      </button>
    </div>
  )
}

function VoiceSteps() {
  return (
    <div className="space-y-4">
      <Step n={1} title="Ketuk tombol mic">
        Mic akan menyala otomatis tiap pertanyaan baru. Bicara langsung saat tombol berwarna merah.
      </Step>

      <Step n={2} title="Ucapkan jawaban dengan jelas">
        Bicara santai tapi jelas, jangan terlalu jauh dari mic. Tunggu sampai jawaban muncul lalu mic akan stop sendiri.
      </Step>

      <Step n={3} title="Contoh jawaban">
        <ul className="mt-2 space-y-1.5 text-sm">
          <Example label="Bintang">&ldquo;Lima&rdquo; atau &ldquo;empat bintang&rdquo;</Example>
          <Example label="Pilihan">&ldquo;GoFood&rdquo;, &ldquo;langsung&rdquo;, &ldquo;ya&rdquo;, &ldquo;tidak&rdquo;</Example>
          <Example label="Pilih lebih dari satu">Sebut tiap pilihan satu-satu, lalu &ldquo;selesai&rdquo;</Example>
          <Example label="Cerita bebas">Langsung cerita pengalaman kamu</Example>
        </ul>
      </Step>

      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700 flex gap-2">
        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        <span>Pastikan internet stabil & izinkan akses mikrofon saat ditanya browser.</span>
      </div>
    </div>
  )
}

function TapSteps() {
  return (
    <div className="space-y-4">
      <Step n={1} title="Pilih jawaban dengan menekan tombol">
        Tap satu pilihan untuk pertanyaan biasa. Tap beberapa pilihan untuk pertanyaan &ldquo;boleh lebih dari satu&rdquo;.
      </Step>

      <Step n={2} title="Bintang untuk menilai">
        Tap bintang sesuai kepuasan kamu — 1 bintang paling buruk, 5 bintang sangat puas.
      </Step>

      <Step n={3} title="Tap Lanjut">
        Setelah memilih, tekan tombol <span className="font-semibold text-brand-green">Lanjut</span> di bawah.
      </Step>
    </div>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-green text-white font-bold text-sm flex items-center justify-center">
        {n}
      </span>
      <div className="flex-1">
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

function Example({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="text-xs font-semibold text-brand-green mt-0.5 min-w-[80px]">{label}:</span>
      <span className="text-gray-700">{children}</span>
    </li>
  )
}
