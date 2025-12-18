import { QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { queryClient } from '@/api/query-client'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { startMockService } from '@/mocks/browser'
import App from './App'
import './styles/globals.css'

// 启动 Mock 服务（仅在开发环境）
startMockService()

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
