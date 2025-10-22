"use client"

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { BreadcrumbSchema } from '@/components/structured-data/breadcrumb-schema'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [
    { name: 'Home', href: '/' },
    ...items
  ]

  return (
    <>
      {/* Breadcrumb Schema for SEO */}
      <BreadcrumbSchema items={allItems} />
      
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="flex items-center hover:text-white transition-colors">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4" />
            {index === items.length - 1 ? (
              <span className="text-white font-medium">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}
