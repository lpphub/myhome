import { delay, HttpResponse, http } from 'msw'
import type { AuthForm } from '@/types/auth'
import type { Space, SpaceForm } from '@/types/spaces'
import type { ReorderParams, Tag, TagFormData, TagGroup } from '@/types/tags'

let deleteCallCount = 0
let updateCallCount = 0

export function resetTagCounters() {
  deleteCallCount = 0
  updateCallCount = 0
}

async function loadTagsData(): Promise<Record<string, TagGroup[]>> {
  const res = await fetch('/data/tags.json')
  if (!res.ok) throw new Error('Failed to load tags.json')
  return res.json()
}

async function loadSpacesData(): Promise<{ spaces: Space[] }> {
  const res = await fetch('/data/spaces.json')
  if (!res.ok) throw new Error('Failed to load spaces.json')
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

  http.get('/api/tags', async ({ request }) => {
    const url = new URL(request.url)
    let spaceId = url.searchParams.get('spaceId')

    const data = await loadTagsData()

    if (!spaceId) {
      spaceId = '1'
    }

    // 如果指定了 spaceId，返回对应空间的数据
    if (spaceId) {
      const spaceIdNum = Number.parseInt(spaceId, 10)
      if (data[spaceIdNum]) {
        return HttpResponse.json({
          code: 200,
          message: '获取标签成功',
          data: data[spaceIdNum],
        })
      }
    }

    // 如果没有指定 spaceId 或 spaceId 不存在，返回空数组
    return HttpResponse.json({
      code: 200,
      message: '获取标签成功',
      data: [],
    })
  }),

  http.post('/api/tags', async ({ request }) => {
    const body = (await request.json()) as TagFormData
    const data = await loadTagsData()

    if (!body.spaceId) {
      return HttpResponse.json({ code: 400, message: '缺少 spaceId' }, { status: 400 })
    }

    const spaceIdNum = body.spaceId
    const spaceGroups = data[spaceIdNum]

    if (!spaceGroups) {
      return HttpResponse.json({ code: 404, message: '空间不存在' }, { status: 404 })
    }

    const allTags = spaceGroups.flatMap(cat => cat.tags)
    const newTag: Tag = {
      id: Date.now(),
      name: body.name || '',
      group: body.group || 'default',
      color: body.color || 'lemon',
      description: body.description || '',
      itemCount: 0,
      order: allTags.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      spaceId: body.spaceId,
    }

    return HttpResponse.json({
      code: 200,
      message: '创建标签成功',
      data: newTag,
    })
  }),

  http.patch<{ id: string }>('/api/tags/:id', async ({ params, request }) => {
    updateCallCount++

    const id = Number.parseInt(params.id, 10)
    const body = (await request.json()) as Partial<TagFormData>

    if (updateCallCount % 2 === 0) {
      return HttpResponse.json({ code: 500, message: '更新失败，请重试' }, { status: 500 })
    }

    const updatedTag: Tag = {
      id,
      name: body.name || '',
      group: body.group || 'default',
      color: body.color || 'lemon',
      description: body.description || '',
      order: 0,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json({
      code: 200,
      message: '更新标签成功',
      data: updatedTag,
    })
  }),

  http.delete<{ id: string }>('/api/tags/:id', async () => {
    deleteCallCount++

    if (deleteCallCount % 2 === 0) {
      return HttpResponse.json({ code: 500, message: '删除失败，请重试' }, { status: 500 })
    }

    return HttpResponse.json({
      code: 200,
      message: '删除标签成功',
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

  http.post('/api/tags/group', async ({ request }) => {
    const body = (await request.json()) as { name: string; spaceId?: number }
    const name = body.name?.trim()

    if (!name) {
      return HttpResponse.json({ code: 400, message: '分类名称不能为空' }, { status: 400 })
    }

    if (!body.spaceId) {
      return HttpResponse.json({ code: 400, message: '缺少 spaceId' }, { status: 400 })
    }

    const data = await loadTagsData()
    const spaceIdNum = body.spaceId
    const spaceGroups = data[spaceIdNum]

    if (!spaceGroups) {
      return HttpResponse.json({ code: 404, message: '空间不存在' }, { status: 404 })
    }

    const existingGroup = spaceGroups.find(group => group.name === name)

    if (existingGroup) {
      return HttpResponse.json({ code: 409, message: '分组已存在' }, { status: 409 })
    }

    const maxId = Math.max(...spaceGroups.map(group => group.id))
    const newGroup: TagGroup = {
      id: maxId + 1,
      name,
      code: name.toLowerCase().replace(/\s+/g, '-'),
      tags: [],
    }

    return HttpResponse.json({
      code: 200,
      message: '创建分组成功',
      data: newGroup,
    })
  }),

  http.delete<{ code: string }>('/api/tags/group/:code', async () => {
    return HttpResponse.json({
      code: 200,
      message: '删除分组成功',
      data: { success: true },
    })
  }),

  http.get('/api/spaces', async () => {
    await delay(200)
    const data = await loadSpacesData()
    return HttpResponse.json({
      code: 200,
      message: '获取空间列表成功',
      data: data.spaces,
    })
  }),

  http.post('/api/spaces', async ({ request }) => {
    const body = (await request.json()) as SpaceForm
    const data = await loadSpacesData()

    const maxId = data.spaces.length > 0 ? Math.max(...data.spaces.map(s => Number(s.id))) : 0

    const newSpace: Space = {
      id: maxId + 1,
      name: body.name,
      icon: body.icon,
      description: body.description,
      tagCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json({
      code: 200,
      message: '创建空间成功',
      data: newSpace,
    })
  }),

  http.patch<{ id: string }>('/api/spaces/:id', async ({ params, request }) => {
    const id = Number.parseInt(params.id, 10)
    const body = (await request.json()) as Partial<SpaceForm>

    const data = await loadSpacesData()
    const space = data.spaces.find(s => s.id === id)

    if (!space) {
      return HttpResponse.json({ code: 404, message: '空间不存在' }, { status: 404 })
    }

    const updatedSpace: Space = {
      ...space,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json({
      code: 200,
      message: '更新空间成功',
      data: updatedSpace,
    })
  }),

  http.delete<{ id: string }>('/api/spaces/:id', async ({ params }) => {
    const id = Number.parseInt(params.id, 10)
    const data = await loadSpacesData()
    const space = data.spaces.find(s => s.id === id)

    if (!space) {
      return HttpResponse.json({ code: 404, message: '空间不存在' }, { status: 404 })
    }

    return HttpResponse.json({
      code: 200,
      message: '删除空间成功',
      data: { success: true },
    })
  }),
]
