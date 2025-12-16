import { HttpResponse, http } from "msw"
import type { SignInForm, Token } from "@/api/auth/types"

// 模拟用户数据存储
const users = new Map<string, { email: string; password: string; id: string }>()

// 初始化预置用户
function initMockUsers() {
  // 测试用户
  users.set("test", {
    id: "1",
    email: "test@example.com",
    password: "123456",
  })

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
        ...tokens,
        user: {
          id: user.id,
          email: user.email,
        },
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
]
