import { createBrowserRouter } from "react-router"
import { AppLayout } from "@/App"
import { DashboardPage } from "@/pages/dashboard/DashboardPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
])
