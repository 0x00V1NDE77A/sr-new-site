"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CustomSwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
}

const CustomSwitch = React.forwardRef<HTMLButtonElement, CustomSwitchProps>(
  ({ checked = false, onCheckedChange, disabled = false, className, id, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(checked)
    const lastCheckedRef = React.useRef(checked)
    const onCheckedChangeRef = React.useRef(onCheckedChange)

    // Keep refs in sync
    React.useEffect(() => {
      onCheckedChangeRef.current = onCheckedChange
    }, [onCheckedChange])

    // Only update internal state if checked prop actually changed
    React.useEffect(() => {
      if (lastCheckedRef.current !== checked) {
        lastCheckedRef.current = checked
        setInternalChecked(checked)
      }
    }, [checked])

    const handleClick = React.useCallback(() => {
      if (disabled) return
      
      const newChecked = !internalChecked
      setInternalChecked(newChecked)
      
      // Call the external handler after a small delay to prevent loops
      if (onCheckedChangeRef.current) {
        setTimeout(() => {
          onCheckedChangeRef.current!(newChecked)
        }, 0)
      }
    }, [internalChecked, disabled])

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="switch"
        aria-checked={internalChecked}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "peer inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          internalChecked 
            ? "bg-primary shadow-xs" 
            : "bg-input shadow-xs",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background ring-0 transition-transform",
            internalChecked ? "translate-x-[calc(100%-2px)]" : "translate-x-0"
          )}
        />
      </button>
    )
  }
)

CustomSwitch.displayName = "CustomSwitch"

export { CustomSwitch }
