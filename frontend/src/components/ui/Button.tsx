'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  className?: string
  href?: string
  fullWidth?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-300 cursor-pointer border-0 outline-none focus:outline-none'

  const variants = {
    primary: 'bg-gradient-rose text-white shadow-rose hover:shadow-rose-lg hover:scale-105',
    secondary: 'bg-blue-brand text-white hover:bg-opacity-90 hover:scale-105 shadow-md',
    outline: 'border-2 border-rose text-rose bg-transparent hover:bg-rose hover:text-white',
    ghost: 'text-rose hover:bg-rose-light',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
    ${className}
  `.trim()

  const isDisabled = disabled || loading

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={classes.replace(`${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`, `${isDisabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`)}
      whileHover={!isDisabled ? { scale: 1.03 } : {}}
      whileTap={!isDisabled ? { scale: 0.97 } : {}}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : children}
    </motion.button>
  )
}
