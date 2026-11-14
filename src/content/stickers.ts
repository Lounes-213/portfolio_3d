export const STICKER_LIST = [
  "/stickers/anti-slop.svg",
  "/stickers/open-to-work-badge.svg",
  "/stickers/kotlin-dev.svg",
  "/stickers/cloudflare-edge.svg",
  "/stickers/badge-starburst.svg",
  "/stickers/bubble-talk.svg",
  "/stickers/shield-hexagon.svg",
  "/stickers/vliegensvlug-speed.svg",
  "/stickers/flutter-architect.svg",
  "/stickers/lb-seal.svg",
  "/stickers/fire-prod.svg",
  "/stickers/fullstack-next.svg",
] as const;

export type StickerPath = (typeof STICKER_LIST)[number];
