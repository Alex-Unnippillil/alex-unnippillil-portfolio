import { ReactNode } from 'react';
import { AnimatePresence, Reorder, useReducedMotion } from 'framer-motion';
import { durations, easings } from '../../styles/motion';

type Key = string | number;

export interface AnimatedListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => ReactNode;
  getKey?: (item: T) => Key;
}

function getItemKey<T>(item: T, getKey?: (item: T) => Key): Key {
  return getKey ? getKey(item) : (item as unknown as Key);
}

export function AnimatedList<T>({ items, onReorder, renderItem, getKey }: AnimatedListProps<T>): JSX.Element {
  const reduceMotion = useReducedMotion();

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={onReorder}
      transition={{ duration: durations.short, ease: easings.standard }}
    >
      <AnimatePresence>
        {items.map((item) => (
          <Reorder.Item
            key={getItemKey(item, getKey)}
            value={item}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: durations.short, ease: easings.standard }}
          >
            {renderItem(item)}
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}

export default AnimatedList;
