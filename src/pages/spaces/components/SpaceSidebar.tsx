import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HomeTip {
  icon: React.ReactNode
  text: string
  id: string
}

interface SpaceSidebarProps {
  tips: HomeTip[]
}

export function SpaceSidebar({ tips }: SpaceSidebarProps) {
  const HomeTips = () => {
    return (
      <Card className='border-cream-200 gap-3'>
        <CardHeader className='pb-0'>
          <div className='flex items-center space-x-2'>
            <Sparkles className='w-4 h-4 text-lavender-600' />
            <CardTitle className='text-base font-semibold text-warmGray-800'>家居小贴士</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='space-y-3'>
            {tips.map(tip => (
              <div key={tip.id} className='flex items-start gap-2 p-2 bg-white/50 rounded-lg'>
                <span className='mt-0.5'>{tip.icon}</span>
                <span className='text-warmGray-700 text-xs leading-relaxed'>{tip.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return <HomeTips />
}
