"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Timeline } from "@/components/ui/timeline";

type TimelineEntryTranslation = {
  title: string;
  paragraphs?: string[];
  highlights?: string[];
  images?: Array<{
    src?: string;
    alt: string;
  }>;
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2134&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
] as const;

export function TimelineDemo() {
  const t = useTranslations("About.timeline");
  const entries = t.raw("entries") as TimelineEntryTranslation[];

  const data = entries.map((entry) => ({
    title: entry.title,
    content: (
      <div>
        {entry.paragraphs?.map((paragraph, idx) => (
          <p
            key={`${entry.title}-paragraph-${idx}`}
            className={`${idx === (entry.paragraphs?.length ?? 0) - 1 ? "mb-4" : "mb-8"} text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200`}
          >
            {paragraph}
          </p>
        ))}

        {entry.highlights && entry.highlights.length > 0 && (
          <div className="mb-8 space-y-2">
            {entry.highlights.map((highlight, idx) => (
              <div
                key={`${entry.title}-highlight-${idx}`}
                className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300"
              >
                {highlight}
              </div>
            ))}
          </div>
        )}

        {entry.images && entry.images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {entry.images.map((image, idx) => (
              <Image
                key={`${entry.title}-image-${idx}`}
                src={image.src ?? FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                alt={image.alt}
                width={500}
                height={500}
                className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
              />
            ))}
          </div>
        )}
      </div>
    ),
  }));

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} title={t("title")} subtitle={t("subtitle")} />
    </div>
  );
}
