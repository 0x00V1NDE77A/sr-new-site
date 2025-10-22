import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert blog content blocks to HTML
export function convertContentBlocksToHTML(content: any[]): string {
  if (!Array.isArray(content)) {
    return "<p>Content not available</p>"
  }

  return content
    .map((block) => {
      // Skip blocks with no content or invalid structure
      if (!block || !block.type || !block.content) {
        return ""
      }

      // Clean and escape content
      const cleanContent = String(block.content).trim()
      if (!cleanContent) return ""

      switch (block.type) {
        case "paragraph":
          return `<p class="mb-4 leading-relaxed text-gray-800 dark:text-gray-200">${cleanContent}</p>`
        
        case "heading":
          const level = Math.min(Math.max(block.metadata?.level || 2, 1), 6) // Ensure level is 1-6
          const headingClass = level === 1 ? "text-4xl font-bold mb-8 text-gray-900 dark:text-white" : 
                              level === 2 ? "text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100" :
                              level === 3 ? "text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100" :
                              level === 4 ? "text-xl font-medium mb-3 text-gray-700 dark:text-gray-200" :
                              "text-lg font-medium mb-2 text-gray-700 dark:text-gray-200"
          return `<h${level} class="${headingClass}">${cleanContent}</h${level}>`
        
        case "image":
          const imageClass = "w-full h-auto rounded-lg my-6 shadow-lg"
          const caption = block.metadata?.caption ? `<figcaption class="text-center text-sm text-gray-600 dark:text-gray-400 mt-2 italic">${block.metadata.caption}</figcaption>` : ""
          const altText = block.metadata?.alt || cleanContent.split('/').pop()?.split('.')[0] || 'Blog image'
          return `<figure class="my-6"><img src="${cleanContent}" alt="${altText}" class="${imageClass}" loading="lazy" />${caption}</figure>`
        
        case "quote":
          return `<blockquote class="border-l-4 border-blue-500 pl-6 my-6 italic text-lg !text-gray-900 dark:!text-gray-900 bg-gray-50 dark:bg-gray-100 py-4 rounded-r-lg" style="color: #111827 !important;">${cleanContent}</blockquote>`
        
        case "list":
          const listType = block.metadata?.listType === "ordered" ? "ol" : "ul"
          const listClass = "my-4 ml-6 space-y-2"
          const items = cleanContent.split('\n')
            .filter(item => item.trim())
            .map(item => `<li class="text-gray-700 dark:text-gray-300">${item.trim()}</li>`)
            .join('')
          return `<${listType} class="${listClass}">${items}</${listType}>`
        
        case "code":
          const language = block.metadata?.language || "text"
          const codeClass = "bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-6 font-mono text-sm border border-gray-700"
          return `<pre class="${codeClass}"><code class="language-${language}">${cleanContent}</code></pre>`
        
        default:
          return `<p class="mb-4 text-gray-700 dark:text-gray-300">${cleanContent}</p>`
      }
    })
    .filter(html => html.trim()) // Remove empty blocks
    .join('')
}
