import { MetadataRoute } from 'next'

export const runtime = 'nodejs'
export const dynamic = 'force-static'
export const revalidate = 3600

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SR Holding - Software Development Company',
    short_name: 'SR Holding',
    description: 'Leading software development company specializing in custom applications, AI solutions, blockchain technology, and modern web platforms.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    categories: ['business', 'productivity', 'technology'],
    lang: 'en',
    dir: 'ltr',
    scope: '/',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
        purpose: 'any'
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/logo.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'SR Holding Homepage'
      },
      {
        src: '/logo.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'SR Holding Mobile View'
      }
    ],
    shortcuts: [
      {
        name: 'Contact Us',
        short_name: 'Contact',
        description: 'Get in touch with our team',
        url: '/contact',
        icons: [{ src: '/favicon.ico', sizes: '96x96' }]
      },
      {
        name: 'Our Team',
        short_name: 'Team',
        description: 'Meet our talented team',
        url: '/team',
        icons: [{ src: '/favicon.ico', sizes: '96x96' }]
      },
      {
        name: 'Join Our Team',
        short_name: 'Careers',
        description: 'View open positions',
        url: '/join-our-team',
        icons: [{ src: '/favicon.ico', sizes: '96x96' }]
      },
      {
        name: 'Blog',
        short_name: 'Blog',
        description: 'Read our latest articles',
        url: '/blogs',
        icons: [{ src: '/favicon.ico', sizes: '96x96' }]
      }
    ],
    related_applications: [],
    prefer_related_applications: false
  }
}
