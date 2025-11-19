import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "relative px-6 py-3 rounded-xl font-bold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const variants = {
    primary: "bg-white text-slate-900 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    secondary: "bg-slate-800/50 backdrop-blur-md border border-slate-700 text-white hover:bg-slate-700/50 hover:border-slate-500",
    ghost: "bg-transparent text-slate-400 hover:text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {/* Button shine effect */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      )}
      
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon}
          <span className="relative z-10">{children}</span>
        </>
      )}
    </motion.button>
  );
};
