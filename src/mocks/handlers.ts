import { delay, HttpResponse, http } from 'msw'
import type { AuthForm } from '@/types/auth'
import type { ReorderParams, Tag, TagCategory, TagFormData } from '@/types/tags'
import type { Item, RecentActivity } from '@/types/items'

async function loadTagsData(): Promise<{ categories: TagCategory[]; tags: TagCategory[] }> {
  const res = await fetch('/data/tags.json')
  if (!res.ok) throw new Error('Failed to load tags.json')
  return res.json()
}

async function loadItemsData(): Promise<{ items: Item[] }> {
  const res = await fetch('/data/items.json')
  if (!res.ok) throw new Error('Failed to load items.json')
  const data = await res.json()
  return { items: data.items }
}

async function loadActivitiesData(): Promise<{ activities: RecentActivity[] }> {
  const res = await fetch('/data/items.json')
  if (!res.ok) throw new Error('Failed to load items.json')
  const data = await res.json()
  return { activities: data.activities }
}

async function loadDashboardData(): Promise<{
  dashboard: {
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
      timestamp: string
      [key: string]: unknown
    }>
    reminders: Array<{
      id: string
      type: string
      itemName: string
      dueDate: string | null
      urgency: string
      description: string
    }>
    quickActions?: Array<{
      id: string
      title: string
      description: string
      icon: string
      action: string
    }>
  }
}> {
  const res = await fetch('/data/dashboard.json')
  if (!res.ok) throw new Error('Failed to load dashboard.json')
  return res.json()
}

async function loadUsersData(): Promise<Array<{ email: string; password: string; id: number }>> {
  const res = await fetch('/data/users.json')
  if (!res.ok) throw new Error('Failed to load users.json')
  const data = await res.json()
  return data.users
}

function generateTokens(): { accessToken: string; refreshToken: string } {
  return {
    accessToken: `mock_access_token_${Date.now()}`,
    refreshToken: `mock_refresh_token_${Date.now()}`,
  }
}

export const handlers = [
  http.post('/api/auth/signin', async ({ request }) => {
    const body = (await request.json()) as AuthForm

    const users = await loadUsersData()
    const user = users.find(u => u.email === body.email && u.password === body.password)

    if (!user) {
      return HttpResponse.json({ code: 401, message: '邮箱或密码错误' }, { status: 401 })
    }

    const tokens = generateTokens()

    return HttpResponse.json({
      code: 200,
      message: '登录成功',
      data: {
        ...tokens,
        user: {
          id: user.id,
          name: user.email,
        },
      },
    })
  }),

  http.post('/api/auth/refresh', async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string }

    if (!body.refreshToken || !body.refreshToken.startsWith('mock_refresh_token')) {
      return HttpResponse.json({ code: 401, message: '无效的刷新令牌' }, { status: 401 })
    }

    const tokens = generateTokens()

    return HttpResponse.json({
      code: 200,
      message: '令牌刷新成功',
      data: tokens,
    })
  }),

  http.get('/api/tags', async () => {
    const data = await loadTagsData()
    return HttpResponse.json({
      code: 200,
      message: '获取标签成功',
      data: data.tags,
    })
  }),

  http.post('/api/tags', async ({ request }) => {
    const body = (await request.json()) as TagFormData
    const data = await loadTagsData()

    const allTags = data.tags.flatMap(cat => cat.tags)
    const maxId = allTags.length > 0 ? Math.max(...allTags.map(t => t.id)) : 0
    const newTag: Tag = {
      id: maxId + 1,
      name: body.name || '',
      category: body.category || 'default',
      color: body.color || 'lemon',
      description: body.description || '',
      itemCount: 0,
      order: allTags.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json({
      code: 200,
      message: '创建便签成功',
      data: newTag,
    })
  }),

  http.patch<{ id: string }>('/api/tags/:id', async ({ params, request }) => {
    const id = Number.parseInt(params.id, 10)
    const body = (await request.json()) as Partial<TagFormData>

    const updatedTag: Tag = {
      id,
      name: body.name || '',
      category: body.category || 'default',
      color: body.color || 'lemon',
      description: body.description || '',
      order: 0,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json({
      code: 200,
      message: '更新便签成功',
      data: updatedTag,
    })
  }),

  http.delete<{ id: string }>('/api/tags/:id', async () => {
    return HttpResponse.json({
      code: 200,
      message: '删除便签成功',
      data: { success: true },
    })
  }),

  http.post('/api/tags/reorder', async ({ request }) => {
    const body = (await request.json()) as ReorderParams
    return HttpResponse.json({
      code: 200,
      message: '重新排序成功',
      data: body,
    })
  }),

  http.post('/api/tags/category', async ({ request }) => {
    const body = (await request.json()) as { name: string }
    const name = body.name?.trim()

    if (!name) {
      return HttpResponse.json({ code: 400, message: '分类名称不能为空' }, { status: 400 })
    }

    const data = await loadTagsData()
    const existingCategory = data.tags.find(cat => cat.name === name)

    if (existingCategory) {
      return HttpResponse.json({ code: 409, message: '分类已存在' }, { status: 409 })
    }

    const maxId = Math.max(...data.tags.map(cat => cat.id))
    const newCategory: TagCategory = {
      id: maxId + 1,
      name,
      code: name.toLowerCase().replace(/\s+/g, '-'),
      tags: [],
    }

    return HttpResponse.json({
      code: 200,
      message: '创建分类成功',
      data: newCategory,
    })
  }),

  http.delete<{ code: string }>('/api/tags/category/:code', async () => {
    return HttpResponse.json({
      code: 200,
      message: '删除分类成功',
      data: { success: true },
    })
  }),

  http.get('/api/items', async () => {
    await delay(200)
    const data = await loadItemsData()
    return HttpResponse.json({
      code: 200,
      message: '获取物品成功',
      data: data.items,
    })
  }),

  http.get('/api/items/activities', async () => {
    await delay(200)
    const data = await loadActivitiesData()
    return HttpResponse.json({
      code: 200,
      message: '获取活动记录成功',
      data: data.activities,
    })
  }),

  http.get('/api/dashboard', async () => {
    await delay(200)
    const data = await loadDashboardData()
    return HttpResponse.json({
      code: 200,
      message: '获取仪表板数据成功',
      data: data.dashboard,
    })
  }),
]
