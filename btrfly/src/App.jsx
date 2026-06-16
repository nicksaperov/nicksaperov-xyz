import { useCallback, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

// ——— Magic word logic ———
const BE_HEARD_WORDS = new Set([
  'please', 'kindly', 'help', 'listen', 'hear', 'share', 'tell', 'speak',
  'wait', 'stop', 'go', 'come', 'stay', 'leave', 'want', 'need', 'feel',
  'hope', 'wish', 'dream', 'think', 'know', 'see', 'look', 'find', 'give',
  'take', 'make', 'be', 'am', 'is', 'are', 'was', 'were', 'beautiful', 'brave',
  'quiet', 'loud', 'soft', 'hard', 'true', 'real', 'open', 'closed', 'lost',
  'found', 'sorry', 'thanks', 'thank',
]);
const VERB_SUFFIXES = /(ing|ed|ize|ise|ate|ify|en)$/i;
const ADJ_SUFFIXES = /(ful|less|ous|ive|al|ic|ed|ing|ary|ory)$/i;

function getMagicResponse(rawInput) {
  const input = rawInput.trim().toLowerCase();
  if (!input) return 'Be heard';
  if (input === 'love' || /\blove\b/.test(input)) return 'i wish you love (noun).';
  if (input.includes(' ')) return 'Be heard';
  if (BE_HEARD_WORDS.has(input)) return 'Be heard';
  if (VERB_SUFFIXES.test(input) || ADJ_SUFFIXES.test(input)) return 'Be heard';
  return 'Be heard';
}

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________@#$%&';

function runTextScramble(from, to, durationMs, onUpdate) {
  return new Promise((resolve) => {
    const start = performance.now();
    const maxLen = Math.max(from.length, to.length);

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      let output = '';

      for (let i = 0; i < maxLen; i += 1) {
        const targetChar = to[i] ?? '';
        const revealAt = 0.15 + (i / maxLen) * 0.85;
        if (progress >= revealAt && targetChar) output += targetChar;
        else if (targetChar) {
          output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)] || GLYPHS[0];
        }
      }

      onUpdate(output.trimEnd() || output);
      if (progress < 1) requestAnimationFrame(tick);
      else {
        onUpdate(to);
        resolve(to);
      }
    };

    requestAnimationFrame(tick);
  });
}

// ——— Intro animation ———
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

function IntroParticles() {
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

function Intro({ onComplete }) {
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
      animate={{ backgroundColor: isHyper || isCrt ? '#ffffff' : '#0047ff' }}
      transition={{
        backgroundColor: { duration: isHyper ? 0.45 : 0.2, ease: 'easeIn' },
      }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: isHyper || isCrt ? '#ffffff' : 'transparent' }}
        transition={{ duration: 0.45, ease: 'easeIn', delay: isHyper ? 0.15 : 0 }}
      />

      <motion.div className="absolute inset-0 flex flex-col items-center justify-center px-4">
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
      </motion.div>

      <AnimatePresence>{isHyper && <IntroParticles key="particles" />}</AnimatePresence>

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

// ——— Navigation ———
const NAV_ITEMS = [
  { id: 'where', label: 'WHERE I AM', to: '/where-i-am' },
  { id: 'who', label: 'WHO I AM', to: '/who-i-am' },
  { id: 'whats-for', label: 'WHATS FOR', to: '/whats-for' },
];

function Nav({ activeNav }) {
  return (
    <header className="px-4 py-6 md:px-10 md:py-8 lg:px-16">
      <nav
        className="grid grid-cols-1 gap-4 text-xs font-bold uppercase tracking-tight sm:grid-cols-3 sm:gap-0 sm:text-sm md:text-base"
        aria-label="Main"
      >
        {NAV_ITEMS.map(({ id, label, to }) => {
          const isActive = activeNav === id;
          return (
            <Link
              key={id}
              to={to}
              className={[
                'inline-flex items-center gap-2 transition-opacity hover:opacity-70',
                id === 'where' && 'sm:justify-self-start',
                id === 'who' && 'sm:justify-self-center',
                id === 'whats-for' && 'sm:justify-self-end',
                isActive && 'underline underline-offset-4',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {label}
              {isActive && (
                <span
                  className={[
                    'h-2 w-2 shrink-0 rounded-full',
                    id === 'who' ? 'bg-accent-yellow' : 'bg-brand',
                  ].join(' ')}
                  aria-hidden
                />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

// ——— Main gallery (WHO I AM / home) ———
function HomeGallery() {
  return (
    <div className="min-h-dvh bg-white pb-8 font-sans text-black selection:bg-black selection:text-white">
      <Nav activeNav="who" />
      <main className="mx-auto max-w-[1600px] px-4 pt-8 md:px-8 md:pt-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-12">
          <div className="flex flex-col gap-12 md:gap-24">
            <div className="flex flex-col gap-2">
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop"
                  alt="Portrait BW"
                  className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
                <span className="md:hidden">03</span>
                <span className="hidden md:inline">01</span>
              </span>
            </div>
            <span className="mt-8 text-[10px] font-bold tracking-widest text-gray-400 md:mt-0 md:text-xs">
              <span className="md:hidden">08</span>
              <span className="hidden md:inline">07</span>
            </span>
          </div>

          <div className="flex flex-col gap-12 md:gap-24 md:pt-12">
            <span className="hidden text-[10px] font-bold tracking-widest text-gray-400 md:block md:text-xs">
              02
            </span>
            <div className="flex flex-col gap-2">
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop"
                  alt="Kid"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
                <span className="md:hidden">01</span>
                <span className="hidden md:inline">03</span>
              </span>
            </div>
            <span className="mt-8 text-[10px] font-bold tracking-widest text-gray-400 md:hidden md:text-xs">
              09
            </span>
            <span className="mt-12 hidden text-[10px] font-bold tracking-widest text-gray-400 md:block md:text-xs">
              08
            </span>
          </div>

          <div className="flex flex-col gap-12 md:gap-24">
            <div className="hidden w-full justify-between md:flex">
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">04</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">05</span>
            </div>
            <span className="mt-12 hidden text-[10px] font-bold tracking-widest text-gray-400 md:block md:text-xs">
              09
            </span>
            <div className="flex flex-col gap-2 md:mt-24">
              <div className="group relative aspect-[3/4] w-full overflow-hidden bg-gray-100 md:w-4/5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
                  alt="Portrait Girl BW"
                  className="h-full w-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">
                <span className="md:hidden">05</span>
                <span className="hidden md:inline">10</span>
              </span>
            </div>
          </div>

          <div className="hidden flex-col gap-12 pt-8 md:flex md:gap-24">
            <div className="flex flex-col gap-2">
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop"
                  alt="Forest Portrait"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">06</span>
            </div>
            <span className="mt-12 text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">11</span>
            <span className="mt-12 text-[10px] font-bold tracking-widest text-gray-400 md:text-xs">12</span>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-start justify-between gap-16 md:mt-40 md:flex-row md:items-end md:gap-8">
          <div className="max-w-xl md:max-w-2xl">
            <p className="mb-8 text-[17px] font-medium leading-[1.3] tracking-tight text-black md:mb-10 md:text-[22px] md:leading-[1.25]">
              You are a presence woven from connections and collaborations as well as
              intertwined with hundreds of stories and experiences making you an inseparable
              part of this space where we are fellow travelers alongside researchers and
              designers and visionaries who do not simply showcase work but rather open up our
              inner worlds to ignite a shared wave so look closely at those around you and find
              your resonance.
            </p>
            <a
              href="#co-create"
              className="flex w-max items-center gap-2 text-sm font-bold uppercase text-brand transition-all duration-300 hover:gap-4 hover:opacity-80 md:text-base"
            >
              <ArrowRight size={18} strokeWidth={2.5} /> CO-CREATE
            </a>
          </div>
        </div>

        <div className="mt-24 flex flex-col-reverse items-start justify-between overflow-hidden pt-8 md:mt-32 md:flex-row md:items-end">
          <p className="mt-8 pb-2 text-sm font-semibold tracking-tight text-gray-500 md:mt-0 md:pb-6 md:text-xl">
            A space for collaboration &amp; community
          </p>
          <h1 className="-mb-2 select-none text-[25vw] font-black uppercase leading-[0.75] tracking-tighter md:-mb-5 md:-mr-4 md:text-[18vw]">
            BTRFLY
            <sup className="relative -ml-2 align-top text-[8vw] font-bold md:-ml-4 md:top-[2vw] md:text-[4vw]">
              ®
            </sup>
          </h1>
        </div>
      </main>
    </div>
  );
}

function SiteShell({ activeNav, children }) {
  return (
    <div className="min-h-dvh bg-surface font-sans text-ink">
      <Nav activeNav={activeNav} />
      {children}
    </div>
  );
}

function WhereIAmPage() {
  return (
    <SiteShell activeNav="where">
      <div className="min-h-[50dvh] px-4 md:px-10 lg:px-16" />
    </SiteShell>
  );
}

function WhatsForPage() {
  return (
    <SiteShell activeNav="whats-for">
      <div className="min-h-[50dvh] px-4 md:px-10 lg:px-16" />
    </SiteShell>
  );
}

// ——— App root ———
export default function App() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  const handleIntroComplete = () => {
    setIsIntroActive(false);
    setContentVisible(true);
  };

  return (
    <div className="min-h-dvh bg-black">
      {isIntroActive && <Intro onComplete={handleIntroComplete} />}

      <motion.div
        className="min-h-dvh"
        initial={{ opacity: 0 }}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        aria-hidden={!contentVisible}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeGallery />} />
            <Route path="/who-i-am" element={<HomeGallery />} />
            <Route path="/where-i-am" element={<WhereIAmPage />} />
            <Route path="/whats-for" element={<WhatsForPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </motion.div>
    </div>
  );
}
