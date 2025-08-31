import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cva } from 'class-variance-authority';

const overlayStyles = cva('fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md');
const panelStyles = cva('bg-surface rounded-md shadow-md p-lg');

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: React.ReactNode;
}

export function Dialog({ open, onClose, titleId, children }: DialogProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={overlayStyles()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={panelStyles()}
            initial={{ scale: reduceMotion ? 1 : 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: reduceMotion ? 1 : 0.95, opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
