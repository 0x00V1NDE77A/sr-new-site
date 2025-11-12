import type { AppLocale } from "@/lib/i18n/config"

export type BlogContentBlock = {
  id: string
  type: "paragraph" | "heading" | "image" | "quote" | "list" | "code"
  content: string
  metadata?: {
    level?: number
    listType?: "ordered" | "unordered"
    alignment?: "left" | "center" | "right"
    fontSize?: string
    fontWeight?: string
    caption?: string
    language?: string
  }
}

export type BlogSEO = {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  socialTitle?: string
  socialDescription?: string
  socialImage?: string
}

export type BlogTranslationInput = {
  title: string
  slug?: string
  excerpt: string
  heroImage?: string
  content: BlogContentBlock[]
  seo: BlogSEO
}

export type AdminBlogPost = {
  _id?: string
  title: string
  slug: string
  content: BlogContentBlock[]
  excerpt: string
  heroImage?: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  publishedAt?: Date | string
  status: "draft" | "published" | "archived"
  featured: boolean
  category: string
  tags: string[]
  seo: BlogSEO
  translations?: Partial<Record<AppLocale, BlogTranslationInput>>
  readingTime?: number
  views?: number
  createdAt?: Date | string
  updatedAt?: Date | string
}


