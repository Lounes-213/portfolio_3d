import { NextRequest, NextResponse } from "next/server";

export interface OnlinePlayerState {
  id: string;
  name: string;
  flag: string;
  color: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  zone: string;
  isMoving: boolean;
  updatedAt: number;
}

export interface PlacedWorldBlock {
  id: string;
  x: number;
  y: number;
  z: number;
  type: string;
  author: string;
}

interface WorldServerState {
  players: Map<string, OnlinePlayerState>;
  blocks: PlacedWorldBlock[];
}

declare global {
  var __LOUNES_WORLD_STATE__: WorldServerState | undefined;
}

function getWorldState(): WorldServerState {
  if (!globalThis.__LOUNES_WORLD_STATE__) {
    globalThis.__LOUNES_WORLD_STATE__ = {
      players: new Map<string, OnlinePlayerState>(),
      blocks: [],
    };
  }
  return globalThis.__LOUNES_WORLD_STATE__;
}

function pruneStalePlayers(state: WorldServerState) {
  const cutoff = Date.now() - 25_000;
  state.players.forEach((p, id) => {
    if (p.updatedAt < cutoff) {
      state.players.delete(id);
    }
  });
}

export async function GET() {
  const state = getWorldState();
  pruneStalePlayers(state);

  return NextResponse.json({
    players: Array.from(state.players.values()),
    blocks: state.blocks.slice(-200),
    serverTime: Date.now(),
  });
}

export async function POST(req: NextRequest) {
  const state = getWorldState();
  pruneStalePlayers(state);

  try {
    const body = await req.json();
    const action = body?.action;

    if (action === "heartbeat" && body.player?.id) {
      const p = body.player;
      state.players.set(String(p.id), {
        id: String(p.id).slice(0, 36),
        name: String(p.name || "Explorer").slice(0, 20),
        flag: String(p.flag || "🇩🇿").slice(0, 8),
        color: String(p.color || "#34D399").slice(0, 16),
        x: Number(p.x) || 0,
        y: Number(p.y) || 0.5,
        z: Number(p.z) || 0,
        yaw: Number(p.yaw) || 0,
        zone: String(p.zone || "spawn").slice(0, 20),
        isMoving: Boolean(p.isMoving),
        updatedAt: Date.now(),
      });
    } else if (action === "place_block" && body.block) {
      const b = body.block;
      const bx = Math.round(Number(b.x) || 0);
      const by = Math.round(Number(b.y) || 1);
      const bz = Math.round(Number(b.z) || 0);
      const id = `${bx},${by},${bz}`;
      if (
        by >= 1 &&
        by <= 20 &&
        Math.abs(bx) <= 48 &&
        Math.abs(bz) <= 48 &&
        !state.blocks.some((existing) => existing.id === id)
      ) {
        state.blocks.push({
          id,
          x: bx,
          y: by,
          z: bz,
          type: String(b.type || "emerald").slice(0, 24),
          author: String(b.author || "Explorer").slice(0, 20),
        });
      }
    } else if (action === "remove_block" && body.coord) {
      const bx = Math.round(Number(body.coord.x) || 0);
      const by = Math.round(Number(body.coord.y) || 1);
      const bz = Math.round(Number(body.coord.z) || 0);
      const id = `${bx},${by},${bz}`;
      state.blocks = state.blocks.filter((b) => b.id !== id);
    }

    return NextResponse.json({
      players: Array.from(state.players.values()),
      blocks: state.blocks.slice(-200),
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 },
    );
  }
}
