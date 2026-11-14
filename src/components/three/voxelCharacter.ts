"use client";

import * as THREE from "three";

export interface PlayableVoxelCharacter {
  group: THREE.Group;
  head: THREE.Mesh;
  body: THREE.Mesh;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  animate: (isMoving: boolean, elapsedTime: number, isSprinting?: boolean) => void;
  dispose: () => void;
}

export interface VoxelCharacterOptions {
  name?: string;
  flag?: string;
  jacketColor?: string;
  trimColor?: string;
  castShadow?: boolean;
}

/**
 * Builds an articulated Minecraft-style 3D character with swinging limbs and floating nameplate.
 * Used for both the main playable character (Lounès_213 🇩🇿) and fellow online players in the world.
 */
export function createPlayableVoxelCharacter(opts: VoxelCharacterOptions = {}): PlayableVoxelCharacter {
  const group = new THREE.Group();
  const displayName = opts.name ?? "Lounès_213";
  const displayFlag = opts.flag ?? "🇩🇿";
  const jacketHex = opts.jacketColor ?? "#059669";
  const trimHex = opts.trimColor ?? "#34D399";
  const castShadow = opts.castShadow ?? true;

  const skinMat = new THREE.MeshStandardMaterial({ color: "#E5B89B", roughness: 0.7 });
  const hairMat = new THREE.MeshStandardMaterial({ color: "#18181B", roughness: 0.8 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: jacketHex, roughness: 0.55 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: "#111827", roughness: 0.7 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.75 });
  const shoesMat = new THREE.MeshStandardMaterial({ color: "#090D16", roughness: 0.6 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: "#090D16" });
  const emeraldTrimMat = new THREE.MeshStandardMaterial({
    color: trimHex,
    emissive: trimHex,
    emissiveIntensity: 0.35,
  });

  // Legs (pivot at hip y = 0.75)
  const legGeo = new THREE.BoxGeometry(0.26, 0.7, 0.26);
  const shoeGeo = new THREE.BoxGeometry(0.28, 0.14, 0.32);

  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.15, 0.75, 0);
  const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
  leftLegMesh.position.y = -0.35;
  leftLegMesh.castShadow = castShadow;
  const leftShoe = new THREE.Mesh(shoeGeo, shoesMat);
  leftShoe.position.set(0, -0.68, 0.03);
  leftLeg.add(leftLegMesh, leftShoe);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.15, 0.75, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
  rightLegMesh.position.y = -0.35;
  rightLegMesh.castShadow = castShadow;
  const rightShoe = new THREE.Mesh(shoeGeo, shoesMat);
  rightShoe.position.set(0, -0.68, 0.03);
  rightLeg.add(rightLegMesh, rightShoe);

  // Torso (y = 0.75 to 1.55)
  const bodyGeo = new THREE.BoxGeometry(0.62, 0.8, 0.34);
  const body = new THREE.Mesh(bodyGeo, jacketMat);
  body.position.set(0, 1.15, 0);
  body.castShadow = castShadow;

  const innerShirtGeo = new THREE.BoxGeometry(0.26, 0.76, 0.36);
  const innerShirt = new THREE.Mesh(innerShirtGeo, shirtMat);
  innerShirt.position.set(0, 1.15, 0);

  const trimGeo = new THREE.BoxGeometry(0.64, 0.08, 0.36);
  const trim = new THREE.Mesh(trimGeo, emeraldTrimMat);
  trim.position.set(0, 0.82, 0);

  // Arms (pivot at shoulder y = 1.48)
  const armGeo = new THREE.BoxGeometry(0.24, 0.72, 0.24);
  const handGeo = new THREE.BoxGeometry(0.22, 0.16, 0.22);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.44, 1.48, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, jacketMat);
  leftArmMesh.position.y = -0.32;
  leftArmMesh.castShadow = castShadow;
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.y = -0.66;
  leftArm.add(leftArmMesh, leftHand);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.44, 1.48, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, jacketMat);
  rightArmMesh.position.y = -0.32;
  rightArmMesh.castShadow = castShadow;
  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.y = -0.66;
  rightArm.add(rightArmMesh, rightHand);

  // Head (y = 1.55 to 2.2)
  const headGeo = new THREE.BoxGeometry(0.62, 0.62, 0.62);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.set(0, 1.88, 0);
  head.castShadow = castShadow;

  const hairTopGeo = new THREE.BoxGeometry(0.66, 0.18, 0.66);
  const hairTop = new THREE.Mesh(hairTopGeo, hairMat);
  hairTop.position.set(0, 0.26, 0);
  head.add(hairTop);

  const hairBackGeo = new THREE.BoxGeometry(0.66, 0.45, 0.16);
  const hairBack = new THREE.Mesh(hairBackGeo, hairMat);
  hairBack.position.set(0, 0.08, -0.26);
  head.add(hairBack);

  const eyeGeo = new THREE.BoxGeometry(0.1, 0.08, 0.05);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.14, 0.02, 0.31);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.14, 0.02, 0.31);
  head.add(leftEye, rightEye);

  // Floating Nameplate above character head
  const nameCanvas = document.createElement("canvas");
  nameCanvas.width = 320;
  nameCanvas.height = 64;
  const nctx = nameCanvas.getContext("2d")!;
  nctx.fillStyle = "rgba(9, 13, 22, 0.85)";
  nctx.fillRect(0, 0, 320, 64);
  nctx.strokeStyle = trimHex;
  nctx.lineWidth = 4;
  nctx.strokeRect(2, 2, 316, 60);
  nctx.fillStyle = "#F8FAFC";
  nctx.font = "900 22px monospace";
  nctx.textAlign = "center";
  nctx.fillText(`${displayName} ${displayFlag}`.slice(0, 24), 160, 40);

  const nameTex = new THREE.CanvasTexture(nameCanvas);
  nameTex.colorSpace = THREE.SRGBColorSpace;
  const nameSpriteMat = new THREE.SpriteMaterial({ map: nameTex, transparent: true });
  const nameSprite = new THREE.Sprite(nameSpriteMat);
  nameSprite.position.set(0, 2.58, 0);
  nameSprite.scale.set(1.9, 0.38, 1);

  group.add(leftLeg, rightLeg, body, innerShirt, trim, leftArm, rightArm, head, nameSprite);

  const animate = (isMoving: boolean, elapsedTime: number, isSprinting = false) => {
    const speed = isSprinting ? 14 : 9.5;
    const amp = isMoving ? (isSprinting ? 0.85 : 0.6) : 0.04;
    const swing = Math.sin(elapsedTime * speed) * amp;

    leftLeg.rotation.x = swing;
    rightLeg.rotation.x = -swing;
    leftArm.rotation.x = -swing * 0.9;
    rightArm.rotation.x = swing * 0.9;

    if (!isMoving) {
      leftArm.rotation.z = 0.05 + Math.sin(elapsedTime * 2) * 0.03;
      rightArm.rotation.z = -0.05 - Math.sin(elapsedTime * 2) * 0.03;
      head.position.y = 1.88 + Math.sin(elapsedTime * 2.5) * 0.015;
    } else {
      leftArm.rotation.z = 0.05;
      rightArm.rotation.z = -0.05;
      head.position.y = 1.88 + Math.abs(Math.sin(elapsedTime * speed)) * 0.04;
    }
  };

  const dispose = () => {
    nameTex.dispose();
    nameSpriteMat.dispose();
    [
      skinMat,
      hairMat,
      jacketMat,
      shirtMat,
      pantsMat,
      shoesMat,
      eyeMat,
      emeraldTrimMat,
      legGeo,
      shoeGeo,
      bodyGeo,
      innerShirtGeo,
      trimGeo,
      armGeo,
      handGeo,
      headGeo,
      hairTopGeo,
      hairBackGeo,
      eyeGeo,
    ].forEach((r) => r.dispose());
  };

  return {
    group,
    head,
    body,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    animate,
    dispose,
  };
}
