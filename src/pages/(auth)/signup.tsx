import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Button, Checkbox, Form, Input, Progress, Typography, message as antMessage } from "antd"
import { EyeInvisibleOutlined, EyeTwoTone, LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons"
import { motion } from "motion/react"
import { toast } from "sonner"
import { useUserStore } from "@/stores/userStore"
import { signIn, signUp } from "@/api/auth"
import type { SignInForm, SignUpForm } from "@/api/auth/types"
import { warmTheme } from "@/styles/theme"

const { Title, Text } = Typography

// 密码强度检测
function checkPasswordStrength(password: string): number {
  if (!password) return 0

  let strength = 0
  if (password.length >= 8) strength += 25
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
  if (/\d/.test(password)) strength += 25
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25

  return strength
}

function getStrengthColor(strength: number): string {
  if (strength <= 25) return warmTheme.colors.error
  if (strength <= 50) return warmTheme.colors.warning
  if (strength <= 75) return warmTheme.colors.info
  return warmTheme.colors.success
}

function getStrengthText(strength: number): string {
  if (strength <= 25) return '弱'
  if (strength <= 50) return '一般'
  if (strength <= 75) return '强'
  return '很强'
}

export function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const navigate = useNavigate()
  const setUser = useUserStore((state) => state.setUser)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setPasswordStrength(checkPasswordStrength(password))
  }

  const onFinish = async (values: SignUpForm & { confirmPassword: string }) => {
    if (values.password !== values.confirmPassword) {
      toast.error('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      // 注册用户
      await signUp({
        email: values.email,
        password: values.password,
      })

      toast.success('注册成功！正在为您登录...')

      // 自动登录
      setTimeout(async () => {
        try {
          const loginResponse = await signIn({
            email: values.email,
            password: values.password,
          })

          // 保存用户信息和 token
          setUser(loginResponse.data.user, {
            accessToken: loginResponse.data.accessToken,
            refreshToken: loginResponse.data.refreshToken,
          })

          navigate('/dashboard')
        } catch (error) {
          toast.error('自动登录失败，请手动登录')
          navigate('/signin')
        }
      }, 1500)
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || '注册失败，请稍后再试'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
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
            boxShadow: warmTheme.shadows.large
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
              <UserOutlined style={{ fontSize: 28, color: warmTheme.colors.primary }} />
            </motion.div>
            <Title level={2} style={{ color: warmTheme.colors.textPrimary, marginBottom: 8 }}>
              创建账户
            </Title>
            <Text style={{ color: warmTheme.colors.textSecondary }}>
              加入智能家居，享受便捷生活
            </Text>
          </div>

          {/* 注册表单 */}
          <Form
            name="signup"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            className="space-y-4"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: warmTheme.colors.textTertiary }} />}
                placeholder="邮箱地址"
                style={{
                  borderRadius: warmTheme.borderRadius.small,
                  border: `1px solid ${warmTheme.colors.border}`,
                  padding: '12px 16px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码至少需要8个字符' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: warmTheme.colors.textTertiary }} />}
                placeholder="密码（至少8个字符）"
                onChange={handlePasswordChange}
                iconRender={(visible) =>
                  visible ?
                    <EyeTwoTone style={{ color: warmTheme.colors.primary }} /> :
                    <EyeInvisibleOutlined style={{ color: warmTheme.colors.textTertiary }} />
                }
                style={{
                  borderRadius: warmTheme.borderRadius.small,
                  border: `1px solid ${warmTheme.colors.border}`,
                  padding: '12px 16px',
                }}
              />
            </Form.Item>

            {/* 密码强度指示器 */}
            {passwordStrength > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <Progress
                  percent={passwordStrength}
                  showInfo={false}
                  strokeColor={getStrengthColor(passwordStrength)}
                  size="small"
                />
                <Text
                  style={{
                    fontSize: '12px',
                    color: getStrengthColor(passwordStrength)
                  }}
                >
                  密码强度：{getStrengthText(passwordStrength)}
                </Text>
              </motion.div>
            )}

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: warmTheme.colors.textTertiary }} />}
                placeholder="确认密码"
                iconRender={(visible) =>
                  visible ?
                    <EyeTwoTone style={{ color: warmTheme.colors.primary }} /> :
                    <EyeInvisibleOutlined style={{ color: warmTheme.colors.textTertiary }} />
                }
                style={{
                  borderRadius: warmTheme.borderRadius.small,
                  border: `1px solid ${warmTheme.colors.border}`,
                  padding: '12px 16px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('请同意服务条款')),
                },
              ]}
            >
              <Checkbox style={{ color: warmTheme.colors.textSecondary }}>
                我已阅读并同意{' '}
                <Link to="/terms" style={{ color: warmTheme.colors.primary }}>
                  服务条款
                </Link>
                {' '}和{' '}
                <Link to="/privacy" style={{ color: warmTheme.colors.primary }}>
                  隐私政策
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
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
                  {loading ? '注册中...' : '创建账户'}
                </Button>
              </motion.div>
            </Form.Item>
          </Form>

          {/* 登录链接 */}
          <div className="text-center">
            <Text style={{ color: warmTheme.colors.textSecondary }}>
              已有账户？{' '}
              <Link
                to="/signin"
                style={{
                  color: warmTheme.colors.primary,
                  fontWeight: warmTheme.typography.fontWeight.medium
                }}
              >
                立即登录
              </Link>
            </Text>
          </div>
        </div>
      </motion.div>
    </div>
  )
}