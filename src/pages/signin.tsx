import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined } from "@ant-design/icons"
import { Button, Checkbox, Form, Input, Typography } from "antd"
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
  const setTokens = useUserStore(state => state.setTokens)
  const setUserInfo = useUserStore(state => state.setUserInfo)

  const onFinish = async (values: SignInForm) => {
    setLoading(true)
    try {
      const response = await signIn(values)

      // 保存token
      setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })

      // 设置用户信息
      setUserInfo({
        id: 1,
        username: values.email.split("@")[0],
        role: "user",
      })

      toast.success("登录成功，欢迎回家！")

      // 立即跳转
      navigate("/dashboard")
    } catch (error: unknown) {
      const errorMessage = (error as any).response?.data?.message || "登录失败，请检查邮箱和密码"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: warmTheme.colors.bgPrimary,
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(201, 168, 124, 0.05) 0%, transparent 50%)`,
      }}
    >
      {/* 背景装饰 */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 48%, rgba(201, 168, 124, 0.1) 49%, rgba(201, 168, 124, 0.1) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(201, 168, 124, 0.1) 49%, rgba(201, 168, 124, 0.1) 51%, transparent 52%)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 登录卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-[480px] max-w-[90vw]"
      >
        <div
          className="rounded-2xl p-12 shadow-xl"
          style={{
            backgroundColor: warmTheme.colors.bgSecondary,
            boxShadow:
              "0 20px 25px -5px rgba(151, 145, 137, 0.1), 0 10px 10px -5px rgba(151, 145, 137, 0.04)",
            border: `1px solid ${warmTheme.colors.border}`,
          }}
        >
          {/* Logo 和标题 */}
          <div className="text-center space-y-6 mb-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: warmTheme.colors.bgTertiary,
                boxShadow: warmTheme.shadows.small,
              }}
            >
              <LockOutlined
                style={{
                  fontSize: 32,
                  color: warmTheme.colors.primary,
                }}
              />
            </motion.div>

            <div>
              <Title
                level={2}
                className="mb-3"
                style={{
                  color: warmTheme.colors.textPrimary,
                  fontWeight: warmTheme.typography.fontWeight.medium,
                  fontSize: "28px",
                }}
              >
                欢迎回来
              </Title>
              <Text
                style={{
                  color: warmTheme.colors.textSecondary,
                  fontSize: warmTheme.typography.fontSize.base,
                }}
              >
                登录您的智能家居管理账户
              </Text>
            </div>
          </div>

          {/* 登录表单 */}
          <Form
            name="signin"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            className="space-y-6"
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
                  padding: "16px 20px",
                  fontSize: warmTheme.typography.fontSize.base,
                  height: "56px",
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
                  padding: "16px 20px",
                  fontSize: warmTheme.typography.fontSize.base,
                  height: "56px",
                }}
              />
            </Form.Item>

            <div className="flex items-center justify-between">
              <Checkbox
                style={{
                  color: warmTheme.colors.textSecondary,
                  fontSize: warmTheme.typography.fontSize.sm,
                }}
              >
                记住我
              </Checkbox>
              <Link
                to="/forgot-password"
                style={{
                  color: warmTheme.colors.primary,
                  fontSize: warmTheme.typography.fontSize.sm,
                }}
              >
                忘记密码？
              </Link>
            </div>

            <Form.Item className="mb-0">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: 56,
                    borderRadius: warmTheme.borderRadius.small,
                    backgroundColor: warmTheme.colors.primary,
                    borderColor: warmTheme.colors.primary,
                    fontWeight: warmTheme.typography.fontWeight.medium,
                    fontSize: warmTheme.typography.fontSize.base,
                    boxShadow: warmTheme.shadows.small,
                  }}
                >
                  {loading ? "登录中..." : "登录"}
                </Button>
              </motion.div>
            </Form.Item>
          </Form>

          {/* 注册链接 */}
          <div className="text-center mt-8 pt-6 border-t border-[#E8E6E3]">
            <Text
              style={{
                color: warmTheme.colors.textSecondary,
                fontSize: warmTheme.typography.fontSize.sm,
              }}
            >
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
