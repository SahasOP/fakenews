"use client"

import { useState, useRef, useEffect } from "react"
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { HistoryItem as HistoryItemType } from "@/types/analysis"

interface HistoryItemProps {
  item: HistoryItemType
}

export function HistoryItem({ item }: HistoryItemProps) {
  const { text, prediction, confidence_percentage, timestamp } = item
  const isFake = prediction === "Fake"
  const confidencePercent = confidence_percentage
  const itemRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  // Format the timestamp
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(timestamp)

  // GSAP hover animation
  useEffect(() => {
    if (itemRef.current) {
      itemRef.current.addEventListener("mouseenter", () => {
        gsap.to(itemRef.current, {
          scale: 1.02,
          duration: 0.2,
          ease: "power1.out",
        })
      })

      itemRef.current.addEventListener("mouseleave", () => {
        gsap.to(itemRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power1.out",
        })
      })
    }
  }, [])

  // Toggle expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)

    if (!isExpanded) {
      gsap.to(itemRef.current, {
        height: "auto",
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(itemRef.current, {
        height: "auto",
        duration: 0.3,
        ease: "power2.in",
      })
    }
  }

  return (
    <div
      ref={itemRef}
      className={`p-3 rounded-md border ${
        isFake
          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
          : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
      } transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {isFake ? (
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
          )}
          <span
            className={`text-sm font-medium ${isFake ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}
          >
            {prediction} ({Math.round(confidencePercent)}%)
          </span>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{formattedTime}</span>
      </div>

      <p className={`mt-1 text-sm text-gray-700 dark:text-gray-300 ${isExpanded ? "" : "line-clamp-2"}`}>{text}</p>

      {text.length > 60 && (
        <Button variant="ghost" size="sm" className="text-xs mt-1 h-6 px-2" onClick={toggleExpand}>
          <Info className="h-3 w-3 mr-1" />
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  )
}
