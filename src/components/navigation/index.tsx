import { useLocation, useNavigate } from 'react-router'
import { useSpaceId } from '@/pages/spaces/hooks/useSpaceLocal'
import { useSpaceQuery } from '@/pages/spaces/hooks/useSpaces'
import type { Space } from '@/types/spaces'
import { NavigationItems } from './NavigationItems'
import { NavigationLogo } from './NavigationLogo'
import { SpaceSwitcher } from './SpaceSwitcher'
import { UserMenu } from './UserMenu'

const navItems = [
  { id: 'home', label: '首页', path: '/' },
  { id: 'tags', label: '便签墙', path: '/tags' },
  { id: 'notes', label: '笔记', path: '/notes' },
]

export default function Navigation() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { getSpaceId } = useSpaceId()
  const spaceId = getSpaceId()
  const { data: spaces } = useSpaceQuery()
  const currentSpace: Space | undefined = spaces?.find(s => s.id === spaceId)

  const currentPageId = navItems.find(item => pathname === item.path)?.id || ''

  return (
    <>
      <nav className='fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-xl border-b border-honey-100/80'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='h-16 items-center flex justify-between md:grid md:grid-cols-[max-content_1fr_max-content]'>
            <NavigationLogo />

            <NavigationItems currentPage={currentPageId} variant='desktop' />

            <div className='flex items-center gap-2'>
              <SpaceSwitcher
                currentSpace={currentSpace}
                onCreateSpace={() => navigate('/spaces/new')}
              />

              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <NavigationItems currentPage={currentPageId} variant='mobile' />
    </>
  )
}
