import { useEffect, useRef, useState, useCallback } from 'react';

const LERP_TAU = 12;
const SNAP = 0.002;

export function useVideoScrub(
  _videoSrc: string,
  containerRef: React.RefObject<HTMLElement | null>
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [canvasLive] = useState(false);
  const [duration, setDuration] = useState(10.042);
  const [isReady, setIsReady] = useState(true);

  const currentTimeRef = useRef<number>(0);
  const targetTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(10.042);

  // Main RAF Lerp & Scroll Sync Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const computeProgress = (): number => {
      const container = containerRef.current;
      if (!container) return 0;
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = container.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return 0;
      return Math.max(0, Math.min(1, scrollY / maxScroll));
    };

    const video = videoRef.current;

    const seekVideo = (time: number) => {
      if (!video || video.readyState < 1) return;
      if (!video.seeking && Math.abs(video.currentTime - time) > 0.02) {
        try {
          video.currentTime = time;
        } catch {}
      }
    };

    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      const syncMeta = () => {
        if (video.duration && !isNaN(video.duration) && video.duration > 0) {
          durationRef.current = video.duration;
          setDuration(video.duration);
          setIsReady(true);
        }
      };

      video.addEventListener('loadedmetadata', syncMeta);
      video.addEventListener('loadeddata', syncMeta);
      video.addEventListener('canplay', syncMeta);
      if (video.duration > 0) syncMeta();

      // Chain seeks immediately on hardware seeked event for ultra-smooth 60fps response
      const onSeeked = () => {
        if (!video) return;
        if (Math.abs(video.currentTime - currentTimeRef.current) > 0.02) {
          try {
            video.currentTime = currentTimeRef.current;
          } catch {}
        }
      };
      video.addEventListener('seeked', onSeeked);

      // In iOS Safari, inline muted videos will not decode or paint frame 0 to the screen
      // unless briefly kicked into playback. We prime it and immediately pause at 0
      // so it never autoplays as a timeline, but frame 0 renders and seeking is enabled.
      let primed = false;
      const prime = () => {
        if (primed || !video) return;
        video.muted = true;
        const p = video.play();
        if (p !== undefined) {
          p.then(() => {
            primed = true;
            video.pause();
            syncMeta();
          }).catch(() => {});
        }
      };

      if (video.readyState >= 2) {
        prime();
      } else {
        video.addEventListener('canplay', prime, { once: true });
        video.addEventListener('loadeddata', prime, { once: true });
      }

      window.addEventListener('touchstart', prime, { once: true, passive: true });
      window.addEventListener('touchmove', prime, { once: true, passive: true });
      window.addEventListener('scroll', prime, { once: true, passive: true });
      window.addEventListener('click', prime, { once: true });
    }

    const loop = (now: number) => {
      const deltaSeconds = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(0.1, deltaSeconds);

      const p = computeProgress();
      setScrollProgress(p);

      const dur = durationRef.current || video?.duration || 10.042;
      if (dur > 0) {
        targetTimeRef.current = p * dur;

        if (prefersReducedMotion) {
          currentTimeRef.current = targetTimeRef.current;
        } else {
          currentTimeRef.current +=
            (targetTimeRef.current - currentTimeRef.current) * (1 - Math.exp(-dt * LERP_TAU));
        }

        if (Math.abs(targetTimeRef.current - currentTimeRef.current) < SNAP) {
          currentTimeRef.current = targetTimeRef.current;
        }

        seekVideo(currentTimeRef.current);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Direct event listener for touch & scroll gestures for immediate feedback
    const handleImmediateUpdate = () => {
      const p = computeProgress();
      setScrollProgress(p);
      const dur = durationRef.current || video?.duration || 10.042;
      if (dur > 0) {
        targetTimeRef.current = p * dur;
        seekVideo(targetTimeRef.current);
      }
    };

    window.addEventListener('scroll', handleImmediateUpdate, { passive: true });
    window.addEventListener('touchmove', handleImmediateUpdate, { passive: true });
    window.addEventListener('resize', handleImmediateUpdate);
    window.addEventListener('orientationchange', handleImmediateUpdate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleImmediateUpdate);
      window.removeEventListener('touchmove', handleImmediateUpdate);
      window.removeEventListener('resize', handleImmediateUpdate);
      window.removeEventListener('orientationchange', handleImmediateUpdate);
    };
  }, [containerRef]);

  return {
    videoRef,
    canvasRef,
    scrollProgress,
    canvasLive,
    duration,
    isReady,
  };
}
