import { HttpResponse, http } from "msw"
import type { SignInForm, SignUpForm, Token } from "@/api/auth/types"

// 模拟用户数据存储
const users = new Map<string, { email: string; password: string; id: string }>()
let userIdCounter = 1

// 初始化预置用户
function initMockUsers() {
  // 测试用户1
  users.set("user1", {
    id: "1",
    email: "user1@example.com",
    password: "123456",
  })

  // 测试用户2
  users.set("user2", {
    id: "2",
    email: "user2@example.com",
    password: "123456",
  })

  userIdCounter = 3
}

// 初始化用户数据
initMockUsers()

// 模拟 token 生成
function generateTokens(): Token {
  return {
    accessToken: `mock_access_token_${Date.now()}`,
    refreshToken: `mock_refresh_token_${Date.now()}`,
  }
}

export const handlers = [
  // 登录接口
  http.post("/api/auth/signin", async ({ request }) => {
    const body = (await request.json()) as SignInForm

    const user = Array.from(users.values()).find(
      u => u.email === body.email && u.password === body.password
    )

    if (!user) {
      return HttpResponse.json({ code: 401, message: "邮箱或密码错误" }, { status: 401 })
    }

    const tokens = generateTokens()

    return HttpResponse.json({
      code: 200,
      message: "登录成功",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        ...tokens,
      },
    })
  }),

  // 注册接口
  http.post("/api/auth/signup", async ({ request }) => {
    const body = (await request.json()) as SignUpForm

    // 检查邮箱是否已存在
    const existingUser = Array.from(users.values()).find(u => u.email === body.email)

    if (existingUser) {
      return HttpResponse.json({ code: 400, message: "邮箱已被注册" }, { status: 400 })
    }

    // 创建新用户
    const newUser = {
      id: String(userIdCounter++),
      email: body.email,
      password: body.password,
    }

    users.set(newUser.email, newUser)

    const tokens = generateTokens()

    return HttpResponse.json({
      code: 200,
      message: "注册成功",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
        },
        ...tokens,
      },
    })
  }),

  // 刷新 token 接口
  http.post("/api/auth/refresh", async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string }

    if (!body.refreshToken || !body.refreshToken.startsWith("mock_refresh_token")) {
      return HttpResponse.json({ code: 401, message: "无效的刷新令牌" }, { status: 401 })
    }

    const tokens = generateTokens()

    return HttpResponse.json({
      code: 200,
      message: "令牌刷新成功",
      data: tokens,
    })
  }),

  // 登出接口
  http.post("/api/auth/logout", async () => {
    return HttpResponse.json({
      code: 200,
      message: "登出成功",
      data: null,
    })
  }),
]
