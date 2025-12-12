import { Typography } from "antd"
import { StateManagementExample } from "@/pages/examples/StateManagementExample"

const { Title } = Typography

export function DashboardPage() {
  return (
    <div>
      <Title level={2} className="mb-6">
        仪表板
      </Title>

      <StateManagementExample />
    </div>
  )
}
