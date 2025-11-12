"use client"

import { useFormatter, useLocale } from "next-intl"

type DateInput = string | number | Date | undefined | null

function safeParseDate(input: DateInput) {
  if (input == null) return null

  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input
  }

  const normalized = typeof input === "string" ? input.trim() : String(input)
  if (!normalized) return null

  const isoMatch = /^\d{4}-\d{2}-\d{2}/
  if (isoMatch.test(normalized)) {
    const parsedIso = new globalThis.Date(normalized)
    if (!Number.isNaN(parsedIso.getTime())) {
      return parsedIso
    }
  }

  const fallback = new globalThis.Date(normalized)
  if (!Number.isNaN(fallback.getTime())) {
    return fallback
  }

  return null
}

export default function FormattedDate({ dateString }: { dateString: DateInput }) {
  const locale = useLocale()
  const formatter = useFormatter()

  const parsedDate = safeParseDate(dateString)

  if (!parsedDate) {
    return <time dateTime={String(dateString ?? "")}>{String(dateString ?? "")}</time>
  }

  const formattedDate = formatter.dateTime(parsedDate, {
    dateStyle: "long",
    timeZone: "UTC",
  })

  return (
    <time dateTime={parsedDate.toISOString()} lang={locale}>
      {formattedDate}
    </time>
  )
}
