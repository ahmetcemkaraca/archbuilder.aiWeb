'use client';

import { motion } from 'framer-motion';
import { useScrollAnimation, AnimationConfig } from '@/lib/animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
  delay?: number;
  config?: AnimationConfig;
}

const animationVariants = {
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
};

export function AnimatedSection({
  children,
  className = '',
  animation = 'fadeInUp',
  delay = 0,
  config = {}
}: AnimatedSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation(config);

  const variant = animationVariants[animation];

  return (
    <motion.div
      ref={elementRef as React.MutableRefObject<HTMLElement | null> as unknown as React.Ref<HTMLDivElement>}
      className={className}
      initial={variant.initial}
      animate={isVisible ? variant.animate : variant.initial}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  config?: AnimationConfig;
}

export function StaggeredList({
  children,
  className = '',
  staggerDelay = 0.1,
  config = {}
}: StaggeredListProps) {
  const { elementRef, isVisible } = useScrollAnimation(config);

  return (
    <motion.div
      ref={elementRef as React.MutableRefObject<HTMLElement | null> as unknown as React.Ref<HTMLDivElement>}
      className={className}
      initial="initial"
      animate={isVisible ? "animate" : "initial"}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

interface StaggeredItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggeredItem({ children, className = '' }: StaggeredItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}