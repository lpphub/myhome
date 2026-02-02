import { createContext, type ReactNode, useContext } from 'react'

interface SpaceContextType {
  spaceId: number | undefined
}

interface SpaceProviderProps {
  spaceId: number | undefined
  children: ReactNode
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined)

export const SpaceProvider = ({ spaceId, children }: SpaceProviderProps) => {
  return <SpaceContext.Provider value={{ spaceId }}>{children}</SpaceContext.Provider>
}

// Hook
export const useSpace = () => {
  const context = useContext(SpaceContext)
  if (!context) throw new Error('useSpace must be used within SpaceProvider')
  return context
}
