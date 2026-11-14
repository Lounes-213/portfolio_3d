"use client";

import * as THREE from "three";

export type BlockTextureType =
  | "grass"
  | "dirt"
  | "stone"
  | "cobble"
  | "obsidian"
  | "emerald"
  | "gold"
  | "diamond"
  | "wood"
  | "plank"
  | "glass"
  | "glowstone"
  | "bookshelf"
  | "brick"
  | "water"
  | "portal"
  | "langFlutter"
  | "langKotlin"
  | "langNextjs"
  | "langReact"
  | "langTypeScript"
  | "langPython"
  | "langFastAPI"
  | "langCloudflare"
  | "langSupabase"
  | "langPostgres";

export type FlagKind = "dz" | "usthb" | "guild";

interface PaletteDef {
  base: string;
  alt1: string;
  alt2: string;
  border?: string;
}

const PALETTES: Record<string, PaletteDef> = {
  grass: { base: "#2F9E44", alt1: "#37B24D", alt2: "#2B8A3E", border: "#237032" },
  dirt: { base: "#6D4C2F", alt1: "#7E5837", alt2: "#543A22" },
  stone: { base: "#64748B", alt1: "#94A3B8", alt2: "#475569", border: "#334155" },
  cobble: { base: "#475569", alt1: "#64748B", alt2: "#334155", border: "#1E293B" },
  obsidian: { base: "#1E1B2E", alt1: "#2E294E", alt2: "#110E1B", border: "#4C1D95" },
  emerald: { base: "#10B981", alt1: "#34D399", alt2: "#059669", border: "#6EE7B7" },
  gold: { base: "#F59E0B", alt1: "#FBBF24", alt2: "#D97706", border: "#FDE68A" },
  diamond: { base: "#06B6D4", alt1: "#22D3EE", alt2: "#0891B2", border: "#A5F3FC" },
  wood: { base: "#78512D", alt1: "#8C6239", alt2: "#5C3D20", border: "#452D16" },
  plank: { base: "#A47545", alt1: "#B88652", alt2: "#8C6239", border: "#6E4B28" },
  glass: { base: "#7DD3FC", alt1: "#BAE6FD", alt2: "#38BDF8", border: "#F0F9FF" },
  glowstone: { base: "#FBBF24", alt1: "#FEF08A", alt2: "#D97706", border: "#FFFBEB" },
  bookshelf: { base: "#8C6239", alt1: "#10B981", alt2: "#EF4444", border: "#593D20" },
  brick: { base: "#991B1B", alt1: "#B91C1C", alt2: "#7F1D1D", border: "#CBD5E1" },
  water: { base: "#0284C7", alt1: "#0369A1", alt2: "#38BDF8" },
  portal: { base: "#7C3AED", alt1: "#A855F7", alt2: "#4C1D95", border: "#DDD6FE" },
};

export interface LangCubeSpec {
  type: BlockTextureType;
  label: string;
  bg: string;
  bgAlt: string;
  border: string;
}

export const LANGUAGE_CUBE_SPECS: Record<string, LangCubeSpec> = {
  langFlutter: {
    type: "langFlutter",
    label: "FLUTTER",
    bg: "#071E3D",
    bgAlt: "#0A274E",
    border: "#38BDF8",
  },
  langKotlin: {
    type: "langKotlin",
    label: "KOTLIN",
    bg: "#1B1035",
    bgAlt: "#251647",
    border: "#A855F7",
  },
  langNextjs: {
    type: "langNextjs",
    label: "NEXT.JS",
    bg: "#0B0F17",
    bgAlt: "#111827",
    border: "#F8FAFC",
  },
  langReact: {
    type: "langReact",
    label: "REACT",
    bg: "#08263A",
    bgAlt: "#0C334E",
    border: "#22D3EE",
  },
  langTypeScript: {
    type: "langTypeScript",
    label: "TYPESCRIPT",
    bg: "#112858",
    bgAlt: "#173472",
    border: "#60A5FA",
  },
  langPython: {
    type: "langPython",
    label: "PYTHON",
    bg: "#162032",
    bgAlt: "#1E293B",
    border: "#FACC15",
  },
  langFastAPI: {
    type: "langFastAPI",
    label: "FASTAPI",
    bg: "#042F2E",
    bgAlt: "#064E3B",
    border: "#14B8A6",
  },
  langCloudflare: {
    type: "langCloudflare",
    label: "CLOUDFLARE",
    bg: "#3B1506",
    bgAlt: "#521D09",
    border: "#FB923C",
  },
  langSupabase: {
    type: "langSupabase",
    label: "SUPABASE",
    bg: "#052E16",
    bgAlt: "#064E3B",
    border: "#34D399",
  },
  langPostgres: {
    type: "langPostgres",
    label: "POSTGRES",
    bg: "#152C4E",
    bgAlt: "#1D3B68",
    border: "#60A5FA",
  },
};

export const ALL_LANGUAGE_BLOCK_TYPES: BlockTextureType[] = [
  "langFlutter",
  "langKotlin",
  "langNextjs",
  "langReact",
  "langTypeScript",
  "langPython",
  "langFastAPI",
  "langCloudflare",
  "langSupabase",
  "langPostgres",
];

function drawLanguageLogo(ctx: CanvasRenderingContext2D, type: BlockTextureType) {
  ctx.save();
  if (type === "langFlutter") {
    // Official Flutter chevron wings logo
    ctx.fillStyle = "#54C5F8";
    ctx.beginPath();
    ctx.moveTo(68, 18);
    ctx.lineTo(36, 50);
    ctx.lineTo(48, 62);
    ctx.lineTo(92, 18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#29B6F6";
    ctx.beginPath();
    ctx.moveTo(68, 46);
    ctx.lineTo(48, 66);
    ctx.lineTo(68, 86);
    ctx.lineTo(92, 86);
    ctx.lineTo(72, 66);
    ctx.lineTo(92, 46);
    ctx.closePath();
    ctx.fill();
  } else if (type === "langKotlin") {
    // Official Kotlin geometric K square/triangles
    ctx.fillStyle = "#38BDF8";
    ctx.beginPath();
    ctx.moveTo(36, 20);
    ctx.lineTo(68, 20);
    ctx.lineTo(36, 52);
    ctx.closePath();
    ctx.fill();

    const grad = ctx.createLinearGradient(36, 84, 92, 20);
    grad.addColorStop(0, "#F97316");
    grad.addColorStop(1, "#A855F7");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(68, 20);
    ctx.lineTo(92, 20);
    ctx.lineTo(36, 76);
    ctx.lineTo(36, 52);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#A855F7";
    ctx.beginPath();
    ctx.moveTo(64, 52);
    ctx.lineTo(92, 80);
    ctx.lineTo(36, 80);
    ctx.closePath();
    ctx.fill();
  } else if (type === "langNextjs") {
    // Official Next.js circle + N slash
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(64, 51, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(50, 68);
    ctx.lineTo(50, 35);
    ctx.lineTo(82, 76);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(76, 35);
    ctx.lineTo(76, 58);
    ctx.stroke();
  } else if (type === "langReact") {
    // Official React atomic orbits + nucleus
    ctx.strokeStyle = "#00D8FF";
    ctx.lineWidth = 3.5;
    for (const angle of [0, Math.PI / 3, (Math.PI * 2) / 3]) {
      ctx.save();
      ctx.translate(64, 51);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, 32, 12, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.fillStyle = "#00D8FF";
    ctx.beginPath();
    ctx.arc(64, 51, 6.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "langTypeScript") {
    // Official TypeScript blue square with white TS at bottom-right
    ctx.fillStyle = "#3178C6";
    ctx.fillRect(32, 19, 64, 64);
    ctx.strokeStyle = "#93C5FD";
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 19, 64, 64);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 32px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText("TS", 91, 79);
  } else if (type === "langPython") {
    // Python interlocking blue & yellow dual emblem
    ctx.fillStyle = "#387EB8";
    ctx.fillRect(46, 20, 30, 16);
    ctx.fillRect(34, 34, 30, 18);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(52, 24, 4, 4);

    ctx.fillStyle = "#FFE052";
    ctx.fillRect(64, 48, 30, 18);
    ctx.fillRect(52, 64, 30, 16);
    ctx.fillStyle = "#1E293B";
    ctx.fillRect(72, 72, 4, 4);
  } else if (type === "langFastAPI") {
    // FastAPI teal circle + white lightning bolt
    ctx.fillStyle = "#05998B";
    ctx.beginPath();
    ctx.arc(64, 51, 31, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.moveTo(68, 25);
    ctx.lineTo(48, 53);
    ctx.lineTo(63, 53);
    ctx.lineTo(58, 77);
    ctx.lineTo(80, 48);
    ctx.lineTo(65, 48);
    ctx.closePath();
    ctx.fill();
  } else if (type === "langCloudflare") {
    // Cloudflare orange cloud
    ctx.fillStyle = "#F6821F";
    ctx.beginPath();
    ctx.arc(54, 56, 16, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(66, 44, 18, Math.PI, Math.PI * 1.85);
    ctx.arc(82, 56, 14, Math.PI * 1.3, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
  } else if (type === "langSupabase") {
    // Supabase emerald twin lightning bolt
    ctx.fillStyle = "#3ECF8E";
    ctx.beginPath();
    ctx.moveTo(68, 20);
    ctx.lineTo(40, 56);
    ctx.lineTo(64, 56);
    ctx.lineTo(58, 82);
    ctx.lineTo(88, 46);
    ctx.lineTo(64, 46);
    ctx.closePath();
    ctx.fill();
  } else if (type === "langPostgres") {
    // PostgreSQL blue shield + P crest
    ctx.fillStyle = "#336791";
    ctx.beginPath();
    ctx.arc(64, 50, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#93C5FD";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 28px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SQL", 64, 52);
  }
  ctx.restore();
}

function createLanguageBlockTexture(spec: LangCubeSpec): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? spec.bg : spec.bgAlt;
      ctx.fillRect(x * 16, y * 16, 16, 16);
    }
  }

  ctx.strokeStyle = spec.border;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 122, 122);

  // Draw the authentic language logo in the center
  drawLanguageLogo(ctx, spec.type);

  // Clean bottom label
  ctx.fillStyle = "rgba(9, 13, 22, 0.88)";
  ctx.fillRect(10, 92, 108, 24);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 13px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(spec.label, 64, 104);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createVoxelTexture(type: BlockTextureType, seed = 42): THREE.CanvasTexture {
  const langSpec = LANGUAGE_CUBE_SPECS[type];
  if (langSpec) {
    return createLanguageBlockTexture(langSpec);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const p = PALETTES[type] ?? PALETTES.stone!;

  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const r = rand();
      let color = p.base;
      if (r > 0.68) color = p.alt1;
      else if (r < 0.25) color = p.alt2;

      if (type === "bookshelf" && y >= 2 && y <= 5 && x >= 1 && x <= 6) {
        color = x % 2 === 0 ? p.alt1 : p.alt2;
      }

      if (type === "brick") {
        const isMortar = y % 2 === 0 || (x + (y % 4 === 1 ? 2 : 0)) % 4 === 0;
        if (isMortar && p.border) color = p.border;
      }

      if (type === "plank" && y % 2 === 0 && x === 0 && p.border) {
        color = p.border;
      }

      if (p.border && (x === 0 || y === 0 || x === 7 || y === 7)) {
        if (
          type === "emerald" ||
          type === "gold" ||
          type === "diamond" ||
          type === "glass" ||
          type === "obsidian"
        ) {
          color = p.border;
        }
      }

      ctx.fillStyle = color;
      ctx.fillRect(x * 8, y * 8, 8, 8);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Creates a crisp 3D Flag texture for waving cloth meshes:
 * - "dz": Algerian National Flag (Green & White + Red Crescent & Star)
 * - "usthb": USTHB University Banner
 * - "guild": LOUNÈS · 213 Engineering Banner
 */
export function createFlagTexture(kind: FlagKind): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext("2d")!;

  if (kind === "dz") {
    ctx.fillStyle = "#006233";
    ctx.fillRect(0, 0, 128, 160);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(128, 0, 128, 160);

    ctx.fillStyle = "#D21034";
    ctx.beginPath();
    ctx.arc(128, 80, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(139, 80, 33, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = "#006233";
    ctx.fillRect(0, 0, 128, 160);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(128, 0, 128, 160);
    ctx.restore();

    ctx.fillStyle = "#D21034";
    ctx.beginPath();
    const cx = 144;
    const cy = 80;
    const spikes = 5;
    const outerR = 18;
    const innerR = 7.5;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  } else if (kind === "usthb") {
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, 256, 160);
    ctx.strokeStyle = "#FBBF24";
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, 244, 148);
    ctx.fillStyle = "#FBBF24";
    ctx.font = "900 36px monospace";
    ctx.textAlign = "center";
    ctx.fillText("USTHB", 128, 68);
    ctx.fillStyle = "#34D399";
    ctx.font = "bold 18px monospace";
    ctx.fillText("BIOINFO & CS · ALGIERS", 128, 108);
  } else {
    ctx.fillStyle = "#064E3B";
    ctx.fillRect(0, 0, 256, 160);
    ctx.strokeStyle = "#34D399";
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, 244, 148);
    ctx.fillStyle = "#34D399";
    ctx.font = "900 34px monospace";
    ctx.textAlign = "center";
    ctx.fillText("LOUNÈS · 213", 128, 68);
    ctx.fillStyle = "#FDE68A";
    ctx.font = "bold 18px monospace";
    ctx.fillText("MOBILE & WEB ARCHITECT", 128, 108);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createPortraitVoxelTexture(imageUrl = "/images/portrait.jpg"): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext("2d")!;

  const drawFrameAndPlaceholder = (img?: HTMLImageElement) => {
    ctx.fillStyle = "#090D16";
    ctx.fillRect(0, 0, 256, 320);

    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, 244, 308);

    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, 224, 240);

    if (img && img.complete && img.naturalWidth > 0) {
      const off = document.createElement("canvas");
      const gridW = 56;
      const gridH = 60;
      off.width = gridW;
      off.height = gridH;
      const octx = off.getContext("2d")!;

      const scale = Math.max(gridW / img.naturalWidth, gridH / img.naturalHeight);
      const sw = gridW / scale;
      const sh = gridH / scale;
      const sx = (img.naturalWidth - sw) / 2;
      const sy = (img.naturalHeight - sh) * 0.25;
      octx.drawImage(img, sx, sy, sw, sh, 0, 0, gridW, gridH);

      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, gridW, gridH, 20, 20, 216, 232);
      ctx.restore();
    } else {
      ctx.fillStyle = "#111827";
      ctx.fillRect(20, 20, 216, 232);
      ctx.fillStyle = "#18181B";
      ctx.fillRect(68, 46, 120, 36);
      ctx.fillStyle = "#E5B89B";
      ctx.fillRect(76, 82, 104, 88);
      ctx.fillStyle = "#090D16";
      ctx.fillRect(96, 108, 16, 14);
      ctx.fillRect(144, 108, 16, 14);
      ctx.fillStyle = "#27272A";
      ctx.fillRect(96, 144, 64, 14);
      ctx.fillStyle = "#10B981";
      ctx.fillRect(56, 170, 144, 82);
    }

    ctx.fillStyle = "#0F172A";
    ctx.fillRect(16, 262, 224, 42);
    ctx.fillStyle = "#34D399";
    ctx.font = "900 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText("LOUNÈS BENSEBA 🇩🇿", 128, 282);
    ctx.fillStyle = "#E2E8F0";
    ctx.font = "bold 12px monospace";
    ctx.fillText("SOFTWARE ENGINEER · ALGIERS", 128, 298);
  };

  drawFrameAndPlaceholder();

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;

  if (typeof window !== "undefined") {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      drawFrameAndPlaceholder(img);
      tex.needsUpdate = true;
    };
    img.src = imageUrl;
  }

  return tex;
}

export interface BillboardOptions {
  badge: string;
  title: string;
  subtitle?: string;
  lines: string[];
  accentColor?: string;
  footer?: string;
  width?: number;
  height?: number;
}

export function createBillboardTexture(opts: BillboardOptions): THREE.CanvasTexture {
  const width = opts.width ?? 640;
  const height = opts.height ?? 420;
  const accent = opts.accentColor ?? "#34D399";

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#090D16";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, 628, height - 12);

  ctx.strokeStyle = "#1E293B";
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  ctx.fillStyle = accent;
  ctx.fillRect(28, 28, Math.min(width - 56, Math.max(180, opts.badge.length * 14 + 28)), 34);
  ctx.fillStyle = "#04130D";
  ctx.font = "900 18px monospace";
  ctx.fillText(opts.badge.toUpperCase(), 40, 51);

  ctx.fillStyle = "#F8FAFC";
  ctx.font = "900 30px monospace";
  ctx.fillText(opts.title.slice(0, 34), 28, 102);

  let yCursor = 136;
  if (opts.subtitle) {
    ctx.fillStyle = accent;
    ctx.font = "bold 19px monospace";
    ctx.fillText(opts.subtitle.slice(0, 48), 28, yCursor);
    yCursor += 34;
  }

  ctx.fillStyle = "#334155";
  ctx.fillRect(28, yCursor - 14, width - 56, 3);
  yCursor += 14;

  ctx.font = "600 18px monospace";
  for (const line of opts.lines.slice(0, 6)) {
    ctx.fillStyle = accent;
    ctx.fillRect(28, yCursor - 13, 8, 8);
    ctx.fillStyle = "#E2E8F0";
    ctx.fillText(line.slice(0, 52), 46, yCursor);
    yCursor += 32;
  }

  if (opts.footer) {
    ctx.fillStyle = "#111827";
    ctx.fillRect(20, height - 56, width - 40, 36);
    ctx.fillStyle = "#FBBF24";
    ctx.font = "bold 16px monospace";
    ctx.fillText(opts.footer.slice(0, 56), 32, height - 32);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createVoxelTextures(maxAnisotropy = 1) {
  const grassTop = createVoxelTexture("grass", 11);
  const grassSide = createVoxelTexture("grass", 22);
  const dirt = createVoxelTexture("dirt", 33);
  const stone = createVoxelTexture("stone", 44);
  const obsidian = createVoxelTexture("obsidian", 55);
  const diamondOre = createVoxelTexture("diamond", 66);
  const emeraldOre = createVoxelTexture("emerald", 77);
  const goldBlock = createVoxelTexture("gold", 88);
  const oakLog = createVoxelTexture("wood", 99);
  const oakLeaves = createVoxelTexture("emerald", 101);
  const water = createVoxelTexture("water", 112);

  const list = [
    grassTop,
    grassSide,
    dirt,
    stone,
    obsidian,
    diamondOre,
    emeraldOre,
    goldBlock,
    oakLog,
    oakLeaves,
    water,
  ];
  list.forEach((t) => {
    t.anisotropy = maxAnisotropy;
  });

  return {
    grassTop,
    grassSide,
    dirt,
    stone,
    obsidian,
    diamondOre,
    emeraldOre,
    goldBlock,
    oakLog,
    oakLeaves,
    water,
    dispose: () => list.forEach((t) => t.dispose()),
  };
}
