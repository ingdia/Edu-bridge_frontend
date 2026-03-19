import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-semibold',
  {
    variants: {
      variant: {
        primary: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        secondary: 'bg-amber-50 text-amber-700 border border-amber-100',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border border-amber-200',
        error: 'bg-red-50 text-red-600 border border-red-200',
        info: 'bg-blue-50 text-blue-700 border border-blue-200',
        outline: 'border border-gray-200 text-gray-600 bg-white',
        dark: 'bg-gray-900 text-white border border-gray-800',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-xs',
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';
