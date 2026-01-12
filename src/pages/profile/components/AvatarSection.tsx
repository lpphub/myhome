import { useState } from 'react'
import { PresetAvatars } from './PresetAvatars'

const getAvatarSvg = (avatar: string) => {
  switch (avatar) {
    case 'avatar-1':
      return (
        <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
          <title>卡通头像1</title>
          <circle cx='50' cy='50' r='50' fill='#FFE4C4' />
          <circle cx='50' cy='40' r='20' fill='#FFDAB9' />
          <circle cx='43' cy='37' r='3' fill='#333' />
          <circle cx='57' cy='37' r='3' fill='#333' />
          <path d='M 43 48 Q 50 55 57 48' stroke='#333' strokeWidth='2' fill='none' />
          <ellipse cx='50' cy='70' rx='25' ry='15' fill='#FFB6C1' />
        </svg>
      )
    case 'avatar-2':
      return (
        <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
          <title>卡通头像2</title>
          <circle cx='50' cy='50' r='50' fill='#E6E6FA' />
          <circle cx='50' cy='40' r='20' fill='#FFF8DC' />
          <circle cx='43' cy='37' r='3' fill='#333' />
          <circle cx='57' cy='37' r='3' fill='#333' />
          <circle cx='50' cy='47' r='2' fill='#FFB6C1' />
          <path d='M 35 65 Q 50 75 65 65' stroke='#8B4513' strokeWidth='3' fill='none' />
          <circle cx='30' cy='40' r='12' fill='#8B4513' opacity='0.9' />
          <circle cx='70' cy='40' r='12' fill='#8B4513' opacity='0.9' />
        </svg>
      )
    case 'avatar-3':
      return (
        <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
          <title>卡通头像3</title>
          <circle cx='50' cy='50' r='50' fill='#98FB98' />
          <circle cx='50' cy='40' r='20' fill='#FFFACD' />
          <circle cx='43' cy='37' r='3' fill='#333' />
          <circle cx='57' cy='37' r='3' fill='#333' />
          <path d='M 43 48 Q 50 52 57 48' stroke='#333' strokeWidth='2' fill='none' />
          <path
            d='M 30 35 L 25 25 M 35 30 L 32 20 M 70 35 L 75 25 M 65 30 L 68 20'
            stroke='#32CD32'
            strokeWidth='3'
            fill='none'
          />
        </svg>
      )
    case 'avatar-4':
      return (
        <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
          <title>卡通头像4</title>
          <circle cx='50' cy='50' r='50' fill='#FFA07A' />
          <circle cx='50' cy='40' r='20' fill='#FFEFD5' />
          <circle cx='43' cy='37' r='3' fill='#333' />
          <circle cx='57' cy='37' r='3' fill='#333' />
          <circle cx='44' cy='46' r='2' fill='#FF69B4' />
          <circle cx='56' cy='46' r='2' fill='#FF69B4' />
          <path d='M 40 55 Q 50 62 60 55' stroke='#333' strokeWidth='2' fill='none' />
          <rect x='35' y='20' width='30' height='20' rx='5' fill='#FF6347' />
        </svg>
      )
    case 'avatar-5':
      return (
        <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
          <title>卡通头像5</title>
          <circle cx='50' cy='50' r='50' fill='#DDA0DD' />
          <circle cx='50' cy='40' r='20' fill='#F0E68C' />
          <circle cx='43' cy='37' r='3' fill='#333' />
          <circle cx='57' cy='37' r='3' fill='#333' />
          <path d='M 43 48 Q 50 53 57 48' stroke='#333' strokeWidth='2' fill='none' />
          <circle cx='38' cy='45' r='3' fill='#FFB6C1' opacity='0.5' />
          <circle cx='62' cy='45' r='3' fill='#FFB6C1' opacity='0.5' />
          <path d='M 28 70 Q 50 85 72 70' stroke='#9370DB' strokeWidth='4' fill='none' />
        </svg>
      )
    default:
      return (
        <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
          <title>默认头像</title>
          <circle cx='50' cy='50' r='50' fill='#FFE4C4' />
          <circle cx='50' cy='40' r='20' fill='#FFDAB9' />
          <circle cx='43' cy='37' r='3' fill='#333' />
          <circle cx='57' cy='37' r='3' fill='#333' />
          <path d='M 43 48 Q 50 55 57 48' stroke='#333' strokeWidth='2' fill='none' />
          <ellipse cx='50' cy='70' rx='25' ry='15' fill='#FFB6C1' />
        </svg>
      )
  }
}

interface AvatarSectionProps {
  currentAvatar: string
  selectedAvatar: string
  onAvatarSelect: (avatar: string) => void
}

export function AvatarSection({
  currentAvatar,
  selectedAvatar,
  onAvatarSelect,
}: AvatarSectionProps) {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)

  const handleAvatarClick = (avatar: string) => {
    onAvatarSelect(avatar)
    setShowAvatarSelector(false)
  }

  return (
    <div className='flex flex-col items-center mb-6'>
      <button
        type='button'
        onClick={() => setShowAvatarSelector(!showAvatarSelector)}
        className='relative w-16 h-16 bg-gradient-to-br from-honey-50 to-coral-50 rounded-xl flex items-center justify-center shadow-md ring-2 ring-white cursor-pointer hover:scale-105 transition-transform duration-300'
      >
        <div className='w-full h-full'>{getAvatarSvg(selectedAvatar || currentAvatar)}</div>
      </button>
      <p className='mt-2 text-xs text-muted/70'>点击头像更换</p>

      {showAvatarSelector && (
        <div className='w-full space-y-3 pt-4'>
          <PresetAvatars selected={selectedAvatar} onSelect={handleAvatarClick} />
        </div>
      )}
    </div>
  )
}
