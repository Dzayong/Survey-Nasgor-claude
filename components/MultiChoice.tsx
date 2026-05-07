'use client'

interface MultiChoiceProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function MultiChoice({ options, value, onChange }: MultiChoiceProps) {
  return (
    <div className="flex flex-col gap-3 py-2">
      {options.map((option) => {
        const selected = value === option
        return (
          <button type="button"
            key={option}
            onClick={() => onChange(option)}
            className={`w-full py-4 px-5 rounded-2xl text-left text-base font-medium transition-all duration-150 border-2
              ${selected
                ? 'bg-brand-green border-brand-green text-white shadow-md scale-[1.02]'
                : 'bg-white border-gray-200 text-gray-700 hover:border-brand-green hover:bg-brand-green-light active:scale-[0.98]'
              }`}
          >
            <span className="flex items-center gap-3">
              <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                ${selected ? 'border-white bg-white' : 'border-gray-300'}`}
              >
                {selected && <span className="w-2.5 h-2.5 rounded-full bg-brand-green block" />}
              </span>
              <span className="text-lg">{option}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
