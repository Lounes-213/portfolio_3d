import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type SectionProps = {
  id: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  intro?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
  width?: "content" | "wide";
  blueprint?: boolean;
};

/**
 * Shared section container enforcing consistent rhythm, readable measure,
 * and Pixelify Sans / Silkscreen gaming typographic hierarchy.
 */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  aside,
  children,
  className,
  width = "content",
  blueprint = false,
}: SectionProps) {
  const hasHeader = Boolean(eyebrow ?? title ?? intro);

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={cn(
        "relative py-section",
        blueprint && "blueprint-focus",
        className,
      )}
    >
      <div className={width === "wide" ? "container-wide-page" : "container-page"}>
        {hasHeader && (
          <header className="mb-stack-lg flex flex-col gap-stack-md lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-prose">
              {eyebrow && <p className="eyebrow mb-stack-xs">{eyebrow}</p>}
              {title && (
                <h2
                  id={`${id}-title`}
                  className="font-display text-h2 font-bold tracking-tight text-fg max-w-[24ch] text-balance"
                >
                  {title}
                </h2>
              )}
              {intro && (
                <p className="mt-stack-sm text-lead text-fg-muted">{intro}</p>
              )}
            </div>
            {aside && <div className="shrink-0">{aside}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
