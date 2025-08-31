import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useReducedMotion, type MotionProps } from 'framer-motion';

const inputStyles = cva(
  'flex w-full rounded-md border border-muted bg-surface px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-2 text-sm',
        md: 'h-10 px-3',
        lg: 'h-12 px-4 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputStyles>,
    MotionProps {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, size, ...props }, ref) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.input
      ref={ref}
      className={inputStyles({ size, className })}
      whileFocus={reduceMotion ? undefined : { scale: 1.01 }}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input, inputStyles };
