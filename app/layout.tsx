import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'
import { getCustomBodyCode } from '@/lib/seo'
import { AppProviders } from '@/components/AppProviders'


const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif'
})

export const metadata: Metadata = {
  title: {
    default: "SR Holding",
    template: "%s | SR Holding",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sr-redesign-nextjs.vercel.app'),
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get custom body code from SEO settings
  const customBodyCode = await getCustomBodyCode()

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Performance SEO - Preload critical resources */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/api/faqs" as="fetch" crossOrigin="anonymous" />
        
        {/* Prefetch important pages */}
        <link rel="prefetch" href="/about" />
        <link rel="prefetch" href="/contact" />
        <link rel="prefetch" href="/team" />
        <link rel="prefetch" href="/blogs" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//vercel.com" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/logo.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/logo.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        <style>{`
html {
  font-family: ${playfair.style.fontFamily};
  --font-serif: ${playfair.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className={`${playfair.variable}`}>
        <AppProviders>
          {children}
        </AppProviders>
        <GoogleAnalytics gaId="G-RGRRZB1TMW" />
        {customBodyCode && (
          <div dangerouslySetInnerHTML={{ __html: customBodyCode }} />
        )}
      </body>
    </html>
  )
}
