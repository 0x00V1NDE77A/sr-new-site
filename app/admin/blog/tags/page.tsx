"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useTagApi } from "@/lib/hooks/use-tag-api"
import { Plus, Edit, Trash2, Tag, Hash, Search, TrendingUp, Loader2, AlertTriangle } from "lucide-react"

interface BlogTag {
  _id: string
  name: string
  description: string
  color: string
  postCount: number
  createdAt: string
  updatedAt: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "", color: "#3b82f6" })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("postCount")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const { toast } = useToast()
  const { loading, error, fetchTags, createTag, updateTag, deleteTag, bulkDeleteTags, cleanupTags } = useTagApi()

  const loadTags = async () => {
    const result = await fetchTags({
      page: currentPage,
      limit: 20,
      search: searchTerm,
      sortBy,
      sortOrder,
    })

    if (result) {
      setTags(result.tags)
      setTotalPages(result.pagination.pages)
    }
  }

  useEffect(() => {
    loadTags()
  }, [currentPage, searchTerm, sortBy, sortOrder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTag) {
      // Update existing tag
      const result = await updateTag(editingTag._id, formData)
      if (result) {
        toast({
          title: "Success",
          description: "Tag updated successfully",
        })
        loadTags()
      } else {
        toast({
          title: "Error",
          description: error || "Failed to update tag",
          variant: "destructive",
        })
      }
    } else {
      // Create new tag
      const result = await createTag(formData)
      if (result) {
        toast({
          title: "Success",
          description: "Tag created successfully",
        })
        loadTags()
      } else {
        toast({
          title: "Error",
          description: error || "Failed to create tag",
          variant: "destructive",
        })
      }
    }

    // Reset form
    setFormData({ name: "", description: "", color: "#3b82f6" })
    setEditingTag(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (tag: BlogTag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      description: tag.description || "",
      color: tag.color || "#3b82f6",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (tagId: string) => {
    if (confirm("Are you sure you want to delete this tag? This will remove it from all blog posts.")) {
      const success = await deleteTag(tagId)
      if (success) {
        toast({
          title: "Success",
          description: "Tag deleted successfully",
        })
        loadTags()
      } else {
        toast({
          title: "Error",
          description: error || "Failed to delete tag",
          variant: "destructive",
        })
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTags.length === 0) return

    if (
      confirm(`Are you sure you want to delete ${selectedTags.length} tags? This will remove them from all blog posts.`)
    ) {
      const success = await bulkDeleteTags(selectedTags)
      if (success) {
        toast({
          title: "Success",
          description: `${selectedTags.length} tags deleted successfully`,
        })
        setSelectedTags([])
        loadTags()
      } else {
        toast({
          title: "Error",
          description: error || "Failed to delete tags",
          variant: "destructive",
        })
      }
    }
  }

  const handleCleanup = async () => {
    if (confirm("This will remove all tags with 0 posts. Continue?")) {
      const result = await cleanupTags()
      if (result) {
        toast({
          title: "Success",
          description: `${result.deletedCount} orphaned tags cleaned up`,
        })
        loadTags()
      } else {
        toast({
          title: "Error",
          description: error || "Failed to cleanup tags",
          variant: "destructive",
        })
      }
    }
  }

  const openCreateDialog = () => {
    setEditingTag(null)
    setFormData({ name: "", description: "", color: "#3b82f6" })
    setIsDialogOpen(true)
  }

  const getPopularityLevel = (postCount: number) => {
    if (postCount >= 10) return { label: "High", color: "bg-green-500" }
    if (postCount >= 5) return { label: "Medium", color: "bg-yellow-500" }
    return { label: "Low", color: "bg-gray-500" }
  }

  const toggleTagSelection = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  const toggleSelectAll = () => {
    setSelectedTags(selectedTags.length === tags.length ? [] : tags.map((tag) => tag._id))
  }

  if (loading && tags.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tags</h1>
          <p className="text-muted-foreground">Manage tags to help readers find related content</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedTags.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedTags.length})
            </Button>
          )}
          <Button variant="outline" onClick={handleCleanup}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Cleanup
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingTag ? "Edit Tag" : "Create New Tag"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tag Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter tag name..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingTag ? "Update" : "Create"} Tag
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Hash className="w-4 h-4" />
            {tags.length} tags
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            {tags.reduce((sum, tag) => sum + tag.postCount, 0)} total uses
          </div>
        </div>
      </div>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Popular Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 10).map((tag) => {
              const popularity = getPopularityLevel(tag.postCount)
              return (
                <div key={tag._id} className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-sm"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    #{tag.name}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${popularity.color}`} />
                    <span className="text-xs text-muted-foreground">{tag.postCount}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tags Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            All Tags
            {tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Checkbox checked={selectedTags.length === tags.length} onCheckedChange={toggleSelectAll} />
                <span className="text-sm text-muted-foreground">Select All</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTags.length === tags.length && tags.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Tag</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Popularity</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => {
                  const popularity = getPopularityLevel(tag.postCount)
                  return (
                    <TableRow key={tag._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTags.includes(tag._id)}
                          onCheckedChange={() => toggleTagSelection(tag._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tag.color }} />
                          <div>
                            <div className="font-medium">{tag.name}</div>
                            {tag.description && <div className="text-sm text-muted-foreground">{tag.description}</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{tag.postCount} posts</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${popularity.color}`} />
                          <span className="text-sm">{popularity.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(tag.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(tag)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tag._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
