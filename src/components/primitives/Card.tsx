import clsx from "clsx"
import type React from "react"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={clsx(
        "bg-white/80 backdrop-blur-lg border border-stone-200 rounded-lg p-8 shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
