"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, AlertTriangle, CheckCircle } from 'lucide-react'
import { gsap } from "gsap"

interface NewsFormProps {
  onSubmit: (headline: string) => void
  isLoading: boolean
}

export function NewsForm({ onSubmit, isLoading }: NewsFormProps) {
  const [headline, setHeadline] = useState("")
  const [liveAnalysis, setLiveAnalysis] = useState<{ isFake: boolean; confidence: number } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // GSAP animation for the form
  useEffect(() => {
    if (formRef.current) {
      gsap.from(formRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      })
    }
  }, [])

  // Simulate live analysis as user types
  useEffect(() => {
    if (headline.length > 10) {
      const timer = setTimeout(() => {
        // This is just a simulation - in a real app, you'd call an API
        const hasRedFlags =
          /shocking|truth|secret|conspiracy|revealed|exposed|they don't want you to know|miracle|breakthrough/i.test(
            headline,
          )
        const confidence = hasRedFlags ? 0.7 + Math.random() * 0.25 : 0.2 + Math.random() * 0.3

        setLiveAnalysis({
          isFake: hasRedFlags,
          confidence: confidence,
        })

        // Animate the live analysis indicator
        gsap.fromTo(
          ".live-indicator",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, ease: "back.out" },
        )
      }, 500)

      return () => clearTimeout(timer)
    } else {
      setLiveAnalysis(null)
    }
  }, [headline])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (headline.trim() && !isLoading) {
      // Animate button press
      gsap.to(".submit-button", {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      })

      onSubmit(headline)
    }
  }

  const handleFocus = () => {
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.3)",
        duration: 0.3,
      })
    }
  }

  const handleBlur = () => {
    if (inputRef.current) {
      gsap.to(inputRef.current, {
        boxShadow: "none",
        duration: 0.3,
      })
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter a news headline
        </label>
        <div className="relative">
          <Input
            ref={inputRef}
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Enter a news headline to analyze..."
            className="w-full pl-10 pr-10 transition-all duration-300"
            disabled={isLoading}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

          {liveAnalysis && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 live-indicator">
              {liveAnalysis.isFake ? (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
          )}
        </div>

        {liveAnalysis && (
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            {liveAnalysis.isFake
              ? "This headline contains potential red flags..."
              : "This headline appears more credible..."}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 submit-button"
        disabled={!headline.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Headline"
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Powered by advanced AI and machine learning algorithms
      </p>
    </form>
  )
}
