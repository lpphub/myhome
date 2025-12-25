import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { getDashboardData } from '@/api/dashboard'
import { LoadingState } from '@/components/LoadingState'
import { DashboardHeader } from './components/DashboardHeader'
import { DashboardStats } from './components/DashboardStats'
import { RecentActivities } from './components/RecentActivities'
import { Reminders } from './components/Reminders'

export default function Dashboard() {
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboardData,
  })

  useEffect(() => {
    if (error) {
      toast.error('数据加载失败，请重试')
      console.error('Dashboard数据获取失败:', error)
    }
  }, [error])

  if (isLoading) {
    return <LoadingState type='loading' />
  }

  if (!dashboardData) {
    return <LoadingState type='error' />
  }

  return (
    <div className='min-h-screen'>
      <DashboardHeader />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <DashboardStats data={dashboardData} />

        <div className='flex flex-col lg:flex-row gap-8'>
          <div className='flex-1'>
            <RecentActivities activities={dashboardData.recentActivities} />
          </div>
          <div className='w-full lg:w-1/3'>
            <Reminders reminders={dashboardData.reminders} />
          </div>
        </div>
      </div>
    </div>
  )
}
