"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ChevronDown, ChevronUp, Compass, RotateCcw, Sparkle, Volume2, VolumeX } from "@/components/icons";
import { cn } from "@/lib/utils/cn";
import { playBlockBreak, playSlotSelect, playXpChime } from "./voxelAudio";
import { createVoxelTextures } from "./voxelTextures";

export type BiomeId = "overworld" | "nether" | "end";
export type CameraPresetId = "overview" | "aerial" | "altar";

type VoxelWorldHeroProps = {
  locale: string;
  className?: string;
};

type BiomeTheme = {
  label: string;
  sky: number;
  fog: number;
  crystal: number;
  emissive: number;
  keyLight: number;
  rimLight: number;
};

const BIOME_THEMES: Record<BiomeId, BiomeTheme> = {
  overworld: {
    label: "Overworld",
    sky: 0x0b1220,
    fog: 0x0b1220,
    crystal: 0x34d399,
    emissive: 0x10b981,
    keyLight: 0xfff5e4,
    rimLight: 0x22d3ee,
  },
  nether: {
    label: "Nether Forge",
    sky: 0x180a0d,
    fog: 0x180a0d,
    crystal: 0xfbbf24,
    emissive: 0xf97316,
    keyLight: 0xffd2a6,
    rimLight: 0xef4444,
  },
  end: {
    label: "End Sanctum",
    sky: 0x0c0919,
    fog: 0x0c0919,
    crystal: 0x22d3ee,
    emissive: 0xa855f7,
    keyLight: 0xe9d5ff,
    rimLight: 0x22d3ee,
  },
};

type CameraPreset = {
  label: string;
  position: [number, number, number];
  target: [number, number, number];
};

const CAMERA_PRESETS: Record<CameraPresetId, CameraPreset> = {
  overview: {
    label: "Overview",
    position: [13.5, 9.2, 15.0],
    target: [-2.2, 1.8, 0.0],
  },
  aerial: {
    label: "Aerial",
    position: [0.2, 18.5, 13.5],
    target: [-1.0, 1.2, 0.0],
  },
  altar: {
    label: "Altar",
    position: [6.2, 5.4, 7.6],
    target: [0.0, 3.0, 0.0],
  },
};

interface BlockRecord {
  x: number;
  y: number;
  z: number;
  type: "grass" | "dirt" | "stone" | "obsidian" | "diamond" | "emerald" | "gold" | "log" | "leaves";
}

function generateIslandBlocks(): BlockRecord[] {
  const blocks: BlockRecord[] = [];
  const occupied = new Set<string>();

  const push = (
    x: number,
    y: number,
    z: number,
    type: BlockRecord["type"],
  ) => {
    const key = `${x},${y},${z}`;
    if (occupied.has(key)) return;
    occupied.add(key);
    blocks.push({ x, y, z, type });
  };

  // Sculpted floating voxel landmass radius ~6
  for (let x = -6; x <= 6; x++) {
    for (let z = -6; z <= 6; z++) {
      const dist = Math.hypot(x * 0.95, z * 1.02);
      const wave = Math.sin(x * 0.7) * Math.cos(z * 0.7) * 0.8;
      if (dist > 5.7 + wave * 0.45) continue;

      const surfaceY = dist < 2.4 ? 1 : dist < 4.5 ? 0 : 0;
      const depth = Math.max(1, Math.round(4.6 - dist * 0.68 + wave));

      for (let dy = 0; dy <= depth; dy++) {
        const y = surfaceY - dy;
        if (dy === 0) {
          // Carved obsidian plaza around central altar (dist < 2.2)
          if (Math.abs(x) <= 2 && Math.abs(z) <= 2) {
            push(x, y, z, "obsidian");
          } else {
            push(x, y, z, "grass");
          }
        } else if (dy === 1) {
          push(x, y, z, "dirt");
        } else {
          // Embed rare diamond & emerald ores deep in underside cliff faces
          const hash = Math.abs((x * 73856093) ^ (y * 19349663) ^ (z * 83492791)) % 19;
          if (hash === 0) {
            push(x, y, z, "diamond");
          } else if (hash === 3 || hash === 11) {
            push(x, y, z, "emerald");
          } else {
            push(x, y, z, "stone");
          }
        }
      }
    }
  }

  // Stepped Gold + Obsidian Enchantment Altar corners
  const corners: [number, number][] = [
    [-2, -2],
    [2, -2],
    [-2, 2],
    [2, 2],
  ];
  for (const [cx, cz] of corners) {
    push(cx, 2, cz, "gold");
  }

  // Sculpted Minecraft Oak Tree on back-right knoll (x=4, z=-3)
  const treeX = 4;
  const treeZ = -3;
  for (let ty = 1; ty <= 4; ty++) {
    push(treeX, ty, treeZ, "log");
  }
  for (let lx = treeX - 2; lx <= treeX + 2; lx++) {
    for (let lz = treeZ - 2; lz <= treeZ + 2; lz++) {
      for (let ly = 4; ly <= 6; ly++) {
        if (ly === 6 && Math.abs(lx - treeX) + Math.abs(lz - treeZ) > 1) continue;
        if (ly === 4 && Math.abs(lx - treeX) === 2 && Math.abs(lz - treeZ) === 2) continue;
        if (lx === treeX && lz === treeZ && ly <= 4) continue;
        push(lx, ly, lz, "leaves");
      }
    }
  }

  // Secondary smaller birch/emerald sapling corner (-4, 3)
  for (let ty = 1; ty <= 3; ty++) {
    push(-4, ty, 3, "log");
  }
  for (let lx = -5; lx <= -3; lx++) {
    for (let lz = 2; lz <= 4; lz++) {
      for (let ly = 3; ly <= 4; ly++) {
        if (lx === -4 && lz === 3 && ly === 3) continue;
        if (ly === 4 && Math.abs(lx + 4) + Math.abs(lz - 3) > 1) continue;
        push(lx, ly, lz, "leaves");
      }
    }
  }

  return blocks;
}

export function VoxelWorldHero({ locale, className }: VoxelWorldHeroProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  const [biome, setBiome] = useState<BiomeId>("overworld");
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>("overview");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [blocksMined, setBlocksMined] = useState(0);
  const [xpLevel, setXpLevel] = useState(7);
  const [contextLost, setContextLost] = useState(false);

  const biomeRef = useRef<BiomeId>(biome);
  const soundRef = useRef<boolean>(soundEnabled);
  const presetTriggerRef = useRef<{
    active: boolean;
    position: THREE.Vector3;
    target: THREE.Vector3;
  }>({
    active: false,
    position: new THREE.Vector3(...CAMERA_PRESETS.overview.position),
    target: new THREE.Vector3(...CAMERA_PRESETS.overview.target),
  });

  useEffect(() => {
    biomeRef.current = biome;
  }, [biome]);

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "h" || e.key === "H") {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const applyCameraPreset = (id: CameraPresetId) => {
    setCameraPreset(id);
    const p = CAMERA_PRESETS[id];
    presetTriggerRef.current.position.set(...p.position);
    presetTriggerRef.current.target.set(...p.target);
    presetTriggerRef.current.active = true;
    if (soundRef.current) playSlotSelect();
  };

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Detect software GL (SwiftShader / llvmpipe) to avoid choking frame loop
    const rawGl = renderer.getContext();
    const debugInfo = rawGl.getExtension("WEBGL_debug_renderer_info");
    const rendererString = debugInfo
      ? String(rawGl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) ?? "")
      : "";
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(
      rendererString,
    );

    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2),
    );
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth || 800, container.clientHeight || 600);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    // Scene + Fog + Environment
    const scene = new THREE.Scene();
    const initialBiome = BIOME_THEMES[biomeRef.current];
    const currentSkyColor = new THREE.Color(initialBiome.sky);
    scene.background = currentSkyColor;
    const fog = new THREE.FogExp2(initialBiome.fog, 0.022);
    scene.fog = fog;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // Camera & OrbitControls
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 140);
    camera.position.set(...CAMERA_PRESETS.overview.position);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.overview.target);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 30;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.update();

    const onControlStart = () => {
      presetTriggerRef.current.active = false;
    };
    controls.addEventListener("start", onControlStart);

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xb8e1ff, 0x161b26, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(initialBiome.keyLight, 2.2);
    keyLight.position.set(14, 22, 12);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 2;
      keyLight.shadow.camera.far = 55;
      keyLight.shadow.camera.left = -12;
      keyLight.shadow.camera.right = 12;
      keyLight.shadow.camera.top = 12;
      keyLight.shadow.camera.bottom = -12;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(initialBiome.rimLight, 1.35);
    rimLight.position.set(-14, 8, -12);
    scene.add(rimLight);

    const altarPointLight = new THREE.PointLight(initialBiome.crystal, 2.8, 16, 1.5);
    altarPointLight.position.set(0, 4.4, 0);
    scene.add(altarPointLight);

    // Textures
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
    const texSet = createVoxelTextures(maxAnisotropy);

    // Shared Voxel Geometry
    const voxelGeo = new THREE.BoxGeometry(1, 1, 1);

    // Materials (grass uses 6-face material array for crisp top/side/dirt contrast)
    const grassTopMat = new THREE.MeshStandardMaterial({
      map: texSet.grassTop,
      roughness: 0.78,
      metalness: 0.02,
    });
    const grassSideMat = new THREE.MeshStandardMaterial({
      map: texSet.grassSide,
      roughness: 0.82,
      metalness: 0.02,
    });
    const dirtMat = new THREE.MeshStandardMaterial({
      map: texSet.dirt,
      roughness: 0.9,
      metalness: 0.0,
    });
    const stoneMat = new THREE.MeshStandardMaterial({
      map: texSet.stone,
      roughness: 0.85,
      metalness: 0.08,
    });
    const obsidianMat = new THREE.MeshStandardMaterial({
      map: texSet.obsidian,
      roughness: 0.35,
      metalness: 0.45,
    });
    const diamondMat = new THREE.MeshStandardMaterial({
      map: texSet.diamondOre,
      roughness: 0.45,
      metalness: 0.25,
      emissive: new THREE.Color(0x0891b2),
      emissiveIntensity: 0.3,
    });
    const emeraldMat = new THREE.MeshStandardMaterial({
      map: texSet.emeraldOre,
      roughness: 0.45,
      metalness: 0.25,
      emissive: new THREE.Color(0x10b981),
      emissiveIntensity: 0.35,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      map: texSet.goldBlock,
      roughness: 0.25,
      metalness: 0.85,
    });
    const logMat = new THREE.MeshStandardMaterial({
      map: texSet.oakLog,
      roughness: 0.88,
      metalness: 0.0,
    });
    const leavesMat = new THREE.MeshStandardMaterial({
      map: texSet.oakLeaves,
      roughness: 0.78,
      metalness: 0.02,
    });

    const disposableMaterials: THREE.Material[] = [
      grassTopMat,
      grassSideMat,
      dirtMat,
      stoneMat,
      obsidianMat,
      diamondMat,
      emeraldMat,
      goldMat,
      logMat,
      leavesMat,
    ];

    // World Group (entire floating island gently bobs together)
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Build InstancedMeshes grouped by block type for crisp draw-call efficiency
    const allBlocks = generateIslandBlocks();
    const groupedBlocks: Record<BlockRecord["type"], BlockRecord[]> = {
      grass: [],
      dirt: [],
      stone: [],
      obsidian: [],
      diamond: [],
      emerald: [],
      gold: [],
      log: [],
      leaves: [],
    };
    for (const block of allBlocks) {
      groupedBlocks[block.type].push(block);
    }

    const materialMap: Record<BlockRecord["type"], THREE.Material | THREE.Material[]> = {
      grass: [grassSideMat, grassSideMat, grassTopMat, dirtMat, grassSideMat, grassSideMat],
      dirt: dirtMat,
      stone: stoneMat,
      obsidian: obsidianMat,
      diamond: diamondMat,
      emerald: emeraldMat,
      gold: goldMat,
      log: logMat,
      leaves: leavesMat,
    };

    const dummyMatrix = new THREE.Matrix4();
    const interactiveMeshes: THREE.InstancedMesh[] = [];
    const instanceBlockLookup = new Map<THREE.InstancedMesh, BlockRecord[]>();

    (Object.keys(groupedBlocks) as BlockRecord["type"][]).forEach((type) => {
      const list = groupedBlocks[type];
      if (list.length === 0) return;

      const mesh = new THREE.InstancedMesh(voxelGeo, materialMap[type], list.length);
      mesh.castShadow = !isSoftwareGl;
      mesh.receiveShadow = !isSoftwareGl;
      list.forEach((b, idx) => {
        dummyMatrix.makeTranslation(b.x, b.y, b.z);
        mesh.setMatrixAt(idx, dummyMatrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
      worldGroup.add(mesh);
      interactiveMeshes.push(mesh);
      instanceBlockLookup.set(mesh, list);
    });

    // Translucent flowing waterfall cascade off front-left edge (x=-3..0, z=4)
    const waterGeo = new THREE.BoxGeometry(0.92, 3.8, 0.92);
    const waterMat = new THREE.MeshPhysicalMaterial({
      map: texSet.water,
      color: 0x22d3ee,
      roughness: 0.14,
      metalness: 0.05,
      transmission: 0.45,
      transparent: true,
      opacity: 0.85,
      ior: 1.33,
    });
    disposableMaterials.push(waterMat);
    const waterfall = new THREE.Mesh(waterGeo, waterMat);
    waterfall.position.set(-1, -0.4, 5.2);
    worldGroup.add(waterfall);

    // Central Enchanted Coding Altar Group (composite multi-part focal piece)
    const altarGroup = new THREE.Group();
    altarGroup.position.set(0, 2.0, 0);
    worldGroup.add(altarGroup);

    const pedestalGeo = new THREE.BoxGeometry(1.75, 0.42, 1.75);
    const pedestal = new THREE.Mesh(pedestalGeo, obsidianMat);
    pedestal.position.set(0, -0.25, 0);
    pedestal.castShadow = !isSoftwareGl;
    pedestal.receiveShadow = !isSoftwareGl;
    altarGroup.add(pedestal);

    const crystalGeo = new THREE.OctahedronGeometry(0.82, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: initialBiome.crystal,
      emissive: initialBiome.emissive,
      emissiveIntensity: 0.55,
      roughness: 0.08,
      metalness: 0.15,
      transmission: 0.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      flatShading: true,
    });
    disposableMaterials.push(crystalMat);
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.set(0, 1.65, 0);
    altarGroup.add(crystalMesh);

    const ringGeo = new THREE.TorusGeometry(1.45, 0.06, 6, 4);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.9,
      roughness: 0.18,
      emissive: 0xd97706,
      emissiveIntensity: 0.25,
    });
    disposableMaterials.push(ringMat);

    const innerRing = new THREE.Mesh(ringGeo, ringMat);
    innerRing.position.set(0, 1.65, 0);
    innerRing.rotation.x = Math.PI / 3;
    altarGroup.add(innerRing);

    const outerRingGeo = new THREE.TorusGeometry(1.95, 0.05, 6, 4);
    const outerRing = new THREE.Mesh(outerRingGeo, crystalMat);
    outerRing.position.set(0, 1.65, 0);
    outerRing.rotation.y = Math.PI / 4;
    altarGroup.add(outerRing);

    // 4 Orbiting Mini Voxel Runes around the crystal
    const runeGeo = new THREE.BoxGeometry(0.32, 0.32, 0.32);
    const runeColors = [0x34d399, 0x22d3ee, 0xfbbf24, 0x06b6d4];
    const runes: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const rMat = new THREE.MeshStandardMaterial({
        color: runeColors[i],
        emissive: runeColors[i],
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.4,
      });
      disposableMaterials.push(rMat);
      const rune = new THREE.Mesh(runeGeo, rMat);
      altarGroup.add(rune);
      runes.push(rune);
    }

    // Drifting Voxel Clouds in upper sky
    const cloudGeo = new THREE.BoxGeometry(1, 0.45, 1);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.95,
      metalness: 0.0,
      transparent: true,
      opacity: 0.32,
    });
    disposableMaterials.push(cloudMat);

    const clouds: { mesh: THREE.Mesh; baseX: number; speed: number; phase: number }[] = [];
    const cloudConfigs: [number, number, number, number, number][] = [
      [-9, 8.2, -7, 3.8, 2.1],
      [7, 9.5, -9, 4.4, 2.4],
      [-5, 7.6, 8, 3.2, 1.8],
      [10, 8.8, 5, 3.6, 2.2],
    ];
    for (const [cx, cy, cz, sx, sz] of cloudConfigs) {
      const cMesh = new THREE.Mesh(cloudGeo, cloudMat);
      cMesh.scale.set(sx, 1, sz);
      cMesh.position.set(cx, cy, cz);
      scene.add(cMesh);
      clouds.push({ mesh: cMesh, baseX: cx, speed: 0.25, phase: cx });
    }

    // Ambient floating Emerald XP Particles
    const particleCount = isSoftwareGl ? 36 : 72;
    const particlePositions = new Float32Array(particleCount * 3);
    const particlePhases = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.0 + (i % 5) * 1.1;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = 1.0 + (i % 7) * 0.85;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      particlePhases[i] = i * 0.65;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.16,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    disposableMaterials.push(particleMat);
    const xpPoints = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(xpPoints);

    // Block Hover Wireframe Highlighter
    const highlightEdgesGeo = new THREE.EdgesGeometry(
      new THREE.BoxGeometry(1.04, 1.04, 1.04),
    );
    const highlightEdgesMat = new THREE.LineBasicMaterial({
      color: 0x34d399,
      linewidth: 1,
    });
    disposableMaterials.push(highlightEdgesMat);
    const highlightBox = new THREE.LineSegments(highlightEdgesGeo, highlightEdgesMat);
    highlightBox.visible = false;
    worldGroup.add(highlightBox);

    // Burst Debris Particles (pre-allocated pool of 18 mini voxel cubes)
    const burstPoolSize = 18;
    const burstGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    const burstMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: 0x10b981,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    });
    disposableMaterials.push(burstMat);
    const burstCubes: {
      mesh: THREE.Mesh;
      vel: THREE.Vector3;
      life: number;
    }[] = [];
    for (let i = 0; i < burstPoolSize; i++) {
      const m = new THREE.Mesh(burstGeo, burstMat);
      m.visible = false;
      worldGroup.add(m);
      burstCubes.push({
        mesh: m,
        vel: new THREE.Vector3(),
        life: 0,
      });
    }

    const triggerBlockBurst = (pos: THREE.Vector3, colorHex: number) => {
      burstMat.color.setHex(colorHex);
      burstMat.emissive.setHex(colorHex);
      for (const cube of burstCubes) {
        cube.mesh.position.copy(pos);
        cube.mesh.visible = true;
        cube.mesh.scale.setScalar(1);
        cube.vel.set(
          (Math.random() - 0.5) * 4.5,
          2.2 + Math.random() * 3.5,
          (Math.random() - 0.5) * 4.5,
        );
        cube.life = 0.75;
      }
    };

    // Raycaster & Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerMovedDistance = 0;
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverTime = 0;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const _blockVec = new THREE.Vector3();

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTime < 45) return;
      lastHoverTime = now;

      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, false);
      const hit = hits[0];
      if (hit && hit.instanceId !== undefined && hit.object instanceof THREE.InstancedMesh) {
        const list = instanceBlockLookup.get(hit.object);
        const rec = list?.[hit.instanceId];
        if (rec) {
          highlightBox.position.set(rec.x, rec.y, rec.z);
          highlightBox.visible = true;
          renderer.domElement.style.cursor = "pointer";
          return;
        }
      }
      highlightBox.visible = false;
      renderer.domElement.style.cursor = "grab";
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      pointerMovedDistance = 0;
    };

    const onPointerUp = (e: PointerEvent) => {
      pointerMovedDistance = Math.hypot(
        e.clientX - pointerDownPos.x,
        e.clientY - pointerDownPos.y,
      );
      // Treat clicks with tiny pointer movement as interactive block tap
      if (pointerMovedDistance > 6) return;

      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, false);
      const hit = hits[0];
      if (hit && hit.instanceId !== undefined && hit.object instanceof THREE.InstancedMesh) {
        const list = instanceBlockLookup.get(hit.object);
        const rec = list?.[hit.instanceId];
        if (rec) {
          _blockVec.set(rec.x, rec.y + 0.5, rec.z);
          const color =
            rec.type === "diamond"
              ? 0x22d3ee
              : rec.type === "gold"
                ? 0xfbbf24
                : 0x34d399;
          triggerBlockBurst(_blockVec, color);
          setBlocksMined((prev) => {
            const next = prev + 1;
            if (next % 5 === 0) {
              setXpLevel((lvl) => lvl + 1);
              if (soundRef.current) playXpChime();
            } else if (soundRef.current) {
              playBlockBreak();
            }
            return next;
          });
          if (prefersReducedMotion) {
            renderer.render(scene, camera);
          }
        }
      }
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    // WebGL Context Loss & Restoration
    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);

    // ResizeObserver
    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    });
    ro.observe(container);

    // Pre-allocated vectors for frame loop (zero heap churn)
    const _targetSky = new THREE.Color();
    const _targetCrystal = new THREE.Color();
    const _targetEmissive = new THREE.Color();
    const _targetKey = new THREE.Color();
    const _targetRim = new THREE.Color();
    const _posAttr = particleGeo.getAttribute("position") as THREE.BufferAttribute;

    let rafId = 0;
    let disposed = false;
    let lastTime = performance.now();
    let elapsedTotal = 0;

    // Schedule next frame after software GPU completes if running on SwiftShader/llvmpipe
    const scheduleNextFrame = (fn: () => void) => {
      if (disposed) return;
      if (!isSoftwareGl) {
        rafId = requestAnimationFrame(fn);
        return;
      }
      const gl2 = renderer.getContext() as WebGL2RenderingContext;
      if (typeof gl2.fenceSync === "function") {
        const sync = gl2.fenceSync(gl2.SYNC_GPU_COMMANDS_COMPLETE, 0);
        if (sync) {
          gl2.flush();
          const poll = () => {
            if (disposed) {
              gl2.deleteSync(sync);
              return;
            }
            const status = gl2.clientWaitSync(sync, 0, 0);
            if (status === gl2.TIMEOUT_EXPIRED) {
              rafId = requestAnimationFrame(poll);
            } else {
              gl2.deleteSync(sync);
              rafId = requestAnimationFrame(fn);
            }
          };
          rafId = requestAnimationFrame(poll);
          return;
        }
      }
      rafId = requestAnimationFrame(fn);
    };

    const tick = () => {
      if (disposed) return;

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsedTotal += dt;

      // Smoothly interpolate biome palette
      const targetTheme = BIOME_THEMES[biomeRef.current];
      _targetSky.setHex(targetTheme.sky);
      _targetCrystal.setHex(targetTheme.crystal);
      _targetEmissive.setHex(targetTheme.emissive);
      _targetKey.setHex(targetTheme.keyLight);
      _targetRim.setHex(targetTheme.rimLight);

      const dampSpeed = 4.2;
      currentSkyColor.lerp(_targetSky, Math.min(1, dt * dampSpeed));
      fog.color.copy(currentSkyColor);
      crystalMat.color.lerp(_targetCrystal, Math.min(1, dt * dampSpeed));
      crystalMat.emissive.lerp(_targetEmissive, Math.min(1, dt * dampSpeed));
      altarPointLight.color.lerp(_targetCrystal, Math.min(1, dt * dampSpeed));
      keyLight.color.lerp(_targetKey, Math.min(1, dt * dampSpeed));
      rimLight.color.lerp(_targetRim, Math.min(1, dt * dampSpeed));
      highlightEdgesMat.color.lerp(_targetCrystal, Math.min(1, dt * dampSpeed));
      particleMat.color.lerp(_targetCrystal, Math.min(1, dt * dampSpeed));

      // Floating island & altar choreography
      worldGroup.position.y = Math.sin(elapsedTotal * 0.9) * 0.22;
      crystalMesh.rotation.y += dt * 0.85;
      crystalMesh.rotation.z = Math.sin(elapsedTotal * 1.4) * 0.14;
      crystalMesh.position.y = 1.65 + Math.sin(elapsedTotal * 1.8) * 0.16;

      innerRing.rotation.z += dt * 0.95;
      innerRing.rotation.x = Math.PI / 3 + Math.sin(elapsedTotal * 0.7) * 0.12;
      outerRing.rotation.y -= dt * 0.65;
      outerRing.rotation.z = Math.cos(elapsedTotal * 0.6) * 0.18;

      for (let i = 0; i < runes.length; i++) {
        const r = runes[i];
        if (!r) continue;
        const a = elapsedTotal * 1.15 + (i * Math.PI) / 2;
        r.position.set(
          Math.cos(a) * 2.15,
          1.65 + Math.sin(elapsedTotal * 2.2 + i) * 0.25,
          Math.sin(a) * 2.15,
        );
        r.rotation.y += dt * 1.5;
        r.rotation.x += dt * 0.9;
      }

      // Drifting clouds
      for (const c of clouds) {
        c.mesh.position.x = c.baseX + Math.sin(elapsedTotal * 0.18 + c.phase) * 1.8;
      }

      // Floating XP Particles
      for (let i = 0; i < particleCount; i++) {
        const phase = particlePhases[i] ?? 0;
        const py = ((_posAttr.getY(i) + dt * 0.45) % 6.2) + 0.3;
        _posAttr.setY(i, py);
        _posAttr.setX(i, _posAttr.getX(i) + Math.sin(elapsedTotal + phase) * dt * 0.15);
      }
      _posAttr.needsUpdate = true;

      // Update Burst Debris
      for (const cube of burstCubes) {
        if (cube.life <= 0) continue;
        cube.life -= dt;
        cube.vel.y -= 9.5 * dt;
        cube.mesh.position.addScaledVector(cube.vel, dt);
        cube.mesh.rotation.x += dt * 6;
        cube.mesh.rotation.y += dt * 5;
        const s = Math.max(0.01, cube.life / 0.75);
        cube.mesh.scale.setScalar(s);
        if (cube.life <= 0) {
          cube.mesh.visible = false;
        }
      }

      // Camera Preset Smooth Damping
      if (presetTriggerRef.current.active) {
        const lerpAlpha = 1 - Math.exp(-5.0 * dt);
        camera.position.lerp(presetTriggerRef.current.position, lerpAlpha);
        controls.target.lerp(presetTriggerRef.current.target, lerpAlpha);
        if (
          camera.position.distanceTo(presetTriggerRef.current.position) < 0.05 &&
          controls.target.distanceTo(presetTriggerRef.current.target) < 0.05
        ) {
          presetTriggerRef.current.active = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (!prefersReducedMotion) {
        scheduleNextFrame(tick);
      }
    };

    const onReducedControlChange = () => {
      if (prefersReducedMotion && !disposed) {
        renderer.render(scene, camera);
      }
    };

    if (prefersReducedMotion) {
      controls.addEventListener("change", onReducedControlChange);
      renderer.render(scene, camera);
    } else {
      scheduleNextFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.removeEventListener("start", onControlStart);
      controls.removeEventListener("change", onReducedControlChange);
      controls.dispose();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);

      // Dispose all GPU buffers, textures & materials cleanly
      voxelGeo.dispose();
      waterGeo.dispose();
      pedestalGeo.dispose();
      crystalGeo.dispose();
      ringGeo.dispose();
      outerRingGeo.dispose();
      runeGeo.dispose();
      cloudGeo.dispose();
      particleGeo.dispose();
      highlightEdgesGeo.dispose();
      burstGeo.dispose();
      disposableMaterials.forEach((m) => m.dispose());
      texSet.dispose();
      envTarget.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const isFr = locale === "fr";
  const isAr = locale === "ar";

  return (
    <div className={cn("relative size-full select-none", className)}>
      {/* Dedicated empty mount target for WebGL canvas (no sibling React DOM nodes inside) */}
      <div
        ref={hostRef}
        aria-label="Interactive 3D Minecraft Voxel Island"
        className="absolute inset-0 size-full"
      />

      {contextLost && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0B0E14]/90 text-white font-mono text-xs p-6">
          <span>WebGL context paused — reloading GPU resources...</span>
        </div>
      )}

      {/* Single collapsible bottom HUD dock (zero backdrop-blur over WebGL) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 sm:bottom-4 z-20 flex justify-center px-3">
        <div className="pointer-events-auto flex flex-col items-center gap-1.5">
          {dockCollapsed ? (
            <button
              type="button"
              onClick={() => setDockCollapsed(false)}
              className="inline-flex items-center gap-2 rounded-[var(--radius-control)] border-2 border-border-strong bg-surface/95 px-3 py-1.5 font-mono text-xs font-bold uppercase text-fg shadow-[3px_3px_0px_#05070B] hover:-translate-y-0.5 transition-transform"
              title="Expand 3D World Controls (H)"
            >
              <Sparkle size={14} className="text-accent-text" />
              <span>{isAr ? "تحكم العالم 3D" : isFr ? "Monde 3D" : "3D World"}</span>
              <ChevronUp size={14} />
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-[var(--radius-card)] border-2 border-border-strong bg-surface/95 px-3 py-2 shadow-[4px_4px_0px_#05070B]">
              {/* Biome Switcher */}
              <div className="flex items-center gap-1" role="group" aria-label="Biome selector">
                {(Object.keys(BIOME_THEMES) as BiomeId[]).map((id) => {
                  const active = biome === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setBiome(id);
                        if (soundRef.current) playSlotSelect();
                      }}
                      className={cn(
                        "rounded-[var(--radius-control)] border px-2.5 py-1 font-mono text-[11px] font-bold uppercase transition-colors",
                        active
                          ? "border-accent bg-accent text-accent-fg"
                          : "border-border-subtle bg-bg-subtle text-fg-muted hover:text-fg",
                      )}
                    >
                      {BIOME_THEMES[id].label}
                    </button>
                  );
                })}
              </div>

              <span aria-hidden="true" className="hidden sm:inline-block h-4 w-px bg-border-subtle" />

              {/* Camera Presets */}
              <div className="hidden md:flex items-center gap-1" role="group" aria-label="Camera presets">
                <Compass size={13} className="text-fg-subtle me-1" />
                {(Object.keys(CAMERA_PRESETS) as CameraPresetId[]).map((pid) => {
                  const active = cameraPreset === pid;
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => applyCameraPreset(pid)}
                      className={cn(
                        "rounded-[var(--radius-control)] border px-2 py-1 font-mono text-[11px] font-bold uppercase transition-colors",
                        active
                          ? "border-accent-soft-border bg-accent-soft text-accent-soft-text"
                          : "border-border-subtle bg-bg-subtle text-fg-muted hover:text-fg",
                      )}
                    >
                      {CAMERA_PRESETS[pid].label}
                    </button>
                  );
                })}
              </div>

              <span aria-hidden="true" className="hidden md:inline-block h-4 w-px bg-border-subtle" />

              {/* Blocks Mined + XP Readout + Audio + Reset + Collapse */}
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border border-border-subtle bg-bg-subtle px-2 py-1 font-mono text-[11px] tabular-nums text-fg-muted">
                  <span className="text-accent-text font-bold">LVL {xpLevel}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {blocksMined} {isAr ? "كتلة" : isFr ? "blocs" : "mined"}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => applyCameraPreset("overview")}
                  className="inline-flex size-7 items-center justify-center rounded-[var(--radius-control)] border border-border-subtle bg-bg-subtle text-fg-muted hover:text-fg transition-colors"
                  title={isFr ? "Réinitialiser la caméra" : "Reset camera"}
                  aria-label={isFr ? "Réinitialiser la caméra" : "Reset camera"}
                >
                  <RotateCcw size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) playXpChime();
                  }}
                  className={cn(
                    "inline-flex size-7 items-center justify-center rounded-[var(--radius-control)] border transition-colors",
                    soundEnabled
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border-subtle bg-bg-subtle text-fg-muted hover:text-fg",
                  )}
                  title={soundEnabled ? "Mute 8-bit audio" : "Enable 8-bit audio"}
                  aria-label={soundEnabled ? "Mute 8-bit audio" : "Enable 8-bit audio"}
                  aria-pressed={soundEnabled}
                >
                  {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>

                <button
                  type="button"
                  onClick={() => setDockCollapsed(true)}
                  className="inline-flex size-7 items-center justify-center rounded-[var(--radius-control)] border border-border-subtle bg-bg-subtle text-fg-muted hover:text-fg transition-colors"
                  title="Collapse controls (H)"
                  aria-label="Collapse controls"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
