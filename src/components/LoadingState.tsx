import { Spinner } from '@/components/ui/spinner'

interface LoadingStateProps {
  type: 'loading' | 'error'
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function LoadingState({ type, message, action }: LoadingStateProps) {
  return (
    <div className='min-h-screen bg-cream-50 flex items-center justify-center'>
      <div className='text-center'>
        {type === 'loading' ? (
          <>
            <Spinner className='size-12 text-primary mx-auto mb-4' />
            <p className='text-primary text-lg'>{message || '正在加载数据...'}</p>
          </>
        ) : (
          <>
            <p className='text-primary text-lg mb-4'>{message || '数据加载失败'}</p>
            {action && (
              <button
                type='button'
                onClick={action.onClick}
                className='inline-flex items-center gap-2 bg-linear-to-r from-coral-400 to-coral-500
                           text-white px-6 py-2.5 rounded-lg hover:from-coral-500 hover:to-coral-600
                           transition-all duration-300 shadow-lg hover:shadow-md'
              >
                <span className='font-medium'>{action.label}</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
