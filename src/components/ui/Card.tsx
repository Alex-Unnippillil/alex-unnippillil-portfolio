import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, useReducedMotion, type MotionProps } from 'framer-motion';

const cardStyles = cva('rounded-md bg-surface p-md shadow-sm', {
  variants: {
    interactive: {
      true: 'cursor-pointer',
    },
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardStyles>,
    MotionProps {}

export function Card({ className, interactive, ...props }: CardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cardStyles({ interactive, className })}
      whileHover={interactive && !reduceMotion ? { scale: 1.02 } : undefined}
      {...props}
    />
  );
}
