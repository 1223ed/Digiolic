/**
 * Digiolic Zoho Enterprise Architecture - Feather 3D WebGL Scroll Engine
 * Inspired by composites.archi Awwwards-winning feather design & scroll choreography
 * 
 * Features:
 * - Real-time WebGL 3D Feather rendering using official GLB meshes & textures
 * - Dual-tone feather aesthetics: Sleek obsidian black feather & radiant luminescent white feather
 * - Floating background feather canopy / 3D particle cloud with depth of field
 * - Interactive 3D mouse parallax tracking responding to cursor velocity
 * - Micro-breathing & ambient wind flutter physics
 * - Smooth continuous GSAP ScrollTrigger scrubbing across all 6 enterprise architecture pillars
 */

(function () {
  'use strict';

  // Global FeatherEngine object
  window.FeatherScrollEngine = {
    isInitialized: false,
    init: initFeatherEngine,
    updateScroll: null,
    onResize: null,
    setStage: null,
    getScene: null
  };

  function initFeatherEngine(canvasContainerId, canvasId) {
    if (window.FeatherScrollEngine.isInitialized) return window.FeatherScrollEngine;

    const container = document.getElementById(canvasContainerId || 'featherWebglCanvasContainer');
    const canvas = document.getElementById(canvasId || 'featherWebglCanvas');
    if (!container || !canvas) {
      console.warn('FeatherEngine: container or canvas element not found.');
      return null;
    }

    if (typeof THREE === 'undefined') {
      console.error('FeatherEngine: THREE.js is not loaded.');
      return null;
    }

    // Force container full dimensions if zero
    const getW = () => container.clientWidth || window.innerWidth || 1400;
    const getH = () => container.clientHeight || window.innerHeight || 800;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, getW() / getH(), 0.1, 100);
    camera.position.set(0, 0, 6.5);

    // High performance WebGLRenderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
        precision: 'highp'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(getW(), getH());
      renderer.setClearColor(0x000000, 0);
      renderer.outputEncoding = THREE.sRGBEncoding;
    } catch (e) {
      console.error('FeatherEngine: WebGL initialization failed', e);
      return null;
    }

    // Groups for hierarchical transforms
    const globalGroup = new THREE.Group();
    const mainFeatherGroup = new THREE.Group();
    const particlesGroup = new THREE.Group();

    globalGroup.add(particlesGroup);
    globalGroup.add(mainFeatherGroup);
    scene.add(globalGroup);

    // Studio Lighting setup tailored for feather translucency & specular sheen
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight1.position.set(5, 8, 6);
    scene.add(dirLight1);

    // Cool iridescent rim light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // Subtle warm architectural fill light
    const warmLight = new THREE.DirectionalLight(0xf59e0b, 0.4);
    warmLight.position.set(4, -6, 3);
    scene.add(warmLight);

    // Textures & Material setup
    const textureLoader = new THREE.TextureLoader();
    let featherAlphaTex, featherBaseBlackTex, featherBaseWhiteTex, matCapBlackTex, matCapWhiteTex, displacementTex, featherChromaTex;

    try {
      featherAlphaTex = textureLoader.load('../assets/feather/feather-alpha.jpg');
      featherBaseBlackTex = textureLoader.load('../assets/feather/feather-base.png');
      featherBaseWhiteTex = textureLoader.load('../assets/feather/feather-base-white.png');
      featherChromaTex = textureLoader.load('../assets/feather/feather-black-chroma.png');
      matCapBlackTex = textureLoader.load('../assets/feather/matcapblack.png');
      matCapWhiteTex = textureLoader.load('../assets/feather/matcapWhite.png');
      displacementTex = textureLoader.load('../assets/feather/displacement-feather-7.jpg');

      [featherAlphaTex, featherBaseBlackTex, featherBaseWhiteTex].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.flipY = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
      });

      if (featherChromaTex) {
        featherChromaTex.wrapS = THREE.ClampToEdgeWrapping;
        featherChromaTex.wrapT = THREE.ClampToEdgeWrapping;
        featherChromaTex.minFilter = THREE.LinearFilter;
        featherChromaTex.magFilter = THREE.LinearFilter;
      }

      if (displacementTex) {
        displacementTex.wrapS = THREE.RepeatWrapping;
        displacementTex.wrapT = THREE.RepeatWrapping;
        displacementTex.minFilter = THREE.LinearFilter;
        displacementTex.magFilter = THREE.LinearFilter;
      }
    } catch (err) {
      console.warn('FeatherEngine: Texture loading fallback', err);
    }

    // Material definitions
    const blackFeatherMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: featherBaseBlackTex,
      alphaMap: featherAlphaTex,
      alphaTest: 0.28,
      roughness: 0.38,
      metalness: 0.12,
      side: THREE.DoubleSide,
      transparent: true
    });

    const whiteFeatherMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: featherBaseWhiteTex,
      alphaMap: featherAlphaTex,
      alphaTest: 0.28,
      roughness: 0.22,
      metalness: 0.2,
      side: THREE.DoubleSide,
      transparent: true
    });

    const blackQuillMaterial = new THREE.MeshMatcapMaterial({
      matcap: matCapBlackTex,
      side: THREE.DoubleSide
    });

    const whiteQuillMaterial = new THREE.MeshMatcapMaterial({
      matcap: matCapWhiteTex,
      side: THREE.DoubleSide
    });

    // Background floating feather materials (Matching composites.archi frame_09: Silvery-grey translucent feathers clearly visible on deep obsidian)
    const particleBlackMat = new THREE.MeshBasicMaterial({
      color: 0x9ba5b4,
      map: featherBaseWhiteTex,
      alphaMap: featherAlphaTex,
      alphaTest: 0.25,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.78
    });

    const particleQuillMat = new THREE.MeshBasicMaterial({
      color: 0x7c8696,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.72
    });

    const particleWhiteMat = new THREE.MeshBasicMaterial({
      color: 0xdedede,
      map: featherBaseWhiteTex,
      alphaMap: featherAlphaTex,
      alphaTest: 0.28,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });

    // ==========================================================================
    // COMPOSITES.ARCHI WEBLG LIQUID / INK DISPLACEMENT TRANSITION SYSTEM
    // Real dynamic fluid wave sweeping up into Six Pillars Section
    // Wipes directly from "Built With Zoho's Modern Technology Stack" into
    // Stage 0: Deep Obsidian (#0B0C0E) with radiant white feather & flock
    // ZERO dummy grey pages, ZERO black feather before Six Pillars!
    // ==========================================================================
    const fboScene2 = new THREE.WebGLRenderTarget(getW(), getH(), {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat
    });

    // Fullscreen quad with official composites.archi displacement shader
    const transitionGeo = new THREE.PlaneGeometry(2, 2);
    const transitionMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        progress: { value: -0.15 },
        texture2: { value: fboScene2.texture },
        displacement: { value: displacementTex },
        resolution: { value: new THREE.Vector4(getW(), getH(), 1, 1) }
      },
      vertexShader: [
        'varying vec2 vUv;',
        'void main() {',
        '  vUv = uv;',
        '  gl_Position = vec4(position.xy, 0.0, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform float time;',
        'uniform float progress;',
        'uniform sampler2D texture2;',
        'uniform sampler2D displacement;',
        'uniform vec4 resolution;',
        'varying vec2 vUv;',
        '',
        'vec2 mirrored(vec2 v) {',
        '  vec2 m = mod(v, 2.0);',
        '  return mix(m, 2.0 - m, step(1.0, m));',
        '}',
        'void main() {',
        '  vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);',
        '  vec4 noise = texture2D(displacement, mirrored(newUV * 0.8 + time * 0.03));',
        '  float waveDist = (progress * 1.30 - 0.15) + (noise.g - 0.5) * 0.18 - vUv.y;',
        '  float intpl = smoothstep(-0.02, 0.05, waveDist);',
        '  if (intpl <= 0.001) {',
        '    discard;',
        '  }',
        '  vec2 distUV = mix(vUv, (newUV - 0.5) * intpl + 0.5, intpl);',
        '  vec4 t2 = texture2D(texture2, distUV);',
        '  gl_FragColor = vec4(t2.rgb * intpl, intpl * t2.a);',
        '}'
      ].join('\n'),
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const transitionMesh = new THREE.Mesh(transitionGeo, transitionMat);
    const transitionScene = new THREE.Scene();
    const transitionCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    transitionScene.add(transitionMesh);
    let isTransitionActive = true;

    // Meshes references
    let mainFeatherVane = null;
    let mainFeatherQuill = null;
    const particleMeshes = [];
    const particleRotations = [];

    // Keyframe states & resting intervals for Intro + 5 Pillars
    // Stage 0: Hero Large Radiant White Feather on Left, centered vertically in middle of viewport (y = 0.25, ry = 0.85, rx = 1.571, scale = 2.45)
    // Flowing across slides: Intro (Left) -> P1 (Right) -> P2 (Left) -> P3 (Right) -> P4 (Left) -> P5 (Right)
    // ZERO up-down movement: y remains locked at 0.25 across ALL stages (dead center of viewport with balanced top/bottom margins)
    const STAGE_INTERVALS = [
      // 0: Section Intro (Five Pillars Engineered for Scale & Resilience) - User request: black color feature
      {
        restStart: 0.00,
        restEnd: 0.14,
        kf: { x: -2.15, y: 0.25, z: 1.05, rx: 1.571, ry: 0.85, rz: 0.0, scale: 2.50, isWhite: false }
      },
      // 1: Pillar 1 - Custom Architecture Engineered for Scale (no changes - white feather)
      {
        restStart: 0.19,
        restEnd: 0.32,
        kf: { x: 2.10, y: 0.25, z: 1.05, rx: 1.571, ry: 0.85, rz: 0.0, scale: 2.50, isWhite: true }
      },
      // 2: Pillar 2 - Workflow Automation Autonomous & Zero-Lag (Image 2 #cec9c9 background + Black Feather)
      {
        restStart: 0.37,
        restEnd: 0.49,
        kf: { x: -2.15, y: 0.25, z: 1.05, rx: 1.571, ry: 0.85, rz: 0.0, scale: 2.50, isWhite: false }
      },
      // 3: Pillar 3 - Migration & Cloud Zero-Downtime Cutover (Image 2 #cec9c9 background + Black Feather)
      {
        restStart: 0.54,
        restEnd: 0.67,
        kf: { x: 2.10, y: 0.25, z: 1.05, rx: 1.571, ry: 0.85, rz: 0.0, scale: 2.50, isWhite: false }
      },
      // 4: Pillar 4 - Deluge & Scripting High-Performance Logic (no changes - white feather)
      {
        restStart: 0.72,
        restEnd: 0.85,
        kf: { x: -2.15, y: 0.25, z: 1.05, rx: 1.571, ry: 0.85, rz: 0.0, scale: 2.50, isWhite: true }
      },
      // 5: Pillar 5 - Security & Governance Military-Grade Compliance (no changes - white feather)
      {
        restStart: 0.89,
        restEnd: 1.00,
        kf: { x: 2.10, y: 0.25, z: 1.05, rx: 1.571, ry: 0.85, rz: 0.0, scale: 2.50, isWhite: true }
      }
    ];

    // Current and Target interpolated states for silky lerp smoothing
    const currentTransform = {
      x: STAGE_INTERVALS[0].kf.x,
      y: STAGE_INTERVALS[0].kf.y,
      z: STAGE_INTERVALS[0].kf.z,
      rx: STAGE_INTERVALS[0].kf.rx,
      ry: STAGE_INTERVALS[0].kf.ry,
      rz: STAGE_INTERVALS[0].kf.rz,
      scale: STAGE_INTERVALS[0].kf.scale,
      isWhite: false
    };

    const targetTransform = {
      x: STAGE_INTERVALS[0].kf.x,
      y: STAGE_INTERVALS[0].kf.y,
      z: STAGE_INTERVALS[0].kf.z,
      rx: STAGE_INTERVALS[0].kf.rx,
      ry: STAGE_INTERVALS[0].kf.ry,
      rz: STAGE_INTERVALS[0].kf.rz,
      scale: STAGE_INTERVALS[0].kf.scale,
      isWhite: false
    };

    let featherMixer = null;

    // Load 3D Feather Model (feather-full-animated.glb is the self-contained official composites.archi geometry with wind flutter rig)
    if (typeof THREE.GLTFLoader !== 'undefined') {
      const gltfLoader = new THREE.GLTFLoader();
      if (typeof THREE.DRACOLoader !== 'undefined') {
        try {
          const dracoLoader = new THREE.DRACOLoader();
          dracoLoader.setDecoderPath('../js/draco/gltf/');
          gltfLoader.setDRACOLoader(dracoLoader);
        } catch (dracoErr) {
          console.warn('FeatherEngine: DRACOLoader initialization deferred/bypassed:', dracoErr);
        }
      }
      gltfLoader.load(
        '../assets/feather/feather-full-animated.glb',
        (gltf) => {
          console.log('FeatherEngine: 3D animated feather loaded successfully with flutter rig');
          setupFeatherModel(gltf.scene, gltf.animations);
        },
        undefined,
        (err) => {
          console.warn('FeatherEngine: feather-full-animated.glb load error, attempting fallback feather-full.glb', err);
          gltfLoader.load(
            '../assets/feather/feather-full.glb',
            (gltfFallback) => {
              setupFeatherModel(gltfFallback.scene, gltfFallback.animations);
            },
            undefined,
            (err2) => {
              console.error('FeatherEngine: All GLB models failed to load', err2);
            }
          );
        }
      );
    } else {
      console.warn('FeatherEngine: THREE.GLTFLoader is undefined.');
    }

    function setupFeatherModel(modelScene, animations) {
      // 1. Build Main Feather (Stage 0: Left side, ONE radiant white feather)
      const mainPivotGroup = new THREE.Group();
      
      // Center geometry around (0, 0, 0) by offsetting y: -1.14
      modelScene.position.set(0, -1.14, 0);

      modelScene.traverse((node) => {
        if (node.isMesh) {
          const name = (node.name || '').toLowerCase();
          if (name.includes('quill') || name.includes('stem')) {
            node.material = currentTransform.isWhite ? whiteQuillMaterial : blackQuillMaterial;
            mainFeatherQuill = node;
          } else {
            node.material = currentTransform.isWhite ? whiteFeatherMaterial : blackFeatherMaterial;
            mainFeatherVane = node;
          }
        }
      });

      // User Requirement 1: "dont want the feature should flot up and down everytime as in the image 1 attached"
      // Disable skeletal idle translation flutter so the feather stays stably anchored without bobbing up and down.
      featherMixer = null;

      mainPivotGroup.add(modelScene);
      mainFeatherGroup.add(mainPivotGroup);
      applyTransform(currentTransform);

      // 3. Build Floating Background Feathers (Using Image 1 black feather with chromatic edges)
      // "use image 1 as a backgroud feature on the pillar page only"
      const pGeo = new THREE.PlaneGeometry(1.05, 2.02, 8, 16);
      const posAttr = pGeo.attributes.position;
      for (let j = 0; j < posAttr.count; j++) {
        const px = posAttr.getX(j);
        const py = posAttr.getY(j);
        const pz = (1 - (px / 0.525) ** 2) * 0.08 - (py / 1.01) ** 2 * 0.035;
        posAttr.setZ(j, pz);
      }
      pGeo.computeVertexNormals();

      const BG_FEATHERS_CONFIG = [
        // 1: Top-center-left tilted feather
        { x: -1.9, y: 2.6, z: -2.2, rx: 0.15, ry: -0.1, rz: -0.85, scale: 1.15, opacity: 0.46, speed: 0.14 },
        // 2: Top-left corner floating feather
        { x: -4.3, y: 2.1, z: -1.8, rx: -0.1, ry: 0.1, rz: -0.35, scale: 1.10, opacity: 0.50, speed: 0.12 },
        // 3: Far-left edge vertical feather
        { x: -4.8, y: 0.2, z: -1.6, rx: 0.05, ry: -0.05, rz: 0.15, scale: 1.05, opacity: 0.48, speed: 0.14 },
        // 4: Bottom-left corner feather
        { x: -3.8, y: -2.2, z: -2.0, rx: -0.1, ry: -0.08, rz: 0.30, scale: 1.05, opacity: 0.45, speed: 0.12 },
        // 5: Small feather below main feather stem
        { x: -3.2, y: -1.7, z: -1.4, rx: 0.1, ry: 0.1, rz: -0.55, scale: 0.90, opacity: 0.46, speed: 0.15 },
        // 6: Deep background left feather
        { x: -3.3, y: 0.8, z: -2.6, rx: 0.08, ry: 0.12, rz: -0.20, scale: 0.95, opacity: 0.38, speed: 0.11 },
        // 7: Bottom-left-center subtle feather
        { x: -1.8, y: -2.1, z: -1.9, rx: 0.12, ry: 0.05, rz: 0.85, scale: 1.05, opacity: 0.42, speed: 0.13 },
        // 8: Bottom-center horizontal feather
        { x: 0.2, y: -2.3, z: -2.2, rx: 0.1, ry: 0.05, rz: 1.45, scale: 1.10, opacity: 0.42, speed: 0.12 },
        // 9: Top-center-right tilted feather (above headline)
        { x: 1.2, y: 2.5, z: -2.4, rx: 0.05, ry: -0.08, rz: -0.75, scale: 1.00, opacity: 0.42, speed: 0.13 },
        // 10: Top-right horizontal feather (above-right of headline)
        { x: 3.8, y: 2.3, z: -2.1, rx: 0.1, ry: -0.12, rz: -1.15, scale: 1.15, opacity: 0.50, speed: 0.14 },
        // 11: Far mid-right tilted feather
        { x: 4.8, y: 1.2, z: -1.9, rx: -0.1, ry: 0.08, rz: -0.65, scale: 1.18, opacity: 0.52, speed: 0.13 },
        // 12: Bottom-right diagonal feather
        { x: 4.5, y: -1.5, z: -2.0, rx: 0.08, ry: -0.05, rz: 0.28, scale: 1.10, opacity: 0.48, speed: 0.14 },
        // 13: Bottom-right-center feather
        { x: 2.8, y: -2.2, z: -2.3, rx: -0.08, ry: 0.1, rz: -0.35, scale: 1.00, opacity: 0.40, speed: 0.12 }
      ];

      for (let i = 0; i < BG_FEATHERS_CONFIG.length; i++) {
        const cfg = BG_FEATHERS_CONFIG[i];
        const pPivot = new THREE.Group();
        pPivot.scale.set(cfg.scale, cfg.scale, cfg.scale);
        pPivot.position.set(cfg.x, cfg.y, cfg.z);
        pPivot.rotation.set(cfg.rx, cfg.ry, cfg.rz);

        const customVaneMat = new THREE.MeshBasicMaterial({
          map: featherChromaTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: cfg.opacity,
          depthWrite: false
        });

        const pMesh = new THREE.Mesh(pGeo, customVaneMat);
        pPivot.add(pMesh);
        particlesGroup.add(pPivot);
        particleMeshes.push({
          group: pPivot,
          mat: customVaneMat,
          baseOpacity: cfg.opacity,
          baseX: cfg.x,
          baseY: cfg.y,
          baseRy: cfg.ry,
          baseRz: cfg.rz,
          speed: cfg.speed || 0.13,
          seed: i * 1.618
        });
      }

      console.log('FeatherEngine: 3D Feather models (Hero + ' + BG_FEATHERS_CONFIG.length + ' Background feathers from Image 1) mounted.');
    }

    function applyTransform(st) {
      if (!mainFeatherGroup) return;

      mainFeatherGroup.position.set(st.x, 0.25, st.z);
      mainFeatherGroup.rotation.set(st.rx, st.ry, st.rz);
      mainFeatherGroup.scale.set(st.scale, st.scale, st.scale);

      // Support dynamic switching: radiant white feather vs sleek black feather per stage
      if (st.isWhite) {
        if (mainFeatherVane && mainFeatherVane.material !== whiteFeatherMaterial) {
          mainFeatherVane.material = whiteFeatherMaterial;
        }
        if (mainFeatherQuill && mainFeatherQuill.material !== whiteQuillMaterial) {
          mainFeatherQuill.material = whiteQuillMaterial;
        }
      } else {
        if (mainFeatherVane && mainFeatherVane.material !== blackFeatherMaterial) {
          mainFeatherVane.material = blackFeatherMaterial;
        }
        if (mainFeatherQuill && mainFeatherQuill.material !== blackQuillMaterial) {
          mainFeatherQuill.material = blackQuillMaterial;
        }
      }
    }

    // Interactive Mouse Tracking with smooth momentum
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseCurrentX = 0;
    let mouseCurrentY = 0;

    function onMouseMove(e) {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      mouseTargetX = Math.max(-1, Math.min(1, (e.clientX / w) * 2 - 1));
      mouseTargetY = Math.max(-1, Math.min(1, (e.clientY / h) * 2 - 1));
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Smooth Scroll Interpolation Method
    // Directly maps overall progress [0.0..1.0] to settled slide resting states & dynamic swooping transitions
    function updateScroll(param1, param2) {
      isVisible = true;
      let p;
      if (typeof param2 === 'undefined') {
        p = Math.max(0, Math.min(1, param1));
      } else {
        // Compatibility for (stageIndex, stageProgress)
        p = Math.max(0, Math.min(1, (param1 + param2) / 6.0));
      }

      // Liquid Transition Wave Control (from top seam p = 0.0 to p = 0.14)
      if (p <= 0.14) {
        isTransitionActive = true;
        // From p = 0.00 to 0.06: pure rest on Tech Stack (progress = -0.20, 100% transparent canvas)
        // From p = 0.06 to 0.14: liquid wave sweeps across from bottom to top (-0.05 to 1.05)
        let progVal = -0.20;
        if (p > 0.06) {
          const normP = Math.max(0, Math.min(1, (p - 0.06) / 0.08));
          progVal = -0.05 + normP * 1.10;
        }
        if (transitionMat) {
          transitionMat.uniforms.progress.value = progVal;
        }
      } else {
        isTransitionActive = false;
      }

      // Control background small/medium feathers: visible ONLY on the intro stage!
      // When scrolling past intro into Pillar 1 (p from 0.14 to 0.19), fade smoothly to 0.
      const introFade = Math.max(0, Math.min(1, (0.19 - p) / 0.05));
      if (introFade <= 0.001) {
        if (particlesGroup) particlesGroup.visible = false;
      } else {
        if (particlesGroup) {
          particlesGroup.visible = true;
          // No vertical movement: stay fixed at y = 0
          particlesGroup.position.y = 0;
          for (let i = 0; i < particleMeshes.length; i++) {
            if (particleMeshes[i].mat) {
              particleMeshes[i].mat.opacity = particleMeshes[i].baseOpacity * introFade;
            }
          }
        }
      }

      // Find which stage interval or transition window p falls into
      const numStages = STAGE_INTERVALS.length;
      let targetKf = null;

      if (p <= STAGE_INTERVALS[0].restEnd) {
        // Intro resting
        targetKf = STAGE_INTERVALS[0].kf;
        targetTransform.x = targetKf.x;
        targetTransform.y = targetKf.y;
        targetTransform.z = targetKf.z;
        targetTransform.rx = targetKf.rx;
        targetTransform.ry = targetKf.ry;
        targetTransform.rz = targetKf.rz;
        targetTransform.scale = targetKf.scale;
        targetTransform.isWhite = targetKf.isWhite;
      } else if (p >= STAGE_INTERVALS[numStages - 1].restStart) {
        // Last slide resting right up to 1.00 (Point 4: Never disappears!)
        targetKf = STAGE_INTERVALS[numStages - 1].kf;
        targetTransform.x = targetKf.x;
        targetTransform.y = targetKf.y;
        targetTransform.z = targetKf.z;
        targetTransform.rx = targetKf.rx;
        targetTransform.ry = targetKf.ry;
        targetTransform.rz = targetKf.rz;
        targetTransform.scale = targetKf.scale;
        targetTransform.isWhite = targetKf.isWhite;
      } else {
        // Find interval or transition
        for (let i = 0; i < numStages; i++) {
          const cur = STAGE_INTERVALS[i];
          if (p >= cur.restStart && p <= cur.restEnd) {
            // Perfectly settled on this slide
            targetTransform.x = cur.kf.x;
            targetTransform.y = cur.kf.y;
            targetTransform.z = cur.kf.z;
            targetTransform.rx = cur.kf.rx;
            targetTransform.ry = cur.kf.ry;
            targetTransform.rz = cur.kf.rz;
            targetTransform.scale = cur.kf.scale;
            targetTransform.isWhite = cur.kf.isWhite;
            break;
          }

          if (i < numStages - 1) {
            const next = STAGE_INTERVALS[i + 1];
            if (p > cur.restEnd && p < next.restStart) {
              // In transition between stage i and stage i+1
              const t = (p - cur.restEnd) / (next.restStart - cur.restEnd);
              const clampedT = Math.max(0, Math.min(1, t));
              // Quintic smootherstep curve: 6t^5 - 15t^4 + 10t^3 for zero-jerk luxury glide
              const ep = clampedT * clampedT * clampedT * (clampedT * (clampedT * 6 - 15) + 10);

              // Smooth 3D aerodynamic glide curve (User Requirement 2: smooth animation between all pages)
              const arc = Math.sin(clampedT * Math.PI);
              targetTransform.x = cur.kf.x + (next.kf.x - cur.kf.x) * ep;
              targetTransform.y = 0.25; // Locked vertically - zero up/down floating! (User Requirement 1)
              targetTransform.z = cur.kf.z - arc * 0.45; // Subtle luxury depth swoop
              targetTransform.rx = cur.kf.rx;
              const travelDir = next.kf.x > cur.kf.x ? 1 : -1;
              targetTransform.ry = cur.kf.ry + travelDir * arc * 0.25;
              targetTransform.rz = cur.kf.rz - travelDir * arc * 0.15;
              targetTransform.scale = cur.kf.scale;
              targetTransform.isWhite = ep > 0.50 ? next.kf.isWhite : cur.kf.isWhite;
              break;
            }
          }
        }
      }
    }

    // Animation Render Loop with Continuous Synchronized Tracking
    let clock = new THREE.Clock();
    let isVisible = true;

    function renderLoop() {
      requestAnimationFrame(renderLoop);
      window.__featherLoopCounter = (window.__featherLoopCounter || 0) + 1;
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      window.__featherDelta = delta;
      window.__featherParticleMeshesCount = particleMeshes.length;
      window.__featherParticlesVisible = particlesGroup ? particlesGroup.visible : null;
      if (transitionMat) {
        transitionMat.uniforms.time.value = elapsed;
      }
      if (featherMixer) {
        featherMixer.update(delta);
      }

      // Smooth mouse lerp
      mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.05;
      mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.05;

      // Silky smooth lerp damping across all transforms (User Requirement 2: smooth animation between all pages)
      const lerpFactor = 0.09;
      currentTransform.x += (targetTransform.x - currentTransform.x) * lerpFactor;
      currentTransform.y = 0.25; // Strictly locked vertically (User Requirement 1)
      currentTransform.z += (targetTransform.z - currentTransform.z) * lerpFactor;
      currentTransform.rx += (targetTransform.rx - currentTransform.rx) * lerpFactor;
      currentTransform.ry += (targetTransform.ry - currentTransform.ry) * lerpFactor;
      currentTransform.rz += (targetTransform.rz - currentTransform.rz) * lerpFactor;
      currentTransform.scale += (targetTransform.scale - currentTransform.scale) * lerpFactor;
      currentTransform.isWhite = targetTransform.isWhite;

      // Zero up-down movement on main feather (User requirement: no up-down movement, centered in middle of black page)
      if (mainFeatherGroup) {
        applyTransform(currentTransform);
      }

      // Camera & Group subtle horizontal parallax tracking, ZERO vertical movement
      camera.rotation.x = 0;
      globalGroup.rotation.x = 0;
      camera.rotation.y = -mouseCurrentX * 0.005;
      globalGroup.rotation.y = mouseCurrentX * 0.005;

      // Ambient downward falling animation for background feathers matching original video
      if (particlesGroup && particlesGroup.visible) {
        for (let i = 0; i < particleMeshes.length; i++) {
          const item = particleMeshes[i];
          // Continuous downward drift
          item.group.position.y -= item.speed * delta;
          if (item.group.position.y < -3.8) {
            item.group.position.y = 3.6 + (item.seed % 1.2);
          }
          // Gentle lateral sway & rotation flutter
          item.group.position.x = item.baseX + Math.sin(elapsed * 0.6 + item.seed) * 0.08;
          item.group.rotation.z = item.baseRz + Math.sin(elapsed * 0.8 + item.seed) * 0.035;
          item.group.rotation.y = item.baseRy + Math.cos(elapsed * 0.5 + item.seed) * 0.025;
        }
      }

      // Direct 60fps Render with 100% transparent alpha (clean composite with section backgrounds)
      renderer.setRenderTarget(null);
      renderer.setClearColor(0x000000, 0);
      renderer.render(scene, camera);
    }
    renderLoop();

    // Responsive window resize handler
    function onResize() {
      if (!container || !renderer || !camera) return;
      const w = getW();
      const h = getH();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (fboScene2) {
        fboScene2.setSize(w, h);
      }
      if (transitionMat) {
        transitionMat.uniforms.resolution.value.set(w, h, 1, 1);
      }
    }
    window.addEventListener('resize', onResize);

    // Intersection observer to pause rendering when section is offscreen
    if ('IntersectionObserver' in window) {
      const parentSection = document.getElementById('coreEnterprisePillarsSection') || container;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      }, { rootMargin: '400px 0px 400px 0px', threshold: 0.001 });
      observer.observe(parentSection);
    }

    window.FeatherScrollEngine.isInitialized = true;
    window.FeatherScrollEngine.updateScroll = updateScroll;
    window.FeatherScrollEngine.onResize = onResize;
    window.FeatherScrollEngine.getScene = () => scene;
    window.FeatherScrollEngine.getCamera = () => camera;
    window.FeatherScrollEngine.getStageIntervals = () => STAGE_INTERVALS;
    window.FeatherScrollEngine.getTargetTransform = () => targetTransform;
    window.FeatherScrollEngine.getCurrentTransform = () => currentTransform;
    window.FeatherScrollEngine.getMainFeather = () => ({ group: mainFeatherGroup, vane: mainFeatherVane, quill: mainFeatherQuill });
    window.FeatherScrollEngine.isParticlesVisible = () => Boolean(particlesGroup && particlesGroup.visible);
    window.FeatherScrollEngine.renderFrame = renderLoop;
    window.FeatherScrollEngine.getIsVisible = () => isVisible;
    window.FeatherScrollEngine.setIsVisible = (v) => { isVisible = Boolean(v); };

    return window.FeatherScrollEngine;
  }
})();
