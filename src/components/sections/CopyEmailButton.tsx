"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "@/components/icons";
import { cn } from "@/lib/utils/cn";

export function CopyEmailButton({
  email,
  className,
}: {
  email: string;
  className?: string;
}) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "inline-flex items-center gap-2 rounded-[var(--radius-control)] border-2 border-border-strong bg-surface px-5 py-2.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-fg",
          "shadow-[3px_3px_0px_#05070B] hover:border-accent hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all select-none",
          className,
        )}
      >
        {copied ? (
          <Check size={16} className="text-accent-text" />
        ) : (
          <Copy size={16} />
        )}
        <span>{copied ? t("emailCopied") : t("copyEmail")}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t("emailCopied") : ""}
      </span>
    </>
  );
}
