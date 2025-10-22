"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronDown, Plus, X, Folder, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCategoryApi } from "@/lib/hooks/use-category-api"
import type { Category } from "@/lib/models/blog"
import { toast } from "sonner"

interface CategorySelectorProps {
  selectedCategories: string[]
  onChange: (categories: string[]) => void
  maxSelections?: number
}

export function CategorySelector({ selectedCategories, onChange, maxSelections = 3 }: CategorySelectorProps) {
  const [open, setOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const { fetchCategories, createCategory, loading: apiLoading } = useCategoryApi()

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true)
      const result = await fetchCategories()
      if (result?.categories) {
        setAvailableCategories(result.categories)
      }
      setIsLoadingCategories(false)
    }
    loadCategories()
  }, [fetchCategories])

  const selectedCategoryObjects = availableCategories.filter((cat) => 
    cat._id?.toString() && selectedCategories.includes(cat._id.toString())
  )

  const handleSelect = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter((id) => id !== categoryId))
    } else if (selectedCategories.length < maxSelections) {
      onChange([...selectedCategories, categoryId])
    }
  }

  const handleRemove = (categoryId: string) => {
    onChange(selectedCategories.filter((id) => id !== categoryId))
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName?.trim()) {
      toast.error("Category name is required")
      return
    }
    
    const newCategory = await createCategory({
      name: newCategoryName.trim(),
      description: "",
      color: "#3b82f6"
    })
    
    if (newCategory) {
      setAvailableCategories(prev => [...prev, newCategory])
      toast.success("Category created successfully!")
      setNewCategoryName("")
      setShowCreateForm(false)
    } else {
      toast.error("Failed to create category")
    }
  }

  return (
    <div className="space-y-3">
      <Label>Categories</Label>

      {/* Selected Categories */}
      {selectedCategoryObjects.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategoryObjects.map((category) => (
            <Badge key={category._id?.toString() || category.name} variant="secondary" className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color || "#3b82f6" }} />
              {category.name || "Unnamed Category"}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(category._id?.toString() || "")}
                className="w-4 h-4 p-0 hover:bg-transparent"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Category Selector */}
             <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between w-full bg-transparent"
            disabled={selectedCategories.length >= maxSelections}
          >
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              {selectedCategories.length === 0
                ? "Select categories..."
                : `${selectedCategories.length}/${maxSelections} selected`}
            </div>
            <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
                 </PopoverTrigger>
         <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              {isLoadingCategories ? (
                <div className="p-4 text-center">
                  <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading categories...</p>
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    <div className="p-4 text-center">
                      <p className="mb-2 text-sm text-muted-foreground">No categories found.</p>
                      <Button variant="outline" size="sm" onClick={() => setShowCreateForm(true)} className="text-xs">
                        <Plus className="w-3 h-3 mr-1" />
                        Create New
                      </Button>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {availableCategories.map((category) => (
                      <CommandItem
                        key={category._id?.toString() || category.name}
                        value={category.name}
                        onSelect={() => handleSelect(category._id?.toString() || "")}
                        className="flex items-center gap-3"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategories.includes(category._id?.toString() || "") ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color || "#3b82f6" }} />
                                            <div className="flex-1">
                      <div className="font-medium">{category.name || "Unnamed Category"}</div>
                      {category.description && (
                        <div className="text-xs text-muted-foreground">{category.description}</div>
                      )}
                    </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

              {/* Create New Category Form */}
              {showCreateForm && (
                <div className="p-3 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="new-category" className="text-xs">
                      Create New Category
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="new-category"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category name..."
                        className="text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleCreateCategory()
                          }
                        }}
                      />
                      <Button size="sm" onClick={handleCreateCategory} disabled={apiLoading}>
                        {apiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CommandList>
          </Command>
                 </PopoverContent>
       </Popover>

      <p className="text-xs text-muted-foreground">
        {maxSelections === 1 
          ? "Select a category for your blog post. Categories help readers find related content."
          : `Select up to ${maxSelections} categories. Categories help readers find related content.`
        }
      </p>
    </div>
  )
}
