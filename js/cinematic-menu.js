/**
 * Digiolic Cinematic Editorial Menu Controller
 * 40% Website Page View (Left) | 60% Black Editorial Menu (Right)
 *
 * Implements real-time GPU WebGL smoke canvas rendering the churning smoke loop
 * from video with zero white background, smooth right-to-left curtain wipe,
 * serif navigation, AI showcase, and custom trailing cursor.
 */

(function () {
  'use strict';

  function initSmokeRenderer() {
    const canvas = document.getElementById('cinematicSmokeCanvas');
    const video = document.getElementById('cinematicSmokeVideoSrc');
    if (!canvas || !video) return null;

    let gl = null;
    try {
      gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ||
           canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
    } catch (e) {
      console.warn('WebGL context creation error:', e);
    }

    if (!gl) {
      // Graceful fallback: video will not crash the page, static smoke edge remains active
      return {
        start: function () {
          video.play().catch(function () {});
        },
        stop: function () {
          video.pause();
        }
      };
    }

    // WebGL Shader setup:
    // Vertex Shader: Maps unit quad to viewport
    const vsSource = [
      'attribute vec2 a_pos;',
      'varying vec2 v_uv;',
      'void main() {',
      '  gl_Position = vec4(a_pos, 0.0, 1.0);',
      '  v_uv = vec2((a_pos.x + 1.0) * 0.5, (1.0 - a_pos.y) * 0.5);',
      '}'
    ].join('\n');

    // Fragment Shader: Converts video brightness to transparent alpha
    // White background -> alpha 0.0 (completely transparent)
    // Black smoke plume -> alpha 1.0 (pure pitch black)
    // Zero white pixels, pure alpha smoke over Case Studies page
    const fsSource = [
      'precision mediump float;',
      'uniform sampler2D u_video;',
      'varying vec2 v_uv;',
      'void main() {',
      '  vec4 c = texture2D(u_video, v_uv);',
      '  float lum = dot(c.rgb, vec3(0.299, 0.587, 0.114));',
      '  float alpha = 1.0 - lum;',
      '  float leftRamp = smoothstep(0.0, 0.18, v_uv.x);',
      '  alpha *= leftRamp;',
      '  alpha = smoothstep(0.04, 0.88, alpha);',
      '  if (v_uv.x > 0.86) {',
      '    alpha = max(alpha, smoothstep(0.86, 1.0, v_uv.x));',
      '  }',
      '  gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);',
      '}'
    ].join('\n');

    function createShader(type, src) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return null;
    }
    gl.useProgram(program);

    // Quad geometry (2 triangles covering clip space)
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Texture configuration
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.clearColor(0, 0, 0, 0);

    let isPlaying = false;
    let animId = null;

    function renderLoop() {
      if (!isPlaying) return;

      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      animId = requestAnimationFrame(renderLoop);
    }

    return {
      start: function () {
        isPlaying = true;
        video.currentTime = 0;
        video.play().catch(function () {});
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(renderLoop);
      },
      stop: function () {
        isPlaying = false;
        video.pause();
        cancelAnimationFrame(animId);
      }
    };
  }

  function initCinematicMenu() {
    const overlay = document.getElementById('cinematicMenuOverlay');
    const panel = document.getElementById('cinematicMenuPanel');
    const backdrop = document.getElementById('cinematicMenuBackdrop');
    const closeBtn = document.getElementById('cinematicMenuCloseBtn');
    const navLinks = overlay ? overlay.querySelectorAll('.cinematic-nav-link') : [];

    if (!overlay) return;

    const smokeRenderer = initSmokeRenderer();

    function isOverlayOpen() {
      return overlay && overlay.classList.contains('is-active');
    }

    function openMenu() {
      if (!overlay) return;
      if (overlay.classList.contains('is-active')) return;

      overlay.classList.remove('is-closing');
      overlay.classList.add('is-active');
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      if (smokeRenderer) {
        smokeRenderer.start();
      } else {
        const v = document.getElementById('cinematicSmokeVideoSrc');
        if (v) v.play().catch(function () {});
      }
    }

    function closeMenu() {
      if (!overlay) return;
      if (!overlay.classList.contains('is-active') && !overlay.classList.contains('is-closing')) {
        return;
      }

      overlay.classList.remove('is-active');
      overlay.classList.add('is-closing');

      setTimeout(function () {
        overlay.classList.remove('is-closing');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        if (smokeRenderer) {
          smokeRenderer.stop();
        } else {
          const v = document.getElementById('cinematicSmokeVideoSrc');
          if (v) v.pause();
        }
      }, 650);
    }

    // Delegated click & touch listeners to guarantee opening, closing via close button, and closing on outside clicks
    function handleGlobalClick(e) {
      // 1. If overlay is active: prioritize close interactions
      if (overlay && overlay.classList.contains('is-active')) {
        // A. Close button clicked
        const closeTrigger = e.target.closest(
          '#cinematicMenuCloseBtn, .cinematic-menu-close, [data-close-cinematic-menu]'
        );
        if (closeTrigger) {
          e.preventDefault();
          e.stopPropagation();
          closeMenu();
          return;
        }

        // B. Clicked directly on the backdrop or anywhere outside the black menu panel
        const insidePanel = e.target.closest('#cinematicMenuPanel, .cinematic-menu-panel');
        const isBackdrop = e.target.closest('#cinematicMenuBackdrop, .cinematic-menu-backdrop');
        if (!insidePanel || isBackdrop) {
          e.preventDefault();
          e.stopPropagation();
          closeMenu();
          return;
        }

        // C. Clicked the menu open trigger again while open (toggle close)
        const openTrigger = e.target.closest(
          '#cinematicMenuOpenBtn, .cinematic-menu-trigger, #mainframeMenuBtn, [data-open-cinematic-menu]'
        );
        if (openTrigger) {
          e.preventDefault();
          e.stopPropagation();
          closeMenu();
          return;
        }

        return;
      }

      // 2. Overlay is NOT active: check if an open button was clicked
      const openTrigger = e.target.closest(
        '#cinematicMenuOpenBtn, .cinematic-menu-trigger, #mainframeMenuBtn, [data-open-cinematic-menu]'
      );
      if (openTrigger) {
        e.preventDefault();
        e.stopPropagation();
        openMenu();
        return;
      }
    }

    document.addEventListener('click', handleGlobalClick, true);
    document.addEventListener('touchend', handleGlobalClick, { capture: true, passive: false });

    // Direct element bindings as secondary safety net
    if (closeBtn) {
      ['click', 'touchend'].forEach(function (evt) {
        closeBtn.addEventListener(evt, function (e) {
          e.preventDefault();
          e.stopPropagation();
          closeMenu();
        }, { passive: false });
      });
    }

    if (backdrop) {
      ['click', 'touchend'].forEach(function (evt) {
        backdrop.addEventListener(evt, function (e) {
          e.preventDefault();
          e.stopPropagation();
          closeMenu();
        }, { passive: false });
      });
    }

    // Close on Escape key
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOverlayOpen()) {
        closeMenu();
      }
    });

    // Handle nav links
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // If clicking current page
        if (href && (href.endsWith(currentPath) || href === '#' || href.startsWith('#'))) {
          e.preventDefault();
          closeMenu();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // If clicking another page, close menu then let browser navigate
        if (href) {
          closeMenu();
        }
      });
    });

    // Global helper methods
    window.openCinematicMenu = openMenu;
    window.closeCinematicMenu = closeMenu;
    window.openDigiolicMenu = openMenu;
    window.closeDigiolicMenu = closeMenu;
    window.toggleDigiolicMenu = function () {
      if (isOverlayOpen()) closeMenu();
      else openMenu();
    };

    // Integrate with existing mobile navbar menu triggers
    window.toggleDigiolicMobileMenu = function (e) {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
      }
      window.toggleDigiolicMenu();
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCinematicMenu);
  } else {
    initCinematicMenu();
  }
})();
