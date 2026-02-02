import { memo, useCallback, useEffect, useState } from 'react'
import type { ToolbarProps } from '@/components/editor/types'
import { cn } from '@/lib/utils'
import { StickyToolbar } from './sticky'

interface BubblePosition {
  x: number
  y: number
  show: boolean
}

/**
 * 气泡工具栏组件
 * 在文本选择时出现在选择附近，选择清除时消失
 *
 * 定位逻辑：
 * - 优先显示在选择上方
 * - 如果上方空间不足，显示在选择下方
 * - 保持工具栏在视口边界内
 */
export const BubbleToolbar = memo<ToolbarProps>(({ editor, config, className }) => {
  const [position, setPosition] = useState<BubblePosition>({
    x: 0,
    y: 0,
    show: false,
  })

  // 计算工具栏位置
  const calculatePosition = useCallback(() => {
    if (!editor) return

    try {
      const { selection } = editor.state
      const { from, to, empty } = selection

      // 如果没有选择文本，隐藏工具栏
      if (empty) {
        setPosition(prev => ({ ...prev, show: false }))
        return
      }

      // 获取选择范围的 DOM 节点
      const { view } = editor
      const start = view.coordsAtPos(from)
      const end = view.coordsAtPos(to)

      if (!start || !end) {
        setPosition(prev => ({ ...prev, show: false }))
        return
      }

      // 计算选择区域的中心位置
      const selectionRect = {
        left: Math.min(start.left, end.left),
        right: Math.max(start.right, end.right),
        top: Math.min(start.top, end.top),
        bottom: Math.max(start.bottom, end.bottom),
      }

      const centerX = (selectionRect.left + selectionRect.right) / 2

      // 工具栏预估尺寸（用于定位计算）
      const toolbarWidth = 300
      const toolbarHeight = 40
      const spacing = 8

      // 计算 X 位置（居中，但保持在视口内）
      let x = centerX - toolbarWidth / 2
      const viewportWidth = window.innerWidth || 1024 // 安全回退值

      if (x < spacing) {
        x = spacing
      } else if (x + toolbarWidth > viewportWidth - spacing) {
        x = viewportWidth - toolbarWidth - spacing
      }

      // 计算 Y 位置（优先上方，空间不足时下方）
      let y = selectionRect.top - toolbarHeight - spacing

      if (y < spacing) {
        // 上方空间不足，显示在下方
        y = selectionRect.bottom + spacing
      }

      // 确保位置值是有效数字
      const safeX = Number.isFinite(x) ? x : spacing
      const safeY = Number.isFinite(y) ? y : spacing

      setPosition({
        x: safeX,
        y: safeY,
        show: true,
      })
    } catch (error) {
      // 定位计算失败时的安全回退
      console.warn('Error calculating bubble toolbar position:', error)
      setPosition({
        x: 20, // 安全的默认位置
        y: 20,
        show: true,
      })
    }
  }, [editor])

  // 监听选择变化
  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      // 使用 setTimeout 确保 DOM 更新完成后再计算位置
      setTimeout(calculatePosition, 0)
    }

    // 监听选择更新事件
    editor.on('selectionUpdate', handleSelectionUpdate)

    // 监听内容更新事件（可能影响选择位置）
    editor.on('update', handleSelectionUpdate)

    // 初始计算
    calculatePosition()

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
      editor.off('update', handleSelectionUpdate)
    }
  }, [editor, calculatePosition])

  // 监听窗口大小变化，重新计算位置
  useEffect(() => {
    const handleResize = () => {
      if (position.show) {
        calculatePosition()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [position.show, calculatePosition])

  // 如果不显示或编辑器不存在，返回 null
  if (!editor || !position.show) {
    return null
  }

  return (
    <div
      className={cn(
        'fixed z-60 bg-white border border-slate-200 rounded-lg shadow-lg',
        'transition-opacity duration-200',
        position.show ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* 使用现有的 StickyToolbar 组件，但移除边框和背景 */}
      <StickyToolbar editor={editor} config={config} className='bg-transparent border-none p-2' />
    </div>
  )
})

BubbleToolbar.displayName = 'BubbleToolbar'
