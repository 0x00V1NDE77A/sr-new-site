"use client"

import { useState } from "react"
import { Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { name: "Home", href: "/", hasDropdown: false },
    { name: "Services", href: "/services", hasDropdown: false },
    { name: "About", href: "/about", hasDropdown: false },
    { name: "Team", href: "/team", hasDropdown: false },
    { name: "Contact", href: "/contact", hasDropdown: false },
    { name: "Blogs", href: "/blogs", hasDropdown: false },
  ]

  // no hierarchical panels in the simplified version

  return (
    <nav className="border-b bg-background border-border">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 relative">
          {/* Logo - Absolute positioned left */}
          <div className="absolute left-0 flex-shrink-0">
            <Link href="/">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-muted transition-colors duration-200">
                <Image
                  src="/logo.png"
                  alt="SR Holding Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Perfectly Centered */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <div key={item.name} className="relative group">
                  <Link href={item.href}>
                    <button className="px-3 py-2 text-sm font-medium transition-colors duration-200 text-foreground hover:text-muted-foreground">
                      {item.name}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button - Absolute positioned right */}
          <div className="absolute right-0 md:hidden">
            <Button
              aria-label="Open menu"
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-foreground hover:text-muted-foreground hover:bg-muted"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Simplified luxe sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-full p-0 sm:max-w-sm">
          <motion.div 
            className="flex h-full flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Header inside sheet */}
            <motion.div 
              className="flex items-center justify-between px-6 py-4 border-b border-border/70"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-2">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                >
                  <Image
                    src="/logo.png"
                    alt="SR Holding Logo"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                </motion.div>
                <motion.span 
                  className="text-sm tracking-[0.2em] uppercase text-muted-foreground"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                >
                  SR Holding
                </motion.span>
              </Link>
            </motion.div>

            {/* Navigation list */}
            <div className="divide-y divide-border/70">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: 0.2 + (index * 0.1), 
                    ease: "easeOut" 
                  }}
                  whileHover={{ x: 10, backgroundColor: "rgba(var(--muted), 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-6 py-5 transition-colors"
                  >
                    <span className="text-xl font-medium tracking-wide text-foreground">{item.name}</span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Footer CTA */}
            <motion.div 
              className="mt-auto px-6 py-6 border-t border-border/70"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8, ease: "easeOut" }}
            >
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button size="lg" className="w-full h-12 text-base tracking-wide">
                    Contact a Specialist
                  </Button>
                </motion.div>
              </Link>
              <motion.p 
                className="mt-3 text-xs text-muted-foreground tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.0 }}
              >
                Available 24/7
              </motion.p>
            </motion.div>
          </motion.div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}