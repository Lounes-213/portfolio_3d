import {
  IBM_Plex_Sans_Arabic,
  Pixelify_Sans,
  Plus_Jakarta_Sans,
  Silkscreen,
} from "next/font/google";

/**
 * Minecraft-Inspired 3D Gaming Typography Stack (2+1 Rule):
 * - Display: Pixelify Sans — sharp, blocky voxel-inspired display face with modern legibility.
 * - Body: Plus Jakarta Sans — clean, high-contrast geometric sans for readable copy.
 * - Mono / HUD: Silkscreen — crisp pixel-grid monospace for XP levels, coordinates, and tabs.
 * - Arabic: IBM Plex Sans Arabic — crisp modern Arabic face for RTL parity.
 */

export const fontDisplay = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-tech-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

export const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-tech-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: true,
});

export const fontMono = Silkscreen({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "700"],
  preload: true,
});

export const fontArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const fontVariables = [
  fontDisplay.variable,
  fontSans.variable,
  fontMono.variable,
  fontArabic.variable,
].join(" ");
