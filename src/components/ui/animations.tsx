'use client';

import { motion } from 'framer-motion';

// Animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

// Loading Animation Component
export function LoadingDots() {
  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          animate={{
            y: [-5, 5, -5],
            transition: {
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.2
            }
          }}
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#2563eb',
            borderRadius: '50%'
          }}
        />
      ))}
    </div>
  );
}