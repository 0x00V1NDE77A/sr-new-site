"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface GalleryItem {
  id: string
  title: string
  description: string
  href: string
  image: string
}

interface Gallery4Props {
  title: string
  description: string
  items: GalleryItem[]
  className?: string
}

export function Gallery4({ title, description, items, className }: Gallery4Props) {
  return (
    <section className={cn("w-full py-12 md:py-24 lg:py-32 bg-white", className)}>
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif text-black">
              {title}
            </h2>
            <p className="mx-auto max-w-[700px] text-lg text-gray-600">
              {description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GalleryCard({ item }: { item: GalleryItem }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={item.href}
      className="group relative overflow-hidden rounded-lg border bg-background shadow-md transition-all hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className={cn(
            "object-cover transition-transform duration-300",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-bold mb-2 transition-transform duration-300 group-hover:translate-x-1">
          {item.title}
        </h3>
        <p className="text-sm text-gray-200 line-clamp-3">
          {item.description}
        </p>
      </div>
      <div className="absolute top-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}

