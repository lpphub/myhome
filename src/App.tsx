import { Layout } from "antd"
import { Outlet } from "react-router"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppSider } from "@/components/layout/AppSider"
import "./styles/global.css"

const { Content } = Layout

export function App() {
  return (
    <Layout className="appLayout">
      <AppHeader />
      <Layout>
        <AppSider />
        <Layout className="mainLayout">
          <Content className="content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
