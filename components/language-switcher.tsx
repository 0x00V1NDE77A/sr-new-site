"use client"

import { useMemo, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { SUPPORTED_LOCALES, type AppLocale, isAppLocale } from "@/lib/i18n/config"

function buildLocalizedPath(pathname: string, targetLocale: AppLocale) {
  if (!pathname || pathname === "/") {
    return `/${targetLocale}`
  }

  const segments = pathname.split("/")

  if (segments.length > 1 && isAppLocale(segments[1])) {
    segments[1] = targetLocale
  } else {
    return `/${targetLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
  }

  return segments.join("/") || `/${targetLocale}`
}

function appendSearchParams(path: string, searchParams: URLSearchParams) {
  const params = searchParams.toString()
  if (!params) return path
  return `${path}?${params}`
}

export function LanguageSwitcher({ align = "right" }: { align?: "left" | "right" }) {
  const locale = useLocale()
  const t = useTranslations("LanguageSwitcher")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const options = useMemo(
    () =>
      SUPPORTED_LOCALES.map((supportedLocale) => ({
        value: supportedLocale,
        label: t(`locales.${supportedLocale}`),
      })),
    [t]
  )

  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium text-gray-200 ${
        align === "left" ? "justify-start" : "justify-end"
      }`}
    >
      <span className="sr-only">{t("label")}</span>
      <div
        role="group"
        aria-label={t("label")}
        className={`flex items-center rounded-full bg-white/10 p-1 transition ${
          isPending ? "opacity-70" : "opacity-100"
        }`}
      >
        {options.map((option) => {
          const isActive = option.value === locale

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              disabled={isActive || isPending}
              onClick={() => {
                if (isActive) return
                const nextLocale = option.value
                startTransition(() => {
                  const basePath = buildLocalizedPath(pathname ?? "/", nextLocale)
                  const withParams = appendSearchParams(basePath, searchParams)
                  router.replace(withParams)
                })
              }}
              className={`relative flex min-w-[56px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                isActive
                  ? "bg-white text-black shadow-lg shadow-black/30"
                  : "text-white/70 hover:text-white"
              } ${isPending && !isActive ? "pointer-events-none" : ""}`}
            >
              <span>{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

