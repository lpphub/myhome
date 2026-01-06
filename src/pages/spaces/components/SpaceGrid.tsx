import { motion } from 'motion/react'
import type { Space } from '@/types/space'
import { SpaceCard } from './SpaceCard'

interface SpaceGridProps {
  spaces: Space[]
}

export function SpaceGrid({ spaces }: SpaceGridProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
      {spaces.map((space, index) => (
        <motion.div
          key={space.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <SpaceCard space={space} />
        </motion.div>
      ))}
    </div>
  )
}
