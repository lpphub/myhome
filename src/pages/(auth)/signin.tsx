import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined } from "@ant-design/icons"
import { Button, Checkbox, Form, Input, message, Typography } from "antd"
import { motion } from "motion/react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { signIn } from "@/api/auth"
import type { SignInForm } from "@/api/auth/types"
import { useUserStore } from "@/stores/userStore"
import { warmTheme } from "@/styles/theme"

const { Title, Text } = Typography

export function SigninPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setUser = useUserStore(state => state.setUser)

  const onFinish = async (values: SignInForm) => {
    setLoading(true)
    try {
      const response = await signIn(values)

      // 保存用户信息和 token
      setUser(response.data.user, {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      })

      toast.success("登录成功，欢迎回家！")

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        navigate("/dashboard")
      }, 1000)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "登录失败，请检查邮箱和密码"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: warmTheme.colors.bgPrimary }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div
          className="rounded-xl p-8 space-y-6"
          style={{
            backgroundColor: warmTheme.colors.bgSecondary,
            boxShadow: warmTheme.shadows.large,
          }}
        >
          {/* Logo 和标题 */}
          <div className="text-center space-y-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: warmTheme.colors.bgTertiary }}
            >
              <LockOutlined style={{ fontSize: 28, color: warmTheme.colors.primary }} />
            </motion.div>
            <Title level={2} style={{ color: warmTheme.colors.textPrimary, marginBottom: 8 }}>
              欢迎回来
            </Title>
            <Text style={{ color: warmTheme.colors.textSecondary }}>请登录您的智能家居账户</Text>
          </div>

          {/* 登录表单 */}
          <Form
            name="signin"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            className="space-y-4"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "请输入邮箱地址" },
                { type: "email", message: "请输入有效的邮箱地址" },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: warmTheme.colors.textTertiary }} />}
                placeholder="邮箱地址"
                style={{
                  borderRadius: warmTheme.borderRadius.small,
                  border: `1px solid ${warmTheme.colors.border}`,
                  padding: "12px 16px",
                }}
              />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: warmTheme.colors.textTertiary }} />}
                placeholder="密码"
                iconRender={visible =>
                  visible ? (
                    <EyeTwoTone style={{ color: warmTheme.colors.primary }} />
                  ) : (
                    <EyeInvisibleOutlined style={{ color: warmTheme.colors.textTertiary }} />
                  )
                }
                style={{
                  borderRadius: warmTheme.borderRadius.small,
                  border: `1px solid ${warmTheme.colors.border}`,
                  padding: "12px 16px",
                }}
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <Checkbox style={{ color: warmTheme.colors.textSecondary }}>记住我</Checkbox>
              <Link to="/forgot-password" style={{ color: warmTheme.colors.primary }}>
                忘记密码？
              </Link>
            </div>

            <Form.Item>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: 48,
                    borderRadius: warmTheme.borderRadius.small,
                    backgroundColor: warmTheme.colors.primary,
                    borderColor: warmTheme.colors.primary,
                    fontWeight: warmTheme.typography.fontWeight.medium,
                    fontSize: warmTheme.typography.fontSize.base,
                  }}
                >
                  {loading ? "登录中..." : "登录"}
                </Button>
              </motion.div>
            </Form.Item>
          </Form>

          {/* 注册链接 */}
          <div className="text-center">
            <Text style={{ color: warmTheme.colors.textSecondary }}>
              还没有账户？{" "}
              <Link
                to="/signup"
                style={{
                  color: warmTheme.colors.primary,
                  fontWeight: warmTheme.typography.fontWeight.medium,
                }}
              >
                立即注册
              </Link>
            </Text>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
