import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface LoadingStateProps {
  type: 'loading' | 'error'
  message?: string
  onRetry?: () => void
}

export function LoadingState({ type, message, onRetry }: LoadingStateProps) {
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
            {onRetry && (
              <Button onClick={onRetry} variant='default'>
                重试
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
