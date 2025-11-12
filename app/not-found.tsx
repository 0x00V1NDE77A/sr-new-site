import Link from "next/link"
import { DEFAULT_LOCALE } from "@/lib/i18n/config"

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <p className="text-sm uppercase tracking-[0.4em] text-white/60">404</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">
        We couldn&apos;t find the page you were looking for.
      </p>
      <Link
        href={`/${DEFAULT_LOCALE}`}
        className="mt-8 rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-medium text-white transition hover:border-white/60 hover:bg-white/20"
      >
        Return home
      </Link>
    </div>
  )
}

