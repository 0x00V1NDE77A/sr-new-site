"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Tag, Folder, Search, Loader2 } from "lucide-react"
import { useCategoryApi } from "@/lib/hooks/use-category-api"
import type { Category } from "@/lib/models/blog"
import { toast } from "sonner"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const { fetchCategories, createCategory, updateCategory, deleteCategory, loading: apiLoading, error: apiError } = useCategoryApi()

  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  })

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true)
      const result = await fetchCategories()
      if (result?.categories) {
        setCategories(result.categories)
      }
      setIsLoading(false)
    }
    loadCategories()
  }, [fetchCategories])

  const colorOptions = [
    { value: "#3b82f6", label: "Blue" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#10b981", label: "Green" },
    { value: "#f59e0b", label: "Yellow" },
    { value: "#ef4444", label: "Red" },
    { value: "#6b7280", label: "Gray" },
  ]

  const filteredCategories = categories.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false,
  )

  const generateSlug = (name: string) => {
    if (!name) return ""
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      toast.error("Category name is required")
      return
    }

    // Check for duplicate names (case insensitive)
    const existingCategory = categories.find(
      cat => cat.name.toLowerCase() === formData.name.trim().toLowerCase() && 
      cat._id?.toString() !== editingCategory?._id?.toString()
    )
    
    if (existingCategory) {
      toast.error("A category with this name already exists")
      return
    }

    try {
      if (editingCategory) {
        // Update existing category
        const updatedCategory = await updateCategory(editingCategory._id?.toString() || "", {
          name: formData.name.trim(),
          description: formData.description?.trim() || "",
          color: formData.color,
        })
        
        if (updatedCategory) {
          setCategories(categories.map(cat => 
            cat._id?.toString() === editingCategory._id?.toString() ? updatedCategory : cat
          ))
          toast.success("Category updated successfully!")
        } else {
          toast.error("Failed to update category")
          return
        }
      } else {
        // Create new category
        const newCategory = await createCategory({
          name: formData.name.trim(),
          description: formData.description?.trim() || "",
          color: formData.color,
        })
        
        if (newCategory) {
          setCategories([...categories, newCategory])
          toast.success("Category created successfully!")
        } else {
          toast.error("Failed to create category")
          return
        }
      }

      // Reset form
      setFormData({ name: "", description: "", color: "#3b82f6" })
      setEditingCategory(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Category save error:", error)
      toast.error("An error occurred while saving the category")
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (categoryId: string) => {
    const category = categories.find(cat => cat._id?.toString() === categoryId)
    const categoryName = category?.name || "this category"
    
    if (confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      const success = await deleteCategory(categoryId)
      if (success) {
        setCategories(categories.filter((cat) => cat._id?.toString() !== categoryId))
        toast.success(`Category "${categoryName}" deleted successfully!`)
      } else {
        toast.error("Failed to delete category")
      }
    }
  }

  const openCreateDialog = () => {
    setEditingCategory(null)
    setFormData({ name: "", description: "", color: "#3b82f6" })
    setIsDialogOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Organize your blog posts with categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter category name..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this category..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={apiLoading}>
                  {apiLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {editingCategory ? "Update" : "Create"} Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Display */}
      {apiError && (
        <div className="p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
          <p className="font-medium">Error: {apiError}</p>
        </div>
      )}

      {/* Search and Stats */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Folder className="w-4 h-4" />
            {categories.length} categories
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            {categories.reduce((sum, cat) => sum + (cat.postCount || 0), 0)} total posts
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading categories...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category._id?.toString() || category.name}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color || "#3b82f6" }} />
                          <div>
                            <div className="font-medium">{category.name || "Unnamed Category"}</div>
                            <div className="text-sm text-muted-foreground">/{category.slug || "no-slug"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{category.description || "No description"}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{category.postCount || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category._id?.toString() || "")}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
