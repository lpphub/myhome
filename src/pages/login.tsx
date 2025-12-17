import { Eye, EyeOff, Heart, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { signIn } from "@/api/auth"
import Button from "@/components/primitives/Button"
import Card from "@/components/primitives/Card"
import { useAuth } from "@/hooks/useAuth"

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  email?: string
  password?: string
  general?: string
}

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 已登录重定向逻辑
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true })
    }
  }, [isAuthenticated, navigate])

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = "请输入邮箱地址"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "请输入有效的邮箱地址"
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = "请输入密码"
    } else if (formData.password.length < 6) {
      newErrors.password = "密码长度至少为6位"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 输入处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // 清除对应字段错误
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  // 提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const res = await signIn({
        email: formData.email,
        password: formData.password,
      })
      if (res) {
        login({
          user: {
            id: 1,
            name: formData.email.split("@")[0],
          },
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        })

        toast.success("登录成功！")
        navigate("/dashboard")
      } else {
        setErrors({ general: "邮箱或密码错误，请重试" })
      }
    } catch (_error) {
      toast.error("登录失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-cream-50 to-white flex items-center justify-center p-4">
      {/* 背景装饰元素 */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-honey-100 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div
        className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-coral-100 rounded-full filter blur-3xl opacity-40 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* 登录卡片 */}
      <Card variant="glass" className="w-full max-w-md p-6 md:p-8 z-10">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-8 h-8 text-coral-500 mr-2" />
            <h1 className="text-2xl font-bold text-honey-700">收纳小助手</h1>
          </div>
          <p className="text-warmGray-500">欢迎回家</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 通用错误信息 */}
          {errors.general && (
            <div className="bg-coral-50 border border-coral-200 text-coral-700 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {/* 邮箱输入 */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-warmGray-700">
              邮箱地址
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white/80 focus:border-honey-400 focus:ring-2 focus:ring-honey-200 transition-all"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <p className="text-coral-500 text-sm">{errors.email}</p>}
          </div>

          {/* 密码输入 */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-warmGray-700">
              密码
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl border border-cream-200 bg-white/80 focus:border-honey-400 focus:ring-2 focus:ring-honey-200 transition-all pr-10"
                placeholder="请输入密码"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warmGray-500 hover:text-honey-500 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-coral-500 text-sm">{errors.password}</p>}
          </div>

          {/* 记住我 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
                className="h-4 w-4 rounded border-cream-300 text-honey-500 focus:ring-honey-300"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-warmGray-600">
                记住我
              </label>
            </div>
            <a
              href="/forgot-password"
              className="text-sm font-medium text-honey-600 hover:text-honey-700 transition-colors"
            >
              忘记密码?
            </a>
          </div>

          {/* 登录按钮 */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
            loading={isLoading}
            decorative={true}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                登录中...
              </>
            ) : (
              "登录"
            )}
          </Button>
        </form>

        {/* 注册链接 */}
        <div className="mt-6 text-center text-sm text-warmGray-600">
          还没有账号？{" "}
          <a
            href="/register"
            className="font-medium text-honey-600 hover:text-honey-700 transition-colors"
          >
            立即注册
          </a>
        </div>

        {/* 装饰元素 */}
        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-lavender-100 rounded-full opacity-60 blur-md"></div>
        <div className="absolute -top-3 -left-3 w-12 h-12 bg-coral-100 rounded-full opacity-60 blur-md"></div>
      </Card>

      {/* 底部文字 */}
      <div className="absolute bottom-4 text-center text-warmGray-400 text-xs">
        让收纳变得简单 ✨
      </div>
    </div>
  )
}
