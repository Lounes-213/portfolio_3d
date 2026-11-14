"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  limit,
  onSnapshot,
  serverTimestamp,
  getDocFromServer,
  type Unsubscribe,
} from "firebase/firestore";
import firebaseConfig from "../../../firebase-applet-config.json";

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let connectionTested = false;
export async function testFirestoreConnection(): Promise<void> {
  if (connectionTested || typeof window === "undefined") return;
  connectionTested = true;
  try {
    await getDocFromServer(doc(db, "world_players", "connection_probe"));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export interface FirebasePlayerDoc {
  uid: string;
  name: string;
  color: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  zone: string;
  isMoving: boolean;
  isPublic: boolean;
}

export interface FirebaseBlockDoc {
  id: string;
  ownerId: string;
  x: number;
  y: number;
  z: number;
  type: string;
  isPublic: boolean;
}

export async function signInWithGooglePopup(): Promise<User | null> {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res.user;
  } catch (err) {
    console.warn("Google Sign-In popup closed or blocked:", err);
    return null;
  }
}

export function subscribeToAuth(cb: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, cb);
}

export function subscribeToWorldPlayers(
  onUpdate: (players: FirebasePlayerDoc[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, "world_players"),
    where("isPublic", "==", true),
    limit(30),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: FirebasePlayerDoc[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (d && typeof d.x === "number" && typeof d.z === "number") {
          list.push({
            uid: String(d.uid || docSnap.id),
            name: String(d.name || "Explorer").slice(0, 32),
            color: String(d.color || "#34D399").slice(0, 16),
            x: Number(d.x),
            y: Number(d.y || 0.5),
            z: Number(d.z),
            yaw: Number(d.yaw || 0),
            zone: String(d.zone || "spawn").slice(0, 24),
            isMoving: Boolean(d.isMoving),
            isPublic: true,
          });
        }
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "world_players");
    },
  );
}

export async function publishPlayerStateToFirebase(player: {
  uid: string;
  name: string;
  color: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  zone: string;
  isMoving: boolean;
}): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== player.uid) return;
  const cleanUid = player.uid.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 128);
  const path = `world_players/${cleanUid}`;
  try {
    await setDoc(doc(db, "world_players", cleanUid), {
      uid: cleanUid,
      name: (player.name.trim() || "Explorer").slice(0, 32),
      color: (player.color || "#34D399").slice(0, 16),
      x: Math.max(-100, Math.min(100, Number(player.x.toFixed(2)))),
      y: Math.max(-5, Math.min(50, Number(player.y.toFixed(2)))),
      z: Math.max(-100, Math.min(100, Number(player.z.toFixed(2)))),
      yaw: Math.max(-10, Math.min(10, Number(player.yaw.toFixed(2)))),
      zone: (player.zone || "spawn").slice(0, 24),
      isMoving: Boolean(player.isMoving),
      isPublic: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToWorldBlocks(
  onUpdate: (blocks: FirebaseBlockDoc[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, "world_blocks"),
    where("isPublic", "==", true),
    limit(200),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: FirebaseBlockDoc[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        if (d && typeof d.x === "number" && typeof d.y === "number" && typeof d.z === "number") {
          list.push({
            id: docSnap.id,
            ownerId: String(d.ownerId || ""),
            x: Math.round(Number(d.x)),
            y: Math.round(Number(d.y)),
            z: Math.round(Number(d.z)),
            type: String(d.type || "grass").slice(0, 24),
            isPublic: true,
          });
        }
      });
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, "world_blocks");
    },
  );
}

export async function placeWorldBlockInFirebase(block: {
  x: number;
  y: number;
  z: number;
  type: string;
}): Promise<void> {
  if (!auth.currentUser) return;
  const rx = Math.max(-60, Math.min(60, Math.round(block.x)));
  const ry = Math.max(1, Math.min(30, Math.round(block.y)));
  const rz = Math.max(-60, Math.min(60, Math.round(block.z)));
  const docId = `b_${rx}_${ry}_${rz}`.replace(/-/g, "m");
  const path = `world_blocks/${docId}`;
  try {
    await setDoc(doc(db, "world_blocks", docId), {
      ownerId: auth.currentUser.uid,
      x: rx,
      y: ry,
      z: rz,
      type: block.type.slice(0, 24),
      isPublic: true,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeWorldBlockFromFirebase(
  x: number,
  y: number,
  z: number,
): Promise<void> {
  if (!auth.currentUser) return;
  const rx = Math.round(x);
  const ry = Math.round(y);
  const rz = Math.round(z);
  const docId = `b_${rx}_${ry}_${rz}`.replace(/-/g, "m");
  const path = `world_blocks/${docId}`;
  try {
    await deleteDoc(doc(db, "world_blocks", docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
