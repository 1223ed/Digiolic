import { createHeroCrystal } from "./hero-crystal.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize WebGL 3D Constellation Crystal
  let crystalInstance = null;
  const glContainer = document.getElementById("fplus-gl");
  if (glContainer) {
    try {
      crystalInstance = createHeroCrystal("fplus-gl", -0.26);
    } catch (err) {
      console.warn("[fplus-hero] WebGL init skipped or fallback:", err);
    }
  }

  // 2. Horizontal Scroll with GSAP & ScrollTrigger
  const track = document.getElementById("homeTrack");
  const viewport = document.getElementById("homeViewport");
  const progressBar = document.getElementById("homeProgressBar");

  if (track && viewport && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    const isDesktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isDesktop && !reducedMotion) {
      track.classList.add("is-horizontal");
      document.documentElement.dataset.heroAxis = "x";

      const panels = Array.from(track.querySelectorAll(".hpanel"));
      let panelBounds = [];

      const updateBounds = () => {
        panelBounds = panels.map((panel) => ({
          left: panel.offsetLeft,
          width: panel.offsetWidth,
          fx: panel.querySelector(".hp-fx"),
        }));
      };

      const maxScroll = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const applyInertiaBlur = () => {
        const winW = window.innerWidth;
        const trackLeft = track.getBoundingClientRect().left;

        for (let i = 0; i < panelBounds.length; i++) {
          const item = panelBounds[i];
          if (!item.fx) continue;

          const panelX = trackLeft + item.left;
          const overflowX = Math.max(0, item.width - winW);
          const edgeThreshold = Math.min(winW * 0.72, 840, overflowX);

          let settledX;
          if (panelX >= edgeThreshold) {
            settledX = panelX;
          } else if (panelX >= 0) {
            settledX = edgeThreshold * Math.pow(panelX / edgeThreshold, 3);
          } else if (panelX >= -overflowX) {
            settledX = 0;
          } else {
            const rightExceed = -(panelX + overflowX);
            settledX = rightExceed <= edgeThreshold ? -edgeThreshold * Math.pow(rightExceed / edgeThreshold, 3) : panelX + overflowX;
          }

          const diffX = settledX - panelX;
          item.fx.style.transform = `translate3d(${diffX}px, 0, 0)`;

          const normDist = Math.abs(settledX) / winW;
          const blurPx = Math.min(12, normDist * 22);
          const opacityVal = Math.max(0, Math.min(1, 1 - normDist * 1.25));

          item.fx.style.filter = blurPx > 0.35 ? `blur(${blurPx.toFixed(2)}px)` : "";
          item.fx.style.opacity = opacityVal.toFixed(3);
        }
      };

      updateBounds();

      const horizontalTween = gsap.to(track, {
        x: () => -maxScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: viewport,
          start: "top top",
          end: () => "+=" + maxScroll(),
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBar) {
              progressBar.style.transform = `scaleX(${self.progress})`;
            }
            applyInertiaBlur();
          },
          onRefresh: () => {
            updateBounds();
            applyInertiaBlur();
          },
        },
      });

      window.addEventListener("resize", () => {
        updateBounds();
        applyInertiaBlur();
      });
    }
  }

  // 3. Editorial Menu Overlay Toggle
  const menuBtn = document.getElementById("navMenuBtn");
  const overlay = document.getElementById("overlayMenu");
  const closeBtn = document.getElementById("overlayCloseBtn");

  const openMenu = () => {
    if (overlay) {
      overlay.classList.add("overlay--open");
      document.body.style.overflow = "hidden";
    }
  };

  const closeMenu = () => {
    if (overlay) {
      overlay.classList.remove("overlay--open");
      document.body.style.overflow = "";
    }
  };

  if (menuBtn) menuBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && overlay.classList.contains("overlay--open")) {
      closeMenu();
    }
  });

  // 4. Interactive Dual Infinite Marquees
  const track1 = document.getElementById("marqueeTrack1");
  const track2 = document.getElementById("marqueeTrack2");

  if (track1 && track2) {
    let pos1 = 0;
    let pos2 = 0;
    let speed1 = 1.0;
    let speed2 = 0.85;
    let targetMultiplier = 1;
    let currentMultiplier = 1;

    const marqueeRoot = track1.closest(".marquee");
    if (marqueeRoot) {
      marqueeRoot.addEventListener("pointerenter", () => {
        targetMultiplier = 3.5;
      });
      marqueeRoot.addEventListener("pointerleave", () => {
        targetMultiplier = 1;
      });
    }

    const animateMarquee = () => {
      currentMultiplier += (targetMultiplier - currentMultiplier) * 0.08;

      const half1 = track1.scrollWidth / 2;
      const half2 = track2.scrollWidth / 2;

      if (half1 > 0) {
        pos1 -= speed1 * currentMultiplier;
        if (pos1 <= -half1) pos1 += half1;
        track1.style.transform = `translateX(${pos1}px)`;
      }

      if (half2 > 0) {
        pos2 += speed2 * currentMultiplier;
        if (pos2 >= 0) pos2 -= half2;
        track2.style.transform = `translateX(${pos2}px)`;
      }

      requestAnimationFrame(animateMarquee);
    };

    requestAnimationFrame(animateMarquee);
  }
});
