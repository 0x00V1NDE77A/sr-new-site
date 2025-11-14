"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface GlowingEffectProps {
  spread?: number
  proximity?: number
  variant?: "default" | "primary" | "secondary"
  disabled?: boolean
  blur?: number
  borderWidth?: number
  className?: string
}

export function GlowingEffect({
  spread = 60,
  proximity = 40,
  variant = "default",
  disabled = false,
  blur = 0,
  borderWidth = 1,
  className,
}: GlowingEffectProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [isSafari, setIsSafari] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
  }, [])

  useEffect(() => {
    if (!divRef.current || disabled) return

    const div = divRef.current
    const parent = div.parentElement
    if (!parent) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if mouse is within proximity
      const isNearEdge =
        x < proximity ||
        y < proximity ||
        x > rect.width - proximity ||
        y > rect.height - proximity

      setIsHovered(isNearEdge)

      div.style.setProperty("--x", `${x}px`)
      div.style.setProperty("--y", `${y}px`)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }

    parent.addEventListener("mousemove", handleMouseMove)
    parent.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove)
      parent.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [proximity, disabled])

  if (disabled) return null

  const variantColors = {
    default: "rgba(0, 0, 0, 0.5)",
    primary: "rgba(59, 130, 246, 0.5)",
    secondary: "rgba(168, 85, 247, 0.5)",
  }

  return (
    <div
      ref={divRef}
      className={cn(
        "pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500",
        isHovered && "opacity-100",
        className
      )}
      style={
        {
          background: `radial-gradient(${spread}px circle at var(--x, 0) var(--y, 0), ${variantColors[variant]}, transparent)`,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          border: `${borderWidth}px solid transparent`,
        } as React.CSSProperties
      }
    />
  )
}

