"use client"

import { useState, useMemo } from "react"

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

interface BlogResponse {
  blogs: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function useBlogApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBlogs = useMemo(() => {
    return async (params?: {
      page?: number
      limit?: number
      status?: string
      category?: string
      search?: string
      sort?: string
      order?: "asc" | "desc"
    }): Promise<BlogResponse | null> => {
      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.set("page", params.page.toString())
        if (params?.limit) searchParams.set("limit", params.limit.toString())
        if (params?.status) searchParams.set("status", params.status)
        if (params?.category) searchParams.set("category", params.category)
        if (params?.search) searchParams.set("search", params.search)
        if (params?.sort) searchParams.set("sort", params.sort)
        if (params?.order) searchParams.set("order", params.order)

        const response = await fetch(`/api/admin/blogs?${searchParams}`)

        if (!response.ok) {
          throw new Error("Failed to fetch blogs")
        }

        const data = await response.json()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return null
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const fetchBlog = useMemo(() => {
    return async (id: string): Promise<BlogPost | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/admin/blogs/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch blog")
        }

        const data = await response.json()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return null
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const createBlog = useMemo(() => {
    return async (blogData: BlogPost): Promise<BlogPost | null> => {
      setLoading(true)
      setError(null)

      try {
        // Debug logging to see what's being sent
        console.log('📤 API Hook - Creating blog with data:', {
          title: blogData.title,
          contentBlocks: blogData.content?.length || 0,
          contentTypes: blogData.content?.map(b => b.type) || [],
          hasContent: !!blogData.content,
          contentStructure: blogData.content?.map(b => ({
            id: b.id,
            type: b.type,
            contentLength: b.content?.length || 0,
            hasMetadata: !!b.metadata,
            metadataKeys: Object.keys(b.metadata || {})
          }))
        });

        const response = await fetch("/api/admin/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create blog")
        }

        const data = await response.json()
        console.log('✅ API Hook - Blog created successfully:', data);
        return data
      } catch (err) {
        console.error('❌ API Hook - Error creating blog:', err);
        setError(err instanceof Error ? err.message : "An error occurred")
        return null
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const updateBlog = useMemo(() => {
    return async (id: string, blogData: Partial<BlogPost>): Promise<BlogPost | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/admin/blogs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blogData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update blog")
        }

        const data = await response.json()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return null
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const deleteBlog = useMemo(() => {
    return async (id: string): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/admin/blogs/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete blog")
        }

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return false
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const uploadImageFile = useMemo(() => {
    return async (file: File, folder = "blog"): Promise<{ url: string } | null> => {
      setLoading(true)
      setError(null)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const result = await response.json()
        return { url: result.data.secure_url }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return null
      } finally {
        setLoading(false)
      }
    }
  }, [])

  return {
    loading,
    error,
    fetchBlogs,
    fetchBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    uploadImage: uploadImageFile,
  }
}

interface Tag {
  _id: string
  name: string
  description: string
  color: string
  postCount: number
  createdAt: string
  updatedAt: string
}

interface TagsResponse {
  tags: Tag[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function useTagApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = useMemo(() => {
    return async (params?: {
      page?: number
      limit?: number
      search?: string
      sortBy?: string
      sortOrder?: "asc" | "desc"
    }): Promise<TagsResponse | null> => {
      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.set("page", params.page.toString())
        if (params?.limit) searchParams.set("limit", params.limit.toString())
        if (params?.search) searchParams.set("search", params.search)
        if (params?.sortBy) searchParams.set("sortBy", params.sortBy)
        if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder)

        const response = await fetch(`/api/admin/tags?${searchParams}`)

        if (!response.ok) {
          throw new Error("Failed to fetch tags")
        }

        const data = await response.json()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return null
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const createTag = useMemo(() => {
    return async (tagData: {
      name: string
      description?: string
      color?: string
    }): Promise<Tag | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tagData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create tag")
        }

        const data = await response.json()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return null
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const updateTag = useMemo(() => {
    return async (
      id: string,
      tagData: {
        name: string
        description?: string
        color?: string
      },
    ): Promise<Tag | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/admin/tags/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tagData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update tag")
        }

        const data = await response.json()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return null
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const deleteTag = useMemo(() => {
    return async (id: string): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/admin/tags/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete tag")
        }

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return false
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const bulkDeleteTags = useMemo(() => {
    return async (tagIds: string[]): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/tags", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tagIds }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete tags")
        }

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return false
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const cleanupTags = useMemo(() => {
    return async (): Promise<{ deletedCount: number; orphanedTags: string[] } | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/tags/cleanup", {
          method: "POST",
        })

        if (!response.ok) {
          throw new Error("Failed to cleanup tags")
        }

        const data = await response.json()
        return data
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return null
      } finally {
        setLoading(false)
      }
    }
  }, [])

  return {
    loading,
    error,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    bulkDeleteTags,
    cleanupTags,
  }
}
