import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getLocale, getTranslations } from "next-intl/server"

export default async function LocaleNotFound() {
  const [t, locale] = await Promise.all([
    getTranslations("NotFound"),
    getLocale(),
  ])

  const homeHref = `/${locale}`

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-16 text-center text-white">
        <div className="flex max-w-2xl flex-col items-center justify-center gap-6">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">404</p>
          <h1 className="text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
          <p className="text-base text-white/70 sm:text-lg">{t("description")}</p>
          <Link
            href={homeHref}
            className="rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-medium text-white transition hover:border-white/60 hover:bg-white/20"
          >
            {t("cta")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

