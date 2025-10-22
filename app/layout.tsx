import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AppProviders } from '@/components/AppProviders'
import { GoogleAnalytics } from '@next/third-parties/google'
import { getCustomBodyCode } from '@/lib/seo'


const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif'
})

// Enhanced static metadata for instant loading - industry standard approach
export const metadata: Metadata = {
  title: {
    default: "SR Holding - Software Development Company | Sofia, Bulgaria",
    template: "%s | SR Holding"
  },
  description: "Leading software development company based in Sofia, Bulgaria, specializing in custom applications, AI solutions, blockchain technology, and modern web platforms. Expert team delivering innovative software solutions worldwide. Available 24/7.",
  keywords: [
    "software development Sofia",
    "web development Bulgaria", 
    "AI solutions Sofia",
    "blockchain technology Bulgaria",
    "custom applications Sofia",
    "mobile app development Bulgaria",
    "cloud solutions Sofia",
    "DevOps services Bulgaria",
    "UI/UX design Sofia",
    "technology consulting Bulgaria",
    "enterprise software Sofia",
    "digital transformation Bulgaria",
    "SR Holding Sofia",
    "software company Bulgaria"
  ],
  authors: [{ name: "SR Holding Team" }],
  creator: "SR Holding",
  publisher: "SR Holding",
  generator: 'Next.js 15',
  applicationName: "SR Holding",
  referrer: "origin-when-cross-origin",
  colorScheme: "dark",
  alternates: {
    canonical: "https://sr-redesign-nextjs.vercel.app",
    languages: {
      'en-US': 'https://sr-redesign-nextjs.vercel.app',
    }
  },
  openGraph: {
    title: "SR Holding - Software Development Company | Sofia, Bulgaria",
    description: "Leading software development company based in Sofia, Bulgaria, specializing in custom applications, AI solutions, blockchain technology, and modern web platforms. Available 24/7.",
    url: "https://sr-redesign-nextjs.vercel.app",
    siteName: "SR Holding",
    images: [
      {
        url: "https://sr-redesign-nextjs.vercel.app/logo.png",
        width: 1200,
        height: 630,
        alt: "SR Holding - Software Development Company | Sofia, Bulgaria",
        type: "image/png"
      }
    ],
    locale: "en_US",
    type: "website",
    countryName: "Bulgaria"
  },
  twitter: {
    card: "summary_large_image",
    title: "SR Holding - Software Development Company | Sofia, Bulgaria",
    description: "Leading software development company based in Sofia, Bulgaria, specializing in custom applications, AI solutions, blockchain technology, and modern web platforms. Available 24/7.",
    images: ["https://sr-redesign-nextjs.vercel.app/logo.png"],
    creator: "@srholding",
    site: "@srholding"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "Software Development Company",
  other: {
    'theme-color': '#000000',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SR Holding',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'application-name': 'SR Holding',
    'msapplication-tooltip': 'SR Holding Software Development',
    'msapplication-starturl': '/',
    'msapplication-navbutton-color': '#000000',
    'msapplication-window': 'width=1024;height=768',
    'msapplication-task': 'name=Homepage;action-uri=/;icon-uri=/favicon.ico',
    'geo.region': 'US',
    'geo.placename': 'United States',
    'geo.position': '39.8283;-98.5795',
    'ICBM': '39.8283, -98.5795',
    'DC.title': 'SR Holding - Software Development Company',
    'DC.creator': 'SR Holding Team',
    'DC.subject': 'Software Development, AI Solutions, Blockchain Technology',
    'DC.description': 'Leading software development company specializing in custom applications, AI solutions, blockchain technology, and modern web platforms.',
    'DC.publisher': 'SR Holding',
    'DC.contributor': 'SR Holding Team',
    'DC.date': new Date().toISOString(),
    'DC.type': 'Text',
    'DC.format': 'text/html',
    'DC.language': 'en',
    'DC.rights': '© 2024 SR Holding. All rights reserved.',
    'DC.coverage': 'Worldwide',
    'DC.relation': 'https://sr-redesign-nextjs.vercel.app',
    'DC.source': 'SR Holding',
    'DC.identifier': 'https://sr-redesign-nextjs.vercel.app',
    'author': 'SR Holding Team',
    'copyright': '© 2024 SR Holding. All rights reserved.',
    'language': 'en',
    'revisit-after': '7 days',
    'rating': 'general',
    'distribution': 'global',
    'target': 'all',
    'audience': 'business, technology, software development',
    'coverage': 'Worldwide',
    'expires': 'never',
    'cache-control': 'public, max-age=31536000',
    'pragma': 'cache',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Get custom body code from SEO settings
  const customBodyCode = await getCustomBodyCode()

  return (
    <html lang="en" className="dark">
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
