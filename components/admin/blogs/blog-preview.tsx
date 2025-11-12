"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, User, Clock, Tag } from "lucide-react"
import type { AdminBlogPost, BlogContentBlock } from "@/types/blog"
import type { AppLocale } from "@/lib/i18n/config"

interface BlogPreviewProps {
  blogPost: AdminBlogPost
  locale?: AppLocale
}

const localePreviewLabel: Record<AppLocale, string> = {
  en: "English preview",
  bg: "Bulgarian preview",
}

function safeFormatDate(date?: string | Date) {
  if (!date) return "Not published"
  const resolved = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(resolved.getTime())) return "Not published"
  return resolved.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function estimateReadingTime(content: BlogContentBlock[]) {
  const wordsPerMinute = 200
  const wordCount = content
    .filter((block) => block.type === "paragraph")
    .reduce(
      (count, block) =>
        count + (typeof block.content === "string" ? block.content.split(/\s+/).length : 0),
      0,
    )
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

function renderContent(content: BlogContentBlock[]) {
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
          case "heading": {
            const level = block.metadata?.level || 2
            const headingClass =
              level === 1
                ? "mt-8 mb-6 text-4xl font-bold text-foreground"
                : level === 2
                  ? "mt-6 mb-4 text-3xl font-bold text-foreground"
                  : level === 3
                    ? "mt-5 mb-3 text-2xl font-bold text-foreground"
                    : "mt-4 mb-2 text-xl font-bold text-foreground"

            const HeadingTag = `h${Math.min(level, 4)}` as keyof JSX.IntrinsicElements
            return (
              <HeadingTag key={index} className={headingClass}>
                {block.content}
              </HeadingTag>
            )
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
                className="my-6 border-l-4 border-accent pl-6 text-lg italic text-muted-foreground"
              >
                {block.content}
              </blockquote>
            )
          case "code":
            return (
              <pre key={index} className="my-6 overflow-x-auto rounded-lg bg-muted p-4">
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
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    {block.metadata.caption}
                  </p>
                )}
              </div>
            )
          case "list": {
            const ListTag = (block.metadata?.listType === "ordered" ? "ol" : "ul") as "ol" | "ul"
            const listItems = (block.content || "")
              .split("\n")
              .map((item: string) => item.trim())
              .filter(Boolean)

            return (
              <ListTag key={index} className="my-4 ml-6">
                {listItems.map((item, idx) => (
                  <li key={`${item}-${idx}`} className="mb-2">
                    {item.replace(/^[•\-\*]\s*/, "")}
                  </li>
                ))}
              </ListTag>
            )
          }
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

export function BlogPreview({ blogPost, locale }: BlogPreviewProps) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 rounded-lg border border-accent/20 bg-accent/10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="text-sm font-medium text-accent">Live Preview</span>
        </div>
        <p className="text-sm text-muted-foreground">
          This is how your blog post will appear to readers.
        </p>
        {locale && (
          <p className="text-xs text-muted-foreground/70">{localePreviewLabel[locale]}</p>
        )}
      </div>

      <article className="rounded-lg border bg-card shadow-sm">
        {blogPost.heroImage && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img
              src={blogPost.heroImage}
              alt={blogPost.title || "Blog post hero image"}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant={blogPost.status === "published" ? "default" : "secondary"}>
              {blogPost.status === "published" ? "Published" : "Draft"}
            </Badge>
            {blogPost.featured && (
              <Badge variant="outline" className="border-accent text-accent">
                Featured
              </Badge>
            )}
          </div>

          {blogPost.category && (
            <div className="mb-4 flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="text-xs">
                {blogPost.category}
              </Badge>
            </div>
          )}

          <h1 className="text-balance mb-4 text-4xl font-bold leading-tight text-foreground">
            {blogPost.title || "Untitled Blog Post"}
          </h1>

          {blogPost.excerpt && (
            <p className="text-pretty mb-6 text-xl leading-relaxed text-muted-foreground">
              {blogPost.excerpt}
            </p>
          )}

          <div className="mb-8 flex items-center gap-6 border-b pb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={blogPost.author.avatar} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{blogPost.author.name || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{safeFormatDate(blogPost.publishedAt)}</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{estimateReadingTime(blogPost.content)} min read</span>
            </div>
          </div>

          <div className="mb-8">{renderContent(blogPost.content)}</div>

          {blogPost.tags?.length > 0 && (
            <div className="border-t pt-6">
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

      <Card className="mt-8 p-6">
        <h3 className="mb-4 text-lg font-semibold">SEO Preview</h3>
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Google Search Result
            </h4>
            <div className="space-y-1">
              <div className="cursor-pointer text-lg text-blue-600 hover:underline">
                {blogPost.seo.metaTitle || blogPost.title || "Untitled Blog Post"}
              </div>
              <div className="text-sm text-green-700">
                yoursite.com/blog/{blogPost.slug || "untitled-post"}
              </div>
              <div className="text-sm text-gray-600">
                {blogPost.seo.metaDescription || blogPost.excerpt || "No description available"}
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
              Social Media Preview
            </h4>
            <div className="flex gap-4">
              <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-muted">
                <img
                  src={
                    blogPost.seo.socialImage ||
                    blogPost.heroImage ||
                    "/placeholder.svg?height=64&width=96&query=social preview"
                  }
                  alt="Social preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">
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


