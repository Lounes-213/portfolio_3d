"use client";

/**
 * Procedural Web Audio synthesizer for Minecraft-style voxel sound effects:
 * - Realistic crunchy grass/stone footsteps (white-noise crunch + low woody thud)
 * - Block place (wood/stone click)
 * - Block break (crunchy low pop)
 * - Portal / zone enter (emerald chime)
 * - UI click (8-bit blip)
 */

class VoxelAudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private noiseBuffer: AudioBuffer | null = null;

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): void {
    const ctx = this.getContext();
    if (ctx && ctx.state === "suspended") {
      void ctx.resume().catch(() => {});
    }
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer && this.noiseBuffer.sampleRate === ctx.sampleRate) {
      return this.noiseBuffer;
    }
    const duration = 0.12;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Exponentially decaying crunchy noise envelope
      const decay = Math.pow(1 - i / bufferSize, 1.8);
      output[i] = (Math.random() * 2 - 1) * decay;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  public playFootstep(stepIndex = 0, surface: "grass" | "stone" | "wood" = "grass"): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Crunchy surface noise burst (authentic Minecraft grass/stone step texture)
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = this.getNoiseBuffer(ctx);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    const baseFreq =
      surface === "stone" ? 1100 : surface === "wood" ? 780 : 1450;
    const variation = (stepIndex % 2 === 0 ? 1 : 0.88) * (0.94 + Math.random() * 0.12);
    filter.frequency.setValueAtTime(baseFreq * variation, now);
    filter.Q.setValueAtTime(surface === "grass" ? 2.1 : 3.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.14, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.002, now + 0.085);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.09);

    // 2. Subtle low body thud so footsteps feel grounded and tactile
    const osc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    osc.type = "triangle";
    const thudPitch = (stepIndex % 2 === 0 ? 118 : 104) * variation;
    osc.frequency.setValueAtTime(thudPitch, now);
    osc.frequency.exponentialRampToValueAtTime(46, now + 0.065);

    thudGain.gain.setValueAtTime(0.11, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(thudGain);
    thudGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.072);
  }

  public playBlockPlace(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playBlockBreak(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Crunchy break noise + low drop
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = this.getNoiseBuffer(ctx);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.16, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.002, now + 0.11);
    noiseSource.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.11);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(85, now + 0.12);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playAchievement(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      const start = ctx.currentTime + idx * 0.07;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.22);
    });
  }

  public playClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(680, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }
}

export const voxelAudio = new VoxelAudioEngine();

export const playBlockBreak = () => voxelAudio.playBlockBreak();
export const playSlotSelect = () => voxelAudio.playClick();
export const playXpChime = () => voxelAudio.playAchievement();

