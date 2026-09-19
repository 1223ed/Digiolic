import { useEffect, useRef, useState, useCallback } from 'react';
// @ts-ignore
import MP4Box from 'mp4box';

const LERP_TAU = 8;
const SNAP = 0.002;
const LRU_MAX = 24;
const LEAD = 24;
const WATCHDOG = 60000;

export interface FrameItem {
  ts: number; // in microseconds
  blob: Blob;
}

export function useVideoScrub(
  videoSrc: string,
  containerRef: React.RefObject<HTMLElement | null>
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [canvasLive, setCanvasLive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Internal state refs
  const bankRef = useRef<FrameItem[]>([]);
  const lruRef = useRef<Map<number, ImageBitmap>>(new Map());
  const lruPendingRef = useRef<Set<number>>(new Set());
  const currentTimeRef = useRef<number>(0);
  const targetTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const readyRef = useRef<boolean>(false);
  const revertedRef = useRef<boolean>(false);
  const paintedRef = useRef<boolean>(false);
  const buildingRef = useRef<boolean>(false);
  const canvasLiveRef = useRef<boolean>(false);
  const watchdogTimerRef = useRef<any>(null);

  // Binary search for nearest frame by microseconds
  const findNearestIndex = useCallback((targetMicro: number): number => {
    const bank = bankRef.current;
    if (bank.length === 0) return -1;
    let low = 0;
    let high = bank.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      if (bank[mid].ts < targetMicro) {
        low = mid + 1;
      } else if (bank[mid].ts > targetMicro) {
        high = mid - 1;
      } else {
        return mid;
      }
    }
    if (low >= bank.length) return bank.length - 1;
    if (high < 0) return 0;
    return Math.abs(bank[low].ts - targetMicro) < Math.abs(bank[high].ts - targetMicro)
      ? low
      : high;
  }, []);

  // Warm LRU cache around nearest index
  const warmLRU = useCallback((idx: number) => {
    const bank = bankRef.current;
    const lru = lruRef.current;
    const pending = lruPendingRef.current;

    for (let i = idx - 1; i <= idx + 2; i++) {
      if (i >= 0 && i < bank.length) {
        if (!lru.has(i) && !pending.has(i)) {
          pending.add(i);
          createImageBitmap(bank[i].blob)
            .then((bitmap) => {
              lru.set(i, bitmap);
              pending.delete(i);

              // Evict oldest if size > LRU_MAX
              if (lru.size > LRU_MAX) {
                const oldestKey = lru.keys().next().value;
                if (oldestKey !== undefined && Math.abs(oldestKey - idx) > 3) {
                  const b = lru.get(oldestKey);
                  b?.close();
                  lru.delete(oldestKey);
                }
              }
            })
            .catch(() => {
              pending.delete(i);
            });
        }
      }
    }
  }, []);

  // Frame bank extraction using MP4Box & WebCodecs VideoDecoder
  useEffect(() => {
    let isCancelled = false;
    let decoder: VideoDecoder | null = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof VideoDecoder === 'undefined') {
      return;
    }

    // 60s Watchdog: revert to video seeking fallback if extraction hangs
    watchdogTimerRef.current = setTimeout(() => {
      if (!readyRef.current) {
        readyRef.current = false;
        buildingRef.current = false;
        revertedRef.current = true;
        setCanvasLive(false);
      }
    }, WATCHDOG);

    const initExtraction = async () => {
      try {
        buildingRef.current = true;
        revertedRef.current = false;
        let response: Response;
        try {
          response = await fetch(videoSrc, { mode: 'cors' });
          if (!response.ok) throw new Error('Primary video fetch failed');
        } catch {
          try {
            response = await fetch('assets/videos/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4');
          } catch {
            response = await fetch(
              'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4'
            );
          }
        }

        const arrayBuffer = await response.arrayBuffer();
        if (isCancelled) return;

        const mp4boxfile = MP4Box.createFile();
        let decodedCount = 0;
        let submittedCount = 0;

        mp4boxfile.onReady = (info: any) => {
          if (isCancelled) return;
          const videoTrack = info.videoTracks[0];
          if (!videoTrack) return;

          const durSec = info.duration / info.timescale;
          durationRef.current = durSec;
          setDuration(durSec);

          let description: Uint8Array | undefined;
          for (const entry of videoTrack.mdia.minf.stbl.stsd.entries) {
            const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
            if (box) {
              const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN);
              box.write(stream);
              description = new Uint8Array(stream.buffer, 8);
              break;
            }
          }

          // Offscreen canvas for frame-to-blob conversion
          const offCanvas = document.createElement('canvas');
          offCanvas.width = 1920;
          offCanvas.height = 1080;
          const offCtx = offCanvas.getContext('2d');

          const handleFrame = async (frame: VideoFrame) => {
            const ts = frame.timestamp;
            if (offCtx) {
              offCtx.drawImage(frame, 0, 0, 1920, 1080);
              offCanvas.toBlob(
                (blob) => {
                  if (blob && !isCancelled) {
                    bankRef.current.push({ ts, blob });
                  }
                  frame.close();
                  decodedCount++;
                },
                'image/webp',
                0.82
              );
            } else {
              frame.close();
              decodedCount++;
            }
          };

          const createDecoder = (hwPref: HardwareAcceleration) => {
            return new VideoDecoder({
              output: handleFrame,
              error: () => {
                if (hwPref !== 'prefer-software') {
                  try {
                    decoder = createDecoder('prefer-software');
                    decoder.configure({
                      codec: videoTrack.codec,
                      description,
                      hardwareAcceleration: 'prefer-software',
                    });
                  } catch {}
                }
              },
            });
          };

          try {
            decoder = createDecoder('no-preference');
            decoder.configure({
              codec: videoTrack.codec,
              description,
              hardwareAcceleration: 'no-preference',
            });
          } catch {
            decoder = createDecoder('prefer-software');
            decoder.configure({
              codec: videoTrack.codec,
              description,
              hardwareAcceleration: 'prefer-software',
            });
          }

          mp4boxfile.onSamples = async (_id: number, _user: any, samples: any[]) => {
            for (const sample of samples) {
              if (isCancelled) break;
              const type = sample.is_sync ? 'key' : 'delta';
              const chunk = new EncodedVideoChunk({
                type,
                timestamp: (sample.cts * 1000000) / sample.timescale,
                duration: (sample.duration * 1000000) / sample.timescale,
                data: sample.data,
              });

              // Throttle with LEAD so decoding doesn't outrun blob generation
              if (decoder && decoder.decodeQueueSize > LEAD) {
                await new Promise<void>((resolve) => {
                  if (!decoder) return resolve();
                  decoder.ondequeue = () => {
                    resolve();
                  };
                  setTimeout(resolve, 50);
                });
              }

              if (isCancelled) break;
              decoder?.decode(chunk);
              submittedCount++;
            }
          };

          mp4boxfile.setExtractionOptions(videoTrack.id, null, { nbSamples: 1000 });
          mp4boxfile.start();

          // Wait for completion
          const checkCompletion = setInterval(() => {
            if (isCancelled) {
              clearInterval(checkCompletion);
              return;
            }
            if (decoder?.decodeQueueSize === 0 && bankRef.current.length > 10) {
              clearInterval(checkCompletion);
              bankRef.current.sort((a, b) => a.ts - b.ts);
              readyRef.current = true;
              buildingRef.current = false;
              setIsReady(true);
              clearTimeout(watchdogTimerRef.current);
            }
          }, 300);
        };

        const fileBuffer = arrayBuffer as any;
        fileBuffer.fileStart = 0;
        mp4boxfile.appendBuffer(fileBuffer);
        mp4boxfile.flush();
      } catch {
        readyRef.current = false;
        buildingRef.current = false;
        revertedRef.current = true;
        setCanvasLive(false);
      }
    };

    if (document.readyState === 'complete') {
      initExtraction();
    } else {
      window.addEventListener('load', initExtraction, { once: true });
    }

    return () => {
      isCancelled = true;
      clearTimeout(watchdogTimerRef.current);
      decoder?.close();
    };
  }, [videoSrc]);

  // Main RAF Lerp & Scrubbing Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const computeProgress = () => {
      const container = containerRef.current;
      if (!container) return 0;
      const scrollY = window.scrollY || window.pageYOffset;
      const maxScroll = container.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return 0;
      return Math.max(0, Math.min(1, scrollY / maxScroll));
    };

    // Video metadata sync & mobile playback management
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      const isMobileDevice =
        window.innerWidth < 768 ||
        ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches);

      const tryPlay = () => {
        if (!video) return;
        video.muted = true;
        const p = video.play();
        if (p && typeof p.then === 'function') {
          p.catch(() => {
            // Autoplay blocked until user interaction
          });
        }
      };

      // Always ensure video playback starts for mobile devices or while canvas is loading
      if (isMobileDevice || !readyRef.current) {
        tryPlay();
        video.addEventListener('canplay', tryPlay, { once: true });
        video.addEventListener('loadeddata', tryPlay, { once: true });
        document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
        document.addEventListener('click', tryPlay, { once: true });
      }

      const syncMeta = () => {
        if (video.duration && video.duration > 0) {
          durationRef.current = video.duration;
          setDuration(video.duration);
        }
      };
      video.addEventListener('loadedmetadata', syncMeta);
      video.addEventListener('canplay', syncMeta);
      if (video.duration > 0) syncMeta();
    }

    const loop = (now: number) => {
      const deltaSeconds = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.min(0.1, deltaSeconds);

      const p = computeProgress();
      setScrollProgress(p);

      const dur = durationRef.current || videoRef.current?.duration || 0;
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

        // 1. If frame bank is ready, draw nearest frame from memory
        if (readyRef.current && bankRef.current.length > 0) {
          const targetMicro = currentTimeRef.current * 1000000;
          const nearestIdx = findNearestIndex(targetMicro);
          if (nearestIdx >= 0) {
            warmLRU(nearestIdx);
            const bitmap = lruRef.current.get(nearestIdx);
            if (bitmap && canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d');
              if (ctx) {
                ctx.drawImage(bitmap, 0, 0, canvasRef.current.width, canvasRef.current.height);
                if (!canvasLiveRef.current) {
                  canvasLiveRef.current = true;
                  paintedRef.current = true;
                  setCanvasLive(true);
                  // Once canvas is live and active, pause background video to save resources
                  videoRef.current?.pause();
                }
              }
            }
          }
        } else {
          // 2. Fallback:
          const isMobileDevice =
            window.innerWidth < 768 ||
            ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches);

          const vid = videoRef.current;
          if (vid) {
            if (isMobileDevice) {
              // On mobile, keep video smoothly playing in a loop.
              // Never repeatedly seek vid.currentTime on mobile, which freezes iOS WebKit!
              if (vid.paused) {
                vid.play().catch(() => {});
              }
            } else {
              // Desktop fallback without WebCodecs
              if (!vid.seeking && Math.abs(vid.currentTime - currentTimeRef.current) > 0.03) {
                vid.currentTime = currentTimeRef.current;
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    const handleResize = () => {
      setScrollProgress(computeProgress());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [containerRef, findNearestIndex, warmLRU]);

  return {
    videoRef,
    canvasRef,
    scrollProgress,
    canvasLive,
    duration,
    isReady,
  };
}
