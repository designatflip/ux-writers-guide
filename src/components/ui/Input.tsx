import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-neutral-900">{label}</label>
        )}
        <input
          ref={ref}
          className={`w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-flip-orange focus:outline-none focus:ring-2 focus:ring-flip-orange/20 disabled:bg-neutral-50 disabled:text-neutral-600 ${error ? 'border-crimson focus:border-crimson focus:ring-crimson/20' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-crimson-700">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
