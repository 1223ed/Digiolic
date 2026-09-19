import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, ChevronUp, Info, X } from 'lucide-react';
import { useVideoScrub } from '@/useVideoScrub';

const DARK = '#1D3045';
const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4';

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navEntered, setNavEntered] = useState(false);

  // Entrance animation for navbar items after 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavEntered(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const p = scrollProgress;

  // Opacities per specification
  // s1Opacity: p < 0.20 -> 1, else -> max(0, 1 - (p - 0.20) / 0.08)
  const s1Opacity = p < 0.2 ? 1 : Math.max(0, 1 - (p - 0.2) / 0.08);

  // s2Opacity: p < 0.32 -> 0, p < 0.40 -> (p - 0.32) / 0.08, p < 0.55 -> 1, else -> max(0, 1 - (p - 0.55) / 0.08)
  const s2Opacity =
    p < 0.32
      ? 0
      : p < 0.4
      ? (p - 0.32) / 0.08
      : p < 0.55
      ? 1
      : Math.max(0, 1 - (p - 0.55) / 0.08);

  // s3Opacity: p < 0.67 -> 0, p < 0.75 -> (p - 0.67) / 0.08, else -> 1
  const s3Opacity = p < 0.67 ? 0 : p < 0.75 ? (p - 0.67) / 0.08 : 1;

  // Stagger visibility threshold: section opacity > 0.3
  const s1StaggerVisible = s1Opacity > 0.3;
  const s2StaggerVisible = s2Opacity > 0.3;
  const s3StaggerVisible = s3Opacity > 0.3;

  // Color flips at p > 0.55: DARK -> white (duration-500)
  const isLight = p <= 0.55;
  const navColor = isLight ? DARK : '#FFFFFF';
  const navInvertedBg = isLight ? '#FFFFFF' : DARK;

  const scrollToNext = (targetP: number) => {
    if (!containerRef.current) return;
    const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: maxScroll * targetP,
      behavior: 'smooth',
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[500vh] w-full"
      style={{
        fontFamily: "'Helvetica Neue ME', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* 1. Video Element (Full Cover Background, AutoPlay on Mobile & Fallback) */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          // @ts-ignore
          webkit-playsinline="true"
          preload="auto"
        >
          <source
            src="assets/videos/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4"
            type="video/mp4"
          />
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* 2. WebCodecs Frame Bank Canvas (Full Cover) */}
        <canvas
          ref={canvasRef}
          width={1920}
          height={1080}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            canvasLive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* 3. Overlay Layer (Navbar + 3 Sequential Sections) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* =========================================================================
              NAVBAR (Digiolic Brand Header — Exact Match to Tabs Image)
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
              <img
                src="assets/images/digiolic-logo-dark.png?v=20260911_v4"
                alt="Digiolic"
                className="h-8 sm:h-9 w-auto object-contain transition-all duration-500"
                style={{
                  filter: isLight ? 'none' : 'brightness(0) invert(1)',
                }}
              />
            </a>

            {/* Center: Navigation Tabs (Home, Zoho, Salesforce, Digital Marketing, Case Studies) */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-10">
              {NAV_LINKS.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`relative text-[14px] sm:text-[15px] transition-all duration-300 hover:opacity-80 ${
                    link.active ? 'font-bold' : 'font-medium'
                  }`}
                  style={{
                    color: link.active
                      ? (isLight ? '#000000' : '#FFFFFF')
                      : (isLight ? '#1E293B' : 'rgba(255, 255, 255, 0.9)'),
                    opacity: navEntered ? 1 : 0,
                    transform: navEntered ? 'translateY(0)' : 'translateY(-12px)',
                    transition:
                      'color 500ms ease, opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 60 + 100}ms`,
                  }}
                >
                  {link.label}
                  {link.active && (
                    <span
                      className="absolute -bottom-2.5 left-0 w-full h-[2.5px] rounded-full transition-colors duration-500"
                      style={{ backgroundColor: isLight ? '#000000' : '#FFFFFF' }}
                    />
                  )}
                </a>
              ))}
            </nav>

            {/* Right: Contact Us Pill Button + Mobile Hamburger */}
            <div
              className="flex items-center gap-4"
              style={{
                opacity: navEntered ? 1 : 0,
                transform: navEntered ? 'translateY(0)' : 'translateY(-12px)',
                transition:
                  'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '400ms',
              }}
            >
              {/* Contact Us Pill Button */}
              <a
                href="pages/contact.html"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md hover:scale-[1.02] hover:shadow-lg"
                style={{
                  backgroundColor: '#000000',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)',
                }}
              >
                Contact Us
              </a>

              {/* Mobile <md: Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden flex flex-col justify-center items-start gap-[5px] w-8 h-8 focus:outline-none ml-1"
                aria-label="Open Mobile Menu"
              >
                <span
                  className="w-6 h-[2px] rounded transition-colors duration-500"
                  style={{ backgroundColor: navColor }}
                />
                <span
                  className="w-6 h-[2px] rounded transition-colors duration-500"
                  style={{ backgroundColor: navColor }}
                />
                <span
                  className="w-4 h-[2px] rounded transition-colors duration-500"
                  style={{ backgroundColor: navColor }}
                />
              </button>
            </div>
          </header>

          {/* =========================================================================
              SECTION 1 (hero, centered, exact style from screenshot)
              ========================================================================= */}
          <section
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-2 sm:px-8 md:px-12"
            style={{
              opacity: s1Opacity,
              transition: 'opacity 0.1s ease-out',
              pointerEvents: s1Opacity > 0.1 ? 'auto' : 'none',
            }}
          >
            <div className="max-w-[1400px] w-full flex flex-col items-center text-center px-1 sm:px-2">
              {/* Experience Badge */}
              <div
                className="inline-flex items-center justify-center gap-2.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full mb-5 sm:mb-6 shadow-sm select-none"
                style={{
                  backgroundColor: 'rgba(238, 246, 255, 0.95)',
                  border: '1.5px solid #BFDBFE',
                  opacity: s1StaggerVisible ? 1 : 0,
                  transform: s1StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '0ms',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]"
                  style={{
                    boxShadow: '0 0 0 3px rgba(56, 189, 248, 0.28), 0 0 8px rgba(56, 189, 248, 0.65)',
                  }}
                />
                <span className="text-[#1D4ED8] font-extrabold text-[12px] sm:text-[13.5px] uppercase tracking-wider leading-none">
                  8+ YEARS OF EXPERIENCE WITH A CERTIFIED TEAM
                </span>
              </div>

              {/* H1 Main Heading */}
              <h1
                className="hero-brand-heading font-extrabold tracking-tight leading-[1.1] whitespace-normal sm:whitespace-nowrap w-full max-w-full text-center"
                style={{
                  color: '#000000',
                  fontSize: '64px',
                  letterSpacing: '-0.035em',
                  opacity: s1StaggerVisible ? 1 : 0,
                  transform: s1StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '0ms',
                }}
              >
                <span className="hero-brand-anim hero-brand-zoho">Zoho</span>{', '}
                <span className="hero-brand-anim hero-brand-salesforce">Salesforce</span>{', and '}
                <span className="hero-brand-anim hero-brand-marketing">Digital Marketing</span>
              </h1>

              {/* H3 Tagline */}
              <h3
                className="hero-brand-tagline mt-2 sm:mt-3 font-extrabold tracking-tight leading-[1.15] whitespace-normal sm:whitespace-nowrap w-full max-w-full text-center"
                style={{
                  color: '#000000',
                  fontSize: '52px',
                  letterSpacing: '-0.025em',
                  opacity: s1StaggerVisible ? 1 : 0,
                  transform: s1StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '100ms',
                }}
              >
                Complexity Simplified, Growth Amplified
              </h3>

              {/* Subtitle */}
              <p
                className="mt-5 sm:mt-7 text-[16px] sm:text-[18px] md:text-[20px] max-w-3xl text-center leading-[1.65] font-normal"
                style={{
                  color: '#374151', // Neutral dark gray for high readability
                  opacity: s1StaggerVisible ? 1 : 0,
                  transform: s1StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '200ms',
                }}
              >
                Let's make your business incredible together by uniting powerful Zoho and Salesforce architectures with performance-driven digital marketing.
              </p>
            </div>

            {/* Bottom-right 48px circle button */}
            <button
              onClick={() => scrollToNext(0.42)}
              className="absolute bottom-12 right-6 sm:right-8 md:right-12 w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity duration-300"
              style={{
                border: '1px solid #1D304580', // DARK 50% alpha
                color: DARK,
                opacity: s1StaggerVisible ? 1 : 0,
                transform: s1StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                transition:
                  'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
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
            className="absolute inset-0 flex items-center justify-center px-6 sm:px-8"
            style={{
              opacity: s2Opacity,
              transition: 'opacity 0.1s ease-out',
              pointerEvents: s2Opacity > 0.1 ? 'auto' : 'none',
            }}
          >
            <div className="max-w-[900px] w-full text-center flex flex-col items-center">
              {/* Eyebrow */}
              <div
                className="text-xs sm:text-sm font-light tracking-[0.25em] uppercase mb-4"
                style={{
                  color: DARK,
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
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
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '0ms',
                }}
              >
                SCALING ENTERPRISE POTENTIAL &amp; VELOCITY
              </h2>

              {/* Subtitle */}
              <p
                className="mt-6 text-sm tracking-[0.2em] uppercase max-w-2xl text-center leading-relaxed"
                style={{
                  color: `${DARK}E6`,
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '150ms',
                }}
              >
                From strategy to flawless cloud execution. We eliminate operational silos, automate mission-critical workflows, and accelerate pipeline velocity.
              </p>
            </div>

            {/* Right column: 48px circle down, 3 dots, 40px circle up */}
            <div
              className="absolute bottom-16 right-6 sm:right-8 md:right-12 flex flex-col items-center gap-4"
              style={{
                pointerEvents: s2Opacity > 0.1 ? 'auto' : 'none',
              }}
            >
              {/* Down arrow button */}
              <button
                onClick={() => scrollToNext(0.78)}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity duration-300"
                style={{
                  border: `1px solid ${DARK}66`, // 40% alpha
                  color: DARK,
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '200ms',
                }}
                aria-label="Scroll Down"
              >
                <ArrowDown size={18} />
              </button>

              {/* Three dots: 8px solid DARK active, 6px DARK 40%, 6px DARK 40% */}
              <div
                className="flex flex-col items-center gap-2 mt-4"
                style={{
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '350ms',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: DARK }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: `${DARK}66` }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: `${DARK}66` }}
                />
              </div>

              {/* Up arrow button */}
              <button
                onClick={() => scrollToNext(0)}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity duration-300 mt-2"
                style={{
                  border: `1px solid ${DARK}4D`, // 30% alpha
                  color: `${DARK}CC`, // 80% alpha
                  opacity: s2StaggerVisible ? 1 : 0,
                  transform: s2StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '500ms',
                }}
                aria-label="Scroll to Top"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </section>

          {/* =========================================================================
              SECTION 3 (right aligned, white type — video is dark here)
              ========================================================================= */}
          <section
            className="absolute inset-0 flex items-center justify-end px-6 sm:px-8 md:px-20 lg:px-32"
            style={{
              opacity: s3Opacity,
              transition: 'opacity 0.1s ease-out',
              pointerEvents: s3Opacity > 0.1 ? 'auto' : 'none',
            }}
          >
            <div className="max-w-2xl text-left">
              {/* Eyebrow */}
              <div
                className="text-white font-bold text-lg tracking-wider mb-4"
                style={{
                  fontWeight: 800,
                  opacity: s3StaggerVisible ? 1 : 0,
                  transform: s3StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '0ms',
                }}
              >
                • THE DIGIOLIC PROMISE
              </div>

              {/* H2 */}
              <h2
                className="font-light text-white leading-[1.2] uppercase tracking-wide mb-8"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 4rem)',
                  opacity: s3StaggerVisible ? 1 : 0,
                  transform: s3StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '150ms',
                }}
              >
                YOUR GROWTH IS OUR MISSION
                <br />
                <span className="text-[0.55em] font-normal leading-normal block mt-3 normal-case tracking-normal text-white/90">
                  Connecting CRM, automation, and full-funnel performance marketing into a synchronized revenue powerhouse
                </span>
              </h2>

              {/* CTA Row */}
              <div
                className="flex items-center gap-4 cursor-pointer group"
                style={{
                  opacity: s3StaggerVisible ? 1 : 0,
                  transform: s3StaggerVisible ? 'translateY(0)' : 'translateY(24px)',
                  transition:
                    'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: '300ms',
                }}
                onClick={() => {
                  window.location.href = 'pages/contact.html';
                }}
              >
                <span
                  className="text-sm tracking-[0.3em] text-white font-bold uppercase group-hover:text-white transition-colors"
                  style={{ fontWeight: 700 }}
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

      {/* =========================================================================
          MOBILE MENU OVERLAY (fixed inset-0 z-[100], background DARK)
          ========================================================================= */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col justify-between ${
          mobileMenuOpen
            ? 'opacity-100 visible pointer-events-auto'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ backgroundColor: DARK }}
      >
        {/* Inner Panel Animated Wrapper */}
        <div
          className={`w-full h-full flex flex-col justify-start transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-8'
          }`}
        >
          {/* Top Row with Digiolic Logo and Close Button */}
          <div className="w-full flex items-center justify-between px-6 sm:px-8 pt-8 sm:pt-10">
            <img
              src="assets/images/digiolic-logo-dark.png?v=20260911_v4"
              alt="Digiolic"
              className="h-8 w-auto object-contain filter brightness-0 invert"
            />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:opacity-80 p-2 focus:outline-none transition-opacity"
              aria-label="Close Mobile Menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Links Left-Aligned (Exact match to Image 1) */}
          <nav className="flex flex-col items-start px-8 sm:px-12 pt-16 gap-6">
            {NAV_LINKS.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl sm:text-3xl tracking-wide transition-all duration-300 ${
                  link.active ? 'text-white font-medium' : 'text-white/70 hover:text-white font-normal'
                } ${
                  mobileMenuOpen
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-5'
                }`}
                style={{
                  transitionDelay: `${idx * 50}ms`,
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="pages/contact.html"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-6 inline-flex items-center justify-center w-fit px-7 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md border border-white/20 hover:bg-[#1E293B]"
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                fontWeight: 700,
              }}
            >
              Contact Us
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}
