"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { gsap } from "gsap"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"

    // Animate theme change
    gsap.to(".theme-toggle-icon", {
      rotate: 360,
      duration: 0.5,
      ease: "back.out(1.7)",
    })

    setTheme(newTheme)
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled className="w-10 h-10 rounded-full">
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700"
      aria-label="Toggle theme"
    >
      <div className="theme-toggle-icon">
        {theme === "dark" ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-purple-700" />}
      </div>
    </Button>
  )
}
