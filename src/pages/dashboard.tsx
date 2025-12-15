import { DatabaseOutlined, HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Card, Col, List, Row, Statistic, Typography } from "antd"
import { motion } from "motion/react"
import { QuickActions } from "@/components/QuickActions"
import { warmTheme } from "@/styles/theme"

const { Title, Paragraph } = Typography

export function Dashboard() {
  return (
    <div className="max-w-[1200px] mx-auto px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <Title
          level={2}
          className="mb-3"
          style={{
            color: warmTheme.colors.textPrimary,
            fontWeight: warmTheme.typography.fontWeight.medium,
            fontSize: "32px",
          }}
        >
          欢迎回家！👋
        </Title>

        <Paragraph
          style={{
            color: warmTheme.colors.textSecondary,
            fontSize: warmTheme.typography.fontSize.lg,
            marginBottom: 0,
          }}
        >
          这是您的智能家居管理中心，您可以在这里管理您的设备和家庭信息。
        </Paragraph>
      </motion.div>

      {/* 统计卡片区域 */}
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Card
              style={{
                borderRadius: warmTheme.borderRadius.medium,
                border: `1px solid ${warmTheme.colors.border}`,
                boxShadow: warmTheme.shadows.small,
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <Statistic
                title="设备总数"
                value={12}
                prefix={<HomeOutlined />}
                valueStyle={{
                  color: warmTheme.colors.success,
                  fontSize: "32px",
                  fontWeight: warmTheme.typography.fontWeight.medium,
                }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
          >
            <Card
              style={{
                borderRadius: warmTheme.borderRadius.medium,
                border: `1px solid ${warmTheme.colors.border}`,
                boxShadow: warmTheme.shadows.small,
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <Statistic
                title="在线设备"
                value={8}
                prefix={<DatabaseOutlined />}
                valueStyle={{
                  color: warmTheme.colors.info,
                  fontSize: "32px",
                  fontWeight: warmTheme.typography.fontWeight.medium,
                }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Card
              style={{
                borderRadius: warmTheme.borderRadius.medium,
                border: `1px solid ${warmTheme.colors.border}`,
                boxShadow: warmTheme.shadows.small,
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <Statistic
                title="家庭成员"
                value={4}
                prefix={<UserOutlined />}
                valueStyle={{
                  color: warmTheme.colors.warning,
                  fontSize: "32px",
                  fontWeight: warmTheme.typography.fontWeight.medium,
                }}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            <Card
              style={{
                borderRadius: warmTheme.borderRadius.medium,
                border: `1px solid ${warmTheme.colors.border}`,
                boxShadow: warmTheme.shadows.small,
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <Statistic
                title="自动化场景"
                value={6}
                prefix={<SettingOutlined />}
                valueStyle={{
                  color: warmTheme.colors.error,
                  fontSize: "32px",
                  fontWeight: warmTheme.typography.fontWeight.medium,
                }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Card
              title={
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: warmTheme.typography.fontWeight.medium,
                    color: warmTheme.colors.textPrimary,
                  }}
                >
                  最近活动
                </span>
              }
              style={{
                borderRadius: warmTheme.borderRadius.medium,
                border: `1px solid ${warmTheme.colors.border}`,
                boxShadow: warmTheme.shadows.small,
                height: "400px",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <List
                itemLayout="horizontal"
                dataSource={[
                  { title: "客厅灯已开启", time: "2分钟前", icon: "💡" },
                  { title: "温度调至 24°C", time: "15分钟前", icon: "🌡️" },
                  { title: "安防系统已启动", time: "1小时前", icon: "🔒" },
                  { title: "洗衣机已完成", time: "2小时前", icon: "🧺" },
                  { title: "门锁已上锁", time: "3小时前", icon: "🚪" },
                ]}
                renderItem={(item, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.2 }}
                  >
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size="large"
                            style={{
                              backgroundColor: warmTheme.colors.bgTertiary,
                              color: warmTheme.colors.textPrimary,
                              border: `1px solid ${warmTheme.colors.border}`,
                            }}
                          >
                            {item.icon}
                          </Avatar>
                        }
                        title={
                          <span
                            style={{
                              color: warmTheme.colors.textPrimary,
                              fontSize: warmTheme.typography.fontSize.base,
                            }}
                          >
                            {item.title}
                          </span>
                        }
                        description={
                          <span
                            style={{
                              color: warmTheme.colors.textTertiary,
                              fontSize: warmTheme.typography.fontSize.sm,
                            }}
                          >
                            {item.time}
                          </span>
                        }
                      />
                    </List.Item>
                  </motion.div>
                )}
              />
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          >
            <Card
              title={
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: warmTheme.typography.fontWeight.medium,
                    color: warmTheme.colors.textPrimary,
                  }}
                >
                  快速操作
                </span>
              }
              style={{
                borderRadius: warmTheme.borderRadius.medium,
                border: `1px solid ${warmTheme.colors.border}`,
                boxShadow: warmTheme.shadows.small,
                height: "400px",
              }}
              bodyStyle={{ padding: "20px" }}
            >
              <QuickActions />
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  )
}
