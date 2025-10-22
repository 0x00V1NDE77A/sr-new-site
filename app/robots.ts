import { MetadataRoute } from 'next'
import { getRobotsTxt } from '@/lib/seo'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sr-redesign-nextjs.vercel.app'
  
  // Get custom robots.txt content from SEO settings
  const customRobotsTxt = await getRobotsTxt()
  
  // If custom robots.txt is provided, parse it
  if (customRobotsTxt && customRobotsTxt.trim()) {
    const lines = customRobotsTxt.split('\n').filter(line => line.trim())
    const rules: MetadataRoute.Robots['rules'] = []
    let currentRule: any = null
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      if (trimmedLine.startsWith('User-agent:')) {
        if (currentRule) {
          rules.push(currentRule)
        }
        currentRule = {
          userAgent: trimmedLine.replace('User-agent:', '').trim(),
          allow: [],
          disallow: []
        }
      } else if (trimmedLine.startsWith('Allow:')) {
        if (currentRule) {
          const path = trimmedLine.replace('Allow:', '').trim()
          if (path) {
            currentRule.allow = currentRule.allow || []
            currentRule.allow.push(path)
          }
        }
      } else if (trimmedLine.startsWith('Disallow:')) {
        if (currentRule) {
          const path = trimmedLine.replace('Disallow:', '').trim()
          if (path) {
            currentRule.disallow = currentRule.disallow || []
            currentRule.disallow.push(path)
          }
        }
      }
    }
    
    if (currentRule) {
      rules.push(currentRule)
    }
    
    if (rules.length > 0) {
      return {
        rules,
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
      }
    }
  }
  
  // Fallback to default robots.txt
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/admin/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
