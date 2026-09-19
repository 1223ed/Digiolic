/**
 * DIGIOLIC — FRONT-FACING FLOATING EMERALD GREEN TELEPHONE & 3D ORGANIC CORD ENGINE
 * Fully GPU-optimized 60fps rendering:
 * - Glossy emerald green vintage telephone handset levitating in mid-air
 * - Matching 3D emerald green coiled cord with realistic highlights & organic curves
 * - 100% transparent background with zero rectangular boxes or artifacts
 * - IntersectionObserver: Zero CPU/GPU usage when off-screen
 */

(function () {
  'use strict';

  function initFloatingPhone(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    let animationFrameId = null;
    let isVisible = false;

    let transparentHandsetCanvas = null;
    const handsetImg = new Image();
    handsetImg.src = '../assets/images/emerald-handset-front.jpg';

    function processHandsetImage() {
      if (!handsetImg.complete || handsetImg.naturalWidth === 0) return;
      const off = document.createElement('canvas');
      off.width = handsetImg.naturalWidth;
      off.height = handsetImg.naturalHeight;
      const offCtx = off.getContext('2d');
      offCtx.drawImage(handsetImg, 0, 0);

      const imgData = offCtx.getImageData(0, 0, off.width, off.height);
      const d = imgData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];

        const brightness = (r + g + b) / 3;
        const isGreen = g > r + 15 && g > b + 15;

        // Key out whitish studio background, preserve all green handset pixels
        if (!isGreen) {
          if (brightness > 230) {
            d[i + 3] = 0;
          } else if (brightness > 205) {
            const alpha = 255 - ((brightness - 205) / 25) * 255;
            d[i + 3] = Math.max(0, Math.min(255, alpha));
          }
        }
      }

      offCtx.putImageData(imgData, 0, 0);
      transparentHandsetCanvas = off;
    }

    handsetImg.onload = function () {
      processHandsetImage();
      if (isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    let startTime = performance.now();
    let dpr = window.devicePixelRatio || 1;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resize, { passive: true });
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(canvas.parentElement || canvas);
    }
    resize();

    // IntersectionObserver: Pause animation when off-screen
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              if (!animationFrameId) {
                startTime = performance.now();
                animationFrameId = requestAnimationFrame(render);
              }
            } else {
              if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
              }
            }
          });
        },
        { rootMargin: '100px' }
      );
      observer.observe(canvas);
    } else {
      isVisible = true;
    }

    function render(currentTime) {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (w === 0 || h === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const elapsed = (currentTime - startTime) * 0.001;

      // Levitation Physics
      const bobOffset = Math.sin(elapsed * 1.35) * 14;
      const subtleTilt = Math.sin(elapsed * 1.05) * 0.02;

      // Sizing (-20% compact height)
      const isMobile = w < 800;
      const handsetWidth = isMobile ? Math.min(145, w * 0.35) : Math.min(192, w * 0.22);
      const handsetHeight = handsetWidth * 1.56;
      const handsetCenterX = isMobile ? w * 0.5 : Math.max(handsetWidth * 0.85, w * 0.17);
      const handsetBaseY = (isMobile ? h * 0.32 : h * 0.44) + bobOffset;

      // =========================================================================
      // 1. NEUTRAL DUAL FLOOR SHADOWS (Clean Depth)
      // =========================================================================
      const shadowFloorY = h - (isMobile ? 36 : 52);
      const elevationNorm = (bobOffset + 14) / 28;

      const diffuseScale = 1 - (bobOffset / 14) * 0.18;
      const shadowRadiusX = handsetWidth * 0.62 * diffuseScale;
      const shadowRadiusY = 14 * diffuseScale;

      ctx.save();
      const diffGrad = ctx.createRadialGradient(
        handsetCenterX, shadowFloorY, 2,
        handsetCenterX, shadowFloorY, shadowRadiusX
      );

      diffGrad.addColorStop(0, `rgba(0, 0, 0, ${Math.max(0.08, 0.35 - elevationNorm * 0.12)})`);
      diffGrad.addColorStop(0.5, `rgba(15, 23, 42, ${Math.max(0.02, 0.12 - elevationNorm * 0.05)})`);
      diffGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.ellipse(handsetCenterX, shadowFloorY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = diffGrad;
      ctx.fill();
      ctx.restore();

      // =========================================================================
      // 2. HYPER-REALISTIC 3D EMERALD GREEN CURVED COILED CORD (EXTENDED TO RIGHT END)
      // =========================================================================
      const wireAnchorX = handsetCenterX - Math.sin(subtleTilt) * (handsetHeight * 0.43);
      const wireAnchorY = handsetBaseY + Math.cos(subtleTilt) * (handsetHeight * 0.43) - 5;

      const coilStartX = isMobile ? handsetCenterX + 30 : handsetCenterX + 55;
      const coilEndX = w + 90; // Extended generously past the right edge

      function getWirePoint(t) {
        const x = coilStartX + t * (coilEndX - coilStartX);
        const wave1 = Math.sin(t * Math.PI * 1.5 + 0.2) * 20;
        const wave2 = Math.cos(t * Math.PI * 2.6) * 6;
        const y = h - 36 + wave1 + wave2;
        return { x, y };
      }

      const p0 = getWirePoint(0);

      // Lead S-Curve
      const loopDipX = wireAnchorX - 22;
      const loopDipY = wireAnchorY + 38 + bobOffset * 0.38;
      const loopRiseX = wireAnchorX + 20;
      const loopRiseY = p0.y + 12;

      ctx.save();

      // Lead Wire 3D Cylindrical Render (Emerald Green)
      ctx.lineWidth = 6.8;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#024D36';
      ctx.beginPath();
      ctx.moveTo(wireAnchorX, wireAnchorY);
      ctx.bezierCurveTo(loopDipX, loopDipY, loopRiseX, loopRiseY, p0.x, p0.y);
      ctx.stroke();

      const leadGrad = ctx.createLinearGradient(wireAnchorX, wireAnchorY, p0.x, p0.y);
      leadGrad.addColorStop(0, '#05D6A0');
      leadGrad.addColorStop(0.4, '#00C48C');
      leadGrad.addColorStop(0.8, '#059669');
      leadGrad.addColorStop(1, '#047857');
      ctx.lineWidth = 6.0;
      ctx.strokeStyle = leadGrad;
      ctx.beginPath();
      ctx.moveTo(wireAnchorX, wireAnchorY);
      ctx.bezierCurveTo(loopDipX, loopDipY, loopRiseX, loopRiseY, p0.x, p0.y);
      ctx.stroke();

      // Specular highlight glint on green rubber lead
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = 'rgba(209, 250, 229, 0.9)';
      ctx.beginPath();
      ctx.moveTo(wireAnchorX, wireAnchorY);
      ctx.bezierCurveTo(loopDipX, loopDipY - 1.2, loopRiseX, loopRiseY - 1.2, p0.x, p0.y - 0.8);
      ctx.stroke();

      // Continuous 3D Coiled Helical Cord Extended Completely Past the Right Edge
      const totalSteps = Math.ceil((coilEndX - coilStartX) / 9.5) + 6;
      const coilRadiusX = 6.8;
      const coilRadiusY = 17.5;

      // Rear under-loops (Dark emerald shadow)
      for (let i = 0; i <= totalSteps; i++) {
        const t = i / totalSteps;
        const pt = getWirePoint(t);
        const tNext = Math.min(1, t + 0.02);
        const ptNext = getWirePoint(tNext);
        const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x);

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(angle);

        ctx.lineWidth = 5.8;
        ctx.strokeStyle = '#024D36';
        ctx.beginPath();
        ctx.ellipse(0, 0, coilRadiusX, coilRadiusY, 0, Math.PI * 0.5, Math.PI * 1.5, false);
        ctx.stroke();

        ctx.restore();
      }

      // Front over-loops (Emerald Green with 3D Specular Glint)
      const coilBodyGrad = ctx.createLinearGradient(0, -coilRadiusY, 0, coilRadiusY);
      coilBodyGrad.addColorStop(0, '#34D399');
      coilBodyGrad.addColorStop(0.35, '#05D6A0');
      coilBodyGrad.addColorStop(0.75, '#00A86B');
      coilBodyGrad.addColorStop(1, '#024D36');

      for (let i = 0; i <= totalSteps; i++) {
        const t = i / totalSteps;
        const pt = getWirePoint(t);
        const tNext = Math.min(1, t + 0.02);
        const ptNext = getWirePoint(tNext);
        const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x);

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(angle);

        // Core 3D emerald body
        ctx.lineWidth = 6.4;
        ctx.strokeStyle = coilBodyGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, coilRadiusX, coilRadiusY, 0, Math.PI * 1.5, Math.PI * 0.5, false);
        ctx.stroke();

        // Bright top specular highlight glint
        ctx.lineWidth = 1.9;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.ellipse(-1.0, -0.8, coilRadiusX * 0.82, coilRadiusY * 0.88, 0, Math.PI * 1.6, Math.PI * 0.2, false);
        ctx.stroke();

        ctx.restore();
      }

      ctx.restore();

      // =========================================================================
      // 3. FRONT-FACING FLOATING EMERALD GREEN HANDSET (Pure, No Box)
      // =========================================================================
      const handsetSource = transparentHandsetCanvas || handsetImg;
      if (handsetSource && (handsetSource.width || handsetSource.naturalWidth)) {
        ctx.save();
        ctx.translate(handsetCenterX, handsetBaseY);
        ctx.rotate(subtleTilt);

        // Neutral subtle drop shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 8;

        ctx.drawImage(
          handsetSource,
          -handsetWidth / 2,
          -handsetHeight / 2,
          handsetWidth,
          handsetHeight
        );

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    if (handsetImg.complete) {
      processHandsetImage();
      if (isVisible) {
        animationFrameId = requestAnimationFrame(render);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initFloatingPhone('floatingPhoneCanvas');
      initFloatingPhone('zohoFloatingPhoneCanvas');
    });
  } else {
    initFloatingPhone('floatingPhoneCanvas');
    initFloatingPhone('zohoFloatingPhoneCanvas');
  }
})();
