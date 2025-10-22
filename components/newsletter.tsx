"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const email = formData.get("email") as string
      
      // Mock newsletter subscription - replace with actual implementation
      console.log("Newsletter subscription for:", email)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      setMessage({
        type: "success",
        text: "Thanks for subscribing! You'll receive our latest updates.",
      })

      // Reset form
      const form = document.querySelector("form") as HTMLFormElement
      form?.reset()
    } catch (error) {
      console.error("Newsletter submission error:", error)
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="border-t border-border bg-white">
      <div className="container mx-auto px-5">
        <div className="py-16 text-center">
                     <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter leading-tight mb-4 text-black">
             Stay Updated
           </h2>
           <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest posts delivered
            straight to your inbox.
          </p>

          <form action={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="flex gap-2">
                             <Input
                 type="email"
                 name="email"
                 placeholder="Enter your email"
                 required
                 className="flex-1 bg-gray-800 text-white placeholder-gray-400 border-gray-700"
                 disabled={isSubmitting}
               />
               <Button type="submit" disabled={isSubmitting} className="px-6 bg-black hover:bg-gray-800 text-white">
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.type === "success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {message.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
