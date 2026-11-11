import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, ChevronUp, X } from 'lucide-react';
import { useVideoScrub } from '@/useVideoScrub';

const DARK = '#1D3045';
const VIDEO_URL = 'assets/videos/hf_hero_optimized.mp4';

const NAV_LINKS = [
  { label: 'Home', href: 'index.html', active: true },
  { label: 'Zoho', href: 'pages/zoho.html', active: false },
  { label: 'Salesforce', href: 'pages/salesforce.html', active: false },
  { label: 'Digital Marketing', href: 'pages/digital-marketing.html', active: false },
  { label: 'Case Studies', href: 'pages/case-stories.html', active: false },
];

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { videoRef, canvasRef, scrollProgress, canvasLive } = useVideoScrub(
    VIDEO_URL,
    containerRef
  );

  const [navEntered, setNavEntered] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const userPausedRef = useRef(false);

  // Entrance animation for navbar items after 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavEntered(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Audio initialization and gesture unlock (identical to Zoho page)
  useEffect(() => {
    let audio = document.getElementById('zohoStoryAudio') as HTMLAudioElement | null;
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = 'zohoStoryAudio';
      audio.preload = 'auto';
      audio.loop = true;
      audio.src = 'assets/audio/name-story.mp3';
      document.body.appendChild(audio);
    }
    audio.volume = 0.85;

    const onPlay = () => setIsAudioPlaying(true);
    const onPause = () => {
      if (userPausedRef.current) {
        setIsAudioPlaying(false);
      }
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Initial play attempt
    const p = audio.play();
    if (p !== undefined) {
      p.then(() => setIsAudioPlaying(true)).catch(() => {
        // Autoplay caught by browser policy; wait for gesture
      });
    }

    const unlockEvents = ['pointerdown', 'mousedown', 'click', 'touchstart', 'touchend', 'scroll', 'wheel', 'keydown', 'mousemove'];
    const unlock = () => {
      if (audio && audio.paused && !userPausedRef.current) {
        audio.play().then(() => setIsAudioPlaying(true)).catch(() => {});
      }
      unlockEvents.forEach((evt) => window.removeEventListener(evt, unlock));
    };
    unlockEvents.forEach((evt) => window.addEventListener(evt, unlock, { passive: true }));

    return () => {
      audio?.removeEventListener('play', onPlay);
      audio?.removeEventListener('pause', onPause);
      unlockEvents.forEach((evt) => window.removeEventListener(evt, unlock));
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = document.getElementById('zohoStoryAudio') as HTMLAudioElement | null;
    if (!audio) return;
    if (!audio.paused || isAudioPlaying) {
      userPausedRef.current = true;
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      userPausedRef.current = false;
      audio.play().then(() => setIsAudioPlaying(true)).catch(() => {});
    }
  };

  const p = scrollProgress;

  // Continuous Smooth Opacities: solid windows, smooth cross-fades, no gaps
  // Section 1: visible from start (p = 0), holds until 0.18, smoothly cross-fades out between 0.18 and 0.32
  const s1Opacity =
    p < 0.18 ? 1 : p < 0.32 ? Math.max(0, 1 - (p - 0.18) / 0.14) : 0;

  // Section 2: cross-fades in between 0.18 and 0.32, holds firmly from 0.32 to 0.60, cross-fades out between 0.60 and 0.74
  const s2Opacity =
    p < 0.18
      ? 0
      : p < 0.32
      ? (p - 0.18) / 0.14
      : p < 0.60
      ? 1
      : p < 0.74
      ? Math.max(0, 1 - (p - 0.60) / 0.14)
      : 0;

  // Section 3: cross-fades in between 0.60 and 0.74, holds until 1.0
  const s3Opacity =
    p < 0.60 ? 0 : p < 0.74 ? (p - 0.60) / 0.14 : 1;

  // Stagger visibility: visible when section opacity > 0.05
  const s1StaggerVisible = s1Opacity > 0.05;
  const s2StaggerVisible = s2Opacity > 0.05;
  const s3StaggerVisible = s3Opacity > 0.05;

  // Color flips at p > 0.64: DARK -> white (when video enters dark mountain night scene)
  const isLight = p <= 0.64;
  const navColor = isLight ? DARK : '#FFFFFF';

  const scrollToNext = (targetP: number) => {
    if (!containerRef.current) return;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: maxScroll * targetP,
      behavior: 'smooth',
    });
  };

  const staggerTransition =
    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

  return (
    <div
      ref={containerRef}
      className="relative h-[500vh] w-full"
      style={{
        fontFamily: "'Helvetica Neue ME', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Sticky Full-Viewport Scene on both Desktop & Mobile */}
      <div
        className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden"
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100dvh',
          zIndex: 10,
        }}
      >
        {/* 1. Video Element (Full Cover Background, driven strictly by scroll) */}
        <video
          ref={videoRef}
          src={VIDEO_URL}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          // @ts-ignore
          webkit-playsinline="true"
          preload="auto"
        >
          <source src="assets/videos/hf_hero_optimized.mp4" type="video/mp4" />
          <source
            src="assets/videos/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4"
            type="video/mp4"
          />
        </video>

        {/* 3. Overlay Layer (Navbar + 3 Sequential Sections, no color overlays or gradients) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* =========================================================================
              NAVBAR (absolute top, z-50, pointer-events-auto)
              ========================================================================= */}
          <header
            className="absolute top-0 left-0 right-0 z-50 pointer-events-auto px-6 sm:px-8 md:px-12 lg:px-16 pt-7 sm:pt-9 pb-5 flex items-center justify-between transition-colors duration-500"
            style={{ color: navColor }}
          >
            {/* Left: Digiolic Brand Logo */}
            <a
              href="index.html"
              className={`flex items-center gap-2 hover:opacity-90 transition-all duration-500 ${
                navEntered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
              }`}
              style={{
                transition:
                  'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '50ms',
              }}
              aria-label="Digiolic Home"
            >
              <div className="relative h-8 sm:h-9 w-auto flex items-center">
                <img
                  src="assets/images/digiolic-logo-dark.png?v=20260927_green_d"
                  alt="Digiolic"
                  className="h-8 sm:h-9 w-auto object-contain transition-opacity duration-500"
                  style={{
                    opacity: isLight ? 1 : 0,
                    filter: 'none',
                  }}
                />
                <img
                  src="assets/images/digiolic-logo.png?v=20260927_green_d"
                  alt="Digiolic"
                  className="absolute inset-0 h-8 sm:h-9 w-auto object-contain transition-opacity duration-500 pointer-events-none"
                  style={{
                    opacity: isLight ? 0 : 1,
                    filter: 'none',
                  }}
                />
              </div>
            </a>

            {/* Right: Sound Controller + Menu Trigger with Ring Icon */}
            <div
              className="flex items-center gap-3 sm:gap-4 ml-auto"
              style={{
                opacity: navEntered ? 1 : 0,
                transform: navEntered ? 'translateY(0)' : 'translateY(-12px)',
                transition:
                  'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '300ms',
              }}
            >
              {/* Circular Audio Toggle Button (Exact match to Zoho page) */}
              <button
                type="button"
                className={`nav-sound-control ${isAudioPlaying ? 'is-playing' : 'is-paused'}`}
                id="zohoAudioToggleBtn"
                onClick={toggleAudio}
                aria-label="Play or pause background song"
                title={isAudioPlaying ? 'Pause Song' : 'Play Song'}
                aria-pressed={isAudioPlaying ? 'true' : 'false'}
                tabIndex={0}
                style={{
                  color: navColor,
                  background: isLight ? 'rgba(29, 48, 69, 0.12)' : 'rgba(255, 255, 255, 0.16)',
                  transition:
                    'background-color 0.25s ease, color 500ms ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Playing state: Speaker with Sound Waves */}
                <svg
                  className="sound-icon sound-icon-playing"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path
                    className="sound-wave-1"
                    d="M15.54 8.46a5 5 0 0 1 0 7.07"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    className="sound-wave-2"
                    d="M19.07 4.93a10 10 0 0 1 0 14.14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Paused state: Speaker Muted */}
                <svg
                  className="sound-icon sound-icon-paused"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line
                    x1="23"
                    y1="9"
                    x2="17"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="17"
                    y1="9"
                    x2="23"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                id="cinematicMenuOpenBtn"
                onClick={() => {
                  if (typeof (window as any).openCinematicMenu === 'function') {
                    (window as any).openCinematicMenu();
                  }
                }}
                className="cinematic-menu-trigger"
                style={{
                  color: navColor,
                  transition: 'color 500ms ease, opacity 0.25s ease, transform 0.25s ease',
                }}
                aria-label="Open Navigation Menu"
              >
                <span className="menu-trigger-text">Menu</span>
                <span className="menu-trigger-circle"></span>
              </button>
            </div>
          </header>

          {/* =========================================================================
              SECTION 1 (hero, centered)
              ========================================================================= */}
          <section
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-12 pt-16 sm:pt-20 md:pt-0"
            style={{
              opacity: s1Opacity,
              pointerEvents: s1Opacity > 0.1 ? 'auto' : 'none',
            }}
          >
            <div className="max-w-[1400px] w-full flex flex-col items-center text-center px-1 sm:px-2 pb-16 md:pb-0">
              {/* Experience Badge */}
              <div
                className="hero-home-exp-badge inline-flex items-center justify-center gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-6 select-none"
                style={{
                  backgroundColor: '#000000',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
                  opacity: s1StaggerVisible ? 1 : 0,
                  transform: s1StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '0ms',
                }}
              >
                <span className="hero-home-exp-badge-text text-white font-extrabold text-[10.5px] sm:text-[13.5px] uppercase tracking-wider leading-none">
                  30+ Years of Experience with Certified Team
                </span>
              </div>

              {/* H1 Main Heading */}
              <h1
                className="hero-brand-heading font-extrabold tracking-tight leading-[1.15] sm:leading-[1.1] text-center max-w-full"
                style={{
                  color: DARK,
                  fontSize: 'clamp(26px, 7vw, 64px)',
                  letterSpacing: '-0.035em',
                  opacity: s1StaggerVisible ? 1 : 0,
                  transform: s1StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '0ms',
                }}
              >
                <span className="hero-brand-anim hero-brand-zoho">Zoho</span>{', '}
                <span className="hero-brand-anim hero-brand-salesforce">Salesforce</span>{', and '}
                <span className="hero-brand-anim hero-brand-marketing">Digital Marketing</span>
              </h1>

              {/* H3 Tagline */}
              <h3
                className="hero-brand-tagline mt-2 sm:mt-3 font-extrabold tracking-tight leading-[1.2] text-center max-w-full"
                style={{
                  color: DARK,
                  fontSize: 'clamp(17px, 4.5vw, 48px)',
                  letterSpacing: '-0.025em',
                  opacity: s1StaggerVisible ? 1 : 0,
                  transform: s1StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '100ms',
                }}
              >
                Complexity Simplified, Growth Amplified
              </h3>

              {/* Subtitle */}
              <p
                className="mt-3 sm:mt-5 text-[14px] sm:text-[18px] md:text-[20px] max-w-2xl text-center leading-[1.5] sm:leading-[1.6] font-normal px-2"
                style={{
                  color: '#1E293B',
                  opacity: s1StaggerVisible ? 1 : 0,
                  transform: s1StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '200ms',
                }}
              >
                Let's make your business incredible together by uniting powerful Zoho and Salesforce architectures with performance-driven digital marketing.
              </p>
            </div>

            {/* Bottom-right circle button to scroll to Section 2 */}
            <button
              onClick={() => scrollToNext(0.42)}
              className="absolute bottom-8 sm:bottom-12 right-6 sm:right-8 md:right-12 w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity duration-300 z-30 pointer-events-auto"
              style={{
                border: '1px solid #1D304580',
                color: DARK,
                opacity: s1StaggerVisible ? 1 : 0,
                transform: s1StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: staggerTransition,
                transitionDelay: '300ms',
              }}
              aria-label="Next Section"
            >
              <ArrowRight size={18} />
            </button>
          </section>

          {/* =========================================================================
              SECTION 2 (center)
              ========================================================================= */}
          <section
            className="absolute inset-0 flex items-center justify-center px-6 sm:px-8 pt-16 sm:pt-20 md:pt-0"
            style={{
              opacity: s2Opacity,
              pointerEvents: s2Opacity > 0.1 ? 'auto' : 'none',
            }}
          >
            <div className="max-w-[900px] w-full text-center flex flex-col items-center px-4 pb-24 md:pb-0">
              {/* Eyebrow */}
              <div
                className="text-xs sm:text-sm font-light tracking-[0.25em] uppercase mb-4"
                style={{
                  color: DARK,
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '0ms',
                }}
              >
                • PRECISION EXECUTION
              </div>

              {/* H2 */}
              <h2
                className="font-extralight tracking-wide leading-[1.3] text-center uppercase"
                style={{
                  color: DARK,
                  fontSize: 'clamp(1.8rem, 5.4vw, 5.4rem)',
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '0ms',
                }}
              >
                SCALING ENTERPRISE POTENTIAL &amp; VELOCITY
              </h2>

              {/* Subtitle */}
              <p
                className="mt-6 text-sm sm:text-base tracking-[0.2em] uppercase max-w-2xl text-center leading-relaxed px-2"
                style={{
                  color: `${DARK}E6`,
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '150ms',
                }}
              >
                From strategy to flawless cloud execution. We eliminate operational silos, automate mission-critical workflows, and accelerate pipeline velocity.
              </p>
            </div>

            {/* Right column buttons: 48px circle down, three dots, 40px circle up */}
            <div
              className="absolute bottom-12 sm:bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4 z-30 pointer-events-auto"
            >
              {/* Down arrow button */}
              <button
                onClick={() => scrollToNext(0.78)}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity duration-300"
                style={{
                  border: `1px solid ${DARK}66`,
                  color: DARK,
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '200ms',
                }}
                aria-label="Scroll Down"
              >
                <ArrowDown size={18} />
              </button>

              {/* Three dots: 8px solid DARK (active), 6px DARK 40%, 6px DARK 40%, gap-2 */}
              <div
                className="flex flex-col items-center gap-2 mt-4"
                style={{
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '350ms',
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DARK }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${DARK}66` }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${DARK}66` }} />
              </div>

              {/* Up arrow button */}
              <button
                onClick={() => scrollToNext(0)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity duration-300 mt-2"
                style={{
                  border: `1px solid ${DARK}4D`,
                  color: `${DARK}CC`,
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '500ms',
                }}
                aria-label="Scroll to Top"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </section>

          {/* =========================================================================
              SECTION 3 (right aligned, white type — video is dark here, text directly on video)
              ========================================================================= */}
          <section
            className="absolute inset-0 flex items-center justify-center md:justify-end px-6 sm:px-8 md:px-20 lg:px-32 pt-16 sm:pt-20 md:pt-0"
            style={{
              opacity: s3Opacity,
              pointerEvents: s3Opacity > 0.1 ? 'auto' : 'none',
            }}
          >
            <div className="max-w-2xl text-center md:text-left flex flex-col items-center md:items-start">
              {/* Eyebrow */}
              <div
                className="text-white/80 font-bold text-base sm:text-lg tracking-wider mb-4"
                style={{
                  fontWeight: 800,
                  opacity: s3StaggerVisible ? 1 : 0,
                  transform: s3StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '0ms',
                }}
              >
                • THE DIGIOLIC PROMISE
              </div>

              {/* H2 */}
              <h2
                className="font-light text-white leading-[1.2] uppercase tracking-wide mb-6 sm:mb-8"
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 4rem)',
                  opacity: s3StaggerVisible ? 1 : 0,
                  transform: s3StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '150ms',
                }}
              >
                YOUR GROWTH IS OUR MISSION
                <br />
                <span
                  className="text-[0.55em] font-normal leading-normal block mt-3 normal-case tracking-normal text-white/90"
                >
                  Connecting CRM, automation, and full-funnel performance marketing into a synchronized revenue powerhouse
                </span>
              </h2>

              {/* CTA Row */}
              <div
                className="flex items-center gap-4 cursor-pointer group pointer-events-auto"
                style={{
                  opacity: s3StaggerVisible ? 1 : 0,
                  transform: s3StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition: staggerTransition,
                  transitionDelay: '300ms',
                }}
                onClick={() => {
                  window.location.href = 'pages/contact.html';
                }}
              >
                <span
                  className="text-sm tracking-[0.3em] text-white/90 font-bold uppercase group-hover:text-white transition-colors"
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Contact Us
                </span>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight size={16} className="text-gray-800" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}
