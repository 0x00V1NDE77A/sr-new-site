"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useBlogApi } from "@/lib/hooks/use-blog-api"
import { Upload, ImageIcon, X, Link, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface MediaUploadProps {
  value: string
  onChange: (url: string) => void
  type: "image" | "video" | "audio"
}

export function MediaUpload({ value, onChange, type }: MediaUploadProps) {
  const { uploadImage, loading } = useBlogApi()
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload")
  const [urlInput, setUrlInput] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    // Validate file type
    const validTypes = {
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      video: ["video/mp4", "video/webm", "video/ogg"],
      audio: ["audio/mp3", "audio/wav", "audio/ogg"],
    }

    if (!validTypes[type].includes(file.type)) {
      toast.error(`Invalid file type. Please upload a valid ${type} file.`)
      return
    }

    try {
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const result = await uploadImage(file)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result) {
        onChange(result.url)
      }
      toast.success("File uploaded successfully!")

      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000)
    } catch (error) {
      setUploadProgress(0)
      toast.error("Failed to upload file. Please try again.")
      console.error("Upload error:", error)
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file) {
      handleFileUpload(file)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      // Basic URL validation
      try {
        new URL(urlInput.trim())
        onChange(urlInput.trim())
        setUrlInput("")
        toast.success("Media URL added successfully!")
      } catch {
        toast.error("Please enter a valid URL")
      }
    }
  }

  const removeMedia = () => {
    onChange("")
    toast.success("Media removed")
  }

  if (value) {
    return (
      <Card className="p-4 bg-black border-white/20">
        <div className="relative">
          {type === "image" && (
            <img
              src={value || "/placeholder.svg"}
              alt="Uploaded media"
              className="object-cover w-full h-48 rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/abstract-geometric-placeholder.png"
              }}
            />
          )}
          {type === "video" && <video src={value} className="object-cover w-full h-48 rounded-md" controls />}
          {type === "audio" && (
            <div className="flex items-center justify-center h-24 bg-white/5 rounded-md">
              <audio src={value} controls className="w-full" />
            </div>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={removeMedia}
            className="absolute top-2 right-2"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 text-sm text-white/60 truncate">{value}</div>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-black border-white/20">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant={uploadMethod === "upload" ? "default" : "outline"}
            onClick={() => setUploadMethod("upload")}
            size="sm"
            className={uploadMethod === "upload" ? "bg-accent" : "border-white/20 hover:bg-white/10 text-white"}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </Button>
          <Button
            variant={uploadMethod === "url" ? "default" : "outline"}
            onClick={() => setUploadMethod("url")}
            size="sm"
            className={uploadMethod === "url" ? "bg-accent" : "border-white/20 hover:bg-white/10 text-white"}
          >
            <Link className="w-4 h-4 mr-2" />
            From URL
          </Button>
        </div>

        {uploadMethod === "upload" ? (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? "border-accent bg-accent/10" : "border-white/20 hover:border-white/40"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {loading ? (
                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 mx-auto animate-spin text-accent" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Uploading {type}...</p>
                    <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                    <p className="text-xs text-white/60">{uploadProgress}% complete</p>
                  </div>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-white/60" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-white">Drop your {type} here, or click to browse</p>
                    <p className="text-xs text-white/60">
                      Supports{" "}
                      {type === "image" ? "JPG, PNG, GIF, WebP" : type === "video" ? "MP4, WebM, OGG" : "MP3, WAV, OGG"}{" "}
                      up to 10MB
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept={type === "image" ? "image/*" : type === "video" ? "video/*" : "audio/*"}
                    onChange={handleFileInputChange}
                    className="mt-4 text-white bg-black border-white/20 file:bg-white/10 file:text-white file:border-0 focus:border-white/40"
                    disabled={loading}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="media-url" className="text-white/80">
              Media URL
            </Label>
            <div className="flex gap-2">
              <Input
                id="media-url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={`Enter ${type} URL...`}
                className="text-white bg-black border-white/20 placeholder:text-white/40 focus:border-white/40"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUrlSubmit()
                  }
                }}
              />
              <Button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim() || loading}
                className="bg-accent hover:bg-accent/90"
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
