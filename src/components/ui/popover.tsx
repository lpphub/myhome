import { memo, useRef, useState } from 'react'
import { useClickOutside } from '@/hooks'
import { cn } from '@/lib/utils'

interface PopoverProps {
  /** 触发器内容 */
  trigger: React.ReactNode
  /** 弹出内容 */
  content: React.ReactNode
  /** 是否打开 */
  open?: boolean
  /** 打开状态变化回调 */
  onOpenChange?: (open: boolean) => void
  /** 对齐方式 */
  align?: 'start' | 'center' | 'end'
  /** 侧边 */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /** 偏移量 */
  sideOffset?: number
  /** 自定义类名 */
  className?: string
}

export const Popover = memo<PopoverProps>(
  ({
    trigger,
    content,
    open: controlledOpen,
    onOpenChange,
    align = 'center',
    side = 'bottom',
    sideOffset = 4,
    className,
  }) => {
    const [internalOpen, setInternalOpen] = useState(false)
    const popoverRef = useRef<HTMLDivElement>(null)

    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

    const handleOpenChange = (open: boolean) => {
      if (onOpenChange) {
        onOpenChange(open)
      } else {
        setInternalOpen(open)
      }
    }

    useClickOutside(popoverRef, () => handleOpenChange(false))

    const handleTriggerClick = () => {
      handleOpenChange(!isOpen)
    }

    const getPositionClasses = () => {
      const positions = {
        top: 'bottom-full mb-1',
        bottom: 'top-full mt-1',
        left: 'right-full mr-1',
        right: 'left-full ml-1',
      }

      const alignments = {
        start: side === 'top' || side === 'bottom' ? 'left-0' : 'top-0',
        center:
          side === 'top' || side === 'bottom'
            ? 'left-1/2 -translate-x-1/2'
            : 'top-1/2 -translate-y-1/2',
        end: side === 'top' || side === 'bottom' ? 'right-0' : 'bottom-0',
      }

      return `${positions[side]} ${alignments[align]}`
    }

    return (
      <div ref={popoverRef} className='relative inline-block'>
        <div
          onClick={handleTriggerClick}
          className='cursor-pointer'
          role='button'
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleTriggerClick()
            }
          }}
          aria-expanded={isOpen}
          aria-haspopup='true'
        >
          {trigger}
        </div>

        {isOpen && (
          <div
            className={cn('absolute z-50 min-w-max', getPositionClasses(), className)}
            style={{ marginTop: side === 'bottom' ? sideOffset : undefined }}
          >
            {content}
          </div>
        )}
      </div>
    )
  }
)

Popover.displayName = 'Popover'
