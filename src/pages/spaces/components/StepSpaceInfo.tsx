import { zodResolver } from '@hookform/resolvers/zod'
import { Home } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const spaceInfoSchema = z.object({
  name: z.string().min(1, '请输入空间名称').max(20),
  description: z.string().max(500).optional(),
})

type SpaceInfoValues = z.infer<typeof spaceInfoSchema>

interface StepSpaceInfoProps {
  onSubmit: (data: SpaceInfoValues & { icon: string }) => void
  onCancel: () => void
}

function getInitialIcon(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return 'A'
  const firstChar = trimmed.charAt(0).toUpperCase()
  return /[A-Z]/.test(firstChar) ? firstChar : 'A'
}

export function StepSpaceInfo({ onSubmit, onCancel }: StepSpaceInfoProps) {
  const form = useForm<SpaceInfoValues>({
    resolver: zodResolver(spaceInfoSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const nameValue = form.watch('name')
  const initialIcon = useMemo(() => getInitialIcon(nameValue), [nameValue])

  const handleSubmit = (data: SpaceInfoValues) => {
    onSubmit({ ...data, icon: initialIcon })
  }

  return (
    <div className='space-y-6'>
      <div className='text-center py-6'>
        <div className='w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-coral-100 to-honey-100 flex items-center justify-center shadow-lg'>
          <Home className='w-8 h-8 text-coral-600' />
        </div>
        <h2 className='text-2xl font-bold text-foreground mb-2'>创建新空间</h2>
        <p className='text-muted-foreground'>为生活打造专属角落，记录每一份美好</p>
      </div>

      <Card variant='warm'>
        <CardContent className='pt-6'>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-sm font-medium text-foreground'>
                空间名称 <span className='text-coral-500'>*</span>
              </Label>
              <Input
                id='name'
                autoFocus
                placeholder='给你的空间起个名字'
                className='h-11 text-base'
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className='text-sm text-coral-500'>{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description' className='text-sm font-medium text-foreground'>
                描述 <span className='text-muted-foreground font-normal'>(可选)</span>
              </Label>
              <Textarea
                id='description'
                placeholder='简单描述一下这个空间的用途...'
                rows={3}
                className='resize-none text-base'
                {...form.register('description')}
              />
            </div>

            <div className='flex gap-3 pt-2'>
              <Button type='button' variant='outline' onClick={onCancel} className='flex-1 h-11'>
                取消
              </Button>
              <Button
                type='submit'
                className='flex-1 h-11 bg-primary/80 hover:bg-primary text-white'
              >
                下一步
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
