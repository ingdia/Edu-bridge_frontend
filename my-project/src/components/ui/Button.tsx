import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 btn-focus disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-emerald-700 text-white hover:bg-emerald-800 border border-transparent',
        secondary: 'bg-amber-500 text-white hover:bg-amber-600 border border-transparent',
        outline: 'border border-gray-200 text-gray-700 bg-white hover:border-emerald-300 hover:text-emerald-700',
        ghost: 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent',
        danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
      },
      size: {
        sm: 'px-3.5 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);
Button.displayName = 'Button';
