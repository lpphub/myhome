import { Edit2, MapPin, Package, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Item, ViewMode } from '@/types/items'
import { ITEM_STATUS_LABELS } from '@/types/items'

interface ItemListProps {
  items: Item[]
  viewMode: ViewMode
}

const STATUS_VARIANTS: Record<string, 'lemon' | 'honey' | 'coral' | 'lavender' | 'default'> = {
  active: 'lemon',
  inactive: 'lavender',
  lost: 'coral',
  donated: 'honey',
}

const STATUS_BG_COLORS: Record<string, string> = {
  active: 'bg-lemon-50',
  inactive: 'bg-lavender-50',
  lost: 'bg-coral-50',
  donated: 'bg-honey-50',
  default: 'bg-cream-50',
}

const STATUS_TEXT_COLORS: Record<string, string> = {
  active: 'text-lemon-600',
  inactive: 'text-lavender-600',
  lost: 'text-coral-600',
  donated: 'text-honey-600',
  default: 'text-warmGray-500',
}

const EMOJI_REGEX = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu

function cleanName(name: string): string {
  return name.replace(EMOJI_REGEX, '').trim()
}

function extractEmoji(text: string): string | null {
  const emojiMatch = text.match(EMOJI_REGEX)
  return emojiMatch ? emojiMatch[0] : null
}

function getVisualContent(item: Item): { type: 'emoji' | 'image' | 'initial'; content: string } {
  const emoji = extractEmoji(item.name)
  if (emoji) {
    return { type: 'emoji', content: emoji }
  }
  if (item.image) {
    return { type: 'image', content: item.image }
  }
  return { type: 'initial', content: item.name.charAt(0).toUpperCase() }
}

const ItemVisual = ({ item }: { item: Item }) => {
  const { type, content } = getVisualContent(item)
  const bgColorClass = STATUS_BG_COLORS[item.status] || STATUS_BG_COLORS.default

  if (type === 'emoji') {
    return (
      <div
        className={cn(
          'w-9 h-9 text-base rounded-lg flex items-center justify-center',
          bgColorClass
        )}
      >
        {content}
      </div>
    )
  }

  if (type === 'image') {
    return (
      <div className='w-9 h-9 rounded-lg overflow-hidden bg-cream-100'>
        <img src={content} alt='' className='w-full h-full object-cover' loading='lazy' />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-9 h-9 text-base rounded-lg flex items-center justify-center font-medium',
        bgColorClass,
        STATUS_TEXT_COLORS[item.status]
      )}
    >
      {content}
    </div>
  )
}

const ActionButtons = ({ variant = 'ghost' }: { variant?: 'secondary' | 'ghost' }) => (
  <div className='flex gap-1'>
    <Button
      size='icon'
      variant={variant === 'secondary' ? 'secondary' : 'ghost'}
      className='h-8 w-8 hover:bg-honey-100'
    >
      <Edit2 className='w-3.5 h-3.5' />
    </Button>
    <Button
      size='icon'
      variant='ghost'
      className={cn(
        'h-8 w-8 text-coral-600 hover:bg-coral-50',
        variant === 'secondary' && 'bg-white/90 backdrop-blur-sm shadow-sm'
      )}
    >
      <Trash2 className='w-3.5 h-3.5' />
    </Button>
  </div>
)

const ItemCard = ({ item, viewMode }: { item: Item; viewMode: ViewMode }) => {
  const statusVariant = STATUS_VARIANTS[item.status] || 'default'

  if (viewMode === 'list') {
    return (
      <div className='flex items-center gap-4 px-4 py-3 border-b border-cream-100 hover:bg-honey-50/30 transition-colors duration-150 cursor-pointer'>
        <ItemVisual item={item} />
        <div className='flex-1 min-w-0'>
          <p className='font-medium text-warmGray-800 truncate'>{cleanName(item.name)}</p>
        </div>
        <div className='hidden sm:block w-28'>
          <Badge variant={statusVariant} className='text-xs'>
            {ITEM_STATUS_LABELS[item.status]}
          </Badge>
        </div>
        <div className='w-20 text-center'>
          <span className='text-sm font-medium text-warmGray-700'>× {item.quantity}</span>
        </div>
        <div className='hidden md:block w-32'>
          <div className='flex items-center gap-1.5 text-sm text-warmGray-500 truncate'>
            <MapPin className='w-3.5 h-3.5 shrink-0' />
            <span>{item.location || '-'}</span>
          </div>
        </div>
        <div className='w-20 flex items-center justify-end'>
          <ActionButtons />
        </div>
      </div>
    )
  }

  return (
    <div className='group relative flex flex-col p-5 bg-white rounded-xl border border-cream-200/60 shadow-sm hover:shadow-lg hover:shadow-honey-100/50 hover:border-honey-200/80 hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer overflow-hidden'>
      <div className='flex items-center gap-3 mb-3'>
        <ItemVisual item={item} />
        <div className='flex-1 min-w-0 flex items-center gap-2'>
          <h3 className='font-semibold text-warmGray-800 truncate flex-1'>
            {cleanName(item.name)}
          </h3>
          <span className='text-sm font-medium text-warmGray-600 shrink-0'>× {item.quantity}</span>
        </div>
      </div>
      <div className='space-y-2.5'>
        <p className='text-sm text-warmGray-500 line-clamp-2'>{item.description || '暂无描述'}</p>
        <div className='flex items-center gap-3'>
          <Badge variant={statusVariant} className='text-xs'>
            {ITEM_STATUS_LABELS[item.status]}
          </Badge>
          {item.location && (
            <div className='flex items-center gap-1.5 text-xs text-warmGray-500'>
              <MapPin className='w-3.5 h-3.5' />
              <span className='truncate'>{item.location}</span>
            </div>
          )}
        </div>
      </div>
      <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200'>
        <ActionButtons variant='secondary' />
      </div>
    </div>
  )
}

const EmptyState = () => (
  <div className='flex flex-col items-center justify-center py-20 text-center space-y-4'>
    <div className='relative'>
      <div className='absolute inset-0 bg-honey-100 rounded-full blur-2xl opacity-50' />
      <Package className='relative w-16 h-16 text-honey-400' />
    </div>
    <div className='space-y-1'>
      <p className='font-medium text-warmGray-700'>暂无物品</p>
      <p className='text-sm text-warmGray-500'>添加你的第一个物品，开始整理</p>
    </div>
  </div>
)

export function ItemList({ items, viewMode }: ItemListProps) {
  if (items.length === 0) {
    return <EmptyState />
  }

  if (viewMode === 'list') {
    return (
      <div className='bg-white rounded-xl border border-cream-200/60 overflow-hidden'>
        <div className='flex items-center gap-4 px-4 py-3 bg-cream-50/50 border-b border-cream-100 text-xs font-medium text-warmGray-500 uppercase tracking-wide'>
          <div className='w-9' />
          <div className='flex-1 min-w-0'>物品名称</div>
          <div className='hidden sm:block w-28'>状态</div>
          <div className='w-20 text-center'>数量</div>
          <div className='hidden md:block w-32'>位置</div>
          <div className='w-20 text-right'>操作</div>
        </div>
        <div className='divide-y divide-cream-100'>
          {items.map(item => (
            <ItemCard key={item.id} item={item} viewMode={viewMode} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4'>
      {items.map(item => (
        <ItemCard key={item.id} item={item} viewMode={viewMode} />
      ))}
    </div>
  )
}
