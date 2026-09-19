/**
 * DIGIOLIC — ZOHO HERO VIDEO PLAYER CONTROLLER
 * High-performance Zoho video player with controls, smooth autoplay, and viewport observer
 */

(function () {
  'use strict';

  const video = document.getElementById('zohoHeroVideo') || document.getElementById('zohoBgVideo');
  const playPauseBtn = document.getElementById('zohoPlayPauseBtn');
  const playIcon = document.getElementById('zohoPlayIcon');
  const pauseIcon = document.getElementById('zohoPauseIcon');
  const videoWrapper = document.querySelector('.zoho-hero-video-box') || document.querySelector('.zoho-video-wrapper');

  if (!video) return;

  video.loop = true;
  video.muted = true;

  // Auto-play attempt on load
  function attemptAutoplay() {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updatePlayState(true);
        })
        .catch(() => {
          updatePlayState(false);
          // Fallback on first user interaction
          const onUserAction = () => {
            video.play().catch(() => {});
            window.removeEventListener('click', onUserAction);
            window.removeEventListener('touchstart', onUserAction);
            window.removeEventListener('scroll', onUserAction);
          };
          window.addEventListener('click', onUserAction, { once: true });
          window.addEventListener('touchstart', onUserAction, { once: true });
          window.addEventListener('scroll', onUserAction, { once: true });
        });
    }
  }

  function updatePlayState(isPlaying) {
    if (!playPauseBtn) return;
    if (isPlaying) {
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      playPauseBtn.setAttribute('aria-label', 'Pause Video');
    } else {
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      playPauseBtn.setAttribute('aria-label', 'Play Video');
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        updatePlayState(true);
      } else {
        video.pause();
        updatePlayState(false);
      }
    });
  }

  // Click video to toggle play/pause
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      updatePlayState(true);
    } else {
      video.pause();
      updatePlayState(false);
    }
  });

  video.addEventListener('play', () => updatePlayState(true));
  video.addEventListener('pause', () => updatePlayState(false));

  // IntersectionObserver to pause video when off-screen to save CPU & GPU memory
  if ('IntersectionObserver' in window && videoWrapper) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (video.paused && !video.ended) {
              video.play().catch(() => {});
            }
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    videoObserver.observe(videoWrapper);
  }

  attemptAutoplay();
})();
