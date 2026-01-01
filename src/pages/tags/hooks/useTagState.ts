// hooks/useTagWallState.ts
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getTags, reorderTags } from '@/api/tags'
import type { TagCategory } from '@/types/tags'

export function useTagWallState() {
  const [tags, setTags] = useState<TagCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 🔑 关键：用 ref 存防抖定时器
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // 1. 初始化加载
  useEffect(() => {
    getTags().then(data => {
      setTags(data)
      setIsLoading(false)
    })
  }, [])

  // 2. 核心：拖拽结束后的处理
  const handleDragEnd = (fromId: number, toCategoryCode: string, toIndex: number) => {
    setTags(prev => {
      // ⚡ 极快的本地计算，不需要乐观更新，因为这就是“真相”
      const next = [...prev]
      let movedTag: any = null

      // 找到源
      for (const cat of next) {
        const idx = cat.tags.findIndex(t => t.id === fromId)
        if (idx !== -1) {
          movedTag = cat.tags.splice(idx, 1)[0]
          break
        }
      }

      if (!movedTag) return prev

      // 找到目标并插入
      const targetCat = next.find(c => c.code === toCategoryCode)
      if (targetCat) {
        movedTag.category = toCategoryCode // 更新分类
        targetCat.tags.splice(toIndex, 0, movedTag)
      }

      return next
    })

    // 📡 后台同步（防抖）
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      reorderTags({ fromId, toCategory: toCategoryCode, toIndex }).catch(() =>
        toast.error('同步失败，请刷新')
      )
    }, 500) // 500ms 内不操作才发请求
  }

  return { tags, setTags, isLoading, handleDragEnd }
}
