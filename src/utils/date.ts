export const formatRelativeTime = (dateStr?: string): string => {
  if (!dateStr) return ''
  const now = new Date()
  const targetDate = new Date(dateStr)
  const diffMs = now.getTime() - targetDate.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffDays === 0) return `${diffHours}小时前`

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
  const days = Math.floor((today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24))

  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  if (days < 365) return `${Math.floor(days / 30)}个月前`

  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}
