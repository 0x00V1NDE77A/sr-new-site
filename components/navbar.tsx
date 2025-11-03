"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ChevronRight } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNavbar, setShowNavbar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const links = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Team", href: "/team" },
    { name: "Contact", href: "/contact" },
    { name: "Blogs", href: "/blogs" },
  ]

  // Hide/show navbar on scroll
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          if (currentScrollY > lastScrollY && currentScrollY > 60) {
            setShowNavbar(false)
          } else {
            setShowNavbar(true)
          }
          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Handle portal mounting for mobile menu
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full bg-black text-white py-4 transition-transform duration-500 z-40 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 mx-auto max-w-7xl">
        {/* Logo (larger without changing navbar height) */}
        <Link href="/" className="flex items-center">
          <div className="origin-left transform scale-125">
            <Image
              src="/logo.png"
              alt="SR Logo"
              width={45}
              height={45}
              className="object-contain"
            />
          </div>
        </Link>

        {/* Centered Nav Links (Desktop) */}
        <ul className="hidden md:flex gap-10 text-[15px] font-semibold justify-center w-full">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="transition-colors duration-200 hover:text-gray-400"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="text-white md:hidden focus:outline-none"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Mobile Drawer - Rendered via Portal */}
      {isOpen && mounted ? createPortal(
        <div 
          className="fixed inset-0 flex flex-col"
          style={{ 
            backgroundColor: '#000000',
            zIndex: 9999,
            opacity: 1
          }}
        >
          {/* Header with Logo and Close Button */}
          <div className="flex items-center justify-between px-6 pt-6 pb-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="origin-left transform scale-125">
                <Image
                  src="/logo.png"
                  alt="SR Logo"
                  width={45}
                  height={45}
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-white"></span>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white transition hover:text-gray-300 focus:outline-none"
            >
              <X size={28} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-6 pt-4">
            <ul className="w-full space-y-0">
              {links.map((link, index) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-4 text-base font-semibold text-white transition-colors hover:text-gray-300"
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={18} className="text-white" />
                  </Link>
                  {index < links.length - 1 && (
                    <hr className="border-gray-600" />
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Section */}
          <div className="px-6 pb-8 space-y-3">
            <button className="w-full py-3 font-medium text-black transition-colors bg-white rounded-md hover:bg-gray-200">
              Contact a Specialist
            </button>
            <p className="text-xs text-center text-gray-400">Available 24/7</p>
          </div>
        </div>,
        document.body
      ) : null}
    </nav>
  )
}
