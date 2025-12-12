import { Button, Result } from "antd"
import { motion } from "motion/react"
import { useNavigate } from "react-router"

export function NotFound() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate("/")
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="[&_.ant-result-title]:text-[#2c3e50]"
      >
        <Result
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面不存在"
          extra={[
            <motion.div
              key="buttons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button type="primary" onClick={handleGoHome} size="large">
                返回首页
              </Button>
              <Button onClick={handleGoBack} size="large" className="ml-4">
                返回上页
              </Button>
            </motion.div>,
          ]}
        />
      </motion.div>
    </div>
  )
}
