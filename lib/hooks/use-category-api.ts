"use client"

import { useState, useMemo } from "react"
import type { Category } from "@/lib/models/blog"

interface CategoriesResponse {
  categories: Category[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function useCategoryApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useMemo(() => {
    return async (params?: {
      page?: number
      limit?: number
      search?: string
      sortBy?: string
      sortOrder?: "asc" | "desc"
    }): Promise<CategoriesResponse | null> => {
      setLoading(true)
      setError(null)

      try {
        const searchParams = new URLSearchParams()
        if (params?.page) searchParams.set("page", params.page.toString())
        if (params?.limit) searchParams.set("limit", params.limit.toString())
        if (params?.search) searchParams.set("search", params.search)
        if (params?.sortBy) searchParams.set("sortBy", params.sortBy)
        if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder)

        const response = await fetch(`/api/admin/categories?${searchParams}`)

        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }

        const data = await response.json()
        return { categories: data }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        return null
      } finally {
        setLoading(false)
      }
    }
  }, [])

  const createCategory = useMemo(() => {
    return async (categoryData: {
      name: string
      description?: string
      color?: string
    }): Promise<Category | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create category")
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

  const updateCategory = useMemo(() => {
    return async (
      id: string,
      categoryData: {
        name: string
        description?: string
        color?: string
      },
    ): Promise<Category | null> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update category")
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

  const deleteCategory = useMemo(() => {
    return async (id: string): Promise<boolean> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete category")
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

  return {
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}
