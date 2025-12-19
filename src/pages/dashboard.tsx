import { useQuery } from '@tanstack/react-query'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  CheckCircle,
  Clock,
  Coffee,
  Heart,
  Home,
  Moon,
  Package,
  Plus,
  Search,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getDashboardData } from '@/api/dashboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
export default function Dashboard() {
  // 使用React Query获取数据
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  })

  // 错误处理
  useEffect(() => {
    if (error) {
      toast.error('数据加载失败，请重试')
      console.error('Dashboard数据获取失败:', error)
    }
  }, [error])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { text: '早上好', icon: Sun, color: 'text-honey-500' }
    if (hour < 18) return { text: '下午好', icon: Sun, color: 'text-coral-500' }
    return { text: '晚上好', icon: Moon, color: 'text-lavender-500' }
  }

  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  const getActivityIcon = (type: string) => {
    const iconClass = 'w-4 h-4'
    switch (type) {
      case '入库':
        return <Package className={`${iconClass} text-honey-500`} />
      case '出库':
        return <Package className={`${iconClass} text-coral-500`} />
      case '转移':
        return <Archive className={`${iconClass} text-lavender-500`} />
      case '盘点':
        return <Search className={`${iconClass} text-lemon-500`} />
      case '借出':
        return <Clock className={`${iconClass} text-coral-400`} />
      default:
        return <Activity className={`${iconClass} text-warmGray-400`} />
    }
  }

  const getStatusIcon = (status: string) => {
    const iconClass = 'w-4 h-4'
    switch (status) {
      case '已完成':
        return <CheckCircle className={`${iconClass} text-honey-500`} />
      case '进行中':
        return <Clock className={`${iconClass} text-coral-500`} />
      case '失败':
        return <XCircle className={`${iconClass} text-coral-400`} />
      default:
        return <AlertCircle className={`${iconClass} text-warmGray-400`} />
    }
  }

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (days > 0) {
      return `${days}天前`
    } else if (hours > 0) {
      return `${hours}小时前`
    } else {
      return '刚刚'
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-cream-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-honey-200 border-t-honey-500 rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-warmGray-600 text-lg'>正在加载您的小窝...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className='min-h-screen bg-cream-50 flex items-center justify-center'>
        <p className='text-warmGray-600'>数据加载失败</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-cream-50 via-cream-100 to-honey-50'>
      {/* 温馨的头部区域 */}
      <div className='relative overflow-hidden'>
        {/* 背景装饰 */}
        <div className='absolute inset-0 bg-linear-to-r from-honey-100/50 via-cream-200/30 to-coral-100/50'></div>
        <div className='absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-honey-200/20 to-transparent rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-coral-200/20 to-transparent rounded-full blur-2xl'></div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='w-16 h-16 bg-linear-to-br from-honey-400 to-honey-600 rounded-3xl flex items-center justify-center shadow-warm-lg animate-float'>
                <Home className='w-8 h-8 text-white' />
              </div>
              <div>
                <div className='flex items-center space-x-3 mb-2'>
                  <GreetingIcon className={`w-6 h-6 ${greeting.color}`} />
                  <h1 className='text-3xl font-bold text-warmGray-800'>{greeting.text}！</h1>
                  <Heart className='w-6 h-6 text-coral-400 animate-pulse' />
                </div>
                <p className='text-warmGray-600 text-lg'>
                  今天是{' '}
                  {new Date().toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long',
                  })}
                </p>
                <p className='text-warmGray-500 mt-1'>让我们一起整理温馨的小窝吧 ✨</p>
              </div>
            </div>
            <div className='hidden md:flex items-center space-x-4'>
              <Button variant='secondary' size='default'>
                <Plus className='w-4 h-4 mr-2' />
                添加新物品
              </Button>
              <Button variant='default' size='default'>
                <Search className='w-4 h-4 mr-2' />
                找找看
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* 温馨统计卡片 - 仿手账风格 */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card className='relative'>
            <div className='flex items-center justify-between p-6'>
              <div>
                <p className='text-sm font-medium text-warmGray-600 mb-1'>我的收藏</p>
                <p className='text-3xl font-bold text-honey-700'>
                  {dashboardData.overview.totalItems}
                </p>
                <p className='text-xs text-warmGray-500 mt-1'>件温馨小物</p>
              </div>
              <div className='p-4 bg-linear-to-br from-honey-200 to-honey-300 rounded-2xl shadow-soft'>
                <Package className='w-8 h-8 text-honey-700' />
              </div>
            </div>
            <div className='absolute top-2 right-2'>
              <Star className='w-4 h-4 text-honey-500 animate-pulse' />
            </div>
          </Card>
          <Card className='relative'>
            <div className='flex items-center justify-between p-6'>
              <div>
                <p className='text-sm font-medium text-warmGray-600 mb-1'>收纳空间</p>
                <p className='text-3xl font-bold text-lavender-700'>
                  {dashboardData.overview.totalSpaces}
                </p>
                <p className='text-xs text-warmGray-500 mt-1'>个温馨角落</p>
              </div>
              <div className='p-4 bg-linear-to-br from-lavender-200 to-lavender-300 rounded-2xl shadow-soft'>
                <Archive className='w-8 h-8 text-lavender-700' />
              </div>
            </div>
            <div className='absolute top-2 right-2'>
              <Sparkles className='w-4 h-4 text-lavender-500 animate-bounce-gentle' />
            </div>
          </Card>

          <Card className='relative'>
            <div className='flex items-center justify-between p-6'>
              <div>
                <p className='text-sm font-medium text-warmGray-600 mb-1'>空间利用率</p>
                <p className='text-3xl font-bold text-coral-700'>
                  {dashboardData.overview.utilizationRate}%
                </p>
                <p className='text-xs text-warmGray-500 mt-1'>利用率刚好</p>
              </div>
              <div className='p-4 bg-linear-to-br from-coral-200 to-coral-300 rounded-2xl shadow-soft'>
                <TrendingUp className='w-8 h-8 text-coral-700' />
              </div>
            </div>
            <div className='absolute top-2 right-2'>
              <Heart className='w-4 h-4 text-coral-500 animate-pulse' />
            </div>
          </Card>

          <Card className='relative'>
            <div className='flex items-center justify-between p-6'>
              <div>
                <p className='text-sm font-medium text-warmGray-600 mb-1'>待处理事项</p>
                <p className='text-3xl font-bold text-lemon-700'>
                  {dashboardData.overview.expiredItems + dashboardData.overview.lowStockItems}
                </p>
                <p className='text-xs text-warmGray-500 mt-1'>个小提醒</p>
              </div>
              <div className='p-4 bg-linear-to-br from-lemon-200 to-lemon-300 rounded-2xl shadow-soft'>
                <AlertTriangle className='w-8 h-8 text-lemon-700' />
              </div>
            </div>
            <div className='absolute top-2 right-2'>
              <Coffee className='w-4 h-4 text-lemon-500 animate-float' />
            </div>
          </Card>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* 最近活动 - 手账风格 */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle>最近的小变化</CardTitle>
                <CardDescription>物品流动的温馨记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {dashboardData.recentActivities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className='flex items-center justify-between p-4 bg-linear-to-r from-cream-50/50 to-honey-50/30 rounded-2xl border border-cream-200 hover:shadow-warm-sm transition-all duration-300 animate-fade-in'
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className='flex items-center space-x-4'>
                        <div className='p-3 bg-white/60 rounded-xl shadow-soft'>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <p className='text-sm font-medium text-warmGray-800 flex items-center space-x-2'>
                            <span>{activity.type}</span>
                            <span className='text-warmGray-400'>·</span>
                            <span>{activity.itemName}</span>
                          </p>
                          <p className='text-xs text-warmGray-600 mt-1'>
                            {activity.operator} · {formatTimestamp(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <Badge variant={activity.status === '已完成' ? 'default' : 'secondary'}>
                          {activity.status}
                        </Badge>
                        {getStatusIcon(activity.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 温馨提醒和快捷操作 */}
          <div className='space-y-6'>
            {/* 提醒事项 - 温馨样式 */}
            <Card>
              <CardHeader>
                <CardTitle>贴心提醒</CardTitle>
                <CardDescription>需要关注的小事情</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {dashboardData.reminders.map((reminder, index) => (
                    <div
                      key={reminder.id}
                      className='p-4 bg-linear-to-r from-white/80 to-cream-50/60 rounded-xl border border-cream-200 shadow-soft hover:shadow-warm-sm transition-all duration-300 animate-fade-in'
                      style={{
                        animationDelay: `${
                          (dashboardData.recentActivities.length + index) * 100
                        }ms`,
                      }}
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <h4 className='text-sm font-medium text-warmGray-800'>
                          {reminder.itemName}
                        </h4>
                        <Badge variant={getUrgencyBadgeVariant(reminder.urgency)}>
                          {reminder.urgency === 'high'
                            ? '紧急'
                            : reminder.urgency === 'medium'
                              ? '重要'
                              : '温和'}
                        </Badge>
                      </div>
                      <p className='text-xs text-warmGray-600 leading-relaxed'>
                        {reminder.description}
                      </p>
                      {reminder.dueDate && (
                        <p className='text-xs text-warmGray-500 mt-2 flex items-center'>
                          <Clock className='w-3 h-3 mr-1' />
                          截止: {new Date(reminder.dueDate).toLocaleDateString('zh-CN')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 快捷操作 - 手账贴纸风格 */}
            <Card>
              <CardHeader>
                <CardTitle>常用小工具</CardTitle>
                <CardDescription>让整理更轻松</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  {dashboardData.quickActions.map((action, index) => (
                    <Button
                      key={action.id}
                      variant='secondary'
                      className='w-full justify-start text-left h-auto py-4 px-4'
                      onClick={() => console.log(`Quick action: ${action.action}`)}
                      style={{
                        animationDelay: `${
                          (dashboardData.recentActivities.length +
                            dashboardData.reminders.length +
                            index) *
                          100
                        }ms`,
                      }}
                    >
                      <div className='flex items-center space-x-3 w-full'>
                        <div className='p-2 bg-honey-100 rounded-lg'>
                          <Plus className='w-4 h-4 text-honey-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='font-medium text-warmGray-800'>{action.title}</div>
                          <div className='text-xs text-warmGray-600'>{action.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
