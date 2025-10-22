"use client"

import { useState, useCallback } from "react"

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

  const fetchTags = useCallback(
    async (params?: {
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
    },
    [],
  )

  const createTag = useCallback(
    async (tagData: {
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
    },
    [],
  )

  const updateTag = useCallback(
    async (
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
    },
    [],
  )

  const deleteTag = useCallback(async (id: string): Promise<boolean> => {
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
  }, [])

  const bulkDeleteTags = useCallback(async (tagIds: string[]): Promise<boolean> => {
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
  }, [])

  const cleanupTags = useCallback(async (): Promise<{ deletedCount: number; orphanedTags: string[] } | null> => {
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
