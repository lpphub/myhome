import { DatabaseOutlined, HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Card, Col, List, Row, Statistic, Typography } from "antd"
import { motion } from "motion/react"
import { StateManagementExample } from "@/pages/examples/StateManagementExample"

const { Title, Paragraph } = Typography

export function Dashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Title level={2} className="mb-2">
        欢迎回家！👋
      </Title>

      <Paragraph className="text-lg text-gray-600 mb-6">
        这是您的智能家居管理中心，您可以在这里管理您的设备和家庭信息。
      </Paragraph>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <Statistic
                title="设备总数"
                value={12}
                prefix={<HomeOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <Statistic
                title="在线设备"
                value={8}
                prefix={<DatabaseOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <Statistic
                title="家庭成员"
                value={4}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <Statistic
                title="自动化场景"
                value={6}
                prefix={<SettingOutlined />}
                valueStyle={{ color: "#eb2f96" }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card title="最近活动" className="h-96">
              <List
                itemLayout="horizontal"
                dataSource={[
                  { title: "客厅灯已开启", time: "2分钟前", icon: "💡" },
                  { title: "温度调至 24°C", time: "15分钟前", icon: "🌡️" },
                  { title: "安防系统已启动", time: "1小时前", icon: "🔒" },
                  { title: "洗衣机已完成", time: "2小时前", icon: "🧺" },
                  { title: "门锁已上锁", time: "3小时前", icon: "🚪" },
                ]}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar size="large">{item.icon}</Avatar>}
                      title={item.title}
                      description={item.time}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card title="快速操作" className="h-96">
              <StateManagementExample />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </motion.div>
  )
}
