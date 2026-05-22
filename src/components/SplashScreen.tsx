import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-transparent pointer-events-none"
      />
      
      <div className="relative z-10 flex flex-col items-center px-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-400 rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full bg-card flex items-center justify-center shadow-2xl border border-border/30">
            <Logo className="w-20 h-20" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center"
        >
          <h1 className="text-4xl font-black tracking-wider">
            <span className="text-red-500">RED</span>{' '}
            <span className="text-foreground">WHALE</span>
          </h1>
          <p className="text-xs font-semibold text-muted-foreground tracking-widest mt-2">
            V1 — Powerful AI
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="h-[1px] w-32 bg-gradient-to-r from-transparent via-red-500/50 to-transparent mt-5"
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase mt-4"
        >
          By Shujan
        </motion.p>
      </div>
    </motion.div>
  );
}

