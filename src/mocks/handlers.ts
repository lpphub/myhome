import { HttpResponse, http } from 'msw'
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
      (u) => u.email === body.email && u.password === body.password
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
    await new Promise((resolve) => setTimeout(resolve, 300))

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
            type: '入库',
            itemName: '冬季围巾',
            quantity: 2,
            timestamp: '2025-12-18T10:30:00Z',
            operator: '小美',
            status: '已完成',
            fromSpace: null,
            toSpace: '衣柜上层',
          },
          {
            id: '2',
            type: '出库',
            itemName: '咖啡杯',
            quantity: 1,
            timestamp: '2025-12-18T09:15:00Z',
            operator: '小明',
            status: '已完成',
            fromSpace: '厨房橱柜',
            toSpace: null,
          },
          {
            id: '3',
            type: '转移',
            itemName: '书籍集合',
            quantity: 5,
            timestamp: '2025-12-17T20:45:00Z',
            operator: '小美',
            status: '已完成',
            fromSpace: '书桌',
            toSpace: '书房书架',
          },
          {
            id: '4',
            type: '盘点',
            itemName: '季节性衣物',
            quantity: 15,
            timestamp: '2025-12-17T16:20:00Z',
            operator: '小明',
            status: '进行中',
            fromSpace: '储物间',
            toSpace: null,
          },
          {
            id: '5',
            type: '借出',
            itemName: '蓝牙耳机',
            quantity: 1,
            timestamp: '2025-12-16T14:00:00Z',
            operator: '小美',
            status: '已完成',
            borrower: '朋友小张',
            fromSpace: '床头柜',
            toSpace: null,
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
        quickActions: [
          {
            id: '1',
            title: '添加新物品',
            description: '记录新收纳的物品信息',
            icon: 'Plus',
            action: 'add-item',
          },
          {
            id: '2',
            title: '查找物品',
            description: '快速搜索想要的物品',
            icon: 'Search',
            action: 'search-item',
          },
          {
            id: '3',
            title: '空间管理',
            description: '查看和管理收纳空间',
            icon: 'Archive',
            action: 'manage-spaces',
          },
          {
            id: '4',
            title: '批量盘点',
            description: '对指定区域进行批量盘点',
            icon: 'Package',
            action: 'inventory-check',
          },
        ],
      },
    })
  }),
]
