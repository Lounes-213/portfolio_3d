"use client";

/**
 * Anthropic Architectural Atmospheric Backdrop
 * Restrained warm ambiance and subtle hairline technical grid.
 * Zero neon slop, zero distracting bouncing shapes.
 */
export function CreativeFloatingBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Warm Anthropic Top Radial Aura */}
      <div className="absolute -top-32 start-1/2 -translate-x-1/2 h-[420px] w-[860px] max-w-full rounded-full bg-accent/6 blur-[120px]" />

      {/* Subtle Warm Secondary Depth on Edge */}
      <div className="absolute top-1/2 end-0 h-[380px] w-[420px] -translate-y-1/2 rounded-full bg-accent/[0.03] blur-[140px]" />

      {/* Fine Editorial Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:32px_32px] opacity-35 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </div>
  );
}
