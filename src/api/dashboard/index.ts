import type { ReactNode } from 'react'
import httpClient from '@/utils/request'

export interface DashboardOverview {
  totalItems: number
  totalSpaces: number
  utilizationRate: number
  expiredItems: number
  borrowedItems: number
  lowStockItems: number
}

export type ActivityType =
  | 'item-add'
  | 'item-update'
  | 'item-delete'
  | 'item-move'
  | 'room-add'
  | 'room-update'
  | 'storage-add'
  | 'storage-update'

export interface DashboardActivity {
  id: string
  type: ActivityType
  action: string
  itemName: string
  timestamp: string
  icon?: ReactNode
}

export type ReminderUrgency = 'high' | 'medium' | 'low'

export interface DashboardReminder {
  id: string
  type: string
  itemName: string
  dueDate: string | null
  urgency: ReminderUrgency
  description: string
}

export interface DashboardData {
  overview: DashboardOverview
  recentActivities: DashboardActivity[]
  reminders: DashboardReminder[]
}

enum DashboardApi {
  GetDashboard = '/dashboard',
}

export const getDashboardData = () => {
  return httpClient.get<DashboardData>({
    url: DashboardApi.GetDashboard,
  })
}
