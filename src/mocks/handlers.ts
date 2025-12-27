import { delay, HttpResponse, http } from 'msw'
import type { AuthForm } from '@/api/auth'
import type { CategoryInfo, ReorderRequest, Tag, TagFormData } from '@/types/tags'

// 模拟用户数据存储
const users = new Map<string, { email: string; password: string; id: number }>()

// 模拟标签数据
const mockTags: Tag[] = [
  {
    id: 1,
    name: '卧室',
    category: 'room',
    color: 'honey',
    itemCount: 25,
    description: '主卧和次卧的物品',
    createdAt: '2024-12-20T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z',
    sortOrder: 0,
  },
  {
    id: 2,
    name: '厨房',
    category: 'room',
    color: 'lemon',
    itemCount: 42,
    description: '厨具、餐具和食材',
    createdAt: '2024-12-19T00:00:00Z',
    updatedAt: '2024-12-19T00:00:00Z',
    sortOrder: 1,
  },
  {
    id: 3,
    name: '书房',
    category: 'room',
    color: 'lavender',
    itemCount: 18,
    description: '书籍、文具和办公用品',
    createdAt: '2024-12-18T00:00:00Z',
    updatedAt: '2024-12-18T00:00:00Z',
    sortOrder: 2,
  },
  {
    id: 4,
    name: '客厅',
    category: 'room',
    color: 'coral',
    itemCount: 35,
    description: '客厅家具和装饰品',
    createdAt: '2024-12-17T00:00:00Z',
    updatedAt: '2024-12-17T00:00:00Z',
    sortOrder: 3,
  },
  {
    id: 5,
    name: '卫生间',
    category: 'room',
    color: 'cream',
    itemCount: 15,
    description: '洗漱用品和毛巾',
    createdAt: '2024-12-16T00:00:00Z',
    updatedAt: '2024-12-16T00:00:00Z',
    sortOrder: 4,
  },
  {
    id: 6,
    name: '阳台',
    category: 'room',
    color: 'mint',
    itemCount: 8,
    description: '植物和园艺用品',
    createdAt: '2024-12-15T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    sortOrder: 5,
  },
  {
    id: 7,
    name: '零食',
    category: 'type',
    color: 'lemon',
    itemCount: 28,
    description: '各种零食和零食包装',
    createdAt: '2024-12-20T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z',
    sortOrder: 6,
  },
  {
    id: 8,
    name: '玩具',
    category: 'type',
    color: 'coral',
    itemCount: 12,
    description: '儿童玩具和游戏',
    createdAt: '2024-12-19T00:00:00Z',
    updatedAt: '2024-12-19T00:00:00Z',
    sortOrder: 7,
  },
  {
    id: 9,
    name: '主食',
    category: 'type',
    color: 'honey',
    itemCount: 33,
    description: '米、面、油等主食',
    createdAt: '2024-12-18T00:00:00Z',
    updatedAt: '2024-12-18T00:00:00Z',
    sortOrder: 8,
  },
  {
    id: 10,
    name: '饮品',
    category: 'type',
    color: 'lavender',
    itemCount: 20,
    description: '饮料、茶和咖啡',
    createdAt: '2024-12-17T00:00:00Z',
    updatedAt: '2024-12-17T00:00:00Z',
    sortOrder: 9,
  },
  {
    id: 11,
    name: '文具',
    category: 'type',
    color: 'cream',
    itemCount: 16,
    description: '笔、本子和办公用品',
    createdAt: '2024-12-16T00:00:00Z',
    updatedAt: '2024-12-16T00:00:00Z',
    sortOrder: 10,
  },
  {
    id: 12,
    name: '数码',
    category: 'type',
    color: 'pink',
    itemCount: 8,
    description: '电子产品和配件',
    createdAt: '2024-12-15T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    sortOrder: 11,
  },
  {
    id: 13,
    name: '化妆品',
    category: 'type',
    color: 'coral',
    itemCount: 22,
    description: '护肤品和彩妆',
    createdAt: '2024-12-14T00:00:00Z',
    updatedAt: '2024-12-14T00:00:00Z',
    sortOrder: 12,
  },
  {
    id: 14,
    name: '书籍',
    category: 'type',
    color: 'lavender',
    itemCount: 45,
    description: '各类书籍和杂志',
    createdAt: '2024-12-13T00:00:00Z',
    updatedAt: '2024-12-13T00:00:00Z',
    sortOrder: 13,
  },
  {
    id: 15,
    name: '待办事项',
    category: 'functional',
    color: 'coral',
    itemCount: 12,
    description: '记录需要完成的任务',
    createdAt: '2024-12-12T00:00:00Z',
    updatedAt: '2024-12-12T00:00:00Z',
    sortOrder: 14,
  },
  {
    id: 16,
    name: '购物清单',
    category: 'functional',
    color: 'lemon',
    itemCount: 28,
    description: '需要购买的物品列表',
    createdAt: '2024-12-11T00:00:00Z',
    updatedAt: '2024-12-11T00:00:00Z',
    sortOrder: 15,
  },
  {
    id: 17,
    name: '备忘录',
    category: 'functional',
    color: 'lavender',
    itemCount: 8,
    description: '记录重要的提醒信息',
    createdAt: '2024-12-10T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z',
    sortOrder: 16,
  },
  {
    id: 18,
    name: '生日提醒',
    category: 'functional',
    color: 'honey',
    itemCount: 15,
    description: '亲友的生日和纪念日',
    createdAt: '2024-12-09T00:00:00Z',
    updatedAt: '2024-12-09T00:00:00Z',
    sortOrder: 17,
  },
  {
    id: 19,
    name: '常用地址',
    category: 'functional',
    color: 'cream',
    itemCount: 6,
    description: '记录常用的家庭地址',
    createdAt: '2024-12-08T00:00:00Z',
    updatedAt: '2024-12-08T00:00:00Z',
    sortOrder: 18,
  },
  {
    id: 20,
    name: '保修信息',
    category: 'functional',
    color: 'pink',
    itemCount: 10,
    description: '家电和产品的保修期记录',
    createdAt: '2024-12-07T00:00:00Z',
    updatedAt: '2024-12-07T00:00:00Z',
    sortOrder: 19,
  },
]

const mockCategories: CategoryInfo[] = [
  { id: 'room', name: '房间', icon: 'home', description: '家中的各个房间区域' },
  { id: 'type', name: '类型', icon: 'tag', description: '物品的分类和类型' },
  { id: 'functional', name: '功能', icon: 'grid', description: '功能性的分类标签' },
]

// 初始化预置用户
function initMockUsers() {
  // 测试用户
  users.set('test', {
    id: 1,
    email: 'test@example.com',
    password: '123456',
  })
}

// 初始化用户数据
initMockUsers()

// 模拟 token 生成
function generateTokens(): { accessToken: string; refreshToken: string } {
  return {
    accessToken: `mock_access_token_${Date.now()}`,
    refreshToken: `mock_refresh_token_${Date.now()}`,
  }
}

export const handlers = [
  // 登录接口
  http.post('/api/auth/signin', async ({ request }) => {
    const body = (await request.json()) as AuthForm

    const user = Array.from(users.values()).find(
      u => u.email === body.email && u.password === body.password
    )

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

  // 刷新 token 接口
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

  // 标签相关接口
  http.get('/api/tags', async () => {
    await delay(200)
    return HttpResponse.json({
      code: 200,
      message: '获取标签成功',
      data: mockTags,
    })
  }),

  http.get('/api/tags/categories', async () => {
    await delay(100)
    return HttpResponse.json({
      code: 200,
      message: '获取分类成功',
      data: mockCategories,
    })
  }),

  http.post('/api/tags', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as TagFormData
    const newTag: Tag = {
      id: Date.now(),
      ...body,
      itemCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockTags.push(newTag)
    return HttpResponse.json({
      code: 200,
      message: '创建标签成功',
      data: newTag,
    })
  }),

  http.patch('/api/tags/:id', async ({ params, request }) => {
    await delay(200)
    const id = Number(params.id)
    const body = (await request.json()) as Partial<TagFormData>
    const index = mockTags.findIndex(t => t.id === id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, message: '标签不存在' }, { status: 404 })
    }
    mockTags[index] = { ...mockTags[index], ...body, updatedAt: new Date().toISOString() }
    return HttpResponse.json({
      code: 200,
      message: '更新标签成功',
      data: mockTags[index],
    })
  }),

  http.delete('/api/tags/:id', async ({ params }) => {
    await delay(200)
    const id = Number(params.id)
    const index = mockTags.findIndex(t => t.id === id)
    if (index === -1) {
      return HttpResponse.json({ code: 404, message: '标签不存在' }, { status: 404 })
    }
    mockTags.splice(index, 1)
    return HttpResponse.json({
      code: 200,
      message: '删除标签成功',
    })
  }),

  http.post('/api/tags/reorder', async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as ReorderRequest
    const activeIndex = mockTags.findIndex(t => t.id === body.fromId)
    const overIndex = mockTags.findIndex(t => t.id === body.toId)
    if (activeIndex === -1 || overIndex === -1) {
      return HttpResponse.json({ code: 404, message: '标签不存在' }, { status: 404 })
    }

    const activeTag = mockTags[activeIndex]
    const overTag = mockTags[overIndex]
    if (!activeTag || !overTag) {
      return HttpResponse.json({ code: 404, message: '标签不存在' }, { status: 404 })
    }

    const isSameCategory = activeTag.category === overTag.category
    const newTag = { ...activeTag, category: overTag.category }

    if (isSameCategory) {
      mockTags.splice(activeIndex, 1)
      mockTags.splice(overIndex, 0, newTag)
    } else {
      mockTags[activeIndex] = newTag
    }

    return HttpResponse.json({
      code: 200,
      message: '重新排序成功',
    })
  }),

  // 仪表板数据接口
  http.get('/api/dashboard', async () => {
    // 模拟数据库延迟
    await delay(200)

    // 返回模拟数据
    return HttpResponse.json({
      code: 200,
      message: '获取仪表板数据成功',
      data: {
        overview: {
          totalItems: 156,
          totalSpaces: 12,
          utilizationRate: 68,
          expiredItems: 3,
          borrowedItems: 8,
          lowStockItems: 5,
        },
        recentActivities: [
          {
            id: '1',
            type: 'item-add',
            action: '添加了新物品',
            itemName: '冬季围巾',
            timestamp: '2025-12-18T10:30:00Z',
          },
          {
            id: '2',
            type: 'item-move',
            action: '移动了物品',
            itemName: '咖啡杯',
            timestamp: '2025-12-18T09:15:00Z',
          },
          {
            id: '3',
            type: 'item-move',
            action: '转移了物品',
            itemName: '书籍集合',
            timestamp: '2025-12-17T20:45:00Z',
          },
          {
            id: '4',
            type: 'item-update',
            action: '更新了物品信息',
            itemName: '季节性衣物',
            timestamp: '2025-12-17T16:20:00Z',
          },
          {
            id: '5',
            type: 'item-move',
            action: '借出了物品',
            itemName: '蓝牙耳机',
            timestamp: '2025-12-16T14:00:00Z',
          },
          {
            id: '6',
            type: 'room-add',
            action: '添加了新房间',
            itemName: '儿童房',
            timestamp: '2025-12-15T11:30:00Z',
          },
          {
            id: '7',
            type: 'storage-add',
            action: '添加了收纳空间',
            itemName: '主卧衣柜',
            timestamp: '2025-12-14T09:45:00Z',
          },
        ],
        reminders: [
          {
            id: '1',
            type: '过期提醒',
            itemName: '牛奶',
            dueDate: '2025-12-15T00:00:00Z',
            urgency: 'high',
            description: '牛奶已经过期，需要及时处理',
          },
          {
            id: '2',
            type: '低库存提醒',
            itemName: '纸巾',
            dueDate: '2025-12-25T00:00:00Z',
            urgency: 'medium',
            description: '纸巾库存不足，建议补充',
          },
          {
            id: '3',
            type: '借出归还',
            itemName: '蓝牙耳机',
            dueDate: '2025-12-20T00:00:00Z',
            urgency: 'medium',
            description: '借出的耳机即将到期，需要提醒归还',
          },
          {
            id: '4',
            type: '季节性整理',
            itemName: '夏季衣物',
            dueDate: null,
            urgency: 'low',
            description: '可以考虑将夏季衣物收纳起来，为冬季腾出空间',
          },
        ],
      },
    })
  }),
]
