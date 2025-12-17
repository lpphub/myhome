import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  onClick?: () => void
  hoverable?: boolean
  variant?: "default" | "warm" | "soft" | "glass"
  decorative?: boolean
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  description,
  hoverable = false,
  variant = "default",
  decorative = false,
}) => {
  const baseClasses = `
    relative overflow-hidden rounded-2xl transition-all duration-300
    ${hoverable ? "hover:shadow-card-hover hover:-translate-y-1 cursor-pointer" : ""}
    ${className}
  `

  const variantClasses = {
    default: `
      bg-surface border border-cream-200 shadow-card
      ${hoverable ? "hover:border-honey-300 hover:shadow-warm-md" : ""}
    `,
    warm: `
      bg-gradient-to-br from-cream-50 to-honey-50 border border-honey-200 shadow-soft
      ${hoverable ? "hover:shadow-warm-lg hover:border-honey-300" : ""}
    `,
    soft: `
      bg-white/80 backdrop-blur-sm border border-cream-100 shadow-warm-sm
      ${hoverable ? "hover:bg-white/90 hover:shadow-warm-md" : ""}
    `,
    glass: `
      bg-white/60 backdrop-blur-lg border border-white/30 shadow-warm-md
      ${hoverable ? "hover:bg-white/80 hover:shadow-warm-lg" : ""}
    `,
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      {/* 装饰性元素 */}
      {decorative && (
        <>
          <div className="absolute top-0 right-0 w-32 h-32 bg-honey-100 rounded-full filter blur-2xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-coral-100 rounded-full filter blur-2xl opacity-20" />
        </>
      )}

      {/* 标题和描述 */}
      {(title || description) && (
        <div className="p-5 border-b border-cream-100">
          {title && <h3 className="text-xl font-bold text-honey-700 mb-1">{title}</h3>}
          {description && <p className="text-warmGray-500 text-sm">{description}</p>}
        </div>
      )}

      {/* 内容区域 */}
      <div className={title || description ? "p-5" : ""}>{children}</div>

      {/* 悬停光效 */}
      {hoverable && (
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  )
}

export default Card
