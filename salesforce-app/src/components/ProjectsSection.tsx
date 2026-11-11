import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useInView,
  type MotionValue,
} from 'framer-motion';

const EASING: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* -------------------------------------------------------------------------- */
/*                               Data Definitions                             */
/* -------------------------------------------------------------------------- */

interface FloatingSquareConfig {
  x: number;
  y: number;
  size: number;
}

const TOP_FLOATING_SQUARES: FloatingSquareConfig[] = [
  { x: 6, y: 20, size: 12 },
  { x: 12, y: 32, size: 8 },
  { x: 8, y: 44, size: 6 },
  { x: 88, y: 18, size: 10 },
  { x: 92, y: 30, size: 14 },
  { x: 85, y: 42, size: 7 },
  { x: 90, y: 52, size: 5 },
  { x: 14, y: 56, size: 5 },
];

interface CaseStudy {
  id: string;
  company: string;
  service: string;
  serviceClass: 'zoho' | 'salesforce';
  location: string;
  image: string;
  magneticSquares: FloatingSquareConfig[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-blume-labs',
    company: 'Blume Labs',
    service: 'Zoho Enterprise',
    serviceClass: 'zoho',
    location: 'Location: Bangalore, India',
    image: '../assets/images/case-studies/landmarks/blume-tech.jpg',
    magneticSquares: [
      { x: 5, y: 30, size: 16 },
      { x: 10, y: 42, size: 10 },
      { x: 3, y: 52, size: 7 },
      { x: 80, y: 70, size: 14 },
      { x: 85, y: 82, size: 9 },
      { x: 78, y: 60, size: 6 },
    ],
  },
  {
    id: 'case-pierian',
    company: 'Pierian Technologies',
    service: 'Zoho Enterprise',
    serviceClass: 'zoho',
    location: 'Location: Bangalore, India',
    image: '../assets/images/case-studies/landmarks/bangalore-finance.jpg',
    magneticSquares: [
      { x: 82, y: 55, size: 16 },
      { x: 88, y: 68, size: 10 },
      { x: 78, y: 72, size: 7 },
      { x: 85, y: 42, size: 6 },
      { x: 90, y: 80, size: 8 },
    ],
  },
  {
    id: 'case-fyx',
    company: 'FYX Finance',
    service: 'Zoho Enterprise',
    serviceClass: 'zoho',
    location: 'Location: Sydney, Australia',
    image: '../assets/images/case-studies/landmarks/sydney-opera.jpg',
    magneticSquares: [
      { x: 4, y: 24, size: 16 },
      { x: 10, y: 36, size: 10 },
      { x: 2, y: 44, size: 7 },
      { x: 78, y: 78, size: 14 },
      { x: 84, y: 88, size: 8 },
    ],
  },
  {
    id: 'case-monster-india',
    company: 'Monster India',
    service: 'Salesforce Cloud',
    serviceClass: 'salesforce',
    location: 'Location: Noida, India',
    image: '../assets/images/case-studies/landmarks/india-gate.jpg',
    magneticSquares: [
      { x: 82, y: 26, size: 14 },
      { x: 88, y: 38, size: 10 },
      { x: 78, y: 44, size: 7 },
      { x: 84, y: 54, size: 5 },
      { x: 90, y: 60, size: 8 },
    ],
  },
  {
    id: 'case-greenworld',
    company: 'Greenworld Solarwares',
    service: 'Zoho Enterprise',
    serviceClass: 'zoho',
    location: 'Location: Chhattisgarh, India',
    image: '../assets/images/case-studies/landmarks/solar-energy.jpg',
    magneticSquares: [
      { x: 6, y: 40, size: 14 },
      { x: 12, y: 52, size: 9 },
      { x: 4, y: 62, size: 6 },
      { x: 82, y: 30, size: 16 },
      { x: 88, y: 42, size: 10 },
    ],
  },
  {
    id: 'case-verzeo',
    company: 'Verzeo Technologies',
    service: 'Salesforce Cloud',
    serviceClass: 'salesforce',
    location: 'Location: Bangalore, India',
    image: '../assets/images/case-studies/landmarks/bangalore-vidhana.jpg',
    magneticSquares: [
      { x: 5, y: 30, size: 16 },
      { x: 10, y: 42, size: 10 },
      { x: 80, y: 70, size: 14 },
      { x: 85, y: 82, size: 9 },
      { x: 78, y: 60, size: 6 },
    ],
  },
  {
    id: 'case-nz-immigration',
    company: 'NZ Immigration',
    service: 'Zoho Enterprise',
    serviceClass: 'zoho',
    location: 'Location: Auckland, New Zealand',
    image: '../assets/images/case-studies/landmarks/new-zealand.jpg',
    magneticSquares: [
      { x: 82, y: 55, size: 16 },
      { x: 88, y: 68, size: 10 },
      { x: 78, y: 72, size: 7 },
      { x: 85, y: 42, size: 6 },
      { x: 90, y: 80, size: 8 },
    ],
  },
  {
    id: 'case-banaraswala',
    company: 'Banaraswala',
    service: 'Salesforce Cloud',
    serviceClass: 'salesforce',
    location: 'Location: Delhi, India',
    image: '../assets/images/case-studies/landmarks/delhi-qutub.jpg',
    magneticSquares: [
      { x: 4, y: 24, size: 16 },
      { x: 10, y: 36, size: 10 },
      { x: 2, y: 44, size: 7 },
      { x: 78, y: 78, size: 14 },
      { x: 84, y: 88, size: 8 },
    ],
  },
  {
    id: 'case-loomcrafts',
    company: 'Loom Crafts',
    service: 'Salesforce Cloud',
    serviceClass: 'salesforce',
    location: 'Location: Ghaziabad, India',
    image: '../assets/images/case-studies/landmarks/agra-taj.jpg',
    magneticSquares: [
      { x: 82, y: 26, size: 14 },
      { x: 88, y: 38, size: 10 },
      { x: 78, y: 44, size: 7 },
      { x: 84, y: 54, size: 5 },
      { x: 90, y: 60, size: 8 },
    ],
  },
  {
    id: 'case-chanakya-university',
    company: 'Chanakya University',
    service: 'Zoho Enterprise',
    serviceClass: 'zoho',
    location: 'Location: Bangalore, India',
    image: '../assets/images/case-studies/landmarks/chanakya-univ.jpg',
    magneticSquares: [
      { x: 6, y: 40, size: 14 },
      { x: 12, y: 52, size: 9 },
      { x: 4, y: 62, size: 6 },
      { x: 82, y: 30, size: 16 },
      { x: 88, y: 42, size: 10 },
    ],
  },
];

const COLS = 12;
const ROWS = 8;
const PIXEL_BLOCKS = Array.from({ length: ROWS * COLS }, (_, idx) => {
  const row = Math.floor(idx / COLS);
  const col = idx % COLS;
  return { row, col, id: `${row}-${col}` };
});

/* -------------------------------------------------------------------------- */
/*                               Logo SVGs                                    */
/* -------------------------------------------------------------------------- */

const MARQUEE_LOGOS = [
  {
    name: 'Codecraft_',
    icon: (
      <svg
        width="22"
        height="18"
        viewBox="0 0 22 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <polyline points="6,4 1,9 6,14" />
        <polyline points="16,4 21,9 16,14" />
        <line x1="13" y1="2" x2="9" y2="16" />
      </svg>
    ),
  },
  {
    name: 'ennLabs',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="shrink-0"
      >
        {[3, 10, 17].map((x) =>
          [3, 10, 17].map((y) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" />
          ))
        )}
      </svg>
    ),
  },
  {
    name: 'GlobalBank',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="shrink-0"
      >
        <circle cx="11" cy="11" r="9" />
        <circle cx="11" cy="11" r="4" />
      </svg>
    ),
  },
  {
    name: '45 Degrees\u00B0',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <line x1="2" y1="16" x2="16" y2="2" />
        <polyline points="7,2 16,2 16,11" />
      </svg>
    ),
  },
  {
    name: 'AlphaWave',
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="shrink-0"
      >
        <circle cx="11" cy="11" r="9" />
        <path d="M5 11Q8 7 11 11Q14 15 17 11" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Biosynthesis',
    icon: (
      <svg
        width="24"
        height="18"
        viewBox="0 0 24 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="shrink-0"
      >
        <line x1="0" y1="3" x2="24" y2="3" />
        <line x1="6" y1="9" x2="24" y2="9" />
        <line x1="0" y1="15" x2="18" y2="15" />
      </svg>
    ),
  },
  {
    name: 'Boltshift',
    icon: (
      <svg
        width="14"
        height="20"
        viewBox="0 0 14 20"
        fill="currentColor"
        className="shrink-0"
      >
        <polygon points="8,0 0,11 6,11 6,20 14,9 8,9" />
      </svg>
    ),
  },
  {
    name: 'Clandestine',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="currentColor"
        className="shrink-0"
      >
        <rect x="7.5" y="0" width="3" height="18" />
        <rect x="0" y="7.5" width="18" height="3" />
      </svg>
    ),
  },
];

/* -------------------------------------------------------------------------- */
/*                         Subcomponent: Floating Parallax Square             */
/* -------------------------------------------------------------------------- */

interface FloatingSquareProps {
  index: number;
  x: number;
  y: number;
  size: number;
  scrollYProgress: any;
}

const FloatingSquare: React.FC<FloatingSquareProps> = ({
  index,
  x,
  y,
  size,
  scrollYProgress,
}) => {
  const maxParallax = -(80 + index * 30);
  const rawY = useTransform(scrollYProgress, [0, 1], [0, maxParallax]);
  const smoothY = useSpring(rawY, { stiffness: 40, damping: 20 });

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        y: smoothY,
      }}
    >
      <motion.div
        className="h-full w-full bg-white"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 3 + index * 0.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.3,
        }}
      />
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                         Subcomponent: Magnetic Square                      */
/* -------------------------------------------------------------------------- */

const MAGNETIC_SPRING = { stiffness: 80, damping: 18, mass: 0.6 };

interface MagneticSquareProps {
  sq: FloatingSquareConfig;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isHovered: boolean;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

const MagneticSquare: React.FC<MagneticSquareProps> = ({
  sq,
  mouseX,
  mouseY,
  isHovered,
  cardRef,
}) => {
  const springX = useSpring(0, MAGNETIC_SPRING);
  const springY = useSpring(0, MAGNETIC_SPRING);

  const updateOffset = useCallback(() => {
    if (!isHovered) {
      springX.set(0);
      springY.set(0);
      return;
    }
    const rect = cardRef.current?.getBoundingClientRect();
    const w = rect ? rect.width : 500;
    const h = rect ? rect.height : 375;
    springX.set((mouseX.get() - sq.x / 100) * w * 0.28);
    springY.set((mouseY.get() - sq.y / 100) * h * 0.28);
  }, [isHovered, mouseX, mouseY, sq.x, sq.y, cardRef, springX, springY]);

  useEffect(() => {
    updateOffset();
  }, [updateOffset]);

  useMotionValueEvent(mouseX, 'change', updateOffset);
  useMotionValueEvent(mouseY, 'change', updateOffset);

  return (
    <motion.div
      className="pointer-events-none absolute bg-white shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
      style={{
        left: `${sq.x}%`,
        top: `${sq.y}%`,
        width: `${sq.size}px`,
        height: `${sq.size}px`,
        x: springX,
        y: springY,
      }}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                         Subcomponent: Case Study Card                      */
/* -------------------------------------------------------------------------- */

interface CardProps {
  study: CaseStudy;
  index: number;
}

const CaseStudyCard: React.FC<CardProps> = ({ study, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const touchTimerRef = useRef<number | null>(null);
  const touchStartYRef = useRef(0);
  const isScrollGestureRef = useRef(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const updatePointer = useCallback(
    (clientX: number, clientY: number, el: HTMLDivElement) => {
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      mouseX.set((clientX - rect.left) / rect.width);
      mouseY.set((clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  const resetInteraction = useCallback(() => {
    if (touchTimerRef.current !== null) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  useEffect(() => resetInteraction, [resetInteraction]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updatePointer(e.clientX, e.clientY, e.currentTarget);
    },
    [updatePointer]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updatePointer(e.clientX, e.clientY, e.currentTarget);
      setIsHovered(true);
    },
    [updatePointer]
  );

  const handleMouseLeave = useCallback(() => {
    resetInteraction();
  }, [resetInteraction]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (touchTimerRef.current !== null) {
        window.clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
      isScrollGestureRef.current = false;
      const touch = e.touches[0];
      if (touch) {
        touchStartYRef.current = touch.clientY;
        updatePointer(touch.clientX, touch.clientY, e.currentTarget);
        setIsHovered(true);
      }
    },
    [updatePointer]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (!touch) return;
      if (!isScrollGestureRef.current && Math.abs(touch.clientY - touchStartYRef.current) > 16) {
        isScrollGestureRef.current = true;
        resetInteraction();
        return;
      }
      if (!isScrollGestureRef.current) {
        updatePointer(touch.clientX, touch.clientY, e.currentTarget);
      }
    },
    [resetInteraction, updatePointer]
  );

  const handleTouchEnd = useCallback(() => {
    if (isScrollGestureRef.current) {
      resetInteraction();
      return;
    }
    touchTimerRef.current = window.setTimeout(() => {
      resetInteraction();
    }, 650);
  }, [resetInteraction]);

  const handleCardClick = () => {
    if (typeof (window as any).openCaseStudyModal === 'function') {
      (window as any).openCaseStudyModal(study.id);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.1, ease: EASING }}
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded border border-white/15 bg-neutral-950 transition-colors hover:border-white/35"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchCancel={resetInteraction}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${study.company} Case Study`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* 1. Background image */}
      <img
        src={study.image}
        alt={study.company}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* 2. Pixel-block diagonal hover overlay (12 x 8) with isolated group opacity to eliminate seams & dark grid lines */}
      <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden opacity-80">
        {PIXEL_BLOCKS.map((b) => (
          <motion.div
            key={b.id}
            className="absolute bg-black"
            style={{
              width: `calc(${100 / COLS}% + 1.5px)`,
              height: `calc(${100 / ROWS}% + 1.5px)`,
              left: `${(b.col * 100) / COLS}%`,
              top: `${(b.row * 100) / ROWS}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isHovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
            }
            transition={{
              duration: 0.25,
              delay: isHovered
                ? (b.row + b.col) * 0.018
                : (ROWS - b.row + (COLS - b.col)) * 0.012,
              ease: EASING,
            }}
          />
        ))}
      </div>

      {/* 3. Magnetic black squares */}
      <div className="pointer-events-none absolute inset-0 z-[15]">
        {study.magneticSquares.map((sq, i) => (
          <MagneticSquare
            key={i}
            sq={sq}
            mouseX={mouseX}
            mouseY={mouseY}
            isHovered={isHovered}
            cardRef={cardRef}
          />
        ))}
      </div>

      {/* 4. Top-Right Location Details */}
      <div className="absolute right-3 top-3 z-[20] flex max-w-[calc(100%-1.5rem)] items-center sm:right-4 sm:top-4 sm:max-w-[calc(100%-2rem)]">
        <span className="inline-flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-white/35 bg-black/65 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white shadow-md backdrop-blur transition-colors duration-200 group-hover:border-white/60 group-hover:bg-black/90 sm:px-3 sm:py-1.5 sm:text-[11px]">
          <svg className="h-3 w-3 shrink-0 opacity-85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {study.location}
        </span>
      </div>

      {/* 5. Info plate (bottom left) */}
      <div
        className="absolute bottom-0 left-0 bg-black px-4 pb-3 pt-2.5"
        style={{ zIndex: 20, maxWidth: '82%' }}
      >
        <h3 className="text-[clamp(1.4rem,2.2vw,2rem)] font-normal leading-tight tracking-normal text-white">
          {study.company}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-4">
          <span className="text-[12px] font-normal text-white/60">
            {study.service}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

export default function ProjectsSection(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const isHeaderInView = useInView(headerRef, { once: true, margin: '-60px' });
  const doubledLogos = [...MARQUEE_LOGOS, ...MARQUEE_LOGOS];

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-white/10 bg-black text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @keyframes marqueeProjects {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-projects {
          animation: marqueeProjects 28s linear infinite;
        }
        .marquee-projects:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* -------------------------------------------------------------------- */}
      {/* Top Area (Header with floating squares)                              */}
      {/* -------------------------------------------------------------------- */}
      <div className="relative px-6 pb-10 pt-32 sm:px-10 lg:px-16 lg:pt-40">
        {/* Parallax floating squares */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {TOP_FLOATING_SQUARES.map((sq, i) => (
            <FloatingSquare
              key={i}
              index={i}
              x={sq.x}
              y={sq.y}
              size={sq.size}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

        {/* Centered header text */}
        <div ref={headerRef} className="relative mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={
              isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }
            }
            transition={{ duration: 0.7, ease: EASING }}
          >
            <span className="mb-5 inline-block bg-white px-4 py-1.5 text-[13px] font-medium tracking-wide text-black">
              Projects
            </span>
            <h2 className="text-[clamp(1.8rem,3.2vw,2.8rem)] font-light leading-[1.25] tracking-tight">
              <span className="text-white">Insights from </span>
              <span className="text-white/45">Our</span>
              <br />
              <span className="text-white/45">Case Studies</span>
            </h2>
          </motion.div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Case Study Cards (2-column responsive grid)                         */}
      {/* -------------------------------------------------------------------- */}
      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-10 lg:px-16">
        <div className="grid gap-6 md:grid-cols-2">
          {CASE_STUDIES.map((study, idx) => (
            <CaseStudyCard key={study.id} study={study} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
