import { motion } from 'motion/react';
import catHappy from '../assets/cat-happy.png';
import catCurious from '../assets/cat-curious.png';
import catSad from '../assets/cat-sad.png';
import catShocked from '../assets/cat-shocked.png';
import catAngry from '../assets/cat-angry.png';

type CatMood = 'neutral' | 'happy' | 'curious' | 'shocked' | 'sleepy' | 'angry' | 'sad';

interface CatMascotProps {
  mood: CatMood;
  message?: string;
}

const moodImage: Record<CatMood, string> = {
  happy:   catHappy,
  curious: catCurious,
  sad:     catSad,
  shocked: catShocked,
  angry:   catAngry,
  sleepy:  catSad,    // fallback
  neutral: catHappy,  // fallback
};

const moodAnimation: Record<CatMood, { y: number[]; rotate: number | number[] }> = {
  happy:   { y: [0, -6, 0], rotate: 0 },
  curious: { y: [0, -4, 0], rotate: [0, 5, -5, 0] },
  sad:     { y: [0, -2, 0], rotate: 0 },
  shocked: { y: [0, -8, 0], rotate: [0, 8, -8, 0] },
  angry:   { y: [0, -3, 0], rotate: [0, -3, 3, 0] },
  sleepy:  { y: [0, -2, 0], rotate: 0 },
  neutral: { y: [0, -4, 0], rotate: 0 },
};

export default function CatMascot({ mood, message }: CatMascotProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-pure-white/85 backdrop-blur-md rounded-2xl border border-burgundy/10 shadow-sm">
      <motion.div
        animate={moodAnimation[mood]}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex-shrink-0"
      >
        <img
          src={moodImage[mood]}
          alt={`cat ${mood}`}
          className="w-16 h-16 object-contain image-rendering-pixelated"
          style={{ imageRendering: 'pixelated' }}
        />
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
