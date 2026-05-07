'use client'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
}

export default function StarRating({ value, onChange }: StarRatingProps) {
  const labels = ['Sangat Buruk', 'Kurang Baik', 'Cukup', 'Baik', 'Sangat Baik']

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110 active:scale-95 p-1"
            aria-label={`Bintang ${star} - ${labels[star - 1]}`}
          >
            <svg
              className={`w-12 h-12 transition-colors duration-150 ${
                star <= value ? 'text-brand-red' : 'text-gray-200'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      {value > 0 && (
        <span className="text-sm font-semibold text-brand-green">{labels[value - 1]}</span>
      )}
      <div className="flex justify-between w-full px-2 text-xs text-gray-400 mt-1">
        <span>Tidak puas</span>
        <span>Sangat puas</span>
      </div>
    </div>
  )
}
