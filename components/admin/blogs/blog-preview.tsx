"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, Clock, Tag } from "lucide-react"

interface BlogPost {
  title: string
  slug: string
  content: any[]
  excerpt: string
  heroImage?: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  publishedAt?: Date
  status: "draft" | "published" | "archived"
  featured: boolean
  category: string
  tags: string[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    socialTitle?: string
    socialDescription?: string
    socialImage?: string
  }
}

interface BlogPreviewProps {
  blogPost: BlogPost
}

export function BlogPreview({ blogPost }: BlogPreviewProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not published"
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getReadingTime = (content: any[]) => {
    const wordsPerMinute = 200
    const wordCount = content
      .filter((block: any) => block.type === "paragraph")
      .reduce((count: number, block: any) => count + (block.content || "").split(/\s+/).length, 0)
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return readingTime
  }

  const renderContent = (content: any[]) => {
    if (!content || content.length === 0) {
      return (
        <div className="py-12 text-center text-muted-foreground">
          <p>Start writing your content to see the preview...</p>
        </div>
      )
    }

    return (
      <div className="prose prose-lg max-w-none">
        {content.map((block, index) => {
          switch (block.type) {
            case "heading":
              const level = block.metadata?.level || 2
              const headingClass = level === 1 ? "mt-8 mb-6 text-4xl font-bold text-foreground" :
                                  level === 2 ? "mt-6 mb-4 text-3xl font-bold text-foreground" :
                                  level === 3 ? "mt-5 mb-3 text-2xl font-bold text-foreground" :
                                  "mt-4 mb-2 text-xl font-bold text-foreground"
              
              if (level === 1) {
                return <h1 key={index} className={headingClass}>{block.content}</h1>
              } else if (level === 2) {
                return <h2 key={index} className={headingClass}>{block.content}</h2>
              } else if (level === 3) {
                return <h3 key={index} className={headingClass}>{block.content}</h3>
              } else {
                return <h4 key={index} className={headingClass}>{block.content}</h4>
              }
            case "paragraph":
              return (
                <p key={index} className="mb-4 leading-relaxed text-foreground text-balance">
                  {block.content}
                </p>
              )
            case "quote":
              return (
                <blockquote
                  key={index}
                  className="pl-6 my-6 text-lg italic border-l-4 border-accent text-muted-foreground"
                >
                  {block.content}
                </blockquote>
              )
            case "code":
              return (
                <pre key={index} className="p-4 my-6 overflow-x-auto rounded-lg bg-muted">
                  <code className="font-mono text-sm">{block.content}</code>
                </pre>
              )
            case "image":
              return (
                <div key={index} className="my-6">
                  <img
                    src={block.content}
                    alt={block.metadata?.caption || "Blog image"}
                    className="w-full rounded-lg"
                  />
                  {block.metadata?.caption && (
                    <p className="mt-2 text-sm text-center text-muted-foreground">
                      {block.metadata.caption}
                    </p>
                  )}
                </div>
              )
            case "list":
              const ListTag = block.metadata?.listType === "ordered" ? "ol" : "ul"
              const listItems = block.content.split("\n").filter((item: string) => item.trim())
              return (
                <ListTag key={index} className="my-4 ml-6">
                  {listItems.map((item: string, itemIndex: number) => (
                    <li key={itemIndex} className="mb-2">
                      {item.replace(/^[•\-\*]\s*/, "")}
                    </li>
                  ))}
                </ListTag>
              )
            default:
              return (
                <p key={index} className="mb-4 leading-relaxed text-foreground text-balance">
                  {block.content}
                </p>
              )
          }
        })}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Preview Header */}
      <div className="p-4 mb-8 border rounded-lg bg-accent/10 border-accent/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          <span className="text-sm font-medium text-accent">Live Preview</span>
        </div>
        <p className="text-sm text-muted-foreground">This is how your blog post will appear to readers</p>
      </div>

      {/* Blog Post Preview */}
      <article className="border rounded-lg shadow-sm bg-card">
        {/* Hero Image */}
        {blogPost.heroImage && (
          <div className="w-full overflow-hidden rounded-t-lg aspect-video">
            <img
              src={blogPost.heroImage || "/placeholder.svg?height=400&width=800&query=blog hero image"}
              alt={blogPost.title || "Blog post hero image"}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <div className="p-8">
          {/* Status and Featured Badge */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant={blogPost.status === "published" ? "default" : "secondary"}>
              {blogPost.status === "published" ? "Published" : "Draft"}
            </Badge>
            {blogPost.featured && (
              <Badge variant="outline" className="border-accent text-accent">
                Featured
              </Badge>
            )}
          </div>

          {/* Category */}
          {blogPost.category && (
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {blogPost.category}
                </Badge>
              </div>
            </div>
          )}

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground text-balance">
            {blogPost.title || "Untitled Blog Post"}
          </h1>

          {/* Excerpt */}
          {blogPost.excerpt && (
            <p className="mb-6 text-xl leading-relaxed text-muted-foreground text-pretty">{blogPost.excerpt}</p>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-6 pb-6 mb-8 border-b">
            {/* Author */}
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/author-avatar.png" />
                <AvatarFallback>
                  <User className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{blogPost.author.name || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>

            {/* Published Date */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{formatDate(blogPost.publishedAt)}</span>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{getReadingTime(blogPost.content)} min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8">{renderContent(blogPost.content)}</div>

          {/* Tags */}
          {blogPost.tags.length > 0 && (
            <div className="pt-6 border-t">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* SEO Preview */}
      <Card className="p-6 mt-8">
        <h3 className="mb-4 text-lg font-semibold">SEO Preview</h3>
        <div className="space-y-4">
          {/* Google Search Result Preview */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Google Search Result</h4>
            <div className="space-y-1">
              <div className="text-lg text-blue-600 cursor-pointer hover:underline">
                {blogPost.seo.metaTitle || blogPost.title || "Untitled Blog Post"}
              </div>
              <div className="text-sm text-green-700">yoursite.com/blog/{blogPost.slug || "untitled-post"}</div>
              <div className="text-sm text-gray-600">
                {blogPost.seo.metaDescription || blogPost.excerpt || "No description available"}
              </div>
            </div>
          </div>

          {/* Social Media Preview */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Social Media Preview</h4>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-24 h-16 overflow-hidden rounded bg-muted">
                <img
                  src={
                    blogPost.seo.socialImage ||
                    blogPost.heroImage ||
                    "/placeholder.svg?height=64&width=96&query=social preview"
                  }
                  alt="Social preview"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {blogPost.seo.socialTitle || blogPost.title || "Untitled Blog Post"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {blogPost.seo.socialDescription || blogPost.excerpt || "No description available"}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">yoursite.com</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
