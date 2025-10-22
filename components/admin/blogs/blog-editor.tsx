"use client"

import React from "react"
import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MediaUpload } from "./media-upload"
import { List, Quote, Code, ImageIcon, Plus, GripVertical, Trash2, Type } from "lucide-react"

interface ContentBlock {
  id: string
  type: "paragraph" | "heading" | "image" | "quote" | "list" | "code"
  content: string
  metadata?: {
    level?: number
    listType?: "ordered" | "unordered"
    alignment?: "left" | "center" | "right"
    fontSize?: string
    fontWeight?: string
    caption?: string
  }
}

interface BlogEditorProps {
  content: ContentBlock[]
  onChange: (content: ContentBlock[]) => void
}

const ContentBlockComponent = memo(
  ({
    block,
    onUpdate,
    onDelete,
    onAddAfter,
    onMove,
  }: {
    block: ContentBlock
    onUpdate: (id: string, updates: Partial<ContentBlock>) => void
    onDelete: (id: string) => void
    onAddAfter: (type: ContentBlock["type"], afterId: string) => void
    onMove: (draggedId: string, targetId: string) => void
  }) => {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData("text/plain", block.id)
      setIsDragging(true)
    }

    const handleDragEnd = () => {
      setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      const draggedId = e.dataTransfer.getData("text/plain")
      if (draggedId !== block.id) {
        onMove(draggedId, block.id)
      }
    }

    const commonProps = {
      value: block.content,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        onUpdate(block.id, { content: e.target.value }),
      className:
        "border-0 focus:ring-0 resize-none bg-transparent text-white placeholder:text-gray-400 focus:outline-none",
      placeholder: getPlaceholder(block.type),
    }

    const renderBlockContent = () => {
      switch (block.type) {
        case "heading":
          return (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Select
                  value={block.metadata?.level?.toString() || "2"}
                  onValueChange={(value) =>
                    onUpdate(block.id, {
                      metadata: { ...block.metadata, level: Number.parseInt(value) },
                    })
                  }
                >
                  <SelectTrigger className="w-20 text-white bg-black border-white/20 focus:border-white/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="1">H1</SelectItem>
                    <SelectItem value="2">H2</SelectItem>
                    <SelectItem value="3">H3</SelectItem>
                    <SelectItem value="4">H4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                {...commonProps}
                className={`text-${getHeadingSize(block.metadata?.level || 2)} font-bold bg-transparent text-white`}
              />
            </div>
          )

        case "image":
          return (
            <div className="space-y-3">
              <MediaUpload
                value={block.content}
                onChange={(url) => onUpdate(block.id, { content: url })}
                type="image"
              />
              <Input
                placeholder="Image caption (optional)"
                value={block.metadata?.caption || ""}
                onChange={(e) =>
                  onUpdate(block.id, {
                    metadata: { ...block.metadata, caption: e.target.value },
                  })
                }
                className="text-white bg-black border-white/20 placeholder:text-white/40 focus:border-white/40"
              />
            </div>
          )

        case "quote":
          return (
            <div className="p-4 pl-4 border-l-4 rounded-r-lg border-accent bg-white/5">
              <Textarea {...commonProps} className="text-lg italic text-white bg-transparent" rows={3} />
            </div>
          )

        case "code":
          return (
            <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
              <Textarea {...commonProps} className="font-mono text-sm text-green-400 bg-transparent" rows={4} />
            </div>
          )

        case "list":
          return (
            <div className="space-y-3">
              <Select
                value={block.metadata?.listType || "unordered"}
                onValueChange={(value) =>
                  onUpdate(block.id, {
                    metadata: { ...block.metadata, listType: value as "ordered" | "unordered" },
                  })
                }
              >
                <SelectTrigger className="w-32 text-white bg-black border-white/20 focus:border-white/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="unordered">Bullet</SelectItem>
                  <SelectItem value="ordered">Numbered</SelectItem>
                </SelectContent>
              </Select>
              <Textarea {...commonProps} placeholder="• Item 1&#10;• Item 2&#10;• Item 3" rows={4} />
            </div>
          )

        default:
          return <Textarea {...commonProps} rows={3} className="min-h-[80px] bg-transparent text-white" />
      }
    }

    return (
      <Card
        className={`content-block p-4 sm:p-6 group hover:shadow-lg transition-all duration-200 bg-black border-white/20 hover:border-white/40 ${
          isDragging ? "opacity-50" : ""
        }`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-2 transition-opacity duration-200 opacity-0 group-hover:opacity-100">
            <GripVertical className="w-4 h-4 text-white/60 cursor-grab hover:text-white" />
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(block.id)
              }}
              className="w-6 h-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            {renderBlockContent()}

            <div className="flex flex-wrap items-center gap-2 pt-2 transition-opacity duration-200 border-t border-white/20 opacity-0 group-hover:opacity-100">
              <span className="mr-2 text-xs text-white/60">Add:</span>
              {[
                { type: "paragraph", icon: Type, label: "Text" },
                { type: "heading", icon: Type, label: "Heading" },
                { type: "image", icon: ImageIcon, label: "Image" },
                { type: "quote", icon: Quote, label: "Quote" },
                { type: "list", icon: List, label: "List" },
                { type: "code", icon: Code, label: "Code" },
              ].map(({ type, icon: Icon, label }) => (
                <Button
                  key={type}
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddAfter(type as ContentBlock["type"], block.id)}
                  className="px-2 text-xs text-white/70 h-7 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  },
)

ContentBlockComponent.displayName = "ContentBlockComponent"

export function BlogEditor({ content, onChange }: BlogEditorProps) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    content.length > 0 ? content : [{ id: "1", type: "paragraph", content: "" }],
  )
  const isInitialMount = React.useRef(true)
  const isUpdatingFromParent = React.useRef(false)
  const onChangeRef = React.useRef(onChange)
  const lastBlocksRef = React.useRef<string>(JSON.stringify(blocks))

  const addBlock = useCallback((type: ContentBlock["type"], afterId?: string) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: "",
      metadata: type === "heading" ? { level: 2 } : undefined,
    }

    setBlocks((prev) => {
      let newBlocks;
      if (afterId) {
        const index = prev.findIndex((block) => block.id === afterId)
        newBlocks = [...prev]
        newBlocks.splice(index + 1, 0, newBlock)
      } else {
        newBlocks = [...prev, newBlock]
      }
      
      // Ensure onChange is called immediately for new blocks
      setTimeout(() => {
        if (onChangeRef.current) {
          onChangeRef.current(newBlocks)
        }
      }, 0)
      
      return newBlocks
    })
  }, [])

  const updateBlock = useCallback(
    (id: string, updates: Partial<ContentBlock>) => {
      setBlocks((prev) => {
        const newBlocks = prev.map((block) => (block.id === id ? { ...block, ...updates } : block))
        
        // Ensure onChange is called immediately for block updates
        setTimeout(() => {
          if (onChangeRef.current) {
            onChangeRef.current(newBlocks)
          }
        }, 0)
        
        return newBlocks
      })
    },
    [],
  )

  const deleteBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => {
        const newBlocks = prev.length > 1 ? prev.filter((block) => block.id !== id) : prev
        
        // Ensure onChange is called immediately for block deletions
        setTimeout(() => {
          if (onChangeRef.current) {
            onChangeRef.current(newBlocks)
          }
        }, 0)
        
        return newBlocks
      })
    },
    [],
  )

  const moveBlock = useCallback(
    (draggedId: string, targetId: string) => {
      setBlocks((prev) => {
        const draggedIndex = prev.findIndex((block) => block.id === draggedId)
        const targetIndex = prev.findIndex((block) => block.id === targetId)

        if (draggedIndex === -1 || targetIndex === -1) return prev

        const newBlocks = [...prev]
        const [draggedBlock] = newBlocks.splice(draggedIndex, 1)
        newBlocks.splice(targetIndex, 0, draggedBlock)

        return newBlocks
      })
    },
    [],
  )

  // Keep onChange ref up to date - only when it actually changes
  React.useEffect(() => {
    if (onChangeRef.current !== onChange) {
      onChangeRef.current = onChange
    }
  }, [onChange])
  
  // Keep lastBlocksRef in sync
  React.useEffect(() => {
    lastBlocksRef.current = JSON.stringify(blocks)
  }, [blocks])

  // Update blocks when content prop changes (from parent)
  React.useEffect(() => {
    if (content.length > 0) {
      isUpdatingFromParent.current = true
      setBlocks(content)
      isUpdatingFromParent.current = false
    }
  }, [content])

  // Call onChange when blocks change, but prevent infinite loops
  React.useEffect(() => {
    // Skip the first render to prevent infinite loops
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    
    // Don't call onChange if we're updating from parent
    if (!isUpdatingFromParent.current) {
      // Only call onChange if blocks have actually changed
      const currentBlocksString = JSON.stringify(blocks)
      if (onChangeRef.current && currentBlocksString !== lastBlocksRef.current) {
        lastBlocksRef.current = currentBlocksString
        onChangeRef.current(blocks)
      }
    }
  }, [blocks]) // Stable dependencies to prevent infinite loops

  return (
    <div className="space-y-4 max-w-none">
      {blocks.map((block) => (
        <ContentBlockComponent
          key={block.id}
          block={block}
          onUpdate={updateBlock}
          onDelete={deleteBlock}
          onAddAfter={addBlock}
          onMove={moveBlock}
        />
      ))}

      <Card className="p-6 transition-colors duration-200 border-white/20 border-dashed bg-white/5 hover:bg-white/10">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Plus className="w-6 h-6 text-white/60" />
          <p className="text-sm text-white/70">Use the "Add" buttons above to insert content blocks</p>
          <p className="text-xs text-white/50">Or drag and drop to reorder existing blocks</p>
        </div>
      </Card>

      {/* Help Text */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/20">
        <h4 className="text-sm font-medium text-white/80 mb-2">💡 Content Editor Tips:</h4>
        <ul className="text-xs text-white/60 space-y-1">
          <li>• Drag and drop blocks to reorder them</li>
          <li>• Use the "Add" buttons to insert new content types</li>
          <li>• Hover over blocks to see controls</li>
          <li>• Each block type has specific formatting options</li>
          <li>• <strong>Keyboard shortcuts:</strong></li>
          <li>  - Ctrl+Enter: Add new paragraph</li>
          <li>  - Ctrl+Shift+H: Add heading</li>
          <li>  - Ctrl+Shift+I: Add image</li>
          <li>  - Ctrl+Delete: Delete block</li>
        </ul>
      </div>
    </div>
  )
}

// Helper functions
function getPlaceholder(type: ContentBlock["type"]) {
  switch (type) {
    case "heading":
      return "Enter heading..."
    case "paragraph":
      return "Start writing your content..."
    case "quote":
      return "Enter quote..."
    case "code":
      return "Enter code..."
    case "list":
      return "Enter list items..."
    default:
      return "Enter content..."
  }
}
function getHeadingSize(level: number) {
  switch (level) {
    case 1:
      return "4xl"
    case 2:
      return "3xl"
    case 3:
      return "2xl"
    case 4:
      return "xl"
    default:
      return "2xl"
  }
}

