import React from 'react'

const serializeError = (error: unknown) => {
  if (error instanceof Error) {
    return `${error.message}\n${error.stack}`
  }
  return JSON.stringify(error, null, 2)
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: unknown }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      hasError: true,
      error,
    })

    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='p-4 border border-red-500 rounded'>
          <h2 className='text-red-500'>Something went wrong.</h2>
          <pre className='mt-2 text-sm'>{serializeError(this.state.error)}</pre>
        </div>
      )
    }

    return this.props.children
  }
}
