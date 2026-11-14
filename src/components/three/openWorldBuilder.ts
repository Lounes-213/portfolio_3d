"use client";

import * as THREE from "three";
import { profile } from "@/content/profile";
import { reels, type ReelProject } from "@/content/reels";
import { pick } from "@/content/schema";
import type { Locale } from "@/lib/i18n/routing";
import {
  ALL_LANGUAGE_BLOCK_TYPES,
  createBillboardTexture,
  createFlagTexture,
  createPortraitVoxelTexture,
  createVoxelTexture,
  type BlockTextureType,
  type FlagKind,
} from "./voxelTextures";
import { createPlayableVoxelCharacter } from "./voxelCharacter";

export type DistrictZoneId =
  | "spawn"
  | "projects"
  | "academy"
  | "skills"
  | "contact";

export interface DistrictZoneInfo {
  id: DistrictZoneId;
  name: string;
  subtitle: string;
  center: { x: number; z: number };
  spawnPoint: { x: number; z: number; yaw: number };
  color: string;
  bounds?: { minX: number; maxX: number; minZ: number; maxZ: number };
}

export interface WorldInteractiveNode {
  id: string;
  zone: DistrictZoneId;
  kind:
    | "project"
    | "bio"
    | "skill"
    | "contact"
    | "stat"
    | "computer"
    | "guide";
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  position: THREE.Vector3;
  reel?: ReelProject;
  actionHref?: string;
  actionLabel?: string;
  mesh: THREE.Object3D;
}

interface VoxelPlacement {
  x: number;
  y: number;
  z: number;
  type: BlockTextureType;
  houseShellZone?: DistrictZoneId;
}

interface WavingFlagItem {
  geometry: THREE.PlaneGeometry;
  basePositions: Float32Array;
  phaseOffset: number;
}

export interface BuiltOpenWorld {
  worldGroup: THREE.Group;
  blockMeshes: THREE.InstancedMesh[];
  interactiveNodes: WorldInteractiveNode[];
  collisionColumns: Set<string>;
  districts: DistrictZoneInfo[];
  updateHouseCutaways: (playerPos: THREE.Vector3) => DistrictZoneId | null;
  updateWorldAnimations: (elapsedTime: number) => void;
  dispose: () => void;
}

export const DISTRICTS: DistrictZoneInfo[] = [
  {
    id: "spawn",
    name: "SPAWN PLAZA · ALGIERS",
    subtitle: "Lounès Benseba · Live Computer · Smart Guide · Voxel Portrait",
    center: { x: 0, z: 0 },
    spawnPoint: { x: 0, z: 6, yaw: 0 },
    color: "#34D399",
  },
  {
    id: "projects",
    name: "PROJECTS PAVILION (9 APPS)",
    subtitle: "LStop · Aẓar Neɣ · Kamir Gym · Golden Goal · Volagro DZ",
    center: { x: -26, z: -20 },
    spawnPoint: { x: -26, z: -9, yaw: 0 },
    color: "#22D3EE",
    bounds: { minX: -37, maxX: -15, minZ: -29, maxZ: -11 },
  },
  {
    id: "academy",
    name: "USTHB UNIVERSITY HALL",
    subtitle: "MSc Bioinformatics · BSc Computer Science · Algiers",
    center: { x: 26, z: -20 },
    spawnPoint: { x: 26, z: -9, yaw: 0 },
    color: "#FBBF24",
    bounds: { minX: 15, maxX: 37, minZ: -29, maxZ: -11 },
  },
  {
    id: "skills",
    name: "TECH LOGOS HOUSE",
    subtitle: "Built from Flutter, Kotlin, Next.js, React, TS & Python Cubes",
    center: { x: -26, z: 20 },
    spawnPoint: { x: -26, z: 9, yaw: Math.PI },
    color: "#38BDF8",
    bounds: { minX: -37, maxX: -15, minZ: 11, maxZ: 29 },
  },
  {
    id: "contact",
    name: "CONTACT & PORTAL",
    subtitle: "Direct Email · Phone · GitHub · LinkedIn · CVs",
    center: { x: 26, z: 20 },
    spawnPoint: { x: 26, z: 9, yaw: Math.PI },
    color: "#A855F7",
    bounds: { minX: 15, maxX: 37, minZ: 11, maxZ: 29 },
  },
];

export function buildPortfolioOpenWorld(locale: Locale): BuiltOpenWorld {
  const worldGroup = new THREE.Group();
  const disposables: Array<{ dispose: () => void }> = [];
  const interactiveNodes: WorldInteractiveNode[] = [];
  const collisionColumns = new Set<string>();
  const voxels: VoxelPlacement[] = [];
  const wavingFlags: WavingFlagItem[] = [];

  const cvEnHref = "/cv-lounes-benseba-en.pdf";
  const cvFrHref = "/cv-lounes-benseba-fr.pdf";
  const phoneDisplay = "(+213) 82535427";
  const githubSocial =
    profile.socials.find((s) => s.id === "github")?.href ??
    "https://github.com/Lounes-213";
  const linkedinSocial =
    profile.socials.find((s) => s.id === "linkedin")?.href ??
    "https://www.linkedin.com/in/lounes-benseba-a07549393/";

  const addBlock = (
    x: number,
    y: number,
    z: number,
    type: BlockTextureType,
    solid = false,
    houseShellZone?: DistrictZoneId,
  ) => {
    voxels.push({
      x: Math.round(x),
      y: Math.round(y),
      z: Math.round(z),
      type,
      houseShellZone,
    });
    if (solid) {
      collisionColumns.add(`${Math.round(x)},${Math.round(z)}`);
    }
  };

  // ============================================================================
  // 1. OPEN-WORLD MINECRAFT TERRAIN & ROADS (-50 to +50)
  // ============================================================================
  const WORLD_RADIUS = 50;
  for (let x = -WORLD_RADIUS; x <= WORLD_RADIUS; x++) {
    for (let z = -WORLD_RADIUS; z <= WORLD_RADIUS; z++) {
      const distCenter = Math.hypot(x, z);
      let groundType: BlockTextureType = "grass";

      if (distCenter < 9.5) {
        groundType =
          distCenter < 3.0
            ? "emerald"
            : (Math.abs(x) + Math.abs(z)) % 2 === 0
              ? "stone"
              : "cobble";
      } else if (
        Math.abs(x) <= 2 ||
        Math.abs(z) <= 2 ||
        (Math.abs(z + 20) <= 2 && Math.abs(x) <= 32) ||
        (Math.abs(z - 20) <= 2 && Math.abs(x) <= 32) ||
        (Math.abs(x + 26) <= 2 && Math.abs(z) <= 24) ||
        (Math.abs(x - 26) <= 2 && Math.abs(z) <= 24)
      ) {
        groundType =
          x === 0 || z === 0 || Math.abs(x) === 26 || Math.abs(z) === 20
            ? "stone"
            : "cobble";
      } else if (Math.abs(x + 26) <= 10 && Math.abs(z + 20) <= 8) {
        // Projects Pavilion floor: Classic Minecraft Oak Planks
        groundType = (x + z) % 2 === 0 ? "plank" : "wood";
      } else if (Math.abs(x - 26) <= 10 && Math.abs(z + 20) <= 8) {
        // USTHB Hall floor: Classic Minecraft Stone & Planks
        groundType = (x + z) % 2 === 0 ? "stone" : "plank";
      } else if (Math.abs(x + 26) <= 10 && Math.abs(z - 20) <= 8) {
        // The 1 Language Cube House floor
        groundType = (x + z) % 2 === 0 ? "stone" : "cobble";
      } else if (Math.abs(x - 26) <= 10 && Math.abs(z - 20) <= 8) {
        // Contact Pavilion floor
        groundType = (x + z) % 2 === 0 ? "plank" : "cobble";
      }

      addBlock(x, 0, z, groundType, false);
    }
  }

  // ============================================================================
  // 2. OPEN-CONCEPT MINECRAFT BUILDINGS (3 Classic Minecraft + 1 Language Cube House)
  // ============================================================================
  const buildHouseStructure = (opts: {
    zone: DistrictZoneId;
    cx: number;
    cz: number;
    halfW: number;
    halfD: number;
    wallH: number;
    wallType: BlockTextureType;
    pillarType: BlockTextureType;
    roofType: BlockTextureType;
    doorSide: "south" | "north";
    useLanguageCubes?: boolean;
  }) => {
    const {
      zone,
      cx,
      cz,
      halfW,
      halfD,
      wallH,
      wallType,
      pillarType,
      roofType,
      doorSide,
      useLanguageCubes,
    } = opts;
    const minX = cx - halfW;
    const maxX = cx + halfW;
    const minZ = cz - halfD;
    const maxZ = cz + halfD;

    const pickLangCube = (x: number, y: number, z: number): BlockTextureType => {
      const idx =
        Math.abs(x * 3 + y * 7 + z * 5) % ALL_LANGUAGE_BLOCK_TYPES.length;
      return ALL_LANGUAGE_BLOCK_TYPES[idx] ?? "langFlutter";
    };

    for (let x = minX; x <= maxX; x++) {
      for (let z = minZ; z <= maxZ; z++) {
        const isEdgeX = x === minX || x === maxX;
        const isEdgeZ = z === minZ || z === maxZ;
        const isCorner = isEdgeX && isEdgeZ;

        // Wide 7-block open entrance so the building feels airy and welcoming
        const isDoorway =
          (doorSide === "south" && z === maxZ && Math.abs(x - cx) <= 3) ||
          (doorSide === "north" && z === minZ && Math.abs(x - cx) <= 3);

        if (isEdgeX || isEdgeZ) {
          for (let y = 1; y <= wallH; y++) {
            if (isDoorway && y <= 4) continue;

            let bType: BlockTextureType = wallType;
            if (useLanguageCubes) {
              bType = pickLangCube(x, y, z);
            } else if (isCorner) {
              bType = pillarType;
            } else if (
              y >= 2 &&
              y <= 4 &&
              ((isEdgeX && (z - cz) % 3 === 0) ||
                (isEdgeZ && (x - cx) % 3 === 0))
            ) {
              bType = "glass";
            }

            const shellTag = y >= 2 ? zone : undefined;
            addBlock(x, y, z, bType, y === 1, shellTag);
          }
        }

        const roofBType = useLanguageCubes
          ? pickLangCube(x, wallH + 1, z)
          : roofType;
        addBlock(x, wallH + 1, z, roofBType, false, zone);
        if (x > minX && x < maxX && z > minZ && z < maxZ) {
          const isRoofSkylight =
            Math.abs(x - cx) <= 3 && Math.abs(z - cz) <= 2;
          const topType = isRoofSkylight
            ? "glass"
            : useLanguageCubes
              ? pickLangCube(x, wallH + 2, z)
              : roofType;
          addBlock(x, wallH + 2, z, topType, false, zone);
        }
      }
    }

    addBlock(minX + 1, 1, minZ + 1, "glowstone", false);
    addBlock(maxX - 1, 1, minZ + 1, "glowstone", false);
    addBlock(minX + 1, 1, maxZ - 1, "glowstone", false);
    addBlock(maxX - 1, 1, maxZ - 1, "glowstone", false);
  };

  // House 1: Projects Pavilion — Classic Minecraft Oak Planks & Logs
  buildHouseStructure({
    zone: "projects",
    cx: -26,
    cz: -20,
    halfW: 10,
    halfD: 8,
    wallH: 5,
    wallType: "plank",
    pillarType: "wood",
    roofType: "wood",
    doorSide: "south",
  });

  // House 2: USTHB Hall — Classic Minecraft Red Brick, Bookshelves & Oak Roof
  buildHouseStructure({
    zone: "academy",
    cx: 26,
    cz: -20,
    halfW: 10,
    halfD: 8,
    wallH: 5,
    wallType: "brick",
    pillarType: "bookshelf",
    roofType: "plank",
    doorSide: "south",
  });

  // House 3: ONLY THIS ONE HOUSE is built from Programming Language Logo Cubes!
  buildHouseStructure({
    zone: "skills",
    cx: -26,
    cz: 20,
    halfW: 8,
    halfD: 6,
    wallH: 5,
    wallType: "langFlutter",
    pillarType: "langKotlin",
    roofType: "langNextjs",
    doorSide: "north",
    useLanguageCubes: true,
  });

  // House 4: Contact Pavilion — Classic Minecraft Cobblestone, Stone & Wood
  buildHouseStructure({
    zone: "contact",
    cx: 26,
    cz: 20,
    halfW: 10,
    halfD: 8,
    wallH: 5,
    wallType: "cobble",
    pillarType: "wood",
    roofType: "plank",
    doorSide: "north",
  });

  // ============================================================================
  // 2B. 3D WAVING FLAGS (Algerian Flag 🇩🇿, USTHB, LOUNÈS · 213 — NO Amazigh Flag)
  // ============================================================================
  const buildWavingFlagPole = (opts: {
    x: number;
    z: number;
    height: number;
    kind: FlagKind;
    phaseOffset: number;
  }) => {
    const group = new THREE.Group();
    group.position.set(opts.x, 0.5, opts.z);

    const baseGeo = new THREE.BoxGeometry(1.3, 0.7, 1.3);
    const baseMat = new THREE.MeshStandardMaterial({
      color: "#334155",
      roughness: 0.7,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.35;
    group.add(base);

    const poleGeo = new THREE.CylinderGeometry(0.09, 0.12, opts.height, 8);
    const poleMat = new THREE.MeshStandardMaterial({
      color: "#F8FAFC",
      metalness: 0.5,
      roughness: 0.3,
    });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.y = opts.height / 2 + 0.5;
    pole.castShadow = true;
    group.add(pole);

    const orbGeo = new THREE.BoxGeometry(0.36, 0.36, 0.36);
    const orbMat = new THREE.MeshStandardMaterial({
      color: "#FBBF24",
      emissive: "#F59E0B",
      emissiveIntensity: 0.4,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.y = opts.height + 0.65;
    group.add(orb);

    const flagTex = createFlagTexture(opts.kind);
    const flagGeo = new THREE.PlaneGeometry(3.2, 2.0, 16, 8);
    const posAttr = flagGeo.attributes.position as THREE.BufferAttribute;
    const basePositions = new Float32Array(posAttr.array.length);
    basePositions.set(posAttr.array);

    const flagMat = new THREE.MeshStandardMaterial({
      map: flagTex,
      side: THREE.DoubleSide,
      roughness: 0.5,
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(1.65, opts.height - 0.5, 0);
    flagMesh.castShadow = true;
    group.add(flagMesh);

    wavingFlags.push({
      geometry: flagGeo,
      basePositions,
      phaseOffset: opts.phaseOffset,
    });

    collisionColumns.add(`${Math.round(opts.x)},${Math.round(opts.z)}`);
    disposables.push(
      baseGeo,
      baseMat,
      poleGeo,
      poleMat,
      orbGeo,
      orbMat,
      flagTex,
      flagGeo,
      flagMat,
    );
    worldGroup.add(group);
  };

  buildWavingFlagPole({ x: -8, z: -7, height: 8.5, kind: "dz", phaseOffset: 0 });
  buildWavingFlagPole({ x: 8, z: -7, height: 8.5, kind: "dz", phaseOffset: 1.2 });
  buildWavingFlagPole({ x: 0, z: -11, height: 9.5, kind: "guild", phaseOffset: 2.2 });
  buildWavingFlagPole({ x: 14, z: -10, height: 8.0, kind: "usthb", phaseOffset: 0.8 });

  // ============================================================================
  // 2C. 3D VOXELIZED PORTRAIT MONUMENT OF LOUNÈS
  // ============================================================================
  const buildPortraitMonument = (
    x: number,
    y: number,
    z: number,
    rotY: number,
    scale = 1,
    zone: DistrictZoneId = "spawn",
  ) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotY;

    const frameW = 3.6 * scale;
    const frameH = 4.5 * scale;
    const frameGeo = new THREE.BoxGeometry(frameW + 0.35, frameH + 0.35, 0.36);
    const frameMat = new THREE.MeshStandardMaterial({
      color: "#F59E0B",
      roughness: 0.4,
      metalness: 0.3,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.y = frameH / 2 + 0.6;
    frameMesh.castShadow = true;
    group.add(frameMesh);

    const pedGeo = new THREE.BoxGeometry(frameW + 0.6, 0.6, 0.9);
    const pedMat = new THREE.MeshStandardMaterial({
      color: "#090D16",
      roughness: 0.7,
    });
    const pedMesh = new THREE.Mesh(pedGeo, pedMat);
    pedMesh.position.y = 0.3;
    group.add(pedMesh);

    const portraitTex = createPortraitVoxelTexture("/images/portrait.jpg");
    const faceGeo = new THREE.PlaneGeometry(frameW, frameH);
    const faceMat = new THREE.MeshBasicMaterial({ map: portraitTex });

    const frontFace = new THREE.Mesh(faceGeo, faceMat);
    frontFace.position.set(0, frameH / 2 + 0.6, 0.2);
    const backFace = new THREE.Mesh(faceGeo, faceMat);
    backFace.position.set(0, frameH / 2 + 0.6, -0.2);
    backFace.rotation.y = Math.PI;
    group.add(frontFace, backFace);

    frontFace.userData = { interactiveNodeId: `portrait-${zone}` };
    backFace.userData = { interactiveNodeId: `portrait-${zone}` };

    disposables.push(frameGeo, frameMat, pedGeo, pedMat, portraitTex, faceGeo, faceMat);
    worldGroup.add(group);

    interactiveNodes.push({
      id: `portrait-${zone}`,
      zone,
      kind: "bio",
      title: `${profile.name} — Voxel Portrait`,
      subtitle: pick(profile.role, locale),
      description: pick(profile.bio, locale).join("\n\n"),
      tags: ["Algiers, Algeria 🇩🇿", "USTHB MSc & BSc", "Mobile & Web Architect"],
      position: new THREE.Vector3(x, y, z),
      mesh: frontFace,
    });
  };

  buildPortraitMonument(-5.8, 0.5, -4.2, 0.28, 1.0, "spawn");

  // ============================================================================
  // 2D. 3D WORKING COMPUTER WORKSTATION ("zidli hasub yemchi b vrai internet")
  //     + INTERACTIVE GUIDE COMPANION ("yjawebni w ga3")
  // ============================================================================
  const buildComputerWorkstation = (
    id: string,
    zone: DistrictZoneId,
    x: number,
    z: number,
    rotY = 0,
  ) => {
    const group = new THREE.Group();
    group.position.set(x, 0.5, z);
    group.rotation.y = rotY;

    // Oak & Iron Desk
    const deskTopGeo = new THREE.BoxGeometry(2.6, 0.18, 1.4);
    const deskMat = new THREE.MeshStandardMaterial({ color: "#78512D", roughness: 0.7 });
    const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
    deskTop.position.set(0, 1.0, 0);
    deskTop.castShadow = true;
    group.add(deskTop);

    const legGeo = new THREE.BoxGeometry(0.2, 1.0, 1.2);
    const legMat = new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.6 });
    const leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-1.1, 0.5, 0);
    const rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(1.1, 0.5, 0);
    group.add(leftLeg, rightLeg);

    // Wide Glowing Monitor Frame
    const monGeo = new THREE.BoxGeometry(2.1, 1.35, 0.16);
    const monMat = new THREE.MeshStandardMaterial({ color: "#090D16", roughness: 0.4 });
    const monitor = new THREE.Mesh(monGeo, monMat);
    monitor.position.set(0, 1.85, -0.2);
    monitor.castShadow = true;
    group.add(monitor);

    // Monitor Screen Texture
    const screenTex = createBillboardTexture({
      badge: "LIVE WORKSTATION · WEB BROWSER",
      title: "LOUNÈS OS · INTERNET PC",
      subtitle: "Click or Press [E] to Browse Live Web & GitHub",
      lines: [
        "🌐 Live Web Search (Wikipedia & GitHub API)",
        "🚀 Inspect LStop, Aẓar Neɣ & All 9 Projects",
        "💻 Interactive Terminal & Code Explorer",
      ],
      accentColor: "#38BDF8",
      footer: "CLICK MONITOR OR PRESS [E] TO OPEN PC",
    });
    const screenGeo = new THREE.PlaneGeometry(1.94, 1.2);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.85, -0.11);
    group.add(screenMesh);

    // Keyboard
    const kbGeo = new THREE.BoxGeometry(1.1, 0.06, 0.4);
    const kbMat = new THREE.MeshStandardMaterial({
      color: "#334155",
      emissive: "#10B981",
      emissiveIntensity: 0.25,
    });
    const kb = new THREE.Mesh(kbGeo, kbMat);
    kb.position.set(0, 1.12, 0.3);
    group.add(kb);

    screenMesh.userData = { interactiveNodeId: id };
    monitor.userData = { interactiveNodeId: id };
    deskTop.userData = { interactiveNodeId: id };

    interactiveNodes.push({
      id,
      zone,
      kind: "computer",
      title: "Lounès Workstation PC (Live Internet)",
      subtitle: "Browse Live Web, Search Wikipedia/GitHub & Launch Apps",
      description:
        "Interactive Desktop Computer connected to the internet. Search live Wikipedia articles, browse Lounès's GitHub repositories, preview live project deployments, or ask the Guide.",
      tags: ["Live Web Browser", "GitHub Explorer", "Project Launcher"],
      position: new THREE.Vector3(x, 0.5, z),
      mesh: screenMesh,
    });

    disposables.push(
      deskTopGeo,
      deskMat,
      legGeo,
      legMat,
      monGeo,
      monMat,
      screenTex,
      screenGeo,
      screenMat,
      kbGeo,
      kbMat,
    );
    worldGroup.add(group);
  };

  // Place 3D Computer Workstation in Spawn Plaza & inside Tech House
  buildComputerWorkstation("pc-spawn", "spawn", 5.8, -3.8, -0.25);
  buildComputerWorkstation("pc-skills", "skills", -26, 23, Math.PI);

  // Interactive Guide Character standing next to the Spawn Computer
  const guideChar = createPlayableVoxelCharacter({
    name: "Murshid Lounès",
    flag: "💬",
    jacketColor: "#0284C7",
    trimColor: "#38BDF8",
  });
  guideChar.group.position.set(3.4, 0.5, -3.5);
  guideChar.group.rotation.y = -0.2;
  guideChar.body.userData = { interactiveNodeId: "smart-guide-npc" };
  guideChar.head.userData = { interactiveNodeId: "smart-guide-npc" };
  worldGroup.add(guideChar.group);
  disposables.push(guideChar);

  interactiveNodes.push({
    id: "smart-guide-npc",
    zone: "spawn",
    kind: "guide",
    title: "Murshid Lounès — Interactive Guide",
    subtitle: "Ask me anything in Darija, Arabic, French, or English!",
    description:
      "Salam! I am Lounès's interactive guide inside this 3D world. Ask me any question about his 9 projects (LStop, Aẓar Neɣ, Kamir Gym...), his USTHB Bioinformatics & CS studies, or his tech stack!",
    tags: ["Interactive Chat", "Darija / AR / FR / EN", "Portfolio Guide"],
    position: new THREE.Vector3(3.4, 0.5, -3.5),
    mesh: guideChar.body,
  });

  // ============================================================================
  // 3. MINECRAFT TREES, LANTERNS & WHITE VOXEL CLOUDS IN THE SKY
  // ============================================================================
  const buildTree = (tx: number, tz: number) => {
    for (let y = 1; y <= 3; y++) addBlock(tx, y, tz, "wood", y === 1);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        addBlock(tx + dx, 4, tz + dz, "grass", false);
        if (Math.abs(dx) + Math.abs(dz) <= 1) {
          addBlock(tx + dx, 5, tz + dz, "grass", false);
        }
      }
    }
  };

  const treeCoords: Array<[number, number]> = [
    [-44, -44],
    [-44, 0],
    [-44, 44],
    [44, -44],
    [44, 0],
    [44, 44],
    [0, -44],
    [0, 44],
    [-16, -42],
    [16, -42],
    [-16, 42],
    [16, 42],
    [-42, -16],
    [42, -16],
    [-42, 16],
    [42, 16],
  ];
  treeCoords.forEach(([tx, tz]) => buildTree(tx, tz));

  const lanternCoords: Array<[number, number]> = [
    [-4, -4],
    [4, -4],
    [-4, 4],
    [4, 4],
    [-14, -4],
    [14, -4],
    [-14, 4],
    [14, 4],
  ];
  lanternCoords.forEach(([lx, lz]) => {
    addBlock(lx, 1, lz, "cobble", true);
    addBlock(lx, 2, lz, "wood", false);
    addBlock(lx, 3, lz, "glowstone", false);
  });

  // White Voxel Clouds floating in the blue sky
  const cloudGroup = new THREE.Group();
  const cloudGeo = new THREE.BoxGeometry(6, 1.2, 4);
  const cloudMat = new THREE.MeshStandardMaterial({
    color: "#FFFFFF",
    roughness: 0.9,
    transparent: true,
    opacity: 0.88,
  });
  const cloudPositions: Array<[number, number, number]> = [
    [-28, 26, -25],
    [18, 28, -30],
    [-15, 27, 22],
    [30, 25, 18],
    [0, 29, -12],
    [-35, 26, 5],
    [35, 27, -5],
  ];
  cloudPositions.forEach(([cx, cy, cz]) => {
    const cMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cMesh.position.set(cx, cy, cz);
    cloudGroup.add(cMesh);
  });
  disposables.push(cloudGeo, cloudMat);
  worldGroup.add(cloudGroup);

  // ============================================================================
  // 4. HELPER TO CREATE 3D SIGNBOARDS / KIOSKS IN THE WORLD
  // ============================================================================
  const createSignboardMesh = (opts: {
    id: string;
    zone: DistrictZoneId;
    kind: WorldInteractiveNode["kind"];
    x: number;
    y: number;
    z: number;
    rotY?: number;
    boardW?: number;
    boardH?: number;
    badge: string;
    title: string;
    subtitle: string;
    lines: string[];
    description: string;
    tags: string[];
    accentColor: string;
    footer?: string;
    reel?: ReelProject;
    actionHref?: string;
    actionLabel?: string;
  }) => {
    const boardW = opts.boardW ?? 3.6;
    const boardH = opts.boardH ?? 2.4;
    const group = new THREE.Group();
    group.position.set(opts.x, opts.y, opts.z);
    if (opts.rotY) group.rotation.y = opts.rotY;

    const frameGeo = new THREE.BoxGeometry(boardW + 0.24, boardH + 0.24, 0.22);
    const frameMat = new THREE.MeshStandardMaterial({
      color: "#0F172A",
      roughness: 0.6,
      metalness: 0.2,
    });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = boardH / 2 + 0.9;
    frame.castShadow = true;
    group.add(frame);

    const postGeo = new THREE.BoxGeometry(0.22, 1.0, 0.22);
    const postMat = new THREE.MeshStandardMaterial({ color: "#5C4028", roughness: 0.8 });
    const leftPost = new THREE.Mesh(postGeo, postMat);
    leftPost.position.set(-boardW * 0.35, 0.5, 0);
    const rightPost = new THREE.Mesh(postGeo, postMat);
    rightPost.position.set(boardW * 0.35, 0.5, 0);
    group.add(leftPost, rightPost);

    const tex = createBillboardTexture({
      badge: opts.badge,
      title: opts.title,
      subtitle: opts.subtitle,
      lines: opts.lines,
      accentColor: opts.accentColor,
      footer: opts.footer ?? "CLICK OR PRESS [E] TO OPEN",
    });

    const screenGeo = new THREE.PlaneGeometry(boardW, boardH);
    const screenMat = new THREE.MeshBasicMaterial({ map: tex });
    const frontScreen = new THREE.Mesh(screenGeo, screenMat);
    frontScreen.position.set(0, boardH / 2 + 0.9, 0.13);

    const backScreen = new THREE.Mesh(screenGeo, screenMat);
    backScreen.position.set(0, boardH / 2 + 0.9, -0.13);
    backScreen.rotation.y = Math.PI;

    group.add(frontScreen, backScreen);

    const node: WorldInteractiveNode = {
      id: opts.id,
      zone: opts.zone,
      kind: opts.kind,
      title: opts.title,
      subtitle: opts.subtitle,
      description: opts.description,
      tags: opts.tags,
      position: new THREE.Vector3(opts.x, opts.y, opts.z),
      reel: opts.reel,
      actionHref: opts.actionHref,
      actionLabel: opts.actionLabel,
      mesh: frontScreen,
    };

    frontScreen.userData = { interactiveNodeId: opts.id };
    backScreen.userData = { interactiveNodeId: opts.id };
    frame.userData = { interactiveNodeId: opts.id };

    interactiveNodes.push(node);
    disposables.push(frameGeo, frameMat, postGeo, postMat, tex, screenGeo, screenMat);
    worldGroup.add(group);
  };

  // ============================================================================
  // 5. SPAWN PLAZA: MAIN BOARD & STATS
  // ============================================================================
  const availabilityNote = profile.availability.note
    ? pick(profile.availability.note, locale)
    : "Available for mobile and full-stack software projects.";

  createSignboardMesh({
    id: "spawn-hero",
    zone: "spawn",
    kind: "bio",
    x: 0,
    y: 0.5,
    z: -4.5,
    boardW: 5.0,
    boardH: 3.0,
    badge: "ALGIERS, ALGERIA 🇩🇿 · USTHB",
    title: profile.name,
    subtitle: pick(profile.role, locale),
    lines: [
      pick(profile.tagline, locale),
      `Location: ${pick(profile.location, locale)}`,
      `Status: ${availabilityNote}`,
      "Drag Mouse/Touch to Rotate Camera 360° · Scroll to Zoom",
    ],
    description: pick(profile.bio, locale).join("\n\n"),
    tags: ["Flutter", "Kotlin", "Next.js", "FastAPI", "Bioinformatics", "USTHB"],
    accentColor: "#34D399",
    actionHref: locale === "fr" ? cvFrHref : cvEnHref,
    actionLabel: "Download Official CV (PDF)",
  });

  // ============================================================================
  // 6. PROJECTS PAVILION: ALL 9 REAL PROJECTS FROM THE APP
  // ============================================================================
  reels.forEach((reel, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const kx = -32.5 + col * 6.5;
    const kz = -25.2 + row * 4.6;

    addBlock(Math.round(kx), 1, Math.round(kz), "wood", false);

    const descText = pick(reel.description, locale);
    const externalHref = reel.linkedinUrl ?? reel.instagramUrl;

    createSignboardMesh({
      id: `project-${reel.id}`,
      zone: "projects",
      kind: "project",
      x: kx,
      y: 0.5,
      z: kz,
      boardW: 3.1,
      boardH: 2.1,
      badge: `PROJECT #0${idx + 1} · ${pick(reel.category, locale)}`,
      title: pick(reel.title, locale),
      subtitle: reel.languages.join(" · "),
      lines: [
        descText.slice(0, 50),
        descText.slice(50, 100),
        `Stack: ${reel.languages.join(", ")}`,
        "▶ Click or Press [E] to Watch Video Demo",
      ],
      description: descText,
      tags: [...reel.languages, ...reel.tags],
      accentColor: "#22D3EE",
      footer: "CLICK OR PRESS [E] TO WATCH VIDEO DEMO",
      reel,
      actionHref: externalHref,
      actionLabel: externalHref ? "Open Post / Demo" : undefined,
    });
  });

  // ============================================================================
  // 7. USTHB UNIVERSITY HALL: DEGREES & BIO
  // ============================================================================
  createSignboardMesh({
    id: "academy-msc",
    zone: "academy",
    kind: "bio",
    x: 21,
    y: 0.5,
    z: -22.5,
    rotY: 0.15,
    boardW: 3.6,
    boardH: 2.3,
    badge: "DEGREE #01 · USTHB ALGIERS",
    title: "MSc Bioinformatics",
    subtitle: "University of Science & Technology Houari Boumediene",
    lines: [
      "Master's in Bioinformatics (USTHB, Algiers)",
      "Genomic pipelines, Python & R data analytics",
      "High-throughput biological data computation",
    ],
    description:
      "Master's in Bioinformatics at the University of Science and Technology Houari Boumediene (USTHB), Algiers — focusing on computational biology and data pipelines.",
    tags: ["USTHB", "Bioinformatics", "Python", "Master's"],
    accentColor: "#FBBF24",
  });

  createSignboardMesh({
    id: "academy-bsc",
    zone: "academy",
    kind: "bio",
    x: 31,
    y: 0.5,
    z: -22.5,
    rotY: -0.15,
    boardW: 3.6,
    boardH: 2.3,
    badge: "DEGREE #02 · USTHB ALGIERS",
    title: "BSc Computer Science",
    subtitle: "University of Science & Technology Houari Boumediene",
    lines: [
      "Bachelor's (Licence) in Computer Science (Graduated)",
      "Algorithms, Distributed Systems & Software Eng.",
      "Relational Databases, OS & Mobile Architecture",
    ],
    description:
      "Bachelor's Degree (Licence) in Computer Science from USTHB University, Algiers — covering algorithms, software architecture, databases, and mobile/web engineering.",
    tags: ["USTHB", "Computer Science", "Algorithms", "Software Engineering"],
    accentColor: "#F59E0B",
  });

  // ============================================================================
  // 8. TECH LOGOS HOUSE: SIMPLE, CLEAN & FOCUSED (No verbose text walls!)
  // ============================================================================
  createSignboardMesh({
    id: "skills-overview",
    zone: "skills",
    kind: "skill",
    x: -26,
    y: 0.5,
    z: 18,
    rotY: Math.PI,
    boardW: 4.0,
    boardH: 2.3,
    badge: "TECH STACK · LANGUAGE CUBES HOUSE",
    title: "Mobile, Web & Cloud Stack",
    subtitle: "Flutter · Kotlin · Next.js · React · TS · Python · FastAPI",
    lines: [
      "Mobile: Flutter, Dart, Kotlin, Android Native",
      "Web: Next.js, React, TypeScript, Tailwind CSS",
      "Backend & DB: Python, FastAPI, PostgreSQL, Supabase, Cloudflare",
    ],
    description:
      "This room is constructed directly from 3D cubes bearing the logos of Lounès Benseba's core programming languages and platforms.",
    tags: [
      "Flutter",
      "Kotlin",
      "Next.js",
      "React",
      "TypeScript",
      "Python",
      "FastAPI",
      "PostgreSQL",
    ],
    accentColor: "#38BDF8",
  });

  // ============================================================================
  // 9. CONTACT PAVILION & NETHER PORTAL
  // ============================================================================
  for (let py = 1; py <= 5; py++) {
    for (let px = 24; px <= 28; px++) {
      const isFrame = py === 1 || py === 5 || px === 24 || px === 28;
      addBlock(px, py, 25, isFrame ? "obsidian" : "portal", py === 1);
    }
  }

  createSignboardMesh({
    id: "contact-email",
    zone: "contact",
    kind: "contact",
    x: 21,
    y: 0.5,
    z: 18,
    rotY: Math.PI,
    boardW: 3.5,
    boardH: 2.3,
    badge: "DIRECT CONTACT",
    title: profile.email,
    subtitle: `Phone: ${phoneDisplay}`,
    lines: [
      `Email: ${profile.email}`,
      `Phone: ${phoneDisplay}`,
      `Location: ${pick(profile.location, locale)}`,
    ],
    description: `Reach Lounès directly via email at ${profile.email} or phone at ${phoneDisplay}.`,
    tags: [profile.email, phoneDisplay, "Algiers, Algeria"],
    accentColor: "#A855F7",
    actionHref: `mailto:${profile.email}`,
    actionLabel: "Send Email Now",
  });

  createSignboardMesh({
    id: "contact-socials",
    zone: "contact",
    kind: "contact",
    x: 31,
    y: 0.5,
    z: 18,
    rotY: Math.PI,
    boardW: 3.5,
    boardH: 2.3,
    badge: "GITHUB · LINKEDIN · CVS",
    title: "GitHub · LinkedIn · CVs",
    subtitle: "@Lounes-213 · @lounes-benseba",
    lines: [
      `GitHub: ${githubSocial}`,
      `LinkedIn: ${linkedinSocial}`,
      `English CV: ${cvEnHref}`,
      `French CV: ${cvFrHref}`,
    ],
    description: `Connect with Lounès on GitHub (${githubSocial}) and LinkedIn (${linkedinSocial}), or download his full CV in English or French.`,
    tags: ["GitHub", "LinkedIn", "CV English", "CV Français"],
    accentColor: "#34D399",
    actionHref: githubSocial,
    actionLabel: "Open GitHub Profile",
  });

  // ============================================================================
  // 10. BUILD INSTANCED MESHES BY BLOCK TYPE & PER-HOUSE CUTAWAY SHELLS
  // ============================================================================
  const blockGeo = new THREE.BoxGeometry(1, 1, 1);
  disposables.push(blockGeo);

  const staticBuckets = new Map<BlockTextureType, VoxelPlacement[]>();
  const houseShellBuckets = new Map<
    DistrictZoneId,
    Map<BlockTextureType, VoxelPlacement[]>
  >();

  for (const v of voxels) {
    if (v.houseShellZone) {
      let zoneMap = houseShellBuckets.get(v.houseShellZone);
      if (!zoneMap) {
        zoneMap = new Map();
        houseShellBuckets.set(v.houseShellZone, zoneMap);
      }
      const arr = zoneMap.get(v.type) ?? [];
      arr.push(v);
      zoneMap.set(v.type, arr);
    } else {
      const arr = staticBuckets.get(v.type) ?? [];
      arr.push(v);
      staticBuckets.set(v.type, arr);
    }
  }

  const blockMeshes: THREE.InstancedMesh[] = [];
  const dummy = new THREE.Object3D();

  staticBuckets.forEach((list, type) => {
    const tex = createVoxelTexture(type);
    const isTrans = type === "glass" || type === "portal" || type === "water";
    const isEmissive =
      type === "glowstone" || type === "portal" || type === "emerald";

    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: isTrans ? 0.2 : 0.8,
      metalness: type === "gold" || type === "diamond" ? 0.35 : 0.05,
      transparent: isTrans,
      opacity: type === "glass" ? 0.45 : type === "portal" ? 0.78 : 1,
      emissive: isEmissive
        ? new THREE.Color(
            type === "portal"
              ? "#7C3AED"
              : type === "glowstone"
                ? "#F59E0B"
                : "#059669",
          )
        : new THREE.Color("#000000"),
      emissiveIntensity:
        type === "glowstone" ? 0.6 : type === "portal" ? 0.8 : 0.12,
    });

    const inst = new THREE.InstancedMesh(blockGeo, mat, list.length);
    inst.receiveShadow = true;
    inst.castShadow = true;

    list.forEach((item, idx) => {
      dummy.position.set(item.x, item.y, item.z);
      dummy.updateMatrix();
      inst.setMatrixAt(idx, dummy.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;

    disposables.push(tex, mat, inst);
    worldGroup.add(inst);
    blockMeshes.push(inst);
  });

  const houseShellMaterials = new Map<DistrictZoneId, THREE.MeshStandardMaterial[]>();
  houseShellBuckets.forEach((zoneMap, zoneId) => {
    const mats: THREE.MeshStandardMaterial[] = [];
    zoneMap.forEach((list, type) => {
      const tex = createVoxelTexture(type);
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.75,
        transparent: true,
        opacity: 1,
      });
      const inst = new THREE.InstancedMesh(blockGeo, mat, list.length);
      inst.castShadow = true;
      list.forEach((item, idx) => {
        dummy.position.set(item.x, item.y, item.z);
        dummy.updateMatrix();
        inst.setMatrixAt(idx, dummy.matrix);
      });
      inst.instanceMatrix.needsUpdate = true;

      mats.push(mat);
      disposables.push(tex, mat, inst);
      worldGroup.add(inst);
    });
    houseShellMaterials.set(zoneId, mats);
  });

  const updateHouseCutaways = (playerPos: THREE.Vector3): DistrictZoneId | null => {
    let currentZone: DistrictZoneId | null = null;
    if (Math.hypot(playerPos.x, playerPos.z) < 12) {
      currentZone = "spawn";
    }

    for (const d of DISTRICTS) {
      if (!d.bounds) continue;
      const insideOrNear =
        playerPos.x >= d.bounds.minX - 2.5 &&
        playerPos.x <= d.bounds.maxX + 2.5 &&
        playerPos.z >= d.bounds.minZ - 2.5 &&
        playerPos.z <= d.bounds.maxZ + 2.5;

      if (insideOrNear) currentZone = d.id;

      const mats = houseShellMaterials.get(d.id);
      if (mats) {
        const targetOpacity = insideOrNear ? 0.06 : 1.0;
        for (const m of mats) {
          m.opacity += (targetOpacity - m.opacity) * 0.18;
          m.depthWrite = m.opacity > 0.5;
        }
      }
    }

    return currentZone;
  };

  const updateWorldAnimations = (elapsedTime: number) => {
    for (const flag of wavingFlags) {
      const posAttr = flag.geometry.attributes.position as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const base = flag.basePositions;
      for (let i = 0; i < arr.length; i += 3) {
        const bx = base[i] ?? 0;
        const by = base[i + 1] ?? 0;
        const pinFactor = Math.max(0, (bx + 1.6) / 3.2);
        const wave =
          Math.sin(bx * 2.2 - elapsedTime * 4.2 + flag.phaseOffset) * 0.22 +
          Math.cos(by * 1.8 - elapsedTime * 3.1) * 0.06;
        arr[i + 2] = wave * pinFactor;
      }
      posAttr.needsUpdate = true;
    }

    // Animate Guide Companion subtle idle wave
    guideChar.animate(false, elapsedTime);
    guideChar.rightArm.rotation.z = -0.35 - Math.sin(elapsedTime * 3.5) * 0.18;
  };

  const dispose = () => {
    disposables.forEach((d) => d.dispose());
  };

  return {
    worldGroup,
    blockMeshes,
    interactiveNodes,
    collisionColumns,
    districts: DISTRICTS,
    updateHouseCutaways,
    updateWorldAnimations,
    dispose,
  };
}
