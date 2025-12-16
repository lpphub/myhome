import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { signIn } from "@/api/auth"
import { useAuth } from "@/hooks/useAuth"

interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export default function Login() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "test@example.com",
      password: "123456",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await signIn({
        email: data.email,
        password: data.password,
      })

      if (response) {
        console.log(response)
        login({
          user: {
            id: 1,
            name: data.email.split("@")[0],
          },
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        })

        toast.success("登录成功！")
        navigate("/dashboard")
      }
    } catch (_error) {
      toast.error("登录失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex-center bg-[#faf9f7]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-[#3d3d3d] mb-2">欢迎回来</h1>
            <p className="text-gray-500 text-sm">请登录您的账户</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                {...register("email", {
                  required: "请输入邮箱地址",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "请输入有效的邮箱地址",
                  },
                })}
                type="email"
                id="email"
                autoComplete="email"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  errors.email
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#c9a87c] focus:border-[#c9a87c]"
                }`}
                placeholder="请输入邮箱地址"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                {...register("password", {
                  required: "请输入密码",
                  minLength: {
                    value: 6,
                    message: "密码至少需要6个字符",
                  },
                })}
                type="password"
                id="password"
                autoComplete="current-password"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  errors.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#c9a87c] focus:border-[#c9a87c]"
                }`}
                placeholder="请输入密码"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  {...register("rememberMe")}
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-[#c9a87c] focus:ring-[#c9a87c] border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  记住我
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-[#c9a87c] hover:text-[#b89668] transition-colors"
              >
                忘记密码？
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c9a87c] hover:bg-[#b89668] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#c9a87c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "登录中..." : "登录"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">测试账号：test@example.com / 123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}
