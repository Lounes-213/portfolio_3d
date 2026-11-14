"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  Copy,
  Check,
  ExternalLink,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Sparkles,
  Hammer,
  Pickaxe,
  MapPin,
  X,
  Play,
  Download,
  Eye,
  EyeOff,
  Users,
  Zap,
  RotateCcw,
  RotateCw,
  Monitor,
  MessageCircle,
  Globe,
  Search,
  Send,
  LogIn,
  Box,
  Layers,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { profile } from "@/content/profile";
import { reels } from "@/content/reels";
import { pick } from "@/content/schema";
import type { Locale } from "@/lib/i18n/routing";
import type { OnlinePlayerState, PlacedWorldBlock } from "@/app/api/world/route";
import type { BrowserSearchResult } from "@/app/api/browser/route";
import {
  testFirestoreConnection,
  subscribeToAuth,
  subscribeToWorldPlayers,
  subscribeToWorldBlocks,
  publishPlayerStateToFirebase,
  placeWorldBlockInFirebase,
  removeWorldBlockFromFirebase,
  signInWithGooglePopup,
  type FirebasePlayerDoc,
  type FirebaseBlockDoc,
} from "@/lib/firebase/client";
import {
  buildPortfolioOpenWorld,
  DISTRICTS,
  type DistrictZoneId,
  type WorldInteractiveNode,
} from "./openWorldBuilder";
import {
  createPlayableVoxelCharacter,
  type PlayableVoxelCharacter,
} from "./voxelCharacter";
import { createVoxelTexture, type BlockTextureType } from "./voxelTextures";
import { voxelAudio } from "./voxelAudio";

export interface HotbarItem {
  slot: number;
  id: string;
  label: string;
  shortCode: string;
  blockType?: BlockTextureType;
  color: string;
  isTool?: boolean;
}

/**
 * Classic Minecraft Blocks & Tools in the Hotbar ("ama lakhrin lazem ybanu ga3 kima mincraft")
 */
const HOTBAR_ITEMS: HotbarItem[] = [
  {
    slot: 1,
    id: "grass",
    label: "Grass Block",
    shortCode: "GR",
    blockType: "grass",
    color: "#2F9E44",
  },
  {
    slot: 2,
    id: "plank",
    label: "Oak Planks",
    shortCode: "WD",
    blockType: "plank",
    color: "#A47545",
  },
  {
    slot: 3,
    id: "cobble",
    label: "Cobblestone",
    shortCode: "CB",
    blockType: "cobble",
    color: "#64748B",
  },
  {
    slot: 4,
    id: "brick",
    label: "Red Brick",
    shortCode: "BR",
    blockType: "brick",
    color: "#B91C1C",
  },
  {
    slot: 5,
    id: "bookshelf",
    label: "Bookshelf",
    shortCode: "BK",
    blockType: "bookshelf",
    color: "#8C6239",
  },
  {
    slot: 6,
    id: "gold",
    label: "Gold Block",
    shortCode: "AU",
    blockType: "gold",
    color: "#F59E0B",
  },
  {
    slot: 7,
    id: "emerald",
    label: "Emerald Block",
    shortCode: "EM",
    blockType: "emerald",
    color: "#10B981",
  },
  {
    slot: 8,
    id: "glowstone",
    label: "Glowstone Lamp",
    shortCode: "GL",
    blockType: "glowstone",
    color: "#FACC15",
  },
  {
    slot: 9,
    id: "pickaxe",
    label: "Diamond Pickaxe",
    shortCode: "PK",
    color: "#22D3EE",
    isTool: true,
  },
];

type CameraViewMode = "third" | "first" | "aerial";

interface GuideChatMessage {
  id: string;
  sender: "user" | "guide";
  text: string;
}

interface MinecraftOpenWorldProps {
  locale: Locale;
  onSwitchToClassic?: () => void;
  onToggleClassicView?: () => void;
}

export function MinecraftOpenWorld({
  locale,
  onSwitchToClassic,
  onToggleClassicView,
}: MinecraftOpenWorldProps) {
  const handleSwitchClassic = onSwitchToClassic ?? onToggleClassicView;
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Active HUD & World states
  // Default isNight = false -> Bright Sky-Blue Light Mode ("wad3 light mode ykun fih sama2 zarqa2 samawiya")!
  const [activeZone, setActiveZone] = useState<DistrictZoneId>("spawn");
  const [nearbyNode, setNearbyNode] = useState<WorldInteractiveNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorldInteractiveNode | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number>(0);
  const [isNight, setIsNight] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>("third");
  const [hudHidden, setHudHidden] = useState<boolean>(false);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [blocksModified, setBlocksModified] = useState<number>(0);
  const [playerCoords, setPlayerCoords] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 1,
    z: 6,
  });

  // Firebase Real-Time Multi-User Presence states
  const [firebaseUserUid, setFirebaseUserUid] = useState<string | null>(null);
  const [firebaseUserName, setFirebaseUserName] = useState<string>("Lounès_213");
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayerState[]>([]);

  // In-World Working Computer ("hasub yemchi b vrai internet") states
  const [showComputerModal, setShowComputerModal] = useState<boolean>(false);
  const [computerTab, setComputerTab] = useState<"web" | "projects">("web");
  const [browserQuery, setBrowserQuery] = useState<string>("Algeria");
  const [browserLoading, setBrowserLoading] = useState<boolean>(false);
  const [browserResults, setBrowserResults] = useState<BrowserSearchResult[]>([]);
  const [activeIframeUrl, setActiveIframeUrl] = useState<string>(
    "https://en.m.wikipedia.org/wiki/Algeria",
  );

  // Interactive Guide Companion ("Murshid Lounès") states
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [guideInput, setGuideInput] = useState<string>("");
  const [guideLoading, setGuideLoading] = useState<boolean>(false);
  const [guideMessages, setGuideMessages] = useState<GuideChatMessage[]>([
    {
      id: "welcome-1",
      sender: "guide",
      text: "Marhba bik f l'3alam 3D ta3 Lounès Benseba! Ana Murshid Lounès — saqsini 3la ay projet (LStop, Aẓar Neɣ, Kamir Gym...), qraytu f USTHB, wla les technologies li yekhdem bihum.",
    },
  ]);

  // Mutable 3D engine refs for 60fps loop
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.5, 6));
  const playerVelYRef = useRef<number>(0);
  const playerYawRef = useRef<number>(Math.PI);

  // Free 360° Camera Yaw, Pitch & Zoom Distance ("tqder tharek camera kima theb")
  const cameraYawRef = useRef<number>(0);
  const cameraPitchRef = useRef<number>(0.42);
  const cameraDistRef = useRef<number>(9.5);
  const cameraModeRef = useRef<CameraViewMode>("third");

  const isMovingRef = useRef<boolean>(false);
  const isSprintingRef = useRef<boolean>(false);
  const activeZoneRef = useRef<DistrictZoneId>("spawn");
  const keysRef = useRef<Record<string, boolean>>({});
  const mobileInputRef = useRef<{ forward: number; turn: number }>({
    forward: 0,
    turn: 0,
  });
  const selectedSlotRef = useRef<number>(0);
  const nearbyNodeRef = useRef<WorldInteractiveNode | null>(null);
  const isNightRef = useRef<boolean>(false);

  // Refs for world dynamic actions from UI buttons
  const buildActionRef = useRef<(() => void) | null>(null);
  const mineActionRef = useRef<(() => void) | null>(null);
  const jumpActionRef = useRef<(() => void) | null>(null);
  const syncRemotePlayersRef = useRef<OnlinePlayerState[]>([]);
  const syncSharedBlocksRef = useRef<((blocks: PlacedWorldBlock[]) => void) | null>(null);

  const sessionPlayerId = useMemo(
    () => `player-${Math.random().toString(36).slice(2, 10)}`,
    [],
  );

  useEffect(() => {
    selectedSlotRef.current = selectedSlot;
  }, [selectedSlot]);

  useEffect(() => {
    isNightRef.current = isNight;
  }, [isNight]);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    isSprintingRef.current = isSprinting;
  }, [isSprinting]);

  useEffect(() => {
    voxelAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      voxelAudio.enabled = next;
      if (next) {
        voxelAudio.unlock();
        voxelAudio.playAchievement();
      }
      return next;
    });
  }, []);

  const cycleCameraMode = useCallback(() => {
    voxelAudio.unlock();
    voxelAudio.playClick();
    setCameraMode((prev) =>
      prev === "third" ? "first" : prev === "first" ? "aerial" : "third",
    );
  }, []);

  const teleportToDistrict = useCallback((zoneId: DistrictZoneId) => {
    const target = DISTRICTS.find((d) => d.id === zoneId);
    if (!target) return;
    playerPosRef.current.set(target.spawnPoint.x, 0.5, target.spawnPoint.z);
    playerVelYRef.current = 0;
    playerYawRef.current = target.spawnPoint.yaw;
    setActiveZone(zoneId);
    activeZoneRef.current = zoneId;
    voxelAudio.unlock();
    voxelAudio.playAchievement();
  }, []);

  const handleCopyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      voxelAudio.playClick();
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
    }
  }, []);

  // ============================================================================
  // FIREBASE REAL-TIME PRESENCE & BLOCK SYNC ("realtime user diru avec firebase")
  // ============================================================================
  useEffect(() => {
    void testFirestoreConnection();

    const unsubAuth = subscribeToAuth((user) => {
      if (user) {
        setFirebaseUserUid(user.uid);
        setFirebaseUserName(
          (user.displayName || user.email?.split("@")[0] || "Explorer_DZ").slice(0, 20),
        );
      } else {
        setFirebaseUserUid(null);
      }
    });

    let firebasePlayers: FirebasePlayerDoc[] = [];
    let apiPlayers: OnlinePlayerState[] = [];

    const mergeOnlinePlayers = () => {
      const combined = new Map<string, OnlinePlayerState>();
      for (const fp of firebasePlayers) {
        if (fp.uid === firebaseUserUid) continue;
        combined.set(fp.uid, {
          id: fp.uid,
          name: fp.name,
          flag: "🇩🇿",
          color: fp.color,
          x: fp.x,
          y: fp.y,
          z: fp.z,
          yaw: fp.yaw,
          zone: fp.zone,
          isMoving: fp.isMoving,
          updatedAt: Date.now(),
        });
      }
      for (const ap of apiPlayers) {
        if (ap.id === sessionPlayerId || combined.has(ap.id)) continue;
        combined.set(ap.id, ap);
      }
      const list = Array.from(combined.values());
      syncRemotePlayersRef.current = list;
      setOnlinePlayers(list);
    };

    const unsubPlayers = subscribeToWorldPlayers((list) => {
      firebasePlayers = list;
      mergeOnlinePlayers();
    });

    const unsubBlocks = subscribeToWorldBlocks((blocks: FirebaseBlockDoc[]) => {
      const mapped: PlacedWorldBlock[] = blocks.map((b) => ({
        id: b.id,
        x: b.x,
        y: b.y,
        z: b.z,
        type: b.type,
        author: b.ownerId,
      }));
      syncSharedBlocksRef.current?.(mapped);
    });

    const interval = setInterval(() => {
      const pos = playerPosRef.current;
      // 1. If authenticated with Firebase, publish real-time state to Firestore
      if (firebaseUserUid) {
        void publishPlayerStateToFirebase({
          uid: firebaseUserUid,
          name: firebaseUserName,
          color: "#10B981",
          x: pos.x,
          y: pos.y,
          z: pos.z,
          yaw: playerYawRef.current,
          zone: activeZoneRef.current,
          isMoving: isMovingRef.current,
        });
      }

      // 2. Also sync via /api/world/ so unauthenticated tabs see each other live too
      void fetch("/api/world/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "heartbeat",
          player: {
            id: firebaseUserUid || sessionPlayerId,
            name: firebaseUserName,
            flag: "🇩🇿",
            color: "#34D399",
            x: Number(pos.x.toFixed(2)),
            y: Number(pos.y.toFixed(2)),
            z: Number(pos.z.toFixed(2)),
            yaw: Number(playerYawRef.current.toFixed(2)),
            zone: activeZoneRef.current,
            isMoving: isMovingRef.current,
          },
        }),
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { players?: OnlinePlayerState[]; blocks?: PlacedWorldBlock[] } | null) => {
          if (!data) return;
          if (Array.isArray(data.players)) {
            apiPlayers = data.players;
            mergeOnlinePlayers();
          }
          if (Array.isArray(data.blocks)) {
            syncSharedBlocksRef.current?.(data.blocks);
          }
        })
        .catch(() => {});
    }, 2200);

    return () => {
      unsubAuth();
      unsubPlayers();
      unsubBlocks();
      clearInterval(interval);
    };
  }, [firebaseUserUid, firebaseUserName, sessionPlayerId]);

  // ============================================================================
  // LIVE INTERNET BROWSER SEARCH ("hasub yemchi b vrai internet")
  // ============================================================================
  const runLiveBrowserSearch = useCallback(async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;
    setBrowserLoading(true);
    try {
      // If user typed a full URL, load it directly in the browser view
      if (q.startsWith("http://") || q.startsWith("https://")) {
        setActiveIframeUrl(q);
      }
      const res = await fetch(`/api/browser/?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = (await res.json()) as { results?: BrowserSearchResult[] };
        const items = data.results ?? [];
        setBrowserResults(items);
        const firstWiki = items.find((i) => i.source === "wikipedia.org");
        if (firstWiki) {
          setActiveIframeUrl(firstWiki.url);
        }
      }
    } catch {
      // Ignore network error
    } finally {
      setBrowserLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showComputerModal && browserResults.length === 0) {
      void runLiveBrowserSearch("Algeria");
    }
  }, [showComputerModal, browserResults.length, runLiveBrowserSearch]);

  // ============================================================================
  // INTERACTIVE GUIDE COMPANION CHAT ("Murshid Lounès")
  // ============================================================================
  const handleSendGuideMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = guideInput.trim();
    if (!text || guideLoading) return;

    const userMsg: GuideChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
    };
    setGuideMessages((prev) => [...prev, userMsg]);
    setGuideInput("");
    setGuideLoading(true);

    try {
      const res = await fetch("/api/guide/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = (await res.json()) as { reply?: string };
      setGuideMessages((prev) => [
        ...prev,
        {
          id: `g-${Date.now()}`,
          sender: "guide",
          text:
            data.reply ||
            "Lounès Benseba howa Software Engineer (Flutter, Kotlin, Next.js, FastAPI) w yaqra Master Bioinformatics f USTHB.",
        },
      ]);
      voxelAudio.playClick();
    } catch {
      setGuideMessages((prev) => [
        ...prev,
        {
          id: `g-${Date.now()}`,
          sender: "guide",
          text: "Tqder tchuf les 9 projets f Projects Pavilion wla تتواصل مع Lounès f bensebalounes7@gmail.com!",
        },
      ]);
    } finally {
      setGuideLoading(false);
    }
  };

  const openInteractiveNode = useCallback((node: WorldInteractiveNode) => {
    voxelAudio.unlock();
    voxelAudio.playAchievement();
    if (node.kind === "computer") {
      setShowComputerModal(true);
    } else if (node.kind === "guide") {
      setShowGuideModal(true);
    } else {
      setSelectedNode(node);
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE, CAMERA, RENDERER
    // Default Sky-Blue Light Mode ("wad3 light mode ykun fih sama2 zarqa2 samawiya")
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#68BDF8");
    const fog = new THREE.FogExp2("#7DD3FC", 0.0085);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(
      58,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      220,
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. LIGHTING
    const hemiLight = new THREE.HemisphereLight("#E0F2FE", "#166534", 1.05);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight("#FFFBEB", 1.95);
    sunLight.position.set(34, 52, 28);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 150;
    const d = 54;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);

    const sunGeo = new THREE.BoxGeometry(5.5, 5.5, 5.5);
    const sunMat = new THREE.MeshBasicMaterial({ color: "#FEF08A" });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(42, 48, -42);
    scene.add(sunMesh);

    // 3. BUILD PORTFOLIO OPEN WORLD
    const builtWorld = buildPortfolioOpenWorld(locale);
    scene.add(builtWorld.worldGroup);

    // 4. PLAYABLE CHARACTER (Lounès_213 🇩🇿)
    const character = createPlayableVoxelCharacter({
      name: "Lounès_213",
      flag: "🇩🇿",
      jacketColor: "#059669",
      trimColor: "#34D399",
    });
    character.group.position.copy(playerPosRef.current);
    scene.add(character.group);

    // Remote real-time players from Firebase / API (NO fake patrolling bots!)
    const remotePlayerAvatars = new Map<string, PlayableVoxelCharacter>();

    // 5. DYNAMIC USER-PLACED VOXEL BLOCKS
    const customBlocksGroup = new THREE.Group();
    scene.add(customBlocksGroup);
    const customBlockGeo = new THREE.BoxGeometry(1, 1, 1);
    const customMaterials = new Map<BlockTextureType, THREE.MeshStandardMaterial>();
    const placedCustomBlocks = new Map<string, THREE.Mesh>();

    const getCustomBlockMat = (type: BlockTextureType) => {
      let mat = customMaterials.get(type);
      if (!mat) {
        const tex = createVoxelTexture(type);
        mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.7,
          emissive:
            type === "glowstone"
              ? new THREE.Color("#F59E0B")
              : new THREE.Color("#000000"),
          emissiveIntensity: type === "glowstone" ? 0.5 : 0,
        });
        customMaterials.set(type, mat);
      }
      return mat;
    };

    const placeBlockAtCoord = (
      bx: number,
      by: number,
      bz: number,
      type: BlockTextureType,
      broadcast = true,
    ) => {
      const rx = Math.round(bx);
      const ry = Math.max(1, Math.min(20, Math.round(by)));
      const rz = Math.round(bz);
      const key = `${rx},${ry},${rz}`;
      if (placedCustomBlocks.has(key)) return false;

      const newBlock = new THREE.Mesh(customBlockGeo, getCustomBlockMat(type));
      newBlock.position.set(rx, ry, rz);
      newBlock.castShadow = true;
      newBlock.receiveShadow = true;
      customBlocksGroup.add(newBlock);
      placedCustomBlocks.set(key, newBlock);

      if (broadcast) {
        voxelAudio.unlock();
        voxelAudio.playBlockPlace();
        setBlocksModified((c) => c + 1);
        void placeWorldBlockInFirebase({ x: rx, y: ry, z: rz, type });
        void fetch("/api/world/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "place_block",
            block: {
              x: rx,
              y: ry,
              z: rz,
              type,
              author: "Lounès_213",
            },
          }),
        }).catch(() => {});
      }
      return true;
    };

    const removeBlockAtCoord = (bx: number, by: number, bz: number) => {
      const rx = Math.round(bx);
      const ry = Math.round(by);
      const rz = Math.round(bz);
      const key = `${rx},${ry},${rz}`;
      const existing = placedCustomBlocks.get(key);
      if (existing) {
        customBlocksGroup.remove(existing);
        placedCustomBlocks.delete(key);
        voxelAudio.unlock();
        voxelAudio.playBlockBreak();
        setBlocksModified((c) => c + 1);
        void removeWorldBlockFromFirebase(rx, ry, rz);
        void fetch("/api/world/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "remove_block",
            coord: { x: rx, y: ry, z: rz },
          }),
        }).catch(() => {});
        return true;
      }
      return false;
    };

    syncSharedBlocksRef.current = (blocks: PlacedWorldBlock[]) => {
      for (const b of blocks) {
        const key = `${b.x},${b.y},${b.z}`;
        if (!placedCustomBlocks.has(key)) {
          placeBlockAtCoord(
            b.x,
            b.y,
            b.z,
            (b.type as BlockTextureType) || "grass",
            false,
          );
        }
      }
    };

    buildActionRef.current = () => {
      voxelAudio.unlock();
      const slotItem = HOTBAR_ITEMS[selectedSlotRef.current];
      const blockType = slotItem?.blockType ?? "grass";
      const pos = playerPosRef.current;
      const yaw = playerYawRef.current;
      const tx = Math.round(pos.x + Math.sin(yaw) * 2.2);
      const tz = Math.round(pos.z + Math.cos(yaw) * 2.2);
      for (let ty = 1; ty <= 8; ty++) {
        if (!placedCustomBlocks.has(`${tx},${ty},${tz}`)) {
          placeBlockAtCoord(tx, ty, tz, blockType, true);
          break;
        }
      }
    };

    mineActionRef.current = () => {
      voxelAudio.unlock();
      const pos = playerPosRef.current;
      const yaw = playerYawRef.current;
      const tx = Math.round(pos.x + Math.sin(yaw) * 2.2);
      const tz = Math.round(pos.z + Math.cos(yaw) * 2.2);
      for (let ty = 8; ty >= 1; ty--) {
        if (removeBlockAtCoord(tx, ty, tz)) return;
      }
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          for (let ty = 6; ty >= 1; ty--) {
            if (removeBlockAtCoord(tx + dx, ty, tz + dz)) return;
          }
        }
      }
      voxelAudio.playBlockBreak();
    };

    jumpActionRef.current = () => {
      voxelAudio.unlock();
      if (playerPosRef.current.y <= 0.55) {
        playerVelYRef.current = 7.8;
        voxelAudio.playFootstep(1, "stone");
      }
    };

    // Wireframe Block Highlighter
    const highlightGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.03, 1.03, 1.03));
    const highlightMat = new THREE.LineBasicMaterial({ color: "#34D399" });
    const highlightBox = new THREE.LineSegments(highlightGeo, highlightMat);
    highlightBox.visible = false;
    scene.add(highlightBox);

    // 6. INPUT LISTENERS (Keyboard, Full 360° Yaw/Pitch Drag, Wheel Zoom, Click)
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      voxelAudio.unlock();
      keysRef.current[e.code] = true;

      if (e.code.startsWith("Digit")) {
        const num = parseInt(e.code.replace("Digit", ""), 10);
        if (num >= 1 && num <= 9) {
          setSelectedSlot(num - 1);
          voxelAudio.playClick();
        }
      }

      if (e.code === "KeyE" && nearbyNodeRef.current) {
        openInteractiveNode(nearbyNodeRef.current);
      }

      if (e.code === "KeyV") {
        setCameraMode((prev) =>
          prev === "third" ? "first" : prev === "first" ? "aerial" : "third",
        );
        voxelAudio.playClick();
      }

      if (e.code === "KeyH") {
        setHudHidden((h) => !h);
        voxelAudio.playClick();
      }

      if (e.code === "KeyF") {
        buildActionRef.current?.();
      }

      if (e.code === "KeyX") {
        mineActionRef.current?.();
      }

      if (e.code === "Space" && playerPosRef.current.y <= 0.55) {
        playerVelYRef.current = 7.8;
      }

      if (e.code === "Escape") {
        setSelectedNode(null);
        setShowComputerModal(false);
        setShowGuideModal(false);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Free 360° Mouse / Touch Camera Orbit (both Yaw AND Pitch!) + Wheel Zoom
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let pointerDownTime = 0;

    const getTargets = () => [
      ...builtWorld.interactiveNodes.map((n) => n.mesh),
      ...builtWorld.blockMeshes,
      ...customBlocksGroup.children,
    ];

    const onPointerDown = (e: PointerEvent) => {
      voxelAudio.unlock();
      isDragging = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      pointerDownTime = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (e.buttons === 1 || e.buttons === 2) {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
          isDragging = true;
          cameraYawRef.current -= deltaX * 0.007;
          cameraPitchRef.current = Math.max(
            -0.35,
            Math.min(1.3, cameraPitchRef.current + deltaY * 0.006),
          );
          dragStartX = e.clientX;
          dragStartY = e.clientY;
        }
      }

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(
        [...builtWorld.blockMeshes, ...customBlocksGroup.children],
        false,
      );
      const firstHit = hits[0];
      if (firstHit && firstHit.distance < 16 && firstHit.face) {
        const hitPos = new THREE.Vector3();
        if (
          firstHit.object instanceof THREE.InstancedMesh &&
          firstHit.instanceId !== undefined
        ) {
          const mat4 = new THREE.Matrix4();
          firstHit.object.getMatrixAt(firstHit.instanceId, mat4);
          hitPos.setFromMatrixPosition(mat4);
        } else {
          hitPos.copy(firstHit.object.position);
        }
        highlightBox.position.copy(hitPos);
        highlightBox.visible = true;
      } else {
        highlightBox.visible = false;
      }
    };

    const onWheel = (e: WheelEvent) => {
      cameraDistRef.current = Math.max(
        2.5,
        Math.min(28, cameraDistRef.current + e.deltaY * 0.01),
      );
    };

    const onPointerUp = (e: PointerEvent) => {
      const elapsed = performance.now() - pointerDownTime;
      if (isDragging || elapsed > 350) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(getTargets(), false);
      const hit = hits[0];
      if (!hit || hit.distance > 24) return;

      const nodeId = hit.object.userData?.interactiveNodeId as string | undefined;
      if (nodeId) {
        const found = builtWorld.interactiveNodes.find((n) => n.id === nodeId);
        if (found) {
          openInteractiveNode(found);
          return;
        }
      }

      const slotItem = HOTBAR_ITEMS[selectedSlotRef.current];
      if (!slotItem) return;

      if (slotItem.isTool || e.button === 2 || e.shiftKey) {
        if (customBlocksGroup.children.includes(hit.object)) {
          removeBlockAtCoord(
            hit.object.position.x,
            hit.object.position.y,
            hit.object.position.z,
          );
        }
      } else if (slotItem.blockType && hit.face) {
        const basePos = new THREE.Vector3();
        if (
          hit.object instanceof THREE.InstancedMesh &&
          hit.instanceId !== undefined
        ) {
          const mat4 = new THREE.Matrix4();
          hit.object.getMatrixAt(hit.instanceId, mat4);
          basePos.setFromMatrixPosition(mat4);
        } else {
          basePos.copy(hit.object.position);
        }

        const targetPos = basePos.clone().add(hit.face.normal);
        if (targetPos.distanceTo(playerPosRef.current) > 1.2 && targetPos.y >= 1) {
          placeBlockAtCoord(
            targetPos.x,
            targetPos.y,
            targetPos.z,
            slotItem.blockType,
            true,
          );
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener("pointerdown", onPointerDown);
    domElem.addEventListener("pointermove", onPointerMove);
    domElem.addEventListener("pointerup", onPointerUp);
    domElem.addEventListener("wheel", onWheel, { passive: true });

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / Math.max(1, container.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // 7. MAIN GAME LOOP
    let frameId = 0;
    let lastTime = performance.now();
    let stepTimer = 0;
    let stepCount = 0;
    let coordSyncTimer = 0;

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const elapsed = now / 1000;

      // Sky-Blue Light Mode vs Starry Night Mode
      const targetSky = isNightRef.current ? "#07101E" : "#68BDF8";
      const targetFog = isNightRef.current ? "#07101E" : "#8CE0FF";
      (scene.background as THREE.Color).lerp(new THREE.Color(targetSky), 0.06);
      fog.color.lerp(new THREE.Color(targetFog), 0.06);
      sunLight.intensity = isNightRef.current ? 0.35 : 1.95;
      hemiLight.intensity = isNightRef.current ? 0.35 : 1.05;

      builtWorld.updateWorldAnimations(elapsed);

      // Movement Input Vector
      const keys = keysRef.current;
      let moveForward = mobileInputRef.current.forward;
      let moveRight = 0;

      if (keys["KeyW"] || keys["ArrowUp"]) moveForward += 1;
      if (keys["KeyS"] || keys["ArrowDown"]) moveForward -= 1;
      if (keys["KeyD"] || keys["ArrowRight"]) moveRight += 1;
      if (keys["KeyA"] || keys["ArrowLeft"]) moveRight -= 1;

      if (keys["KeyQ"]) cameraYawRef.current += 1.9 * dt;
      if (keys["KeyC"]) cameraYawRef.current -= 1.9 * dt;
      if (mobileInputRef.current.turn !== 0) {
        cameraYawRef.current -= mobileInputRef.current.turn * 1.9 * dt;
      }

      const sprintActive =
        isSprintingRef.current || Boolean(keys["ShiftLeft"] || keys["ShiftRight"]);
      const isMoving = Math.abs(moveForward) > 0.05 || Math.abs(moveRight) > 0.05;
      isMovingRef.current = isMoving;

      if (isMoving) {
        const camForward = new THREE.Vector3(
          -Math.sin(cameraYawRef.current),
          0,
          -Math.cos(cameraYawRef.current),
        ).normalize();
        const camRight = new THREE.Vector3(
          Math.cos(cameraYawRef.current),
          0,
          -Math.sin(cameraYawRef.current),
        ).normalize();

        const moveDir = new THREE.Vector3()
          .addScaledVector(camForward, moveForward)
          .addScaledVector(camRight, moveRight)
          .normalize();

        const speed = sprintActive ? 11.2 : 7.2;
        const nextX = playerPosRef.current.x + moveDir.x * speed * dt;
        const nextZ = playerPosRef.current.z + moveDir.z * speed * dt;

        const clampX = Math.max(-48, Math.min(48, nextX));
        const clampZ = Math.max(-48, Math.min(48, nextZ));

        const colKeyX = `${Math.round(clampX)},${Math.round(playerPosRef.current.z)}`;
        const colKeyZ = `${Math.round(playerPosRef.current.x)},${Math.round(clampZ)}`;

        if (!builtWorld.collisionColumns.has(colKeyX)) {
          playerPosRef.current.x = clampX;
        }
        if (!builtWorld.collisionColumns.has(colKeyZ)) {
          playerPosRef.current.z = clampZ;
        }

        playerYawRef.current = Math.atan2(moveDir.x, moveDir.z);

        stepTimer += dt * (sprintActive ? 1.45 : 1);
        if (stepTimer > 0.34) {
          stepTimer = 0;
          stepCount += 1;
          const px = playerPosRef.current.x;
          const pz = playerPosRef.current.z;
          const onRoadOrPlaza =
            Math.hypot(px, pz) < 10 ||
            Math.abs(px) <= 2 ||
            Math.abs(pz) <= 2 ||
            activeZoneRef.current !== "spawn";
          voxelAudio.playFootstep(stepCount, onRoadOrPlaza ? "stone" : "grass");
        }
      }

      if (playerPosRef.current.y > 0.5 || playerVelYRef.current !== 0) {
        playerPosRef.current.y += playerVelYRef.current * dt;
        playerVelYRef.current -= 22 * dt;
        if (playerPosRef.current.y <= 0.5) {
          playerPosRef.current.y = 0.5;
          playerVelYRef.current = 0;
        }
      }

      const mode = cameraModeRef.current;
      character.group.visible = mode !== "first";
      character.group.position.copy(playerPosRef.current);
      character.group.rotation.y = playerYawRef.current;
      character.animate(isMoving, elapsed, sprintActive);

      // Sync & animate real remote players connected via Firebase / API
      const remoteList = syncRemotePlayersRef.current;
      const activeIds = new Set<string>();
      for (const rp of remoteList) {
        activeIds.add(rp.id);
        let avatar = remotePlayerAvatars.get(rp.id);
        if (!avatar) {
          avatar = createPlayableVoxelCharacter({
            name: rp.name,
            flag: rp.flag,
            jacketColor: rp.color,
            castShadow: false,
          });
          avatar.group.position.set(rp.x, rp.y, rp.z);
          scene.add(avatar.group);
          remotePlayerAvatars.set(rp.id, avatar);
        }
        avatar.group.position.lerp(new THREE.Vector3(rp.x, rp.y, rp.z), 0.15);
        avatar.group.rotation.y = rp.yaw;
        avatar.animate(rp.isMoving, elapsed);
      }
      remotePlayerAvatars.forEach((avatar, id) => {
        if (!activeIds.has(id)) {
          scene.remove(avatar.group);
          avatar.dispose();
          remotePlayerAvatars.delete(id);
        }
      });

      // Free 360° Spherical Camera Positioning (Yaw, Pitch & Zoom Distance!)
      if (mode === "first") {
        const eyePos = new THREE.Vector3(
          playerPosRef.current.x,
          playerPosRef.current.y + 1.85,
          playerPosRef.current.z,
        );
        camera.position.copy(eyePos);
        const lookTarget = new THREE.Vector3(
          eyePos.x - Math.sin(cameraYawRef.current) * Math.cos(cameraPitchRef.current) * 10,
          eyePos.y - Math.sin(cameraPitchRef.current - 0.3) * 6,
          eyePos.z - Math.cos(cameraYawRef.current) * Math.cos(cameraPitchRef.current) * 10,
        );
        camera.lookAt(lookTarget);
      } else {
        const dist = mode === "aerial" ? 20 : cameraDistRef.current;
        const pitch = mode === "aerial" ? 0.85 : cameraPitchRef.current;
        const horizDist = dist * Math.cos(pitch);
        const vertDist = Math.max(1.2, dist * Math.sin(pitch) + 1.6);

        const desiredCamPos = new THREE.Vector3(
          playerPosRef.current.x + Math.sin(cameraYawRef.current) * horizDist,
          playerPosRef.current.y + vertDist,
          playerPosRef.current.z + Math.cos(cameraYawRef.current) * horizDist,
        );
        camera.position.lerp(desiredCamPos, 0.18);
        camera.lookAt(
          playerPosRef.current.x,
          playerPosRef.current.y + 1.55,
          playerPosRef.current.z,
        );
      }

      const detectedZone = builtWorld.updateHouseCutaways(playerPosRef.current);
      if (detectedZone && detectedZone !== activeZoneRef.current) {
        activeZoneRef.current = detectedZone;
        setActiveZone(detectedZone);
      }

      let closest: WorldInteractiveNode | null = null;
      let minDist = 4.6;
      for (const node of builtWorld.interactiveNodes) {
        const dNode = node.position.distanceTo(playerPosRef.current);
        if (dNode < minDist) {
          minDist = dNode;
          closest = node;
        }
      }
      if (closest?.id !== nearbyNodeRef.current?.id) {
        nearbyNodeRef.current = closest;
        setNearbyNode(closest);
      }

      coordSyncTimer += dt;
      if (coordSyncTimer > 0.25) {
        coordSyncTimer = 0;
        setPlayerCoords({
          x: Math.round(playerPosRef.current.x),
          y: Math.round(playerPosRef.current.y),
          z: Math.round(playerPosRef.current.z),
        });
      }

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      domElem.removeEventListener("pointerdown", onPointerDown);
      domElem.removeEventListener("pointermove", onPointerMove);
      domElem.removeEventListener("pointerup", onPointerUp);
      domElem.removeEventListener("wheel", onWheel);

      remotePlayerAvatars.forEach((a) => a.dispose());
      character.dispose();
      builtWorld.dispose();
      customBlockGeo.dispose();
      customMaterials.forEach((m) => m.dispose());
      highlightGeo.dispose();
      highlightMat.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      renderer.dispose();
    };
  }, [locale, openInteractiveNode]);

  const currentDistrict =
    DISTRICTS.find((d) => d.id === activeZone) ?? DISTRICTS[0]!;

  const totalOnlineCount = 1 + onlinePlayers.length;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#68BDF8] select-none font-mono text-slate-100">
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="absolute inset-0 h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* ====================================================================
          ALWAYS-PINNED TOP-RIGHT 2D / 3D SWITCHER & HIDE MENU BUTTON
          ("btn 2 d ,w 3 d dirha lfuq a droit ga3" + "tqder tkhfi menu hadak")
      ==================================================================== */}
      <div className="pointer-events-auto fixed top-3 right-3 z-40 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            voxelAudio.playClick();
            setHudHidden((h) => !h);
          }}
          title="Hide / Show All Menus [H]"
          className="inline-flex items-center gap-1.5 border-2 border-slate-700 bg-[#090D16]/95 px-2.5 py-1.5 text-xs font-black text-slate-200 uppercase shadow-[3px_3px_0_#000] hover:border-emerald-400"
        >
          {hudHidden ? (
            <>
              <Eye className="h-3.5 w-3.5 text-emerald-400" />
              <span>Show UI [H]</span>
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5 text-amber-300" />
              <span className="hidden sm:inline">Hide UI [H]</span>
            </>
          )}
        </button>

        {/* Top-Right 3D / 2D Switcher */}
        <div className="flex items-center border-2 border-[#05070B] bg-[#090D16]/95 p-0.5 shadow-[4px_4px_0_#000]">
          <button
            type="button"
            className="inline-flex items-center gap-1 bg-emerald-400 px-2.5 py-1 text-xs font-black text-slate-950 uppercase"
          >
            <Box className="h-3.5 w-3.5" />
            <span>3D</span>
          </button>
          {handleSwitchClassic ? (
            <button
              type="button"
              onClick={handleSwitchClassic}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-black text-slate-300 uppercase transition-colors hover:bg-amber-400 hover:text-slate-950"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>2D</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* ====================================================================
          COLLAPSIBLE HUD MENUS (Hidden when `hudHidden` is true)
      ==================================================================== */}
      {!hudHidden ? (
        <>
          {/* TOP HUD BAR */}
          <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start justify-between gap-2 p-2.5 pr-44 sm:p-4 sm:pr-56">
            {/* Left: Player Card + Portrait + Coordinates + Firebase Online Count */}
            <div className="pointer-events-auto flex flex-col gap-1.5 border-2 border-emerald-500/70 bg-[#090D16]/90 p-2.5 shadow-[4px_4px_0_#000] backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/portrait.jpg"
                  alt={profile.name}
                  className="h-10 w-10 border-2 border-amber-400 object-cover shadow-[2px_2px_0_#000]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 animate-pulse bg-emerald-400" />
                    <span className="text-xs font-black tracking-wider text-emerald-300 uppercase">
                      {profile.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    XYZ:{" "}
                    <span className="text-emerald-400">
                      {playerCoords.x}, {playerCoords.y}, {playerCoords.z}
                    </span>{" "}
                    · Built: <span className="text-amber-300">{blocksModified}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-800 pt-1.5 text-[10px]">
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 px-1.5 py-0.5 font-bold text-emerald-300">
                  <MapPin className="h-3 w-3" />
                  {currentDistrict.name}
                </span>
                <span className="inline-flex items-center gap-1 bg-cyan-500/20 px-1.5 py-0.5 font-bold text-cyan-300">
                  <Users className="h-3 w-3" />
                  {totalOnlineCount} ONLINE
                </span>
                {!firebaseUserUid ? (
                  <button
                    type="button"
                    onClick={() => void signInWithGooglePopup()}
                    className="inline-flex items-center gap-1 border border-emerald-400/60 bg-emerald-500/20 px-1.5 py-0.5 font-bold text-emerald-200 hover:bg-emerald-500 hover:text-slate-950"
                  >
                    <LogIn className="h-2.5 w-2.5" /> Sync Profile
                  </button>
                ) : null}
              </div>
            </div>

            {/* Center: Fast-Travel District Teleport Bar */}
            <nav
              aria-label="World Districts Fast Travel"
              className="pointer-events-auto flex flex-wrap items-center gap-1 border-2 border-slate-700/80 bg-[#090D16]/90 p-1.5 shadow-[4px_4px_0_#000] backdrop-blur-md"
            >
              {DISTRICTS.map((d) => {
                const isActive = d.id === activeZone;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => teleportToDistrict(d.id)}
                    className={`px-2 py-1 text-[10px] font-bold tracking-wider uppercase transition-all sm:text-xs ${
                      isActive
                        ? "border border-emerald-300 bg-emerald-500 text-slate-950 shadow-[2px_2px_0_#000]"
                        : "border border-transparent bg-slate-800/80 text-slate-300 hover:border-slate-600 hover:text-white"
                    }`}
                  >
                    {d.id === "spawn"
                      ? "1. Spawn 🇩🇿"
                      : d.id === "projects"
                        ? "2. Projects (9)"
                        : d.id === "academy"
                          ? "3. USTHB"
                          : d.id === "skills"
                            ? "4. Tech House"
                            : "5. Contact"}
                  </button>
                );
              })}
            </nav>

            {/* Quick Tools: Live PC Browser, Interactive Guide, Camera, Sky Mode, Sound */}
            <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  voxelAudio.unlock();
                  voxelAudio.playClick();
                  setShowComputerModal(true);
                }}
                className="inline-flex items-center gap-1.5 border-2 border-sky-400 bg-sky-500 px-2.5 py-1.5 text-xs font-black text-slate-950 uppercase shadow-[3px_3px_0_#000] hover:bg-sky-400"
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>PC / Web</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  voxelAudio.unlock();
                  voxelAudio.playClick();
                  setShowGuideModal(true);
                }}
                className="inline-flex items-center gap-1.5 border-2 border-emerald-400 bg-emerald-500 px-2.5 py-1.5 text-xs font-black text-slate-950 uppercase shadow-[3px_3px_0_#000] hover:bg-emerald-400"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Guide 💬</span>
              </button>

              <button
                type="button"
                onClick={cycleCameraMode}
                title="Switch Camera View (1st-Person / 3rd-Person / Aerial) [V]"
                className="inline-flex items-center gap-1 border-2 border-cyan-500/70 bg-[#090D16]/90 px-2.5 py-1.5 text-xs font-bold text-cyan-300 shadow-[3px_3px_0_#000] hover:border-cyan-400"
              >
                <Eye className="h-3.5 w-3.5" />
                <span className="uppercase">{cameraMode} [V]</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsNight((n) => !n);
                  voxelAudio.playClick();
                }}
                title="Toggle Sky-Blue Day / Starry Night"
                className="flex h-9 w-9 items-center justify-center border-2 border-slate-700 bg-[#090D16]/90 text-amber-300 shadow-[3px_3px_0_#000] hover:border-amber-400"
              >
                {isNight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={toggleSound}
                title="Toggle Footstep & World Sound Effects"
                className={`flex h-9 w-9 items-center justify-center border-2 bg-[#090D16]/90 shadow-[3px_3px_0_#000] ${
                  soundEnabled
                    ? "border-emerald-400 text-emerald-300"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>
            </div>
          </header>

          {/* NEARBY 3D INTERACTION PROMPT ([E] / TAP TO OPEN) */}
          {nearbyNode && !selectedNode && !showComputerModal && !showGuideModal ? (
            <div className="pointer-events-auto absolute bottom-36 left-1/2 z-20 -translate-x-1/2 animate-bounce">
              <button
                type="button"
                onClick={() => openInteractiveNode(nearbyNode)}
                className="flex items-center gap-3 border-2 border-emerald-400 bg-[#090D16]/95 px-4 py-2 text-left shadow-[4px_4px_0_#000]"
              >
                <span className="flex h-7 w-7 items-center justify-center bg-emerald-400 font-black text-slate-950">
                  E
                </span>
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
                    TAP OR PRESS [E] TO INTERACT
                  </div>
                  <div className="text-xs font-black text-white sm:text-sm">
                    {nearbyNode.title}
                  </div>
                </div>
              </button>
            </div>
          ) : null}

          {/* LEFT: D-PAD + SPRINT */}
          <div className="pointer-events-auto absolute bottom-20 left-3 z-20 flex flex-col items-center gap-1 sm:bottom-6 sm:left-5">
            <button
              type="button"
              aria-label="Move Forward"
              onPointerDown={() => {
                voxelAudio.unlock();
                mobileInputRef.current.forward = 1;
              }}
              onPointerUp={() => {
                mobileInputRef.current.forward = 0;
              }}
              onPointerLeave={() => {
                mobileInputRef.current.forward = 0;
              }}
              className="flex h-11 w-11 items-center justify-center border-2 border-emerald-500/80 bg-[#090D16]/90 text-sm font-black text-emerald-300 shadow-[3px_3px_0_#000] active:bg-emerald-500 active:text-slate-950 sm:h-12 sm:w-12"
            >
              ▲
            </button>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Turn Left"
                onPointerDown={() => {
                  voxelAudio.unlock();
                  mobileInputRef.current.turn = -1;
                }}
                onPointerUp={() => {
                  mobileInputRef.current.turn = 0;
                }}
                onPointerLeave={() => {
                  mobileInputRef.current.turn = 0;
                }}
                className="flex h-11 w-11 items-center justify-center border-2 border-emerald-500/80 bg-[#090D16]/90 text-sm font-black text-emerald-300 shadow-[3px_3px_0_#000] active:bg-emerald-500 active:text-slate-950 sm:h-12 sm:w-12"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => {
                  voxelAudio.unlock();
                  voxelAudio.playClick();
                  setIsSprinting((s) => !s);
                }}
                className={`flex h-11 w-11 flex-col items-center justify-center border-2 text-[9px] font-black uppercase shadow-[3px_3px_0_#000] sm:h-12 sm:w-12 ${
                  isSprinting
                    ? "border-amber-300 bg-amber-400 text-slate-950"
                    : "border-slate-700 bg-[#090D16]/90 text-slate-300"
                }`}
              >
                <Zap className="h-3.5 w-3.5" />
                RUN
              </button>
              <button
                type="button"
                aria-label="Turn Right"
                onPointerDown={() => {
                  voxelAudio.unlock();
                  mobileInputRef.current.turn = 1;
                }}
                onPointerUp={() => {
                  mobileInputRef.current.turn = 0;
                }}
                onPointerLeave={() => {
                  mobileInputRef.current.turn = 0;
                }}
                className="flex h-11 w-11 items-center justify-center border-2 border-emerald-500/80 bg-[#090D16]/90 text-sm font-black text-emerald-300 shadow-[3px_3px_0_#000] active:bg-emerald-500 active:text-slate-950 sm:h-12 sm:w-12"
              >
                ▶
              </button>
            </div>
            <button
              type="button"
              aria-label="Move Backward"
              onPointerDown={() => {
                voxelAudio.unlock();
                mobileInputRef.current.forward = -1;
              }}
              onPointerUp={() => {
                mobileInputRef.current.forward = 0;
              }}
              onPointerLeave={() => {
                mobileInputRef.current.forward = 0;
              }}
              className="flex h-11 w-11 items-center justify-center border-2 border-emerald-500/80 bg-[#090D16]/90 text-sm font-black text-emerald-300 shadow-[3px_3px_0_#000] active:bg-emerald-500 active:text-slate-950 sm:h-12 sm:w-12"
            >
              ▼
            </button>
          </div>

          {/* RIGHT: ACTION PAD (CAMERA ORBIT/ZOOM, JUMP, BUILD, MINE, OPEN [E]) */}
          <div className="pointer-events-auto absolute right-3 bottom-20 z-20 flex flex-col items-end gap-1.5 sm:right-5 sm:bottom-6">
            {/* Free Camera Orbit & Zoom Row */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onPointerDown={() => {
                  keysRef.current["KeyQ"] = true;
                }}
                onPointerUp={() => {
                  keysRef.current["KeyQ"] = false;
                }}
                onPointerLeave={() => {
                  keysRef.current["KeyQ"] = false;
                }}
                className="flex h-8 items-center gap-1 border-2 border-slate-700 bg-[#090D16]/90 px-2 text-[10px] font-black text-slate-200 shadow-[2px_2px_0_#000]"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  cameraDistRef.current = Math.max(2.5, cameraDistRef.current - 2);
                }}
                title="Zoom In"
                className="flex h-8 items-center border-2 border-slate-700 bg-[#090D16]/90 px-2 text-[10px] font-black text-slate-200 shadow-[2px_2px_0_#000]"
              >
                <ZoomIn className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  cameraDistRef.current = Math.min(28, cameraDistRef.current + 2);
                }}
                title="Zoom Out"
                className="flex h-8 items-center border-2 border-slate-700 bg-[#090D16]/90 px-2 text-[10px] font-black text-slate-200 shadow-[2px_2px_0_#000]"
              >
                <ZoomOut className="h-3 w-3" />
              </button>
              <button
                type="button"
                onPointerDown={() => {
                  keysRef.current["KeyC"] = true;
                }}
                onPointerUp={() => {
                  keysRef.current["KeyC"] = false;
                }}
                onPointerLeave={() => {
                  keysRef.current["KeyC"] = false;
                }}
                className="flex h-8 items-center gap-1 border-2 border-slate-700 bg-[#090D16]/90 px-2 text-[10px] font-black text-slate-200 shadow-[2px_2px_0_#000]"
              >
                <RotateCw className="h-3 w-3" />
              </button>
            </div>

            {/* Primary Gamepad Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => buildActionRef.current?.()}
                className="flex h-11 w-20 flex-col items-center justify-center border-2 border-sky-400 bg-sky-500/90 text-[10px] font-black text-slate-950 uppercase shadow-[3px_3px_0_#000] active:scale-95"
              >
                <Hammer className="h-3.5 w-3.5" />
                BUILD [F]
              </button>
              <button
                type="button"
                onClick={() => mineActionRef.current?.()}
                className="flex h-11 w-20 flex-col items-center justify-center border-2 border-amber-400 bg-amber-500/90 text-[10px] font-black text-slate-950 uppercase shadow-[3px_3px_0_#000] active:scale-95"
              >
                <Pickaxe className="h-3.5 w-3.5" />
                MINE [X]
              </button>
              <button
                type="button"
                onClick={() => jumpActionRef.current?.()}
                className="flex h-11 w-20 flex-col items-center justify-center border-2 border-emerald-400 bg-[#090D16]/95 text-[10px] font-black text-emerald-300 uppercase shadow-[3px_3px_0_#000] active:bg-emerald-400 active:text-slate-950"
              >
                ▲ JUMP
              </button>
              <button
                type="button"
                onClick={() => {
                  if (nearbyNode) {
                    openInteractiveNode(nearbyNode);
                  } else {
                    setShowComputerModal(true);
                  }
                }}
                className={`flex h-11 w-20 flex-col items-center justify-center border-2 text-[10px] font-black uppercase shadow-[3px_3px_0_#000] ${
                  nearbyNode
                    ? "animate-pulse border-emerald-300 bg-emerald-400 text-slate-950"
                    : "border-sky-400 bg-[#090D16]/95 text-sky-300"
                }`}
              >
                {nearbyNode ? "OPEN [E]" : "OPEN PC"}
              </button>
            </div>
          </div>

          {/* BOTTOM CLASSIC MINECRAFT INVENTORY HOTBAR */}
          <div className="pointer-events-auto absolute bottom-2.5 left-1/2 z-20 -translate-x-1/2">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-[#090D16]/90 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
                {HOTBAR_ITEMS[selectedSlot]?.label} — Drag screen to rotate camera 360°
              </div>
              <div className="flex items-center gap-1 border-2 border-slate-600 bg-[#090D16]/95 p-1 shadow-[4px_4px_0_#000]">
                {HOTBAR_ITEMS.map((item, idx) => {
                  const active = idx === selectedSlot;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(idx);
                        voxelAudio.unlock();
                        voxelAudio.playClick();
                      }}
                      className={`relative flex h-10 w-10 flex-col items-center justify-center border-2 transition-transform sm:h-11 sm:w-11 ${
                        active
                          ? "-translate-y-1 border-emerald-400 bg-slate-800 shadow-[0_4px_0_#10B981]"
                          : "border-slate-700 bg-slate-900/90 hover:border-slate-500"
                      }`}
                    >
                      <span className="absolute top-0.5 left-1 text-[8px] font-bold text-slate-400">
                        {item.slot}
                      </span>
                      {item.isTool ? (
                        <Pickaxe className="h-4 w-4 text-cyan-400" />
                      ) : (
                        <span
                          className="flex h-6 w-6 items-center justify-center border border-white/30 text-[10px] font-black text-white shadow-inner"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.shortCode}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ) : null}

      {/* ====================================================================
          MODAL 1: 3D SIGNBOARD / PROJECT KIOSK INSPECTOR
      ==================================================================== */}
      {selectedNode ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto border-4 border-emerald-400 bg-[#090D16] p-6 shadow-[10px_10px_0_#000]">
            <button
              type="button"
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center border-2 border-slate-700 bg-slate-900 text-slate-300 hover:border-emerald-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-2 inline-flex items-center gap-2 bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              {selectedNode.zone.toUpperCase()} DISTRICT
            </div>

            <h2 className="text-2xl font-black text-white sm:text-3xl">
              {selectedNode.title}
            </h2>
            <p className="mt-1 text-sm font-bold text-emerald-400">
              {selectedNode.subtitle}
            </p>

            {selectedNode.reel ? (
              <div className="my-4 overflow-hidden border-2 border-slate-700 bg-black">
                {selectedNode.reel.videoSrc ? (
                  <video
                    src={selectedNode.reel.videoSrc}
                    poster={selectedNode.reel.posterSrc}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="max-h-72 w-full object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedNode.reel.posterSrc}
                    alt={selectedNode.title}
                    className="max-h-72 w-full object-cover"
                  />
                )}
              </div>
            ) : null}

            <div className="my-4 whitespace-pre-line border-l-4 border-emerald-500 bg-slate-900/90 p-4 text-sm leading-relaxed text-slate-200">
              {selectedNode.description}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedNode.tags.map((t) => (
                <span
                  key={t}
                  className="border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-bold text-emerald-300"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {selectedNode.actionHref ? (
                  <a
                    href={selectedNode.actionHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-emerald-300 bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 uppercase shadow-[3px_3px_0_#000] hover:bg-emerald-400"
                  >
                    {selectedNode.actionHref.endsWith(".pdf") ? (
                      <Download className="h-4 w-4" />
                    ) : selectedNode.reel ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                    {selectedNode.actionLabel ?? "Open Resource"}
                  </a>
                ) : null}

                {selectedNode.kind === "contact" ? (
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-2 border-2 border-slate-600 bg-slate-800 px-3.5 py-2 text-xs font-bold text-white uppercase hover:border-emerald-400"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        Copied {profile.email}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy {profile.email}
                      </>
                    )}
                  </button>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="border-2 border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-300 uppercase hover:border-white hover:text-white"
              >
                Close [ESC]
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ====================================================================
          MODAL 2: WORKING IN-WORLD COMPUTER & LIVE INTERNET BROWSER
          ("zidli hasub yemchi b vrai internet")
      ==================================================================== */}
      {showComputerModal ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
        >
          <div className="flex h-[88vh] w-full max-w-5xl flex-col border-4 border-sky-400 bg-[#090D16] shadow-[12px_12px_0_#000]">
            {/* Computer OS Window Title Bar */}
            <div className="flex items-center justify-between border-b-2 border-slate-800 bg-slate-900 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <Monitor className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-black tracking-wider text-sky-300 uppercase">
                  LOUNÈS WORKSTATION OS · LIVE INTERNET & APPS
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setComputerTab("web")}
                  className={`px-3 py-1 text-xs font-bold uppercase ${
                    computerTab === "web"
                      ? "bg-sky-400 text-slate-950"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  🌐 Live Web Browser
                </button>
                <button
                  type="button"
                  onClick={() => setComputerTab("projects")}
                  className={`px-3 py-1 text-xs font-bold uppercase ${
                    computerTab === "projects"
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  🚀 All 9 Projects ({reels.length})
                </button>
                <button
                  type="button"
                  onClick={() => setShowComputerModal(false)}
                  className="flex h-7 w-7 items-center justify-center border border-slate-700 bg-rose-500 text-slate-950 font-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {computerTab === "web" ? (
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Browser Address & Search Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void runLiveBrowserSearch(browserQuery);
                  }}
                  className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950 p-2.5"
                >
                  <div className="flex flex-1 items-center gap-2 border-2 border-slate-700 bg-slate-900 px-3 py-1.5">
                    <Globe className="h-4 w-4 text-sky-400" />
                    <input
                      type="text"
                      value={browserQuery}
                      onChange={(e) => setBrowserQuery(e.target.value)}
                      placeholder="Search the live internet (Wikipedia, GitHub, topics) or enter URL..."
                      className="w-full bg-transparent text-xs text-white focus:outline-none sm:text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={browserLoading}
                    className="inline-flex items-center gap-1.5 border-2 border-sky-300 bg-sky-400 px-4 py-1.5 text-xs font-black text-slate-950 uppercase"
                  >
                    <Search className="h-3.5 w-3.5" />
                    {browserLoading ? "Loading..." : "Search Web"}
                  </button>
                </form>

                {/* Quick Bookmarks Bar */}
                <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 bg-slate-900/60 px-3 py-1.5 text-[11px]">
                  <span className="text-slate-400">Bookmarks:</span>
                  {[
                    { label: "🇩🇿 Algeria", q: "Algeria" },
                    { label: "🎓 USTHB University", q: "USTHB" },
                    { label: "📱 Flutter SDK", q: "Flutter (software)" },
                    { label: "⚡ Next.js", q: "Next.js" },
                    { label: "🧬 Bioinformatics", q: "Bioinformatics" },
                    { label: "💻 Lounes-213 Repos", q: "Lounes-213" },
                  ].map((bm) => (
                    <button
                      key={bm.label}
                      type="button"
                      onClick={() => {
                        setBrowserQuery(bm.q);
                        void runLiveBrowserSearch(bm.q);
                      }}
                      className="border border-slate-700 bg-slate-800 px-2 py-0.5 text-slate-200 hover:border-sky-400 hover:text-sky-300"
                    >
                      {bm.label}
                    </button>
                  ))}
                </div>

                {/* Split View: Search Results List + Live Embedded Web Page */}
                <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
                  <div className="overflow-y-auto border-r border-slate-800 p-3 lg:col-span-5">
                    <div className="mb-2 text-[11px] font-bold text-slate-400 uppercase">
                      Live Internet Results ({browserResults.length})
                    </div>
                    <div className="space-y-2.5">
                      {browserResults.map((r, i) => (
                        <div
                          key={`${r.url}-${i}`}
                          className="border border-slate-800 bg-slate-900/80 p-3 hover:border-sky-500/60"
                        >
                          <div className="text-[10px] font-bold text-sky-400 uppercase">
                            {r.source}
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveIframeUrl(r.url)}
                            className="mt-0.5 text-left text-sm font-black text-white hover:text-sky-300"
                          >
                            {r.title}
                          </button>
                          <p className="mt-1 text-xs leading-relaxed text-slate-300">
                            {r.snippet}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-[11px]">
                            {r.source === "wikipedia.org" ? (
                              <button
                                type="button"
                                onClick={() => setActiveIframeUrl(r.url)}
                                className="font-bold text-emerald-400 hover:underline"
                              >
                                ▶ Preview Inside Screen
                              </button>
                            ) : null}
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-sky-300 hover:underline"
                            >
                              Open Tab <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Embedded Web Reader */}
                  <div className="flex flex-col bg-white lg:col-span-7">
                    <div className="flex items-center justify-between bg-slate-800 px-3 py-1 text-[11px] text-slate-300">
                      <span className="truncate">{activeIframeUrl}</span>
                      <a
                        href={activeIframeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-sky-300 hover:underline"
                      >
                        Open External <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <iframe
                      src={activeIframeUrl}
                      title="In-World Live Web Browser"
                      className="h-full w-full flex-1 border-0"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* All 9 Portfolio Projects Explorer inside the Computer */
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {reels.map((reel, idx) => (
                    <div
                      key={reel.id}
                      className="flex flex-col justify-between border-2 border-slate-700 bg-slate-900 p-3.5 hover:border-emerald-400"
                    >
                      <div>
                        <div className="text-[10px] font-bold text-emerald-400 uppercase">
                          PROJECT #0{idx + 1} · {pick(reel.category, locale)}
                        </div>
                        <h3 className="mt-1 text-base font-black text-white">
                          {pick(reel.title, locale)}
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                          {pick(reel.description, locale)}
                        </p>
                      </div>
                      <div className="mt-3 border-t border-slate-800 pt-2.5">
                        <div className="mb-2 flex flex-wrap gap-1">
                          {reel.languages.map((lang) => (
                            <span
                              key={lang}
                              className="bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-sky-300"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowComputerModal(false);
                            setSelectedNode({
                              id: `project-${reel.id}`,
                              zone: "projects",
                              kind: "project",
                              title: pick(reel.title, locale),
                              subtitle: reel.languages.join(" · "),
                              description: pick(reel.description, locale),
                              tags: [...reel.languages, ...reel.tags],
                              position: new THREE.Vector3(0, 0, 0),
                              reel,
                              actionHref: reel.linkedinUrl ?? reel.instagramUrl,
                              actionLabel: "Open Post / Demo",
                              mesh: new THREE.Object3D(),
                            });
                          }}
                          className="w-full border border-emerald-400 bg-emerald-500/20 py-1.5 text-xs font-black text-emerald-300 uppercase hover:bg-emerald-500 hover:text-slate-950"
                        >
                          ▶ Watch Video Demo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* ====================================================================
          MODAL 3: INTERACTIVE GUIDE COMPANION ("Murshid Lounès")
          ("yjawebni w ga3 ... w ma tktebch kelmat ia")
      ==================================================================== */}
      {showGuideModal ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="flex h-[78vh] w-full max-w-lg flex-col border-4 border-emerald-400 bg-[#090D16] shadow-[10px_10px_0_#000]">
            <div className="flex items-center justify-between border-b-2 border-slate-800 bg-slate-900 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center border border-emerald-400 bg-emerald-500/20 text-base">
                  💬
                </span>
                <div>
                  <h2 className="text-sm font-black text-white uppercase">
                    Murshid Lounès · World Companion
                  </h2>
                  <p className="text-[11px] text-emerald-400">
                    Ask in Darija, Arabic, French, or English
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="flex h-8 w-8 items-center justify-center border border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Conversation History */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {guideMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] border-2 p-3 text-xs leading-relaxed sm:text-sm ${
                      msg.sender === "user"
                        ? "border-emerald-400 bg-emerald-500 text-slate-950 font-bold"
                        : "border-slate-700 bg-slate-900 text-slate-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {guideLoading ? (
                <div className="text-xs font-bold text-emerald-400 animate-pulse">
                  Murshid Lounès is typing...
                </div>
              ) : null}
            </div>

            {/* Quick Suggested Questions */}
            <div className="flex flex-wrap gap-1.5 border-t border-slate-800 bg-slate-950 px-3 py-2">
              {[
                "Wesh huma les projets ta3 Lounès?",
                "Win yaqra Lounès?",
                "Kifach netwasel m3ah?",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setGuideInput(q)}
                  className="border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] text-slate-300 hover:border-emerald-400 hover:text-white"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendGuideMessage}
              className="flex items-center gap-2 border-t-2 border-slate-800 bg-slate-900 p-3"
            >
              <input
                type="text"
                value={guideInput}
                onChange={(e) => setGuideInput(e.target.value)}
                placeholder="Write your question to Murshid Lounès..."
                className="flex-1 border-2 border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none sm:text-sm"
              />
              <button
                type="submit"
                disabled={guideLoading}
                className="inline-flex items-center gap-1.5 border-2 border-emerald-300 bg-emerald-500 px-4 py-2 text-xs font-black text-slate-950 uppercase hover:bg-emerald-400"
              >
                <Send className="h-3.5 w-3.5" />
                Send
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
