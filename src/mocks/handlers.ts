import { delay, HttpResponse, http } from 'msw'
import type { AuthForm } from '@/api/auth'
import type { Tag, TagCategory, TagFormData } from '@/types/tags'

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
    await delay(200)
    const data = await loadTagsData()
    return HttpResponse.json({
      code: 200,
      message: '获取标签成功',
      data: data.tags,
    })
  }),

  http.get('/api/tags/categories', async () => {
    await delay(100)
    const data = await loadTagsData()
    return HttpResponse.json({
      code: 200,
      message: '获取分类成功',
      data: data.categories,
    })
  }),

  http.post('/api/tags', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as TagFormData
    console.log('[Mock] Create tag:', body)
    return HttpResponse.json({
      code: 200,
      message: '标签创建成功',
      data: { id: Date.now(), ...body, itemCount: 0 },
    })
  }),

  http.patch('/api/tags/:id', async ({ params, request }) => {
    await delay(200)
    const id = Number(params.id)
    const body = await request.json()
    console.log(`[Mock] Update tag ${id}:`, body)
    return HttpResponse.json({
      code: 200,
      message: '标签更新成功',
      data: { id, ...(body as object) },
    })
  }),

  http.delete('/api/tags/:id', async ({ params }) => {
    await delay(200)
    const id = Number(params.id)
    console.log(`[Mock] Delete tag ${id}`)
    return HttpResponse.json({
      code: 200,
      message: '标签删除成功',
    })
  }),

  http.post('/api/tags/reorder', async ({ request }) => {
    await delay(200)
    const body = await request.json()
    console.log('[Mock] Reorder tags:', body)
    return HttpResponse.json({
      code: 200,
      message: '排序更新成功',
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
