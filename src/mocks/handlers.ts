import { delay, HttpResponse, http } from 'msw'
import type { AuthForm } from '@/api/auth'

// 模拟用户数据存储
const users = new Map<string, { email: string; password: string; id: number }>()

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
