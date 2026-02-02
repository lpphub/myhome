import { ChevronDown } from 'lucide-react'
import { memo, useCallback, useRef, useState } from 'react'
import type { ToolbarSelectOption } from '@/components/editor/types'
import { useClickOutside } from '@/hooks'
import { cn } from '@/lib/utils'

interface ToolbarSelectProps {
  /** 选项 */
  options: ToolbarSelectOption[]
  /** 当前值 */
  value?: string | number
  /** 占位符 */
  placeholder?: string
  /** 变化回调 */
  onChange: (value: string | number) => void
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
  /** 是否激活状态（高亮显示） */
  isActive?: boolean
}

/**
 * 工具栏选择器组件
 * 通用的下拉选择组件，可被标题选择器和列表选择器复用
 */
export const ToolbarSelect = memo<ToolbarSelectProps>(
  ({
    options,
    value,
    placeholder = '选择',
    onChange,
    disabled = false,
    className,
    isActive = false,
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)

    useClickOutside(selectRef, () => setIsOpen(false))

    const toggleOpen = useCallback(() => {
      if (!disabled) setIsOpen(prev => !prev)
    }, [disabled])

    const handleSelect = useCallback(
      (optionValue: string | number) => {
        onChange(optionValue)
        setIsOpen(false)
      },
      [onChange]
    )

    const selectedOption = options.find(opt => opt.value === value) || options[0]

    const displayContent = (() => {
      if (selectedOption?.icon) {
        return <selectedOption.icon className='w-3.5 h-3.5' />
      }
      return <span className='text-sm'>{selectedOption?.label ?? placeholder}</span>
    })()

    return (
      <div ref={selectRef} className='relative'>
        <button
          type='button'
          onClick={toggleOpen}
          disabled={disabled}
          className={cn(
            'inline-flex items-center gap-1 px-2 h-8 min-w-12 rounded-md text-sm font-medium transition-colors',
            'text-slate-600 hover:bg-slate-100',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            isActive && 'bg-blue-50 text-blue-600 hover:bg-blue-100',
            className
          )}
        >
          {displayContent}
          <ChevronDown className={cn('w-3 h-3 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && (
          <div
            className='absolute top-full left-0 mt-1 inline-block min-w-max bg-white border border-slate-200 rounded-md shadow-lg z-50 overflow-hidden'
            role='listbox'
          >
            {options.map(option => (
              <button
                key={option.value}
                role='option'
                type='button'
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors',
                  option.value === value && 'bg-blue-50 text-blue-600'
                )}
                aria-selected={option.value === value}
                title={option.label} // 保留标签作为tooltip
              >
                {option.icon && <option.icon className='w-3.5 h-3.5' />}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
)

ToolbarSelect.displayName = 'ToolbarSelect'
