"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CustomSwitch } from "@/components/ui/custom-switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlogEditor } from "@/components/admin/blogs/blog-editor"
import { BlogPreview } from "@/components/admin/blogs/blog-preview"
import { SEOPanel } from "@/components/admin/blogs/seo-panel"
import { MediaUpload } from "@/components/admin/blogs/media-upload"
import { TagsInput } from "@/components/admin/blogs/tags-input"
import { CategorySelector } from "@/components/admin/blogs/category-selector"
import { useBlogApi } from "@/lib/hooks/use-blog-api"
import { Save, Eye, Globe, Settings, ImageIcon, Type, Calendar, User, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

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

export default function EditBlogPost() {
  const router = useRouter()
  const params = useParams()
  const { data: session, status } = useSession()
  const { fetchBlog, updateBlog, loading, error } = useBlogApi()

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("editor")
  const [isTabSwitching, setIsTabSwitching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [switchState, setSwitchState] = useState(false)
  
  const featuredUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const contentUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const blogId = params.id as string

  // Fetch blog post data
  useEffect(() => {
    const loadBlogPost = async () => {
      if (!blogId) return
      
      setIsLoading(true)
      try {
        const blog = await fetchBlog(blogId)
        if (blog) {
          const initialBlogPost = {
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            excerpt: blog.excerpt,
            heroImage: blog.heroImage || "",
            author: blog.author,
            publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : undefined,
            status: blog.status,
            featured: blog.featured,
            category: blog.category,
            tags: blog.tags,
            seo: blog.seo,
          }
          setBlogPost(initialBlogPost)
        } else {
          toast.error("Blog post not found")
          router.push("/admin/blog")
        }
      } catch (err) {
        toast.error("Failed to load blog post")
        router.push("/admin/blog")
      } finally {
        setIsLoading(false)
      }
    }

    loadBlogPost()
  }, [blogId, fetchBlog, router])

  // Keep switch state in sync with blog post featured state
  useEffect(() => {
    if (blogPost) {
      setSwitchState(blogPost.featured)
    }
  }, [blogPost?.featured])
  
  // Keep content ref in sync
  useEffect(() => {
    if (blogPost) {
      lastContentRef.current = JSON.stringify(blogPost.content)
    }
  }, [blogPost?.content])
  
  // Keep tags ref in sync
  useEffect(() => {
    if (blogPost) {
      lastTagsRef.current = JSON.stringify(blogPost.tags)
    }
  }, [blogPost?.tags])
  
  // Keep SEO ref in sync
  useEffect(() => {
    if (blogPost) {
      lastSEORef.current = JSON.stringify(blogPost.seo)
    }
  }, [blogPost?.seo])
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (featuredUpdateTimeoutRef.current) {
        clearTimeout(featuredUpdateTimeoutRef.current)
      }
      if (contentUpdateTimeoutRef.current) {
        clearTimeout(contentUpdateTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handleTabChange = useCallback((value: string) => {
    setIsTabSwitching(true)
    setActiveTab(value)
    setTimeout(() => setIsTabSwitching(false), 150)
  }, [])

  const handleSave = useCallback(
    async (status: "draft" | "published", silent = false) => {
      if (!blogPost || !blogPost.title.trim()) {
        if (!silent) toast.error("Please enter a title before saving")
        return
      }

      setIsSaving(true)
      try {
        const blogData = {
          ...blogPost,
          status,
          seo: {
            ...blogPost.seo,
            metaTitle: blogPost.seo.metaTitle || blogPost.title,
            metaDescription: blogPost.seo.metaDescription || blogPost.excerpt,
          },
        }

        await updateBlog(blogId, blogData)
        setLastSaved(new Date())

        if (!silent) {
          toast.success(status === "published" ? "Blog post updated and published!" : "Draft saved successfully!")
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
    [blogPost, updateBlog, blogId, error, router],
  )

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }, [])

  const handleTitleChange = useCallback(
    (title: string) => {
      if (!blogPost) return
      setBlogPost((prev) => ({
        ...prev!,
        title,
        slug: generateSlug(title),
        seo: {
          ...prev!.seo,
          metaTitle: title || prev!.seo.metaTitle,
          socialTitle: title || prev!.seo.socialTitle,
        },
      }))
    },
    [blogPost, generateSlug],
  )

  const lastContentRef = useRef<string>("")
  
  const handleContentChange = useCallback((content: any[]) => {
    if (!blogPost) return
    
    const contentString = JSON.stringify(content)
    
    // Prevent unnecessary updates if content hasn't actually changed
    if (lastContentRef.current === contentString) {
      return
    }
    
    lastContentRef.current = contentString
    
    // Clear any pending timeout
    if (contentUpdateTimeoutRef.current) {
      clearTimeout(contentUpdateTimeoutRef.current)
    }
    
    // Debounce the state update to prevent infinite loops
    contentUpdateTimeoutRef.current = setTimeout(() => {
      setBlogPost((prev) => {
        if (!prev) return prev
        if (JSON.stringify(prev.content) === contentString) {
          return prev
        }
        return { ...prev, content }
      })
    }, 100)
  }, [blogPost])

  const handleFeaturedChange = useCallback((featured: boolean) => {
    if (!blogPost) return
    
    // Update switch state immediately for responsive UI
    setSwitchState(featured)
    
    // Clear any pending timeout
    if (featuredUpdateTimeoutRef.current) {
      clearTimeout(featuredUpdateTimeoutRef.current)
    }
    
    // Debounce the actual state update to prevent infinite loops
    featuredUpdateTimeoutRef.current = setTimeout(() => {
      setBlogPost((prev) => {
        if (!prev) return prev
        // Only update if the value has actually changed
        if (prev.featured !== featured) {
          return { ...prev, featured }
        }
        return prev
      })
    }, 100) // 100ms debounce
  }, [blogPost])

  const handleCategoryChange = useCallback((categories: string[]) => {
    if (!blogPost) return
    const newCategory = categories[0] || ""
    setBlogPost((prev) => {
      if (prev && prev.category === newCategory) {
        return prev
      }
      return { ...prev!, category: newCategory }
    })
  }, [blogPost])

  const lastTagsRef = useRef<string>("")
  const lastSEORef = useRef<string>("")
  
  const handleTagsChange = useCallback((tags: string[]) => {
    if (!blogPost) return
    
    const tagsString = JSON.stringify(tags)
    
    // Prevent unnecessary updates if tags haven't actually changed
    if (lastTagsRef.current === tagsString) {
      return
    }
    
    lastTagsRef.current = tagsString
    setBlogPost((prev) => {
      if (!prev) return prev
      if (JSON.stringify(prev.tags) === tagsString) {
        return prev
      }
      return { ...prev, tags }
    })
  }, [blogPost])

  const handleSEOChange = useCallback((seo: any) => {
    if (!blogPost) return
    
    const seoString = JSON.stringify(seo)
    
    // Prevent unnecessary updates if SEO hasn't actually changed
    if (lastSEORef.current === seoString) {
      return
    }
    
    lastSEORef.current = seoString
    setBlogPost((prev) => {
      if (!prev) return prev
      if (JSON.stringify(prev.seo) === seoString) {
        return prev
      }
      return { ...prev, seo }
    })
  }, [blogPost])

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <p className="text-white">Blog post not found</p>
          <Button onClick={() => router.push("/admin/blog")} className="mt-4">
            Back to Blogs
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white bg-black">
      <div className="bg-black border-b border-white/20">
        <div className="flex flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/blog")}
              className="text-white/70 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-white sm:text-2xl">Edit Blog Post</h1>
            <Badge
              variant={blogPost.status === "published" ? "default" : "secondary"}
              className="text-white bg-white/10 border border-white/20"
            >
              {blogPost.status === "published" ? "Published" : "Draft"}
            </Badge>
            {lastSaved && <span className="text-xs text-white/60">Saved {lastSaved.toLocaleTimeString()}</span>}
          </div>
          <div className="flex items-center w-full gap-2 sm:w-auto">
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={isSaving || loading}
              className="flex-1 border-white/20 sm:flex-none hover:bg-white/10 text-white"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave("published")}
              disabled={isSaving || loading || !blogPost.title.trim()}
              className="flex-1 sm:flex-none bg-accent hover:bg-accent/90 text-white"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
              Update & Publish
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
                  className="flex items-center gap-2 transition-all duration-150 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 hover:text-white"
                >
                  <Type className="w-4 h-4" />
                  <span className="hidden sm:inline">Editor</span>
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2 transition-all duration-150 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Preview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="flex items-center gap-2 transition-all duration-150 data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/70 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">SEO</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className={`transition-opacity duration-150 ${isTabSwitching ? "opacity-50" : "opacity-100"}`}>
              <TabsContent value="editor" className="p-4 space-y-6 sm:p-6 max-w-none">
                <Card className="bg-black border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Type className="w-5 h-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-white/80">
                          Title *
                        </Label>
                        {blogPost && (
                          <Input
                            id="title"
                            value={blogPost.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Enter your blog post title..."
                            className="text-lg text-white bg-black border-white/20 placeholder:text-white/40 focus:border-white/40"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-white/80">
                          URL Slug
                        </Label>
                        {blogPost && (
                          <Input
                            id="slug"
                            value={blogPost.slug}
                            onChange={(e) => setBlogPost((prev) => ({ ...prev!, slug: e.target.value }))}
                            placeholder="url-friendly-slug"
                            className="text-white bg-black border-white/20 placeholder:text-white/40 focus:border-white/40"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="author" className="flex items-center gap-2 text-white/80">
                          <User className="w-4 h-4" />
                          Author
                        </Label>
                        {blogPost && (
                          <Input
                            id="author"
                            value={blogPost.author.name}
                            onChange={(e) => setBlogPost((prev) => ({ ...prev!, author: { ...prev!.author, name: e.target.value } }))}
                            placeholder="Author name"
                            className="text-white bg-black border-white/20 placeholder:text-white/40 focus:border-white/40"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="publishedDate" className="flex items-center gap-2 text-white/80">
                          <Calendar className="w-4 h-4" />
                          Publish Date
                        </Label>
                        {blogPost && (
                          <Input
                            id="publishedDate"
                            type="date"
                            value={blogPost.publishedAt ? (blogPost.publishedAt instanceof Date ? blogPost.publishedAt.toISOString().split("T")[0] : new Date(blogPost.publishedAt).toISOString().split("T")[0]) : ""}
                            onChange={(e) => setBlogPost((prev) => ({ ...prev!, publishedAt: e.target.value ? new Date(e.target.value) : undefined }))}
                            className="text-white bg-black border-white/20 focus:border-white/40"
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt" className="text-white/80">
                        Excerpt
                      </Label>
                      {blogPost && (
                        <Textarea
                          id="excerpt"
                          value={blogPost.excerpt}
                          onChange={(e) => setBlogPost((prev) => {
                            if (prev && prev.excerpt === e.target.value) {
                              return prev
                            }
                            return { ...prev!, excerpt: e.target.value }
                          })}
                          placeholder="Brief description of your blog post..."
                          rows={3}
                          className="text-white bg-black border-white/20 placeholder:text-white/40 focus:border-white/40"
                        />
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {blogPost && (
                        <CustomSwitch
                          id="featured"
                          checked={switchState}
                          onCheckedChange={handleFeaturedChange}
                          className="data-[state=checked]:bg-accent"
                        />
                      )}
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
                    {blogPost && (
                      <MediaUpload
                        value={blogPost.heroImage || ""}
                        onChange={(url: string) => setBlogPost((prev) => {
                          if (prev && prev.heroImage === url) {
                            return prev
                          }
                          return { ...prev!, heroImage: url }
                        })}
                        type="image"
                      />
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {blogPost && (
                      <BlogEditor content={blogPost.content} onChange={handleContentChange} />
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-black border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Categories & Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 text-sm text-blue-300 border border-blue-800 rounded-lg bg-blue-900/20">
                      <p className="font-medium">💡 Tip: Create categories first</p>
                      <p>If you don't see any categories, go to <a href="/admin/blog/categories" className="underline hover:text-blue-200">Categories Management</a> to create some categories before writing your blog post.</p>
                    </div>
                    {blogPost && (
                      <>
                        <CategorySelector
                          selectedCategories={blogPost.category ? [blogPost.category] : []}
                          onChange={handleCategoryChange}
                          maxSelections={1}
                        />

                        <div className="space-y-2">
                          <Label className="text-white/80">Tags</Label>
                          <TagsInput
                            value={blogPost.tags}
                            onChange={handleTagsChange}
                            placeholder="Add tags..."
                          />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="p-4 sm:p-6">
                <div className="overflow-hidden bg-black border border-white/20 rounded-lg">
                  {blogPost && <BlogPreview blogPost={blogPost} />}
                </div>
              </TabsContent>

              <TabsContent value="seo" className="p-4 sm:p-6">
                {blogPost && (
                  <SEOPanel
                    seo={blogPost.seo}
                    onChange={handleSEOChange}
                    title={blogPost.title}
                    excerpt={blogPost.excerpt}
                  />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
