import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import getMagicResponse from '../utils/getMagicResponse';
import { runTextScramble } from '../utils/textScramble';

const PROMPT = 'YOU ARE ENTERING A NEW SPACE.';
const PARTICLE_COUNT = 14;

const PHASE = {
  IDLE: 'idle',
  SCRAMBLE: 'scramble',
  PAUSE: 'pause',
  PLANET: 'planet',
  HYPERJUMP: 'hyperjump',
  CRT: 'crt',
};

const TIMING = {
  scramble: 1000,
  pause: 700,
  planetMorph: 720,
  hyperjump: 950,
  crt: 500,
};

function Particles() {
  const seeds = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 55,
      y: (Math.random() - 0.5) * 42,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.4,
      duration: 2.2 + Math.random() * 1.4,
    })),
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {seeds.map((p) => (
        <motion.span
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full bg-white/75 shadow-[0_0_14px_rgba(255,255,255,0.95)]"
          style={{ width: p.size, height: p.size }}
          initial={{ opacity: 0, x: `${p.x}vmin`, y: `${p.y}vmin`, scale: 0 }}
          animate={{
            opacity: [0, 0.9, 0.5, 0.8],
            x: [`${p.x}vmin`, `${p.x * 1.6}vmin`, `${p.x * 1.2}vmin`],
            y: [`${p.y}vmin`, `${p.y * 1.6 - 4}vmin`, `${p.y * 1.2 - 2}vmin`],
            scale: [0, 1, 0.85, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        />
      ))}
    </div>
  );
}

function getBlockAnimation(phase, locked) {
  if (phase === PHASE.HYPERJUMP) {
    return {
      width: 'clamp(3.5rem, 12vw, 5.5rem)',
      height: 'clamp(3.5rem, 12vw, 5.5rem)',
      borderRadius: '50%',
      rotate: 360,
      scale: 52,
    };
  }

  if (phase === PHASE.PLANET || phase === PHASE.CRT) {
    return {
      width: 'clamp(3.5rem, 12vw, 5.5rem)',
      height: 'clamp(3.5rem, 12vw, 5.5rem)',
      borderRadius: '50%',
      rotate: 360,
      scale: phase === PHASE.CRT ? 52 : [1, 1.06, 1],
    };
  }

  if (locked) {
    return { width: 44, height: 44, borderRadius: 4, scale: 1, rotate: 0 };
  }

  return {
    width: 'min(85vw, 460px)',
    height: 48,
    borderRadius: 8,
    scale: 1,
    rotate: 0,
  };
}

export default function Intro({ onComplete }) {
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [promptText, setPromptText] = useState(PROMPT);
  const [magicWord, setMagicWord] = useState('');
  const [locked, setLocked] = useState(false);
  const completedRef = useRef(false);

  const isOrb =
    phase === PHASE.PLANET ||
    phase === PHASE.HYPERJUMP ||
    phase === PHASE.CRT;
  const isHyper = phase === PHASE.HYPERJUMP;
  const isCrt = phase === PHASE.CRT;
  const showPrompt =
    phase === PHASE.IDLE ||
    phase === PHASE.SCRAMBLE ||
    phase === PHASE.PAUSE;

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete?.();
  }, [onComplete]);

  const runPlanetSequence = useCallback(async () => {
    setPhase(PHASE.PLANET);
    await new Promise((r) => setTimeout(r, TIMING.planetMorph));
    setPhase(PHASE.HYPERJUMP);
    await new Promise((r) => setTimeout(r, TIMING.hyperjump));
    setPhase(PHASE.CRT);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (locked || !magicWord.trim()) return;

      setLocked(true);
      setPhase(PHASE.SCRAMBLE);

      const target = getMagicResponse(magicWord);
      await runTextScramble(PROMPT, target, TIMING.scramble, setPromptText);

      setPhase(PHASE.PAUSE);
      await new Promise((r) => setTimeout(r, TIMING.pause));

      await runPlanetSequence();
    },
    [locked, magicWord, runPlanetSequence],
  );

  const blockTransition =
    phase === PHASE.HYPERJUMP
      ? { duration: TIMING.hyperjump / 1000, ease: [0.9, 0.03, 0.95, 0.2] }
      : phase === PHASE.PLANET
        ? {
            duration: TIMING.planetMorph / 1000,
            ease: [0.4, 0, 0.2, 1],
            scale: { duration: 2.1, repeat: Infinity, ease: 'easeInOut' },
          }
        : { duration: 0.45, ease: [0.4, 0, 0.2, 1] };

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden font-mono"
      animate={{
        backgroundColor: isHyper || isCrt ? '#ffffff' : '#0047ff',
      }}
      transition={{
        backgroundColor: {
          duration: isHyper ? 0.45 : 0.2,
          ease: 'easeIn',
        },
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor: isHyper || isCrt ? '#ffffff' : 'transparent',
        }}
        transition={{ duration: 0.45, ease: 'easeIn', delay: isHyper ? 0.15 : 0 }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <AnimatePresence>
          {showPrompt && (
            <motion.p
              key="prompt"
              className="mb-5 max-w-[92vw] text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white sm:mb-6 sm:text-xs md:text-sm md:tracking-[0.22em]"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              {promptText}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.form
          onSubmit={handleSubmit}
          className={[
            'relative shrink-0 overflow-hidden',
            isOrb ? 'pearl-planet block' : 'flex items-stretch bg-brand-dark',
          ].join(' ')}
          animate={getBlockAnimation(phase, locked)}
          transition={blockTransition}
        >
          {!locked && (
            <>
              <input
                type="text"
                value={magicWord}
                onChange={(e) => setMagicWord(e.target.value)}
                placeholder="MAGIC WORD"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent px-4 text-[11px] uppercase tracking-widest text-white placeholder:text-white/45 outline-none sm:text-xs"
              />
              <button
                type="submit"
                className="shrink-0 bg-brand px-5 text-[11px] font-bold uppercase tracking-widest text-white sm:px-6 sm:text-xs"
              >
                ENTER
              </button>
            </>
          )}
          {locked && !isOrb && (
            <div className="h-full w-full bg-brand-dark" aria-hidden />
          )}
        </motion.form>
      </div>

      <AnimatePresence>{isHyper && <Particles key="particles" />}</AnimatePresence>

      <AnimatePresence>
        {isCrt && (
          <motion.div
            key="crt"
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white"
            initial={{ scaleY: 1, scaleX: 1, opacity: 1 }}
            animate={{
              scaleY: [1, 0.02, 0.02, 0],
              scaleX: [1, 1, 0.015, 0],
              opacity: [1, 1, 1, 0],
            }}
            transition={{
              duration: TIMING.crt / 1000,
              times: [0, 0.38, 0.68, 1],
              ease: [0.92, 0.04, 0.98, 0.2],
            }}
            style={{ transformOrigin: 'center center' }}
            onAnimationComplete={finishIntro}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
