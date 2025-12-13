import { Button, Form } from "antd"
import { motion } from "motion/react"
import { type ReactNode, useState } from "react"

interface AuthFormProps<T = Record<string, unknown>> {
  title: string
  onSubmit: (values: T) => void | Promise<void>
  children: ReactNode
  submitText?: string
  loading?: boolean
  footerText?: ReactNode
  disabled?: boolean
}

export function AuthForm({
  title,
  onSubmit,
  children,
  submitText = "提交",
  loading = false,
  footerText,
  disabled = false,
}: AuthFormProps) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const handleFinish = async (values: Record<string, unknown>) => {
    setSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="[&_.ant-form-item]:mb-6 [&_.ant-input]:rounded-[10px] [&_.ant-input-password]:rounded-[10px]
             [&_.ant-input]:p-3.5 [&_.ant-input-password]:p-3.5 [&_.ant-input]:text-[15px]
             [&_.ant-input]:border border-[#e1e8ed] [&_.ant-input]:transition-all duration-300
             [&_.ant-input]:hover:[&:focus]:[&:focus-within]:border-[#667eea]
             [&_.ant-input]:hover:[&:focus]:[&:focus-within]:shadow-[0_0_0_2px_rgba(102_126_234_0.1)]"
    >
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h2 className="text-center mb-8 text-2xl font-semibold text-[#2c3e50]">{title}</h2>
      </motion.div>

      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        autoComplete="off"
        disabled={disabled}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading || submitting}
              block
              className="[&_.ant-btn]:rounded-[10px] h-11 text-base font-medium
                     transition-all duration-300
                     [&_.ant-btn-primary]:bg-gradient-to-r from-[#667eea] to-[#764ba2] [&_.ant-btn-primary]:border-0
                     [&_.ant-btn-primary]:hover:translate-y-[-2px] [&_.ant-btn-primary]:shadow-[0_5px_15px_rgba(102_126_234_0.3)]"
            >
              {submitText}
            </Button>
          </Form.Item>
        </motion.div>
      </Form>

      {footerText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="mt-6 text-center text-sm text-gray-600">
            <button
              type="button"
              className="text-[#667eea] no-underline font-medium transition-colors duration-300 hover:text-[#764ba2] cursor-pointer bg-transparent border-none p-0"
            >
              {footerText}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
