import React from 'react';
import { motion } from 'motion/react';

type CatMood = 'neutral' | 'happy' | 'curious' | 'shocked' | 'sleepy' | 'angry';

interface CatMascotProps {
  mood: CatMood;
  message?: string;
}

export default function CatMascot({ mood, message }: CatMascotProps) {
  const getExpression = () => {
    switch (mood) {
      case 'happy': return '◕‿◕';
      case 'curious': return '◕_◕';
      case 'shocked': return '⊙△⊙';
      case 'sleepy': return 'u_u';
      case 'angry': return 'ಠ_ಠ';
      default: return '•‿•';
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-pure-white/85 backdrop-blur-md rounded-2xl border border-burgundy/10 shadow-sm">
      <motion.div 
        animate={{ 
          y: [0, -5, 0],
          rotate: mood === 'shocked' ? [0, 5, -5, 0] : 0
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="text-4xl select-none"
      >
        <div className="relative">
          <span className="text-burgundy">/ᐠ{getExpression()}ᐟ\</span>
          {mood === 'happy' && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 text-red-500 text-sm"
            >
              ❤️
            </motion.span>
          )}
        </div>
      </motion.div>
      {message && (
        <div className="relative px-4 py-2 bg-burgundy/5 rounded-xl border border-burgundy/10">
          <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-2 h-2 bg-burgundy/5 border-l border-b border-burgundy/10 rotate-45" />
          <p className="text-xs font-bold text-burgundy italic leading-tight">
            "{message}"
          </p>
        </div>
      )}
    </div>
  );
}
