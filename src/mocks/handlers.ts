import { delay, HttpResponse, http } from 'msw'
import type { AuthForm } from '@/types/auth'
import type { Tag, TagCategory } from '@/types/tags'

async function loadTagsData(): Promise<{ categories: TagCategory[]; tags: Tag[] }> {
  const res = await fetch('/data/tags.json')
  if (!res.ok) throw new Error('Failed to load tags.json')
  return res.json()
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

  http.post('/api/tags/categories', async ({ request }) => {
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
