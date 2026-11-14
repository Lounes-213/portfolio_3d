"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Terminal } from "@/components/icons";
import { profile } from "@/content/profile";
import { pick } from "@/content/schema";
import type { Locale } from "@/lib/i18n/routing";

interface InteractiveTerminalProps {
  locale: Locale;
}

interface CommandEntry {
  id: string;
  command: string;
  fullOutput: string;
  displayedOutput: string;
  isCompleted: boolean;
}

const PREDEFINED_COMMANDS = [
  { id: "whoami", label: "whoami", desc: "Identity & Status" },
  { id: "projects", label: "projects", desc: "Shipped Production Systems" },
  { id: "skills", label: "skills", desc: "Technical Stack" },
  { id: "education", label: "education", desc: "USTHB Academic Degrees" },
  { id: "contact", label: "contact", desc: "Direct Channels" },
  { id: "clear", label: "clear", desc: "Reset Terminal" },
] as const;

export function InteractiveTerminal({ locale }: InteractiveTerminalProps) {
  const [entries, setEntries] = useState<CommandEntry[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [activeCommand, setActiveCommand] = useState<string>("whoami");
  const [isTyping, setIsTyping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCommandOutput = useCallback((cmd: string): string => {
    const trimmed = cmd.trim().toLowerCase();

    switch (trimmed) {
      case "whoami":
        return [
          `• developer : ${profile.name}`,
          `• role      : Software Engineer · Mobile & Full-Stack`,
          `• degree    : ${
            locale === "ar"
              ? "ليسانس إعلام آلي · ماستر بيومعلوماتية (USTHB)"
              : locale === "fr"
              ? "Licence Informatique · Master Bioinformatique (USTHB)"
              : "BSc Computer Science · MSc Bioinformatics (USTHB)"
          }`,
          `• location  : ${pick(profile.location, locale)}`,
          `• status    : Active · Available for high-impact software systems`,
        ].join("\n");

      case "projects":
      case "work":
        return [
          `• LStop                : Real-time public transit & minivan telemetry (Flutter)`,
          `• Aẓar Neɣ (ⵣ)         : Algerian marketplace & classifieds with Amazigh search (Next.js)`,
          `• WebAR Spatial Anchor : Touchless 3D computer vision & hand-tracking interface (Three.js)`,
          `• Maktabat Al-I'tissam : Digital reading & e-learning library platform (Flutter)`,
          `• Golden Goal          : Match tracker, live scores & league manager (Flutter)`,
          `• Kamir Gym            : Fitness membership suite & QR check-in platform (Flutter)`,
          `• CUBE 3               : Smart campus & student services portal (Flutter)`,
          `• Ascent Club          : Scientific & cultural events and member hub (Next.js)`,
          `• Volagro DZ           : Agribusiness & animal nutrition enterprise platform (Next.js)`,
        ].join("\n");

      case "skills":
      case "stack":
        return [
          `• mobile        : Flutter (Expert), Dart, Clean Architecture, BLoC, SQLite, Offline-First`,
          `• frontend/web  : Next.js, React, TypeScript, Tailwind CSS, Three.js, WebGL`,
          `• backend       : Python (FastAPI), Node.js, Java, REST APIs, PostgreSQL, Firebase`,
          `• computation   : Python (NumPy, Pandas), R, MediaPipe Vision Pipelines`,
          `• infrastructure: Cloudflare Workers, Docker, Git, CI/CD Actions, Linux CLI`,
        ].join("\n");

      case "education":
      case "degrees":
        return [
          `• [2024 - Present] Master's (MSc) in Bioinformatics — USTHB, Algiers`,
          `  - Algorithmic modeling, computational biology & data structures`,
          `• [2021 - 2024] Bachelor's Degree (BSc) in Computer Science — USTHB, Algiers`,
          `  - Software Engineering, Algorithms, Operating Systems, Networks`,
        ].join("\n");

      case "contact":
      case "email":
        return [
          `• email    : bensebalounes7@gmail.com`,
          `• linkedin : https://www.linkedin.com/in/lounes-benseba-a07549393/`,
          `• github   : https://github.com/Lounes-213`,
          `• socials  : @lounes.7i (Instagram, TikTok, Facebook)`,
        ].join("\n");

      case "help":
        return [
          `• whoami    : Identity, education & status`,
          `• projects  : Shipped production applications`,
          `• skills    : Technical stack & architecture`,
          `• education : Academic background from USTHB`,
          `• contact   : Email, LinkedIn, GitHub & socials`,
          `• clear     : Clear terminal history`,
        ].join("\n");

      default:
        return `zsh: command not found: "${cmd}". Type 'help' or select an action above.`;
    }
  }, [locale]);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === "clear") {
      setEntries([]);
      setActiveCommand("");
      return;
    }

    const fullOutput = getCommandOutput(trimmed);
    const newId = `${Date.now()}-${Math.random()}`;

    setEntries((prev) => [
      ...prev,
      {
        id: newId,
        command: trimmed,
        fullOutput,
        displayedOutput: "",
        isCompleted: false,
      },
    ]);

    setActiveCommand(trimmed);
    setIsTyping(true);

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    let charIdx = 0;
    typingTimerRef.current = setInterval(() => {
      charIdx += 4;
      if (charIdx >= fullOutput.length) {
        clearInterval(typingTimerRef.current!);
        typingTimerRef.current = null;
        setEntries((prev) =>
          prev.map((e) =>
            e.id === newId
              ? { ...e, displayedOutput: fullOutput, isCompleted: true }
              : e,
          ),
        );
        setIsTyping(false);
      } else {
        const slice = fullOutput.slice(0, charIdx);
        setEntries((prev) =>
          prev.map((e) =>
            e.id === newId ? { ...e, displayedOutput: slice } : e,
          ),
        );
      }
    }, 12);
  }, [getCommandOutput]);

  useEffect(() => {
    executeCommand("whoami");
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [executeCommand]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries, isTyping]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isTyping) return;
    executeCommand(inputVal);
    setInputVal("");
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface/90 shadow-1 backdrop-blur-md">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-surface-sunken/40 px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-border-strong/70" />
            <span className="size-2.5 rounded-full bg-border-strong/70" />
            <span className="size-2.5 rounded-full bg-border-strong/70" />
          </div>
          <div className="ms-2 flex items-center gap-1.5 font-mono text-xs font-medium text-fg-muted">
            <Terminal size={13} className="text-accent" />
            <span>developer-console ~ zsh</span>
          </div>
        </div>

        <span className="font-mono text-[10px] text-fg-subtle">interactive</span>
      </div>

      {/* Predefined Quick Command Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border/50 bg-surface-sunken/20 p-2 sm:p-2.5">
        {PREDEFINED_COMMANDS.map((c) => {
          const isActive = activeCommand.toLowerCase() === c.id;
          return (
            <button
              key={c.id}
              type="button"
              disabled={isTyping}
              onClick={() => executeCommand(c.id)}
              className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors duration-150 ${
                isActive
                  ? "bg-accent text-accent-fg font-semibold shadow-xs"
                  : "border border-border/60 bg-surface text-fg-muted hover:border-border-strong hover:text-fg"
              } disabled:opacity-50`}
            >
              ${c.label}
            </button>
          );
        })}
      </div>

      {/* Terminal Output Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-3.5 sm:p-4 font-mono text-xs text-fg leading-relaxed min-h-[220px] max-h-[340px] space-y-3"
      >
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-1">
            <div className="flex items-center gap-2 text-fg-muted">
              <span className="text-accent font-bold">➜</span>
              <span className="text-fg-subtle">~</span>
              <span className="font-semibold text-fg">{entry.command}</span>
            </div>
            <pre className="whitespace-pre-wrap text-fg-muted font-mono text-[11px] sm:text-xs ps-4">
              {entry.displayedOutput}
              {!entry.isCompleted && (
                <span className="inline-block size-1.5 ms-1 bg-accent animate-pulse" />
              )}
            </pre>
          </div>
        ))}
      </div>

      {/* Terminal Input Row */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-border/60 bg-surface-sunken/30 px-3 py-2 font-mono text-xs"
      >
        <span className="text-accent font-bold">➜</span>
        <span className="text-fg-subtle">~</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="type 'help' or click above..."
          disabled={isTyping}
          className="flex-1 bg-transparent text-fg placeholder:text-fg-subtle/50 outline-none font-mono text-xs"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isTyping}
          className="rounded px-2 py-0.5 text-[10px] font-mono font-medium text-fg-muted hover:text-accent disabled:opacity-30"
        >
          ⏎ Run
        </button>
      </form>
    </div>
  );
}
