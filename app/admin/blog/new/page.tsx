"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
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
import { Save, Eye, Globe, Settings, ImageIcon, Type, Calendar, User, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface BlogPost {
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
  publishedAt?: Date
  status: "draft" | "published" | "archived"
  featured: boolean
  category: string
  tags: string[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
  // These will be set by the backend
  createdAt?: Date
  updatedAt?: Date
  readingTime?: number
  views?: number
}

interface ContentBlock {
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

export default function NewBlogPost() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { createBlog, loading, error } = useBlogApi()

  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: "",
    slug: "",
    content: [{ 
      id: "1", 
      type: "paragraph", 
      content: "",
      metadata: {}
    }],
    excerpt: "",
    heroImage: "",
    author: {
      name: (session?.user as any)?.name || "",
      email: (session?.user as any)?.email || "",
      avatar: (session?.user as any)?.image || "",
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
  })

  const [activeTab, setActiveTab] = useState("editor")
  const [isTabSwitching, setIsTabSwitching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [switchState, setSwitchState] = useState(blogPost.featured)
  
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lastAutoSaveRef = useRef<string>("")
  const featuredUpdateTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleTabChange = useCallback((value: string) => {
    setIsTabSwitching(true)
    setActiveTab(value)
    setTimeout(() => setIsTabSwitching(false), 150)
  }, [])

  const handleSave = useCallback(
    async (status: "draft" | "published" | "archived", silent = false) => {
      if (!blogPost.title.trim()) {
        if (!silent) toast.error("Please enter a title before saving")
        return
      }

      setIsSaving(true)
      try {
        const blogData = {
          ...blogPost,
          status,
          publishedAt: status === "published" ? new Date() : blogPost.publishedAt,
          seo: {
            ...blogPost.seo,
            metaTitle: blogPost.seo.metaTitle || blogPost.title,
            metaDescription: blogPost.seo.metaDescription || blogPost.excerpt,
          },
        }

        // Debug logging to see what's being sent
        console.log('🚀 Saving blog post with data:', {
          title: blogData.title,
          contentBlocks: blogData.content.length,
          contentTypes: blogData.content.map(b => b.type),
          hasContent: !!blogData.content,
          contentPreview: blogData.content.map(b => ({
            type: b.type,
            contentLength: b.content.length,
            hasMetadata: !!b.metadata,
            metadataKeys: Object.keys(b.metadata || {})
          }))
        });

        await createBlog(blogData)
        setLastSaved(new Date())

        if (!silent) {
          toast.success(status === "published" ? "Blog post published successfully!" : "Draft saved successfully!")
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
      setBlogPost((prev) => ({
        ...prev,
        title,
        slug: generateSlug(title),
        seo: {
          ...prev.seo,
          metaTitle: title || prev.seo.metaTitle,
        },
      }))
    },
    [generateSlug],
  )

  const lastContentRef = useRef<string>(JSON.stringify(blogPost.content))
  
  const handleContentChange = useCallback((content: ContentBlock[]) => {
    const contentString = JSON.stringify(content)
    
    // Debug logging to see what content is being received
    console.log('🔄 handleContentChange called with:', {
      contentBlocks: content.length,
      contentTypes: content.map(b => b.type),
      contentIds: content.map(b => b.id),
      contentString: contentString.substring(0, 200) + '...'
    });
    
    // Prevent unnecessary updates if content hasn't actually changed
    if (lastContentRef.current === contentString) {
      console.log('⏭️  Content unchanged, skipping update');
      return
    }
    
    console.log('💾 Updating blog post content with', content.length, 'blocks');
    lastContentRef.current = contentString
    setBlogPost((prev) => {
      if (prev && JSON.stringify(prev.content) === contentString) {
        return prev
      }
      return { ...prev, content }
    })
  }, [])

  const handleFeaturedChange = useCallback((featured: boolean) => {
    // Update switch state immediately for responsive UI
    setSwitchState(featured)
    
    // Clear any pending timeout
    if (featuredUpdateTimeoutRef.current) {
      clearTimeout(featuredUpdateTimeoutRef.current)
    }
    
    // Debounce the actual state update to prevent infinite loops
    featuredUpdateTimeoutRef.current = setTimeout(() => {
      setBlogPost((prev) => {
        // Only update if the value has actually changed
        if (prev.featured !== featured) {
          return { ...prev, featured }
        }
        return prev
      })
    }, 100) // 100ms debounce
  }, [])

  const handleCategoryChange = useCallback((categories: string[]) => {
    const newCategory = categories[0] || ""
    setBlogPost((prev) => {
      if (prev && prev.category === newCategory) {
        return prev
      }
      return { ...prev, category: newCategory }
    })
  }, [])

  const lastTagsRef = useRef<string>(JSON.stringify(blogPost.tags))
  
  const handleTagsChange = useCallback((tags: string[]) => {
    const tagsString = JSON.stringify(tags)
    
    // Prevent unnecessary updates if tags haven't actually changed
    if (lastTagsRef.current === tagsString) {
      return
    }
    
    lastTagsRef.current = tagsString
    setBlogPost((prev) => {
      if (prev && JSON.stringify(prev.tags) === tagsString) {
        return prev
      }
      return { ...prev, tags }
    })
  }, [blogPost.tags])

  const lastSEORef = useRef<string>(JSON.stringify(blogPost.seo))
  
  const handleSEOChange = useCallback((seo: any) => {
    const seoString = JSON.stringify(seo)
    
    // Prevent unnecessary updates if SEO hasn't actually changed
    if (lastSEORef.current === seoString) {
      return
    }
    
    lastSEORef.current = seoString
    setBlogPost((prev) => {
      if (prev && JSON.stringify(prev.seo) === seoString) {
        return prev
      }
      return { ...prev, seo }
    })
  }, [blogPost.seo.metaTitle, blogPost.seo.metaDescription, blogPost.seo.keywords])

  const handleExcerptChange = useCallback((excerpt: string) => {
    setBlogPost((prev) => {
      if (prev && prev.excerpt === excerpt) {
        return prev
      }
      return { ...prev, excerpt }
    })
  }, [])

  const handleHeroImageChange = useCallback((heroImage: string) => {
    setBlogPost((prev) => {
      if (prev && prev.heroImage === heroImage) {
        return prev
      }
      return { ...prev, heroImage }
    })
  }, [])

  const handleSlugChange = useCallback((slug: string) => {
    setBlogPost((prev) => {
      if (prev && prev.slug === slug) {
        return prev
      }
      return { ...prev, slug }
    })
  }, [])

  const handleAuthorChange = useCallback((name: string) => {
    setBlogPost((prev) => ({
      ...prev,
      author: { ...prev.author, name }
    }))
  }, [])

  const handlePublishedAtChange = useCallback((publishedAt: Date | undefined) => {
    setBlogPost((prev) => {
      if (prev && prev.publishedAt === publishedAt) {
        return prev
      }
      return { ...prev, publishedAt }
    })
    }, [])

  // Auto-save logic with proper memoization
  useEffect(() => {
    if (!blogPost.title.trim()) return

    const currentContent = JSON.stringify({
      title: blogPost.title,
      content: blogPost.content,
      excerpt: blogPost.excerpt
    })

    // Only auto-save if content has actually changed
    if (currentContent === lastAutoSaveRef.current) return
    lastAutoSaveRef.current = currentContent

    // Clear previous timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      if (blogPost.title.trim()) {
        handleSave("draft", true)
      }
    }, 30000)

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [blogPost.title, blogPost.content, blogPost.excerpt, handleSave])

  // Keep switch state in sync with blog post featured state
  useEffect(() => {
    setSwitchState(blogPost.featured)
  }, [blogPost.featured])
  
  // Keep content ref in sync
  useEffect(() => {
    lastContentRef.current = JSON.stringify(blogPost.content)
  }, [blogPost.content])
  
  // Keep tags ref in sync
  useEffect(() => {
    lastTagsRef.current = JSON.stringify(blogPost.tags)
  }, [blogPost.tags])
  
  // Keep SEO ref in sync
  useEffect(() => {
    lastSEORef.current = JSON.stringify(blogPost.seo)
  }, [blogPost.seo])
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (featuredUpdateTimeoutRef.current) {
        clearTimeout(featuredUpdateTimeoutRef.current)
      }
    }
  }, [])

  // Author update logic with proper dependencies
  useEffect(() => {
    if (session && (session.user as any)?.name && !blogPost.author.name) {
      setBlogPost((prev) => {
        // Only update if author name is actually empty
        if (prev.author.name) return prev
        
        return { 
          ...prev, 
          author: {
            name: (session.user as any).name || "",
            email: (session.user as any).email || "",
            avatar: (session.user as any).image || "",
          }
        }
      })
    }
  }, [session?.user, blogPost.author.name])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])
  
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
              className="text-white border bg-white/10 border-white/20"
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
               className="min-w-[120px] border-white/20 hover:bg-white/10 text-white"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              <span className="hidden sm:inline">Save Draft</span>
              <span className="sm:hidden">Draft</span>
            </Button>
            <Button
              onClick={() => handleSave("published")}
              disabled={isSaving || loading || !blogPost.title.trim()}
              className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
              Publish
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
                         <Input
                           id="title"
                           value={blogPost.title}
                           onChange={(e) => handleTitleChange(e.target.value)}
                           placeholder="Enter your blog post title..."
                           className="text-lg text-white bg-black border-white/20 placeholder:text-white/40 focus:border-white/40"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="slug" className="text-white/80">
                           URL Slug
                         </Label>
                         <Input
                           id="slug"
                           value={blogPost.slug}
                           onChange={(e) => handleSlugChange(e.target.value)}
                           placeholder="url-friendly-slug"
                           className="text-white bg-black border-white/20 placeholder:text-white/40 focus:border-white/40"
                         />
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
                           className="text-white bg-black border-white/20 placeholder:text-white/40 focus:border-white/40 focus:ring-2 focus:ring-white/20"
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
                           value={blogPost.publishedAt ? (blogPost.publishedAt instanceof Date ? blogPost.publishedAt.toISOString().split("T")[0] : new Date(blogPost.publishedAt).toISOString().split("T")[0]) : ""}
                           onChange={(e) => handlePublishedAtChange(e.target.value ? new Date(e.target.value) : undefined)}
                           className="text-white bg-black border-white/20 focus:border-white/40"
                         />
                       </div>
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="excerpt" className="text-white/80">
                         Excerpt
                       </Label>
                       <Textarea
                         id="excerpt"
                         value={blogPost.excerpt}
                         onChange={(e) => handleExcerptChange(e.target.value)}
                         placeholder="Brief description of your blog post..."
                         rows={3}
                         className="text-white bg-black border-white/20 placeholder:text-white/40 focus:border-white/40"
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
                       value={blogPost.heroImage || ""}
                       onChange={handleHeroImageChange}
                       type="image"
                     />
                   </CardContent>
                 </Card>

                 <Card className="bg-black border-white/20">
                   <CardHeader>
                     <CardTitle className="text-white">Content</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <BlogEditor content={blogPost.content} onChange={handleContentChange} />
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
                   </CardContent>
                 </Card>
              </TabsContent>

                             <TabsContent value="preview" className="p-4 sm:p-6">
                 <div className="overflow-hidden bg-black border rounded-lg border-white/20">
                   <BlogPreview blogPost={blogPost} />
                 </div>
               </TabsContent>

               <TabsContent value="seo" className="p-4 sm:p-6">
                 <SEOPanel
                   seo={blogPost.seo}
                   onChange={handleSEOChange}
                   title={blogPost.title}
                   excerpt={blogPost.excerpt}
                 />
               </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
