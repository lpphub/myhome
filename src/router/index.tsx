import { AppLayout } from "@/App"
import { STORAGE_KEYS } from "@/constants"
import { Dashboard } from "@/pages/dashboard/Dashboard"
import { NotFound } from "@/pages/NotFound"
import { createBrowserRouter, Navigate, type RouteObject } from "react-router"
import type { RouteConfig } from "./types"

// Check if user is authenticated (mock implementation)
const isAuthenticated = () => {
  return localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === "true"
}

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />
  }
  return <>{children}</>
}

// Public route wrapper component (redirect if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

// Route configurations
const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Navigate to={isAuthenticated() ? "/dashboard" : "/signin"} replace />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        title: "仪表盘 - 我的家",
        description: "智能家居管理仪表盘",
      },
      {
        path: "profile",
        element: <div>用户资料页面（开发中）</div>,
        title: "个人资料 - 我的家",
        protected: true,
      },
      {
        path: "settings",
        element: <div>设置页面（开发中）</div>,
        title: "设置 - 我的家",
        protected: true,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
    title: "页面未找到 - 我的家",
  },
]

// Update page title
const updatePageTitle = (title: string) => {
  document.title = title || "我的家"
}

// Convert RouteConfig to RouteObject for createBrowserRouter
const convertRoutes = (routes: RouteConfig[]): RouteObject[] => {
  return routes.map(route => {
    const convertedRoute = {
      path: route.path,
      element: route.element,
      errorElement: route.errorElement,
      index: route.index,
    } as RouteObject

    if (route.children) {
      convertedRoute.children = convertRoutes(route.children)
    }

    return convertedRoute
  })
}

export const router = createBrowserRouter(convertRoutes(routes))

// Add route change listener for title updates
router.subscribe(state => {
  const currentRoute = state.location.pathname
  const route = findRouteByPath(routes, currentRoute)
  if (route?.title) {
    updatePageTitle(route.title)
  }
})

// Helper function to find route by path
function findRouteByPath(routes: RouteConfig[], path: string): RouteConfig | undefined {
  for (const route of routes) {
    // Check exact match
    if (route.path === path) {
      return route
    }

    // Check children
    if (route.children) {
      for (const child of route.children) {
        const fullPath = route.path === "/" ? `/${child.path}` : `${route.path}/${child.path}`

        if (fullPath === path || (child.path === "*" && !findRouteByPath(routes, fullPath))) {
          return child
        }
      }
    }
  }

  return undefined
}
