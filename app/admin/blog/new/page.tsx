"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CustomSwitch } from "@/components/ui/custom-switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogEditor } from "@/components/admin/blogs/blog-editor"
import { BlogPreview } from "@/components/admin/blogs/blog-preview"
import { SEOPanel } from "@/components/admin/blogs/seo-panel"
import { MediaUpload } from "@/components/admin/blogs/media-upload"
import { TagsInput } from "@/components/admin/blogs/tags-input"
import { CategorySelector } from "@/components/admin/blogs/category-selector"
import { useBlogApi } from "@/lib/hooks/use-blog-api"
import {
  Save,
  Eye,
  Globe,
  Settings,
  ImageIcon,
  Type,
  Calendar,
  User,
  Loader2,
  Info,
} from "lucide-react"
import { toast } from "sonner"
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, type AppLocale } from "@/lib/i18n/config"
import type { AdminBlogPost, BlogContentBlock, BlogTranslationInput, BlogSEO } from "@/types/blog"

const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  bg: "Bulgarian",
}

function createContentBlockId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

function createEmptyContent(): BlogContentBlock[] {
  return [
    {
      id: createContentBlockId(),
      type: "paragraph",
      content: "",
      metadata: {},
    },
  ]
}

function createEmptyTranslation(): BlogTranslationInput {
  return {
    title: "",
    slug: "",
    excerpt: "",
    heroImage: "",
    content: createEmptyContent(),
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
  }
}

function buildInitialTranslations() {
  return SUPPORTED_LOCALES.reduce<Partial<Record<AppLocale, BlogTranslationInput>>>(
    (acc, locale) => {
      const typed = locale as AppLocale
      if (typed === DEFAULT_LOCALE) return acc
      acc[typed] = createEmptyTranslation()
      return acc
    },
    {},
  )
}

function hasTranslationData(translation: BlogTranslationInput) {
  return (
    Boolean(translation.title?.trim()) ||
    Boolean(translation.excerpt?.trim()) ||
    Boolean(translation.heroImage?.trim()) ||
    (Array.isArray(translation.content) &&
      translation.content.some(
        (block) => typeof block.content === "string" && block.content.trim().length > 0,
      )) ||
    Boolean(translation.seo?.metaTitle?.trim()) ||
    Boolean(translation.seo?.metaDescription?.trim()) ||
    (Array.isArray(translation.seo?.keywords) && translation.seo.keywords.length > 0)
  )
}

function generateSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function prepareTranslationsForSave(
  post: AdminBlogPost,
): Partial<Record<AppLocale, BlogTranslationInput>> | undefined {
  const entries: [AppLocale, BlogTranslationInput][] = []
  for (const locale of SUPPORTED_LOCALES) {
    const typed = locale as AppLocale
    if (typed === DEFAULT_LOCALE) continue
    const translation = post.translations?.[typed]
    if (translation && hasTranslationData(translation)) {
      entries.push([typed, translation])
    }
  }
  if (entries.length === 0) return undefined
  return Object.fromEntries(entries) as Partial<Record<AppLocale, BlogTranslationInput>>
}

export default function NewBlogPost() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { createBlog, loading, error } = useBlogApi()

  const [activeLocale, setActiveLocale] = useState<AppLocale>(DEFAULT_LOCALE)
  const [blogPost, setBlogPost] = useState<AdminBlogPost>(() => ({
    title: "",
    slug: "",
    content: createEmptyContent(),
    excerpt: "",
    heroImage: "",
    author: {
      name: "",
      email: "",
      avatar: "",
    },
    publishedAt: new Date(),
    status: "draft",
    featured: false,
    category: "",
    tags: [],
    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
    translations: buildInitialTranslations(),
  }))

  const [activeTab, setActiveTab] = useState("editor")
  const [isTabSwitching, setIsTabSwitching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [switchState, setSwitchState] = useState(false)

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastAutoSaveRef = useRef<string>("")
  const featuredUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastContentRef = useRef<Partial<Record<AppLocale, string>>>({
    [DEFAULT_LOCALE]: JSON.stringify(blogPost.content),
  })

  const ensureTranslation = useCallback((locale: AppLocale) => {
    if (locale === DEFAULT_LOCALE) return
    setBlogPost((prev) => {
      if (prev.translations?.[locale]) return prev
      return {
        ...prev,
        translations: {
          ...(prev.translations ?? {}),
          [locale]: createEmptyTranslation(),
        },
      }
    })
  }, [])

  useEffect(() => {
    ensureTranslation(activeLocale)
  }, [activeLocale, ensureTranslation])

  useEffect(() => {
    lastContentRef.current[DEFAULT_LOCALE] = JSON.stringify(blogPost.content)
  }, [blogPost.content])

  useEffect(() => {
    if (!blogPost.translations) return
    for (const locale of SUPPORTED_LOCALES) {
      const typed = locale as AppLocale
      if (typed === DEFAULT_LOCALE) continue
      const translation = blogPost.translations[typed]
      if (translation) {
        lastContentRef.current[typed] = JSON.stringify(translation.content)
      }
    }
  }, [blogPost.translations])

  useEffect(() => {
    setSwitchState(blogPost.featured)
  }, [blogPost.featured])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    if (!session?.user) return
    setBlogPost((prev) => {
      if (prev.author.name && prev.author.email) return prev
      return {
        ...prev,
        author: {
          name: (session.user as any)?.name || prev.author.name,
          email: (session.user as any)?.email || prev.author.email,
          avatar: (session.user as any)?.image || prev.author.avatar,
        },
      }
    })
  }, [session?.user])

  const handleTabChange = useCallback((value: string) => {
    setIsTabSwitching(true)
    setActiveTab(value)
    setTimeout(() => setIsTabSwitching(false), 150)
  }, [])

  const updateTranslation = useCallback(
    (locale: AppLocale, updater: (current: BlogTranslationInput) => BlogTranslationInput) => {
      if (locale === DEFAULT_LOCALE) return
      setBlogPost((prev) => {
        const current = prev.translations?.[locale] ?? createEmptyTranslation()
        const next = updater({
          ...current,
          seo: {
            ...current.seo,
            keywords: [...(current.seo?.keywords ?? [])],
          },
        })
        return {
          ...prev,
          translations: {
            ...(prev.translations ?? {}),
            [locale]: next,
          },
        }
      })
    },
    [],
  )

  const handleTitleChange = useCallback(
    (locale: AppLocale, value: string) => {
      if (locale === DEFAULT_LOCALE) {
        setBlogPost((prev) => ({
          ...prev,
          title: value,
          slug: generateSlug(value),
          seo: {
            ...prev.seo,
            metaTitle: prev.seo.metaTitle || value,
          },
        }))
        return
      }

      updateTranslation(locale, (current) => {
        const shouldAutoSlug = !current.slug || current.slug === generateSlug(current.title)
        return {
          ...current,
          title: value,
          slug: shouldAutoSlug ? generateSlug(value) : current.slug,
          seo: {
            ...current.seo,
            metaTitle: current.seo.metaTitle || value,
          },
        }
      })
    },
    [updateTranslation],
  )

  const handleSlugChange = useCallback((locale: AppLocale, value: string) => {
    if (locale === DEFAULT_LOCALE) {
      setBlogPost((prev) => ({
        ...prev,
        slug: value,
      }))
      return
    }

    updateTranslation(locale, (current) => ({
      ...current,
      slug: value,
    }))
  }, [updateTranslation])

  const handleExcerptChange = useCallback(
    (locale: AppLocale, value: string) => {
      if (locale === DEFAULT_LOCALE) {
        setBlogPost((prev) => ({
          ...prev,
          excerpt: value,
        }))
        return
      }

      updateTranslation(locale, (current) => ({
        ...current,
        excerpt: value,
      }))
    },
    [updateTranslation],
  )

  const handleHeroImageChange = useCallback(
    (locale: AppLocale, value: string) => {
      if (locale === DEFAULT_LOCALE) {
        setBlogPost((prev) => ({
          ...prev,
          heroImage: value,
        }))
        return
      }

      updateTranslation(locale, (current) => ({
        ...current,
        heroImage: value,
      }))
    },
    [updateTranslation],
  )

  const handleContentChange = useCallback(
    (locale: AppLocale, content: BlogContentBlock[]) => {
      const serialized = JSON.stringify(content)
      if (lastContentRef.current[locale] === serialized) {
        return
      }
      lastContentRef.current[locale] = serialized

      if (locale === DEFAULT_LOCALE) {
        setBlogPost((prev) => ({
          ...prev,
          content,
        }))
        return
      }

      updateTranslation(locale, (current) => ({
        ...current,
        content,
      }))
    },
    [updateTranslation],
  )

  const handleFeaturedChange = useCallback((featured: boolean) => {
    setSwitchState(featured)

    if (featuredUpdateTimeoutRef.current) {
      clearTimeout(featuredUpdateTimeoutRef.current)
    }

    featuredUpdateTimeoutRef.current = setTimeout(() => {
      setBlogPost((prev) => ({
        ...prev,
        featured,
      }))
    }, 120)
  }, [])

  const handleCategoryChange = useCallback((categories: string[]) => {
    setBlogPost((prev) => ({
      ...prev,
      category: categories[0] ?? "",
    }))
  }, [])

  const handleTagsChange = useCallback((tags: string[]) => {
    setBlogPost((prev) => ({
      ...prev,
      tags,
    }))
  }, [])

  const handleSEOChange = useCallback(
    (locale: AppLocale, seo: BlogSEO) => {
      if (locale === DEFAULT_LOCALE) {
        setBlogPost((prev) => ({
          ...prev,
          seo,
        }))
        return
      }

      updateTranslation(locale, (current) => ({
        ...current,
        seo: {
          ...current.seo,
          ...seo,
        },
      }))
    },
    [updateTranslation],
  )

  const handleAuthorChange = useCallback((name: string) => {
    setBlogPost((prev) => ({
      ...prev,
      author: {
        ...prev.author,
        name,
      },
    }))
  }, [])

  const handlePublishedAtChange = useCallback((date?: Date) => {
    setBlogPost((prev) => ({
      ...prev,
      publishedAt: date,
    }))
  }, [])

  const handleSave = useCallback(
    async (status: "draft" | "published" | "archived", silent = false) => {
      if (!blogPost.title.trim()) {
        if (!silent) toast.error("Please enter a title before saving")
        return
      }

      setIsSaving(true)

      try {
        const translations = prepareTranslationsForSave(blogPost)
        const payload = {
          ...blogPost,
          status,
          publishedAt: status === "published" ? new Date() : blogPost.publishedAt,
          seo: {
            ...blogPost.seo,
            metaTitle: blogPost.seo.metaTitle || blogPost.title,
            metaDescription: blogPost.seo.metaDescription || blogPost.excerpt,
          },
          ...(translations ? { translations } : {}),
        }

        await createBlog(payload)
        setLastSaved(new Date())

        if (!silent) {
          toast.success(
            status === "published"
              ? "Blog post published successfully!"
              : "Draft saved successfully!",
          )
          if (status === "published") {
            router.push("/admin/blog")
          }
        }
      } catch (err) {
        if (!silent) {
          toast.error(error || "Failed to save blog post")
        }
        console.error("Save error:", err)
      } finally {
        setIsSaving(false)
      }
    },
    [blogPost, createBlog, error, router],
  )

  useEffect(() => {
    if (!blogPost.title.trim()) return

    const snapshot = JSON.stringify({
      base: {
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
      },
      translations: SUPPORTED_LOCALES.reduce<Record<string, unknown>>((acc, locale) => {
        const typed = locale as AppLocale
        if (typed === DEFAULT_LOCALE) return acc
        const translation = blogPost.translations?.[typed]
        if (translation && hasTranslationData(translation)) {
          acc[typed] = {
            title: translation.title,
            excerpt: translation.excerpt,
            content: translation.content,
          }
        }
        return acc
      }, {}),
    })

    if (snapshot === lastAutoSaveRef.current) return
    lastAutoSaveRef.current = snapshot

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      handleSave("draft", true)
    }, 30000)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [blogPost, handleSave])

  const activeTranslation = blogPost.translations?.[activeLocale]
  const isDefaultLocale = activeLocale === DEFAULT_LOCALE

  const titleValue = isDefaultLocale ? blogPost.title : activeTranslation?.title ?? ""
  const slugValue =
    isDefaultLocale ? blogPost.slug : activeTranslation?.slug ?? generateSlug(titleValue || "")
  const excerptValue = isDefaultLocale ? blogPost.excerpt : activeTranslation?.excerpt ?? ""
  const heroValue = isDefaultLocale ? blogPost.heroImage ?? "" : activeTranslation?.heroImage ?? ""
  const seoValue: BlogSEO = isDefaultLocale
    ? blogPost.seo
    : activeTranslation?.seo ?? {
        metaTitle: "",
        metaDescription: "",
        keywords: [],
      }
  const contentValue = isDefaultLocale
    ? blogPost.content
    : activeTranslation?.content ?? createEmptyContent()

  const previewPost = useMemo<AdminBlogPost>(() => {
    if (isDefaultLocale || !activeTranslation) {
      return blogPost
    }

    return {
      ...blogPost,
      title: activeTranslation.title || blogPost.title,
      slug: activeTranslation.slug || blogPost.slug,
      excerpt: activeTranslation.excerpt || blogPost.excerpt,
      heroImage: activeTranslation.heroImage || blogPost.heroImage,
      content:
        Array.isArray(activeTranslation.content) && activeTranslation.content.length > 0
          ? activeTranslation.content
          : blogPost.content,
      seo: {
        ...blogPost.seo,
        ...activeTranslation.seo,
        keywords:
          activeTranslation.seo?.keywords?.length
            ? activeTranslation.seo.keywords
            : blogPost.seo.keywords,
      },
    }
  }, [activeTranslation, blogPost, isDefaultLocale])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white bg-black">
      <div className="bg-black border-b border-white/20">
        <div className="flex flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-white sm:text-2xl">Create New Blog Post</h1>
            <Badge
              variant={blogPost.status === "published" ? "default" : "secondary"}
              className="text-white border border-white/20 bg-white/10"
            >
              {blogPost.status === "published" ? "Published" : "Draft"}
            </Badge>
            {lastSaved && (
              <span className="text-xs text-white/60">Saved {lastSaved.toLocaleTimeString()}</span>
            )}
          </div>
          <div className="flex items-center w-full gap-2 sm:w-auto">
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={isSaving || loading}
              className="min-w-[120px] border-white/20 text-white hover:bg-white/10"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden ml-2 sm:inline">Save Draft</span>
              <span className="ml-2 sm:hidden">Draft</span>
            </Button>
            <Button
              onClick={() => handleSave("published")}
              disabled={isSaving || loading || !blogPost.title.trim()}
              className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Globe className="w-4 h-4" />
              )}
              <span className="ml-2">Publish</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 min-w-0">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
            <div className="sticky top-0 z-10 bg-black border-b border-white/20">
              <TabsList className="grid w-full max-w-md grid-cols-3 mx-4 my-4 bg-black border border-white/20 sm:mx-6">
                <TabsTrigger
                  value="editor"
                  className="flex items-center gap-2 text-white/70 transition-all duration-150 hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  <Type className="w-4 h-4" />
                  <span className="hidden sm:inline">Editor</span>
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2 text-white/70 transition-all duration-150 hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Preview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="flex items-center gap-2 text-white/70 transition-all durée-150 hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">SEO</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className={`transition-opacity duration-150 ${isTabSwitching ? "opacity-50" : "opacity-100"}`}>
              <TabsContent value="editor" className="p-4 space-y-6 max-w-none sm:p-6">
                <Card className="bg-black border-white/20">
                  <CardHeader className="gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Type className="w-5 h-5" />
                        Localized Basics
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {SUPPORTED_LOCALES.map((locale) => {
                          const typed = locale as AppLocale
                          return (
                            <Button
                              key={typed}
                              size="sm"
                              variant={activeLocale === typed ? "default" : "outline"}
                              onClick={() => setActiveLocale(typed)}
                              className={
                                activeLocale === typed
                                  ? "bg-white text-black hover:bg-white/90"
                                  : "border-white/20 text-white hover:bg-white/10"
                              }
                            >
                              {LOCALE_LABELS[typed]}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                    {!isDefaultLocale && (
                      <div className="flex items-start gap-2 p-3 text-xs border rounded-lg border-white/10 bg-white/5 text-white/70">
                        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/60" />
                        <span>
                          Editing the {LOCALE_LABELS[activeLocale]} version. Any fields you leave blank will fall back to the English content.
                        </span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-white/80">
                          Title *
                        </Label>
                        <Input
                          id="title"
                          value={titleValue}
                          onChange={(e) => handleTitleChange(activeLocale, e.target.value)}
                          placeholder={`Enter the ${LOCALE_LABELS[activeLocale]} title...`}
                          className="text-lg text-white bg-black placeholder:text-white/40 focus:border-white/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-white/80">
                          URL Slug
                        </Label>
                        <Input
                          id="slug"
                          value={slugValue}
                          onChange={(e) => handleSlugChange(activeLocale, e.target.value)}
                          placeholder="url-friendly-slug"
                          className="text-white bg-black placeholder:text-white/40 focus:border-white/40"
                        />
                        {!isDefaultLocale && (
                          <p className="text-xs text-white/50">
                            Slugs are locale-specific. Leave blank to inherit from the translated title.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="author" className="flex items-center gap-2 text-white/80">
                          <User className="w-4 h-4" />
                          Author
                        </Label>
                        <Input
                          id="author"
                          value={blogPost.author.name}
                          onChange={(e) => handleAuthorChange(e.target.value)}
                          placeholder="Enter author name"
                          className="text-white bg-black placeholder:text-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20"
                          autoComplete="off"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="publishedDate" className="flex items-center gap-2 text-white/80">
                          <Calendar className="w-4 h-4" />
                          Publish Date
                        </Label>
                        <Input
                          id="publishedDate"
                          type="date"
                          value={
                            blogPost.publishedAt
                              ? (
                                  blogPost.publishedAt instanceof Date
                                    ? blogPost.publishedAt
                                    : new Date(blogPost.publishedAt)
                                )
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            handlePublishedAtChange(e.target.value ? new Date(e.target.value) : undefined)
                          }
                          className="text-white bg-black focus:border-white/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt" className="text-white/80">
                        Excerpt
                      </Label>
                      <Textarea
                        id="excerpt"
                        value={excerptValue}
                        onChange={(e) => handleExcerptChange(activeLocale, e.target.value)}
                        placeholder={`Brief summary for the ${LOCALE_LABELS[activeLocale]} audience...`}
                        rows={3}
                        className="text-white bg-black placeholder:text-white/40 focus:border-white/40"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <CustomSwitch
                        id="featured"
                        checked={switchState}
                        onCheckedChange={handleFeaturedChange}
                        className="data-[state=checked]:bg-accent"
                      />
                      <Label htmlFor="featured" className="text-white/80">
                        Mark as featured post
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <ImageIcon className="w-5 h-5" />
                      Hero Image
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MediaUpload
                      value={heroValue}
                      onChange={(url) => handleHeroImageChange(activeLocale, url)}
                      type="image"
                    />
                    {!isDefaultLocale && (
                      <p className="mt-2 text-xs text-white/50">
                        Leave empty to reuse the English hero image.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BlogEditor
                      key={`editor-${activeLocale}`}
                      content={contentValue}
                      onChange={(content) => handleContentChange(activeLocale, content)}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-black border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Categories & Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 text-sm text-blue-200 border rounded-lg border-blue-900/40 bg-blue-900/20">
                      <p className="font-medium">💡 Tip: Create categories first</p>
                      <p>
                        If you don't see any categories, go to{" "}
                        <a href="/admin/blog/categories" className="underline hover:text-blue-100">
                          Categories Management
                        </a>{" "}
                        to create some categories before writing your blog post.
                      </p>
                    </div>
                    <CategorySelector
                      selectedCategories={blogPost.category ? [blogPost.category] : []}
                      onChange={handleCategoryChange}
                      maxSelections={1}
                    />

                    <div className="space-y-2">
                      <Label className="text-white/80">Tags</Label>
                      <TagsInput value={blogPost.tags} onChange={handleTagsChange} placeholder="Add tags..." />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="p-4 sm:p-6">
                <div className="overflow-hidden bg-black border rounded-2xl border-white/20">
                  <BlogPreview blogPost={previewPost} locale={activeLocale} />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="p-4 sm:p-6">
                <SEOPanel
                  seo={seoValue}
                  onChange={(seo) => handleSEOChange(activeLocale, seo)}
                  title={titleValue}
                  excerpt={excerptValue}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
