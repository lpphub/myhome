import httpClient from '@/utils/request'

export interface DashboardData {
  overview: {
    totalItems: number
    totalSpaces: number
    utilizationRate: number
    expiredItems: number
    borrowedItems: number
    lowStockItems: number
  }
  recentActivities: Array<{
    id: string
    type: string
    itemName: string
    quantity: number
    timestamp: string
    operator: string
    status: string
    borrower?: string
    fromSpace?: string
    toSpace?: string
  }>
  reminders: Array<{
    id: string
    type: string
    itemName: string
    dueDate: string | null
    urgency: 'high' | 'medium' | 'low'
    description: string
  }>
  quickActions: Array<{
    id: string
    title: string
    description: string
    icon: string
    action: string
  }>
}

enum DashboardApi {
  GetDashboard = '/dashboard',
}

export const getDashboardData = () => {
  return httpClient.get<DashboardData>({
    url: DashboardApi.GetDashboard,
  })
}
