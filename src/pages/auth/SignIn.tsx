import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"
import { Checkbox, Form, Input } from "antd"
import { motion } from "motion/react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { STORAGE_KEYS } from "@/constants"
import { animations, createDelayedAnimation } from "@/constants/animations"
import { logger } from "@/utils/logger"
import { AuthForm } from "./components/AuthForm"
import { AuthLayout } from "./components/AuthLayout"
import type { SignInForm } from "./types"

// Type guard to validate form values
function isSignInForm(values: Record<string, unknown>): values is SignInForm {
  return (
    typeof values === "object" &&
    values !== null &&
    "email" in values &&
    "password" in values &&
    typeof values.email === "string" &&
    typeof values.password === "string"
  )
}

export function SignIn() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignIn = async (values: Record<string, unknown>) => {
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    logger.debug("Sign in values:", values)

    // Validate form values
    if (!isSignInForm(values)) {
      throw new Error("表单数据格式错误")
    }

    // Mock authentication - in real app, this would validate with backend
    if (values.email === "admin@example.com" && values.password === "password") {
      // Mock successful login
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true")
      navigate("/dashboard")
    } else {
      // Mock error
      throw new Error("邮箱或密码错误")
    }

    setLoading(false)
  }

  return (
    <AuthLayout title="欢迎回来" subtitle="登录您的智能家居管理中心">
      <AuthForm
        title="登录"
        onSubmit={handleSignIn}
        submitText="登录"
        loading={loading}
        footerText={
          <>
            还没有账号？ <Link to="/signup">立即注册</Link>
          </>
        }
      >
        <motion.div {...animations.slideInLeft}>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input
              placeholder="请输入您的邮箱"
              size="large"
              prefix={<span style={{ marginRight: 8 }}>📧</span>}
            />
          </Form.Item>
        </motion.div>

        <motion.div {...createDelayedAnimation(animations.slideInLeft, 0.3)}>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少6位字符" },
            ]}
          >
            <Input.Password
              placeholder="请输入您的密码"
              size="large"
              prefix={<span style={{ marginRight: 8 }}>🔒</span>}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
        </motion.div>

        <motion.div {...createDelayedAnimation(animations.fadeIn, 0.4)}>
          <Form.Item>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link
                to="#"
                style={{ color: "#667eea", fontSize: 14 }}
                onClick={e => {
                  e.preventDefault()
                  alert("忘记密码功能暂未实现")
                }}
              >
                忘记密码？
              </Link>
            </div>
          </Form.Item>
        </motion.div>
      </AuthForm>
    </AuthLayout>
  )
}
