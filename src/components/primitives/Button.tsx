import clsx from "clsx"
import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
}

const Button: React.FC<ButtonProps> = ({ children, className, loading, disabled, ...props }) => {
  return (
    <button
      className={clsx(
        "w-full py-3 rounded-lg font-medium transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
        "bg-stone-900 text-white hover:bg-stone-800",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="animate-spin">加载中...</span> : children}
    </button>
  )
}

export default Button
