import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  hoverEffect = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={hoverEffect ? { y: -5, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' } : {}}
      className={`bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};
