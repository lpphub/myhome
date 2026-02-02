import type React from 'react'
import { memo } from 'react'
import { cn } from '@/lib/utils'

/**
 * 工具栏分隔符组件
 */
export const ToolbarDivider: React.FC = memo(() => {
  return <div className={cn('w-px h-6 bg-slate-200 mx-1')} aria-hidden='true' />
})

ToolbarDivider.displayName = 'ToolbarDivider'
