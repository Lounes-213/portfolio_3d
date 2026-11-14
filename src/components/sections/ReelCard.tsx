"use client";

import { useEffect, useRef, useState } from "react";
import {
  External,
  Instagram,
  LinkedIn,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "@/components/icons";
import type { ReelProject } from "@/content/reels";
import { pick } from "@/content/schema";
import type { Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

type ReelCardProps = {
  project: ReelProject;
  locale: Locale;
  tWatch: string;
  tMute: string;
  tUnmute: string;
  tPlay: string;
  tPause: string;
  tViewLinkedIn?: string;
  staggerClass?: string;
};

/**
 * Beveled Voxel Handheld Chassis card for live project video demos.
 * Zero pill badge sandwiches; clean unboxed metadata delimited by interpuncts.
 */
export function ReelCard({
  project,
  locale,
  tWatch,
  tMute,
  tUnmute,
  tPlay,
  tPause,
  tViewLinkedIn = "LinkedIn",
  staggerClass = "",
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [userClickedPlay, setUserClickedPlay] = useState(false);
  const [progress, setProgress] = useState(0);

  const title = pick(project.title, locale);
  const category = pick(project.category, locale);
  const description = pick(project.description, locale);

  useEffect(() => {
    if (!isPlaying) return;
    const handleScroll = () => {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && isPlaying) {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [isPlaying]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      setUserClickedPlay(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setUserClickedPlay(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      setUserClickedPlay(true);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!userClickedPlay && videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  };

  return (
    <article
      ref={cardRef}
      className={cn(
        "group relative flex flex-col items-center transition-transform duration-200 max-w-md mx-auto w-full",
        staggerClass,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Chamfered Voxel Handheld Viewport Chassis */}
      <div className="relative w-full max-w-[330px] sm:max-w-[360px] p-2.5 rounded-[8px] bg-surface-raised border-2 border-border-strong shadow-[6px_6px_0px_#05070B] transition-all duration-200 group-hover:-translate-y-1.5 group-hover:border-[#34D399]">
        {/* Top Console Status Strip */}
        <div className="flex items-center justify-between px-2 pb-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          <span className="truncate font-bold text-fg-muted">
            {project.languages.slice(0, 3).join(" · ")}
          </span>
          {project.featured && (
            <span className="text-[#FBBF24] font-bold shrink-0">★ Featured</span>
          )}
        </div>

        {/* Video Viewport */}
        <div
          className="relative aspect-[9/17.5] w-full cursor-pointer overflow-hidden rounded-[4px] bg-[#080B10] border-2 border-border-strong"
          onClick={() => togglePlay()}
        >
          <video
            ref={videoRef}
            src={project.videoSrc}
            poster={project.posterSrc}
            playsInline
            loop
            muted={isMuted}
            preload="metadata"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-102"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25 opacity-60 group-hover:opacity-25 transition-opacity" />

          {/* Center Play/Pause Beveled Trigger */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none z-20",
              isPlaying && !isHovered ? "opacity-0" : "opacity-100",
            )}
          >
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? tPause : tPlay}
              className="pointer-events-auto grid size-12 place-items-center rounded-[var(--radius-control)] bg-[#121722] text-[#34D399] border-2 border-[#34D399] shadow-[3px_3px_0px_#05070B] transition-transform duration-150 hover:scale-105 active:translate-x-[2px] active:translate-y-[2px]"
            >
              {isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} className="translate-x-0.5" />
              )}
            </button>
          </div>

          {/* Bottom Console Control Bar & Emerald XP Timeline */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col z-20">
            <div className="w-full h-1.5 bg-[#121722]">
              <div
                className="h-full bg-[#34D399] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between px-3 py-2 bg-[#0B0E14]/95">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? tUnmute : tMute}
                className="grid size-7 place-items-center rounded-[2px] bg-[#181F2D] text-white border border-[#263144] hover:border-[#34D399] transition-colors"
              >
                {isMuted ? (
                  <VolumeX size={13} />
                ) : (
                  <Volume2 size={13} className="text-[#34D399]" />
                )}
              </button>

              <span className="font-mono text-[10px] text-[#A5B1C2] uppercase tracking-wider">
                {isPlaying ? "Playing" : "Preview"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Unboxed Clean Typography & Action Links Below Chassis */}
      <div className="mt-5 w-full flex flex-col text-center sm:text-start px-2">
        <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight text-fg">
          {title}
        </h3>

        <p className="mt-1 font-mono text-xs font-bold uppercase tracking-wider text-accent-text">
          {category}
        </p>

        <p className="mt-2 text-sm text-fg-muted line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          {project.linkedinUrl && (
            <a
              href={project.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border-2 border-border-strong bg-[#22D3EE] text-[#051B24] px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#05070B] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <LinkedIn size={13} />
              <span>{tViewLinkedIn}</span>
              <External size={11} className="opacity-75" />
            </a>
          )}

          {project.instagramUrl && (
            <a
              href={project.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-control)] border-2 border-border-strong bg-surface text-fg px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#05070B] hover:border-[#FBBF24] hover:text-[#FBBF24] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <Instagram size={13} />
              <span>{tWatch}</span>
              <External size={11} className="opacity-75" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
