'use client'

interface MultiSelectProps {
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
}

export default function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  const toggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option))
    } else {
      onChange([...value, option])
    }
  }

  return (
    <div className="flex flex-col gap-3 py-2">
      <p className="text-sm text-gray-500 text-center">Boleh pilih lebih dari satu jawaban</p>
      {options.map((option) => {
        const selected = value.includes(option)
        return (
          <button
            key={option}
            onClick={() => toggle(option)}
            className={`w-full py-4 px-5 rounded-2xl text-left text-base font-medium transition-all duration-150 border-2
              ${selected
                ? 'bg-brand-green border-brand-green text-white shadow-md'
                : 'bg-white border-gray-200 text-gray-700 hover:border-brand-green hover:bg-brand-green-light active:scale-[0.98]'
              }`}
          >
            <span className="flex items-center gap-3">
              <span className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-colors
                ${selected ? 'border-white bg-white' : 'border-gray-300'}`}
              >
                {selected && (
                  <svg className="w-3 h-3 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              <span className="text-lg">{option}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
