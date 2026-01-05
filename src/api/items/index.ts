// api/items.ts
import type { Item, RecentActivity } from '@/types/items'
import httpClient from '@/utils/request'

enum ItemsApi {
  GetItems = '/items',
  GetActivities = '/items/activities',
}

export const getItems = () =>
  httpClient.get<Item[]>({
    url: ItemsApi.GetItems,
  })

export const getActivities = () =>
  httpClient.get<RecentActivity[]>({
    url: ItemsApi.GetActivities,
  })
