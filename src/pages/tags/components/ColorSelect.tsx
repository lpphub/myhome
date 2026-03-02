import { Check } from 'lucide-react'
import { memo } from 'react'
import { cn } from '@/lib/utils'
import { TAG_COLOR_CLASSES } from '@/types/tags'

interface ColorSelectProps {
  value: string
  onChange: (color: string) => void
}

export const ColorSelect = memo(({ value, onChange }: ColorSelectProps) => (
  <div className='flex items-center gap-2 flex-wrap'>
    {Object.entries(TAG_COLOR_CLASSES).map(([key, color]) => {
      const selected = value === key
      return (
        <button
          key={key}
          type='button'
          title={color.name}
          onClick={() => onChange(key)}
          className={cn(
            'relative w-6 h-6 rounded-full transition-all',
            'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-honey-400',
            color.classes,
            selected && 'ring-2 ring-offset-1 ring-honey-400 scale-110'
          )}
        >
          {selected && (
            <Check className='absolute inset-1/2 w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 opacity-70' />
          )}
        </button>
      )
    })}
  </div>
))