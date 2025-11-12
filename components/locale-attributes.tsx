"use client"

import { useEffect } from "react"

interface LocaleAttributesProps {
  locale: string
}

const RTL_LOCALES = new Set<string>(['ar', 'he', 'fa'])

export function LocaleAttributes({ locale }: LocaleAttributesProps) {
  useEffect(() => {
    const direction = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
    document.documentElement.dir = direction
    document.documentElement.dataset.locale = locale
  }, [locale])

  return null
}

