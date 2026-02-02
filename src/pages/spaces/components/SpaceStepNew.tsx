import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSpaceId } from '../hooks/useSpaceLocal'
import { useCreateSpace, useInviteSpaceMember } from '../hooks/useSpaces'
import { StepInvite } from './StepInvite'
import { StepSpaceInfo } from './StepSpaceInfo'

type Step = 'info' | 'invite'

export function SpaceStepNew() {
  const navigate = useNavigate()
  const { setSpaceId } = useSpaceId()
  const createSpace = useCreateSpace()
  const inviteSpaceMember = useInviteSpaceMember()
  const [step, setStep] = useState<Step>('info')
  const [formData, setFormData] = useState<{
    name: string
    icon: string
    description?: string
  } | null>(null)

  const handleInfoSubmit = (data: typeof formData) => {
    setFormData(data)
    setStep('invite')
  }

  const handleInviteSubmit = async (invitees: string[]) => {
    if (!formData) return

    try {
      const spaceId = await createSpace.mutateAsync(formData)
      setSpaceId(spaceId)

      if (invitees.length > 0) {
        await inviteSpaceMember.mutateAsync({ spaceId, emails: invitees })
      }

      navigate('/tags')
    } catch (error) {
      console.error('创建失败', error)
    }
  }

  return (
    <div className='min-h-screen'>
      <main className='max-w-xl mx-auto px-4 py-8'>
        {step === 'info' && (
          <StepSpaceInfo onSubmit={handleInfoSubmit} onCancel={() => navigate(-1)} />
        )}
        {step === 'invite' && (
          <StepInvite
            spaceName={formData?.name || ''}
            onSubmit={handleInviteSubmit}
            onBack={() => setStep('info')}
            onSkip={() => handleInviteSubmit([])}
            isLoading={createSpace.isPending}
          />
        )}
      </main>
    </div>
  )
}
