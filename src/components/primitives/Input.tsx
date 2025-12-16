import clsx from "clsx"
import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input: React.FC<InputProps> = ({ className, error, ...props }) => {
  return (
    <div className="w-full">
      <input
        className={clsx(
          "w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors bg-white/90",
          error ? "border-red-500 focus:ring-red-200" : "border-stone-300 focus:ring-stone-200",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default Input
