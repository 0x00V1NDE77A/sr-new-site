"use client"

import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronDown, Plus, X, Tag, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTagApi } from "@/lib/hooks/use-blog-api"
import { toast } from "sonner"

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

export function TagsInput({ value, onChange, placeholder = "Add tags...", maxTags = 10 }: TagsInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false)
  const [availableTags, setAvailableTags] = useState<Array<{ name: string; postCount: number }>>([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  const [internalTags, setInternalTags] = useState(value)
  const lastTagsRef = useRef<string>(JSON.stringify(value))
  const onChangeRef = useRef(onChange)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { fetchTags, createTag, loading: apiLoading } = useTagApi()

  // Keep refs in sync
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  // Keep internal tags in sync with external value
  useEffect(() => {
    const currentTagsString = JSON.stringify(value)
    if (lastTagsRef.current !== currentTagsString) {
      lastTagsRef.current = currentTagsString
      setInternalTags(value)
    }
  }, [value])

  // Fetch tags on component mount
  useEffect(() => {
    const loadTags = async () => {
      setIsLoadingTags(true)
      const result = await fetchTags()
      if (result?.tags) {
        setAvailableTags(result.tags.map(tag => ({ name: tag.name, postCount: tag.postCount })))
      }
      setIsLoadingTags(false)
    }
    loadTags()
  }, [fetchTags])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !internalTags.includes(trimmedTag) && internalTags.length < maxTags) {
      const newTags = [...internalTags, trimmedTag]
      setInternalTags(newTags)
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Debounce the onChange call to prevent infinite loops
      timeoutRef.current = setTimeout(() => {
        onChangeRef.current(newTags)
      }, 100)
    }
    setInputValue("")
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = internalTags.filter((tag) => tag !== tagToRemove)
    setInternalTags(newTags)
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    // Debounce the onChange call to prevent infinite loops
    timeoutRef.current = setTimeout(() => {
      onChangeRef.current(newTags)
    }, 100)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && internalTags.length > 0) {
      removeTag(internalTags[internalTags.length - 1])
    }
  }

  const handleSelectTag = (tagName: string) => {
    if (!internalTags.includes(tagName) && internalTags.length < maxTags) {
      const newTags = [...internalTags, tagName]
      setInternalTags(newTags)
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      // Debounce the onChange call to prevent infinite loops
      timeoutRef.current = setTimeout(() => {
        onChangeRef.current(newTags)
      }, 100)
    }
    setOpen(false)
  }

  const handleCreateTag = async () => {
    if (!inputValue?.trim()) {
      toast.error("Tag name is required")
      return
    }
    
    const newTag = await createTag({
      name: inputValue.trim(),
      description: "",
      color: "#3b82f6"
    })
    
    if (newTag) {
      setAvailableTags(prev => [...prev, { name: newTag.name, postCount: 0 }])
      addTag(newTag.name)
      toast.success("Tag created successfully!")
      setOpen(false)
    } else {
      toast.error("Failed to create tag")
    }
  }

  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(inputValue.toLowerCase()) && !internalTags.includes(tag.name)
  )

  return (
    <div className="space-y-2">
      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2">
        {internalTags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            #{tag}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTag(tag)}
              className="w-4 h-4 p-0 hover:bg-transparent"
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ))}
      </div>

             {/* Tag Selector */}
               <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
           <Button
             variant="outline"
             role="combobox"
             aria-expanded={open}
             className="justify-between w-full bg-black border-white/20 text-white hover:bg-white/10"
             disabled={internalTags.length >= maxTags}
           >
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {internalTags.length === 0
                ? "Select or create tags..."
                : `${internalTags.length}/${maxTags} tags selected`}
            </div>
            <ChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
          </Button>
                  </PopoverTrigger>
                          <PopoverContent className="w-full p-0 bg-black border-white/20" align="start">
          <Command className="bg-black">
             <CommandInput 
               placeholder="Search or create tags..." 
               value={inputValue}
               onValueChange={setInputValue}
                               className="bg-black border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
             />
            <CommandList>
              {isLoadingTags ? (
                <div className="p-4 text-center">
                  <Loader2 className="w-4 h-4 mx-auto animate-spin" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading tags...</p>
                </div>
              ) : (
                <>
                                     <CommandEmpty>
                     <div className="p-4 text-center">
                       <p className="mb-2 text-sm text-gray-400">No tags found.</p>
                       <Button 
                         variant="outline" 
                         size="sm" 
                         onClick={handleCreateTag}
                         disabled={apiLoading || !inputValue.trim()}
                         className="text-xs bg-black border-white/20 text-white hover:bg-white/10"
                       >
                        {apiLoading ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Plus className="w-3 h-3 mr-1" />}
                        Create "{inputValue.trim()}"
                      </Button>
                    </div>
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredTags.map((tag) => (
                      <CommandItem
                        key={tag.name}
                        value={tag.name}
                        onSelect={() => handleSelectTag(tag.name)}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-4 h-4 mr-2 opacity-0" />
                        <div className="flex-1">
                          <div className="font-medium">#{tag.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {tag.postCount} post{tag.postCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <p className="text-xs text-muted-foreground">
        Select from existing tags or create new ones. Press Enter or comma to add manually.
      </p>
    </div>
  )
}
