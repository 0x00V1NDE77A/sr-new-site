import type { ObjectId } from "mongodb"

export interface BlogPost {
  _id?: ObjectId
  title: string
  slug: string
  content: ContentBlock[]
  excerpt: string
  heroImage?: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  category: string
  tags: string[]
  status: "draft" | "published" | "archived"
  featured: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    socialTitle?: string
    socialDescription?: string
    socialImage?: string
  }
  readingTime: number
  views: number
  translations?: {
    [locale: string]: {
      title?: string
      slug?: string
      excerpt?: string
      heroImage?: string
      content?: ContentBlock[]
      seo?: {
        metaTitle?: string
        metaDescription?: string
        keywords?: string[]
        socialTitle?: string
        socialDescription?: string
        socialImage?: string
      }
    }
  }
}

export interface ContentBlock {
  id: string
  type: "paragraph" | "heading" | "image" | "quote" | "list" | "code"
  content: string
  metadata?: {
    level?: number           // for headings (H1-H4)
    listType?: "ordered" | "unordered"  // for lists
    language?: string        // for code blocks
    alt?: string            // for images
    caption?: string        // for image captions
    alignment?: "left" | "center" | "right"
    fontSize?: string
    fontWeight?: string
  }
}

export interface Category {
  _id?: ObjectId | string
  name: string
  slug: string
  description?: string
  color: string
  postCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  _id?: ObjectId
  name: string
  slug: string
  postCount: number
  createdAt: Date
  updatedAt: Date
}

// Export Blog as an alias for BlogPost for compatibility
export type Blog = BlogPost