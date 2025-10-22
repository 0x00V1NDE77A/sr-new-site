"use client"

import { useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Globe,
} from "lucide-react"

interface SEOData {
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

interface SEOPanelProps {
  seo: SEOData
  onChange: (seo: SEOData) => void
  title: string
  excerpt: string
}

export function SEOPanel({ seo, onChange, title, excerpt }: SEOPanelProps) {
  // Create a stable onChange handler to prevent infinite loops
  const stableOnChange = useCallback((newSeo: SEOData) => {
    onChange(newSeo)
  }, [onChange])

  // Character limits
  const limits = {
    title: 60,
    description: 160,
  }


  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Engine Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          {/* Basic SEO */}
                     <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Globe className="w-5 h-5" />
                 Search Engine Optimization
               </CardTitle>
               <p className="text-sm text-muted-foreground">
                 These settings control how your blog post appears in search engine results like Google, Bing, etc.
               </p>
             </CardHeader>
            <CardContent className="space-y-4">
                             <div className="space-y-2">
                 <Label htmlFor="seo-title">SEO Title</Label>
                 <p className="text-xs text-muted-foreground">
                   This title appears in search engine results. Leave empty to use the main blog title.
                 </p>
                 <div className="space-y-1">
                   <Input
                     id="seo-title"
                     value={seo.metaTitle || ""}
                     onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                       const newValue = e.target.value
                       if (seo.metaTitle !== newValue) {
                         stableOnChange({ ...seo, metaTitle: newValue })
                       }
                     }, [seo.metaTitle, stableOnChange])}
                     placeholder={title || "Enter SEO title..."}
                     maxLength={limits.title + 10}
                   />
                   <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">
                       {seo.metaTitle?.length || 0}/{limits.title} characters
                     </span>
                     <Badge variant={(seo.metaTitle?.length || 0) <= limits.title ? "secondary" : "destructive"} className="text-xs">
                       {(seo.metaTitle?.length || 0) <= limits.title ? "Good" : "Too long"}
                     </Badge>
                   </div>
                 </div>
               </div>

                             <div className="space-y-2">
                 <Label htmlFor="seo-description">Meta Description</Label>
                 <p className="text-xs text-muted-foreground">
                   This description appears below the title in search engine results. Leave empty to use the main excerpt.
                 </p>
                 <div className="space-y-1">
                   <Textarea
                     id="seo-description"
                     value={seo.metaDescription || ""}
                     onChange={useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
                       const newValue = e.target.value
                       if (seo.metaDescription !== newValue) {
                         stableOnChange({ ...seo, metaDescription: newValue })
                       }
                     }, [seo.metaDescription, stableOnChange])}
                     placeholder={excerpt || "Enter meta description..."}
                     rows={3}
                     maxLength={limits.description + 20}
                   />
                   <div className="flex justify-between text-xs">
                     <span className="text-muted-foreground">
                       {seo.metaDescription?.length || 0}/{limits.description} characters
                     </span>
                     <Badge
                       variant={(seo.metaDescription?.length || 0) <= limits.description ? "secondary" : "destructive"}
                       className="text-xs"
                     >
                       {(seo.metaDescription?.length || 0) <= limits.description ? "Good" : "Too long"}
                     </Badge>
                   </div>
                 </div>
               </div>

                             <div className="space-y-2">
                 <Label htmlFor="seo-keywords">SEO Keywords</Label>
                 <Textarea
                   id="seo-keywords"
                   value={seo.keywords.join(", ")}
                   onChange={useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
                     const keywordsText = e.target.value
                     const keywordsArray = keywordsText
                       .split(",")
                       .map(k => k.trim())
                       .filter(k => k.length > 0)
                     
                     if (JSON.stringify(seo.keywords) !== JSON.stringify(keywordsArray)) {
                       stableOnChange({ ...seo, keywords: keywordsArray })
                     }
                   }, [seo.keywords, stableOnChange])}
                   placeholder="Enter SEO keywords separated by commas (e.g., web development, React, Next.js)"
                   rows={2}
                 />
                 <p className="text-xs text-muted-foreground">
                   Add 3-5 relevant keywords separated by commas for better search rankings
                 </p>
               </div>
            </CardContent>
          </Card>

          {/* Search Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Search Result Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="space-y-1">
                  <div className="text-lg text-blue-600 cursor-pointer hover:underline">
                    {seo.metaTitle || title || "Your Blog Post Title"}
                  </div>
                  <div className="text-sm text-green-700">yoursite.com/blog/your-post-slug</div>
                  <div className="text-sm text-gray-600">
                    {seo.metaDescription || excerpt || "Your meta description will appear here..."}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
