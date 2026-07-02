import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-xl border-2 font-body text-base
          bg-white/80 backdrop-blur-sm
          border-rose/30 focus:border-rose focus:outline-none
          transition-all duration-200 placeholder:text-gray-400
          ${error ? 'border-red-400 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <textarea
        className={`
          w-full px-4 py-3 rounded-xl border-2 font-body text-base
          bg-white/80 backdrop-blur-sm
          border-rose/30 focus:border-rose focus:outline-none
          transition-all duration-200 placeholder:text-gray-400 resize-none
          ${error ? 'border-red-400 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}

export function Select({
  label,
  error,
  className = '',
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        className={`
          w-full px-4 py-3 rounded-xl border-2 font-body text-base
          bg-white/80 backdrop-blur-sm
          border-rose/30 focus:border-rose focus:outline-none
          transition-all duration-200
          ${error ? 'border-red-400 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  )
}
