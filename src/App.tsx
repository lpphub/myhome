import { Layout } from "antd"
import { Outlet, RouterProvider } from "react-router"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppSider } from "@/components/layout/AppSider"
import { router } from "@/router"
import "./styles/global.css"

const { Content } = Layout

export function AppLayout() {
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

export function App() {
  return <RouterProvider router={router} />
}
