import { Layout } from "antd"
import { Outlet, RouterProvider } from "react-router"
import { Toaster } from "sonner"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppSider } from "@/components/layout/AppSider"
import { PageTransition } from "@/components/page-transition"
import { AuthLayout } from "@/components/AuthLayout"
import { router } from "@/router"
import { warmTheme } from "@/styles/theme"
import "./styles/global.css"

const { Content } = Layout

export function AppLayout() {
  return (
    <Layout>
      <AppHeader />
      <Layout>
        <AppSider />
        <Layout>
          <Content>
            <PageTransition>
              <Outlet />
            </PageTransition>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

// 认证页面的布局（没有 header 和 sidebar）
export function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  )
}

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        theme="light"
        toastOptions={{
          style: {
            background: warmTheme.colors.bgSecondary,
            border: `1px solid ${warmTheme.colors.border}`,
            borderRadius: warmTheme.borderRadius.small,
            color: warmTheme.colors.textPrimary,
          },
          success: {
            iconTheme: {
              primary: warmTheme.colors.success,
              secondary: warmTheme.colors.bgSecondary,
            },
          },
          error: {
            iconTheme: {
              primary: warmTheme.colors.error,
              secondary: warmTheme.colors.bgSecondary,
            },
          },
        }}
      />
    </>
  )
}
