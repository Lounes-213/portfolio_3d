"use client";

import Image from "next/image";
import { useState } from "react";

type HeroPortraitProps = {
  src?: string;
  alt: string;
  initials: string;
};

/**
 * Beveled Minecraft-style avatar frame with strict broken-image resilience.
 */
export function HeroPortrait({ src, alt, initials }: HeroPortraitProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative size-16 sm:size-20 rounded-[var(--radius-card)] border-2 border-[#34D399] bg-[#121722] p-1 shadow-[3px_3px_0px_#05070B] shrink-0">
      <div className="relative size-full rounded-[2px] overflow-hidden bg-[#181F2D]">
        {src && !failed ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority
            referrerPolicy="no-referrer"
            sizes="80px"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="size-full bg-[#10B981] flex items-center justify-center font-mono text-lg font-bold text-[#04291E]">
            {initials}
          </div>
        )}
      </div>
    </div>
  );
}
