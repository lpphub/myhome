import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons"
import { Checkbox, Form, Input } from "antd"
import { motion } from "motion/react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { logger } from "@/utils/logger"
import { AuthForm } from "./components/AuthForm"
import { AuthLayout } from "./components/AuthLayout"
import type { SignUpForm } from "./types"

// Type guard to validate form values
function isSignUpForm(values: Record<string, unknown>): values is SignUpForm {
  return (
    typeof values === "object" &&
    values !== null &&
    "name" in values &&
    "email" in values &&
    "password" in values &&
    "confirmPassword" in values &&
    typeof values.name === "string" &&
    typeof values.email === "string" &&
    typeof values.password === "string" &&
    typeof values.confirmPassword === "string"
  )
}

export function SignUp() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (values: Record<string, unknown>) => {
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    logger.debug("Sign up values:", values)

    // Validate form values
    if (!isSignUpForm(values)) {
      throw new Error("表单数据格式错误")
    }

    // Mock successful registration
    if (values.password === values.confirmPassword) {
      // Mock successful registration
      alert("注册成功！请登录")
      navigate("/signin")
    } else {
      throw new Error("两次输入的密码不一致")
    }

    setLoading(false)
  }

  return (
    <AuthLayout
      title="创建账号"
      subtitle="加入智能家居管理平台"
      showBackButton
      onBackClick={() => navigate("/signin")}
    >
      <AuthForm
        title="注册"
        onSubmit={handleSignUp}
        submitText="注册"
        loading={loading}
        footerText={
          <>
            已有账号？ <Link to="/signin">立即登录</Link>
          </>
        }
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Form.Item
            label="姓名"
            name="name"
            rules={[
              { required: true, message: "请输入您的姓名" },
              { min: 2, message: "姓名至少2个字符" },
            ]}
          >
            <Input
              placeholder="请输入您的姓名"
              size="large"
              prefix={<span style={{ marginRight: 8 }}>👤</span>}
            />
          </Form.Item>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
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

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少6位字符" },
            ]}
          >
            <Input.Password
              placeholder="请输入密码（至少6位）"
              size="large"
              prefix={<span style={{ marginRight: 8 }}>🔒</span>}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"))
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="请再次输入密码"
              size="large"
              prefix={<span style={{ marginRight: 8 }}>🔒</span>}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Form.Item
            name="agreeTerms"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(new Error("请同意服务条款")),
              },
            ]}
          >
            <Checkbox>
              我已阅读并同意 <Link to="#">服务条款</Link> 和 <Link to="#">隐私政策</Link>
            </Checkbox>
          </Form.Item>
        </motion.div>
      </AuthForm>
    </AuthLayout>
  )
}
