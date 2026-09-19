/**
 * DIGIOLIC — HIGH-PERFORMANCE VIDEO HERO CONTROLLER
 * Ensures hardware-accelerated playback, seamless loop continuity,
 * and viewport-based CPU/GPU power saving for ping-pong videos.
 */

(function () {
  'use strict';

  function initHeroVideo(video) {
    if (!video || video._heroVideoInitialized) return;
    video._heroVideoInitialized = true;

    // Ensure native seamless looping is enabled
    video.loop = true;
    video.setAttribute('loop', '');
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    let isVisible = true;

    function playVideo() {
      if (!isVisible || document.hidden) return;
      const p = video.play();
      if (p && p.catch) {
        p.catch(() => {
          // Autoplay fallback for strict browser permissions
          const onInteract = () => {
            if (isVisible && !document.hidden) video.play().catch(() => {});
            window.removeEventListener('click', onInteract);
            window.removeEventListener('touchstart', onInteract);
            window.removeEventListener('scroll', onInteract);
          };
          window.addEventListener('click', onInteract, { once: true });
          window.addEventListener('touchstart', onInteract, { once: true });
          window.addEventListener('scroll', onInteract, { once: true });
        });
      }
    }

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('loadeddata', playVideo, { once: true });
    }

    // Viewport-based CPU & GPU optimizer
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (!isVisible) {
            video.pause();
          } else {
            playVideo();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(video);
    }

    // Tab visibility handling
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        video.pause();
      } else if (isVisible) {
        playVideo();
      }
    });
  }

  function autoInit() {
    const heroVideos = document.querySelectorAll(
      '#heroBgVideo, .hero-bg-video, #zohoBgVideo, #zohoHeroVideo, .zoho-hero-bg-video, .zoho-hero-video, .dp-hero-video, #heroSection video, video[data-yoyo="true"]'
    );
    heroVideos.forEach(v => initHeroVideo(v));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  window.initHeroVideo = initHeroVideo;
})();
