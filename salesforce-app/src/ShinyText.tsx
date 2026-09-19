import React from 'react';
import { motion } from 'framer-motion';

interface ShinyTextProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  baseColor?: string;
  shineColor?: string;
  animationSpeed?: number;
  spread?: number;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  children,
  text,
  className = '',
  baseColor = '#64CEFB',
  shineColor = '#ffffff',
  animationSpeed = 3,
  spread = 100,
}) => {
  const content = text || children;

  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${baseColor} 0%, ${baseColor} 30%, ${shineColor} 50%, ${baseColor} 70%, ${baseColor} 100%)`,
        backgroundSize: '250% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
      animate={{
        backgroundPosition: ['100% 0%', '-100% 0%'],
      }}
      transition={{
        repeat: Infinity,
        duration: animationSpeed,
        ease: 'linear',
      }}
    >
      {content}
    </motion.span>
  );
};

export default ShinyText;
