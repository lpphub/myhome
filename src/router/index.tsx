import { createBrowserRouter } from "react-router"
import { App } from "@/App"
import { DashboardPage } from "@/pages/dashboard/DashboardPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },
])
