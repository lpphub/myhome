import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export interface TextState {
  title: string
  description: string
}

export interface TextEditorProps {
  text: TextState
  onChange: (state: TextState) => void
  required?: boolean
}

export interface TextEditorHandle {
  validate: () => boolean
}

export const TextEditor = forwardRef<TextEditorHandle, TextEditorProps>(
  ({ text, onChange, required }, ref) => {
    const titleRef = useRef<HTMLInputElement>(null)
    const bodyRef = useRef<HTMLTextAreaElement>(null)
    const [requiredError, setRequiredError] = useState(false)

    // 局部更新工具
    const patch = useCallback(
      (partial: Partial<TextState>) => {
        onChange({ ...text, ...partial })
        if (required && partial.title?.trim()) {
          setRequiredError(false) // 用户输入后自动清除红色边框
        }
      },
      [text, onChange, required]
    )

    // 暴露给父组件的校验方法
    useImperativeHandle(ref, () => ({
      validate: () => {
        if (required && !text.title.trim()) {
          setRequiredError(true)
          titleRef.current?.focus()
          return false
        }
        return true
      },
    }))

    // 光标保持在末尾
    // useEffect(() => {
    //   if (document.activeElement === titleRef.current) {
    //     const len = text.title.length
    //     titleRef.current?.setSelectionRange(len, len)
    //   }
    //   if (document.activeElement === bodyRef.current) {
    //     const len = text.description.length
    //     bodyRef.current?.setSelectionRange(len, len)
    //   }
    // }, [text.title, text.description])

    return (
      <div
        className={cn(
          'rounded-md border bg-transparent transition-all focus-within:ring-1',
          requiredError
            ? 'border-red-500 focus-within:ring-red-200'
            : 'focus-within:border-coral-200 focus-within:ring-coral-50'
        )}
      >
        {/* 标题 */}
        <input
          ref={titleRef}
          value={text.title}
          placeholder='标题'
          onChange={e => patch({ title: e.target.value })}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              requestAnimationFrame(() => bodyRef.current?.focus())
            }
          }}
          className={cn(
            'w-full px-4 pt-4 pb-2 bg-transparent outline-none border-0 text-base font-semibold placeholder:text-muted-foreground'
          )}
        />

        {/* 正文 */}
        <textarea
          ref={bodyRef}
          value={text.description}
          placeholder='描述内容...'
          rows={4}
          onChange={e => patch({ description: e.target.value })}
          onKeyDown={e => {
            if (
              e.key === 'Backspace' &&
              text.description === '' &&
              document.activeElement === bodyRef.current
            ) {
              e.preventDefault()
              requestAnimationFrame(() => titleRef.current?.focus())
            }
          }}
          className={cn(
            'w-full px-4 pt-1 pb-4 bg-transparent outline-none border-0 resize-none text-sm leading-relaxed placeholder:text-muted-foreground',
            'overflow-auto scrollbar-hide'
          )}
        />
      </div>
    )
  }
)

TextEditor.displayName = 'TextEditor'
