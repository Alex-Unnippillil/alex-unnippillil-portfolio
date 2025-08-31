import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { fadeScale, transition } from '../../styles/motion';

export default function RouterLayout(): JSX.Element {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const initial = reduceMotion ? { opacity: 0 } : fadeScale.initial;
  const animate = reduceMotion ? { opacity: 1 } : fadeScale.animate;
  const exit = reduceMotion ? { opacity: 0 } : fadeScale.exit;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} initial={initial} animate={animate} exit={exit} transition={transition}>
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
