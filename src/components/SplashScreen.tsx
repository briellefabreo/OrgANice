import { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

export function SplashScreen({
  onComplete,
  durationMs = 1550,
}: SplashScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, durationMs);
    return () => window.clearTimeout(timer);
  }, [onComplete, durationMs]);

  return (
    <motion.div
      data-testid="splash-screen"
      role="status"
      aria-live="polite"
      aria-label="Loading OrgANice"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0c2c68] px-6 text-white select-none"
    >
      {/* Subtle radial crest glow */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: [0, 0.55, 0.35], scale: [0.7, 1.08, 1] }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute h-80 w-80 rounded-full bg-[#ffeb69]/20 blur-3xl"
      />

      <div className="relative flex flex-col items-center text-center">
        {/* Animated emblem halo + circular logo badge */}
        <div className="relative flex items-center justify-center">
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.75, rotate: -25 }}
            animate={{ opacity: [0, 0.9, 0.45], scale: [0.75, 1.12, 1.04], rotate: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -inset-3 rounded-full border-2 border-[#ffeb69]/60"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.72, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white p-3 shadow-2xl ring-4 ring-white/20 sm:h-32 sm:w-32"
          >
            <img
              src="/site/assets/images/organice20logo204-160x160.png"
              alt="OrgANice logo"
              className="h-full w-full object-contain"
            />
          </motion.div>
        </div>

        {/* Wordmark & school identity reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          OrgANice
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-1.5 text-sm font-medium tracking-wide text-slate-200 sm:text-base"
        >
          Corcuera National High School
        </motion.p>

        {/* Smooth reveal progress hairline */}
        <div
          aria-hidden="true"
          className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/15"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.25, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left center' }}
            className="h-full w-full rounded-full bg-[#ffeb69]"
          />
        </div>
      </div>
    </motion.div>
  );
}
