import { Card } from '@/components/ui/card'

interface SpaceStat {
  type: 'warm' | 'comfort' | 'overall'
  title: string
  count: number
  subtitle: string
  icon: React.ReactNode
}

interface SpaceStatsProps {
  stats: SpaceStat[]
}

export function SpaceStats({ stats }: SpaceStatsProps) {
  const getStyleByType = (type: 'warm' | 'comfort' | 'overall') => {
    const styles = {
      warm: {
        bgClass: 'bg-amber-50',
        iconBgClass: 'bg-amber-200',
        iconColor: 'text-amber-700',
        textColor: 'text-amber-800',
        numberColor: 'text-amber-900',
        subtitleColor: 'text-amber-600',
      },
      comfort: {
        bgClass: 'bg-rose-50',
        iconBgClass: 'bg-rose-200',
        iconColor: 'text-rose-700',
        textColor: 'text-rose-800',
        numberColor: 'text-rose-900',
        subtitleColor: 'text-rose-600',
      },
      overall: {
        bgClass: 'bg-purple-50',
        iconBgClass: 'bg-purple-200',
        iconColor: 'text-purple-700',
        textColor: 'text-purple-800',
        numberColor: 'text-purple-900',
        subtitleColor: 'text-purple-600',
      },
    }
    return styles[type]
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
      {stats.map(stat => {
        const style = getStyleByType(stat.type)
        return (
          <Card
            key={stat.type}
            variant='warm'
            className={`relative py-3 card-hover ${style.bgClass}`}
          >
            <div className='flex items-center space-x-4 py-1.5 px-3'>
              <div className={`p-2 rounded-lg shadow-soft ${style.iconBgClass}`}>
                <div className={style.iconColor}>{stat.icon}</div>
              </div>
              <div>
                <p className={`text-sm font-medium mb-1 ${style.textColor}`}>{stat.title}</p>
                <p className={`text-2xl font-hand font-bold ${style.numberColor}`}>{stat.count}</p>
                <p className={`text-xs mt-1 ${style.subtitleColor}`}>{stat.subtitle}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
