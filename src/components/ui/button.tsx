import { ButtonHTMLAttributes } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/lib/utils'

const button = tv({
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
  variants: {
    variant: {
      default: 'bg-blue-600 text-white hover:bg-blue-500',
      outline: 'border border-border hover:bg-slate-50'
    },
    size: {
      sm: 'h-8 px-3',
      md: 'h-9 px-4'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'md'
  }
})

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />
}
